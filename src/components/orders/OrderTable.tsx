"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "./StatusBadge";
import { ServiceTypeBadge } from "./ServiceTypeBadge";
import { DownloadButton } from "./DownloadButton";
import { getOrderDisplayStatus, canDownloadOrder, getServiceInfo } from "@/lib/constants";
import type { Order } from "@/types";

interface OrderTableProps {
  orders: Order[];
  showEmail?: boolean; // For admin view
  emptyMessage?: string;
}

export function OrderTable({
  orders,
  showEmail = false,
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
            {showEmail && <TableHead className="font-semibold">El. paštas</TableHead>}
            <TableHead className="font-semibold">Paslauga</TableHead>
            <TableHead className="font-semibold">Kaina</TableHead>
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
            const serviceInfo = getServiceInfo(order.service_type);
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
                {showEmail && (
                  <TableCell className="text-gray-600 max-w-[200px] truncate">
                    {order.contact_email}
                  </TableCell>
                )}
                <TableCell className="whitespace-nowrap">
                  <ServiceTypeBadge serviceType={order.service_type} />
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  {order.price ? (
                    <span className="font-medium">{order.price} €</span>
                  ) : serviceInfo.price > 0 ? (
                    <span className="font-medium">{serviceInfo.price} €</span>
                  ) : (
                    <span className="text-gray-400">—</span>
                  )}
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  <StatusBadge status={displayStatus} />
                </TableCell>
                <TableCell className="text-right whitespace-nowrap">
                  {canDownload ? (
                    <DownloadButton filename={order.rc_filename!} />
                  ) : (
                    <span className="text-sm text-gray-400">—</span>
                  )}
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
