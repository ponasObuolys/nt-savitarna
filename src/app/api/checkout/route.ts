import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { SERVICE_TYPES } from "@/lib/constants";
import type { ApiResponse } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Neprisijungęs" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { serviceId } = body;

    // Validate service
    if (!serviceId || !SERVICE_TYPES[serviceId]) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Neteisinga paslauga" },
        { status: 400 }
      );
    }

    // Simulate payment processing delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Demo: Always succeed (80% success rate for more realistic demo)
    const isSuccess = Math.random() > 0.2;

    if (isSuccess) {
      // In a real app, we would:
      // 1. Process payment via Stripe/payment gateway
      // 2. Create order in database
      // 3. Send confirmation email

      return NextResponse.json<ApiResponse<{ orderId: string }>>({
        success: true,
        data: {
          orderId: `DEMO-${Date.now()}`,
        },
      });
    } else {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Mokėjimas atmestas (demo)" },
        { status: 402 }
      );
    }
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Mokėjimo klaida" },
      { status: 500 }
    );
  }
}
