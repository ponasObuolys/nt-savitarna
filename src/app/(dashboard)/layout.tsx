import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header user={{ email: user.email, role: user.role }} />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          {children}
        </div>
      </main>

      <Footer />
    </div>
  );
}
