import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { getServiceInfo, getOrderDisplayStatus } from "@/lib/constants";
import type { ApiResponse, DashboardStats, Order } from "@/types";

export async function GET() {
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

    // Get current month range
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    // Fetch all orders and this month's orders
    const [allOrders, monthlyOrders] = await Promise.all([
      prisma.uzkl_ivertink1P.findMany(),
      prisma.uzkl_ivertink1P.findMany({
        where: {
          created_at: {
            gte: startOfMonth,
            lte: endOfMonth,
          },
        },
      }),
    ]);

    // Calculate stats
    let completedOrders = 0;
    let pendingOrders = 0;
    let monthlyRevenue = 0;

    allOrders.forEach((order: Order) => {
      const status = getOrderDisplayStatus(
        order.service_type,
        order.is_enough_data_for_ai,
        order.status
      );

      if (status === "completed") {
        completedOrders++;
      } else if (status === "pending") {
        pendingOrders++;
      }
    });

    monthlyOrders.forEach((order: Order) => {
      const status = getOrderDisplayStatus(
        order.service_type,
        order.is_enough_data_for_ai,
        order.status
      );

      // Only count paid or completed orders for revenue
      if (status === "completed" || status === "paid") {
        const serviceInfo = getServiceInfo(order.service_type);
        const servicePrice = order.service_price ?? serviceInfo.price;
        monthlyRevenue += servicePrice;
      }
    });

    const stats: DashboardStats = {
      totalOrders: allOrders.length,
      monthlyOrders: monthlyOrders.length,
      monthlyRevenue,
      completedOrders,
      pendingOrders,
    };

    return NextResponse.json<ApiResponse<DashboardStats>>({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error("Admin stats fetch error:", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Klaida gaunant statistiką" },
      { status: 500 }
    );
  }
}
