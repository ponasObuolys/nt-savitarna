import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { SimpleLineChart, MultiLineChart } from "@/components/charts/LineChart";
import { CHART_COLORS } from "@/lib/chart-colors";

// Mock Recharts to avoid canvas/SVG rendering issues
vi.mock("recharts", async () => {
  const actual = await vi.importActual("recharts");
  return {
    ...actual,
    ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="responsive-container">{children}</div>
    ),
    LineChart: ({ children, data }: { children: React.ReactNode; data: unknown[] }) => (
      <div data-testid="line-chart" data-items={data.length}>
        {children}
      </div>
    ),
    Line: ({ dataKey, stroke, strokeWidth, strokeDasharray }: { dataKey: string; stroke: string; strokeWidth?: number; strokeDasharray?: string }) => (
      <div data-testid={`line-${dataKey}`} data-stroke={stroke} data-width={strokeWidth} data-dasharray={strokeDasharray || ""} />
    ),
    XAxis: ({ dataKey }: { dataKey: string }) => (
      <div data-testid="x-axis" data-key={dataKey} />
    ),
    YAxis: ({ tickFormatter }: { tickFormatter?: (v: number) => string }) => (
      <div data-testid="y-axis" data-has-formatter={!!tickFormatter} />
    ),
    CartesianGrid: () => <div data-testid="grid" />,
    Tooltip: () => <div data-testid="tooltip" />,
    Legend: () => <div data-testid="legend" />,
  };
});

describe("SimpleLineChart", () => {
  const mockData = [
    { date: "2025-01-01", value: 100 },
    { date: "2025-01-02", value: 150 },
    { date: "2025-01-03", value: 120 },
  ];

  it("renders without crashing", () => {
    render(<SimpleLineChart data={mockData} />);
    expect(screen.getByTestId("responsive-container")).toBeInTheDocument();
  });

  it("renders line chart with correct data count", () => {
    render(<SimpleLineChart data={mockData} />);
    const chart = screen.getByTestId("line-chart");
    expect(chart).toHaveAttribute("data-items", "3");
  });

  it("renders line with value dataKey", () => {
    render(<SimpleLineChart data={mockData} />);
    expect(screen.getByTestId("line-value")).toBeInTheDocument();
  });

  it("uses default color when not specified", () => {
    render(<SimpleLineChart data={mockData} />);
    const line = screen.getByTestId("line-value");
    expect(line).toHaveAttribute("data-stroke", CHART_COLORS.primary);
  });

  it("uses custom color when specified", () => {
    render(<SimpleLineChart data={mockData} color={CHART_COLORS.success} />);
    const line = screen.getByTestId("line-value");
    expect(line).toHaveAttribute("data-stroke", CHART_COLORS.success);
  });

  it("renders grid by default", () => {
    render(<SimpleLineChart data={mockData} />);
    expect(screen.getByTestId("grid")).toBeInTheDocument();
  });

  it("hides grid when showGrid is false", () => {
    render(<SimpleLineChart data={mockData} showGrid={false} />);
    expect(screen.queryByTestId("grid")).not.toBeInTheDocument();
  });

  it("renders tooltip by default", () => {
    render(<SimpleLineChart data={mockData} />);
    expect(screen.getByTestId("tooltip")).toBeInTheDocument();
  });

  it("hides tooltip when showTooltip is false", () => {
    render(<SimpleLineChart data={mockData} showTooltip={false} />);
    expect(screen.queryByTestId("tooltip")).not.toBeInTheDocument();
  });

  it("hides legend by default", () => {
    render(<SimpleLineChart data={mockData} />);
    expect(screen.queryByTestId("legend")).not.toBeInTheDocument();
  });

  it("shows legend when showLegend is true", () => {
    render(<SimpleLineChart data={mockData} showLegend={true} />);
    expect(screen.getByTestId("legend")).toBeInTheDocument();
  });

  it("handles empty data array", () => {
    render(<SimpleLineChart data={[]} />);
    const chart = screen.getByTestId("line-chart");
    expect(chart).toHaveAttribute("data-items", "0");
  });

  it("uses stroke width of 2", () => {
    render(<SimpleLineChart data={mockData} />);
    const line = screen.getByTestId("line-value");
    expect(line).toHaveAttribute("data-width", "2");
  });

  it("uses X-axis with displayDate key", () => {
    render(<SimpleLineChart data={mockData} />);
    const xAxis = screen.getByTestId("x-axis");
    expect(xAxis).toHaveAttribute("data-key", "displayDate");
  });

  it("handles different date formats", () => {
    const isoData = [
      { date: "2025-06-01T12:00:00Z", value: 50 },
      { date: "2025-06-15T12:00:00Z", value: 75 },
    ];
    render(<SimpleLineChart data={isoData} />);
    const chart = screen.getByTestId("line-chart");
    expect(chart).toHaveAttribute("data-items", "2");
  });

  it("renders with custom height", () => {
    render(<SimpleLineChart data={mockData} height={400} />);
    expect(screen.getByTestId("line-chart")).toBeInTheDocument();
  });

  it("applies Y-axis formatter when provided", () => {
    render(<SimpleLineChart data={mockData} formatYAxis={(v) => `${v}%`} />);
    const yAxis = screen.getByTestId("y-axis");
    expect(yAxis).toHaveAttribute("data-has-formatter", "true");
  });

  it("does not apply Y-axis formatter when not provided", () => {
    render(<SimpleLineChart data={mockData} />);
    const yAxis = screen.getByTestId("y-axis");
    expect(yAxis).toHaveAttribute("data-has-formatter", "false");
  });
});

