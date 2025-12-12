"use client";

import * as React from "react";
import { StatsCard, StatsGrid } from "./StatsCard";
import { ChartWrapper } from "@/components/charts/ChartWrapper";
import { TimeSeriesBarChart } from "@/components/charts/BarChart";
import { SimplePieChart } from "@/components/charts/PieChart";
import { CHART_COLORS } from "@/lib/chart-colors";
import type { DateFilter, RevenueStatsData } from "@/types";
import { formatCurrency, formatNumber } from "@/lib/report-utils";
import { BanknoteIcon, TrendingUpIcon, BarChart3Icon, TargetIcon } from "lucide-react";

interface RevenueStatsProps {
  dateFilter: DateFilter;
}

export function RevenueStats({ dateFilter }: RevenueStatsProps) {
  const [data, setData] = React.useState<RevenueStatsData | null>(null);
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

        const response = await fetch(`/api/admin/reports/revenue?${params.toString()}`);
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

  // Add colors to service type data
  const serviceTypeDataWithColors = React.useMemo(() => {
    if (!data?.byServiceType) return [];
    const typeColors: Record<string, string> = {
      "Automatinis vertinimas": CHART_COLORS.serviceType.TYPE_1,
      "Vertintojo nustatymas": CHART_COLORS.serviceType.TYPE_2,
      "Kainos patikslinimas": CHART_COLORS.serviceType.TYPE_3,
      "Turto vertinimas": CHART_COLORS.serviceType.TYPE_4,
    };
    return data.byServiceType.map((item) => ({
      ...item,
      color: typeColors[item.name] || CHART_COLORS.gray,
    }));
  }, [data?.byServiceType]);

  const handleRetry = () => {
    setData(null);
    setIsLoading(true);
  };

  return (
    <>
      {/* Stats Grid */}
      <StatsGrid>
        <StatsCard
          title="Bendros pajamos"
          value={formatCurrency(data?.totalRevenue || 0)}
          description="Per pasirinktą laikotarpį"
          icon={<BanknoteIcon className="h-5 w-5" />}
          isLoading={isLoading}
        />
        <StatsCard
          title="Vidutinė užsakymo vertė"
          value={formatCurrency(data?.averageOrderValue || 0)}
          description="Per užsakymą"
          icon={<BarChart3Icon className="h-5 w-5" />}
          isLoading={isLoading}
        />
        <StatsCard
          title="Prognozuojamos pajamos"
          value={formatCurrency(data?.projectedRevenue || 0)}
          description="Ateinantis mėnuo"
          icon={<TrendingUpIcon className="h-5 w-5" />}
          isLoading={isLoading}
        />
        <StatsCard
          title="Paslaugų tipų"
          value={formatNumber(data?.byServiceType?.length || 0)}
          description="Su pajamomis"
          icon={<TargetIcon className="h-5 w-5" />}
          isLoading={isLoading}
        />
      </StatsGrid>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <ChartWrapper
          title="Pajamos per laikotarpį"
          description="Pajamų dinamika"
          isLoading={isLoading}
          error={error}
          onRetry={handleRetry}
          isEmpty={!data?.timeline?.length}
          emptyMessage="Nėra pajamų per pasirinktą laikotarpį"
        >
          {data?.timeline && (
            <TimeSeriesBarChart
              data={data.timeline}
              color={CHART_COLORS.success}
              dataKeyLabel="Pajamos"
              formatValue={(v) => `${v} €`}
            />
          )}
        </ChartWrapper>

        <ChartWrapper
          title="Pajamos pagal paslaugos tipą"
          description="Pajamų šaltiniai"
          isLoading={isLoading}
          error={error}
          onRetry={handleRetry}
          isEmpty={!data?.byServiceType?.length}
          emptyMessage="Nėra duomenų"
        >
          {serviceTypeDataWithColors.length > 0 && (
            <SimplePieChart
              data={serviceTypeDataWithColors}
              innerRadius={50}
              outerRadius={90}
              showLabel={true}
              formatValue={(v) => formatCurrency(v)}
            />
          )}
        </ChartWrapper>
      </div>

      {/* Revenue breakdown table */}
      {data?.byServiceType && data.byServiceType.length > 0 && (
        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-base font-semibold text-gray-900 mb-4">
            Pajamų pasiskirstymas pagal paslaugos tipą
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-gray-600">
                    Paslaugos tipas
                  </th>
                  <th className="text-right py-3 px-4 font-medium text-gray-600">
                    Pajamos
                  </th>
                  <th className="text-right py-3 px-4 font-medium text-gray-600">
                    Dalis
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.byServiceType.map((item, index) => {
                  const percentage =
                    data.totalRevenue > 0
                      ? ((item.value / data.totalRevenue) * 100).toFixed(1)
                      : "0";
                  return (
                    <tr key={index} className="border-b last:border-0">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{
                              backgroundColor:
                                serviceTypeDataWithColors[index]?.color ||
                                CHART_COLORS.gray,
                            }}
                          />
                          {item.name}
                        </div>
                      </td>
                      <td className="text-right py-3 px-4 font-medium">
                        {formatCurrency(item.value)}
                      </td>
                      <td className="text-right py-3 px-4 text-gray-500">
                        {percentage}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="bg-gray-50">
                  <td className="py-3 px-4 font-semibold">Viso</td>
                  <td className="text-right py-3 px-4 font-semibold">
                    {formatCurrency(data.totalRevenue)}
                  </td>
                  <td className="text-right py-3 px-4 text-gray-500">100%</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}
    </>
  );
}
