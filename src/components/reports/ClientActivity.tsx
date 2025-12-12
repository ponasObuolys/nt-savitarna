"use client";

import * as React from "react";
import { StatsCard, StatsGrid } from "./StatsCard";
import { ChartWrapper } from "@/components/charts/ChartWrapper";
import { SimpleLineChart } from "@/components/charts/LineChart";
import { SimplePieChart } from "@/components/charts/PieChart";
import { CHART_COLORS } from "@/lib/chart-colors";
import type { DateFilter, ClientActivityData } from "@/types";
import { formatNumber, formatCurrency } from "@/lib/report-utils";
import { UsersIcon, UserPlusIcon, ActivityIcon, TrendingUpIcon } from "lucide-react";

interface ClientActivityProps {
  dateFilter: DateFilter;
}

export function ClientActivity({ dateFilter }: ClientActivityProps) {
  const [data, setData] = React.useState<ClientActivityData | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // Fetch data when filter changes
  React.useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams();
        params.set("preset", dateFilter.preset);
        if (dateFilter.preset === "custom" && dateFilter.dateFrom && dateFilter.dateTo) {
          params.set("dateFrom", dateFilter.dateFrom.toISOString().split("T")[0]);
          params.set("dateTo", dateFilter.dateTo.toISOString().split("T")[0]);
        }

        const response = await fetch(`/api/admin/reports/clients?${params.toString()}`);
        const result = await response.json();

        if (result.success) {
          setData(result.data);
        } else {
          setError(result.error || "Klaida gaunant duomenis");
        }
      } catch {
        setError("Nepavyko prisijungti prie serverio");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [dateFilter]);

  // Calculate average orders per client
  const avgOrdersPerClient = React.useMemo(() => {
    if (!data?.topClients?.length) return 0;
    const total = data.topClients.reduce((sum, c) => sum + c.ordersCount, 0);
    return Math.round(total / data.topClients.length);
  }, [data?.topClients]);

  const handleRetry = () => {
    setData(null);
    setIsLoading(true);
  };

  return (
    <>
      {/* Stats Grid */}
      <StatsGrid>
        <StatsCard
          title="Viso klientų"
          value={formatNumber(data?.totalClients || 0)}
          description="Registruotų vartotojų"
          icon={<UsersIcon className="h-5 w-5" />}
          isLoading={isLoading}
        />
        <StatsCard
          title="Aktyvūs klientai"
          value={formatNumber(data?.activeClients || 0)}
          description="Turėję užsakymų"
          icon={<ActivityIcon className="h-5 w-5" />}
          isLoading={isLoading}
        />
        <StatsCard
          title="Nauji šį mėnesį"
          value={formatNumber(data?.newThisMonth || 0)}
          description="Registracijos"
          icon={<UserPlusIcon className="h-5 w-5" />}
          isLoading={isLoading}
        />
        <StatsCard
          title="Vidutiniškai užsakymų"
          value={formatNumber(avgOrdersPerClient)}
          description="Per aktyvų klientą"
          icon={<TrendingUpIcon className="h-5 w-5" />}
          isLoading={isLoading}
        />
      </StatsGrid>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <ChartWrapper
          title="Naujų klientų registracijos"
          description="Registracijos per laikotarpį"
          isLoading={isLoading}
          error={error}
          onRetry={handleRetry}
          isEmpty={!data?.registrationTimeline?.length}
          emptyMessage="Nėra registracijų per pasirinktą laikotarpį"
        >
          {data?.registrationTimeline && (
            <SimpleLineChart
              data={data.registrationTimeline}
              color={CHART_COLORS.success}
              dataKeyLabel="Registracijos"
            />
          )}
        </ChartWrapper>

        <ChartWrapper
          title="Klientų aktyvumas"
          description="Pagal užsakymų skaičių"
          isLoading={isLoading}
          error={error}
          onRetry={handleRetry}
          isEmpty={!data?.activityDistribution?.length}
          emptyMessage="Nėra duomenų"
        >
          {data?.activityDistribution && data.activityDistribution.length > 0 && (
            <SimplePieChart
              data={data.activityDistribution}
              innerRadius={50}
              outerRadius={90}
              showLabel={true}
              formatValue={(v) => formatNumber(v)}
            />
          )}
        </ChartWrapper>
      </div>

      {/* Top clients table */}
      {data?.topClients && data.topClients.length > 0 && (
        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-base font-semibold text-gray-900 mb-4">
            Top 10 aktyviausių klientų
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-gray-600">
                    #
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">
                    Klientas
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">
                    El. paštas
                  </th>
                  <th className="text-right py-3 px-4 font-medium text-gray-600">
                    Užsakymų
                  </th>
                  <th className="text-right py-3 px-4 font-medium text-gray-600">
                    Išleista
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.topClients.map((client, index) => (
                  <tr key={client.id} className="border-b last:border-0">
                    <td className="py-3 px-4 text-gray-500">{index + 1}</td>
                    <td className="py-3 px-4 font-medium">{client.name}</td>
                    <td className="py-3 px-4 text-gray-500 truncate max-w-[200px]">
                      {client.email}
                    </td>
                    <td className="text-right py-3 px-4 font-medium">
                      {formatNumber(client.ordersCount)}
                    </td>
                    <td className="text-right py-3 px-4 text-green-600 font-medium">
                      {formatCurrency(client.totalSpent)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}
