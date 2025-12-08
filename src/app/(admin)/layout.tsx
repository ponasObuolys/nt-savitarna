import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (user.role !== "admin") {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={{ email: user.email, role: user.role }} />
      <Sidebar />

      {/* Main content with sidebar offset */}
      <main className="lg:pl-64">
        <div className="container mx-auto px-4 py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
