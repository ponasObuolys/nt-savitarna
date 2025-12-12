import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { SimpleBarChart, TimeSeriesBarChart, StackedBarChart } from "@/components/charts/BarChart";
import { CHART_COLORS } from "@/lib/chart-colors";

// Mock Recharts to avoid canvas/SVG rendering issues
vi.mock("recharts", async () => {
  const actual = await vi.importActual("recharts");
  return {
    ...actual,
    ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="responsive-container">{children}</div>
    ),
    BarChart: ({ children, data, layout }: { children: React.ReactNode; data: unknown[]; layout?: string }) => (
      <div data-testid="bar-chart" data-items={data.length} data-layout={layout || "horizontal"}>
        {children}
      </div>
    ),
    Bar: ({ dataKey, fill, barSize, name, children }: { dataKey: string; fill: string; barSize?: number; name?: string; children?: React.ReactNode }) => (
      <div data-testid={`bar-${dataKey}`} data-fill={fill} data-size={barSize} data-name={name}>
        {children}
      </div>
    ),
    Cell: ({ fill }: { fill: string }) => <div data-testid="cell" data-fill={fill} />,
    XAxis: ({ dataKey, type }: { dataKey?: string; type?: string }) => (
      <div data-testid="x-axis" data-key={dataKey} data-type={type} />
    ),
    YAxis: ({ dataKey, type, tickFormatter }: { dataKey?: string; type?: string; tickFormatter?: (v: number) => string }) => (
      <div data-testid="y-axis" data-key={dataKey} data-type={type} data-has-formatter={!!tickFormatter} />
    ),
    CartesianGrid: () => <div data-testid="grid" />,
    Tooltip: () => <div data-testid="tooltip" />,
    Legend: () => <div data-testid="legend" />,
  };
});

describe("SimpleBarChart", () => {
  const mockData = [
    { name: "Category A", value: 100 },
    { name: "Category B", value: 200 },
    { name: "Category C", value: 150 },
  ];

  it("renders without crashing", () => {
    render(<SimpleBarChart data={mockData} />);
    expect(screen.getByTestId("responsive-container")).toBeInTheDocument();
  });

  it("renders the bar chart with correct data count", () => {
    render(<SimpleBarChart data={mockData} />);
    const chart = screen.getByTestId("bar-chart");
    expect(chart).toHaveAttribute("data-items", "3");
  });

  it("uses horizontal layout by default", () => {
    render(<SimpleBarChart data={mockData} />);
    const chart = screen.getByTestId("bar-chart");
    expect(chart).toHaveAttribute("data-layout", "horizontal");
  });

  it("uses vertical layout when specified", () => {
    render(<SimpleBarChart data={mockData} layout="vertical" />);
    const chart = screen.getByTestId("bar-chart");
    expect(chart).toHaveAttribute("data-layout", "vertical");
  });

  it("renders bar with value dataKey", () => {
    render(<SimpleBarChart data={mockData} />);
    expect(screen.getByTestId("bar-value")).toBeInTheDocument();
  });

  it("uses default color when not specified", () => {
    render(<SimpleBarChart data={mockData} />);
    const bar = screen.getByTestId("bar-value");
    expect(bar).toHaveAttribute("data-fill", CHART_COLORS.primary);
  });

  it("uses custom color when specified", () => {
    render(<SimpleBarChart data={mockData} color={CHART_COLORS.success} />);
    const bar = screen.getByTestId("bar-value");
    expect(bar).toHaveAttribute("data-fill", CHART_COLORS.success);
  });

  it("renders grid by default", () => {
    render(<SimpleBarChart data={mockData} />);
    expect(screen.getByTestId("grid")).toBeInTheDocument();
  });

  it("hides grid when showGrid is false", () => {
    render(<SimpleBarChart data={mockData} showGrid={false} />);
    expect(screen.queryByTestId("grid")).not.toBeInTheDocument();
  });

  it("renders tooltip by default", () => {
    render(<SimpleBarChart data={mockData} />);
    expect(screen.getByTestId("tooltip")).toBeInTheDocument();
  });

  it("hides tooltip when showTooltip is false", () => {
    render(<SimpleBarChart data={mockData} showTooltip={false} />);
    expect(screen.queryByTestId("tooltip")).not.toBeInTheDocument();
  });

  it("hides legend by default", () => {
    render(<SimpleBarChart data={mockData} />);
    expect(screen.queryByTestId("legend")).not.toBeInTheDocument();
  });

  it("shows legend when showLegend is true", () => {
    render(<SimpleBarChart data={mockData} showLegend={true} />);
    expect(screen.getByTestId("legend")).toBeInTheDocument();
  });

  it("handles empty data array", () => {
    render(<SimpleBarChart data={[]} />);
    const chart = screen.getByTestId("bar-chart");
    expect(chart).toHaveAttribute("data-items", "0");
  });

  it("applies custom barSize", () => {
    render(<SimpleBarChart data={mockData} barSize={50} />);
    const bar = screen.getByTestId("bar-value");
    expect(bar).toHaveAttribute("data-size", "50");
  });

  it("applies dataKeyLabel to bar name", () => {
    render(<SimpleBarChart data={mockData} dataKeyLabel="Test Label" />);
    const bar = screen.getByTestId("bar-value");
    expect(bar).toHaveAttribute("data-name", "Test Label");
  });

  it("renders cells when colors are provided", () => {
    const dataWithColors = [
      { name: "A", value: 100, color: "#ff0000" },
      { name: "B", value: 200, color: "#00ff00" },
    ];
    render(<SimpleBarChart data={dataWithColors} colors={["#ff0000", "#00ff00"]} />);
    const cells = screen.getAllByTestId("cell");
    expect(cells.length).toBe(2);
    expect(cells[0]).toHaveAttribute("data-fill", "#ff0000");
    expect(cells[1]).toHaveAttribute("data-fill", "#00ff00");
  });

  it("uses palette colors when no custom colors in data", () => {
    render(<SimpleBarChart data={mockData} colors={["#aaa", "#bbb", "#ccc"]} />);
    const cells = screen.getAllByTestId("cell");
    expect(cells.length).toBe(3);
  });
});

