import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import type { ApiResponse, RevenueStatsData, DateFilter, ChartDataPoint, TimeSeriesDataPoint } from "@/types";
import {
  getDateRange,
  getOptimalGrouping,
  formatDateForChart,
  fillMissingDates,
  getOrderPrice,
} from "@/lib/report-utils";

// Service type labels for display
const SERVICE_TYPE_LABELS: Record<string, string> = {
  TYPE_1: "Automatinis vertinimas",
  TYPE_2: "Vertintojo nustatymas",
  TYPE_3: "Kainos patikslinimas",
  TYPE_4: "Turto vertinimas",
};

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Neprisijungęs" },
        { status: 401 }
      );
    }

    if (user.role !== "admin") {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Prieiga uždrausta" },
        { status: 403 }
      );
    }

    // Parse date filter from query params
    const searchParams = request.nextUrl.searchParams;
    const preset = searchParams.get("preset") || "month";
    const dateFromParam = searchParams.get("dateFrom");
    const dateToParam = searchParams.get("dateTo");

    const dateFilter: DateFilter = {
      preset: preset as DateFilter["preset"],
      dateFrom: dateFromParam ? new Date(dateFromParam) : null,
      dateTo: dateToParam ? new Date(dateToParam) : null,
    };

    const { dateFrom, dateTo } = getDateRange(dateFilter);

    // Fetch paid/completed orders within date range
    const orders = await prisma.uzkl_ivertink1P.findMany({
      where: {
        created_at: {
          gte: dateFrom,
          lte: dateTo,
        },
        OR: [
          { status: "paid" },
          { status: "done" },
          // TYPE_1 with is_enough_data_for_ai counts as completed
          {
            service_type: "TYPE_1",
            is_enough_data_for_ai: true,
          },
        ],
      },
      select: {
        id: true,
        service_type: true,
        service_price: true,
        created_at: true,
      },
    });

    // Calculate revenue for each order (using service_price, not property value)
    const ordersWithRevenue = orders.map((order) => ({
      ...order,
      revenue: getOrderPrice(order.service_type, order.service_price),
    }));

    // Total revenue
    const totalRevenue = ordersWithRevenue.reduce((sum, order) => sum + order.revenue, 0);

    // Average order value
    const averageOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;

    // Revenue by service type
    const revenueByType: Record<string, number> = {};
    ordersWithRevenue.forEach((order) => {
      const type = order.service_type || "unknown";
      revenueByType[type] = (revenueByType[type] || 0) + order.revenue;
    });

    const byServiceType: ChartDataPoint[] = Object.entries(revenueByType)
      .map(([name, value]) => ({
        name: SERVICE_TYPE_LABELS[name] || name,
        value,
      }))
      .sort((a, b) => b.value - a.value);

    // Timeline - revenue per day/week/month
    const groupBy = getOptimalGrouping(dateFrom, dateTo);
    const revenueByDate: Record<string, number> = {};

    ordersWithRevenue.forEach((order) => {
      if (!order.created_at) return;
      const date = order.created_at instanceof Date ? order.created_at : new Date(order.created_at);
      const key = formatDateForChart(date, groupBy);
      revenueByDate[key] = (revenueByDate[key] || 0) + order.revenue;
    });

    const rawTimeline: TimeSeriesDataPoint[] = Object.entries(revenueByDate)
      .map(([date, value]) => ({ date, value }))
      .sort((a, b) => a.date.localeCompare(b.date));

    const timeline = fillMissingDates(rawTimeline, dateFrom, dateTo, groupBy);

    // Calculate projected revenue (simple linear projection based on current period)
    const daysPassed = Math.ceil((new Date().getTime() - dateFrom.getTime()) / (1000 * 60 * 60 * 24));
    const dailyRate = daysPassed > 0 ? totalRevenue / daysPassed : 0;
    const projectedRevenue = dailyRate * 30; // Project for next 30 days

    const data: RevenueStatsData = {
      totalRevenue,
      averageOrderValue,
      projectedRevenue,
      byServiceType,
      timeline,
    };

    return NextResponse.json<ApiResponse<RevenueStatsData>>({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Revenue stats error:", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Klaida gaunant pajamų statistiką" },
      { status: 500 }
    );
  }
}
