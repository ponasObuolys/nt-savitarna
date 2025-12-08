import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, signToken, setAuthCookie } from "@/lib/auth";
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

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json<AuthResponse>(
        { success: false, message: "Neteisingas el. pašto formatas" },
        { status: 400 }
      );
    }

    // Validate password length
    if (password.length < 6) {
      return NextResponse.json<AuthResponse>(
        { success: false, message: "Slaptažodis turi būti bent 6 simbolių" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.app_users.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return NextResponse.json<AuthResponse>(
        { success: false, message: "Vartotojas su šiuo el. paštu jau egzistuoja" },
        { status: 409 }
      );
    }

    // Hash password and create user
    const passwordHash = await hashPassword(password);
    const user = await prisma.app_users.create({
      data: {
        email: email.toLowerCase(),
        password_hash: passwordHash,
        role: "client",
      },
    });

    // Create JWT token and set cookie
    const token = await signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });
    await setAuthCookie(token);

    return NextResponse.json<AuthResponse>({
      success: true,
      message: "Registracija sėkminga",
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json<AuthResponse>(
      { success: false, message: "Registracijos klaida. Bandykite vėliau." },
      { status: 500 }
    );
  }
}