describe("MultiLineChart", () => {
  const mockData = [
    { date: "2025-01-01", revenue: 100, costs: 80 },
    { date: "2025-01-02", revenue: 150, costs: 90 },
    { date: "2025-01-03", revenue: 200, costs: 100 },
  ];

  const mockLines = [
    { dataKey: "revenue", label: "Revenue", color: CHART_COLORS.primary },
    { dataKey: "costs", label: "Costs", color: CHART_COLORS.secondary },
  ];

  it("renders without crashing", () => {
    render(<MultiLineChart data={mockData} lines={mockLines} />);
    expect(screen.getByTestId("responsive-container")).toBeInTheDocument();
  });

  it("renders line chart with correct data count", () => {
    render(<MultiLineChart data={mockData} lines={mockLines} />);
    const chart = screen.getByTestId("line-chart");
    expect(chart).toHaveAttribute("data-items", "3");
  });

  it("renders lines for each data series", () => {
    render(<MultiLineChart data={mockData} lines={mockLines} />);
    expect(screen.getByTestId("line-revenue")).toBeInTheDocument();
    expect(screen.getByTestId("line-costs")).toBeInTheDocument();
  });

  it("applies correct colors to lines", () => {
    render(<MultiLineChart data={mockData} lines={mockLines} />);
    const revenueLine = screen.getByTestId("line-revenue");
    const costsLine = screen.getByTestId("line-costs");
    expect(revenueLine).toHaveAttribute("data-stroke", CHART_COLORS.primary);
    expect(costsLine).toHaveAttribute("data-stroke", CHART_COLORS.secondary);
  });

  it("renders grid by default", () => {
    render(<MultiLineChart data={mockData} lines={mockLines} />);
    expect(screen.getByTestId("grid")).toBeInTheDocument();
  });

  it("hides grid when showGrid is false", () => {
    render(<MultiLineChart data={mockData} lines={mockLines} showGrid={false} />);
    expect(screen.queryByTestId("grid")).not.toBeInTheDocument();
  });

  it("renders tooltip by default", () => {
    render(<MultiLineChart data={mockData} lines={mockLines} />);
    expect(screen.getByTestId("tooltip")).toBeInTheDocument();
  });

  it("hides tooltip when showTooltip is false", () => {
    render(<MultiLineChart data={mockData} lines={mockLines} showTooltip={false} />);
    expect(screen.queryByTestId("tooltip")).not.toBeInTheDocument();
  });

  it("renders legend by default", () => {
    render(<MultiLineChart data={mockData} lines={mockLines} />);
    expect(screen.getByTestId("legend")).toBeInTheDocument();
  });

  it("hides legend when showLegend is false", () => {
    render(<MultiLineChart data={mockData} lines={mockLines} showLegend={false} />);
    expect(screen.queryByTestId("legend")).not.toBeInTheDocument();
  });

  it("handles empty data array", () => {
    render(<MultiLineChart data={[]} lines={mockLines} />);
    const chart = screen.getByTestId("line-chart");
    expect(chart).toHaveAttribute("data-items", "0");
  });

  it("handles empty lines array", () => {
    render(<MultiLineChart data={mockData} lines={[]} />);
    expect(screen.getByTestId("line-chart")).toBeInTheDocument();
    expect(screen.queryByTestId("line-revenue")).not.toBeInTheDocument();
  });

  it("applies stroke dasharray when specified", () => {
    const dashedLines = [
      { dataKey: "revenue", label: "Revenue", color: CHART_COLORS.primary, strokeDasharray: "5 5" },
    ];
    render(<MultiLineChart data={mockData} lines={dashedLines} />);
    const line = screen.getByTestId("line-revenue");
    expect(line).toHaveAttribute("data-dasharray", "5 5");
  });

  it("renders with custom height", () => {
    render(<MultiLineChart data={mockData} lines={mockLines} height={500} />);
    expect(screen.getByTestId("line-chart")).toBeInTheDocument();
  });

  it("applies Y-axis formatter when provided", () => {
    render(<MultiLineChart data={mockData} lines={mockLines} formatYAxis={(v) => `$${v}`} />);
    const yAxis = screen.getByTestId("y-axis");
    expect(yAxis).toHaveAttribute("data-has-formatter", "true");
  });

  it("handles different date formats in data", () => {
    const isoData = [
      { date: "2025-03-01T00:00:00Z", revenue: 100, costs: 50 },
      { date: "2025-03-15T00:00:00Z", revenue: 150, costs: 75 },
    ];
    render(<MultiLineChart data={isoData} lines={mockLines} />);
    const chart = screen.getByTestId("line-chart");
    expect(chart).toHaveAttribute("data-items", "2");
  });

  it("uses stroke width of 2 for all lines", () => {
    render(<MultiLineChart data={mockData} lines={mockLines} />);
    const revenueLine = screen.getByTestId("line-revenue");
    expect(revenueLine).toHaveAttribute("data-width", "2");
  });
});
