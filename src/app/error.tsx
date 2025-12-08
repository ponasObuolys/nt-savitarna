"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <Card className="max-w-md w-full">
        <CardContent className="pt-12 pb-8 text-center">
          {/* Error Icon */}
          <div className="mx-auto w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-6">
            <svg className="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Kažkas nutiko ne taip
          </h1>

          {/* Description */}
          <p className="text-gray-600 mb-8 max-w-sm mx-auto">
            Atsiprašome, įvyko netikėta klaida. Bandykite dar kartą arba grįžkite į pradžią.
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={() => reset()}>
              Bandyti dar kartą
            </Button>
            <Button variant="outline" asChild>
              <Link href="/">
                Grįžti į pradžią
              </Link>
            </Button>
          </div>

          {/* Error digest for debugging */}
          {error.digest && (
            <p className="text-xs text-gray-400 mt-8">
              Klaidos kodas: {error.digest}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
