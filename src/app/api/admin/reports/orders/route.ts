import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import type { ApiResponse, OrdersStatsData, DateFilter, ChartDataPoint, TimeSeriesDataPoint } from "@/types";
import {
  getDateRange,
  groupAndCount,
  groupByDateAndCount,
  getOptimalGrouping,
  fillMissingDates,
} from "@/lib/report-utils";

// Service type labels for display
const SERVICE_TYPE_LABELS: Record<string, string> = {
  TYPE_1: "Automatinis vertinimas",
  TYPE_2: "Vertintojo nustatymas",
  TYPE_3: "Kainos patikslinimas",
  TYPE_4: "Turto vertinimas",
};

// Status labels for display
const STATUS_LABELS: Record<string, string> = {
  pending: "Laukiama",
  paid: "Apmokėta",
  done: "Atlikta",
  failed: "Nepavyko",
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

    // Fetch orders within date range
    const orders = await prisma.uzkl_ivertink1P.findMany({
      where: {
        created_at: {
          gte: dateFrom,
          lte: dateTo,
        },
      },
      select: {
        id: true,
        service_type: true,
        status: true,
        main_property_type: true,
        address_municipality: true,
        created_at: true,
        is_enough_data_for_ai: true,
      },
    });

    // Calculate total
    const total = orders.length;

    // Group by status
    const byStatus: ChartDataPoint[] = groupAndCount(orders, (order) => {
      // Determine display status
      if (order.service_type === "TYPE_1" && order.is_enough_data_for_ai) {
        return "done";
      }
      return order.status || "pending";
    }).map((item) => ({
      ...item,
      name: STATUS_LABELS[item.name] || item.name,
    }));

    // Group by service type
    const byServiceType: ChartDataPoint[] = groupAndCount(orders, (order) => {
      return order.service_type || "unknown";
    }).map((item) => ({
      ...item,
      name: SERVICE_TYPE_LABELS[item.name] || item.name,
    }));

    // Group by property type
    const byPropertyType: ChartDataPoint[] = groupAndCount(orders, (order) => {
      return order.main_property_type || "Nenurodyta";
    }).slice(0, 10); // Top 10

    // Group by municipality
    const byMunicipality: ChartDataPoint[] = groupAndCount(orders, (order) => {
      return order.address_municipality || "Nenurodyta";
    }).slice(0, 10); // Top 10

    // Timeline - orders per day/week/month
    const groupBy = getOptimalGrouping(dateFrom, dateTo);
    const rawTimeline = groupByDateAndCount(
      orders,
      (order) => order.created_at,
      groupBy
    );
    const timeline: TimeSeriesDataPoint[] = fillMissingDates(
      rawTimeline,
      dateFrom,
      dateTo,
      groupBy
    );

    const data: OrdersStatsData = {
      total,
      byStatus,
      byServiceType,
      byPropertyType,
      byMunicipality,
      timeline,
    };

    return NextResponse.json<ApiResponse<OrdersStatsData>>({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Orders stats error:", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Klaida gaunant statistiką" },
      { status: 500 }
    );
  }
}
