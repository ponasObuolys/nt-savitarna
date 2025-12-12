"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, RefreshCw, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ValuatorCard } from "@/components/admin/ValuatorCard";
import { ValuatorOrdersList } from "@/components/admin/ValuatorOrdersList";
import type { ValuatorWithStats, Order, TimeSeriesDataPoint } from "@/types";

interface Filters {
  status?: string;
  dateFrom?: string;
  dateTo?: string;
}

export default function ValuatorDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [valuator, setValuator] = useState<ValuatorWithStats | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [monthlyStats, setMonthlyStats] = useState<TimeSeriesDataPoint[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<Filters>({});

  const fetchValuator = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("page", page.toString());
      params.set("pageSize", pageSize.toString());
      if (filters.status) params.set("status", filters.status);
      if (filters.dateFrom) params.set("dateFrom", filters.dateFrom);
      if (filters.dateTo) params.set("dateTo", filters.dateTo);

      const response = await fetch(`/api/admin/valuators/${id}?${params}`);
      const data = await response.json();

      if (data.success) {
        setValuator(data.data.valuator);
        setOrders(data.data.orders);
        setTotal(data.data.total);
        setMonthlyStats(data.data.monthlyStats || []);
      }
    } catch (error) {
      console.error("Error fetching valuator:", error);
    } finally {
      setLoading(false);
    }
  }, [id, page, pageSize, filters]);

  useEffect(() => {
    if (id) {
      fetchValuator();
    }
  }, [id, fetchValuator]);

  const handleFilterChange = (newFilters: Filters) => {
    setFilters(newFilters);
    setPage(1); // Reset to first page
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  if (loading && !valuator) {
    return (
      <div className="flex items-center justify-center py-12">
        <RefreshCw className="h-8 w-8 text-gray-400 animate-spin" />
      </div>
    );
  }

  if (!valuator) {
    return (
      <div className="text-center py-12">
        <User className="h-12 w-12 mx-auto text-gray-400 mb-4" />
        <h2 className="text-lg font-medium text-gray-900">Vertintojas nerastas</h2>
        <p className="text-gray-500 mt-1">Patikrinkite ar nurodytas teisingas ID</p>
        <Link href="/admin/valuators">
          <Button variant="outline" className="mt-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Grįžti į sąrašą
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Link
            href="/admin/valuators"
            className="text-sm text-blue-600 hover:underline flex items-center gap-1 mb-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Grįžti į vertintojų sąrašą
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">
            {valuator.first_name} {valuator.last_name}
          </h1>
          <p className="text-gray-500 mt-1">
            Vertintojo kodas: <code className="bg-gray-100 px-1.5 py-0.5 rounded">{valuator.code}</code>
          </p>
        </div>
        <Button variant="outline" onClick={fetchValuator} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
          Atnaujinti
        </Button>
      </div>

      {/* Valuator Card with Stats */}
      <ValuatorCard valuator={valuator} monthlyStats={monthlyStats} />

      {/* Orders List */}
      <ValuatorOrdersList
        orders={orders}
        total={total}
        page={page}
        pageSize={pageSize}
        onFilterChange={handleFilterChange}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
