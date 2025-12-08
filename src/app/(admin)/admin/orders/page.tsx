"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { OrderTable } from "@/components/orders/OrderTable";
import type { Order } from "@/types";

const STATUS_OPTIONS = [
  { value: "all", label: "Visi" },
  { value: "completed", label: "Atlikta" },
  { value: "paid", label: "Apmokėta" },
  { value: "pending", label: "Laukiama" },
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== "all") params.set("status", statusFilter);
      if (searchQuery) params.set("search", searchQuery);

      const response = await fetch(`/api/admin/orders?${params}`);
      const data = await response.json();

      if (data.success) {
        setOrders(data.data.orders);
        setTotal(data.data.total);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter, searchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(searchInput);
  };

  const clearFilters = () => {
    setStatusFilter("all");
    setSearchQuery("");
    setSearchInput("");
  };

  const currentStatusLabel = STATUS_OPTIONS.find((s) => s.value === statusFilter)?.label || "Visi";
  const hasFilters = statusFilter !== "all" || searchQuery;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Užsakymai</h1>
        <p className="text-gray-600 mt-1">
          Valdykite visus sistemos užsakymus
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <form onSubmit={handleSearch} className="flex-1 flex gap-2">
              <div className="relative flex-1">
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <Input
                  placeholder="Ieškoti pagal el. paštą, vardą arba token..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button type="submit" variant="secondary">
                Ieškoti
              </Button>
            </form>

            {/* Status Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="min-w-32">
                  <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                  {currentStatusLabel}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {STATUS_OPTIONS.map((option) => (
                  <DropdownMenuItem
                    key={option.value}
                    onClick={() => setStatusFilter(option.value)}
                    className={statusFilter === option.value ? "bg-blue-50" : ""}
                  >
                    {option.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Clear Filters */}
            {hasFilters && (
              <Button variant="ghost" onClick={clearFilters}>
                <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Valyti
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Užsakymų sąrašas</CardTitle>
          <CardDescription>
            {isLoading
              ? "Kraunama..."
              : `Rasta: ${total} ${total === 1 ? "užsakymas" : "užsakymai"}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <svg className="animate-spin h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            </div>
          ) : (
            <OrderTable
              orders={orders}
              showEmail={true}
              emptyMessage={
                hasFilters
                  ? "Pagal pasirinktus filtrus užsakymų nerasta"
                  : "Užsakymų nerasta"
              }
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
