import { describe, it, expect } from "vitest";
import {
  CHART_COLORS,
  CHART_GRADIENTS,
  getChartColor,
  getStatusColor,
  getServiceTypeColor,
  getPropertyTypeColor,
} from "@/lib/chart-colors";

describe("chart-colors", () => {
  describe("CHART_COLORS", () => {
    it("has all required primary colors", () => {
      expect(CHART_COLORS.primary).toBe("#2563eb");
      expect(CHART_COLORS.secondary).toBe("#7c3aed");
      expect(CHART_COLORS.success).toBe("#16a34a");
      expect(CHART_COLORS.warning).toBe("#ea580c");
      expect(CHART_COLORS.danger).toBe("#dc2626");
      expect(CHART_COLORS.info).toBe("#0891b2");
    });

    it("has neutral colors", () => {
      expect(CHART_COLORS.gray).toBe("#6b7280");
      expect(CHART_COLORS.lightGray).toBe("#d1d5db");
      expect(CHART_COLORS.darkGray).toBe("#374151");
    });

    it("has 8 palette colors", () => {
      expect(CHART_COLORS.palette).toHaveLength(8);
      expect(CHART_COLORS.palette[0]).toBe("#2563eb");
      expect(CHART_COLORS.palette[7]).toBe("#db2777");
    });

    it("has status colors", () => {
      expect(CHART_COLORS.status.pending).toBe("#f59e0b");
      expect(CHART_COLORS.status.paid).toBe("#3b82f6");
      expect(CHART_COLORS.status.done).toBe("#22c55e");
      expect(CHART_COLORS.status.failed).toBe("#ef4444");
    });

    it("has service type colors", () => {
      expect(CHART_COLORS.serviceType.TYPE_1).toBe("#2563eb");
      expect(CHART_COLORS.serviceType.TYPE_2).toBe("#7c3aed");
      expect(CHART_COLORS.serviceType.TYPE_3).toBe("#ea580c");
      expect(CHART_COLORS.serviceType.TYPE_4).toBe("#16a34a");
    });

    it("has property type colors", () => {
      expect(CHART_COLORS.propertyType.namas).toBe("#2563eb");
      expect(CHART_COLORS.propertyType.butas).toBe("#16a34a");
      expect(CHART_COLORS.propertyType.sklypas).toBe("#ea580c");
      expect(CHART_COLORS.propertyType.patalpos).toBe("#7c3aed");
    });
  });

  describe("CHART_GRADIENTS", () => {
    it("has gradient definitions for blue", () => {
      expect(CHART_GRADIENTS.blue.start).toContain("rgba");
      expect(CHART_GRADIENTS.blue.end).toContain("rgba");
      expect(CHART_GRADIENTS.blue.start).toContain("0.3");
      expect(CHART_GRADIENTS.blue.end).toContain("0.05");
    });

    it("has gradient definitions for all colors", () => {
      expect(CHART_GRADIENTS.green).toBeDefined();
      expect(CHART_GRADIENTS.violet).toBeDefined();
      expect(CHART_GRADIENTS.orange).toBeDefined();
    });
  });

  describe("getChartColor", () => {
    it("returns first palette color for index 0", () => {
      expect(getChartColor(0)).toBe("#2563eb");
    });

    it("returns correct palette color for various indices", () => {
      expect(getChartColor(1)).toBe("#16a34a");
      expect(getChartColor(2)).toBe("#ea580c");
      expect(getChartColor(7)).toBe("#db2777");
    });

    it("wraps around for indices >= palette length", () => {
      expect(getChartColor(8)).toBe("#2563eb"); // Same as index 0
      expect(getChartColor(9)).toBe("#16a34a"); // Same as index 1
      expect(getChartColor(16)).toBe("#2563eb"); // Same as index 0
    });
  });

  describe("getStatusColor", () => {
    it("returns correct color for pending status", () => {
      expect(getStatusColor("pending")).toBe("#f59e0b");
    });

    it("returns correct color for paid status", () => {
      expect(getStatusColor("paid")).toBe("#3b82f6");
    });

    it("returns correct color for done status", () => {
      expect(getStatusColor("done")).toBe("#22c55e");
    });

    it("returns correct color for failed status", () => {
      expect(getStatusColor("failed")).toBe("#ef4444");
    });

    it("handles case-insensitive status names", () => {
      expect(getStatusColor("PENDING")).toBe("#f59e0b");
      expect(getStatusColor("Paid")).toBe("#3b82f6");
    });

    it("returns gray for unknown status", () => {
      expect(getStatusColor("unknown")).toBe("#6b7280");
      expect(getStatusColor("invalid")).toBe("#6b7280");
    });
  });

  describe("getServiceTypeColor", () => {
    it("returns correct color for TYPE_1", () => {
      expect(getServiceTypeColor("TYPE_1")).toBe("#2563eb");
    });

    it("returns correct color for TYPE_2", () => {
      expect(getServiceTypeColor("TYPE_2")).toBe("#7c3aed");
    });

    it("returns correct color for TYPE_3", () => {
      expect(getServiceTypeColor("TYPE_3")).toBe("#ea580c");
    });

    it("returns correct color for TYPE_4", () => {
      expect(getServiceTypeColor("TYPE_4")).toBe("#16a34a");
    });

    it("returns gray for unknown service type", () => {
      expect(getServiceTypeColor("TYPE_5")).toBe("#6b7280");
      expect(getServiceTypeColor("invalid")).toBe("#6b7280");
    });
  });

  describe("getPropertyTypeColor", () => {
    it("returns correct color for namas", () => {
      expect(getPropertyTypeColor("namas")).toBe("#2563eb");
    });

    it("returns correct color for butas", () => {
      expect(getPropertyTypeColor("butas")).toBe("#16a34a");
    });

    it("returns correct color for sklypas", () => {
      expect(getPropertyTypeColor("sklypas")).toBe("#ea580c");
    });

    it("returns correct color for patalpos", () => {
      expect(getPropertyTypeColor("patalpos")).toBe("#7c3aed");
    });

    it("handles case-insensitive property types", () => {
      expect(getPropertyTypeColor("NAMAS")).toBe("#2563eb");
      expect(getPropertyTypeColor("Butas")).toBe("#16a34a");
    });

    it("returns gray for unknown property type", () => {
      expect(getPropertyTypeColor("unknown")).toBe("#6b7280");
      expect(getPropertyTypeColor("invalid")).toBe("#6b7280");
    });
  });

  describe("color values are valid hex", () => {
    const hexColorRegex = /^#[0-9a-f]{6}$/i;

    it("all primary colors are valid hex", () => {
      expect(CHART_COLORS.primary).toMatch(hexColorRegex);
      expect(CHART_COLORS.secondary).toMatch(hexColorRegex);
      expect(CHART_COLORS.success).toMatch(hexColorRegex);
      expect(CHART_COLORS.warning).toMatch(hexColorRegex);
      expect(CHART_COLORS.danger).toMatch(hexColorRegex);
      expect(CHART_COLORS.info).toMatch(hexColorRegex);
    });

    it("all palette colors are valid hex", () => {
      CHART_COLORS.palette.forEach((color) => {
        expect(color).toMatch(hexColorRegex);
      });
    });

    it("all status colors are valid hex", () => {
      Object.values(CHART_COLORS.status).forEach((color) => {
        expect(color).toMatch(hexColorRegex);
      });
    });

    it("all service type colors are valid hex", () => {
      Object.values(CHART_COLORS.serviceType).forEach((color) => {
        expect(color).toMatch(hexColorRegex);
      });
    });
  });
});
