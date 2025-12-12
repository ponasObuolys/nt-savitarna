"use client";

import { User, Phone, Mail, CheckCircle, Clock, Calendar, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { ValuatorWithStats, TimeSeriesDataPoint } from "@/types";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { CHART_COLORS, CHART_GRADIENTS } from "@/lib/chart-colors";

interface ValuatorCardProps {
  valuator: ValuatorWithStats;
  monthlyStats?: TimeSeriesDataPoint[];
}

export function ValuatorCard({ valuator, monthlyStats = [] }: ValuatorCardProps) {
  const formatDate = (dateStr: string) => {
    // Format: 2024-01 -> Sau
    const months = ["Sau", "Vas", "Kov", "Bal", "Geg", "Bir", "Lie", "Rgp", "Rgs", "Spa", "Lap", "Gru"];
    const parts = dateStr.split("-");
    if (parts.length >= 2) {
      const monthIndex = parseInt(parts[1]) - 1;
      return months[monthIndex] || dateStr;
    }
    return dateStr;
  };

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Info Card */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <User className="h-5 w-5 text-blue-600" />
            Vertintojo informacija
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-500">Vardas, Pavardė</span>
            <span className="font-medium">
              {valuator.first_name} {valuator.last_name}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-500">Kodas</span>
            <code className="bg-gray-100 px-2 py-0.5 rounded text-sm font-mono">
              {valuator.code}
            </code>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-500 flex items-center gap-1">
              <Phone className="h-4 w-4" /> Telefonas
            </span>
            <span>{valuator.phone || "—"}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-500 flex items-center gap-1">
              <Mail className="h-4 w-4" /> El. paštas
            </span>
            <span className="text-sm">{valuator.email || "—"}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-500">Statusas</span>
            <Badge variant={valuator.is_active ? "default" : "secondary"}>
              {valuator.is_active ? "Aktyvus" : "Neaktyvus"}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Statistics Card */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
            Statistika
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-blue-50 rounded-lg p-3">
              <div className="flex items-center gap-2 text-blue-600 text-sm mb-1">
                <Calendar className="h-4 w-4" />
                Viso užsakymų
              </div>
              <div className="text-2xl font-bold text-blue-700">
                {valuator.totalOrders}
              </div>
            </div>
            <div className="bg-purple-50 rounded-lg p-3">
              <div className="flex items-center gap-2 text-purple-600 text-sm mb-1">
                <Calendar className="h-4 w-4" />
                Šį mėnesį
              </div>
              <div className="text-2xl font-bold text-purple-700">
                {valuator.thisMonthOrders}
              </div>
            </div>
            <div className="bg-green-50 rounded-lg p-3">
              <div className="flex items-center gap-2 text-green-600 text-sm mb-1">
                <CheckCircle className="h-4 w-4" />
                Atlikta
              </div>
              <div className="text-2xl font-bold text-green-700">
                {valuator.completedOrders}
              </div>
            </div>
            <div className="bg-orange-50 rounded-lg p-3">
              <div className="flex items-center gap-2 text-orange-600 text-sm mb-1">
                <Clock className="h-4 w-4" />
                Vykdoma
              </div>
              <div className="text-2xl font-bold text-orange-700">
                {valuator.inProgressOrders}
              </div>
            </div>
          </div>

          {/* Mini Chart */}
          {monthlyStats.length > 0 && (
            <div className="mt-4">
              <div className="text-sm text-gray-500 mb-2">
                Užsakymų dinamika (6 mėn.)
              </div>
              <div className="h-[100px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlyStats}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={CHART_GRADIENTS.blue.start} />
                        <stop offset="95%" stopColor={CHART_GRADIENTS.blue.end} />
                      </linearGradient>
                    </defs>
                    <XAxis
                      dataKey="date"
                      tickFormatter={formatDate}
                      tick={{ fontSize: 10 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis hide />
                    <Tooltip
                      formatter={(value: number) => [value, "Užsakymai"]}
                      labelFormatter={(label) => `Laikotarpis: ${label}`}
                    />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke={CHART_COLORS.primary}
                      fill="url(#colorValue)"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
