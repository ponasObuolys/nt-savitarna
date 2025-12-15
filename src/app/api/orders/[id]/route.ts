import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import type { ApiResponse, Order } from "@/types";

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

    const { id } = await params;
    const orderId = parseInt(id, 10);

    if (isNaN(orderId)) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Neteisingas užsakymo ID" },
        { status: 400 }
      );
    }

    // Fetch order by ID
    const order = await prisma.uzkl_ivertink1P.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Užsakymas nerastas" },
        { status: 404 }
      );
    }

    // Verify the order belongs to the current user (by email) - admins can see all orders
    if (user.role !== "admin" && order.contact_email.toLowerCase() !== user.email.toLowerCase()) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Neturite prieigos prie šio užsakymo" },
        { status: 403 }
      );
    }

    // Fetch coordinates separately using raw SQL (Prisma doesn't support POINT type)
    // Use HEX() to convert binary to hex string, avoiding Prisma type conversion issues
    const coordsResult = await prisma.$queryRaw<Array<{ coords: string | null }>>`
      SELECT HEX(address_coordinates) as coords
      FROM uzkl_ivertink1P
      WHERE id = ${orderId}
    `;

    const orderWithCoords = {
      ...order,
      address_coordinates: coordsResult[0]?.coords || null,
    };

    return NextResponse.json<ApiResponse<Order>>({
      success: true,
      data: orderWithCoords,
    });
  } catch (error) {
    console.error("Order fetch error:", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Klaida gaunant užsakymą" },
      { status: 500 }
    );
  }
}
