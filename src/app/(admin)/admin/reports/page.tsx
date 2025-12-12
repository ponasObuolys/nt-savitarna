"use client";

import * as React from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DateRangeFilter, DEFAULT_DATE_FILTER } from "@/components/filters/DateRangeFilter";
import { OrdersStats } from "@/components/reports/OrdersStats";
import { RevenueStats } from "@/components/reports/RevenueStats";
import { ValuatorWorkload } from "@/components/reports/ValuatorWorkload";
import { ClientActivity } from "@/components/reports/ClientActivity";
import { GeographyStats } from "@/components/reports/GeographyStats";
import { ExportButton, type ReportType } from "@/components/reports/ExportButton";
import type { DateFilter, DatePreset } from "@/types";
import {
  ClipboardListIcon,
  BanknoteIcon,
  UsersIcon,
  MapPinIcon,
  UserCogIcon,
} from "lucide-react";

// Tab configuration
const TABS = [
  { id: "orders", label: "Užsakymai", icon: ClipboardListIcon },
  { id: "revenue", label: "Pajamos", icon: BanknoteIcon },
  { id: "valuators", label: "Vertintojai", icon: UserCogIcon },
  { id: "clients", label: "Klientai", icon: UsersIcon },
  { id: "geography", label: "Geografija", icon: MapPinIcon },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function ReportsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Parse date filter from URL
  const dateFilter = React.useMemo<DateFilter>(() => {
    const preset = searchParams.get("preset") as DatePreset | null;
    const dateFrom = searchParams.get("dateFrom");
    const dateTo = searchParams.get("dateTo");

    if (preset && preset !== "custom") {
      return { preset, dateFrom: null, dateTo: null };
    }

    if (preset === "custom" && dateFrom && dateTo) {
      return {
        preset: "custom",
        dateFrom: new Date(dateFrom),
        dateTo: new Date(dateTo),
      };
    }

    return DEFAULT_DATE_FILTER;
  }, [searchParams]);

  // Parse active tab from URL
  const activeTab = React.useMemo<TabId>(() => {
    const tab = searchParams.get("tab") as TabId | null;
    return tab && TABS.some((t) => t.id === tab) ? tab : "orders";
  }, [searchParams]);

  // Update URL with new filter
  const handleDateFilterChange = React.useCallback(
    (newFilter: DateFilter) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("preset", newFilter.preset);

      if (newFilter.preset === "custom" && newFilter.dateFrom && newFilter.dateTo) {
        params.set("dateFrom", newFilter.dateFrom.toISOString().split("T")[0]);
        params.set("dateTo", newFilter.dateTo.toISOString().split("T")[0]);
      } else {
        params.delete("dateFrom");
        params.delete("dateTo");
      }

      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams]
  );

  // Update URL with new tab
  const handleTabChange = React.useCallback(
    (tab: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("tab", tab);
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams]
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Ataskaitos</h1>
          <p className="text-sm text-gray-500 mt-1">
            Užsakymų, pajamų ir veiklos statistika
          </p>
        </div>
        <div className="flex items-center gap-3">
          <ExportButton
            reportType={activeTab as ReportType}
            dateFilter={dateFilter}
          />
          <DateRangeFilter
            value={dateFilter}
            onChange={handleDateFilterChange}
          />
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="w-full sm:w-auto overflow-x-auto">
          {TABS.map((tab) => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className="flex items-center gap-2"
            >
              <tab.icon className="h-4 w-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Orders Tab - Using real component */}
        <TabsContent value="orders" className="space-y-6 mt-6">
          <OrdersStats dateFilter={dateFilter} />
        </TabsContent>

        {/* Revenue Tab - Using real component */}
        <TabsContent value="revenue" className="space-y-6 mt-6">
          <RevenueStats dateFilter={dateFilter} />
        </TabsContent>

        {/* Valuators Tab - Using real component */}
        <TabsContent value="valuators" className="space-y-6 mt-6">
          <ValuatorWorkload dateFilter={dateFilter} />
        </TabsContent>

        {/* Clients Tab - Using real component */}
        <TabsContent value="clients" className="space-y-6 mt-6">
          <ClientActivity dateFilter={dateFilter} />
        </TabsContent>

        {/* Geography Tab - Using real component */}
        <TabsContent value="geography" className="space-y-6 mt-6">
          <GeographyStats dateFilter={dateFilter} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
