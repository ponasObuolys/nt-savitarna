import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { OrderTable } from "@/components/orders/OrderTable";
import { getOrderDisplayStatus, getServiceInfo } from "@/lib/constants";
import type { Order } from "@/types";

export const metadata = {
  title: "Pradžia",
};

async function getOrderStats(email: string) {
  const orders = await prisma.uzkl_ivertink1P.findMany({
    where: {
      contact_email: email.toLowerCase(),
    },
    orderBy: {
      created_at: "desc",
    },
  });

  let totalSpent = 0;
  let completedCount = 0;
  let pendingCount = 0;

  orders.forEach((order: Order) => {
    const status = getOrderDisplayStatus(
      order.service_type,
      order.is_enough_data_for_ai,
      order.status
    );
    const serviceInfo = getServiceInfo(order.service_type);
    const price = order.price || serviceInfo.price;

    if (status === "completed" || status === "paid") {
      totalSpent += price;
    }
    if (status === "completed") {
      completedCount++;
    }
    if (status === "pending") {
      pendingCount++;
    }
  });

  return {
    orders,
    totalOrders: orders.length,
    completedCount,
    pendingCount,
    totalSpent,
    recentOrders: orders.slice(0, 5),
  };
}

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const stats = await getOrderStats(user.email);

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Sveiki!</h1>
        <p className="text-gray-600 mt-1">
          Čia galite peržiūrėti savo užsakymus ir atsisiųsti ataskaitas.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Viso užsakymų
            </CardTitle>
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalOrders}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Atlikta
            </CardTitle>
            <svg className="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{stats.completedCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Laukiama
            </CardTitle>
            <svg className="h-5 w-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600">{stats.pendingCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Išleista
            </CardTitle>
            <svg className="h-5 w-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{stats.totalSpent} €</div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Naujausi užsakymai</CardTitle>
            <CardDescription>Paskutiniai 5 užsakymai</CardDescription>
          </div>
          <Link href="/dashboard/orders">
            <Button variant="outline" size="sm">
              Visi užsakymai
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <OrderTable
            orders={stats.recentOrders}
            emptyMessage="Dar neturite užsakymų. Užsisakykite vertinimą!"
          />
        </CardContent>
      </Card>

      {/* Quick Actions */}
      {stats.totalOrders === 0 && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="flex flex-col items-center justify-center py-8">
            <svg className="h-12 w-12 text-blue-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Pradėkite nuo vertinimo užsakymo
            </h3>
            <p className="text-gray-600 text-center mb-4 max-w-md">
              Užsisakykite automatinį arba profesionalų nekilnojamojo turto vertinimą.
            </p>
            <Button asChild>
              <a href="https://www.vertintojas.pro" target="_blank" rel="noopener noreferrer">
                Užsakyti vertinimą
              </a>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
