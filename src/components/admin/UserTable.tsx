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
import type { User } from "@/types";

interface UserTableProps {
  users: User[];
  emptyMessage?: string;
}

export function UserTable({
  users,
  emptyMessage = "Klientų nerasta",
}: UserTableProps) {
  if (users.length === 0) {
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

  const formatDate = (date: Date | string | null) => {
    if (!date) return "—";
    const d = date instanceof Date ? date : new Date(date);
    return d.toLocaleDateString("lt-LT", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  return (
    <div className="rounded-lg border bg-white overflow-hidden">
      <div className="overflow-x-auto">
        <Table className="min-w-[800px]">
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-semibold w-16">ID</TableHead>
              <TableHead className="font-semibold">Vardas</TableHead>
              <TableHead className="font-semibold">Pavardė</TableHead>
              <TableHead className="font-semibold">El. paštas</TableHead>
              <TableHead className="font-semibold">Telefonas</TableHead>
              <TableHead className="font-semibold">Įmonė</TableHead>
              <TableHead className="font-semibold">Registracijos data</TableHead>
              <TableHead className="font-semibold text-right">Veiksmai</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id} className="hover:bg-gray-50">
                <TableCell className="font-medium text-gray-500">
                  #{user.id}
                </TableCell>
                <TableCell className="font-medium">
                  {user.first_name || "—"}
                </TableCell>
                <TableCell>
                  {user.last_name || "—"}
                </TableCell>
                <TableCell className="text-gray-600 max-w-[200px] truncate">
                  {user.email}
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  {user.phone || "—"}
                </TableCell>
                <TableCell className="max-w-[150px] truncate">
                  {user.company || "—"}
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  {formatDate(user.created_at)}
                </TableCell>
                <TableCell className="text-right whitespace-nowrap">
                  <Link href={`/admin/orders?search=${encodeURIComponent(user.email)}`}>
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      Peržiūrėti užsakymus
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
