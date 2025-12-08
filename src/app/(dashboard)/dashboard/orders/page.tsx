import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { OrderTable } from "@/components/orders/OrderTable";

export const metadata = {
  title: "Mano užsakymai",
};

async function getUserOrders(email: string) {
  return prisma.uzkl_ivertink1P.findMany({
    where: {
      contact_email: email.toLowerCase(),
    },
    orderBy: {
      created_at: "desc",
    },
  });
}

export default async function OrdersPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const orders = await getUserOrders(user.email);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mano užsakymai</h1>
          <p className="text-gray-600 mt-1">
            Visų jūsų užsakymų sąrašas
          </p>
        </div>
        <Button asChild>
          <a href="https://www.vertintojas.pro" target="_blank" rel="noopener noreferrer">
            <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Naujas užsakymas
          </a>
        </Button>
      </div>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Užsakymų sąrašas</CardTitle>
          <CardDescription>
            Iš viso: {orders.length} {orders.length === 1 ? "užsakymas" : "užsakymai"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <OrderTable
            orders={orders}
            emptyMessage="Dar neturite užsakymų"
          />
        </CardContent>
      </Card>

      {/* Help Section */}
      {orders.length > 0 && (
        <Card className="bg-gray-50">
          <CardContent className="py-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex-shrink-0">
                <svg className="h-10 w-10 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">Turite klausimų?</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Jei turite klausimų apie savo užsakymą ar vertinimą, susisiekite su mumis.
                </p>
              </div>
              <Button variant="outline" asChild>
                <a href="mailto:info@1partner.lt">
                  Susisiekti
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State with CTA */}
      {orders.length === 0 && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <svg className="h-16 w-16 text-blue-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Dar neturite užsakymų
            </h3>
            <p className="text-gray-600 text-center mb-6 max-w-md">
              Užsisakykite nekilnojamojo turto vertinimą ir peržiūrėkite rezultatus čia.
            </p>
            <div className="flex gap-3">
              <Button asChild>
                <a href="https://www.vertintojas.pro" target="_blank" rel="noopener noreferrer">
                  Užsakyti vertinimą
                </a>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/dashboard">
                  Grįžti į pradžią
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
