import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import type { ApiResponse, Order } from "@/types";
import { Prisma } from "@/generated/prisma/client";

interface OrdersResponse {
  orders: Order[];
  total: number;
  page: number;
  pageSize: number;
}

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

    // Get query params
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get("search") || "";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const pageSize = 50;
    const offset = (page - 1) * pageSize;

    // Filter params
    const dateFrom = searchParams.get("dateFrom");
    const dateTo = searchParams.get("dateTo");
    const statusParam = searchParams.get("status"); // comma-separated
    const serviceTypeParam = searchParams.get("serviceType"); // comma-separated
    const municipality = searchParams.get("municipality");
    const city = searchParams.get("city");
    const propertyType = searchParams.get("propertyType");

    // Build where clause
    const conditions: Prisma.uzkl_ivertink1PWhereInput[] = [];

    // Search filter (token, contact_email, contact_name, address)
    if (search.trim()) {
      conditions.push({
        OR: [
          { token: { contains: search } },
          { contact_email: { contains: search } },
          { contact_name: { contains: search } },
          { address_street: { contains: search } },
          { address_city: { contains: search } },
        ],
      });
    }

    // Date range filter
    if (dateFrom) {
      const fromDate = new Date(dateFrom);
      fromDate.setHours(0, 0, 0, 0);
      conditions.push({
        created_at: { gte: fromDate },
      });
    }

    if (dateTo) {
      const toDate = new Date(dateTo);
      toDate.setHours(23, 59, 59, 999);
      conditions.push({
        created_at: { lte: toDate },
      });
    }

    // Status filter (supports multiple values)
    if (statusParam) {
      const statuses = statusParam.split(",").filter(Boolean);
      if (statuses.length > 0) {
        const statusConditions: Prisma.uzkl_ivertink1PWhereInput[] = [];

        statuses.forEach((s) => {
          if (s === "pending") {
            statusConditions.push({
              OR: [
                { status: null },
                { status: { notIn: ["paid", "done", "failed"] } },
              ],
            });
          } else if (s === "paid") {
            statusConditions.push({ status: "paid" });
          } else if (s === "done") {
            // Done = service_type 1 with AI data OR status = done
            statusConditions.push({
              OR: [
                {
                  AND: [
                    { service_type: "TYPE_1" },
                    { is_enough_data_for_ai: true },
                  ],
                },
                { status: "done" },
              ],
            });
          } else if (s === "failed") {
            statusConditions.push({ status: "failed" });
          }
        });

        if (statusConditions.length > 0) {
          conditions.push({ OR: statusConditions });
        }
      }
    }

    // Service type filter (supports multiple values)
    if (serviceTypeParam) {
      const serviceTypes = serviceTypeParam.split(",").filter(Boolean);
      if (serviceTypes.length > 0) {
        conditions.push({
          service_type: {
            in: serviceTypes as ("TYPE_1" | "TYPE_2" | "TYPE_3" | "TYPE_4")[],
          },
        });
      }
    }

    // Municipality filter
    if (municipality) {
      conditions.push({
        address_municipality: municipality,
      });
    }

    // City filter
    if (city) {
      conditions.push({
        address_city: city,
      });
    }

    // Property type filter
    if (propertyType) {
      conditions.push({
        main_property_type: { contains: propertyType },
      });
    }

    // Combine all conditions
    const where: Prisma.uzkl_ivertink1PWhereInput =
      conditions.length > 0 ? { AND: conditions } : {};

    // Fetch orders with pagination
    const [orders, total] = await Promise.all([
      prisma.uzkl_ivertink1P.findMany({
        where,
        orderBy: { created_at: "desc" },
        take: pageSize,
        skip: offset,
      }),
      prisma.uzkl_ivertink1P.count({ where }),
    ]);

    return NextResponse.json<ApiResponse<OrdersResponse>>({
      success: true,
      data: {
        orders: orders as unknown as Order[],
        total,
        page,
        pageSize,
      },
    });
  } catch (error) {
    console.error("Admin orders fetch error:", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Klaida gaunant užsakymus" },
      { status: 500 }
    );
  }
}
