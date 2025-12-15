import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { geocodeAddress } from "@/lib/geocoding";
import type { ApiResponse } from "@/types";

export async function POST(
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
    const orderId = parseInt(id, 10);

    if (isNaN(orderId)) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Neteisingas užsakymo ID" },
        { status: 400 }
      );
    }

    // Fetch order
    const order = await prisma.uzkl_ivertink1P.findUnique({
      where: { id: orderId },
      select: {
        id: true,
        address_street: true,
        address_house_number: true,
        address_city: true,
        address_municipality: true,
      },
    });

    if (!order) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Užsakymas nerastas" },
        { status: 404 }
      );
    }

    // Geocode the address
    const result = await geocodeAddress({
      street: order.address_street,
      houseNumber: order.address_house_number,
      city: order.address_city,
      municipality: order.address_municipality,
    });

    if (!result) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Nepavyko rasti adreso koordinačių" },
        { status: 404 }
      );
    }

    // Update coordinates in database
    // Note: MySQL POINT stores as (X, Y) = (lng, lat) but we store as (lat, lng) for consistency
    await prisma.$executeRaw`
      UPDATE uzkl_ivertink1P 
      SET address_coordinates = POINT(${result.lat}, ${result.lng})
      WHERE id = ${orderId}
    `;

    return NextResponse.json<ApiResponse<{ lat: number; lng: number; displayName: string }>>({
      success: true,
      data: {
        lat: result.lat,
        lng: result.lng,
        displayName: result.displayName,
      },
    });
  } catch (error) {
    console.error("Geocode error:", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Klaida nustatant koordinates" },
      { status: 500 }
    );
  }
}
