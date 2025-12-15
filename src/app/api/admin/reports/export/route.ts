import { NextRequest, NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type {
  ApiResponse,
  DateFilter,
  OrdersStatsData,
  RevenueStatsData,
  ValuatorWorkloadData,
  ClientActivityData,
  GeographyStatsData,
  ChartDataPoint,
  TimeSeriesDataPoint,
  ValuatorRankingItem,
  TopClientItem,
  MultiSeriesDataPoint,
} from "@/types";
import {
  getDateRange,
  groupAndCount,
  groupByDateAndCount,
  getOptimalGrouping,
  fillMissingDates,
  formatDateForChart,
  getOrderPrice,
} from "@/lib/report-utils";
import {
  exportOrdersToCSV,
  exportRevenueToCSV,
  exportValuatorsToCSV,
  exportClientsToCSV,
  exportGeographyToCSV,
  generateExportFilename,
} from "@/lib/export/csv-export";
import {
  generateOrdersPDF,
  generateRevenuePDF,
  generateValuatorsPDF,
  generateClientsPDF,
  generateGeographyPDF,
} from "@/lib/export/pdf-export";

// Max records limit
const MAX_EXPORT_RECORDS = 10000;

// Service type labels
const SERVICE_TYPE_LABELS: Record<string, string> = {
  TYPE_1: "Automatinis vertinimas",
  TYPE_2: "Vertintojo nustatymas",
  TYPE_3: "Kainos patikslinimas",
  TYPE_4: "Turto vertinimas",
};

// Status labels
const STATUS_LABELS: Record<string, string> = {
  pending: "Laukiama",
  paid: "Apmokėta",
  done: "Atlikta",
  failed: "Nepavyko",
};

interface ExportRequestBody {
  reportType: "orders" | "revenue" | "valuators" | "clients" | "geography";
  format: "csv" | "pdf";
  filter: {
    preset: string;
    dateFrom: string | null;
    dateTo: string | null;
  };
}

export async function POST(request: NextRequest) {
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

    const body: ExportRequestBody = await request.json();
    const { reportType, format, filter } = body;

    // Validate report type
    const validReportTypes = ["orders", "revenue", "valuators", "clients", "geography"];
    if (!validReportTypes.includes(reportType)) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Neteisingas ataskaitos tipas" },
        { status: 400 }
      );
    }

    // Validate format
    if (!["csv", "pdf"].includes(format)) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Neteisingas formatas" },
        { status: 400 }
      );
    }

    // Parse date filter
    const dateFilter: DateFilter = {
      preset: (filter.preset || "month") as DateFilter["preset"],
      dateFrom: filter.dateFrom ? new Date(filter.dateFrom) : null,
      dateTo: filter.dateTo ? new Date(filter.dateTo) : null,
    };

    const { dateFrom, dateTo } = getDateRange(dateFilter);

    // Generate report data based on type
    let data: OrdersStatsData | RevenueStatsData | ValuatorWorkloadData | ClientActivityData | GeographyStatsData;

    switch (reportType) {
      case "orders":
        data = await fetchOrdersData(dateFrom, dateTo);
        break;
      case "revenue":
        data = await fetchRevenueData(dateFrom, dateTo);
        break;
      case "valuators":
        data = await fetchValuatorsData(dateFrom, dateTo);
        break;
      case "clients":
        data = await fetchClientsData(dateFrom, dateTo);
        break;
      case "geography":
        data = await fetchGeographyData(dateFrom, dateTo);
        break;
    }

    // Generate filename
    const filename = generateExportFilename(reportType, format, dateFilter);

    // Generate export content based on format
    if (format === "csv") {
      let csvContent: string;
      switch (reportType) {
        case "orders":
          csvContent = exportOrdersToCSV(data as OrdersStatsData, dateFilter);
          break;
        case "revenue":
          csvContent = exportRevenueToCSV(data as RevenueStatsData, dateFilter);
          break;
        case "valuators":
          csvContent = exportValuatorsToCSV(data as ValuatorWorkloadData, dateFilter);
          break;
        case "clients":
          csvContent = exportClientsToCSV(data as ClientActivityData, dateFilter);
          break;
        case "geography":
          csvContent = exportGeographyToCSV(data as GeographyStatsData, dateFilter);
          break;
        default:
          csvContent = "";
      }

      return new NextResponse(csvContent, {
        status: 200,
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="${filename}"`,
        },
      });
    } else {
      // PDF format
      let pdfDocument;
      switch (reportType) {
        case "orders":
          pdfDocument = generateOrdersPDF(data as OrdersStatsData, dateFilter);
          break;
        case "revenue":
          pdfDocument = generateRevenuePDF(data as RevenueStatsData, dateFilter);
          break;
        case "valuators":
          pdfDocument = generateValuatorsPDF(data as ValuatorWorkloadData, dateFilter);
          break;
        case "clients":
          pdfDocument = generateClientsPDF(data as ClientActivityData, dateFilter);
          break;
        case "geography":
          pdfDocument = generateGeographyPDF(data as GeographyStatsData, dateFilter);
          break;
      }

      const pdfBuffer = await renderToBuffer(pdfDocument);
      const pdfUint8Array = new Uint8Array(pdfBuffer);

      return new NextResponse(pdfUint8Array, {
        status: 200,
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="${filename}"`,
        },
      });
    }
  } catch (error) {
    console.error("Export error:", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Eksporto klaida" },
      { status: 500 }
    );
  }
}

