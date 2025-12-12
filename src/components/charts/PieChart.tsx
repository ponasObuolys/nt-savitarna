"use client";

import * as React from "react";
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  type PieLabelRenderProps,
} from "recharts";
import { CHART_COLORS } from "@/lib/chart-colors";
import type { ChartDataPoint } from "@/types";

interface SimplePieChartProps {
  data: ChartDataPoint[];
  height?: number;
  innerRadius?: number;
  outerRadius?: number;
  showLabel?: boolean;
  showLegend?: boolean;
  showTooltip?: boolean;
  colors?: string[];
  formatValue?: (value: number) => string;
}

// Custom label renderer for pie slices
const renderCustomLabel = (props: PieLabelRenderProps): React.ReactElement | null => {
  const { cx, cy, midAngle, innerRadius, outerRadius, percent } = props;

  // Ensure all values are numbers
  if (
    typeof cx !== "number" ||
    typeof cy !== "number" ||
    typeof midAngle !== "number" ||
    typeof innerRadius !== "number" ||
    typeof outerRadius !== "number" ||
    typeof percent !== "number"
  ) {
    return null;
  }

  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  // Only show label if segment is large enough
  if (percent < 0.05) return null;

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor="middle"
      dominantBaseline="central"
      style={{ fontSize: "12px", fontWeight: 500 }}
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export function SimplePieChart({
  data,
  height = 300,
  innerRadius = 0,
  outerRadius = 100,
  showLabel = true,
  showLegend = true,
  showTooltip = true,
  colors,
  formatValue,
}: SimplePieChartProps) {
  const chartColors = colors || CHART_COLORS.palette;

  // Cast data to match Recharts expected type
  const chartData = data as Array<{ name: string; value: number; color?: string }>;

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsPieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={showLabel ? renderCustomLabel : undefined}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          fill="#8884d8"
          dataKey="value"
          nameKey="name"
        >
          {chartData.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={entry.color || chartColors[index % chartColors.length]}
            />
          ))}
        </Pie>
        {showTooltip && (
          <Tooltip
            contentStyle={{
              backgroundColor: "white",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
            }}
            formatter={(value: number, name: string) => [
              formatValue ? formatValue(value) : value,
              name,
            ]}
          />
        )}
        {showLegend && (
          <Legend
            layout="vertical"
            align="right"
            verticalAlign="middle"
            wrapperStyle={{ paddingLeft: "20px" }}
            formatter={(value) => (
              <span style={{ color: "#374151", fontSize: "14px" }}>
                {value}
              </span>
            )}
          />
        )}
      </RechartsPieChart>
    </ResponsiveContainer>
  );
}

// Donut chart variant
interface DonutChartProps extends SimplePieChartProps {
  centerLabel?: string;
  centerValue?: string | number;
}

export function DonutChart({
  data,
  height = 300,
  innerRadius = 60,
  outerRadius = 100,
  showLabel = false,
  showLegend = true,
  showTooltip = true,
  colors,
  formatValue,
  centerLabel,
  centerValue,
}: DonutChartProps) {
  const chartColors = colors || CHART_COLORS.palette;

  // Cast data to match Recharts expected type
  const chartData = data as Array<{ name: string; value: number; color?: string }>;

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsPieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={showLabel ? renderCustomLabel : undefined}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          fill="#8884d8"
          dataKey="value"
          nameKey="name"
        >
          {chartData.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={entry.color || chartColors[index % chartColors.length]}
            />
          ))}
        </Pie>
        {showTooltip && (
          <Tooltip
            contentStyle={{
              backgroundColor: "white",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
            }}
            formatter={(value: number, name: string) => [
              formatValue ? formatValue(value) : value,
              name,
            ]}
          />
        )}
        {showLegend && (
          <Legend
            layout="vertical"
            align="right"
            verticalAlign="middle"
            wrapperStyle={{ paddingLeft: "20px" }}
          />
        )}
        {/* Center text for donut */}
        {(centerLabel || centerValue) && (
          <text
            x="50%"
            y="50%"
            textAnchor="middle"
            dominantBaseline="middle"
          >
            {centerValue && (
              <tspan
                x="50%"
                dy="-0.5em"
                style={{ fontSize: "24px", fontWeight: 700, fill: "#111827" }}
              >
                {centerValue}
              </tspan>
            )}
            {centerLabel && (
              <tspan
                x="50%"
                dy={centerValue ? "1.5em" : "0"}
                style={{ fontSize: "12px", fill: "#6b7280" }}
              >
                {centerLabel}
              </tspan>
            )}
          </text>
        )}
      </RechartsPieChart>
    </ResponsiveContainer>
  );
}
