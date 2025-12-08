import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { comparePassword, signToken, setAuthCookie } from "@/lib/auth";
import type { AuthResponse } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validate input
    if (!email || !password) {
      return NextResponse.json<AuthResponse>(
        { success: false, message: "El. paštas ir slaptažodis yra privalomi" },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await prisma.app_users.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      return NextResponse.json<AuthResponse>(
        { success: false, message: "Neteisingi prisijungimo duomenys" },
        { status: 401 }
      );
    }

    // Verify password
    const isValidPassword = await comparePassword(password, user.password_hash);
    if (!isValidPassword) {
      return NextResponse.json<AuthResponse>(
        { success: false, message: "Neteisingi prisijungimo duomenys" },
        { status: 401 }
      );
    }

    // Create JWT token and set cookie
    const token = await signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });
    await setAuthCookie(token);

    return NextResponse.json<AuthResponse>({
      success: true,
      message: "Prisijungimas sėkmingas",
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json<AuthResponse>(
      { success: false, message: "Prisijungimo klaida. Bandykite vėliau." },
      { status: 500 }
    );
  }
}
