import Papa from "papaparse";
import type {
  OrdersStatsData,
  RevenueStatsData,
  ValuatorWorkloadData,
  ClientActivityData,
  GeographyStatsData,
  ChartDataPoint,
  TimeSeriesDataPoint,
  DateFilter,
} from "@/types";

// UTF-8 BOM for Lithuanian characters in Excel
const UTF8_BOM = "\uFEFF";

interface CSVColumn<T> {
  key: keyof T | ((item: T) => string | number);
  header: string;
}

/**
 * Generic CSV generation function
 */
export function generateCSV<T extends Record<string, unknown>>(
  data: T[],
  columns: CSVColumn<T>[]
): string {
  const headers = columns.map((c) => c.header);
  const rows = data.map((item) =>
    columns.map((c) => {
      if (typeof c.key === "function") {
        return String(c.key(item));
      }
      const value = item[c.key];
      if (value === null || value === undefined) return "";
      if (value instanceof Date) return value.toISOString().split("T")[0];
      return String(value);
    })
  );

  return UTF8_BOM + Papa.unparse({ fields: headers, data: rows });
}

/**
 * Format date filter for export filename and header
 */
export function formatDateRange(filter: DateFilter): string {
  if (filter.dateFrom && filter.dateTo) {
    const from = filter.dateFrom instanceof Date
      ? filter.dateFrom.toISOString().split("T")[0]
      : filter.dateFrom;
    const to = filter.dateTo instanceof Date
      ? filter.dateTo.toISOString().split("T")[0]
      : filter.dateTo;
    return `${from}_${to}`;
  }
  return filter.preset;
}

/**
 * Export Orders Statistics to CSV
 */
export function exportOrdersToCSV(data: OrdersStatsData, filter: DateFilter): string {
  const sections: string[] = [];
  const dateRange = formatDateRange(filter);

  // Summary section
  sections.push(UTF8_BOM + `Užsakymų statistika - ${dateRange}`);
  sections.push(`Viso užsakymų: ${data.total}`);
  sections.push("");

  // By Status
  sections.push("UŽSAKYMAI PAGAL STATUSĄ");
  sections.push(
    Papa.unparse({
      fields: ["Statusas", "Kiekis"],
      data: data.byStatus.map((item) => [item.name, item.value]),
    })
  );
  sections.push("");

  // By Service Type
  sections.push("UŽSAKYMAI PAGAL PASLAUGOS TIPĄ");
  sections.push(
    Papa.unparse({
      fields: ["Paslaugos tipas", "Kiekis"],
      data: data.byServiceType.map((item) => [item.name, item.value]),
    })
  );
  sections.push("");

  // By Property Type
  sections.push("UŽSAKYMAI PAGAL TURTO TIPĄ");
  sections.push(
    Papa.unparse({
      fields: ["Turto tipas", "Kiekis"],
      data: data.byPropertyType.map((item) => [item.name, item.value]),
    })
  );
  sections.push("");

  // By Municipality
  sections.push("UŽSAKYMAI PAGAL SAVIVALDYBĘ");
  sections.push(
    Papa.unparse({
      fields: ["Savivaldybė", "Kiekis"],
      data: data.byMunicipality.map((item) => [item.name, item.value]),
    })
  );
  sections.push("");

  // Timeline
  sections.push("UŽSAKYMAI PER LAIKOTARPĮ");
  sections.push(
    Papa.unparse({
      fields: ["Data", "Kiekis"],
      data: data.timeline.map((item) => [item.date, item.value]),
    })
  );

  return sections.join("\n");
}

/**
 * Export Revenue Statistics to CSV
 */
export function exportRevenueToCSV(data: RevenueStatsData, filter: DateFilter): string {
  const sections: string[] = [];
  const dateRange = formatDateRange(filter);

  // Summary section
  sections.push(UTF8_BOM + `Pajamų statistika - ${dateRange}`);
  sections.push(`Bendros pajamos: ${data.totalRevenue.toFixed(2)} €`);
  sections.push(`Vidutinė užsakymo vertė: ${data.averageOrderValue.toFixed(2)} €`);
  sections.push(`Prognozuojamos pajamos: ${data.projectedRevenue.toFixed(2)} €`);
  sections.push("");

  // By Service Type
  sections.push("PAJAMOS PAGAL PASLAUGOS TIPĄ");
  sections.push(
    Papa.unparse({
      fields: ["Paslaugos tipas", "Pajamos (€)"],
      data: data.byServiceType.map((item) => [item.name, item.value.toFixed(2)]),
    })
  );
  sections.push("");

  // Timeline
  sections.push("PAJAMOS PER LAIKOTARPĮ");
  sections.push(
    Papa.unparse({
      fields: ["Data", "Pajamos (€)"],
      data: data.timeline.map((item) => [item.date, item.value.toFixed(2)]),
    })
  );

  return sections.join("\n");
}

/**
 * Export Valuator Workload to CSV
 */
