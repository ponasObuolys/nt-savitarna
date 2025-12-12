import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import {
  getDateRangeFromPreset,
  getDateRange,
  formatDateLt,
  formatDateISO,
  formatDateForChart,
  getOptimalGrouping,
  groupBy,
  groupAndCount,
  groupByDateAndCount,
  fillMissingDates,
  sum,
  average,
  max,
  min,
  topN,
  formatCurrency,
  formatNumber,
  formatPercent,
  calculateChange,
  getOrderPrice,
  DATE_PRESET_LABELS,
} from "@/lib/report-utils";
import type { DateFilter } from "@/types";

describe("report-utils", () => {
  // Mock fixed date for predictable tests
  const MOCK_DATE = new Date("2025-06-15T12:00:00.000Z");

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(MOCK_DATE);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("getDateRangeFromPreset", () => {
    it("returns today's date range for 'today' preset", () => {
      const result = getDateRangeFromPreset("today");
      expect(result.dateFrom.getFullYear()).toBe(2025);
      expect(result.dateFrom.getMonth()).toBe(5); // June (0-indexed)
      expect(result.dateFrom.getDate()).toBe(15);
      expect(result.dateFrom.getHours()).toBe(0);
      expect(result.dateTo.getHours()).toBe(23);
      expect(result.dateTo.getMinutes()).toBe(59);
    });

    it("returns 7 days back for 'week' preset", () => {
      const result = getDateRangeFromPreset("week");
      expect(result.dateFrom.getDate()).toBe(8); // June 15 - 7 = June 8
    });

    it("returns 1 month back for 'month' preset", () => {
      const result = getDateRangeFromPreset("month");
      expect(result.dateFrom.getMonth()).toBe(4); // May (June - 1)
    });

    it("returns 3 months back for 'quarter' preset", () => {
      const result = getDateRangeFromPreset("quarter");
      expect(result.dateFrom.getMonth()).toBe(2); // March (June - 3)
    });

    it("returns 1 year back for 'year' preset", () => {
      const result = getDateRangeFromPreset("year");
      expect(result.dateFrom.getFullYear()).toBe(2024);
      expect(result.dateFrom.getMonth()).toBe(5); // June
    });

    it("returns 30 days back for 'custom' or default preset", () => {
      const { dateFrom } = getDateRangeFromPreset("custom");
      // June 15 - 30 days = May 16
      expect(dateFrom.getMonth()).toBe(4); // May
      expect(dateFrom.getDate()).toBe(16);
    });
  });

  describe("getDateRange", () => {
    it("returns custom date range when preset is custom with valid dates", () => {
      const filter: DateFilter = {
        preset: "custom",
        dateFrom: new Date("2025-01-01"),
        dateTo: new Date("2025-01-31"),
      };
      const { dateFrom, dateTo } = getDateRange(filter);
      expect(dateFrom.getMonth()).toBe(0); // January
      expect(dateTo.getDate()).toBe(31);
    });

    it("falls back to preset when custom dates are missing", () => {
      const filter: DateFilter = {
        preset: "custom",
        dateFrom: null,
        dateTo: null,
      };
      const { dateFrom } = getDateRange(filter);
      // Should fall back to 30 days ago
      expect(dateFrom.getMonth()).toBe(4); // May
    });

    it("uses preset calculation for non-custom presets", () => {
      const filter: DateFilter = {
        preset: "week",
        dateFrom: null,
        dateTo: null,
      };
      const { dateFrom } = getDateRange(filter);
      expect(dateFrom.getDate()).toBe(8); // 7 days ago
    });
  });

  describe("formatDateLt", () => {
    it("returns '—' for null date", () => {
      expect(formatDateLt(null)).toBe("—");
    });

    it("returns '—' for invalid date string", () => {
      expect(formatDateLt("invalid-date")).toBe("—");
    });

    it("formats date in short format by default", () => {
      const result = formatDateLt(new Date("2025-06-15"));
      expect(result).toMatch(/2025/);
      expect(result).toMatch(/06|6/);
      expect(result).toMatch(/15/);
    });

    it("formats date from string input", () => {
      const result = formatDateLt("2025-06-15");
      expect(result).toMatch(/2025/);
    });

    it("formats date in long format", () => {
      const result = formatDateLt(new Date("2025-06-15"), "long");
      expect(result).toMatch(/2025/);
    });

    it("formats date in month format", () => {
      const result = formatDateLt(new Date("2025-06-15"), "month");
      expect(result).toMatch(/2025/);
    });
  });

  describe("formatDateISO", () => {
    it("formats date as YYYY-MM-DD", () => {
      const result = formatDateISO(new Date("2025-06-15T12:00:00Z"));
      expect(result).toBe("2025-06-15");
    });
  });

  describe("formatDateForChart", () => {
    it("formats for day grouping as YYYY-MM-DD", () => {
      const result = formatDateForChart(new Date("2025-06-15"), "day");
      expect(result).toBe("2025-06-15");
    });

    it("formats for month grouping as YYYY-MM", () => {
      const result = formatDateForChart(new Date("2025-06-15"), "month");
      expect(result).toBe("2025-06");
    });

    it("formats for week grouping as Monday's date", () => {
      // June 15, 2025 is Sunday, so week start is June 9 (Monday)
      const result = formatDateForChart(new Date("2025-06-15"), "week");
      expect(result).toBe("2025-06-09");
    });
  });

  describe("getOptimalGrouping", () => {
    it("returns 'day' for ranges up to 31 days", () => {
      const dateFrom = new Date("2025-06-01");
      const dateTo = new Date("2025-06-30");
      expect(getOptimalGrouping(dateFrom, dateTo)).toBe("day");
    });

    it("returns 'week' for ranges between 32-90 days", () => {
      const dateFrom = new Date("2025-04-01");
      const dateTo = new Date("2025-06-15");
      expect(getOptimalGrouping(dateFrom, dateTo)).toBe("week");
    });

    it("returns 'month' for ranges over 90 days", () => {
      const dateFrom = new Date("2024-06-15");
      const dateTo = new Date("2025-06-15");
      expect(getOptimalGrouping(dateFrom, dateTo)).toBe("month");
    });
  });

  describe("groupBy", () => {
    it("groups items by key function", () => {
      const items = [
        { name: "A", category: "cat1" },
        { name: "B", category: "cat1" },
        { name: "C", category: "cat2" },
      ];
      const result = groupBy(items, (item) => item.category);
      expect(Object.keys(result)).toEqual(["cat1", "cat2"]);
      expect(result["cat1"]).toHaveLength(2);
      expect(result["cat2"]).toHaveLength(1);
    });

    it("handles empty array", () => {
      const result = groupBy([], (item: string) => item);
      expect(result).toEqual({});
    });
  });

  describe("groupAndCount", () => {
    it("groups and counts items, sorted by count descending", () => {
      const items = [
        { status: "done" },
        { status: "pending" },
        { status: "done" },
        { status: "done" },
        { status: "pending" },
      ];
      const result = groupAndCount(items, (item) => item.status);
      expect(result).toEqual([
        { name: "done", value: 3 },
        { name: "pending", value: 2 },
      ]);
    });

    it("handles empty array", () => {
      const result = groupAndCount([], (item: string) => item);
      expect(result).toEqual([]);
    });
  });

  describe("groupByDateAndCount", () => {
    it("groups items by date and counts", () => {
      const items = [
        { created: new Date("2025-06-01") },
        { created: new Date("2025-06-01") },
        { created: new Date("2025-06-02") },
      ];
      const result = groupByDateAndCount(items, (item) => item.created, "day");
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({ date: "2025-06-01", value: 2 });
      expect(result[1]).toEqual({ date: "2025-06-02", value: 1 });
    });

    it("handles null dates gracefully", () => {
      const items = [{ created: null }, { created: new Date("2025-06-01") }];
      const result = groupByDateAndCount(
        items,
        (item) => item.created,
        "day"
      );
      expect(result).toHaveLength(1);
    });

    it("handles string date input", () => {
      const items = [{ created: "2025-06-01" }, { created: "2025-06-01" }];
      const result = groupByDateAndCount(items, (item) => item.created, "day");
      expect(result[0].value).toBe(2);
    });
  });

  describe("fillMissingDates", () => {
    it("fills missing dates with zero values", () => {
      const data = [
        { date: "2025-06-01", value: 5 },
        { date: "2025-06-03", value: 3 },
      ];
      const result = fillMissingDates(
        data,
        new Date("2025-06-01"),
        new Date("2025-06-03"),
        "day"
      );
      expect(result).toHaveLength(3);
      expect(result[1]).toEqual({ date: "2025-06-02", value: 0 });
    });

    it("handles month grouping", () => {
      const data = [{ date: "2025-01", value: 10 }];
      const result = fillMissingDates(
        data,
        new Date("2025-01-01"),
        new Date("2025-03-01"),
        "month"
      );
      expect(result.length).toBeGreaterThanOrEqual(3);
    });
  });

  describe("aggregation functions", () => {
    const items = [{ value: 10 }, { value: 20 }, { value: 30 }];
    const valueFn = (item: { value: number }) => item.value;

    describe("sum", () => {
      it("calculates sum correctly", () => {
        expect(sum(items, valueFn)).toBe(60);
      });

      it("returns 0 for empty array", () => {
        expect(sum([], valueFn)).toBe(0);
      });
    });

    describe("average", () => {
      it("calculates average correctly", () => {
        expect(average(items, valueFn)).toBe(20);
      });

      it("returns 0 for empty array", () => {
        expect(average([], valueFn)).toBe(0);
      });
    });

    describe("max", () => {
      it("finds maximum item", () => {
        const result = max(items, valueFn);
        expect(result?.value).toBe(30);
      });

      it("returns null for empty array", () => {
        expect(max([], valueFn)).toBeNull();
      });
    });

    describe("min", () => {
      it("finds minimum item", () => {
        const result = min(items, valueFn);
        expect(result?.value).toBe(10);
      });

      it("returns null for empty array", () => {
        expect(min([], valueFn)).toBeNull();
      });
    });

    describe("topN", () => {
      it("returns top N items sorted by value", () => {
        const result = topN(items, 2, valueFn);
        expect(result).toHaveLength(2);
        expect(result[0].value).toBe(30);
        expect(result[1].value).toBe(20);
      });

      it("returns all items if N > length", () => {
        const result = topN(items, 10, valueFn);
        expect(result).toHaveLength(3);
      });
    });
  });

  describe("formatting functions", () => {
    describe("formatCurrency", () => {
      it("formats currency in EUR", () => {
        const result = formatCurrency(1234.56);
        expect(result).toContain("1");
        expect(result).toContain("234");
        expect(result).toContain("€");
      });

      it("formats zero correctly", () => {
        const result = formatCurrency(0);
        expect(result).toContain("0");
        expect(result).toContain("€");
      });
    });

    describe("formatNumber", () => {
      it("formats number with thousand separators", () => {
        const result = formatNumber(1234567);
        // Lithuanian uses space as thousand separator
        expect(result).toMatch(/1.*234.*567/);
      });
    });

    describe("formatPercent", () => {
      it("formats percentage with default 1 decimal", () => {
        expect(formatPercent(12.345)).toBe("12.3%");
      });

      it("formats percentage with custom decimals", () => {
        expect(formatPercent(12.3456, 2)).toBe("12.35%");
      });
    });

    describe("calculateChange", () => {
      it("calculates positive change", () => {
        expect(calculateChange(150, 100)).toBe(50);
      });

      it("calculates negative change", () => {
        expect(calculateChange(50, 100)).toBe(-50);
      });

      it("handles zero previous value", () => {
        expect(calculateChange(100, 0)).toBe(100);
        expect(calculateChange(0, 0)).toBe(0);
      });
    });
  });

  describe("getOrderPrice", () => {
    it("returns 8 for TYPE_1", () => {
      expect(getOrderPrice("TYPE_1", null)).toBe(8);
    });

    it("returns 30 for TYPE_2", () => {
      expect(getOrderPrice("TYPE_2", null)).toBe(30);
    });

    it("returns custom price for TYPE_3", () => {
      expect(getOrderPrice("TYPE_3", 150)).toBe(150);
    });

    it("returns custom price for TYPE_4", () => {
      expect(getOrderPrice("TYPE_4", 200)).toBe(200);
    });

    it("returns 0 for TYPE_3/TYPE_4 without custom price", () => {
      expect(getOrderPrice("TYPE_3", null)).toBe(0);
      expect(getOrderPrice("TYPE_4", null)).toBe(0);
    });

    it("returns 0 for null service type", () => {
      expect(getOrderPrice(null, 100)).toBe(0);
    });

    it("returns 0 for unknown service type", () => {
      expect(getOrderPrice("UNKNOWN", null)).toBe(0);
    });
  });

  describe("DATE_PRESET_LABELS", () => {
    it("contains all preset labels", () => {
      expect(DATE_PRESET_LABELS.today).toBe("Šiandien");
      expect(DATE_PRESET_LABELS.week).toBe("Paskutinės 7 dienos");
      expect(DATE_PRESET_LABELS.month).toBe("Paskutinės 30 dienų");
      expect(DATE_PRESET_LABELS.quarter).toBe("Paskutiniai 3 mėnesiai");
      expect(DATE_PRESET_LABELS.year).toBe("Paskutiniai 12 mėnesių");
      expect(DATE_PRESET_LABELS.custom).toBe("Pasirinktas laikotarpis");
    });
  });
});
