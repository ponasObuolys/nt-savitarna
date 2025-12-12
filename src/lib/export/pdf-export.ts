import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { createElement } from "react";
import type {
  OrdersStatsData,
  RevenueStatsData,
  ValuatorWorkloadData,
  ClientActivityData,
  GeographyStatsData,
  DateFilter,
} from "@/types";
import { formatDateRange } from "./csv-export";

// PDF Styles
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: "Helvetica",
  },
  header: {
    marginBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: "#1a365d",
    paddingBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1a365d",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 10,
    color: "#666",
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#2d3748",
    backgroundColor: "#edf2f7",
    padding: 6,
  },
  summaryContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 16,
    gap: 10,
  },
  summaryCard: {
    width: "48%",
    padding: 10,
    backgroundColor: "#f7fafc",
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  summaryLabel: {
    fontSize: 8,
    color: "#718096",
    marginBottom: 2,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#2d3748",
  },
  table: {
    marginTop: 8,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#edf2f7",
    padding: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#cbd5e0",
  },
  tableRow: {
    flexDirection: "row",
    padding: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  tableRowAlt: {
    flexDirection: "row",
    padding: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
    backgroundColor: "#f7fafc",
  },
  tableCell: {
    flex: 1,
    fontSize: 9,
  },
  tableCellHeader: {
    flex: 1,
    fontSize: 9,
    fontWeight: "bold",
    color: "#4a5568",
  },
  tableCellRight: {
    flex: 1,
    fontSize: 9,
    textAlign: "right",
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 8,
    color: "#a0aec0",
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
    paddingTop: 10,
  },
});

// Helper components
function SummaryCard({ label, value }: { label: string; value: string | number }) {
  return createElement(
    View,
    { style: styles.summaryCard },
    createElement(Text, { style: styles.summaryLabel }, label),
    createElement(Text, { style: styles.summaryValue }, String(value))
  );
}

function DataTable({
  headers,
  data,
  maxRows = 20,
}: {
  headers: string[];
  data: (string | number)[][];
  maxRows?: number;
}) {
  const displayData = data.slice(0, maxRows);

  return createElement(
    View,
    { style: styles.table },
    // Header row
    createElement(
      View,
      { style: styles.tableHeader },
      ...headers.map((header, i) =>
        createElement(
          Text,
          { key: i, style: i === 0 ? styles.tableCellHeader : { ...styles.tableCellHeader, textAlign: "right" as const } },
          header
        )
      )
    ),
    // Data rows
    ...displayData.map((row, rowIndex) =>
      createElement(
        View,
        { key: rowIndex, style: rowIndex % 2 === 0 ? styles.tableRow : styles.tableRowAlt },
        ...row.map((cell, cellIndex) =>
          createElement(
            Text,
            { key: cellIndex, style: cellIndex === 0 ? styles.tableCell : styles.tableCellRight },
            String(cell)
          )
        )
      )
    ),
    // Show truncation notice if needed
    data.length > maxRows
      ? createElement(
          Text,
          { style: { fontSize: 8, color: "#718096", marginTop: 4 } },
          `... ir dar ${data.length - maxRows} įrašų`
        )
      : null
  );
}

function PDFHeader({ title, dateRange }: { title: string; dateRange: string }) {
  return createElement(
    View,
    { style: styles.header },
    createElement(Text, { style: styles.title }, title),
    createElement(Text, { style: styles.subtitle }, `Laikotarpis: ${dateRange}`)
  );
}

function PDFFooter({ generatedAt }: { generatedAt: string }) {
  return createElement(
    View,
    { style: styles.footer },
    createElement(Text, null, "NT Savitarna - Ataskaitų sistema"),
    createElement(Text, null, `Sugeneruota: ${generatedAt}`)
  );
}

/**
 * Generate Orders Statistics PDF Document
 */
