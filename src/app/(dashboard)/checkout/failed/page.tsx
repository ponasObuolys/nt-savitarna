import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Mokėjimas nepavyko",
};

export default function CheckoutFailedPage() {
  return (
    <div className="max-w-lg mx-auto">
      <Card>
        <CardContent className="pt-12 pb-8 text-center">
          {/* Error Icon */}
          <div className="mx-auto w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-6">
            <svg className="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Mokėjimas nepavyko
          </h1>

          {/* Description */}
          <p className="text-gray-600 mb-8 max-w-sm mx-auto">
            Mokėjimas buvo atmestas. Patikrinkite kortelės duomenis ir bandykite dar kartą.
          </p>

          {/* Demo Notice */}
          <div className="bg-yellow-50 rounded-lg p-4 mb-8 text-left">
            <div className="flex gap-3">
              <svg className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="text-sm font-medium text-yellow-800">Demonstracija</p>
                <p className="text-sm text-yellow-700 mt-1">
                  Demonstraciniame režime mokėjimai kartais atmetami atsitiktinai.
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild>
              <Link href="/checkout">
                Bandyti dar kartą
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/dashboard">
                Grįžti į pradžią
              </Link>
            </Button>
          </div>

          {/* Help Text */}
          <p className="text-sm text-gray-500 mt-8">
            Turite klausimų?{" "}
            <a href="mailto:info@1partner.lt" className="text-blue-600 hover:underline">
              Susisiekite su mumis
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
