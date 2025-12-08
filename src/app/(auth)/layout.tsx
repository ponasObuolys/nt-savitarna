import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Simple header for auth pages */}
      <header className="border-b bg-white">
        <div className="container mx-auto flex h-16 items-center px-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white font-bold">
              1P
            </div>
            <span className="text-lg font-semibold text-gray-900">Savitarna</span>
          </Link>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {children}
        </div>
      </main>

      {/* Simple footer */}
      <footer className="border-t bg-white py-4">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} 1Partner. Visos teisės saugomos.
          </p>
        </div>
      </footer>
    </div>
  );
}
