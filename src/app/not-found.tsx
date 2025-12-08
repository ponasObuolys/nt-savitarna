import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <Card className="max-w-md w-full">
        <CardContent className="pt-12 pb-8 text-center">
          {/* 404 Icon */}
          <div className="mx-auto w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center mb-6">
            <span className="text-3xl font-bold text-blue-600">404</span>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Puslapis nerastas
          </h1>

          {/* Description */}
          <p className="text-gray-600 mb-8 max-w-sm mx-auto">
            Atsiprašome, puslapis, kurio ieškote, neegzistuoja arba buvo perkeltas.
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild>
              <Link href="/">
                Grįžti į pradžią
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/dashboard">
                Mano skydelis
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
