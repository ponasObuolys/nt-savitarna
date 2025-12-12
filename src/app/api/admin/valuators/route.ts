import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import type { ApiResponse, ValuatorWithStats } from "@/types";

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

    // Get search parameter
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get("search")?.trim() || "";

    // Build where clause for search
    const whereClause = search
      ? {
          OR: [
            { code: { contains: search } },
            { first_name: { contains: search } },
            { last_name: { contains: search } },
            { email: { contains: search } },
          ],
        }
      : {};

    // Fetch valuators
    const valuators = await prisma.app_valuators.findMany({
      where: whereClause,
      select: {
        id: true,
        code: true,
        first_name: true,
        last_name: true,
        phone: true,
        email: true,
        is_active: true,
        created_at: true,
      },
      orderBy: [{ is_active: "desc" }, { last_name: "asc" }, { first_name: "asc" }],
    });

    // Get current month start
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    // Fetch statistics for each valuator
    const valuatorsWithStats: ValuatorWithStats[] = await Promise.all(
      valuators.map(async (valuator) => {
        // Get order counts
        const [totalOrders, completedOrders, thisMonthOrders] = await Promise.all([
          // Total orders assigned to this valuator
          prisma.uzkl_ivertink1P.count({
            where: { priskirta: valuator.code },
          }),
          // Completed orders (status = 'done' or TYPE_1 with AI data)
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
          // This month orders
          prisma.uzkl_ivertink1P.count({
            where: {
              priskirta: valuator.code,
              created_at: { gte: monthStart },
            },
          }),
        ]);

        // In progress = total - completed
        const inProgressOrders = totalOrders - completedOrders;

        return {
          ...valuator,
          totalOrders,
          completedOrders,
          inProgressOrders: inProgressOrders > 0 ? inProgressOrders : 0,
          thisMonthOrders,
        } as ValuatorWithStats;
      })
    );

    return NextResponse.json<ApiResponse<{ valuators: ValuatorWithStats[]; total: number }>>({
      success: true,
      data: {
        valuators: valuatorsWithStats,
        total: valuatorsWithStats.length,
      },
    });
  } catch (error) {
    console.error("Admin valuators fetch error:", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Klaida gaunant vertintojus" },
      { status: 500 }
    );
  }
}
