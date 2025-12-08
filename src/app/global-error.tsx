"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global error:", error);
  }, [error]);

  return (
    <html lang="lt">
      <body>
        <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
            {/* Error Icon */}
            <div className="mx-auto w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-6">
              <svg className="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>

            {/* Title */}
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Kritinė klaida
            </h1>

            {/* Description */}
            <p className="text-gray-600 mb-8">
              Atsiprašome, įvyko kritinė sistemos klaida.
            </p>

            {/* Actions */}
            <button
              onClick={() => reset()}
              className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
            >
              Bandyti dar kartą
            </button>

            {/* Error digest */}
            {error.digest && (
              <p className="text-xs text-gray-400 mt-8">
                Klaidos kodas: {error.digest}
              </p>
            )}
          </div>
        </div>
      </body>
    </html>
  );
}
