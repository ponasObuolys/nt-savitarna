import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import type { ApiResponse } from "@/types";

export async function DELETE(
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

    // Check if order exists
    const order = await prisma.uzkl_ivertink1P.findUnique({
      where: { id: orderId },
      select: { id: true },
    });

    if (!order) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Užsakymas nerastas" },
        { status: 404 }
      );
    }

    // Delete the order
    await prisma.uzkl_ivertink1P.delete({
      where: { id: orderId },
    });

    return NextResponse.json<ApiResponse>({
      success: true,
      data: { message: "Užsakymas sėkmingai ištrintas" },
    });
  } catch (error) {
    console.error("Delete order error:", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Klaida trinant užsakymą" },
      { status: 500 }
    );
  }
}
