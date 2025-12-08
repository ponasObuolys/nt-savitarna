"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email) {
      newErrors.email = "El. paštas yra privalomas";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Neteisingas el. pašto formatas";
    }

    if (!password) {
      newErrors.password = "Slaptažodis yra privalomas";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Prisijungimas sėkmingas!");

        // Redirect based on role
        if (data.user?.role === "admin") {
          router.push("/admin");
        } else {
          router.push(redirect);
        }
        router.refresh();
      } else {
        toast.error(data.message || "Prisijungimo klaida");
      }
    } catch {
      toast.error("Tinklo klaida. Bandykite vėliau.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">Prisijungimas</CardTitle>
        <CardDescription className="text-center">
          Įveskite savo prisijungimo duomenis
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">El. paštas</Label>
            <Input
              id="email"
              type="email"
              placeholder="jusu@email.lt"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors({ ...errors, email: undefined });
              }}
              disabled={isLoading}
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Slaptažodis</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) setErrors({ ...errors, password: undefined });
              }}
              disabled={isLoading}
              className={errors.password ? "border-red-500" : ""}
            />
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password}</p>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-4">
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Jungiamasi..." : "Prisijungti"}
          </Button>

          <p className="text-sm text-center text-gray-600">
            Neturite paskyros?{" "}
            <Link href="/register" className="text-blue-600 hover:underline font-medium">
              Registruotis
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Prisijungimas</CardTitle>
          <CardDescription className="text-center">
            Kraunama...
          </CardDescription>
        </CardHeader>
      </Card>
    }>
      <LoginForm />
    </Suspense>
  );
}
