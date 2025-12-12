import { describe, it, expect, vi } from "vitest";
import {
  generateOrdersPDF,
  generateRevenuePDF,
  generateValuatorsPDF,
  generateClientsPDF,
  generateGeographyPDF,
  pdfGenerators,
} from "@/lib/export/pdf-export";
import type {
  OrdersStatsData,
  RevenueStatsData,
  ValuatorWorkloadData,
  ClientActivityData,
  GeographyStatsData,
  DateFilter,
} from "@/types";

// Mock @react-pdf/renderer - don't mock, just verify the functions return React elements
vi.mock("@react-pdf/renderer", async () => {
  const actual = await vi.importActual("@react-pdf/renderer");
  return actual;
});

describe("PDF Export Functions", () => {
  const defaultFilter: DateFilter = {
    preset: "month",
    dateFrom: null,
    dateTo: null,
  };

  const customFilter: DateFilter = {
    preset: "custom",
    dateFrom: new Date("2025-01-01"),
    dateTo: new Date("2025-01-31"),
  };

  describe("generateOrdersPDF", () => {
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

    it("generates PDF document structure", () => {
      const doc = generateOrdersPDF(mockData, defaultFilter);

      expect(doc).toBeDefined();
      // Verify it's a React element with Document component
      expect(doc.type).toBeDefined();
    });

    it("works with custom date filter", () => {
      const doc = generateOrdersPDF(mockData, customFilter);

      expect(doc).toBeDefined();
    });

    it("handles empty data arrays", () => {
      const emptyData: OrdersStatsData = {
        total: 0,
        byStatus: [],
        byServiceType: [],
        byPropertyType: [],
        byMunicipality: [],
        timeline: [],
      };

      const doc = generateOrdersPDF(emptyData, defaultFilter);
      expect(doc).toBeDefined();
    });

    it("handles large dataset", () => {
      const largeData: OrdersStatsData = {
        total: 10000,
        byStatus: Array(20).fill(null).map((_, i) => ({ name: `Status ${i}`, value: i * 100 })),
        byServiceType: Array(10).fill(null).map((_, i) => ({ name: `Type ${i}`, value: i * 200 })),
        byPropertyType: Array(15).fill(null).map((_, i) => ({ name: `Property ${i}`, value: i * 50 })),
        byMunicipality: Array(50).fill(null).map((_, i) => ({ name: `Municipality ${i}`, value: i * 30 })),
        timeline: Array(365).fill(null).map((_, i) => ({ date: `2025-${String(i % 12 + 1).padStart(2, "0")}-01`, value: i })),
      };

      const doc = generateOrdersPDF(largeData, defaultFilter);
      expect(doc).toBeDefined();
    });
  });

  describe("generateRevenuePDF", () => {
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

    it("generates PDF document structure", () => {
      const doc = generateRevenuePDF(mockData, defaultFilter);

      expect(doc).toBeDefined();
      expect(doc.type).toBeDefined();
    });

    it("handles zero values", () => {
      const zeroData: RevenueStatsData = {
        totalRevenue: 0,
        averageOrderValue: 0,
        projectedRevenue: 0,
        byServiceType: [],
        timeline: [],
      };

      const doc = generateRevenuePDF(zeroData, defaultFilter);
      expect(doc).toBeDefined();
    });

    it("handles decimal precision", () => {
      const decimalData: RevenueStatsData = {
        totalRevenue: 1234.56789,
        averageOrderValue: 99.999,
        projectedRevenue: 10000.001,
        byServiceType: [{ name: "Test", value: 123.456 }],
        timeline: [{ date: "2025-01", value: 999.99 }],
      };

      const doc = generateRevenuePDF(decimalData, defaultFilter);
      expect(doc).toBeDefined();
    });
  });

  describe("generateValuatorsPDF", () => {
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

    it("generates PDF document structure", () => {
      const doc = generateValuatorsPDF(mockData, defaultFilter);

      expect(doc).toBeDefined();
      expect(doc.type).toBeDefined();
    });

    it("handles null mostLoaded/leastLoaded", () => {
      const dataWithNulls: ValuatorWorkloadData = {
        ...mockData,
        mostLoaded: null,
        leastLoaded: null,
      };

      const doc = generateValuatorsPDF(dataWithNulls, defaultFilter);
      expect(doc).toBeDefined();
    });

    it("handles empty ranking", () => {
      const emptyRanking: ValuatorWorkloadData = {
        ...mockData,
        ranking: [],
        byValuator: [],
      };

      const doc = generateValuatorsPDF(emptyRanking, defaultFilter);
      expect(doc).toBeDefined();
    });
  });

  describe("generateClientsPDF", () => {
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

    it("generates PDF document structure", () => {
      const doc = generateClientsPDF(mockData, defaultFilter);

      expect(doc).toBeDefined();
      expect(doc.type).toBeDefined();
    });

    it("handles empty top clients", () => {
      const emptyTopClients: ClientActivityData = {
        ...mockData,
        topClients: [],
      };

      const doc = generateClientsPDF(emptyTopClients, defaultFilter);
      expect(doc).toBeDefined();
    });

    it("handles zero counts", () => {
      const zeroData: ClientActivityData = {
        totalClients: 0,
        activeClients: 0,
        newThisMonth: 0,
        registrationTimeline: [],
        activityDistribution: [],
        topClients: [],
      };

      const doc = generateClientsPDF(zeroData, defaultFilter);
      expect(doc).toBeDefined();
    });
  });

  describe("generateGeographyPDF", () => {
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

    it("generates PDF document structure", () => {
      const doc = generateGeographyPDF(mockData, defaultFilter);

      expect(doc).toBeDefined();
      expect(doc.type).toBeDefined();
    });

    it("handles empty data", () => {
      const emptyData: GeographyStatsData = {
        byMunicipality: [],
        byCity: [],
        totalLocations: 0,
      };

      const doc = generateGeographyPDF(emptyData, defaultFilter);
      expect(doc).toBeDefined();
    });

    it("handles Lithuanian characters", () => {
      const lithuanianData: GeographyStatsData = {
        byMunicipality: [
          { name: "Šiaulių m. sav.", value: 50 },
          { name: "Panevėžio m. sav.", value: 40 },
        ],
        byCity: [
          { name: "Šiauliai", value: 45 },
          { name: "Panevėžys", value: 35 },
        ],
        totalLocations: 30,
      };

      const doc = generateGeographyPDF(lithuanianData, defaultFilter);
      expect(doc).toBeDefined();
    });

    it("handles many municipalities", () => {
      const manyMunicipalities: GeographyStatsData = {
        byMunicipality: Array(60).fill(null).map((_, i) => ({
          name: `Municipality ${i}`,
          value: (60 - i) * 10,
        })),
        byCity: Array(100).fill(null).map((_, i) => ({
          name: `City ${i}`,
          value: (100 - i) * 5,
        })),
        totalLocations: 200,
      };

      const doc = generateGeographyPDF(manyMunicipalities, defaultFilter);
      expect(doc).toBeDefined();
    });
  });

  describe("pdfGenerators mapping", () => {
    it("has all report types mapped", () => {
      expect(pdfGenerators.orders).toBe(generateOrdersPDF);
      expect(pdfGenerators.revenue).toBe(generateRevenuePDF);
      expect(pdfGenerators.valuators).toBe(generateValuatorsPDF);
      expect(pdfGenerators.clients).toBe(generateClientsPDF);
      expect(pdfGenerators.geography).toBe(generateGeographyPDF);
    });

    it("all generators are functions", () => {
      Object.values(pdfGenerators).forEach((generator) => {
        expect(typeof generator).toBe("function");
      });
    });

    it("has exactly 5 report types", () => {
      expect(Object.keys(pdfGenerators).length).toBe(5);
    });
  });
});

