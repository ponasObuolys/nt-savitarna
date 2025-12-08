import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import type { ApiResponse, Order } from "@/types";

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

    // Get query params for filtering
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get("status");
    const search = searchParams.get("search");
    const limit = parseInt(searchParams.get("limit") || "100");
    const offset = parseInt(searchParams.get("offset") || "0");

    // Build where clause
    const where: Record<string, unknown> = {};

    if (status && status !== "all") {
      if (status === "completed") {
        where.is_enough_data_for_ai = true;
        where.service_type = "TYPE_1";
      } else if (status === "paid") {
        where.status = "paid";
      } else if (status === "pending") {
        where.OR = [
          { status: null },
          { status: { not: "paid" } },
        ];
      }
    }

    if (search) {
      where.OR = [
        { contact_email: { contains: search } },
        { token: { contains: search } },
        { contact_name: { contains: search } },
      ];
    }

    // Fetch orders
    const [orders, total] = await Promise.all([
      prisma.uzkl_ivertink1P.findMany({
        where,
        orderBy: { created_at: "desc" },
        take: limit,
        skip: offset,
      }),
      prisma.uzkl_ivertink1P.count({ where }),
    ]);

    return NextResponse.json<ApiResponse<{ orders: Order[]; total: number }>>({
      success: true,
      data: { orders, total },
    });
  } catch (error) {
    console.error("Admin orders fetch error:", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Klaida gaunant užsakymus" },
      { status: 500 }
    );
  }
}
