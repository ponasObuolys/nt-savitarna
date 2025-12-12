import { describe, it, expect } from "vitest";
import {
  generateCSV,
  exportOrdersToCSV,
  exportRevenueToCSV,
  exportValuatorsToCSV,
  exportClientsToCSV,
  exportGeographyToCSV,
  formatDateRange,
  generateExportFilename,
  chartDataToCSV,
  timeSeriesDataToCSV,
} from "@/lib/export/csv-export";
import type {
  OrdersStatsData,
  RevenueStatsData,
  ValuatorWorkloadData,
  ClientActivityData,
  GeographyStatsData,
  DateFilter,
} from "@/types";

// UTF-8 BOM for comparison
const UTF8_BOM = "\uFEFF";

describe("csv-export utilities", () => {
  describe("formatDateRange", () => {
    it("formats preset filter correctly", () => {
      const filter: DateFilter = { preset: "month", dateFrom: null, dateTo: null };
      expect(formatDateRange(filter)).toBe("month");
    });

    it("formats custom date range correctly", () => {
      const filter: DateFilter = {
        preset: "custom",
        dateFrom: new Date("2025-01-01"),
        dateTo: new Date("2025-01-31"),
      };
      expect(formatDateRange(filter)).toBe("2025-01-01_2025-01-31");
    });

    it("handles string dates in filter", () => {
      const filter = {
        preset: "custom",
        dateFrom: "2025-06-01" as unknown as Date,
        dateTo: "2025-06-30" as unknown as Date,
      };
      expect(formatDateRange(filter as DateFilter)).toBe("2025-06-01_2025-06-30");
    });
  });

  describe("generateExportFilename", () => {
    it("generates correct filename for CSV", () => {
      const filter: DateFilter = { preset: "month", dateFrom: null, dateTo: null };
      const filename = generateExportFilename("orders", "csv", filter);
      expect(filename).toMatch(/^orders-month-\d{4}-\d{2}-\d{2}\.csv$/);
    });

    it("generates correct filename for PDF", () => {
      const filter: DateFilter = { preset: "week", dateFrom: null, dateTo: null };
      const filename = generateExportFilename("revenue", "pdf", filter);
      expect(filename).toMatch(/^revenue-week-\d{4}-\d{2}-\d{2}\.pdf$/);
    });

    it("includes custom date range in filename", () => {
      const filter: DateFilter = {
        preset: "custom",
        dateFrom: new Date("2025-01-01"),
        dateTo: new Date("2025-01-31"),
      };
      const filename = generateExportFilename("valuators", "csv", filter);
      expect(filename).toContain("2025-01-01_2025-01-31");
    });
  });

  describe("generateCSV", () => {
    it("generates CSV with headers and data", () => {
      const data = [
        { name: "Test", value: 100 },
        { name: "Test2", value: 200 },
      ];
      const columns = [
        { key: "name" as const, header: "Name" },
        { key: "value" as const, header: "Value" },
      ];
      const csv = generateCSV(data, columns);

      expect(csv).toContain(UTF8_BOM);
      expect(csv).toContain("Name,Value");
      expect(csv).toContain("Test,100");
      expect(csv).toContain("Test2,200");
    });

    it("handles null and undefined values", () => {
      const data = [{ name: null, value: undefined }];
      const columns = [
        { key: "name" as const, header: "Name" },
        { key: "value" as const, header: "Value" },
      ];
      const csv = generateCSV(data as unknown as Record<string, unknown>[], columns);

      expect(csv).toContain(",");
    });

    it("handles function columns", () => {
      const data = [{ first: "John", last: "Doe" }];
      const columns = [
        { key: ((item: { first: string; last: string }) => `${item.first} ${item.last}`) as unknown as keyof typeof data[0], header: "Full Name" },
      ];
      const csv = generateCSV(data, columns as unknown as { key: keyof typeof data[0]; header: string }[]);

      expect(csv).toContain("John Doe");
    });

    it("handles empty data array", () => {
      const data: Record<string, unknown>[] = [];
      const columns = [{ key: "name" as const, header: "Name" }];
      const csv = generateCSV(data, columns);

      expect(csv).toContain(UTF8_BOM);
      expect(csv).toContain("Name");
    });
  });

  describe("chartDataToCSV", () => {
    it("converts chart data to CSV", () => {
      const data = [
        { name: "Category A", value: 100 },
        { name: "Category B", value: 200 },
      ];
      const csv = chartDataToCSV(data);

      expect(csv).toContain(UTF8_BOM);
      expect(csv).toContain("Pavadinimas,Reikšmė");
      expect(csv).toContain("Category A,100");
    });

    it("uses custom headers", () => {
      const data = [{ name: "Test", value: 50 }];
      const csv = chartDataToCSV(data, ["Custom Name", "Custom Value"]);

      expect(csv).toContain("Custom Name,Custom Value");
    });
  });

  describe("timeSeriesDataToCSV", () => {
    it("converts time series data to CSV", () => {
      const data = [
        { date: "2025-01-01", value: 10 },
        { date: "2025-01-02", value: 20 },
      ];
      const csv = timeSeriesDataToCSV(data);

      expect(csv).toContain(UTF8_BOM);
      expect(csv).toContain("Data,Reikšmė");
      expect(csv).toContain("2025-01-01,10");
    });

    it("uses custom headers", () => {
      const data = [{ date: "2025-01-01", value: 5 }];
      const csv = timeSeriesDataToCSV(data, ["Mėnuo", "Suma"]);

      expect(csv).toContain("Mėnuo,Suma");
    });
  });
});