export function generateOrdersPDF(data: OrdersStatsData, filter: DateFilter) {
  const dateRange = formatDateRange(filter);
  const generatedAt = new Date().toLocaleString("lt-LT");

  return createElement(
    Document,
    null,
    createElement(
      Page,
      { size: "A4", style: styles.page },
      createElement(PDFHeader, { title: "Užsakymų statistika", dateRange }),

      // Summary cards
      createElement(
        View,
        { style: styles.summaryContainer },
        createElement(SummaryCard, { label: "Viso užsakymų", value: data.total }),
        createElement(SummaryCard, {
          label: "Pagal statusą",
          value: data.byStatus.length + " kategorijos",
        })
      ),

      // By Status table
      createElement(
        View,
        { style: styles.section },
        createElement(Text, { style: styles.sectionTitle }, "Užsakymai pagal statusą"),
        createElement(DataTable, {
          headers: ["Statusas", "Kiekis"],
          data: data.byStatus.map((item) => [item.name, item.value]),
        })
      ),

      // By Service Type table
      createElement(
        View,
        { style: styles.section },
        createElement(Text, { style: styles.sectionTitle }, "Užsakymai pagal paslaugos tipą"),
        createElement(DataTable, {
          headers: ["Paslaugos tipas", "Kiekis"],
          data: data.byServiceType.map((item) => [item.name, item.value]),
        })
      ),

      // By Municipality table (top 15)
      createElement(
        View,
        { style: styles.section },
        createElement(Text, { style: styles.sectionTitle }, "Užsakymai pagal savivaldybę (Top 15)"),
        createElement(DataTable, {
          headers: ["Savivaldybė", "Kiekis"],
          data: data.byMunicipality.slice(0, 15).map((item) => [item.name, item.value]),
          maxRows: 15,
        })
      ),

      createElement(PDFFooter, { generatedAt })
    )
  );
}

/**
 * Generate Revenue Statistics PDF Document
 */
export function generateRevenuePDF(data: RevenueStatsData, filter: DateFilter) {
  const dateRange = formatDateRange(filter);
  const generatedAt = new Date().toLocaleString("lt-LT");

  return createElement(
    Document,
    null,
    createElement(
      Page,
      { size: "A4", style: styles.page },
      createElement(PDFHeader, { title: "Pajamų statistika", dateRange }),

      // Summary cards
      createElement(
        View,
        { style: styles.summaryContainer },
        createElement(SummaryCard, { label: "Bendros pajamos", value: `${data.totalRevenue.toFixed(2)} €` }),
        createElement(SummaryCard, {
          label: "Vidutinė užsakymo vertė",
          value: `${data.averageOrderValue.toFixed(2)} €`,
        }),
        createElement(SummaryCard, {
          label: "Prognozuojamos pajamos",
          value: `${data.projectedRevenue.toFixed(2)} €`,
        })
      ),

      // By Service Type table
      createElement(
        View,
        { style: styles.section },
        createElement(Text, { style: styles.sectionTitle }, "Pajamos pagal paslaugos tipą"),
        createElement(DataTable, {
          headers: ["Paslaugos tipas", "Pajamos (€)"],
          data: data.byServiceType.map((item) => [item.name, item.value.toFixed(2)]),
        })
      ),

      // Timeline table
      createElement(
        View,
        { style: styles.section },
        createElement(Text, { style: styles.sectionTitle }, "Pajamos per laikotarpį"),
        createElement(DataTable, {
          headers: ["Data", "Pajamos (€)"],
          data: data.timeline.map((item) => [item.date, item.value.toFixed(2)]),
          maxRows: 30,
        })
      ),

      createElement(PDFFooter, { generatedAt })
    )
  );
}

/**
 * Generate Valuator Workload PDF Document
 */
export function generateValuatorsPDF(data: ValuatorWorkloadData, filter: DateFilter) {
  const dateRange = formatDateRange(filter);
  const generatedAt = new Date().toLocaleString("lt-LT");

  return createElement(
    Document,
    null,
    createElement(
      Page,
      { size: "A4", style: styles.page },
      createElement(PDFHeader, { title: "Vertintojų apkrovimas", dateRange }),

      // Summary cards
      createElement(
        View,
        { style: styles.summaryContainer },
        createElement(SummaryCard, { label: "Viso priskirtų", value: data.totalAssigned }),
        createElement(SummaryCard, { label: "Vidurkis vienam", value: data.averagePerValuator }),
        data.mostLoaded
          ? createElement(SummaryCard, {
              label: "Labiausiai apkrautas",
              value: `${data.mostLoaded.name} (${data.mostLoaded.count})`,
            })
          : null,
        data.leastLoaded
          ? createElement(SummaryCard, {
              label: "Mažiausiai apkrautas",
              value: `${data.leastLoaded.name} (${data.leastLoaded.count})`,
            })
          : null
      ),

      // Ranking table
      createElement(
        View,
        { style: styles.section },
        createElement(Text, { style: styles.sectionTitle }, "Vertintojų reitingas"),
        createElement(DataTable, {
          headers: ["Kodas", "Vardas", "Atlikta", "Vykdoma", "Viso"],
          data: data.ranking.map((item) => [
            item.code,
            item.name,
            item.completedOrders,
            item.inProgressOrders,
            item.totalOrders,
          ]),
        })
      ),

      // By Valuator table
      createElement(
        View,
        { style: styles.section },
        createElement(Text, { style: styles.sectionTitle }, "Užsakymai pagal vertintoją"),
        createElement(DataTable, {
          headers: ["Vertintojas", "Užsakymų skaičius"],
          data: data.byValuator.map((item) => [item.name, item.value]),
        })
      ),

      createElement(PDFFooter, { generatedAt })
    )
  );
}

