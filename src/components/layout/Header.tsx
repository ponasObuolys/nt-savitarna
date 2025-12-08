"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface HeaderProps {
  user?: {
    email: string;
    role: string;
  } | null;
  onMenuClick?: () => void;
}

export function Header({ user, onMenuClick }: HeaderProps) {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-white">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          {/* Mobile menu button - for authenticated users */}
          {user && (
            <button
              onClick={onMenuClick || (() => setMobileMenuOpen(!mobileMenuOpen))}
              className="md:hidden p-2 -ml-2 rounded-lg hover:bg-gray-100"
              aria-label="Atidaryti meniu"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          )}

          {/* Logo */}
          <Link href={user ? (user.role === "admin" ? "/admin" : "/dashboard") : "/"} className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white font-bold">
              1P
            </div>
            <span className="text-lg font-semibold text-gray-900 hidden sm:inline">Savitarna</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-6">
          {user ? (
            <>
              {user.role === "admin" ? (
                <>
                  <Link href="/admin" className="text-sm font-medium text-gray-600 hover:text-gray-900">
                    Pradžia
                  </Link>
                  <Link href="/admin/orders" className="text-sm font-medium text-gray-600 hover:text-gray-900">
                    Užsakymai
                  </Link>
                  <Link href="/admin/products" className="text-sm font-medium text-gray-600 hover:text-gray-900">
                    Produktai
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/dashboard" className="text-sm font-medium text-gray-600 hover:text-gray-900">
                    Pradžia
                  </Link>
                  <Link href="/dashboard/orders" className="text-sm font-medium text-gray-600 hover:text-gray-900">
                    Mano užsakymai
                  </Link>
                </>
              )}
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900">
                Prisijungti
              </Link>
              <Link href="/register">
                <Button size="sm">Registruotis</Button>
              </Link>
            </>
          )}
        </nav>

        {/* User Menu */}
        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-medium">
                  {user.email.charAt(0).toUpperCase()}
                </div>
                <span className="hidden sm:inline max-w-32 truncate">{user.email}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="px-2 py-1.5">
                <p className="text-sm font-medium">{user.email}</p>
                <p className="text-xs text-gray-500">
                  {user.role === "admin" ? "Administratorius" : "Klientas"}
                </p>
              </div>
              <DropdownMenuSeparator />
              {user.role === "admin" && (
                <>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard">Kliento vaizdas</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </>
              )}
              <DropdownMenuItem
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="text-red-600 focus:text-red-600"
              >
                {isLoggingOut ? "Atsijungiama..." : "Atsijungti"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {/* Mobile Menu Button */}
        {!user && (
          <div className="md:hidden flex items-center gap-2">
            <Link href="/login">
              <Button variant="outline" size="sm">Prisijungti</Button>
            </Link>
          </div>
        )}
      </div>
    </header>

    {/* Mobile Navigation Menu */}
    {user && mobileMenuOpen && !onMenuClick && (
      <>
        {/* Backdrop */}
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />

        {/* Menu */}
        <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white md:hidden">
          <div className="flex items-center justify-between h-16 px-4 border-b">
            <span className="text-lg font-semibold">Meniu</span>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <nav className="px-4 py-6 space-y-1">
            {user.role === "admin" ? (
              <>
                <Link
                  href="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  Pradžia
                </Link>
                <Link
                  href="/admin/orders"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  Užsakymai
                </Link>
                <Link
                  href="/admin/products"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                  Produktai
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  Pradžia
                </Link>
                <Link
                  href="/dashboard/orders"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  Mano užsakymai
                </Link>
                <Link
                  href="/checkout"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Naujas užsakymas
                </Link>
              </>
            )}
          </nav>

          {/* Logout section */}
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleLogout();
              }}
              disabled={isLoggingOut}
              className="flex items-center gap-3 w-full px-3 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              {isLoggingOut ? "Atsijungiama..." : "Atsijungti"}
            </button>
          </div>
        </div>
      </>
    )}
    </>
  );
}
