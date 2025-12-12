/**
 * Tests for report-utils.ts
 * Run with: npx tsx __tests__/report-utils.test.ts
 */

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
  // fillMissingDates - not used in tests yet
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
} from "../src/lib/report-utils";
import type { DateFilter } from "../src/types";

// Test runner
const tests: { name: string; fn: () => void }[] = [];
let passed = 0;
let failed = 0;

function test(name: string, fn: () => void) {
  tests.push({ name, fn });
}

function expect<T>(actual: T) {
  return {
    toBe(expected: T) {
      if (actual !== expected) {
        throw new Error(`Expected ${expected}, got ${actual}`);
      }
    },
    toEqual(expected: T) {
      if (JSON.stringify(actual) !== JSON.stringify(expected)) {
        throw new Error(`Expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
      }
    },
    toBeNull() {
      if (actual !== null) {
        throw new Error(`Expected null, got ${actual}`);
      }
    },
    toBeGreaterThan(expected: number) {
      if (typeof actual !== "number" || actual <= expected) {
        throw new Error(`Expected ${actual} to be greater than ${expected}`);
      }
    },
    toBeLessThan(expected: number) {
      if (typeof actual !== "number" || actual >= expected) {
        throw new Error(`Expected ${actual} to be less than ${expected}`);
      }
    },
    toContain(expected: string) {
      if (typeof actual !== "string" || !actual.includes(expected)) {
        throw new Error(`Expected ${actual} to contain ${expected}`);
      }
    },
    toHaveLength(expected: number) {
      if (!Array.isArray(actual) || actual.length !== expected) {
        throw new Error(`Expected length ${expected}, got ${Array.isArray(actual) ? actual.length : "non-array"}`);
      }
    },
  };
}

// ===== Tests =====

// Date preset tests
test("getDateRangeFromPreset - today", () => {
  const { dateFrom, dateTo } = getDateRangeFromPreset("today");
  const now = new Date();
  expect(dateFrom.getDate()).toBe(now.getDate());
  expect(dateTo.getDate()).toBe(now.getDate());
});

test("getDateRangeFromPreset - week", () => {
  const { dateFrom, dateTo } = getDateRangeFromPreset("week");
  const daysDiff = Math.ceil((dateTo.getTime() - dateFrom.getTime()) / (1000 * 60 * 60 * 24));
  // Week preset is "last 7 days" which includes today, so range is 7-8 days
  expect(daysDiff).toBeGreaterThan(6);
  expect(daysDiff).toBeLessThan(9);
});

test("getDateRangeFromPreset - month", () => {
  const { dateFrom, dateTo } = getDateRangeFromPreset("month");
  const daysDiff = Math.ceil((dateTo.getTime() - dateFrom.getTime()) / (1000 * 60 * 60 * 24));
  expect(daysDiff).toBeGreaterThan(27);
  expect(daysDiff).toBeLessThan(32);
});

test("getDateRangeFromPreset - quarter", () => {
  const { dateFrom, dateTo } = getDateRangeFromPreset("quarter");
  const daysDiff = Math.ceil((dateTo.getTime() - dateFrom.getTime()) / (1000 * 60 * 60 * 24));
  expect(daysDiff).toBeGreaterThan(85);
  expect(daysDiff).toBeLessThan(95);
});

test("getDateRangeFromPreset - year", () => {
  const { dateFrom, dateTo } = getDateRangeFromPreset("year");
  const daysDiff = Math.ceil((dateTo.getTime() - dateFrom.getTime()) / (1000 * 60 * 60 * 24));
  expect(daysDiff).toBeGreaterThan(360);
  expect(daysDiff).toBeLessThan(370);
});

// Date filter tests
test("getDateRange - preset", () => {
  const filter: DateFilter = { preset: "week", dateFrom: null, dateTo: null };
  const { dateFrom, dateTo } = getDateRange(filter);
  const daysDiff = Math.ceil((dateTo.getTime() - dateFrom.getTime()) / (1000 * 60 * 60 * 24));
  // Week preset is "last 7 days" which includes today, so range is 7-8 days
  expect(daysDiff).toBeGreaterThan(6);
  expect(daysDiff).toBeLessThan(9);
});

test("getDateRange - custom", () => {
  const from = new Date("2024-01-01");
  const to = new Date("2024-01-31");
  const filter: DateFilter = { preset: "custom", dateFrom: from, dateTo: to };
  const { dateFrom, dateTo } = getDateRange(filter);
  expect(dateFrom.toISOString().split("T")[0]).toBe("2024-01-01");
  expect(dateTo.toISOString().split("T")[0]).toBe("2024-01-31");
});

// Date formatting tests
test("formatDateLt - short", () => {
  const date = new Date("2024-03-15");
  const formatted = formatDateLt(date, "short");
  expect(formatted).toContain("2024");
});

test("formatDateLt - null", () => {
  const formatted = formatDateLt(null);
  expect(formatted).toBe("—");
});

test("formatDateISO", () => {
  const date = new Date("2024-03-15T12:00:00Z");
  const formatted = formatDateISO(date);
  expect(formatted).toBe("2024-03-15");
});

test("formatDateForChart - day", () => {
  const date = new Date("2024-03-15");
  const formatted = formatDateForChart(date, "day");
  expect(formatted).toBe("2024-03-15");
});

test("formatDateForChart - month", () => {
  const date = new Date("2024-03-15");
  const formatted = formatDateForChart(date, "month");
  expect(formatted).toBe("2024-03");
});

// Optimal grouping tests
test("getOptimalGrouping - short period (day)", () => {
  const dateFrom = new Date("2024-03-01");
  const dateTo = new Date("2024-03-15");
  const grouping = getOptimalGrouping(dateFrom, dateTo);
  expect(grouping).toBe("day");
});

test("getOptimalGrouping - medium period (week)", () => {
  const dateFrom = new Date("2024-01-01");
  const dateTo = new Date("2024-03-15");
  const grouping = getOptimalGrouping(dateFrom, dateTo);
  expect(grouping).toBe("week");
});

test("getOptimalGrouping - long period (month)", () => {
  const dateFrom = new Date("2023-01-01");
  const dateTo = new Date("2024-03-15");
  const grouping = getOptimalGrouping(dateFrom, dateTo);
  expect(grouping).toBe("month");
});

// Grouping tests
test("groupBy", () => {
  const items = [
    { category: "A", value: 1 },
    { category: "B", value: 2 },
    { category: "A", value: 3 },
  ];
  const grouped = groupBy(items, (item) => item.category);
  expect(Object.keys(grouped).length).toBe(2);
  expect(grouped["A"].length).toBe(2);
  expect(grouped["B"].length).toBe(1);
});

test("groupAndCount", () => {
  const items = [
    { category: "A" },
    { category: "B" },
    { category: "A" },
    { category: "A" },
  ];
  const result = groupAndCount(items, (item) => item.category);
  expect(result.length).toBe(2);
  expect(result[0].name).toBe("A");
  expect(result[0].value).toBe(3);
  expect(result[1].name).toBe("B");
  expect(result[1].value).toBe(1);
});

test("groupByDateAndCount", () => {
  const items = [
    { date: "2024-03-01" },
    { date: "2024-03-01" },
    { date: "2024-03-02" },
  ];
  const result = groupByDateAndCount(items, (item) => item.date, "day");
  expect(result.length).toBe(2);
  expect(result[0].value).toBe(2);
  expect(result[1].value).toBe(1);
});

// Aggregation tests
test("sum", () => {
  const items = [{ value: 10 }, { value: 20 }, { value: 30 }];
  const result = sum(items, (item) => item.value);
  expect(result).toBe(60);
});

test("average", () => {
  const items = [{ value: 10 }, { value: 20 }, { value: 30 }];
  const result = average(items, (item) => item.value);
  expect(result).toBe(20);
});

test("average - empty", () => {
  const result = average([], () => 0);
  expect(result).toBe(0);
});

test("max", () => {
  const items = [{ value: 10 }, { value: 30 }, { value: 20 }];
  const result = max(items, (item) => item.value);
  expect(result?.value).toBe(30);
});

test("max - empty", () => {
  const result = max([], () => 0);
  expect(result).toBeNull();
});

test("min", () => {
  const items = [{ value: 10 }, { value: 30 }, { value: 20 }];
  const result = min(items, (item) => item.value);
  expect(result?.value).toBe(10);
});

test("topN", () => {
  const items = [{ value: 10 }, { value: 30 }, { value: 20 }, { value: 40 }];
  const result = topN(items, 2, (item) => item.value);
  expect(result.length).toBe(2);
  expect(result[0].value).toBe(40);
  expect(result[1].value).toBe(30);
});

// Formatting tests
test("formatCurrency", () => {
  const formatted = formatCurrency(1234.56);
  expect(formatted).toContain("1");
  expect(formatted).toContain("€");
});

test("formatNumber", () => {
  const formatted = formatNumber(1234567);
  // Lithuanian uses space as thousands separator
  expect(formatted.replace(/\s/g, "")).toBe("1234567");
});

test("formatPercent", () => {
  const formatted = formatPercent(12.345, 1);
  expect(formatted).toBe("12.3%");
});

test("calculateChange - positive", () => {
  const change = calculateChange(120, 100);
  expect(change).toBe(20);
});

test("calculateChange - negative", () => {
  const change = calculateChange(80, 100);
  expect(change).toBe(-20);
});

test("calculateChange - zero previous", () => {
  const change = calculateChange(100, 0);
  expect(change).toBe(100);
});

// Order price tests
test("getOrderPrice - TYPE_1", () => {
  const price = getOrderPrice("TYPE_1", null);
  expect(price).toBe(8);
});

test("getOrderPrice - TYPE_2", () => {
  const price = getOrderPrice("TYPE_2", null);
  expect(price).toBe(30);
});

test("getOrderPrice - TYPE_3 with custom price", () => {
  const price = getOrderPrice("TYPE_3", 150);
  expect(price).toBe(150);
});

test("getOrderPrice - TYPE_4 with custom price", () => {
  const price = getOrderPrice("TYPE_4", 200);
  expect(price).toBe(200);
});

test("getOrderPrice - null type", () => {
  const price = getOrderPrice(null, null);
  expect(price).toBe(0);
});

// Date preset labels test
test("DATE_PRESET_LABELS", () => {
  expect(DATE_PRESET_LABELS.today).toBe("Šiandien");
  expect(DATE_PRESET_LABELS.week).toBe("Paskutinės 7 dienos");
  expect(DATE_PRESET_LABELS.month).toBe("Paskutinės 30 dienų");
  expect(DATE_PRESET_LABELS.quarter).toBe("Paskutiniai 3 mėnesiai");
  expect(DATE_PRESET_LABELS.year).toBe("Paskutiniai 12 mėnesių");
  expect(DATE_PRESET_LABELS.custom).toBe("Pasirinktas laikotarpis");
});

// Run tests
console.log("\n🧪 Running report-utils tests...\n");

for (const { name, fn } of tests) {
  try {
    fn();
    console.log(`  ✅ ${name}`);
    passed++;
  } catch (error) {
    console.log(`  ❌ ${name}`);
    console.log(`     ${error instanceof Error ? error.message : error}`);
    failed++;
  }
}

console.log(`\n📊 Results: ${passed} passed, ${failed} failed\n`);

if (failed > 0) {
  process.exit(1);
}
