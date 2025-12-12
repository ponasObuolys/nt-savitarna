"use client";

import * as React from "react";
import { StatsCard, StatsGrid } from "./StatsCard";
import { ChartWrapper } from "@/components/charts/ChartWrapper";
import { SimpleBarChart } from "@/components/charts/BarChart";
import { CHART_COLORS } from "@/lib/chart-colors";
import type { DateFilter, GeographyStatsData } from "@/types";
import { formatNumber } from "@/lib/report-utils";
import { MapPinIcon, BuildingIcon, GlobeIcon, MapIcon } from "lucide-react";

interface GeographyStatsProps {
  dateFilter: DateFilter;
}

export function GeographyStats({ dateFilter }: GeographyStatsProps) {
  const [data, setData] = React.useState<GeographyStatsData | null>(null);
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

        const response = await fetch(`/api/admin/reports/geography?${params.toString()}`);
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

  // Find top municipality and city
  const topMunicipality = data?.byMunicipality?.[0];
  const topCity = data?.byCity?.[0];
  const municipalitiesCount = data?.byMunicipality?.filter((m) => m.name !== "Nenurodyta").length || 0;
  const citiesCount = data?.byCity?.filter((c) => c.name !== "Nenurodyta").length || 0;

  const handleRetry = () => {
    setData(null);
    setIsLoading(true);
  };

  return (
    <>
      {/* Stats Grid */}
      <StatsGrid>
        <StatsCard
          title="Savivaldybių"
          value={formatNumber(municipalitiesCount)}
          description="Su užsakymais"
          icon={<GlobeIcon className="h-5 w-5" />}
          isLoading={isLoading}
        />
        <StatsCard
          title="Miestų"
          value={formatNumber(citiesCount)}
          description="Su užsakymais"
          icon={<BuildingIcon className="h-5 w-5" />}
          isLoading={isLoading}
        />
        <StatsCard
          title="Populiariausia savivaldybė"
          value={topMunicipality?.name || "—"}
          description={topMunicipality ? `${topMunicipality.value} užsakymų` : ""}
          icon={<MapPinIcon className="h-5 w-5" />}
          isLoading={isLoading}
        />
        <StatsCard
          title="Populiariausias miestas"
          value={topCity?.name || "—"}
          description={topCity ? `${topCity.value} užsakymų` : ""}
          icon={<MapIcon className="h-5 w-5" />}
          isLoading={isLoading}
        />
      </StatsGrid>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <ChartWrapper
          title="Užsakymai pagal savivaldybę"
          description="Top 15 savivaldybių"
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
              height={400}
            />
          )}
        </ChartWrapper>

        <ChartWrapper
          title="Užsakymai pagal miestą"
          description="Top 20 miestų"
          isLoading={isLoading}
          error={error}
          onRetry={handleRetry}
          isEmpty={!data?.byCity?.length}
          emptyMessage="Nėra duomenų"
        >
          {data?.byCity && data.byCity.length > 0 && (
            <SimpleBarChart
              data={data.byCity}
              layout="vertical"
              color={CHART_COLORS.secondary}
              dataKeyLabel="Užsakymai"
              formatValue={(v) => formatNumber(v)}
              height={500}
            />
          )}
        </ChartWrapper>
      </div>
    </>
  );
}
