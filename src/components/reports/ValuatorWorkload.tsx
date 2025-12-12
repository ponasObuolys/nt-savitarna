"use client";

import * as React from "react";
import { StatsCard, StatsGrid } from "./StatsCard";
import { ChartWrapper } from "@/components/charts/ChartWrapper";
import { SimpleBarChart } from "@/components/charts/BarChart";
import { StackedAreaChart } from "@/components/charts/AreaChart";
import { CHART_COLORS, getChartColor } from "@/lib/chart-colors";
import type { DateFilter, ValuatorWorkloadData } from "@/types";
import { formatNumber } from "@/lib/report-utils";
import { UserCogIcon, TrendingUpIcon, TrendingDownIcon, UsersIcon } from "lucide-react";

interface ValuatorWorkloadProps {
  dateFilter: DateFilter;
}

export function ValuatorWorkload({ dateFilter }: ValuatorWorkloadProps) {
  const [data, setData] = React.useState<ValuatorWorkloadData | null>(null);
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

        const response = await fetch(`/api/admin/reports/valuators?${params.toString()}`);
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

  // Generate area chart config from ranking data
  const areaChartConfig = React.useMemo(() => {
    if (!data?.ranking) return [];
    return data.ranking.slice(0, 5).map((valuator, index) => ({
      dataKey: valuator.code,
      label: valuator.name,
      color: getChartColor(index),
      stackId: "1",
    }));
  }, [data?.ranking]);

  const handleRetry = () => {
    setData(null);
    setIsLoading(true);
  };

  return (
    <>
      {/* Stats Grid */}
      <StatsGrid>
        <StatsCard
          title="Priskirta užsakymų"
          value={formatNumber(data?.totalAssigned || 0)}
          description="Per pasirinktą laikotarpį"
          icon={<UserCogIcon className="h-5 w-5" />}
          isLoading={isLoading}
        />
        <StatsCard
          title="Vidutiniškai"
          value={formatNumber(data?.averagePerValuator || 0)}
          description="Užsakymų per vertintoją"
          icon={<UsersIcon className="h-5 w-5" />}
          isLoading={isLoading}
        />
        <StatsCard
          title="Daugiausiai apkrautas"
          value={data?.mostLoaded?.name || "—"}
          description={data?.mostLoaded ? `${data.mostLoaded.count} užsakymų` : "Vertintojas"}
          icon={<TrendingUpIcon className="h-5 w-5" />}
          isLoading={isLoading}
        />
        <StatsCard
          title="Mažiausiai apkrautas"
          value={data?.leastLoaded?.name || "—"}
          description={data?.leastLoaded ? `${data.leastLoaded.count} užsakymų` : "Vertintojas"}
          icon={<TrendingDownIcon className="h-5 w-5" />}
          isLoading={isLoading}
        />
      </StatsGrid>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <ChartWrapper
          title="Užsakymai pagal vertintoją"
          description="Vertintojų apkrovimas"
          isLoading={isLoading}
          error={error}
          onRetry={handleRetry}
          isEmpty={!data?.byValuator?.length}
          emptyMessage="Nėra priskirtų užsakymų"
        >
          {data?.byValuator && data.byValuator.length > 0 && (
            <SimpleBarChart
              data={data.byValuator}
              layout="vertical"
              color={CHART_COLORS.primary}
              dataKeyLabel="Užsakymai"
              formatValue={(v) => formatNumber(v)}
            />
          )}
        </ChartWrapper>

        <ChartWrapper
          title="Apkrovimas per laikotarpį"
          description="Top 5 vertintojų dinamika"
          isLoading={isLoading}
          error={error}
          onRetry={handleRetry}
          isEmpty={!data?.timeline?.length || areaChartConfig.length === 0}
          emptyMessage="Nėra duomenų"
        >
          {data?.timeline && areaChartConfig.length > 0 && (
            <StackedAreaChart
              data={data.timeline}
              areas={areaChartConfig}
              formatValue={(v) => formatNumber(v)}
            />
          )}
        </ChartWrapper>
      </div>

      {/* Ranking table */}
      {data?.ranking && data.ranking.length > 0 && (
        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-base font-semibold text-gray-900 mb-4">
            Vertintojų reitingas pagal atliktų užsakymų skaičių
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-gray-600">
                    #
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">
                    Vertintojas
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">
                    Kodas
                  </th>
                  <th className="text-right py-3 px-4 font-medium text-gray-600">
                    Atlikta
                  </th>
                  <th className="text-right py-3 px-4 font-medium text-gray-600">
                    Vykdoma
                  </th>
                  <th className="text-right py-3 px-4 font-medium text-gray-600">
                    Viso
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.ranking.map((item, index) => (
                  <tr key={item.id} className="border-b last:border-0">
                    <td className="py-3 px-4 text-gray-500">{index + 1}</td>
                    <td className="py-3 px-4 font-medium">{item.name}</td>
                    <td className="py-3 px-4 text-gray-500">{item.code}</td>
                    <td className="text-right py-3 px-4 text-green-600 font-medium">
                      {formatNumber(item.completedOrders)}
                    </td>
                    <td className="text-right py-3 px-4 text-blue-600">
                      {formatNumber(item.inProgressOrders)}
                    </td>
                    <td className="text-right py-3 px-4 font-semibold">
                      {formatNumber(item.totalOrders)}
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
