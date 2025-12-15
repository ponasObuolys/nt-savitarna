// Ataskaitų pagalbinės funkcijos
// Datos formatavimas, grupavimas, agregavimas

import type { DateFilter, DatePreset, ChartDataPoint, TimeSeriesDataPoint } from "@/types";

// ===== Datos funkcijos =====

/**
 * Gauti datos filtro ribas pagal preset
 */
export function getDateRangeFromPreset(preset: DatePreset): { dateFrom: Date; dateTo: Date } {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const dateTo = new Date(today);
  dateTo.setHours(23, 59, 59, 999);

  let dateFrom: Date;

  switch (preset) {
    case "today":
      dateFrom = today;
      break;
    case "week":
      dateFrom = new Date(today);
      dateFrom.setDate(dateFrom.getDate() - 7);
      break;
    case "month":
      dateFrom = new Date(today);
      dateFrom.setMonth(dateFrom.getMonth() - 1);
      break;
    case "quarter":
      dateFrom = new Date(today);
      dateFrom.setMonth(dateFrom.getMonth() - 3);
      break;
    case "year":
      dateFrom = new Date(today);
      dateFrom.setFullYear(dateFrom.getFullYear() - 1);
      break;
    case "custom":
    default:
      // Numatytai - paskutiniai 30 dienų
      dateFrom = new Date(today);
      dateFrom.setDate(dateFrom.getDate() - 30);
      break;
  }

  return { dateFrom, dateTo };
}

/**
 * Konvertuoti DateFilter į datos ribas
 */
export function getDateRange(filter: DateFilter): { dateFrom: Date; dateTo: Date } {
  if (filter.preset === "custom" && filter.dateFrom && filter.dateTo) {
    return {
      dateFrom: new Date(filter.dateFrom),
      dateTo: new Date(filter.dateTo),
    };
  }
  return getDateRangeFromPreset(filter.preset);
}

/**
 * Formatuoti datą lietuviškai
 */
