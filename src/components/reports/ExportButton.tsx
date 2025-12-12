"use client";

import { useState } from "react";
import { Download, FileSpreadsheet, FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { DateFilter, ExportFormat } from "@/types";

export type ReportType = "orders" | "revenue" | "valuators" | "clients" | "geography";

interface ExportButtonProps {
  reportType: ReportType;
  dateFilter: DateFilter;
  disabled?: boolean;
}

export function ExportButton({ reportType, dateFilter, disabled = false }: ExportButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingFormat, setLoadingFormat] = useState<ExportFormat | null>(null);

  const handleExport = async (format: ExportFormat) => {
    setIsLoading(true);
    setLoadingFormat(format);

    try {
      const response = await fetch("/api/admin/reports/export", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reportType,
          format,
          filter: {
            preset: dateFilter.preset,
            dateFrom: dateFilter.dateFrom?.toISOString().split("T")[0] || null,
            dateTo: dateFilter.dateTo?.toISOString().split("T")[0] || null,
          },
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Eksporto klaida");
      }

      // Get filename from Content-Disposition header or generate default
      const contentDisposition = response.headers.get("Content-Disposition");
      let filename = `${reportType}-export.${format}`;
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?([^";\n]+)"?/);
        if (filenameMatch) {
          filename = filenameMatch[1];
        }
      }

      // Create blob and trigger download
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Export failed:", error);
      alert(error instanceof Error ? error.message : "Eksporto klaida");
    } finally {
      setIsLoading(false);
      setLoadingFormat(null);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" disabled={disabled || isLoading} size="sm">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Eksportuojama...
            </>
          ) : (
            <>
              <Download className="mr-2 h-4 w-4" />
              Eksportuoti
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => handleExport("csv")}
          disabled={isLoading}
          className="cursor-pointer"
        >
          <FileSpreadsheet className="mr-2 h-4 w-4" />
          <span>CSV formatas</span>
          {loadingFormat === "csv" && (
            <Loader2 className="ml-2 h-3 w-3 animate-spin" />
          )}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleExport("pdf")}
          disabled={isLoading}
          className="cursor-pointer"
        >
          <FileText className="mr-2 h-4 w-4" />
          <span>PDF formatas</span>
          {loadingFormat === "pdf" && (
            <Loader2 className="ml-2 h-3 w-3 animate-spin" />
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
