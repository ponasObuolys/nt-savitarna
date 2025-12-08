import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import type { ApiResponse, Order } from "@/types";

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Neprisijungęs" },
        { status: 401 }
      );
    }

    // Fetch orders for the current user's email
    const orders = await prisma.uzkl_ivertink1P.findMany({
      where: {
        contact_email: user.email.toLowerCase(),
      },
      orderBy: {
        created_at: "desc",
      },
    });

    return NextResponse.json<ApiResponse<Order[]>>({
      success: true,
      data: orders,
    });
  } catch (error) {
    console.error("Orders fetch error:", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Klaida gaunant užsakymus" },
      { status: 500 }
    );
  }
}