export function formatDateLt(date: Date | string | null, format: "short" | "long" | "month" = "short"): string {
  if (!date) return "—";
  const d = date instanceof Date ? date : new Date(date);

  if (isNaN(d.getTime())) return "—";

  switch (format) {
    case "long":
      return d.toLocaleDateString("lt-LT", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    case "month":
      return d.toLocaleDateString("lt-LT", {
        year: "numeric",
        month: "short",
      });
    case "short":
    default:
      return d.toLocaleDateString("lt-LT", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
  }
}

/**
 * Formatuoti datą ISO formatu (YYYY-MM-DD)
 */
export function formatDateISO(date: Date): string {
  return date.toISOString().split("T")[0];
}

/**
 * Formatuoti datą grafikui (pagal grupavimo tipą)
 */
export function formatDateForChart(date: Date, groupBy: "day" | "week" | "month"): string {
  switch (groupBy) {
    case "month":
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    case "week":
      const weekStart = new Date(date);
      const dayOfWeek = date.getDay();
      // For Sunday (0), go back 6 days to Monday. For other days, go back (dayOfWeek - 1) days.
      const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
      weekStart.setDate(date.getDate() - daysToSubtract);
      return formatDateISO(weekStart);
    case "day":
    default:
      return formatDateISO(date);
  }
}

/**
 * Nustatyti optimalų grupavimo tipą pagal datos intervalą
 */
export function getOptimalGrouping(dateFrom: Date, dateTo: Date): "day" | "week" | "month" {
  const diffDays = Math.ceil((dateTo.getTime() - dateFrom.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays <= 31) return "day";
  if (diffDays <= 90) return "week";
  return "month";
}

// ===== Grupavimo funkcijos =====

/**
 * Grupuoti įrašus pagal lauką
 */
export function groupBy<T>(items: T[], keyFn: (item: T) => string): Record<string, T[]> {
  return items.reduce((acc, item) => {
    const key = keyFn(item);
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(item);
    return acc;
  }, {} as Record<string, T[]>);
}

/**
 * Grupuoti ir suskaičiuoti
 */
export function groupAndCount<T>(items: T[], keyFn: (item: T) => string): ChartDataPoint[] {
  const grouped = groupBy(items, keyFn);
  return Object.entries(grouped)
    .map(([name, group]) => ({
      name,
      value: group.length,
    }))
    .sort((a, b) => b.value - a.value);
}

/**
 * Grupuoti pagal datą ir suskaičiuoti
 */
export function groupByDateAndCount<T>(
  items: T[],
  dateFn: (item: T) => Date | string | null,
  groupBy: "day" | "week" | "month" = "day"
): TimeSeriesDataPoint[] {
  const grouped: Record<string, number> = {};

  items.forEach((item) => {
    const date = dateFn(item);
    if (!date) return;

    const d = date instanceof Date ? date : new Date(date);
    if (isNaN(d.getTime())) return;

    const key = formatDateForChart(d, groupBy);
    grouped[key] = (grouped[key] || 0) + 1;
  });

  return Object.entries(grouped)
    .map(([date, value]) => ({ date, value }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

/**
 * Užpildyti trūkstamas datas laiko eilutėje
 */
export function fillMissingDates(
  data: TimeSeriesDataPoint[],
  dateFrom: Date,
  dateTo: Date,
  groupBy: "day" | "week" | "month" = "day"
): TimeSeriesDataPoint[] {
  const result: TimeSeriesDataPoint[] = [];
  const dataMap = new Map(data.map((d) => [d.date, d.value]));

  const current = new Date(dateFrom);
  while (current <= dateTo) {
    const key = formatDateForChart(current, groupBy);
    result.push({
      date: key,
      value: dataMap.get(key) || 0,
    });

    // Pereiti prie kitos datos
    switch (groupBy) {
      case "month":
        current.setMonth(current.getMonth() + 1);
        break;
      case "week":
        current.setDate(current.getDate() + 7);
        break;
      case "day":
      default:
        current.setDate(current.getDate() + 1);
        break;
    }
  }

  return result;
}

// ===== Agregavimo funkcijos =====

/**
 * Suskaičiuoti sumą
 */
export function sum<T>(items: T[], valueFn: (item: T) => number): number {
  return items.reduce((acc, item) => acc + valueFn(item), 0);
}

/**
 * Suskaičiuoti vidurkį
 */
export function average<T>(items: T[], valueFn: (item: T) => number): number {
  if (items.length === 0) return 0;
  return sum(items, valueFn) / items.length;
}

/**
 * Rasti maksimumą
 */
export function max<T>(items: T[], valueFn: (item: T) => number): T | null {
  if (items.length === 0) return null;
  return items.reduce((max, item) => (valueFn(item) > valueFn(max) ? item : max));
}

/**
 * Rasti minimumą
 */
export function min<T>(items: T[], valueFn: (item: T) => number): T | null {
  if (items.length === 0) return null;
  return items.reduce((min, item) => (valueFn(item) < valueFn(min) ? item : min));
}

/**
 * Gauti top N įrašų
 */
export function topN<T>(items: T[], n: number, valueFn: (item: T) => number): T[] {
  return [...items].sort((a, b) => valueFn(b) - valueFn(a)).slice(0, n);
}

// ===== Formatavimo funkcijos =====

/**
 * Formatuoti sumą eurais
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("lt-LT", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
}

/**
 * Formatuoti skaičių su tūkstančių skirtukais
 */
export function formatNumber(value: number): string {
  return new Intl.NumberFormat("lt-LT").format(value);
}

/**
 * Formatuoti procentus
 */
export function formatPercent(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Suskaičiuoti procentinį pokytį
 */
export function calculateChange(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
}

// ===== Paslaugų kainos =====

const SERVICE_PRICES: Record<string, number> = {
  TYPE_1: 8,
  TYPE_2: 30,
  TYPE_3: 0, // Individuali kaina
  TYPE_4: 0, // Individuali kaina
};

/**
 * Gauti užsakymo paslaugos kainą (ne turto vertę!)
 * @param serviceType - paslaugos tipas (TYPE_1, TYPE_2, TYPE_3, TYPE_4)
 * @param servicePrice - individuali paslaugos kaina iš DB (service_price laukas)
 * @returns paslaugos kaina eurais
 */
export function getOrderPrice(serviceType: string | null, servicePrice: number | null): number {
  if (!serviceType) return 0;

  // Jei yra individuali paslaugos kaina, naudoti ją
  if (servicePrice !== null && servicePrice !== undefined) {
    return servicePrice;
  }

  // Kitu atveju naudoti standartinę kainą pagal tipą
  return SERVICE_PRICES[serviceType] || 0;
}

// ===== Datos preset'ų pavadinimai =====

export const DATE_PRESET_LABELS: Record<DatePreset, string> = {
  today: "Šiandien",
  week: "Paskutinės 7 dienos",
  month: "Paskutinės 30 dienų",
  quarter: "Paskutiniai 3 mėnesiai",
  year: "Paskutiniai 12 mėnesių",
  custom: "Pasirinktas laikotarpis",
};
