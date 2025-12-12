"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowUpIcon,
  ArrowDownIcon,
  MinusIcon,
} from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  trend?: {
    value: number;
    label?: string;
    isPositiveGood?: boolean;
  };
  icon?: React.ReactNode;
  className?: string;
  isLoading?: boolean;
}

export function StatsCard({
  title,
  value,
  description,
  trend,
  icon,
  className,
  isLoading = false,
}: StatsCardProps) {
  // Determine trend direction and color
  const getTrendDisplay = () => {
    if (!trend) return null;

    const { value: trendValue, label, isPositiveGood = true } = trend;
    const isPositive = trendValue > 0;
    const isNeutral = trendValue === 0;
    const isGood = isPositiveGood ? isPositive : !isPositive;

    let TrendIcon = MinusIcon;
    let colorClass = "text-gray-500";

    if (!isNeutral) {
      TrendIcon = isPositive ? ArrowUpIcon : ArrowDownIcon;
      colorClass = isGood ? "text-green-600" : "text-red-600";
    }

    return (
      <div className={cn("flex items-center gap-1 text-sm", colorClass)}>
        <TrendIcon className="h-4 w-4" />
        <span className="font-medium">
          {isPositive ? "+" : ""}
          {trendValue.toFixed(1)}%
        </span>
        {label && <span className="text-gray-500">{label}</span>}
      </div>
    );
  };

  if (isLoading) {
    return (
      <Card className={cn("", className)}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
          <div className="h-8 w-8 bg-gray-200 rounded animate-pulse" />
        </CardHeader>
        <CardContent>
          <div className="h-8 w-32 bg-gray-200 rounded animate-pulse mb-2" />
          <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">
          {title}
        </CardTitle>
        {icon && (
          <div className="h-8 w-8 flex items-center justify-center rounded-lg bg-blue-50 text-blue-600">
            {icon}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-gray-900">{value}</div>
        {(description || trend) && (
          <div className="mt-1 flex items-center gap-2">
            {getTrendDisplay()}
            {description && (
              <p className="text-sm text-gray-500">{description}</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Variant with mini sparkline
interface StatsCardWithSparklineProps extends StatsCardProps {
  sparklineData?: number[];
}

export function StatsCardWithSparkline({
  sparklineData,
  ...props
}: StatsCardWithSparklineProps) {
  return (
    <Card className={cn("", props.className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">
          {props.title}
        </CardTitle>
        {props.icon && (
          <div className="h-8 w-8 flex items-center justify-center rounded-lg bg-blue-50 text-blue-600">
            {props.icon}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="flex items-end justify-between">
          <div>
            <div className="text-2xl font-bold text-gray-900">{props.value}</div>
            {props.description && (
              <p className="text-sm text-gray-500 mt-1">{props.description}</p>
            )}
          </div>
          {sparklineData && sparklineData.length > 0 && (
            <MiniSparkline data={sparklineData} />
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Simple mini sparkline using SVG
function MiniSparkline({ data }: { data: number[] }) {
  const width = 60;
  const height = 30;
  const padding = 2;

  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  const points = data
    .map((value, index) => {
      const x = padding + (index / (data.length - 1)) * (width - padding * 2);
      const y = padding + (1 - (value - min) / range) * (height - padding * 2);
      return `${x},${y}`;
    })
    .join(" ");

  const isPositiveTrend = data.length >= 2 && data[data.length - 1] >= data[0];

  return (
    <svg
      width={width}
      height={height}
      className="overflow-visible"
      viewBox={`0 0 ${width} ${height}`}
    >
      <polyline
        fill="none"
        stroke={isPositiveTrend ? "#22c55e" : "#ef4444"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  );
}

// Grid container for stats cards
interface StatsGridProps {
  children: React.ReactNode;
  className?: string;
}

export function StatsGrid({ children, className }: StatsGridProps) {
  return (
    <div
      className={cn(
        "grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
        className
      )}
    >
      {children}
    </div>
  );
}
