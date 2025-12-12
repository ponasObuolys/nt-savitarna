"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChartWrapperProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  isEmpty?: boolean;
  emptyMessage?: string;
  height?: number | string;
  actions?: React.ReactNode;
}

export function ChartWrapper({
  title,
  description,
  children,
  className,
  isLoading = false,
  error = null,
  onRetry,
  isEmpty = false,
  emptyMessage = "Nėra duomenų",
  height = 300,
  actions,
}: ChartWrapperProps) {
  const chartHeight = typeof height === "number" ? `${height}px` : height;

  return (
    <Card className={cn("", className)}>
      <CardHeader className="flex flex-row items-start justify-between pb-2">
        <div>
          <CardTitle className="text-base font-semibold">{title}</CardTitle>
          {description && (
            <CardDescription className="text-sm text-gray-500 mt-1">
              {description}
            </CardDescription>
          )}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </CardHeader>
      <CardContent>
        <div style={{ height: chartHeight }} className="relative">
          {isLoading && <ChartSkeleton height={chartHeight} />}

          {error && !isLoading && (
            <ChartError error={error} onRetry={onRetry} height={chartHeight} />
          )}

          {isEmpty && !isLoading && !error && (
            <ChartEmpty message={emptyMessage} height={chartHeight} />
          )}

          {!isLoading && !error && !isEmpty && children}
        </div>
      </CardContent>
    </Card>
  );
}

// Loading skeleton for charts
function ChartSkeleton({ height }: { height: string | number }) {
  return (
    <div
      className="absolute inset-0 flex items-center justify-center bg-gray-50 rounded-lg animate-pulse"
      style={{ height }}
    >
      <div className="flex flex-col items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-gray-200" />
        <div className="text-sm text-gray-400">Kraunama...</div>
      </div>
    </div>
  );
}

// Error state for charts
function ChartError({
  error,
  onRetry,
  height,
}: {
  error: string;
  onRetry?: () => void;
  height: string | number;
}) {
  return (
    <div
      className="absolute inset-0 flex items-center justify-center bg-red-50 rounded-lg"
      style={{ height }}
    >
      <div className="flex flex-col items-center gap-3 text-center px-4">
        <AlertCircle className="w-10 h-10 text-red-400" />
        <div className="text-sm text-red-600">{error}</div>
        {onRetry && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRetry}
            className="gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Bandyti dar kartą
          </Button>
        )}
      </div>
    </div>
  );
}

// Empty state for charts
function ChartEmpty({
  message,
  height,
}: {
  message: string;
  height: string | number;
}) {
  return (
    <div
      className="absolute inset-0 flex items-center justify-center bg-gray-50 rounded-lg"
      style={{ height }}
    >
      <div className="flex flex-col items-center gap-2 text-center px-4">
        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
          <svg
            className="w-8 h-8 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
        </div>
        <p className="text-sm text-gray-500">{message}</p>
      </div>
    </div>
  );
}

// Simple chart container without card
interface ChartContainerProps {
  children: React.ReactNode;
  className?: string;
  height?: number | string;
  isLoading?: boolean;
}

export function ChartContainer({
  children,
  className,
  height = 300,
  isLoading = false,
}: ChartContainerProps) {
  const chartHeight = typeof height === "number" ? `${height}px` : height;

  return (
    <div
      className={cn("relative", className)}
      style={{ height: chartHeight }}
    >
      {isLoading ? <ChartSkeleton height={chartHeight} /> : children}
    </div>
  );
}

// Responsive container helper for Recharts
interface ResponsiveChartProps {
  children: React.ReactNode;
  aspectRatio?: number;
  minHeight?: number;
  maxHeight?: number;
}

export function ResponsiveChart({
  children,
  aspectRatio = 16 / 9,
  minHeight = 200,
  maxHeight = 400,
}: ResponsiveChartProps) {
  return (
    <div
      className="w-full"
      style={{
        aspectRatio: `${aspectRatio}`,
        minHeight: `${minHeight}px`,
        maxHeight: `${maxHeight}px`,
      }}
    >
      {children}
    </div>
  );
}
