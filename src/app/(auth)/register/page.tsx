"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";
import { registerSchema, formatPhoneNumber, type RegisterFormData } from "@/lib/validations";

type FormErrors = Partial<Record<keyof RegisterFormData, string>>;

export default function RegisterPage() {
  const router = useRouter();

  const [formData, setFormData] = useState<RegisterFormData>({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    phone: "",
    company: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const updateField = (field: keyof RegisterFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const result = registerSchema.safeParse(formData);

    if (!result.success) {
      const newErrors: FormErrors = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof RegisterFormData;
        if (!newErrors[field]) {
          newErrors[field] = issue.message;
        }
      });
      setErrors(newErrors);
      return false;
    }

    setErrors({});
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formatPhoneNumber(formData.phone),
          company: formData.company || null,
        }),
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
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">Registracija</CardTitle>
        <CardDescription className="text-center">
          Sukurkite naują paskyrą
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <Alert variant="default" className="bg-blue-50 border-blue-200">
            <InfoIcon className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800 text-sm">
              Profilio duomenų vėliau pakeisti negalima. Įveskite teisingus duomenis.
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">Vardas *</Label>
              <Input
                id="firstName"
                type="text"
                placeholder="Jonas"
                value={formData.firstName}
                onChange={(e) => updateField("firstName", e.target.value)}
                disabled={isLoading}
                className={errors.firstName ? "border-red-500" : ""}
              />
              {errors.firstName && (
                <p className="text-sm text-red-500">{errors.firstName}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">Pavardė *</Label>
              <Input
                id="lastName"
                type="text"
                placeholder="Jonaitis"
                value={formData.lastName}
                onChange={(e) => updateField("lastName", e.target.value)}
                disabled={isLoading}
                className={errors.lastName ? "border-red-500" : ""}
              />
              {errors.lastName && (
                <p className="text-sm text-red-500">{errors.lastName}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">El. paštas *</Label>
            <Input
              id="email"
              type="email"
              placeholder="jusu@email.lt"
              value={formData.email}
              onChange={(e) => updateField("email", e.target.value)}
              disabled={isLoading}
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Telefonas *</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+37061234567"
              value={formData.phone}
              onChange={(e) => updateField("phone", e.target.value)}
              disabled={isLoading}
              className={errors.phone ? "border-red-500" : ""}
            />
            {errors.phone && (
              <p className="text-sm text-red-500">{errors.phone}</p>
            )}
            <p className="text-xs text-gray-500">Formatas: +370XXXXXXXX arba 8XXXXXXXX</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="company">Įmonė (neprivaloma)</Label>
            <Input
              id="company"
              type="text"
              placeholder="UAB Pavyzdys"
              value={formData.company}
              onChange={(e) => updateField("company", e.target.value)}
              disabled={isLoading}
              className={errors.company ? "border-red-500" : ""}
            />
            {errors.company && (
              <p className="text-sm text-red-500">{errors.company}</p>
            )}
          </div>

          <hr className="my-4" />

          <div className="space-y-2">
            <Label htmlFor="password">Slaptažodis *</Label>
            <Input
              id="password"
              type="password"
              placeholder="Mažiausiai 8 simboliai"
              value={formData.password}
              onChange={(e) => updateField("password", e.target.value)}
              disabled={isLoading}
              className={errors.password ? "border-red-500" : ""}
            />
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password}</p>
            )}
            <p className="text-xs text-gray-500">
              Min. 8 simboliai, didžioji raidė, mažoji raidė, skaičius
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Pakartokite slaptažodį *</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={(e) => updateField("confirmPassword", e.target.value)}
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
