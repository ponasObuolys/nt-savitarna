"use client";

import * as React from "react";
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { CHART_COLORS } from "@/lib/chart-colors";
import type { ChartDataPoint, TimeSeriesDataPoint } from "@/types";
import { formatDateLt } from "@/lib/report-utils";

interface SimpleBarChartProps {
  data: ChartDataPoint[];
  height?: number;
  color?: string;
  showGrid?: boolean;
  showTooltip?: boolean;
  showLegend?: boolean;
  barSize?: number;
  layout?: "vertical" | "horizontal";
  colors?: string[];
  formatValue?: (value: number) => string;
  dataKeyLabel?: string;
}

export function SimpleBarChart({
  data,
  height = 300,
  color = CHART_COLORS.primary,
  showGrid = true,
  showTooltip = true,
  showLegend = false,
  barSize = 30,
  layout = "horizontal",
  colors,
  formatValue,
  dataKeyLabel = "Reikšmė",
}: SimpleBarChartProps) {
  const isVertical = layout === "vertical";
  const chartColors = colors || CHART_COLORS.palette;

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsBarChart
        data={data}
        layout={layout}
        margin={{
          top: 5,
          right: 20,
          left: isVertical ? 100 : 10,
          bottom: 5,
        }}
      >
        {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />}
        {isVertical ? (
          <>
            <XAxis
              type="number"
              tick={{ fontSize: 12, fill: "#6b7280" }}
              tickLine={{ stroke: "#e5e7eb" }}
              axisLine={{ stroke: "#e5e7eb" }}
              tickFormatter={formatValue}
            />
            <YAxis
              dataKey="name"
              type="category"
              tick={{ fontSize: 12, fill: "#6b7280" }}
              tickLine={{ stroke: "#e5e7eb" }}
              axisLine={{ stroke: "#e5e7eb" }}
              width={90}
            />
          </>
        ) : (
          <>
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
          </>
        )}
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
        {showLegend && (
          <Legend
            wrapperStyle={{ paddingTop: "10px" }}
            formatter={() => dataKeyLabel}
          />
        )}
        <Bar
          dataKey="value"
          fill={color}
          barSize={barSize}
          radius={[4, 4, 0, 0]}
          name={dataKeyLabel}
        >
          {colors &&
            data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.color || chartColors[index % chartColors.length]}
              />
            ))}
        </Bar>
      </RechartsBarChart>
    </ResponsiveContainer>
  );
}

// Time series bar chart
interface TimeSeriesBarChartProps {
  data: TimeSeriesDataPoint[];
  height?: number;
  color?: string;
  showGrid?: boolean;
  showTooltip?: boolean;
  barSize?: number;
  formatValue?: (value: number) => string;
  dataKeyLabel?: string;
}

export function TimeSeriesBarChart({
  data,
  height = 300,
  color = CHART_COLORS.primary,
  showGrid = true,
  showTooltip = true,
  barSize = 20,
  formatValue,
  dataKeyLabel = "Reikšmė",
}: TimeSeriesBarChartProps) {
  // Format date for display
  const formattedData = React.useMemo(() => {
    return data.map((item) => ({
      ...item,
      displayDate: formatDateLt(item.date, "short"),
    }));
  }, [data]);

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsBarChart
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
        <Bar
          dataKey="value"
          fill={color}
          barSize={barSize}
          radius={[4, 4, 0, 0]}
          name={dataKeyLabel}
        />
      </RechartsBarChart>
    </ResponsiveContainer>
  );
}

// Stacked bar chart for multiple data series
interface StackedBarConfig {
  dataKey: string;
  label: string;
  color: string;
  stackId?: string;
}

interface StackedBarChartProps {
  data: Array<{ name: string; [key: string]: string | number }>;
  bars: StackedBarConfig[];
  height?: number;
  showGrid?: boolean;
  showTooltip?: boolean;
  showLegend?: boolean;
  barSize?: number;
  formatValue?: (value: number) => string;
}

export function StackedBarChart({
  data,
  bars,
  height = 300,
  showGrid = true,
  showTooltip = true,
  showLegend = true,
  barSize = 30,
  formatValue,
}: StackedBarChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsBarChart
        data={data}
        margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
      >
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
            formatter={(value: number, name: string) => {
              const bar = bars.find((b) => b.dataKey === name);
              return [
                formatValue ? formatValue(value) : value,
                bar?.label || name,
              ];
            }}
          />
        )}
        {showLegend && (
          <Legend
            wrapperStyle={{ paddingTop: "10px" }}
            formatter={(value) => {
              const bar = bars.find((b) => b.dataKey === value);
              return bar?.label || value;
            }}
          />
        )}
        {bars.map((bar) => (
          <Bar
            key={bar.dataKey}
            dataKey={bar.dataKey}
            fill={bar.color}
            stackId={bar.stackId}
            barSize={barSize}
            radius={bar.stackId ? [0, 0, 0, 0] : [4, 4, 0, 0]}
            name={bar.dataKey}
          />
        ))}
      </RechartsBarChart>
    </ResponsiveContainer>
  );
}