export function exportValuatorsToCSV(data: ValuatorWorkloadData, filter: DateFilter): string {
  const sections: string[] = [];
  const dateRange = formatDateRange(filter);

  // Summary section
  sections.push(UTF8_BOM + `Vertintojų apkrovimas - ${dateRange}`);
  sections.push(`Viso priskirtų užsakymų: ${data.totalAssigned}`);
  sections.push(`Vidurkis vienam vertintojui: ${data.averagePerValuator}`);
  if (data.mostLoaded) {
    sections.push(`Labiausiai apkrautas: ${data.mostLoaded.name} (${data.mostLoaded.count})`);
  }
  if (data.leastLoaded) {
    sections.push(`Mažiausiai apkrautas: ${data.leastLoaded.name} (${data.leastLoaded.count})`);
  }
  sections.push("");

  // Ranking table
  sections.push("VERTINTOJŲ REITINGAS");
  sections.push(
    Papa.unparse({
      fields: ["Kodas", "Vardas", "Atlikta", "Vykdoma", "Viso"],
      data: data.ranking.map((item) => [
        item.code,
        item.name,
        item.completedOrders,
        item.inProgressOrders,
        item.totalOrders,
      ]),
    })
  );
  sections.push("");

  // By Valuator chart data
  sections.push("UŽSAKYMAI PAGAL VERTINTOJĄ");
  sections.push(
    Papa.unparse({
      fields: ["Vertintojas", "Užsakymų skaičius"],
      data: data.byValuator.map((item) => [item.name, item.value]),
    })
  );

  return sections.join("\n");
}

/**
 * Export Client Activity to CSV
 */
export function exportClientsToCSV(data: ClientActivityData, filter: DateFilter): string {
  const sections: string[] = [];
  const dateRange = formatDateRange(filter);

  // Summary section
  sections.push(UTF8_BOM + `Klientų aktyvumas - ${dateRange}`);
  sections.push(`Viso klientų: ${data.totalClients}`);
  sections.push(`Aktyvių klientų: ${data.activeClients}`);
  sections.push(`Naujų šį mėnesį: ${data.newThisMonth}`);
  sections.push("");

  // Top clients
  sections.push("TOP 10 AKTYVIAUSIŲ KLIENTŲ");
  sections.push(
    Papa.unparse({
      fields: ["El. paštas", "Vardas", "Užsakymų skaičius", "Išleista (€)"],
      data: data.topClients.map((item) => [
        item.email,
        item.name,
        item.ordersCount,
        item.totalSpent.toFixed(2),
      ]),
    })
  );
  sections.push("");

  // Activity distribution
  sections.push("KLIENTŲ AKTYVUMO PASISKIRSTYMAS");
  sections.push(
    Papa.unparse({
      fields: ["Kategorija", "Klientų skaičius"],
      data: data.activityDistribution.map((item) => [item.name, item.value]),
    })
  );
  sections.push("");

  // Registration timeline
  sections.push("REGISTRACIJŲ DINAMIKA");
  sections.push(
    Papa.unparse({
      fields: ["Data", "Naujų klientų"],
      data: data.registrationTimeline.map((item) => [item.date, item.value]),
    })
  );

  return sections.join("\n");
}

/**
 * Export Geography Statistics to CSV
 */
export function exportGeographyToCSV(data: GeographyStatsData, filter: DateFilter): string {
  const sections: string[] = [];
  const dateRange = formatDateRange(filter);

  // Summary section
  sections.push(UTF8_BOM + `Geografinė statistika - ${dateRange}`);
  sections.push(`Unikalių lokacijų: ${data.totalLocations}`);
  sections.push("");

  // By Municipality
  sections.push("UŽSAKYMAI PAGAL SAVIVALDYBĘ");
  sections.push(
    Papa.unparse({
      fields: ["Savivaldybė", "Užsakymų skaičius"],
      data: data.byMunicipality.map((item) => [item.name, item.value]),
    })
  );
  sections.push("");

  // By City
  sections.push("UŽSAKYMAI PAGAL MIESTĄ (TOP 20)");
  sections.push(
    Papa.unparse({
      fields: ["Miestas", "Užsakymų skaičius"],
      data: data.byCity.map((item) => [item.name, item.value]),
    })
  );

  return sections.join("\n");
}

/**
 * Generate filename for export
 */
export function generateExportFilename(
  reportType: string,
  format: "csv" | "pdf",
  filter: DateFilter
): string {
  const dateRange = formatDateRange(filter);
  const timestamp = new Date().toISOString().split("T")[0];
  return `${reportType}-${dateRange}-${timestamp}.${format}`;
}

/**
 * Helper to convert ChartDataPoint array to simple CSV
 */
export function chartDataToCSV(
  data: ChartDataPoint[],
  headers: [string, string] = ["Pavadinimas", "Reikšmė"]
): string {
  return (
    UTF8_BOM +
    Papa.unparse({
      fields: headers,
      data: data.map((item) => [item.name, item.value]),
    })
  );
}

/**
 * Helper to convert TimeSeriesDataPoint array to simple CSV
 */
export function timeSeriesDataToCSV(
  data: TimeSeriesDataPoint[],
  headers: [string, string] = ["Data", "Reikšmė"]
): string {
  return (
    UTF8_BOM +
    Papa.unparse({
      fields: headers,
      data: data.map((item) => [item.date, item.value]),
    })
  );
}
