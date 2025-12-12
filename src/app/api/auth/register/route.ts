import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, signToken, setAuthCookie } from "@/lib/auth";
import { isValidLithuanianPhone, formatPhoneNumber } from "@/lib/validations";
import type { AuthResponse } from "@/types";

interface RegisterBody {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  company?: string | null;
}

export async function POST(request: NextRequest) {
  try {
    const body: RegisterBody = await request.json();
    const { email, password, firstName, lastName, phone, company } = body;

    // Validate required fields
    if (!email || !password || !firstName || !lastName || !phone) {
      return NextResponse.json<AuthResponse>(
        { success: false, message: "Visi privalomi laukai turi būti užpildyti" },
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

    // Validate password strength
    if (password.length < 8) {
      return NextResponse.json<AuthResponse>(
        { success: false, message: "Slaptažodis turi būti bent 8 simbolių" },
        { status: 400 }
      );
    }
    if (!/[A-Z]/.test(password)) {
      return NextResponse.json<AuthResponse>(
        { success: false, message: "Slaptažodyje turi būti bent viena didžioji raidė" },
        { status: 400 }
      );
    }
    if (!/[a-z]/.test(password)) {
      return NextResponse.json<AuthResponse>(
        { success: false, message: "Slaptažodyje turi būti bent viena mažoji raidė" },
        { status: 400 }
      );
    }
    if (!/[0-9]/.test(password)) {
      return NextResponse.json<AuthResponse>(
        { success: false, message: "Slaptažodyje turi būti bent vienas skaičius" },
        { status: 400 }
      );
    }

    // Validate first name
    if (firstName.length < 2 || firstName.length > 100) {
      return NextResponse.json<AuthResponse>(
        { success: false, message: "Vardas turi būti nuo 2 iki 100 simbolių" },
        { status: 400 }
      );
    }

    // Validate last name
    if (lastName.length < 2 || lastName.length > 100) {
      return NextResponse.json<AuthResponse>(
        { success: false, message: "Pavardė turi būti nuo 2 iki 100 simbolių" },
        { status: 400 }
      );
    }

    // Validate phone number (Lithuanian format)
    if (!isValidLithuanianPhone(phone)) {
      return NextResponse.json<AuthResponse>(
        { success: false, message: "Neteisingas telefono formatas. Naudokite +370XXXXXXXX arba 8XXXXXXXX" },
        { status: 400 }
      );
    }

    // Validate company (optional but max length)
    if (company && company.length > 255) {
      return NextResponse.json<AuthResponse>(
        { success: false, message: "Įmonės pavadinimas per ilgas (max 255 simboliai)" },
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
    const formattedPhone = formatPhoneNumber(phone);

    const user = await prisma.app_users.create({
      data: {
        email: email.toLowerCase(),
        password_hash: passwordHash,
        role: "client",
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        phone: formattedPhone,
        company: company?.trim() || null,
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
