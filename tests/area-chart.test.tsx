import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { StackedAreaChart, SimpleAreaChart } from "@/components/charts/AreaChart";
import { CHART_COLORS } from "@/lib/chart-colors";

// Mock Recharts to avoid canvas/SVG rendering issues
vi.mock("recharts", async () => {
  const actual = await vi.importActual("recharts");
  return {
    ...actual,
    ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="responsive-container">{children}</div>
    ),
    AreaChart: ({ children, data }: { children: React.ReactNode; data: unknown[] }) => (
      <div data-testid="area-chart" data-items={data.length}>
        {children}
      </div>
    ),
    Area: ({ dataKey, stroke, fill }: { dataKey: string; stroke: string; fill: string }) => (
      <div data-testid={`area-${dataKey}`} data-stroke={stroke} data-fill={fill} />
    ),
    XAxis: ({ dataKey }: { dataKey: string }) => (
      <div data-testid="x-axis" data-key={dataKey} />
    ),
    YAxis: () => <div data-testid="y-axis" />,
    CartesianGrid: () => <div data-testid="grid" />,
    Tooltip: () => <div data-testid="tooltip" />,
    Legend: () => <div data-testid="legend" />,
  };
});

describe("StackedAreaChart", () => {
  const mockData = [
    { date: "2025-06-01", V001: 5, V002: 3 },
    { date: "2025-06-02", V001: 7, V002: 4 },
    { date: "2025-06-03", V001: 6, V002: 5 },
  ];

  const mockAreas = [
    { dataKey: "V001", label: "Valuator 1", color: CHART_COLORS.primary, stackId: "1" },
    { dataKey: "V002", label: "Valuator 2", color: CHART_COLORS.secondary, stackId: "1" },
  ];

  it("renders without crashing", () => {
    render(<StackedAreaChart data={mockData} areas={mockAreas} />);
    expect(screen.getByTestId("responsive-container")).toBeInTheDocument();
  });

  it("renders the area chart with correct data count", () => {
    render(<StackedAreaChart data={mockData} areas={mockAreas} />);
    const chart = screen.getByTestId("area-chart");
    expect(chart).toHaveAttribute("data-items", "3");
  });

  it("renders areas for each data series", () => {
    render(<StackedAreaChart data={mockData} areas={mockAreas} />);
    expect(screen.getByTestId("area-V001")).toBeInTheDocument();
    expect(screen.getByTestId("area-V002")).toBeInTheDocument();
  });

  it("applies correct colors to areas", () => {
    render(<StackedAreaChart data={mockData} areas={mockAreas} />);
    const area1 = screen.getByTestId("area-V001");
    const area2 = screen.getByTestId("area-V002");
    expect(area1).toHaveAttribute("data-stroke", CHART_COLORS.primary);
    expect(area2).toHaveAttribute("data-stroke", CHART_COLORS.secondary);
  });

  it("renders grid by default", () => {
    render(<StackedAreaChart data={mockData} areas={mockAreas} />);
    expect(screen.getByTestId("grid")).toBeInTheDocument();
  });

  it("hides grid when showGrid is false", () => {
    render(<StackedAreaChart data={mockData} areas={mockAreas} showGrid={false} />);
    expect(screen.queryByTestId("grid")).not.toBeInTheDocument();
  });

  it("renders tooltip by default", () => {
    render(<StackedAreaChart data={mockData} areas={mockAreas} />);
    expect(screen.getByTestId("tooltip")).toBeInTheDocument();
  });

  it("hides tooltip when showTooltip is false", () => {
    render(<StackedAreaChart data={mockData} areas={mockAreas} showTooltip={false} />);
    expect(screen.queryByTestId("tooltip")).not.toBeInTheDocument();
  });

  it("renders legend by default", () => {
    render(<StackedAreaChart data={mockData} areas={mockAreas} />);
    expect(screen.getByTestId("legend")).toBeInTheDocument();
  });

  it("hides legend when showLegend is false", () => {
    render(<StackedAreaChart data={mockData} areas={mockAreas} showLegend={false} />);
    expect(screen.queryByTestId("legend")).not.toBeInTheDocument();
  });

  it("handles empty data array", () => {
    render(<StackedAreaChart data={[]} areas={mockAreas} />);
    const chart = screen.getByTestId("area-chart");
    expect(chart).toHaveAttribute("data-items", "0");
  });

  it("handles empty areas array", () => {
    render(<StackedAreaChart data={mockData} areas={[]} />);
    expect(screen.getByTestId("area-chart")).toBeInTheDocument();
    expect(screen.queryByTestId("area-V001")).not.toBeInTheDocument();
  });
});

describe("SimpleAreaChart", () => {
  const mockData = [
    { name: "Jan", value: 100 },
    { name: "Feb", value: 200 },
    { name: "Mar", value: 150 },
  ];

  it("renders without crashing", () => {
    render(<SimpleAreaChart data={mockData} />);
    expect(screen.getByTestId("responsive-container")).toBeInTheDocument();
  });

  it("renders the area chart with correct data count", () => {
    render(<SimpleAreaChart data={mockData} />);
    const chart = screen.getByTestId("area-chart");
    expect(chart).toHaveAttribute("data-items", "3");
  });

  it("renders single area for value", () => {
    render(<SimpleAreaChart data={mockData} />);
    expect(screen.getByTestId("area-value")).toBeInTheDocument();
  });

  it("uses default color when not specified", () => {
    render(<SimpleAreaChart data={mockData} />);
    const area = screen.getByTestId("area-value");
    expect(area).toHaveAttribute("data-stroke", CHART_COLORS.primary);
  });

  it("uses custom color when specified", () => {
    render(<SimpleAreaChart data={mockData} color={CHART_COLORS.success} />);
    const area = screen.getByTestId("area-value");
    expect(area).toHaveAttribute("data-stroke", CHART_COLORS.success);
  });

  it("renders grid by default", () => {
    render(<SimpleAreaChart data={mockData} />);
    expect(screen.getByTestId("grid")).toBeInTheDocument();
  });

  it("hides grid when showGrid is false", () => {
    render(<SimpleAreaChart data={mockData} showGrid={false} />);
    expect(screen.queryByTestId("grid")).not.toBeInTheDocument();
  });

  it("renders tooltip by default", () => {
    render(<SimpleAreaChart data={mockData} />);
    expect(screen.getByTestId("tooltip")).toBeInTheDocument();
  });

  it("hides tooltip when showTooltip is false", () => {
    render(<SimpleAreaChart data={mockData} showTooltip={false} />);
    expect(screen.queryByTestId("tooltip")).not.toBeInTheDocument();
  });

  it("handles empty data array", () => {
    render(<SimpleAreaChart data={[]} />);
    const chart = screen.getByTestId("area-chart");
    expect(chart).toHaveAttribute("data-items", "0");
  });

  it("uses X-axis with name dataKey", () => {
    render(<SimpleAreaChart data={mockData} />);
    const xAxis = screen.getByTestId("x-axis");
    expect(xAxis).toHaveAttribute("data-key", "name");
  });
});
