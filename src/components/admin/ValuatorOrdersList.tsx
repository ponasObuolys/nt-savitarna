"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, FileText, Filter, X } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Order } from "@/types";
import { getDisplayStatus, getStatusBadgeVariant, SERVICE_TYPES } from "@/lib/constants";

interface ValuatorOrdersListProps {
  orders: Order[];
  total: number;
  page: number;
  pageSize: number;
  onFilterChange: (filters: { status?: string; dateFrom?: string; dateTo?: string }) => void;
  onPageChange: (page: number) => void;
}

export function ValuatorOrdersList({
  orders,
  total,
  page,
  pageSize,
  onFilterChange,
  onPageChange,
}: ValuatorOrdersListProps) {
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [showFilters, setShowFilters] = useState(false);

  const totalPages = Math.ceil(total / pageSize);

  const handleStatusChange = (value: string) => {
    const newStatus = value === "all" ? "" : value;
    setStatusFilter(newStatus);
    onFilterChange({ status: newStatus });
  };

  const clearFilters = () => {
    setStatusFilter("");
    onFilterChange({});
  };

  const formatDate = (date: Date | string | null) => {
    if (!date) return "—";
    const d = date instanceof Date ? date : new Date(date);
    return d.toLocaleDateString("lt-LT", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const formatAddress = (order: Order) => {
    const parts = [
      order.address_municipality,
      order.address_city,
      order.address_street,
      order.address_house_number,
    ].filter(Boolean);
    return parts.length > 0 ? parts.join(", ") : "—";
  };

  const hasActiveFilters = statusFilter !== "";

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600" />
            Priskirti užsakymai ({total})
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className={showFilters ? "bg-blue-50" : ""}
            >
              <Filter className="h-4 w-4 mr-1" />
              Filtrai
            </Button>
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                <X className="h-4 w-4 mr-1" />
                Valyti
              </Button>
            )}
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <div className="flex flex-wrap gap-4">
              <div className="w-[200px]">
                <label className="text-sm text-gray-500 mb-1 block">Statusas</label>
                <Select value={statusFilter || "all"} onValueChange={handleStatusChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Visi statusai" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Visi statusai</SelectItem>
                    <SelectItem value="done">Atlikta</SelectItem>
                    <SelectItem value="in_progress">Vykdoma</SelectItem>
                    <SelectItem value="pending">Laukiama</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}
      </CardHeader>

      <CardContent>
        {orders.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <FileText className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p>Užsakymų nerasta</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-semibold w-16">ID</TableHead>
                    <TableHead className="font-semibold">Klientas</TableHead>
                    <TableHead className="font-semibold">Adresas</TableHead>
                    <TableHead className="font-semibold">Paslauga</TableHead>
                    <TableHead className="font-semibold text-center">Statusas</TableHead>
                    <TableHead className="font-semibold">Data</TableHead>
                    <TableHead className="font-semibold text-right">Veiksmai</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => {
                    const status = getDisplayStatus(order);
                    const service = order.service_type
                      ? SERVICE_TYPES[order.service_type]
                      : null;

                    return (
                      <TableRow key={order.id} className="hover:bg-gray-50">
                        <TableCell className="font-medium text-gray-500">
                          #{order.id}
                        </TableCell>
                        <TableCell>
                          <div className="max-w-[150px]">
                            <div className="font-medium truncate">
                              {order.contact_name || "—"}
                            </div>
                            <div className="text-xs text-gray-500 truncate">
                              {order.contact_email}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="max-w-[200px] truncate">
                          {formatAddress(order)}
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">
                            {service?.nameLt || order.service_type || "—"}
                          </span>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant={getStatusBadgeVariant(status)}>
                            {status === "completed" && "Atlikta"}
                            {status === "paid" && "Vykdoma"}
                            {status === "pending" && "Laukiama"}
                          </Badge>
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          {formatDate(order.created_at)}
                        </TableCell>
                        <TableCell className="text-right">
                          <Link href={`/admin/orders/${order.id}`}>
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-4 pt-4 border-t">
                <div className="text-sm text-gray-500">
                  Rodomi {(page - 1) * pageSize + 1}-
                  {Math.min(page * pageSize, total)} iš {total}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page <= 1}
                    onClick={() => onPageChange(page - 1)}
                  >
                    Ankstesnis
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page >= totalPages}
                    onClick={() => onPageChange(page + 1)}
                  >
                    Kitas
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