/**
 * Generate Client Activity PDF Document
 */
export function generateClientsPDF(data: ClientActivityData, filter: DateFilter) {
  const dateRange = formatDateRange(filter);
  const generatedAt = new Date().toLocaleString("lt-LT");

  return createElement(
    Document,
    null,
    createElement(
      Page,
      { size: "A4", style: styles.page },
      createElement(PDFHeader, { title: "Klientų aktyvumas", dateRange }),

      // Summary cards
      createElement(
        View,
        { style: styles.summaryContainer },
        createElement(SummaryCard, { label: "Viso klientų", value: data.totalClients }),
        createElement(SummaryCard, { label: "Aktyvių klientų", value: data.activeClients }),
        createElement(SummaryCard, { label: "Naujų šį mėnesį", value: data.newThisMonth })
      ),

      // Top clients table
      createElement(
        View,
        { style: styles.section },
        createElement(Text, { style: styles.sectionTitle }, "Top 10 aktyviausių klientų"),
        createElement(DataTable, {
          headers: ["El. paštas", "Vardas", "Užsakymų", "Išleista (€)"],
          data: data.topClients.map((item) => [
            item.email,
            item.name,
            item.ordersCount,
            item.totalSpent.toFixed(2),
          ]),
          maxRows: 10,
        })
      ),

      // Activity distribution table
      createElement(
        View,
        { style: styles.section },
        createElement(Text, { style: styles.sectionTitle }, "Klientų aktyvumo pasiskirstymas"),
        createElement(DataTable, {
          headers: ["Kategorija", "Klientų skaičius"],
          data: data.activityDistribution.map((item) => [item.name, item.value]),
        })
      ),

      createElement(PDFFooter, { generatedAt })
    )
  );
}

/**
 * Generate Geography Statistics PDF Document
 */
export function generateGeographyPDF(data: GeographyStatsData, filter: DateFilter) {
  const dateRange = formatDateRange(filter);
  const generatedAt = new Date().toLocaleString("lt-LT");

  return createElement(
    Document,
    null,
    createElement(
      Page,
      { size: "A4", style: styles.page },
      createElement(PDFHeader, { title: "Geografinė statistika", dateRange }),

      // Summary cards
      createElement(
        View,
        { style: styles.summaryContainer },
        createElement(SummaryCard, { label: "Unikalių lokacijų", value: data.totalLocations }),
        createElement(SummaryCard, { label: "Savivaldybių", value: data.byMunicipality.length }),
        createElement(SummaryCard, { label: "Miestų", value: data.byCity.length })
      ),

      // By Municipality table
      createElement(
        View,
        { style: styles.section },
        createElement(Text, { style: styles.sectionTitle }, "Užsakymai pagal savivaldybę"),
        createElement(DataTable, {
          headers: ["Savivaldybė", "Užsakymų skaičius"],
          data: data.byMunicipality.map((item) => [item.name, item.value]),
          maxRows: 15,
        })
      ),

      // By City table
      createElement(
        View,
        { style: styles.section },
        createElement(Text, { style: styles.sectionTitle }, "Užsakymai pagal miestą (Top 20)"),
        createElement(DataTable, {
          headers: ["Miestas", "Užsakymų skaičius"],
          data: data.byCity.map((item) => [item.name, item.value]),
          maxRows: 20,
        })
      ),

      createElement(PDFFooter, { generatedAt })
    )
  );
}

// Export type for PDF generation
export type PDFReportType = "orders" | "revenue" | "valuators" | "clients" | "geography";

// Map of report types to their generator functions
export const pdfGenerators = {
  orders: generateOrdersPDF,
  revenue: generateRevenuePDF,
  valuators: generateValuatorsPDF,
  clients: generateClientsPDF,
  geography: generateGeographyPDF,
} as const;
