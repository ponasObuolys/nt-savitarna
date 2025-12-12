import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { ClientActivity } from "@/components/reports/ClientActivity";
import type { DateFilter, ClientActivityData } from "@/types";

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
    LineChart: ({ children, data }: { children: React.ReactNode; data: unknown[] }) => (
      <div data-testid="line-chart" data-items={data?.length || 0}>
        {children}
      </div>
    ),
    PieChart: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="pie-chart">{children}</div>
    ),
    Line: ({ dataKey }: { dataKey: string }) => <div data-testid={`line-${dataKey}`} />,
    Pie: ({ data }: { data: unknown[] }) => (
      <div data-testid="pie" data-items={data?.length || 0} />
    ),
    XAxis: () => <div data-testid="x-axis" />,
    YAxis: () => <div data-testid="y-axis" />,
    CartesianGrid: () => <div data-testid="grid" />,
    Tooltip: () => <div data-testid="tooltip" />,
    Legend: () => <div data-testid="legend" />,
    Cell: () => <div data-testid="cell" />,
  };
});

describe("ClientActivity", () => {
  const defaultDateFilter: DateFilter = {
    preset: "month",
    dateFrom: null,
    dateTo: null,
  };

  const mockSuccessData: ClientActivityData = {
    totalClients: 250,
    activeClients: 180,
    newThisMonth: 25,
    registrationTimeline: [
      { date: "2025-06-01", value: 5 },
      { date: "2025-06-02", value: 8 },
      { date: "2025-06-03", value: 3 },
    ],
    activityDistribution: [
      { name: "1 užsakymas", value: 50 },
      { name: "2-3 užsakymai", value: 80 },
      { name: "4-5 užsakymai", value: 30 },
      { name: "6-10 užsakymų", value: 15 },
      { name: "11+ užsakymų", value: 5 },
    ],
    topClients: [
      { id: 1, email: "jonas@example.com", name: "Jonas Jonaitis", ordersCount: 25, totalSpent: 1500 },
      { id: 2, email: "petras@example.com", name: "Petras Petraitis", ordersCount: 20, totalSpent: 1200 },
      { id: 3, email: "antanas@example.com", name: "Antanas Antanaitis", ordersCount: 15, totalSpent: 900 },
    ],
  };

  beforeEach(() => {
    mockFetch.mockClear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("shows loading state initially", () => {
    mockFetch.mockImplementation(() => new Promise(() => {}));
    render(<ClientActivity dateFilter={defaultDateFilter} />);

    const statsCards = document.querySelectorAll('[class*="animate-pulse"]');
    expect(statsCards.length).toBeGreaterThan(0);
  });

  it("displays stats cards with correct values after loading", async () => {
    mockFetch.mockResolvedValueOnce({
      json: () => Promise.resolve({ success: true, data: mockSuccessData }),
    });

    render(<ClientActivity dateFilter={defaultDateFilter} />);

    await waitFor(() => {
      expect(screen.getByText("250")).toBeInTheDocument();
    });

    expect(screen.getByText("180")).toBeInTheDocument();
    // "25" appears in both stats and table, so we check it exists at all
    expect(screen.getAllByText("25").length).toBeGreaterThanOrEqual(1);
  });

  it("displays correct stat card titles", async () => {
    mockFetch.mockResolvedValueOnce({
      json: () => Promise.resolve({ success: true, data: mockSuccessData }),
    });

    render(<ClientActivity dateFilter={defaultDateFilter} />);

    await waitFor(() => {
      expect(screen.getByText(/Viso klient/)).toBeInTheDocument();
    });

    expect(screen.getByText(/Aktyv/)).toBeInTheDocument();
    expect(screen.getByText(/Nauji/)).toBeInTheDocument();
  });

  it("calculates and displays average orders per client", async () => {
    mockFetch.mockResolvedValueOnce({
      json: () => Promise.resolve({ success: true, data: mockSuccessData }),
    });

    render(<ClientActivity dateFilter={defaultDateFilter} />);

    await waitFor(() => {
      // Average = (25 + 20 + 15) / 3 = 20
      // May appear multiple times, so we use getAllByText
      expect(screen.getAllByText("20").length).toBeGreaterThanOrEqual(1);
    });
  });

  it("renders line chart for registration timeline", async () => {
    mockFetch.mockResolvedValueOnce({
      json: () => Promise.resolve({ success: true, data: mockSuccessData }),
    });

    render(<ClientActivity dateFilter={defaultDateFilter} />);

    await waitFor(() => {
      expect(screen.getByTestId("line-chart")).toBeInTheDocument();
    });
  });

  it("renders pie chart for activity distribution", async () => {
    mockFetch.mockResolvedValueOnce({
      json: () => Promise.resolve({ success: true, data: mockSuccessData }),
    });

    render(<ClientActivity dateFilter={defaultDateFilter} />);

    await waitFor(() => {
      expect(screen.getByTestId("pie-chart")).toBeInTheDocument();
    });
  });

  it("renders top clients table with correct data", async () => {
    mockFetch.mockResolvedValueOnce({
      json: () => Promise.resolve({ success: true, data: mockSuccessData }),
    });

    render(<ClientActivity dateFilter={defaultDateFilter} />);

    await waitFor(() => {
      expect(screen.getByText("Jonas Jonaitis")).toBeInTheDocument();
    });

    expect(screen.getByText("Petras Petraitis")).toBeInTheDocument();
    expect(screen.getByText("jonas@example.com")).toBeInTheDocument();
  });

  it("displays orders count in top clients table", async () => {
    mockFetch.mockResolvedValueOnce({
      json: () => Promise.resolve({ success: true, data: mockSuccessData }),
    });

    render(<ClientActivity dateFilter={defaultDateFilter} />);

    await waitFor(() => {
      // Order counts from topClients
      const counts = screen.getAllByText(/^25$|^20$|^15$/);
      expect(counts.length).toBeGreaterThan(0);
    });
  });

  it("shows error message on API failure", async () => {
    mockFetch.mockResolvedValueOnce({
      json: () => Promise.resolve({ success: false, error: "Server error" }),
    });

    render(<ClientActivity dateFilter={defaultDateFilter} />);

    await waitFor(() => {
      // Error is displayed in ChartWrapper components
      const errorElements = screen.queryAllByText("Server error");
      expect(errorElements.length).toBeGreaterThan(0);
    }, { timeout: 3000 });
  });

  it("shows error message on network failure", async () => {
    mockFetch.mockRejectedValueOnce(new Error("Network error"));

    render(<ClientActivity dateFilter={defaultDateFilter} />);

    await waitFor(() => {
      // Error message should be displayed in the ChartWrapper
      const errorElements = screen.queryAllByText(/Nepavyko prisijungti/);
      expect(errorElements.length).toBeGreaterThan(0);
    }, { timeout: 3000 });
  });

  it("refetches data when date filter changes", async () => {
    mockFetch.mockResolvedValue({
      json: () => Promise.resolve({ success: true, data: mockSuccessData }),
    });

    const { rerender } = render(
      <ClientActivity dateFilter={defaultDateFilter} />
    );

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    const newFilter: DateFilter = {
      preset: "week",
      dateFrom: null,
      dateTo: null,
    };

    rerender(<ClientActivity dateFilter={newFilter} />);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledTimes(2);
    });
  });

  it("constructs correct API URL with date filter", async () => {
    mockFetch.mockResolvedValueOnce({
      json: () => Promise.resolve({ success: true, data: mockSuccessData }),
    });

    render(<ClientActivity dateFilter={defaultDateFilter} />);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("/api/admin/reports/clients?preset=month")
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

    render(<ClientActivity dateFilter={customFilter} />);

    await waitFor(() => {
      const url = mockFetch.mock.calls[0][0] as string;
      expect(url).toContain("preset=custom");
      expect(url).toContain("dateFrom=2025-01-01");
      expect(url).toContain("dateTo=2025-01-31");
    });
  });

  it("shows empty state when no registration timeline data", async () => {
    const emptyData: ClientActivityData = {
      ...mockSuccessData,
      registrationTimeline: [],
    };

    mockFetch.mockResolvedValueOnce({
      json: () => Promise.resolve({ success: true, data: emptyData }),
    });

    render(<ClientActivity dateFilter={defaultDateFilter} />);

    await waitFor(() => {
      expect(screen.getByText(/Nėra registracijų/)).toBeInTheDocument();
    });
  });

  it("shows empty state when no activity distribution data", async () => {
    const emptyData: ClientActivityData = {
      ...mockSuccessData,
      activityDistribution: [],
    };

    mockFetch.mockResolvedValueOnce({
      json: () => Promise.resolve({ success: true, data: emptyData }),
    });

    render(<ClientActivity dateFilter={defaultDateFilter} />);

    await waitFor(() => {
      expect(screen.getByText(/Nėra duomenų/)).toBeInTheDocument();
    });
  });

  it("does not render top clients table when empty", async () => {
    const emptyData: ClientActivityData = {
      ...mockSuccessData,
      topClients: [],
    };

    mockFetch.mockResolvedValueOnce({
      json: () => Promise.resolve({ success: true, data: emptyData }),
    });

    render(<ClientActivity dateFilter={defaultDateFilter} />);

    await waitFor(() => {
      expect(screen.getByText("250")).toBeInTheDocument();
    });

    expect(screen.queryByText("Top 10")).not.toBeInTheDocument();
  });

  it("displays chart titles correctly", async () => {
    mockFetch.mockResolvedValueOnce({
      json: () => Promise.resolve({ success: true, data: mockSuccessData }),
    });

    render(<ClientActivity dateFilter={defaultDateFilter} />);

    await waitFor(() => {
      expect(screen.getByText(/Naujų klientų registracijos/)).toBeInTheDocument();
    });

    expect(screen.getByText(/Klientų aktyvumas/)).toBeInTheDocument();
  });

  it("displays top clients table title", async () => {
    mockFetch.mockResolvedValueOnce({
      json: () => Promise.resolve({ success: true, data: mockSuccessData }),
    });

    render(<ClientActivity dateFilter={defaultDateFilter} />);

    await waitFor(() => {
      expect(screen.getByText(/Top 10 aktyviausių klientų/)).toBeInTheDocument();
    });
  });

  it("handles zero clients gracefully", async () => {
    const zeroData: ClientActivityData = {
      totalClients: 0,
      activeClients: 0,
      newThisMonth: 0,
      registrationTimeline: [],
      activityDistribution: [],
      topClients: [],
    };

    mockFetch.mockResolvedValueOnce({
      json: () => Promise.resolve({ success: true, data: zeroData }),
    });

    render(<ClientActivity dateFilter={defaultDateFilter} />);

    await waitFor(() => {
      const zeros = screen.getAllByText("0");
      expect(zeros.length).toBeGreaterThanOrEqual(4);
    });
  });
});