describe("Report-specific CSV exports", () => {
  const defaultFilter: DateFilter = { preset: "month", dateFrom: null, dateTo: null };

  describe("exportOrdersToCSV", () => {
    const mockData: OrdersStatsData = {
      total: 100,
      byStatus: [
        { name: "Atlikta", value: 60 },
        { name: "Apmokėta", value: 30 },
        { name: "Laukiama", value: 10 },
      ],
      byServiceType: [
        { name: "Automatinis vertinimas", value: 50 },
        { name: "Vertintojo nustatymas", value: 50 },
      ],
      byPropertyType: [
        { name: "Butas", value: 70 },
        { name: "Namas", value: 30 },
      ],
      byMunicipality: [
        { name: "Vilniaus m. sav.", value: 60 },
        { name: "Kauno m. sav.", value: 40 },
      ],
      timeline: [
        { date: "2025-01-01", value: 5 },
        { date: "2025-01-02", value: 10 },
      ],
    };

    it("generates CSV with all sections", () => {
      const csv = exportOrdersToCSV(mockData, defaultFilter);

      expect(csv).toContain(UTF8_BOM);
      expect(csv).toContain("Užsakymų statistika");
      expect(csv).toContain("Viso užsakymų: 100");
      expect(csv).toContain("UŽSAKYMAI PAGAL STATUSĄ");
      expect(csv).toContain("UŽSAKYMAI PAGAL PASLAUGOS TIPĄ");
      expect(csv).toContain("UŽSAKYMAI PAGAL TURTO TIPĄ");
      expect(csv).toContain("UŽSAKYMAI PAGAL SAVIVALDYBĘ");
      expect(csv).toContain("UŽSAKYMAI PER LAIKOTARPĮ");
    });

    it("includes status data", () => {
      const csv = exportOrdersToCSV(mockData, defaultFilter);

      expect(csv).toContain("Atlikta,60");
      expect(csv).toContain("Apmokėta,30");
    });

    it("includes service type data", () => {
      const csv = exportOrdersToCSV(mockData, defaultFilter);

      expect(csv).toContain("Automatinis vertinimas,50");
    });

    it("includes timeline data", () => {
      const csv = exportOrdersToCSV(mockData, defaultFilter);

      expect(csv).toContain("2025-01-01,5");
      expect(csv).toContain("2025-01-02,10");
    });
  });

  describe("exportRevenueToCSV", () => {
    const mockData: RevenueStatsData = {
      totalRevenue: 5000.5,
      averageOrderValue: 50.25,
      projectedRevenue: 6000,
      byServiceType: [
        { name: "Automatinis vertinimas", value: 2000 },
        { name: "Vertintojo nustatymas", value: 3000.5 },
      ],
      timeline: [
        { date: "2025-01", value: 2500 },
        { date: "2025-02", value: 2500.5 },
      ],
    };

    it("generates CSV with all sections", () => {
      const csv = exportRevenueToCSV(mockData, defaultFilter);

      expect(csv).toContain(UTF8_BOM);
      expect(csv).toContain("Pajamų statistika");
      expect(csv).toContain("Bendros pajamos: 5000.50 €");
      expect(csv).toContain("Vidutinė užsakymo vertė: 50.25 €");
      expect(csv).toContain("PAJAMOS PAGAL PASLAUGOS TIPĄ");
      expect(csv).toContain("PAJAMOS PER LAIKOTARPĮ");
    });

    it("formats currency values correctly", () => {
      const csv = exportRevenueToCSV(mockData, defaultFilter);

      expect(csv).toContain("2000.00");
      expect(csv).toContain("3000.50");
    });
  });

  describe("exportValuatorsToCSV", () => {
    const mockData: ValuatorWorkloadData = {
      totalAssigned: 150,
      averagePerValuator: 30,
      mostLoaded: { name: "Jonas Jonaitis", count: 50 },
      leastLoaded: { name: "Petras Petraitis", count: 10 },
      byValuator: [
        { name: "Jonas Jonaitis", value: 50 },
        { name: "Petras Petraitis", value: 10 },
      ],
      timeline: [],
      ranking: [
        { id: 1, code: "V001", name: "Jonas Jonaitis", completedOrders: 40, inProgressOrders: 10, totalOrders: 50 },
        { id: 2, code: "V002", name: "Petras Petraitis", completedOrders: 8, inProgressOrders: 2, totalOrders: 10 },
      ],
    };

    it("generates CSV with all sections", () => {
      const csv = exportValuatorsToCSV(mockData, defaultFilter);

      expect(csv).toContain(UTF8_BOM);
      expect(csv).toContain("Vertintojų apkrovimas");
      expect(csv).toContain("Viso priskirtų užsakymų: 150");
      expect(csv).toContain("Vidurkis vienam vertintojui: 30");
      expect(csv).toContain("Labiausiai apkrautas: Jonas Jonaitis (50)");
      expect(csv).toContain("Mažiausiai apkrautas: Petras Petraitis (10)");
      expect(csv).toContain("VERTINTOJŲ REITINGAS");
    });

    it("includes ranking data", () => {
      const csv = exportValuatorsToCSV(mockData, defaultFilter);

      expect(csv).toContain("V001,Jonas Jonaitis,40,10,50");
      expect(csv).toContain("V002,Petras Petraitis,8,2,10");
    });
  });

  describe("exportClientsToCSV", () => {
    const mockData: ClientActivityData = {
      totalClients: 500,
      activeClients: 200,
      newThisMonth: 25,
      registrationTimeline: [
        { date: "2025-01", value: 10 },
        { date: "2025-02", value: 15 },
      ],
      activityDistribution: [
        { name: "1 užsakymas", value: 300 },
        { name: "2-3 užsakymai", value: 150 },
      ],
      topClients: [
        { id: 1, email: "jonas@test.lt", name: "Jonas", ordersCount: 25, totalSpent: 1500 },
        { id: 2, email: "petras@test.lt", name: "Petras", ordersCount: 20, totalSpent: 1200 },
      ],
    };

    it("generates CSV with all sections", () => {
      const csv = exportClientsToCSV(mockData, defaultFilter);

      expect(csv).toContain(UTF8_BOM);
      expect(csv).toContain("Klientų aktyvumas");
      expect(csv).toContain("Viso klientų: 500");
      expect(csv).toContain("Aktyvių klientų: 200");
      expect(csv).toContain("Naujų šį mėnesį: 25");
      expect(csv).toContain("TOP 10 AKTYVIAUSIŲ KLIENTŲ");
      expect(csv).toContain("KLIENTŲ AKTYVUMO PASISKIRSTYMAS");
    });

    it("includes top clients data", () => {
      const csv = exportClientsToCSV(mockData, defaultFilter);

      expect(csv).toContain("jonas@test.lt,Jonas,25,1500.00");
    });

    it("includes activity distribution", () => {
      const csv = exportClientsToCSV(mockData, defaultFilter);

      expect(csv).toContain("1 užsakymas,300");
      expect(csv).toContain("2-3 užsakymai,150");
    });
  });

  describe("exportGeographyToCSV", () => {
    const mockData: GeographyStatsData = {
      byMunicipality: [
        { name: "Vilniaus m. sav.", value: 100 },
        { name: "Kauno m. sav.", value: 80 },
      ],
      byCity: [
        { name: "Vilnius", value: 95 },
        { name: "Kaunas", value: 75 },
      ],
      totalLocations: 50,
    };

    it("generates CSV with all sections", () => {
      const csv = exportGeographyToCSV(mockData, defaultFilter);

      expect(csv).toContain(UTF8_BOM);
      expect(csv).toContain("Geografinė statistika");
      expect(csv).toContain("Unikalių lokacijų: 50");
      expect(csv).toContain("UŽSAKYMAI PAGAL SAVIVALDYBĘ");
      expect(csv).toContain("UŽSAKYMAI PAGAL MIESTĄ (TOP 20)");
    });

    it("includes municipality data", () => {
      const csv = exportGeographyToCSV(mockData, defaultFilter);

      expect(csv).toContain("Vilniaus m. sav.,100");
      expect(csv).toContain("Kauno m. sav.,80");
    });

    it("includes city data", () => {
      const csv = exportGeographyToCSV(mockData, defaultFilter);

      expect(csv).toContain("Vilnius,95");
      expect(csv).toContain("Kaunas,75");
    });
  });
});

