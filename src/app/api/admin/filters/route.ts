import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import type { ApiResponse } from "@/types";

interface FiltersResponse {
  municipalities: string[];
  cities: { municipality: string; cities: string[] }[];
  propertyTypes: string[];
  serviceTypes: string[];
}

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

    // Get unique municipalities
    const municipalitiesResult = await prisma.uzkl_ivertink1P.findMany({
      where: {
        address_municipality: { not: null },
      },
      select: {
        address_municipality: true,
      },
      distinct: ["address_municipality"],
      orderBy: { address_municipality: "asc" },
    });

    const municipalities = municipalitiesResult
      .map((r) => r.address_municipality)
      .filter((m): m is string => m !== null);

    // Get cities grouped by municipality
    const citiesResult = await prisma.uzkl_ivertink1P.findMany({
      where: {
        address_city: { not: null },
        address_municipality: { not: null },
      },
      select: {
        address_municipality: true,
        address_city: true,
      },
      distinct: ["address_municipality", "address_city"],
      orderBy: [{ address_municipality: "asc" }, { address_city: "asc" }],
    });

    // Group cities by municipality
    const citiesByMunicipality: Record<string, Set<string>> = {};
    citiesResult.forEach((r) => {
      if (r.address_municipality && r.address_city) {
        if (!citiesByMunicipality[r.address_municipality]) {
          citiesByMunicipality[r.address_municipality] = new Set();
        }
        citiesByMunicipality[r.address_municipality].add(r.address_city);
      }
    });

    const cities = Object.entries(citiesByMunicipality).map(([municipality, citySet]) => ({
      municipality,
      cities: Array.from(citySet).sort(),
    }));

    // Get unique property types
    const propertyTypesResult = await prisma.uzkl_ivertink1P.findMany({
      where: {
        main_property_type: { not: null },
      },
      select: {
        main_property_type: true,
      },
      distinct: ["main_property_type"],
    });

    const propertyTypes = propertyTypesResult
      .map((r) => r.main_property_type)
      .filter((t): t is string => t !== null)
      .sort();

    // Service types are static
    const serviceTypes = ["TYPE_1", "TYPE_2", "TYPE_3", "TYPE_4"];

    return NextResponse.json<ApiResponse<FiltersResponse>>({
      success: true,
      data: {
        municipalities,
        cities,
        propertyTypes,
        serviceTypes,
      },
    });
  } catch (error) {
    console.error("Admin filters fetch error:", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Klaida gaunant filtrus" },
      { status: 500 }
    );
  }
}
