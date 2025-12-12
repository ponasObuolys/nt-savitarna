"use client";

import Link from "next/link";
import { Eye, CheckCircle, XCircle } from "lucide-react";
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
import type { ValuatorWithStats } from "@/types";

interface ValuatorTableProps {
  valuators: ValuatorWithStats[];
  emptyMessage?: string;
}

export function ValuatorTable({
  valuators,
  emptyMessage = "Vertintojų nerasta",
}: ValuatorTableProps) {
  if (valuators.length === 0) {
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
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-white overflow-hidden">
      <div className="overflow-x-auto">
        <Table className="min-w-[900px]">
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-semibold w-16">ID</TableHead>
              <TableHead className="font-semibold w-20">Kodas</TableHead>
              <TableHead className="font-semibold">Vardas</TableHead>
              <TableHead className="font-semibold">Pavardė</TableHead>
              <TableHead className="font-semibold">Telefonas</TableHead>
              <TableHead className="font-semibold">El. paštas</TableHead>
              <TableHead className="font-semibold text-center">Aktyvus</TableHead>
              <TableHead className="font-semibold text-center">Užsakymai</TableHead>
              <TableHead className="font-semibold text-center">Šį mėn.</TableHead>
              <TableHead className="font-semibold text-right">Veiksmai</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {valuators.map((valuator) => (
              <TableRow key={valuator.id} className="hover:bg-gray-50">
                <TableCell className="font-medium text-gray-500">
                  #{valuator.id}
                </TableCell>
                <TableCell>
                  <code className="text-sm bg-gray-100 px-1.5 py-0.5 rounded">
                    {valuator.code}
                  </code>
                </TableCell>
                <TableCell className="font-medium">
                  {valuator.first_name}
                </TableCell>
                <TableCell>{valuator.last_name}</TableCell>
                <TableCell className="whitespace-nowrap">
                  {valuator.phone || "—"}
                </TableCell>
                <TableCell className="text-gray-600 max-w-[180px] truncate">
                  {valuator.email || "—"}
                </TableCell>
                <TableCell className="text-center">
                  {valuator.is_active ? (
                    <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                  ) : (
                    <XCircle className="h-5 w-5 text-gray-400 mx-auto" />
                  )}
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Badge variant="secondary" className="font-mono">
                      {valuator.totalOrders}
                    </Badge>
                    {valuator.completedOrders > 0 && (
                      <span className="text-xs text-green-600">
                        ({valuator.completedOrders} ✓)
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <Badge
                    variant={valuator.thisMonthOrders > 0 ? "default" : "outline"}
                    className="font-mono"
                  >
                    {valuator.thisMonthOrders}
                  </Badge>
                </TableCell>
                <TableCell className="text-right whitespace-nowrap">
                  <Link href={`/admin/valuators/${valuator.id}`}>
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      Peržiūrėti
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
