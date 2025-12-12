import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import type { ApiResponse, Valuator } from "@/types";

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

    // Fetch all active valuators
    const valuators = await prisma.app_valuators.findMany({
      where: {
        is_active: true,
      },
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
      orderBy: [{ last_name: "asc" }, { first_name: "asc" }],
    });

    return NextResponse.json<ApiResponse<{ valuators: Valuator[] }>>({
      success: true,
      data: { valuators: valuators as Valuator[] },
    });
  } catch (error) {
    console.error("Admin valuators fetch error:", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Klaida gaunant vertintojus" },
      { status: 500 }
    );
  }
}
