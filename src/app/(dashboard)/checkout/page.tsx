"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { SERVICE_TYPES } from "@/lib/constants";

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const serviceId = searchParams.get("service") || "TYPE_1";

  const service = SERVICE_TYPES[serviceId] || SERVICE_TYPES.TYPE_1;

  const [isProcessing, setIsProcessing] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [name, setName] = useState("");

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(" ") : value;
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    if (v.length >= 2) {
      return v.substring(0, 2) + "/" + v.substring(2, 4);
    }
    return v;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ serviceId }),
      });

      const data = await response.json();

      if (data.success) {
        router.push("/checkout/success");
      } else {
        router.push("/checkout/failed");
      }
    } catch {
      toast.error("Mokėjimo klaida");
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <Link href="/dashboard" className="text-sm text-blue-600 hover:underline flex items-center gap-1 mb-4">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Grįžti
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Apmokėjimas</h1>
        <p className="text-gray-600 mt-1">Užbaikite užsakymą</p>
      </div>

      {/* Demo Banner */}
      <Card className="bg-yellow-50 border-yellow-200">
        <CardContent className="flex items-start gap-4 pt-6">
          <svg className="h-6 w-6 text-yellow-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div>
            <h3 className="font-semibold text-yellow-800">Demonstracinis mokėjimas</h3>
            <p className="text-sm text-yellow-700 mt-1">
              Tai demonstracinis puslapis. Jokie realūs mokėjimai nebus atliekami.
              Naudokite bet kokius duomenis testavimui.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Order Summary */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Užsakymo santrauka</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium">{service.nameLt}</h3>
                <p className="text-sm text-gray-500">{service.name}</p>
              </div>
            </div>

            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Paslauga</span>
                <span>{service.price > 0 ? `${service.price} €` : "Individuali"}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">PVM (21%)</span>
                <span>{service.price > 0 ? `${(service.price * 0.21).toFixed(2)} €` : "—"}</span>
              </div>
              <div className="flex justify-between font-semibold text-lg pt-2 border-t">
                <span>Iš viso</span>
                <span className="text-blue-600">
                  {service.price > 0 ? `${(service.price * 1.21).toFixed(2)} €` : "Individuali"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Form */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="text-base">Mokėjimo informacija</CardTitle>
            <CardDescription>Įveskite kortelės duomenis</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Kortelės turėtojo vardas</Label>
                <Input
                  id="name"
                  placeholder="Vardas Pavardė"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  disabled={isProcessing}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="card">Kortelės numeris</Label>
                <div className="relative">
                  <Input
                    id="card"
                    placeholder="1234 5678 9012 3456"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                    maxLength={19}
                    required
                    disabled={isProcessing}
                    className="pr-12"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1">
                    <svg className="h-6 w-6 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
                      <rect x="2" y="5" width="20" height="14" rx="2" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiry">Galiojimo data</Label>
                  <Input
                    id="expiry"
                    placeholder="MM/YY"
                    value={expiry}
                    onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                    maxLength={5}
                    required
                    disabled={isProcessing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cvv">CVV</Label>
                  <Input
                    id="cvv"
                    placeholder="123"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 3))}
                    maxLength={3}
                    required
                    disabled={isProcessing}
                  />
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-4">
              <Button type="submit" className="w-full" size="lg" disabled={isProcessing}>
                {isProcessing ? (
                  <>
                    <svg className="animate-spin h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Apdorojama...
                  </>
                ) : (
                  <>
                    Apmokėti {service.price > 0 ? `${(service.price * 1.21).toFixed(2)} €` : ""}
                  </>
                )}
              </Button>

              <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Saugus mokėjimas
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
