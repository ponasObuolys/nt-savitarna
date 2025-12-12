"use client";

import * as React from "react";
import {
  AreaChart as RechartsAreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { CHART_COLORS } from "@/lib/chart-colors";
import type { MultiSeriesDataPoint } from "@/types";
import { formatDateLt } from "@/lib/report-utils";

interface AreaConfig {
  dataKey: string;
  label: string;
  color: string;
  stackId?: string;
}

interface StackedAreaChartProps {
  data: MultiSeriesDataPoint[];
  areas: AreaConfig[];
  height?: number;
  showGrid?: boolean;
  showTooltip?: boolean;
  showLegend?: boolean;
  formatValue?: (value: number) => string;
}

export function StackedAreaChart({
  data,
  areas,
  height = 300,
  showGrid = true,
  showTooltip = true,
  showLegend = true,
  formatValue,
}: StackedAreaChartProps) {
  // Format dates for display
  const formattedData = React.useMemo(() => {
    return data.map((item) => ({
      ...item,
      displayDate: formatDateLt(item.date, "short"),
    }));
  }, [data]);

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsAreaChart
        data={formattedData}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
      >
        {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />}
        <XAxis
          dataKey="displayDate"
          tick={{ fontSize: 12, fill: "#6b7280" }}
          tickLine={{ stroke: "#e5e7eb" }}
          axisLine={{ stroke: "#e5e7eb" }}
        />
        <YAxis
          tick={{ fontSize: 12, fill: "#6b7280" }}
          tickLine={{ stroke: "#e5e7eb" }}
          axisLine={{ stroke: "#e5e7eb" }}
          tickFormatter={formatValue}
        />
        {showTooltip && (
          <Tooltip
            contentStyle={{
              backgroundColor: "white",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
            }}
            labelStyle={{ color: "#374151", fontWeight: 500 }}
            formatter={(value: number, name: string) => {
              const area = areas.find((a) => a.dataKey === name);
              return [
                formatValue ? formatValue(value) : value,
                area?.label || name,
              ];
            }}
          />
        )}
        {showLegend && (
          <Legend
            wrapperStyle={{ paddingTop: "10px" }}
            formatter={(value) => {
              const area = areas.find((a) => a.dataKey === value);
              return area?.label || value;
            }}
          />
        )}
        {areas.map((area) => (
          <Area
            key={area.dataKey}
            type="monotone"
            dataKey={area.dataKey}
            stackId={area.stackId || "1"}
            stroke={area.color}
            fill={area.color}
            fillOpacity={0.6}
            name={area.dataKey}
          />
        ))}
      </RechartsAreaChart>
    </ResponsiveContainer>
  );
}

// Simple area chart (non-stacked)
interface SimpleAreaChartProps {
  data: Array<{ name: string; value: number }>;
  height?: number;
  color?: string;
  showGrid?: boolean;
  showTooltip?: boolean;
  formatValue?: (value: number) => string;
  dataKeyLabel?: string;
}

export function SimpleAreaChart({
  data,
  height = 300,
  color = CHART_COLORS.primary,
  showGrid = true,
  showTooltip = true,
  formatValue,
  dataKeyLabel = "Reikšmė",
}: SimpleAreaChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsAreaChart
        data={data}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
      >
        <defs>
          <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.3} />
            <stop offset="95%" stopColor={color} stopOpacity={0.05} />
          </linearGradient>
        </defs>
        {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />}
        <XAxis
          dataKey="name"
          tick={{ fontSize: 12, fill: "#6b7280" }}
          tickLine={{ stroke: "#e5e7eb" }}
          axisLine={{ stroke: "#e5e7eb" }}
        />
        <YAxis
          tick={{ fontSize: 12, fill: "#6b7280" }}
          tickLine={{ stroke: "#e5e7eb" }}
          axisLine={{ stroke: "#e5e7eb" }}
          tickFormatter={formatValue}
        />
        {showTooltip && (
          <Tooltip
            contentStyle={{
              backgroundColor: "white",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
            }}
            labelStyle={{ color: "#374151", fontWeight: 500 }}
            formatter={(value: number) => [
              formatValue ? formatValue(value) : value,
              dataKeyLabel,
            ]}
          />
        )}
        <Area
          type="monotone"
          dataKey="value"
          stroke={color}
          fillOpacity={1}
          fill="url(#colorValue)"
        />
      </RechartsAreaChart>
    </ResponsiveContainer>
  );
}