describe("TimeSeriesBarChart", () => {
  const mockData = [
    { date: "2025-01-01", value: 100 },
    { date: "2025-01-02", value: 150 },
    { date: "2025-01-03", value: 200 },
  ];

  it("renders without crashing", () => {
    render(<TimeSeriesBarChart data={mockData} />);
    expect(screen.getByTestId("responsive-container")).toBeInTheDocument();
  });

  it("renders bar chart with correct data count", () => {
    render(<TimeSeriesBarChart data={mockData} />);
    const chart = screen.getByTestId("bar-chart");
    expect(chart).toHaveAttribute("data-items", "3");
  });

  it("renders bar with value dataKey", () => {
    render(<TimeSeriesBarChart data={mockData} />);
    expect(screen.getByTestId("bar-value")).toBeInTheDocument();
  });

  it("uses default color when not specified", () => {
    render(<TimeSeriesBarChart data={mockData} />);
    const bar = screen.getByTestId("bar-value");
    expect(bar).toHaveAttribute("data-fill", CHART_COLORS.primary);
  });

  it("uses custom color when specified", () => {
    render(<TimeSeriesBarChart data={mockData} color={CHART_COLORS.warning} />);
    const bar = screen.getByTestId("bar-value");
    expect(bar).toHaveAttribute("data-fill", CHART_COLORS.warning);
  });

  it("renders grid by default", () => {
    render(<TimeSeriesBarChart data={mockData} />);
    expect(screen.getByTestId("grid")).toBeInTheDocument();
  });

  it("hides grid when showGrid is false", () => {
    render(<TimeSeriesBarChart data={mockData} showGrid={false} />);
    expect(screen.queryByTestId("grid")).not.toBeInTheDocument();
  });

  it("renders tooltip by default", () => {
    render(<TimeSeriesBarChart data={mockData} />);
    expect(screen.getByTestId("tooltip")).toBeInTheDocument();
  });

  it("hides tooltip when showTooltip is false", () => {
    render(<TimeSeriesBarChart data={mockData} showTooltip={false} />);
    expect(screen.queryByTestId("tooltip")).not.toBeInTheDocument();
  });

  it("handles empty data array", () => {
    render(<TimeSeriesBarChart data={[]} />);
    const chart = screen.getByTestId("bar-chart");
    expect(chart).toHaveAttribute("data-items", "0");
  });

  it("applies custom barSize", () => {
    render(<TimeSeriesBarChart data={mockData} barSize={40} />);
    const bar = screen.getByTestId("bar-value");
    expect(bar).toHaveAttribute("data-size", "40");
  });

  it("applies custom dataKeyLabel", () => {
    render(<TimeSeriesBarChart data={mockData} dataKeyLabel="Revenue" />);
    const bar = screen.getByTestId("bar-value");
    expect(bar).toHaveAttribute("data-name", "Revenue");
  });

  it("handles different date formats", () => {
    const isoData = [
      { date: "2025-12-01T00:00:00Z", value: 100 },
      { date: "2025-12-15T00:00:00Z", value: 200 },
    ];
    render(<TimeSeriesBarChart data={isoData} />);
    const chart = screen.getByTestId("bar-chart");
    expect(chart).toHaveAttribute("data-items", "2");
  });
});

