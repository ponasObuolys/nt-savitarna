import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import type { ApiResponse, ValuatorWithStats, Order, TimeSeriesDataPoint } from "@/types";
import { formatDateForChart, getOptimalGrouping } from "@/lib/report-utils";

interface ValuatorDetailResponse {
  valuator: ValuatorWithStats;
  orders: Order[];
  total: number;
  page: number;
  pageSize: number;
  monthlyStats: TimeSeriesDataPoint[];
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;
    const valuatorId = parseInt(id);

    if (isNaN(valuatorId)) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Netinkamas vertintojo ID" },
        { status: 400 }
      );
    }

    // Fetch valuator
    const valuator = await prisma.app_valuators.findUnique({
      where: { id: valuatorId },
    });

    if (!valuator) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Vertintojas nerastas" },
        { status: 404 }
      );
    }

    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "20");
    const status = searchParams.get("status") || "";
    const dateFrom = searchParams.get("dateFrom");
    const dateTo = searchParams.get("dateTo");

    // Build where clause for orders
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const whereClause: any = {
      priskirta: valuator.code,
    };

    // Status filter
    if (status) {
      if (status === "done") {
        whereClause.OR = [
          { status: "done" },
          {
            AND: [
              { service_type: "TYPE_1" },
              { is_enough_data_for_ai: true },
            ],
          },
        ];
      } else if (status === "in_progress") {
        whereClause.AND = [
          {
            NOT: {
              OR: [
                { status: "done" },
                {
                  AND: [
                    { service_type: "TYPE_1" },
                    { is_enough_data_for_ai: true },
                  ],
                },
              ],
            },
          },
          { status: "paid" },
        ];
      } else if (status === "pending") {
        whereClause.status = { not: "paid" };
        whereClause.NOT = { status: "done" };
      }
    }

    // Date filter
    if (dateFrom) {
      whereClause.created_at = {
        ...whereClause.created_at,
        gte: new Date(dateFrom),
      };
    }
    if (dateTo) {
      const toDate = new Date(dateTo);
      toDate.setHours(23, 59, 59, 999);
      whereClause.created_at = {
        ...whereClause.created_at,
        lte: toDate,
      };
    }

    // Get total count
    const total = await prisma.uzkl_ivertink1P.count({
      where: { priskirta: valuator.code },
    });

    // Fetch orders with pagination
    const orders = await prisma.uzkl_ivertink1P.findMany({
      where: whereClause,
      select: {
        id: true,
        token: true,
        contact_name: true,
        contact_email: true,
        address_municipality: true,
        address_city: true,
        address_street: true,
        address_house_number: true,
        main_property: true,
        main_property_type: true,
        service_type: true,
        is_enough_data_for_ai: true,
        status: true,
        price: true,
        rc_filename: true,
        priskirta: true,
        created_at: true,
      },
      orderBy: { created_at: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    // Get current month start for stats
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    // Calculate statistics
    const [totalOrders, completedOrders, thisMonthOrders] = await Promise.all([
      prisma.uzkl_ivertink1P.count({
        where: { priskirta: valuator.code },
      }),
      prisma.uzkl_ivertink1P.count({
        where: {
          priskirta: valuator.code,
          OR: [
            { status: "done" },
            {
              AND: [
                { service_type: "TYPE_1" },
                { is_enough_data_for_ai: true },
              ],
            },
          ],
        },
      }),
      prisma.uzkl_ivertink1P.count({
        where: {
          priskirta: valuator.code,
          created_at: { gte: monthStart },
        },
      }),
    ]);

    // Get monthly stats for last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyOrders = await prisma.uzkl_ivertink1P.findMany({
      where: {
        priskirta: valuator.code,
        created_at: { gte: sixMonthsAgo },
      },
      select: {
        created_at: true,
      },
    });

    // Group by month
    const groupBy = getOptimalGrouping(sixMonthsAgo, now);
    const monthlyStatsMap: Record<string, number> = {};

    monthlyOrders.forEach((order) => {
      if (order.created_at) {
        const key = formatDateForChart(order.created_at, groupBy);
        monthlyStatsMap[key] = (monthlyStatsMap[key] || 0) + 1;
      }
    });

    const monthlyStats: TimeSeriesDataPoint[] = Object.entries(monthlyStatsMap)
      .map(([date, value]) => ({ date, value }))
      .sort((a, b) => a.date.localeCompare(b.date));

    const inProgressOrders = totalOrders - completedOrders;

    const valuatorWithStats: ValuatorWithStats = {
      ...valuator,
      totalOrders,
      completedOrders,
      inProgressOrders: inProgressOrders > 0 ? inProgressOrders : 0,
      thisMonthOrders,
    };

    return NextResponse.json<ApiResponse<ValuatorDetailResponse>>({
      success: true,
      data: {
        valuator: valuatorWithStats,
        orders: orders as Order[],
        total,
        page,
        pageSize,
        monthlyStats,
      },
    });
  } catch (error) {
    console.error("Valuator detail fetch error:", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Klaida gaunant vertintojo duomenis" },
      { status: 500 }
    );
  }
}
