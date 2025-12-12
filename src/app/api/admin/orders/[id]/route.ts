import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import type { ApiResponse, Order } from "@/types";

// GET - Fetch single order for admin
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

    // Fetch order by ID (admin can see all orders)
    const order = await prisma.uzkl_ivertink1P.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Užsakymas nerastas" },
        { status: 404 }
      );
    }

    return NextResponse.json<ApiResponse<Order>>({
      success: true,
      data: order as unknown as Order,
    });
  } catch (error) {
    console.error("Admin order fetch error:", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Klaida gaunant užsakymą" },
      { status: 500 }
    );
  }
}

// PATCH - Update order (admin only)
export async function PATCH(
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
    const existingOrder = await prisma.uzkl_ivertink1P.findUnique({
      where: { id: orderId },
    });

    if (!existingOrder) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Užsakymas nerastas" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { status, priskirta, rc_filename, rc_saskaita } = body;

    // Validate inputs
    const updateData: Record<string, unknown> = {};

    // Status validation
    if (status !== undefined) {
      const validStatuses = ["pending", "paid", "done", "failed", null];
      if (!validStatuses.includes(status)) {
        return NextResponse.json<ApiResponse>(
          { success: false, error: "Neteisingas statusas" },
          { status: 400 }
        );
      }
      updateData.status = status;
    }

    // Valuator assignment
    if (priskirta !== undefined) {
      updateData.priskirta = priskirta || null;
      if (priskirta) {
        updateData.priskirta_date = new Date();
      }
    }

    // PDF filename validation
    if (rc_filename !== undefined) {
      if (rc_filename && !rc_filename.endsWith(".pdf")) {
        return NextResponse.json<ApiResponse>(
          { success: false, error: "Ataskaitos failas turi būti PDF formatu" },
          { status: 400 }
        );
      }
      updateData.rc_filename = rc_filename || null;
    }

    // Invoice filename validation
    if (rc_saskaita !== undefined) {
      if (rc_saskaita && !rc_saskaita.endsWith(".pdf")) {
        return NextResponse.json<ApiResponse>(
          { success: false, error: "Sąskaitos failas turi būti PDF formatu" },
          { status: 400 }
        );
      }
      updateData.rc_saskaita = rc_saskaita || null;
    }

    // Update order
    const updatedOrder = await prisma.uzkl_ivertink1P.update({
      where: { id: orderId },
      data: updateData,
    });

    return NextResponse.json<ApiResponse<Order>>({
      success: true,
      data: updatedOrder as unknown as Order,
    });
  } catch (error) {
    console.error("Admin order update error:", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Klaida atnaujinant užsakymą" },
      { status: 500 }
    );
  }
}
