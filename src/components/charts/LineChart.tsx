"use client";

import * as React from "react";
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { CHART_COLORS } from "@/lib/chart-colors";
import type { TimeSeriesDataPoint } from "@/types";
import { formatDateLt } from "@/lib/report-utils";

interface SimpleLineChartProps {
  data: TimeSeriesDataPoint[];
  height?: number;
  color?: string;
  showGrid?: boolean;
  showTooltip?: boolean;
  showLegend?: boolean;
  dataKeyLabel?: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
  formatYAxis?: (value: number) => string;
  formatTooltip?: (value: number) => string;
}

export function SimpleLineChart({
  data,
  height = 300,
  color = CHART_COLORS.primary,
  showGrid = true,
  showTooltip = true,
  showLegend = false,
  dataKeyLabel = "Reikšmė",
  formatYAxis,
  formatTooltip,
}: SimpleLineChartProps) {
  // Format date for display
  const formattedData = React.useMemo(() => {
    return data.map((item) => ({
      ...item,
      displayDate: formatDateLt(item.date, "short"),
    }));
  }, [data]);

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsLineChart
        data={formattedData}
        margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
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
          tickFormatter={formatYAxis}
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
              formatTooltip ? formatTooltip(value) : value,
              dataKeyLabel,
            ]}
          />
        )}
        {showLegend && (
          <Legend
            wrapperStyle={{ paddingTop: "10px" }}
            formatter={() => dataKeyLabel}
          />
        )}
        <Line
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={2}
          dot={{ r: 3, fill: color }}
          activeDot={{ r: 5, fill: color }}
          name={dataKeyLabel}
        />
      </RechartsLineChart>
    </ResponsiveContainer>
  );
}

// Multi-line chart for multiple data series
interface MultiLineChartData {
  date: string;
  [key: string]: string | number;
}

interface LineConfig {
  dataKey: string;
  label: string;
  color: string;
  strokeDasharray?: string;
}

interface MultiLineChartProps {
  data: MultiLineChartData[];
  lines: LineConfig[];
  height?: number;
  showGrid?: boolean;
  showTooltip?: boolean;
  showLegend?: boolean;
  formatYAxis?: (value: number) => string;
  formatTooltip?: (value: number) => string;
}

export function MultiLineChart({
  data,
  lines,
  height = 300,
  showGrid = true,
  showTooltip = true,
  showLegend = true,
  formatYAxis,
  formatTooltip,
}: MultiLineChartProps) {
  // Format date for display
  const formattedData = React.useMemo(() => {
    return data.map((item) => ({
      ...item,
      displayDate: formatDateLt(item.date, "short"),
    }));
  }, [data]);

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsLineChart
        data={formattedData}
        margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
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
          tickFormatter={formatYAxis}
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
              const line = lines.find((l) => l.dataKey === name);
              return [
                formatTooltip ? formatTooltip(value) : value,
                line?.label || name,
              ];
            }}
          />
        )}
        {showLegend && (
          <Legend
            wrapperStyle={{ paddingTop: "10px" }}
            formatter={(value) => {
              const line = lines.find((l) => l.dataKey === value);
              return line?.label || value;
            }}
          />
        )}
        {lines.map((line) => (
          <Line
            key={line.dataKey}
            type="monotone"
            dataKey={line.dataKey}
            stroke={line.color}
            strokeWidth={2}
            strokeDasharray={line.strokeDasharray}
            dot={{ r: 3, fill: line.color }}
            activeDot={{ r: 5, fill: line.color }}
            name={line.dataKey}
          />
        ))}
      </RechartsLineChart>
    </ResponsiveContainer>
  );
}
