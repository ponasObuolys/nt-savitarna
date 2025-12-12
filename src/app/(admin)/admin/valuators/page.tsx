"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, Users, RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ValuatorTable } from "@/components/admin/ValuatorTable";
import type { ValuatorWithStats } from "@/types";

export default function ValuatorsPage() {
  const [valuators, setValuators] = useState<ValuatorWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [total, setTotal] = useState(0);

  const fetchValuators = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);

      const response = await fetch(`/api/admin/valuators?${params}`);
      const data = await response.json();

      if (data.success) {
        setValuators(data.data.valuators);
        setTotal(data.data.total);
      }
    } catch (error) {
      console.error("Error fetching valuators:", error);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    fetchValuators();
  }, [fetchValuators]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Calculate summary stats
  const activeCount = valuators.filter((v) => v.is_active).length;
  const totalOrders = valuators.reduce((sum, v) => sum + v.totalOrders, 0);
  const thisMonthOrders = valuators.reduce((sum, v) => sum + v.thisMonthOrders, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Users className="h-6 w-6 text-blue-600" />
            Vertintojai
          </h1>
          <p className="text-gray-500 mt-1">
            Vertintojų sąrašas ir statistika
          </p>
        </div>
        <Button variant="outline" onClick={fetchValuators} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
          Atnaujinti
        </Button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border p-4">
          <div className="text-sm text-gray-500">Iš viso vertintojų</div>
          <div className="text-2xl font-bold text-gray-900">{total}</div>
        </div>
        <div className="bg-white rounded-lg border p-4">
          <div className="text-sm text-gray-500">Aktyvūs</div>
          <div className="text-2xl font-bold text-green-600">{activeCount}</div>
        </div>
        <div className="bg-white rounded-lg border p-4">
          <div className="text-sm text-gray-500">Viso užsakymų</div>
          <div className="text-2xl font-bold text-blue-600">{totalOrders}</div>
        </div>
        <div className="bg-white rounded-lg border p-4">
          <div className="text-sm text-gray-500">Šį mėnesį</div>
          <div className="text-2xl font-bold text-purple-600">{thisMonthOrders}</div>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Ieškoti pagal vardą, pavardę, kodą, el. paštą..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="h-8 w-8 text-gray-400 animate-spin" />
        </div>
      ) : (
        <ValuatorTable
          valuators={valuators}
          emptyMessage={
            search
              ? `Vertintojų pagal "${search}" nerasta`
              : "Vertintojų nerasta"
          }
        />
      )}
    </div>
  );
}
