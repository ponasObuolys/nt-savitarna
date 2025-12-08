"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function RegisterPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (!email) {
      newErrors.email = "El. paštas yra privalomas";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Neteisingas el. pašto formatas";
    }

    if (!password) {
      newErrors.password = "Slaptažodis yra privalomas";
    } else if (password.length < 6) {
      newErrors.password = "Slaptažodis turi būti bent 6 simbolių";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Pakartokite slaptažodį";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Slaptažodžiai nesutampa";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Registracija sėkminga!");
        router.push("/dashboard");
        router.refresh();
      } else {
        toast.error(data.message || "Registracijos klaida");
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
        <CardTitle className="text-2xl font-bold text-center">Registracija</CardTitle>
        <CardDescription className="text-center">
          Sukurkite naują paskyrą
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
              placeholder="Mažiausiai 6 simboliai"
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

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Pakartokite slaptažodį</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: undefined });
              }}
              disabled={isLoading}
              className={errors.confirmPassword ? "border-red-500" : ""}
            />
            {errors.confirmPassword && (
              <p className="text-sm text-red-500">{errors.confirmPassword}</p>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-4">
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Registruojama..." : "Registruotis"}
          </Button>

          <p className="text-sm text-center text-gray-600">
            Jau turite paskyrą?{" "}
            <Link href="/login" className="text-blue-600 hover:underline font-medium">
              Prisijungti
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
