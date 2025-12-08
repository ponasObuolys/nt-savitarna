import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "fallback-secret-change-in-production"
);

// Routes that require authentication
const protectedRoutes = ["/dashboard", "/admin"];

// Routes that require admin role
const adminRoutes = ["/admin"];

// Routes that should redirect to dashboard if already authenticated
const authRoutes = ["/login", "/register"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("auth-token")?.value;

  // Check if route is protected
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );
  const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route));
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  // Verify token if present
  let user = null;
  if (token) {
    try {
      const { payload } = await jwtVerify(token, JWT_SECRET);
      user = payload as { userId: number; email: string; role: string };
    } catch {
      // Invalid token - will be treated as unauthenticated
    }
  }

  // Redirect authenticated users away from auth pages
  if (isAuthRoute && user) {
    const redirectUrl = user.role === "admin" ? "/admin" : "/dashboard";
    return NextResponse.redirect(new URL(redirectUrl, request.url));
  }

  // Redirect unauthenticated users to login
  if (isProtectedRoute && !user) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Check admin access
  if (isAdminRoute && user && user.role !== "admin") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api|_next/static|_next/image|favicon.ico|public).*)",
  ],
};