describe("Edge cases", () => {
  const defaultFilter: DateFilter = { preset: "month", dateFrom: null, dateTo: null };

  it("handles empty arrays in orders data", () => {
    const emptyData: OrdersStatsData = {
      total: 0,
      byStatus: [],
      byServiceType: [],
      byPropertyType: [],
      byMunicipality: [],
      timeline: [],
    };
    const csv = exportOrdersToCSV(emptyData, defaultFilter);

    expect(csv).toContain("Viso užsakymų: 0");
  });

  it("handles empty arrays in revenue data", () => {
    const emptyData: RevenueStatsData = {
      totalRevenue: 0,
      averageOrderValue: 0,
      projectedRevenue: 0,
      byServiceType: [],
      timeline: [],
    };
    const csv = exportRevenueToCSV(emptyData, defaultFilter);

    expect(csv).toContain("Bendros pajamos: 0.00 €");
  });

  it("handles null mostLoaded/leastLoaded in valuators data", () => {
    const dataWithNulls: ValuatorWorkloadData = {
      totalAssigned: 0,
      averagePerValuator: 0,
      mostLoaded: null,
      leastLoaded: null,
      byValuator: [],
      timeline: [],
      ranking: [],
    };
    const csv = exportValuatorsToCSV(dataWithNulls, defaultFilter);

    expect(csv).not.toContain("Labiausiai apkrautas:");
    expect(csv).not.toContain("Mažiausiai apkrautas:");
  });

  it("handles Lithuanian characters", () => {
    const mockData: GeographyStatsData = {
      byMunicipality: [{ name: "Šiaulių m. sav.", value: 50 }],
      byCity: [{ name: "Panevėžys", value: 30 }],
      totalLocations: 20,
    };
    const csv = exportGeographyToCSV(mockData, defaultFilter);

    expect(csv).toContain("Šiaulių m. sav.");
    expect(csv).toContain("Panevėžys");
  });
});