// Data fetching functions (reusing logic from individual report endpoints)

async function fetchOrdersData(dateFrom: Date, dateTo: Date): Promise<OrdersStatsData> {
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
    take: MAX_EXPORT_RECORDS,
  });

  const total = orders.length;

  const byStatus: ChartDataPoint[] = groupAndCount(orders, (order) => {
    if (order.service_type === "TYPE_1" && order.is_enough_data_for_ai) {
      return "done";
    }
    return order.status || "pending";
  }).map((item) => ({
    ...item,
    name: STATUS_LABELS[item.name] || item.name,
  }));

  const byServiceType: ChartDataPoint[] = groupAndCount(orders, (order) => {
    return order.service_type || "unknown";
  }).map((item) => ({
    ...item,
    name: SERVICE_TYPE_LABELS[item.name] || item.name,
  }));

  const byPropertyType: ChartDataPoint[] = groupAndCount(orders, (order) => {
    return order.main_property_type || "Nenurodyta";
  }).slice(0, 10);

  const byMunicipality: ChartDataPoint[] = groupAndCount(orders, (order) => {
    return order.address_municipality || "Nenurodyta";
  }).slice(0, 10);

  const groupBy = getOptimalGrouping(dateFrom, dateTo);
  const rawTimeline = groupByDateAndCount(orders, (order) => order.created_at, groupBy);
  const timeline: TimeSeriesDataPoint[] = fillMissingDates(rawTimeline, dateFrom, dateTo, groupBy);

  return {
    total,
    byStatus,
    byServiceType,
    byPropertyType,
    byMunicipality,
    timeline,
  };
}

async function fetchRevenueData(dateFrom: Date, dateTo: Date): Promise<RevenueStatsData> {
  const orders = await prisma.uzkl_ivertink1P.findMany({
    where: {
      created_at: {
        gte: dateFrom,
        lte: dateTo,
      },
      OR: [
        { status: "paid" },
        { status: "done" },
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
    take: MAX_EXPORT_RECORDS,
  });

  const ordersWithRevenue = orders.map((order) => ({
    ...order,
    revenue: getOrderPrice(order.service_type, order.service_price),
  }));

  const totalRevenue = ordersWithRevenue.reduce((sum, order) => sum + order.revenue, 0);
  const averageOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;

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

  const daysPassed = Math.ceil((new Date().getTime() - dateFrom.getTime()) / (1000 * 60 * 60 * 24));
  const dailyRate = daysPassed > 0 ? totalRevenue / daysPassed : 0;
  const projectedRevenue = dailyRate * 30;

  return {
    totalRevenue,
    averageOrderValue,
    projectedRevenue,
    byServiceType,
    timeline,
  };
}

async function fetchValuatorsData(dateFrom: Date, dateTo: Date): Promise<ValuatorWorkloadData> {
  const valuators = await prisma.app_valuators.findMany({
    where: { is_active: true },
    orderBy: { first_name: "asc" },
  });

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
    take: MAX_EXPORT_RECORDS,
  });

  const isCompleted = (order: { status: string | null; service_type: string | null; is_enough_data_for_ai: boolean | null }) => {
    if (order.service_type === "TYPE_1" && order.is_enough_data_for_ai) return true;
    return order.status === "done";
  };

  const isInProgress = (order: { status: string | null; service_type: string | null; is_enough_data_for_ai: boolean | null }) => {
    return order.status === "paid" && !isCompleted(order);
  };

  const ordersByValuator: Record<string, typeof orders> = {};
  orders.forEach((order) => {
    const code = order.priskirta || "unknown";
    if (!ordersByValuator[code]) {
      ordersByValuator[code] = [];
    }
    ordersByValuator[code].push(order);
  });

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

  byValuator.sort((a, b) => b.value - a.value);
  ranking.sort((a, b) => b.totalOrders - a.totalOrders);

  const totalAssigned = orders.length;
  const activeValuatorsCount = byValuator.filter((v) => v.value > 0).length;
  const averagePerValuator = activeValuatorsCount > 0 ? Math.round(totalAssigned / activeValuatorsCount) : 0;

  const valuatorsWithOrders = byValuator.filter((v) => v.value > 0);
  const mostLoaded = valuatorsWithOrders.length > 0
    ? { name: valuatorsWithOrders[0].name, count: valuatorsWithOrders[0].value }
    : null;
  const leastLoaded = valuatorsWithOrders.length > 0
    ? { name: valuatorsWithOrders[valuatorsWithOrders.length - 1].name, count: valuatorsWithOrders[valuatorsWithOrders.length - 1].value }
    : null;

  // Timeline (simplified - just empty for export)
  const timeline: MultiSeriesDataPoint[] = [];

  return {
    totalAssigned,
    averagePerValuator,
    mostLoaded,
    leastLoaded,
    byValuator: byValuator.slice(0, 15),
    timeline,
    ranking: ranking.slice(0, 10),
  };
}