describe("PDF generation with various date filters", () => {
  const mockOrdersData: OrdersStatsData = {
    total: 50,
    byStatus: [{ name: "Test", value: 50 }],
    byServiceType: [],
    byPropertyType: [],
    byMunicipality: [],
    timeline: [],
  };

  it("handles today preset", () => {
    const filter: DateFilter = { preset: "today", dateFrom: null, dateTo: null };
    const doc = generateOrdersPDF(mockOrdersData, filter);
    expect(doc).toBeDefined();
  });

  it("handles week preset", () => {
    const filter: DateFilter = { preset: "week", dateFrom: null, dateTo: null };
    const doc = generateOrdersPDF(mockOrdersData, filter);
    expect(doc).toBeDefined();
  });

  it("handles quarter preset", () => {
    const filter: DateFilter = { preset: "quarter", dateFrom: null, dateTo: null };
    const doc = generateOrdersPDF(mockOrdersData, filter);
    expect(doc).toBeDefined();
  });

  it("handles year preset", () => {
    const filter: DateFilter = { preset: "year", dateFrom: null, dateTo: null };
    const doc = generateOrdersPDF(mockOrdersData, filter);
    expect(doc).toBeDefined();
  });

  it("handles custom date range", () => {
    const filter: DateFilter = {
      preset: "custom",
      dateFrom: new Date("2024-01-01"),
      dateTo: new Date("2024-12-31"),
    };
    const doc = generateOrdersPDF(mockOrdersData, filter);
    expect(doc).toBeDefined();
  });
});
