import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import type { JWTPayload as AppJWTPayload, UserRole } from "@/types";

// JWT configuration
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "fallback-secret-change-in-production"
);
const JWT_EXPIRATION = "7d"; // 7 days
const COOKIE_NAME = "auth-token";

// Re-export type for convenience
export type JWTPayload = AppJWTPayload;

// Sign JWT token
export async function signToken(payload: Omit<AppJWTPayload, "iat" | "exp">): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(JWT_EXPIRATION)
    .sign(JWT_SECRET);
}

// Verify JWT token
export async function verifyToken(token: string): Promise<AppJWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as AppJWTPayload;
  } catch {
    return null;
  }
}

// Hash password
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

// Compare password with hash
export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// Set auth cookie
export async function setAuthCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  });
}

// Remove auth cookie
export async function removeAuthCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

// Get auth cookie
export async function getAuthCookie(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(COOKIE_NAME)?.value;
}

// Get current user from cookie
export async function getCurrentUser(): Promise<AppJWTPayload | null> {
  const token = await getAuthCookie();
  if (!token) return null;
  return verifyToken(token);
}

// Check if user has required role
export function hasRole(user: AppJWTPayload | null, requiredRole: UserRole): boolean {
  if (!user) return false;
  if (requiredRole === "client") return true; // Both admin and client can access client routes
  return user.role === requiredRole;
}

// Check if user is admin
export function isAdmin(user: AppJWTPayload | null): boolean {
  return hasRole(user, "admin");
}

// Check if user is authenticated
export function isAuthenticated(user: AppJWTPayload | null): boolean {
  return user !== null;
}