async function fetchClientsData(dateFrom: Date, dateTo: Date): Promise<ClientActivityData> {
  // Get all unique clients from orders
  const orders = await prisma.uzkl_ivertink1P.findMany({
    where: {
      created_at: {
        gte: dateFrom,
        lte: dateTo,
      },
    },
    select: {
      contact_email: true,
      contact_name: true,
      service_type: true,
      service_price: true,
      created_at: true,
    },
    take: MAX_EXPORT_RECORDS,
  });

  // Group by email to get unique clients
  const clientStats: Record<string, { name: string; ordersCount: number; totalSpent: number; firstOrder: Date }> = {};

  orders.forEach((order) => {
    const email = order.contact_email || "unknown";
    if (!clientStats[email]) {
      clientStats[email] = {
        name: order.contact_name || "Nežinomas",
        ordersCount: 0,
        totalSpent: 0,
        firstOrder: order.created_at || new Date(),
      };
    }
    clientStats[email].ordersCount++;
    clientStats[email].totalSpent += getOrderPrice(order.service_type, order.service_price);
    if (order.created_at && order.created_at < clientStats[email].firstOrder) {
      clientStats[email].firstOrder = order.created_at;
    }
  });

  const totalClients = Object.keys(clientStats).length;
  const activeClients = Object.values(clientStats).filter((c) => c.ordersCount >= 2).length;

  // New this month
  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);
  const newThisMonth = Object.values(clientStats).filter((c) => c.firstOrder >= monthStart).length;

  // Top clients
  const topClients: TopClientItem[] = Object.entries(clientStats)
    .map(([email, stats], index) => ({
      id: index + 1,
      email,
      name: stats.name,
      ordersCount: stats.ordersCount,
      totalSpent: stats.totalSpent,
    }))
    .sort((a, b) => b.ordersCount - a.ordersCount)
    .slice(0, 10);

  // Activity distribution
  const activityBuckets = {
    "1 užsakymas": 0,
    "2-3 užsakymai": 0,
    "4-5 užsakymai": 0,
    "6-10 užsakymų": 0,
    "11+ užsakymų": 0,
  };

  Object.values(clientStats).forEach((c) => {
    if (c.ordersCount === 1) activityBuckets["1 užsakymas"]++;
    else if (c.ordersCount <= 3) activityBuckets["2-3 užsakymai"]++;
    else if (c.ordersCount <= 5) activityBuckets["4-5 užsakymai"]++;
    else if (c.ordersCount <= 10) activityBuckets["6-10 užsakymų"]++;
    else activityBuckets["11+ užsakymų"]++;
  });

  const activityDistribution: ChartDataPoint[] = Object.entries(activityBuckets).map(([name, value]) => ({
    name,
    value,
  }));

  // Registration timeline (simplified)
  const registrationTimeline: TimeSeriesDataPoint[] = [];

  return {
    totalClients,
    activeClients,
    newThisMonth,
    registrationTimeline,
    activityDistribution,
    topClients,
  };
}

async function fetchGeographyData(dateFrom: Date, dateTo: Date): Promise<GeographyStatsData> {
  const orders = await prisma.uzkl_ivertink1P.findMany({
    where: {
      created_at: {
        gte: dateFrom,
        lte: dateTo,
      },
    },
    select: {
      address_municipality: true,
      address_city: true,
    },
    take: MAX_EXPORT_RECORDS,
  });

  const byMunicipality: ChartDataPoint[] = groupAndCount(orders, (order) => {
    return order.address_municipality || "Nenurodyta";
  }).slice(0, 15);

  const byCity: ChartDataPoint[] = groupAndCount(orders, (order) => {
    return order.address_city || "Nenurodyta";
  }).slice(0, 20);

  // Count unique locations
  const uniqueLocations = new Set<string>();
  orders.forEach((order) => {
    if (order.address_municipality && order.address_city) {
      uniqueLocations.add(`${order.address_municipality}-${order.address_city}`);
    }
  });

  return {
    byMunicipality,
    byCity,
    totalLocations: uniqueLocations.size,
  };
}
