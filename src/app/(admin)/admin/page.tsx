import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { OrderTable } from "@/components/orders/OrderTable";
import { InfoTooltip } from "@/components/ui/info-tooltip";
import { getOrderDisplayStatus, getServiceInfo } from "@/lib/constants";
import type { Order } from "@/types";

export const metadata = {
  title: "Admin - Pradžia",
};

async function getAdminStats() {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [allOrders, monthlyOrders] = await Promise.all([
    prisma.uzkl_ivertink1P.findMany({
      orderBy: { created_at: "desc" },
    }),
    prisma.uzkl_ivertink1P.findMany({
      where: {
        created_at: { gte: startOfMonth },
      },
    }),
  ]);

  let completedOrders = 0;
  let pendingOrders = 0;
  let monthlyRevenue = 0;

  allOrders.forEach((order: Order) => {
    const status = getOrderDisplayStatus(
      order.service_type,
      order.is_enough_data_for_ai,
      order.status
    );
    if (status === "completed") completedOrders++;
    if (status === "pending") pendingOrders++;
  });

  monthlyOrders.forEach((order: Order) => {
    const status = getOrderDisplayStatus(
      order.service_type,
      order.is_enough_data_for_ai,
      order.status
    );
    if (status === "completed" || status === "paid") {
      const serviceInfo = getServiceInfo(order.service_type);
      const servicePrice = order.service_price ?? serviceInfo.price;
      monthlyRevenue += servicePrice;
    }
  });

  return {
    totalOrders: allOrders.length,
    monthlyOrders: monthlyOrders.length,
    monthlyRevenue,
    completedOrders,
    pendingOrders,
    recentOrders: allOrders.slice(0, 10),
  };
}

export default async function AdminDashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.role !== "admin") redirect("/dashboard");

  const stats = await getAdminStats();
  const currentMonth = new Date().toLocaleDateString("lt-LT", { month: "long", year: "numeric" });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Administravimo skydelis</h1>
        <p className="text-gray-600 mt-1">
          Peržiūrėkite užsakymus ir valdykite sistemą
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
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
              Šį mėnesį
            </CardTitle>
            <svg className="h-5 w-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{stats.monthlyOrders}</div>
            <p className="text-xs text-gray-500 mt-1">{currentMonth}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-1">
              Mėnesio pajamos
              <InfoTooltip content="Suma pajamų už vertinimo paslaugas šį mėnesį (tik apmokėti užsakymai)" />
            </CardTitle>
            <svg className="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{stats.monthlyRevenue} €</div>
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
            <div className="text-3xl font-bold text-green-600">{stats.completedOrders}</div>
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
            <div className="text-3xl font-bold text-yellow-600">{stats.pendingOrders}</div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Naujausi užsakymai</CardTitle>
            <CardDescription>Paskutiniai 10 užsakymų</CardDescription>
          </div>
          <Link href="/admin/orders">
            <Button variant="outline" size="sm">
              Visi užsakymai
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <OrderTable
            orders={stats.recentOrders}
            showAddress={true}
            emptyMessage="Užsakymų nerasta"
          />
        </CardContent>
      </Card>

      {/* Quick Links */}
      <div className="grid gap-4 md:grid-cols-3">
        <Link href="/admin/orders">
          <Card className="hover:bg-gray-50 transition-colors cursor-pointer">
            <CardContent className="flex items-center gap-4 pt-6">
              <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
                <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold">Užsakymai</h3>
                <p className="text-sm text-gray-500">Valdyti visus užsakymus</p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/products">
          <Card className="hover:bg-gray-50 transition-colors cursor-pointer">
            <CardContent className="flex items-center gap-4 pt-6">
              <div className="h-12 w-12 rounded-lg bg-purple-100 flex items-center justify-center">
                <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold">Produktai</h3>
                <p className="text-sm text-gray-500">Valdyti paslaugas ir kainas</p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard">
          <Card className="hover:bg-gray-50 transition-colors cursor-pointer">
            <CardContent className="flex items-center gap-4 pt-6">
              <div className="h-12 w-12 rounded-lg bg-gray-100 flex items-center justify-center">
                <svg className="h-6 w-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold">Kliento vaizdas</h3>
                <p className="text-sm text-gray-500">Peržiūrėti kaip klientas</p>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
