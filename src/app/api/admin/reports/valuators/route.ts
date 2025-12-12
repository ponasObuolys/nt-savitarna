import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { ApiResponse, ValuatorWorkloadData, ValuatorRankingItem, ChartDataPoint, MultiSeriesDataPoint } from "@/types";
import { getDateRangeFromPreset, formatDateForChart, getOptimalGrouping } from "@/lib/report-utils";
import type { DatePreset } from "@/types";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const preset = (searchParams.get("preset") || "month") as DatePreset;
    const customFrom = searchParams.get("dateFrom");
    const customTo = searchParams.get("dateTo");

    // Calculate date range
    let dateFrom: Date;
    let dateTo: Date;

    if (preset === "custom" && customFrom && customTo) {
      dateFrom = new Date(customFrom);
      dateTo = new Date(customTo);
      dateTo.setHours(23, 59, 59, 999);
    } else {
      const range = getDateRangeFromPreset(preset);
      dateFrom = range.dateFrom;
      dateTo = range.dateTo;
    }

    // Get all valuators
    const valuators = await prisma.app_valuators.findMany({
      where: { is_active: true },
      orderBy: { first_name: "asc" },
    });

    // Get all orders with assigned valuators in date range
    const orders = await prisma.uzkl_ivertink1P.findMany({
      where: {
        created_at: {
          gte: dateFrom,
          lte: dateTo,
        },
        priskirta: {
          not: null,
        },
      },
      select: {
        id: true,
        priskirta: true,
        status: true,
        service_type: true,
        is_enough_data_for_ai: true,
        created_at: true,
      },
    });

    // Helper to check if order is completed
    const isCompleted = (order: { status: string | null; service_type: string | null; is_enough_data_for_ai: boolean | null }) => {
      if (order.service_type === "TYPE_1" && order.is_enough_data_for_ai) return true;
      return order.status === "done";
    };

    // Helper to check if order is in progress
    const isInProgress = (order: { status: string | null; service_type: string | null; is_enough_data_for_ai: boolean | null }) => {
      return order.status === "paid" && !isCompleted(order);
    };

    // Group orders by valuator
    const ordersByValuator: Record<string, typeof orders> = {};
    orders.forEach((order) => {
      const code = order.priskirta || "unknown";
      if (!ordersByValuator[code]) {
        ordersByValuator[code] = [];
      }
      ordersByValuator[code].push(order);
    });

    // Calculate stats per valuator
    const byValuator: ChartDataPoint[] = [];
    const ranking: ValuatorRankingItem[] = [];

    valuators.forEach((valuator) => {
      const valuatorOrders = ordersByValuator[valuator.code] || [];
      const completedOrders = valuatorOrders.filter(isCompleted).length;
      const inProgressOrders = valuatorOrders.filter(isInProgress).length;
      const totalOrders = valuatorOrders.length;

      const name = `${valuator.first_name} ${valuator.last_name}`;

      byValuator.push({
        name,
        value: totalOrders,
      });

      ranking.push({
        id: valuator.id,
        code: valuator.code,
        name,
        completedOrders,
        inProgressOrders,
        totalOrders,
      });
    });

    // Sort byValuator by value descending
    byValuator.sort((a, b) => b.value - a.value);

    // Sort ranking by totalOrders descending
    ranking.sort((a, b) => b.totalOrders - a.totalOrders);

    // Calculate aggregate stats
    const totalAssigned = orders.length;
    const activeValuatorsCount = byValuator.filter((v) => v.value > 0).length;
    const averagePerValuator = activeValuatorsCount > 0 ? Math.round(totalAssigned / activeValuatorsCount) : 0;

    // Find most and least loaded
    const valuatorsWithOrders = byValuator.filter((v) => v.value > 0);
    const mostLoaded = valuatorsWithOrders.length > 0
      ? { name: valuatorsWithOrders[0].name, count: valuatorsWithOrders[0].value }
      : null;
    const leastLoaded = valuatorsWithOrders.length > 0
      ? { name: valuatorsWithOrders[valuatorsWithOrders.length - 1].name, count: valuatorsWithOrders[valuatorsWithOrders.length - 1].value }
      : null;

    // Calculate timeline (stacked area chart data)
    const groupBy = getOptimalGrouping(dateFrom, dateTo);
    const timelineMap: Record<string, Record<string, number>> = {};

    // Initialize timeline dates
    const current = new Date(dateFrom);
    while (current <= dateTo) {
      const key = formatDateForChart(current, groupBy);
      timelineMap[key] = {};
      valuators.forEach((v) => {
        timelineMap[key][v.code] = 0;
      });

      if (groupBy === "month") {
        current.setMonth(current.getMonth() + 1);
      } else if (groupBy === "week") {
        current.setDate(current.getDate() + 7);
      } else {
        current.setDate(current.getDate() + 1);
      }
    }

    // Count orders per date per valuator
    orders.forEach((order) => {
      if (!order.created_at || !order.priskirta) return;
      const key = formatDateForChart(new Date(order.created_at), groupBy);
      if (timelineMap[key] && timelineMap[key][order.priskirta] !== undefined) {
        timelineMap[key][order.priskirta]++;
      }
    });

    // Convert to timeline array
    const timeline: MultiSeriesDataPoint[] = Object.entries(timelineMap)
      .map(([date, valuatorCounts]) => ({
        date,
        ...valuatorCounts,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));

    const data: ValuatorWorkloadData = {
      totalAssigned,
      averagePerValuator,
      mostLoaded,
      leastLoaded,
      byValuator: byValuator.slice(0, 15), // Top 15 valuators
      timeline,
      ranking: ranking.slice(0, 10), // Top 10 for ranking table
    };

    return NextResponse.json<ApiResponse<ValuatorWorkloadData>>({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Failed to fetch valuator workload stats:", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Nepavyko gauti vertintojų apkrovimo duomenų" },
      { status: 500 }
    );
  }
}