describe("StackedBarChart", () => {
  const mockData = [
    { name: "Q1", sales: 100, costs: 80 },
    { name: "Q2", sales: 150, costs: 90 },
    { name: "Q3", sales: 200, costs: 100 },
  ];

  const mockBars = [
    { dataKey: "sales", label: "Sales", color: CHART_COLORS.primary },
    { dataKey: "costs", label: "Costs", color: CHART_COLORS.secondary },
  ];

  const mockStackedBars = [
    { dataKey: "sales", label: "Sales", color: CHART_COLORS.primary, stackId: "a" },
    { dataKey: "costs", label: "Costs", color: CHART_COLORS.secondary, stackId: "a" },
  ];

  it("renders without crashing", () => {
    render(<StackedBarChart data={mockData} bars={mockBars} />);
    expect(screen.getByTestId("responsive-container")).toBeInTheDocument();
  });

  it("renders bar chart with correct data count", () => {
    render(<StackedBarChart data={mockData} bars={mockBars} />);
    const chart = screen.getByTestId("bar-chart");
    expect(chart).toHaveAttribute("data-items", "3");
  });

  it("renders bars for each data series", () => {
    render(<StackedBarChart data={mockData} bars={mockBars} />);
    expect(screen.getByTestId("bar-sales")).toBeInTheDocument();
    expect(screen.getByTestId("bar-costs")).toBeInTheDocument();
  });

  it("applies correct colors to bars", () => {
    render(<StackedBarChart data={mockData} bars={mockBars} />);
    const salesBar = screen.getByTestId("bar-sales");
    const costsBar = screen.getByTestId("bar-costs");
    expect(salesBar).toHaveAttribute("data-fill", CHART_COLORS.primary);
    expect(costsBar).toHaveAttribute("data-fill", CHART_COLORS.secondary);
  });

  it("renders grid by default", () => {
    render(<StackedBarChart data={mockData} bars={mockBars} />);
    expect(screen.getByTestId("grid")).toBeInTheDocument();
  });

  it("hides grid when showGrid is false", () => {
    render(<StackedBarChart data={mockData} bars={mockBars} showGrid={false} />);
    expect(screen.queryByTestId("grid")).not.toBeInTheDocument();
  });

  it("renders tooltip by default", () => {
    render(<StackedBarChart data={mockData} bars={mockBars} />);
    expect(screen.getByTestId("tooltip")).toBeInTheDocument();
  });

  it("hides tooltip when showTooltip is false", () => {
    render(<StackedBarChart data={mockData} bars={mockBars} showTooltip={false} />);
    expect(screen.queryByTestId("tooltip")).not.toBeInTheDocument();
  });

  it("renders legend by default", () => {
    render(<StackedBarChart data={mockData} bars={mockBars} />);
    expect(screen.getByTestId("legend")).toBeInTheDocument();
  });

  it("hides legend when showLegend is false", () => {
    render(<StackedBarChart data={mockData} bars={mockBars} showLegend={false} />);
    expect(screen.queryByTestId("legend")).not.toBeInTheDocument();
  });

  it("handles empty data array", () => {
    render(<StackedBarChart data={[]} bars={mockBars} />);
    const chart = screen.getByTestId("bar-chart");
    expect(chart).toHaveAttribute("data-items", "0");
  });

  it("handles empty bars array", () => {
    render(<StackedBarChart data={mockData} bars={[]} />);
    expect(screen.getByTestId("bar-chart")).toBeInTheDocument();
    expect(screen.queryByTestId("bar-sales")).not.toBeInTheDocument();
  });

  it("applies custom barSize", () => {
    render(<StackedBarChart data={mockData} bars={mockBars} barSize={45} />);
    const salesBar = screen.getByTestId("bar-sales");
    expect(salesBar).toHaveAttribute("data-size", "45");
  });

  it("handles stacked bars with stackId", () => {
    render(<StackedBarChart data={mockData} bars={mockStackedBars} />);
    expect(screen.getByTestId("bar-sales")).toBeInTheDocument();
    expect(screen.getByTestId("bar-costs")).toBeInTheDocument();
  });

  it("renders with different height", () => {
    render(<StackedBarChart data={mockData} bars={mockBars} height={400} />);
    expect(screen.getByTestId("bar-chart")).toBeInTheDocument();
  });
});
