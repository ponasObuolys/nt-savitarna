"use client";

import * as React from "react";
import { StatsCard, StatsGrid } from "./StatsCard";
import { ChartWrapper } from "@/components/charts/ChartWrapper";
import { SimpleLineChart } from "@/components/charts/LineChart";
import { SimplePieChart } from "@/components/charts/PieChart";
import { SimpleBarChart } from "@/components/charts/BarChart";
import { CHART_COLORS } from "@/lib/chart-colors";
import type { DateFilter, OrdersStatsData } from "@/types";
import { formatNumber } from "@/lib/report-utils";
import { ClipboardListIcon } from "lucide-react";

interface OrdersStatsProps {
  dateFilter: DateFilter;
}

export function OrdersStats({ dateFilter }: OrdersStatsProps) {
  const [data, setData] = React.useState<OrdersStatsData | null>(null);
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

        const response = await fetch(`/api/admin/reports/orders?${params.toString()}`);
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

  // Calculate stats
  const totalOrders = data?.total || 0;
  const completedOrders = data?.byStatus?.find((s) => s.name === "Atlikta")?.value || 0;
  const paidOrders = data?.byStatus?.find((s) => s.name === "Apmokėta")?.value || 0;
  const pendingOrders = data?.byStatus?.find((s) => s.name === "Laukiama")?.value || 0;

  // Add colors to status data
  const statusDataWithColors = React.useMemo(() => {
    if (!data?.byStatus) return [];
    const statusColors: Record<string, string> = {
      Atlikta: CHART_COLORS.status.done,
      Apmokėta: CHART_COLORS.status.paid,
      Laukiama: CHART_COLORS.status.pending,
      Nepavyko: CHART_COLORS.status.failed,
    };
    return data.byStatus.map((item) => ({
      ...item,
      color: statusColors[item.name] || CHART_COLORS.gray,
    }));
  }, [data?.byStatus]);

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
    // Trigger re-fetch by updating a dependency
    const event = new Event("retry");
    window.dispatchEvent(event);
  };

  return (
    <>
      {/* Stats Grid */}
      <StatsGrid>
        <StatsCard
          title="Viso užsakymų"
          value={formatNumber(totalOrders)}
          description="Per pasirinktą laikotarpį"
          icon={<ClipboardListIcon className="h-5 w-5" />}
          isLoading={isLoading}
        />
        <StatsCard
          title="Atlikta"
          value={formatNumber(completedOrders)}
          description="Užbaigti užsakymai"
          icon={<ClipboardListIcon className="h-5 w-5" />}
          isLoading={isLoading}
        />
        <StatsCard
          title="Apmokėta"
          value={formatNumber(paidOrders)}
          description="Vykdomi užsakymai"
          icon={<ClipboardListIcon className="h-5 w-5" />}
          isLoading={isLoading}
        />
        <StatsCard
          title="Laukiama"
          value={formatNumber(pendingOrders)}
          description="Laukiantys apmokėjimo"
          icon={<ClipboardListIcon className="h-5 w-5" />}
          isLoading={isLoading}
        />
      </StatsGrid>

      {/* Charts Row 1 */}
      <div className="grid gap-6 lg:grid-cols-2">
        <ChartWrapper
          title="Užsakymai per laikotarpį"
          description="Užsakymų skaičius pagal dieną/savaitę/mėnesį"
          isLoading={isLoading}
          error={error}
          onRetry={handleRetry}
          isEmpty={!data?.timeline?.length}
          emptyMessage="Nėra užsakymų per pasirinktą laikotarpį"
        >
          {data?.timeline && (
            <SimpleLineChart
              data={data.timeline}
              color={CHART_COLORS.primary}
              dataKeyLabel="Užsakymai"
            />
          )}
        </ChartWrapper>

        <ChartWrapper
          title="Pagal paslaugos tipą"
          description="Užsakymų pasiskirstymas"
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
              formatValue={(v) => formatNumber(v)}
            />
          )}
        </ChartWrapper>
      </div>

      {/* Charts Row 2 */}
      <div className="grid gap-6 lg:grid-cols-2">
        <ChartWrapper
          title="Pagal statusą"
          description="Užsakymų būsenos"
          isLoading={isLoading}
          error={error}
          onRetry={handleRetry}
          isEmpty={!data?.byStatus?.length}
          emptyMessage="Nėra duomenų"
        >
          {statusDataWithColors.length > 0 && (
            <SimplePieChart
              data={statusDataWithColors}
              innerRadius={50}
              outerRadius={90}
              showLabel={true}
              formatValue={(v) => formatNumber(v)}
            />
          )}
        </ChartWrapper>

        <ChartWrapper
          title="Pagal savivaldybę"
          description="Top 10 savivaldybių"
          isLoading={isLoading}
          error={error}
          onRetry={handleRetry}
          isEmpty={!data?.byMunicipality?.length}
          emptyMessage="Nėra duomenų"
        >
          {data?.byMunicipality && data.byMunicipality.length > 0 && (
            <SimpleBarChart
              data={data.byMunicipality}
              layout="vertical"
              color={CHART_COLORS.primary}
              dataKeyLabel="Užsakymai"
              formatValue={(v) => formatNumber(v)}
            />
          )}
        </ChartWrapper>
      </div>

      {/* Charts Row 3 - Property Type */}
      {data?.byPropertyType && data.byPropertyType.length > 0 && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartWrapper
            title="Pagal turto tipą"
            description="Vertinamų objektų kategorijos"
            isLoading={isLoading}
            error={error}
            onRetry={handleRetry}
            isEmpty={!data?.byPropertyType?.length}
            emptyMessage="Nėra duomenų"
          >
            <SimplePieChart
              data={data.byPropertyType}
              innerRadius={50}
              outerRadius={90}
              showLabel={true}
              formatValue={(v) => formatNumber(v)}
            />
          </ChartWrapper>
        </div>
      )}
    </>
  );
}
