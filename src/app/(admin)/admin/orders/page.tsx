"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { OrderTable } from "@/components/orders/OrderTable";
import { OrderFilters, OrderFiltersState, defaultFilters } from "@/components/admin/OrderFilters";
import type { Order } from "@/types";

export default function AdminOrdersPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [orders, setOrders] = useState<Order[]>([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(50);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize filters from URL
  const [filters, setFilters] = useState<OrderFiltersState>(() => {
    const search = searchParams.get("search") || "";
    const dateFrom = searchParams.get("dateFrom");
    const dateTo = searchParams.get("dateTo");
    const status = searchParams.get("status");
    const serviceType = searchParams.get("serviceType");
    const municipality = searchParams.get("municipality") || "";
    const city = searchParams.get("city") || "";
    const propertyType = searchParams.get("propertyType") || "";

    return {
      search,
      dateFrom: dateFrom ? new Date(dateFrom) : undefined,
      dateTo: dateTo ? new Date(dateTo) : undefined,
      status: status ? status.split(",") : [],
      serviceType: serviceType ? serviceType.split(",") : [],
      municipality,
      city,
      propertyType,
    };
  });

  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("page", currentPage.toString());

      if (filters.search) params.set("search", filters.search);
      if (filters.dateFrom) params.set("dateFrom", filters.dateFrom.toISOString().split("T")[0]);
      if (filters.dateTo) params.set("dateTo", filters.dateTo.toISOString().split("T")[0]);
      if (filters.status.length > 0) params.set("status", filters.status.join(","));
      if (filters.serviceType.length > 0) params.set("serviceType", filters.serviceType.join(","));
      if (filters.municipality) params.set("municipality", filters.municipality);
      if (filters.city) params.set("city", filters.city);
      if (filters.propertyType) params.set("propertyType", filters.propertyType);

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
  }, [currentPage, filters]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();

    if (filters.search) params.set("search", filters.search);
    if (filters.dateFrom) params.set("dateFrom", filters.dateFrom.toISOString().split("T")[0]);
    if (filters.dateTo) params.set("dateTo", filters.dateTo.toISOString().split("T")[0]);
    if (filters.status.length > 0) params.set("status", filters.status.join(","));
    if (filters.serviceType.length > 0) params.set("serviceType", filters.serviceType.join(","));
    if (filters.municipality) params.set("municipality", filters.municipality);
    if (filters.city) params.set("city", filters.city);
    if (filters.propertyType) params.set("propertyType", filters.propertyType);
    if (currentPage > 1) params.set("page", currentPage.toString());

    const queryString = params.toString();
    router.replace(`/admin/orders${queryString ? `?${queryString}` : ""}`, { scroll: false });
  }, [filters, currentPage, router]);

  const handleFiltersChange = (newFilters: OrderFiltersState) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page on filter change
  };

  const handleClearFilters = () => {
    setFilters(defaultFilters);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(total / pageSize);
  const startItem = total > 0 ? (currentPage - 1) * pageSize + 1 : 0;
  const endItem = Math.min(currentPage * pageSize, total);

  const hasActiveFilters =
    filters.search ||
    filters.dateFrom ||
    filters.dateTo ||
    filters.status.length > 0 ||
    filters.serviceType.length > 0 ||
    filters.municipality ||
    filters.city ||
    filters.propertyType;

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
          <OrderFilters
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onClear={handleClearFilters}
          />
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Užsakymų sąrašas</CardTitle>
          <CardDescription>
            {isLoading
              ? "Kraunama..."
              : total > 0
              ? `Rodomi ${startItem}-${endItem} iš ${total} užsakymų`
              : "Užsakymų nerasta"}
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
            <>
              <OrderTable
                orders={orders}
                showAddress={true}
                isAdmin={true}
                emptyMessage={
                  hasActiveFilters
                    ? "Pagal pasirinktus filtrus užsakymų nerasta"
                    : "Užsakymų nerasta"
                }
              />

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6 pt-4 border-t">
                  <p className="text-sm text-gray-600">
                    Puslapis {currentPage} iš {totalPages}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    >
                      <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                      Ankstesnis
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                    >
                      Kitas
                      <svg className="h-4 w-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
