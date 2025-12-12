import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { GeographyStats } from "@/components/reports/GeographyStats";
import type { DateFilter, GeographyStatsData } from "@/types";

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
    Bar: () => <div data-testid="bar" />,
    XAxis: () => <div data-testid="x-axis" />,
    YAxis: () => <div data-testid="y-axis" />,
    CartesianGrid: () => <div data-testid="grid" />,
    Tooltip: () => <div data-testid="tooltip" />,
    Legend: () => <div data-testid="legend" />,
    Cell: () => <div data-testid="cell" />,
  };
});

describe("GeographyStats", () => {
  const defaultDateFilter: DateFilter = {
    preset: "month",
    dateFrom: null,
    dateTo: null,
  };

  const mockSuccessData: GeographyStatsData = {
    byMunicipality: [
      { name: "Vilniaus m. sav.", value: 120 },
      { name: "Kauno m. sav.", value: 85 },
      { name: "Klaipėdos m. sav.", value: 45 },
      { name: "Šiaulių m. sav.", value: 30 },
      { name: "Panevėžio m. sav.", value: 25 },
    ],
    byCity: [
      { name: "Vilnius", value: 115 },
      { name: "Kaunas", value: 80 },
      { name: "Klaipėda", value: 43 },
      { name: "Šiauliai", value: 28 },
      { name: "Panevėžys", value: 22 },
      { name: "Alytus", value: 15 },
    ],
    totalLocations: 60,
  };

  beforeEach(() => {
    mockFetch.mockClear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("shows loading state initially", () => {
    mockFetch.mockImplementation(() => new Promise(() => {}));
    render(<GeographyStats dateFilter={defaultDateFilter} />);

    const statsCards = document.querySelectorAll('[class*="animate-pulse"]');
    expect(statsCards.length).toBeGreaterThan(0);
  });

  it("displays stats cards with correct values after loading", async () => {
    mockFetch.mockResolvedValueOnce({
      json: () => Promise.resolve({ success: true, data: mockSuccessData }),
    });

    render(<GeographyStats dateFilter={defaultDateFilter} />);

    await waitFor(() => {
      // Municipalities count (excluding "Nenurodyta")
      expect(screen.getByText("5")).toBeInTheDocument();
    });

    // Cities count
    expect(screen.getByText("6")).toBeInTheDocument();
  });

  it("displays top municipality and city", async () => {
    mockFetch.mockResolvedValueOnce({
      json: () => Promise.resolve({ success: true, data: mockSuccessData }),
    });

    render(<GeographyStats dateFilter={defaultDateFilter} />);

    await waitFor(() => {
      expect(screen.getByText("Vilniaus m. sav.")).toBeInTheDocument();
    });

    expect(screen.getByText("Vilnius")).toBeInTheDocument();
  });

  it("displays order counts for top locations", async () => {
    mockFetch.mockResolvedValueOnce({
      json: () => Promise.resolve({ success: true, data: mockSuccessData }),
    });

    render(<GeographyStats dateFilter={defaultDateFilter} />);

    await waitFor(() => {
      expect(screen.getByText(/120 užsakym/)).toBeInTheDocument();
    });

    expect(screen.getByText(/115 užsakym/)).toBeInTheDocument();
  });

  it("renders two bar charts for municipalities and cities", async () => {
    mockFetch.mockResolvedValueOnce({
      json: () => Promise.resolve({ success: true, data: mockSuccessData }),
    });

    render(<GeographyStats dateFilter={defaultDateFilter} />);

    await waitFor(() => {
      const barCharts = screen.getAllByTestId("bar-chart");
      expect(barCharts.length).toBe(2);
    });
  });

  it("displays correct chart titles", async () => {
    mockFetch.mockResolvedValueOnce({
      json: () => Promise.resolve({ success: true, data: mockSuccessData }),
    });

    render(<GeographyStats dateFilter={defaultDateFilter} />);

    await waitFor(() => {
      expect(screen.getByText(/Užsakymai pagal savivaldybę/)).toBeInTheDocument();
    });

    expect(screen.getByText(/Užsakymai pagal miestą/)).toBeInTheDocument();
  });

  it("displays correct chart descriptions", async () => {
    mockFetch.mockResolvedValueOnce({
      json: () => Promise.resolve({ success: true, data: mockSuccessData }),
    });

    render(<GeographyStats dateFilter={defaultDateFilter} />);

    await waitFor(() => {
      expect(screen.getByText(/Top 15 savivaldybi/)).toBeInTheDocument();
    });

    expect(screen.getByText(/Top 20 miest/)).toBeInTheDocument();
  });

  it("shows error message on API failure", async () => {
    mockFetch.mockResolvedValueOnce({
      json: () => Promise.resolve({ success: false, error: "Server error" }),
    });

    render(<GeographyStats dateFilter={defaultDateFilter} />);

    await waitFor(() => {
      const errorElements = screen.queryAllByText("Server error");
      expect(errorElements.length).toBeGreaterThan(0);
    }, { timeout: 3000 });
  });

  it("shows error message on network failure", async () => {
    mockFetch.mockRejectedValueOnce(new Error("Network error"));

    render(<GeographyStats dateFilter={defaultDateFilter} />);

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
      <GeographyStats dateFilter={defaultDateFilter} />
    );

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    const newFilter: DateFilter = {
      preset: "week",
      dateFrom: null,
      dateTo: null,
    };

    rerender(<GeographyStats dateFilter={newFilter} />);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledTimes(2);
    });
  });

  it("constructs correct API URL with date filter", async () => {
    mockFetch.mockResolvedValueOnce({
      json: () => Promise.resolve({ success: true, data: mockSuccessData }),
    });

    render(<GeographyStats dateFilter={defaultDateFilter} />);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("/api/admin/reports/geography?preset=month")
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

    render(<GeographyStats dateFilter={customFilter} />);

    await waitFor(() => {
      const url = mockFetch.mock.calls[0][0] as string;
      expect(url).toContain("preset=custom");
      expect(url).toContain("dateFrom=2025-01-01");
      expect(url).toContain("dateTo=2025-01-31");
    });
  });

  it("shows empty state when no municipality data", async () => {
    const emptyData: GeographyStatsData = {
      byMunicipality: [],
      byCity: mockSuccessData.byCity,
      totalLocations: mockSuccessData.totalLocations,
    };

    mockFetch.mockResolvedValueOnce({
      json: () => Promise.resolve({ success: true, data: emptyData }),
    });

    render(<GeographyStats dateFilter={defaultDateFilter} />);

    await waitFor(() => {
      expect(screen.getByText(/Nėra duomenų/)).toBeInTheDocument();
    });
  });

  it("shows empty state when no city data", async () => {
    const emptyData: GeographyStatsData = {
      byMunicipality: mockSuccessData.byMunicipality,
      byCity: [],
      totalLocations: mockSuccessData.totalLocations,
    };

    mockFetch.mockResolvedValueOnce({
      json: () => Promise.resolve({ success: true, data: emptyData }),
    });

    render(<GeographyStats dateFilter={defaultDateFilter} />);

    await waitFor(() => {
      expect(screen.getAllByText(/Nėra duomenų/).length).toBeGreaterThan(0);
    });
  });

  it("handles data with 'Nenurodyta' correctly", async () => {
    const dataWithUnspecified: GeographyStatsData = {
      byMunicipality: [
        { name: "Nenurodyta", value: 50 },
        { name: "Vilniaus m. sav.", value: 120 },
        { name: "Kauno m. sav.", value: 85 },
      ],
      byCity: [
        { name: "Nenurodyta", value: 30 },
        { name: "Vilnius", value: 115 },
      ],
      totalLocations: 30,
    };

    mockFetch.mockResolvedValueOnce({
      json: () => Promise.resolve({ success: true, data: dataWithUnspecified }),
    });

    render(<GeographyStats dateFilter={defaultDateFilter} />);

    await waitFor(() => {
      // Should show 2 municipalities (excluding "Nenurodyta")
      expect(screen.getByText("2")).toBeInTheDocument();
    });

    // Should show 1 city (excluding "Nenurodyta")
    expect(screen.getByText("1")).toBeInTheDocument();
  });

  it("displays correct stat card titles", async () => {
    mockFetch.mockResolvedValueOnce({
      json: () => Promise.resolve({ success: true, data: mockSuccessData }),
    });

    render(<GeographyStats dateFilter={defaultDateFilter} />);

    await waitFor(() => {
      expect(screen.getByText(/Savivaldybių/)).toBeInTheDocument();
    });

    expect(screen.getByText(/Miestų/)).toBeInTheDocument();
    expect(screen.getByText(/Populiariausia savivaldybė/)).toBeInTheDocument();
    expect(screen.getByText(/Populiariausias miestas/)).toBeInTheDocument();
  });

  it("shows dash when no top location available", async () => {
    const emptyData: GeographyStatsData = {
      byMunicipality: [],
      byCity: [],
      totalLocations: 0,
    };

    mockFetch.mockResolvedValueOnce({
      json: () => Promise.resolve({ success: true, data: emptyData }),
    });

    render(<GeographyStats dateFilter={defaultDateFilter} />);

    await waitFor(() => {
      // Multiple dashes for empty top locations
      const dashes = screen.getAllByText("—");
      expect(dashes.length).toBeGreaterThanOrEqual(2);
    });
  });

  it("handles all zero counts gracefully", async () => {
    const zeroData: GeographyStatsData = {
      byMunicipality: [],
      byCity: [],
      totalLocations: 0,
    };

    mockFetch.mockResolvedValueOnce({
      json: () => Promise.resolve({ success: true, data: zeroData }),
    });

    render(<GeographyStats dateFilter={defaultDateFilter} />);

    await waitFor(() => {
      const zeros = screen.getAllByText("0");
      expect(zeros.length).toBeGreaterThanOrEqual(2);
    });
  });
});
