import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { ValuatorWorkload } from "@/components/reports/ValuatorWorkload";
import type { DateFilter, ValuatorWorkloadData } from "@/types";

// Mock fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Mock Recharts components
vi.mock("recharts", async () => {
  const actual = await vi.importActual("recharts");
  return {
    ...actual,
    ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="responsive-container">{children}</div>
    ),
    BarChart: ({ children, data }: { children: React.ReactNode; data: unknown[] }) => (
      <div data-testid="bar-chart" data-items={data?.length || 0}>
        {children}
      </div>
    ),
    AreaChart: ({ children, data }: { children: React.ReactNode; data: unknown[] }) => (
      <div data-testid="area-chart" data-items={data?.length || 0}>
        {children}
      </div>
    ),
    Bar: () => <div data-testid="bar" />,
    Area: ({ dataKey }: { dataKey: string }) => <div data-testid={`area-${dataKey}`} />,
    XAxis: () => <div data-testid="x-axis" />,
    YAxis: () => <div data-testid="y-axis" />,
    CartesianGrid: () => <div data-testid="grid" />,
    Tooltip: () => <div data-testid="tooltip" />,
    Legend: () => <div data-testid="legend" />,
    Cell: () => <div data-testid="cell" />,
  };
});

describe("ValuatorWorkload", () => {
  const defaultDateFilter: DateFilter = {
    preset: "month",
    dateFrom: null,
    dateTo: null,
  };

  const mockSuccessData: ValuatorWorkloadData = {
    totalAssigned: 150,
    averagePerValuator: 30,
    mostLoaded: { name: "Jonas Jonaitis", count: 45 },
    leastLoaded: { name: "Petras Petraitis", count: 15 },
    byValuator: [
      { name: "Jonas Jonaitis", value: 45 },
      { name: "Antanas Antanaitis", value: 35 },
      { name: "Kazys Kazaitis", value: 30 },
    ],
    timeline: [
      { date: "2025-06-01", V001: 5, V002: 3 },
      { date: "2025-06-02", V001: 7, V002: 4 },
    ],
    ranking: [
      {
        id: 1,
        code: "V001",
        name: "Jonas Jonaitis",
        completedOrders: 40,
        inProgressOrders: 5,
        totalOrders: 45,
      },
      {
        id: 2,
        code: "V002",
        name: "Antanas Antanaitis",
        completedOrders: 30,
        inProgressOrders: 5,
        totalOrders: 35,
      },
    ],
  };

  beforeEach(() => {
    mockFetch.mockClear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("shows loading state initially", () => {
    mockFetch.mockImplementation(() => new Promise(() => {})); // Never resolves
    render(<ValuatorWorkload dateFilter={defaultDateFilter} />);

    // Check for loading skeleton via aria-busy or similar
    const statsCards = document.querySelectorAll('[class*="animate-pulse"]');
    expect(statsCards.length).toBeGreaterThan(0);
  });

  it("displays stats cards with correct values after loading", async () => {
    mockFetch.mockResolvedValueOnce({
      json: () => Promise.resolve({ success: true, data: mockSuccessData }),
    });

    render(<ValuatorWorkload dateFilter={defaultDateFilter} />);

    await waitFor(() => {
      expect(screen.getByText("150")).toBeInTheDocument();
    });

    // "30" and "Jonas Jonaitis" appear multiple times
    expect(screen.getAllByText("30").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Jonas Jonaitis").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("Petras Petraitis")).toBeInTheDocument();
  });

  it("displays correct descriptions in stats cards", async () => {
    mockFetch.mockResolvedValueOnce({
      json: () => Promise.resolve({ success: true, data: mockSuccessData }),
    });

    render(<ValuatorWorkload dateFilter={defaultDateFilter} />);

    await waitFor(() => {
      expect(screen.getByText(/Per pasirink/)).toBeInTheDocument();
    });

    expect(screen.getByText(/45 u/)).toBeInTheDocument(); // mostLoaded description
    expect(screen.getByText(/15 u/)).toBeInTheDocument(); // leastLoaded description
  });

  it("renders bar chart for valuator workload", async () => {
    mockFetch.mockResolvedValueOnce({
      json: () => Promise.resolve({ success: true, data: mockSuccessData }),
    });

    render(<ValuatorWorkload dateFilter={defaultDateFilter} />);

    await waitFor(() => {
      expect(screen.getAllByTestId("bar-chart").length).toBeGreaterThan(0);
    });
  });

  it("renders ranking table with correct data", async () => {
    mockFetch.mockResolvedValueOnce({
      json: () => Promise.resolve({ success: true, data: mockSuccessData }),
    });

    render(<ValuatorWorkload dateFilter={defaultDateFilter} />);

    await waitFor(() => {
      expect(screen.getByText("V001")).toBeInTheDocument();
    });

    expect(screen.getByText("V002")).toBeInTheDocument();
    expect(screen.getByText("40")).toBeInTheDocument(); // completedOrders
    expect(screen.getByText("45")).toBeInTheDocument(); // totalOrders
  });

  it("shows error message on API failure", async () => {
    mockFetch.mockResolvedValueOnce({
      json: () => Promise.resolve({ success: false, error: "Server error" }),
    });

    render(<ValuatorWorkload dateFilter={defaultDateFilter} />);

    await waitFor(() => {
      const errorElements = screen.queryAllByText("Server error");
      expect(errorElements.length).toBeGreaterThan(0);
    }, { timeout: 3000 });
  });

  it("shows error message on network failure", async () => {
    mockFetch.mockRejectedValueOnce(new Error("Network error"));

    render(<ValuatorWorkload dateFilter={defaultDateFilter} />);

    await waitFor(() => {
      const errorElements = screen.queryAllByText(/Nepavyko prisijungti/);
      expect(errorElements.length).toBeGreaterThan(0);
    }, { timeout: 3000 });
  });

  it("refetches data when date filter changes", async () => {
    mockFetch.mockResolvedValue({
      json: () => Promise.resolve({ success: true, data: mockSuccessData }),
    });

    const { rerender } = render(
      <ValuatorWorkload dateFilter={defaultDateFilter} />
    );

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    const newFilter: DateFilter = {
      preset: "week",
      dateFrom: null,
      dateTo: null,
    };

    rerender(<ValuatorWorkload dateFilter={newFilter} />);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledTimes(2);
    });
  });

  it("constructs correct API URL with date filter", async () => {
    mockFetch.mockResolvedValueOnce({
      json: () => Promise.resolve({ success: true, data: mockSuccessData }),
    });

    render(<ValuatorWorkload dateFilter={defaultDateFilter} />);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("/api/admin/reports/valuators?preset=month")
      );
    });
  });

  it("handles custom date filter with dateFrom and dateTo", async () => {
    mockFetch.mockResolvedValueOnce({
      json: () => Promise.resolve({ success: true, data: mockSuccessData }),
    });

    const customFilter: DateFilter = {
      preset: "custom",
      dateFrom: new Date("2025-01-01"),
      dateTo: new Date("2025-01-31"),
    };

    render(<ValuatorWorkload dateFilter={customFilter} />);

    await waitFor(() => {
      const url = mockFetch.mock.calls[0][0] as string;
      expect(url).toContain("preset=custom");
      expect(url).toContain("dateFrom=2025-01-01");
      expect(url).toContain("dateTo=2025-01-31");
    });
  });

  it("shows empty state when no data", async () => {
    const emptyData: ValuatorWorkloadData = {
      totalAssigned: 0,
      averagePerValuator: 0,
      mostLoaded: null,
      leastLoaded: null,
      byValuator: [],
      timeline: [],
      ranking: [],
    };

    mockFetch.mockResolvedValueOnce({
      json: () => Promise.resolve({ success: true, data: emptyData }),
    });

    render(<ValuatorWorkload dateFilter={defaultDateFilter} />);

    await waitFor(() => {
      // Multiple "0" values should appear for stats cards
      const zeros = screen.getAllByText("0");
      expect(zeros.length).toBeGreaterThanOrEqual(1);
    });
  });

  it("displays chart titles correctly", async () => {
    mockFetch.mockResolvedValueOnce({
      json: () => Promise.resolve({ success: true, data: mockSuccessData }),
    });

    render(<ValuatorWorkload dateFilter={defaultDateFilter} />);

    await waitFor(() => {
      expect(screen.getByText(/Užsakymai pagal vertintoją/)).toBeInTheDocument();
    });

    expect(screen.getByText(/Apkrovimas per laikotarp/)).toBeInTheDocument();
  });

  it("displays ranking table title", async () => {
    mockFetch.mockResolvedValueOnce({
      json: () => Promise.resolve({ success: true, data: mockSuccessData }),
    });

    render(<ValuatorWorkload dateFilter={defaultDateFilter} />);

    await waitFor(() => {
      expect(screen.getByText(/Vertintojų reitingas/)).toBeInTheDocument();
    });
  });
});
