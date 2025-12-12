import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { ApiResponse, GeographyStatsData } from "@/types";
import { getDateRangeFromPreset, groupAndCount } from "@/lib/report-utils";
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

    // Get orders in date range with location data
    const orders = await prisma.uzkl_ivertink1P.findMany({
      where: {
        created_at: {
          gte: dateFrom,
          lte: dateTo,
        },
      },
      select: {
        id: true,
        address_municipality: true,
        address_city: true,
      },
    });

    // Group by municipality
    const byMunicipality = groupAndCount(orders, (order) =>
      order.address_municipality || "Nenurodyta"
    ).slice(0, 15); // Top 15

    // Group by city
    const byCity = groupAndCount(orders, (order) =>
      order.address_city || "Nenurodyta"
    ).slice(0, 20); // Top 20

    // Calculate unique locations
    const municipalities = new Set(
      orders.map((o) => o.address_municipality).filter(Boolean)
    );
    const cities = new Set(orders.map((o) => o.address_city).filter(Boolean));
    const totalLocations = municipalities.size + cities.size;

    const data: GeographyStatsData = {
      byMunicipality,
      byCity,
      totalLocations,
    };

    return NextResponse.json<ApiResponse<GeographyStatsData>>({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Failed to fetch geography stats:", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Nepavyko gauti geografinės statistikos" },
      { status: 500 }
    );
  }
}
