"use client";

import Link from "next/link";
import { Eye } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "./StatusBadge";
import { ServiceTypeBadge } from "./ServiceTypeBadge";
import { DownloadButton } from "./DownloadButton";
import { InfoTooltip } from "@/components/ui/info-tooltip";
import { getOrderDisplayStatus, canDownloadOrder, getServiceInfo } from "@/lib/constants";
import type { Order } from "@/types";

function getDisplayServicePrice(order: Order): number | null {
  if (order.service_price !== null && order.service_price !== undefined) {
    return order.service_price;
  }
  const serviceInfo = getServiceInfo(order.service_type);
  return serviceInfo.price > 0 ? serviceInfo.price : null;
}

interface OrderTableProps {
  orders: Order[];
  showAddress?: boolean; // Show address column (for admin view)
  isAdmin?: boolean; // Links to admin detail page
  emptyMessage?: string;
}

function formatAddress(order: Order): string {
  const parts = [
    order.address_city,
    order.address_street,
    order.address_house_number,
  ].filter(Boolean);
  return parts.length > 0 ? parts.join(", ") : "—";
}

export function OrderTable({
  orders,
  showAddress = false,
  isAdmin = false,
  emptyMessage = "Užsakymų nerasta",
}: OrderTableProps) {
  if (orders.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <svg
          className="mx-auto h-12 w-12 text-gray-400 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-white overflow-hidden">
      <div className="overflow-x-auto">
      <Table className="min-w-[600px]">
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="font-semibold">Data</TableHead>
            {showAddress && <TableHead className="font-semibold">Adresas</TableHead>}
            <TableHead className="font-semibold">Paslauga</TableHead>
            <TableHead className="font-semibold">
              <div className="flex items-center gap-1">
                Paslaugos kaina
                <InfoTooltip content="Kaina, kurią klientas sumokėjo už vertinimo paslaugą" />
              </div>
            </TableHead>
            <TableHead className="font-semibold">
              <div className="flex items-center gap-1">
                Turto vertė
                <InfoTooltip content="Apskaičiuota nekilnojamojo turto rinkos vertė" />
              </div>
            </TableHead>
            <TableHead className="font-semibold">Statusas</TableHead>
            <TableHead className="font-semibold text-right">Veiksmai</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => {
            const displayStatus = getOrderDisplayStatus(
              order.service_type,
              order.is_enough_data_for_ai,
              order.status
            );
            const canDownload = canDownloadOrder(order.rc_filename, displayStatus);

            return (
              <TableRow key={order.id} className="hover:bg-gray-50">
                <TableCell className="font-medium whitespace-nowrap">
                  {order.created_at
                    ? new Date(order.created_at).toLocaleDateString("lt-LT", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                      })
                    : "—"}
                </TableCell>
                {showAddress && (
                  <TableCell className="text-gray-600 max-w-[250px] truncate" title={formatAddress(order)}>
                    {formatAddress(order)}
                  </TableCell>
                )}
                <TableCell className="whitespace-nowrap">
                  <ServiceTypeBadge serviceType={order.service_type} />
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  {(() => {
                    const servicePrice = getDisplayServicePrice(order);
                    return servicePrice ? (
                      <span className="font-medium text-green-600">{servicePrice} €</span>
                    ) : (
                      <span className="text-gray-400">—</span>
                    );
                  })()}
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  {order.price ? (
                    <span className="font-medium">{order.price.toLocaleString("lt-LT")} €</span>
                  ) : (
                    <span className="text-gray-400">—</span>
                  )}
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  <StatusBadge status={displayStatus} />
                </TableCell>
                <TableCell className="text-right whitespace-nowrap">
                  <div className="flex items-center justify-end gap-2">
                    <Link href={isAdmin ? `/admin/orders/${order.id}` : `/dashboard/orders/${order.id}`}>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        Detalės
                      </Button>
                    </Link>
                    {canDownload && (
                      <DownloadButton filename={order.rc_filename!} />
                    )}
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      </div>
    </div>
  );
}
