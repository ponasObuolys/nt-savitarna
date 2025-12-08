import { NextResponse } from "next/server";
import { removeAuthCookie } from "@/lib/auth";
import type { AuthResponse } from "@/types";

export async function POST() {
  try {
    await removeAuthCookie();

    return NextResponse.json<AuthResponse>({
      success: true,
      message: "Atsijungimas sėkmingas",
    });
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json<AuthResponse>(
      { success: false, message: "Atsijungimo klaida. Bandykite vėliau." },
      { status: 500 }
    );
  }
}
