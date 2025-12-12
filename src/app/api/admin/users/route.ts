import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import type { ApiResponse, User } from "@/types";

interface UsersResponse {
  users: User[];
  total: number;
  page: number;
  pageSize: number;
}

export async function GET(request: NextRequest) {
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

    // Get query params for filtering and pagination
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get("search") || "";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const pageSize = 50; // Fixed page size as per requirements
    const offset = (page - 1) * pageSize;

    // Build where clause for search
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {
      role: "client", // Only show clients, not admins
    };

    if (search.trim()) {
      where.OR = [
        { email: { contains: search } },
        { first_name: { contains: search } },
        { last_name: { contains: search } },
        { company: { contains: search } },
        { phone: { contains: search } },
      ];
    }

    // Fetch users with pagination
    const [users, total] = await Promise.all([
      prisma.app_users.findMany({
        where,
        select: {
          id: true,
          email: true,
          first_name: true,
          last_name: true,
          phone: true,
          company: true,
          role: true,
          created_at: true,
          // Exclude password_hash for security
        },
        orderBy: { created_at: "desc" },
        take: pageSize,
        skip: offset,
      }),
      prisma.app_users.count({ where }),
    ]);

    return NextResponse.json<ApiResponse<UsersResponse>>({
      success: true,
      data: {
        users: users as User[],
        total,
        page,
        pageSize,
      },
    });
  } catch (error) {
    console.error("Admin users fetch error:", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Klaida gaunant klientus" },
      { status: 500 }
    );
  }
}
