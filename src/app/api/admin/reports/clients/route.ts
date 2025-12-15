import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { ApiResponse, ClientActivityData, TopClientItem, ChartDataPoint, TimeSeriesDataPoint } from "@/types";
import { getDateRangeFromPreset, formatDateForChart, getOptimalGrouping, fillMissingDates, getOrderPrice } from "@/lib/report-utils";
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

    // Get all registered users (clients)
    const allUsers = await prisma.app_users.findMany({
      where: { role: "client" },
      select: {
        id: true,
        email: true,
        first_name: true,
        last_name: true,
        created_at: true,
      },
    });

    // Get orders in date range
    const ordersInRange = await prisma.uzkl_ivertink1P.findMany({
      where: {
        created_at: {
          gte: dateFrom,
          lte: dateTo,
        },
      },
      select: {
        id: true,
        contact_email: true,
        contact_name: true,
        service_type: true,
        service_price: true,
        status: true,
        is_enough_data_for_ai: true,
        created_at: true,
      },
    });

    // Calculate total clients
    const totalClients = allUsers.length;

    // Get unique client emails that have orders in range
    const activeClientEmails = new Set(ordersInRange.map((o) => o.contact_email?.toLowerCase()));
    const activeClients = activeClientEmails.size;

    // Calculate new clients this month
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const newThisMonth = allUsers.filter(
      (u) => u.created_at && new Date(u.created_at) >= monthStart
    ).length;

    // Registration timeline (users registered in date range)
    const groupBy = getOptimalGrouping(dateFrom, dateTo);
    const usersInRange = allUsers.filter(
      (u) => u.created_at && new Date(u.created_at) >= dateFrom && new Date(u.created_at) <= dateTo
    );

    const registrationByDate: Record<string, number> = {};
    usersInRange.forEach((user) => {
      if (!user.created_at) return;
      const key = formatDateForChart(new Date(user.created_at), groupBy);
      registrationByDate[key] = (registrationByDate[key] || 0) + 1;
    });

    const registrationTimeline: TimeSeriesDataPoint[] = Object.entries(registrationByDate)
      .map(([date, value]) => ({ date, value }))
      .sort((a, b) => a.date.localeCompare(b.date));

    // Fill missing dates
    const filledRegistrationTimeline = fillMissingDates(registrationTimeline, dateFrom, dateTo, groupBy);

    // Activity distribution (how many orders per client)
    const orderCountByClient: Record<string, number> = {};
    ordersInRange.forEach((order) => {
      const email = order.contact_email?.toLowerCase() || "unknown";
      orderCountByClient[email] = (orderCountByClient[email] || 0) + 1;
    });

    // Create distribution buckets
    const distribution: Record<string, number> = {
      "1 užsakymas": 0,
      "2-3 užsakymai": 0,
      "4-5 užsakymai": 0,
      "6-10 užsakymų": 0,
      "11+ užsakymų": 0,
    };

    Object.values(orderCountByClient).forEach((count) => {
      if (count === 1) distribution["1 užsakymas"]++;
      else if (count <= 3) distribution["2-3 užsakymai"]++;
      else if (count <= 5) distribution["4-5 užsakymai"]++;
      else if (count <= 10) distribution["6-10 užsakymų"]++;
      else distribution["11+ užsakymų"]++;
    });

    const activityDistribution: ChartDataPoint[] = Object.entries(distribution)
      .filter(([, value]) => value > 0)
      .map(([name, value]) => ({ name, value }));

    // Top clients by orders and spending
    const clientStats: Record<string, { email: string; name: string; ordersCount: number; totalSpent: number }> = {};

    ordersInRange.forEach((order) => {
      const email = order.contact_email?.toLowerCase() || "unknown";
      if (!clientStats[email]) {
        clientStats[email] = {
          email: order.contact_email || "unknown",
          name: order.contact_name || "Nežinomas",
          ordersCount: 0,
          totalSpent: 0,
        };
      }
      clientStats[email].ordersCount++;

      // Calculate price for completed/paid orders
      const isPaidOrDone = order.status === "paid" || order.status === "done" ||
        (order.service_type === "TYPE_1" && order.is_enough_data_for_ai);
      if (isPaidOrDone) {
        clientStats[email].totalSpent += getOrderPrice(order.service_type, order.service_price);
      }
    });

    // Sort by orders count and take top 10
    const topClients: TopClientItem[] = Object.entries(clientStats)
      .map(([, stats], index) => ({
        id: index + 1,
        email: stats.email,
        name: stats.name,
        ordersCount: stats.ordersCount,
        totalSpent: stats.totalSpent,
      }))
      .sort((a, b) => b.ordersCount - a.ordersCount)
      .slice(0, 10);

    const data: ClientActivityData = {
      totalClients,
      activeClients,
      newThisMonth,
      registrationTimeline: filledRegistrationTimeline,
      activityDistribution,
      topClients,
    };

    return NextResponse.json<ApiResponse<ClientActivityData>>({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Failed to fetch client activity stats:", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Nepavyko gauti klientų aktyvumo duomenų" },
      { status: 500 }
    );
  }
}
