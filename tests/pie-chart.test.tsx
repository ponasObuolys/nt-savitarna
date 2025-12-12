import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { SimplePieChart, DonutChart } from "@/components/charts/PieChart";
import { CHART_COLORS } from "@/lib/chart-colors";

// Mock Recharts to avoid canvas/SVG rendering issues
vi.mock("recharts", async () => {
  const actual = await vi.importActual("recharts");
  return {
    ...actual,
    ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="responsive-container">{children}</div>
    ),
    PieChart: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="pie-chart">{children}</div>
    ),
    Pie: ({
      data,
      innerRadius,
      outerRadius,
      children,
      label
    }: {
      data: unknown[];
      innerRadius: number;
      outerRadius: number;
      children?: React.ReactNode;
      label?: boolean | ((props: unknown) => React.ReactElement | null);
    }) => (
      <div
        data-testid="pie"
        data-items={data.length}
        data-inner-radius={innerRadius}
        data-outer-radius={outerRadius}
        data-has-label={!!label}
      >
        {children}
      </div>
    ),
    Cell: ({ fill }: { fill: string }) => <div data-testid="cell" data-fill={fill} />,
    Tooltip: () => <div data-testid="tooltip" />,
    Legend: ({ layout, align }: { layout?: string; align?: string }) => (
      <div data-testid="legend" data-layout={layout} data-align={align} />
    ),
  };
});

describe("SimplePieChart", () => {
  const mockData = [
    { name: "Category A", value: 400 },
    { name: "Category B", value: 300 },
    { name: "Category C", value: 200 },
    { name: "Category D", value: 100 },
  ];

  it("renders without crashing", () => {
    render(<SimplePieChart data={mockData} />);
    expect(screen.getByTestId("responsive-container")).toBeInTheDocument();
  });

  it("renders pie chart component", () => {
    render(<SimplePieChart data={mockData} />);
    expect(screen.getByTestId("pie-chart")).toBeInTheDocument();
  });

  it("renders pie with correct data count", () => {
    render(<SimplePieChart data={mockData} />);
    const pie = screen.getByTestId("pie");
    expect(pie).toHaveAttribute("data-items", "4");
  });

  it("uses default inner radius of 0", () => {
    render(<SimplePieChart data={mockData} />);
    const pie = screen.getByTestId("pie");
    expect(pie).toHaveAttribute("data-inner-radius", "0");
  });

  it("uses default outer radius of 100", () => {
    render(<SimplePieChart data={mockData} />);
    const pie = screen.getByTestId("pie");
    expect(pie).toHaveAttribute("data-outer-radius", "100");
  });

  it("applies custom inner radius", () => {
    render(<SimplePieChart data={mockData} innerRadius={50} />);
    const pie = screen.getByTestId("pie");
    expect(pie).toHaveAttribute("data-inner-radius", "50");
  });

  it("applies custom outer radius", () => {
    render(<SimplePieChart data={mockData} outerRadius={80} />);
    const pie = screen.getByTestId("pie");
    expect(pie).toHaveAttribute("data-outer-radius", "80");
  });

  it("renders cells for each data item", () => {
    render(<SimplePieChart data={mockData} />);
    const cells = screen.getAllByTestId("cell");
    expect(cells.length).toBe(4);
  });

  it("uses palette colors for cells", () => {
    render(<SimplePieChart data={mockData} />);
    const cells = screen.getAllByTestId("cell");
    expect(cells[0]).toHaveAttribute("data-fill", CHART_COLORS.palette[0]);
    expect(cells[1]).toHaveAttribute("data-fill", CHART_COLORS.palette[1]);
    expect(cells[2]).toHaveAttribute("data-fill", CHART_COLORS.palette[2]);
    expect(cells[3]).toHaveAttribute("data-fill", CHART_COLORS.palette[3]);
  });

  it("uses custom colors when provided", () => {
    const customColors = ["#ff0000", "#00ff00", "#0000ff", "#ffff00"];
    render(<SimplePieChart data={mockData} colors={customColors} />);
    const cells = screen.getAllByTestId("cell");
    expect(cells[0]).toHaveAttribute("data-fill", "#ff0000");
    expect(cells[1]).toHaveAttribute("data-fill", "#00ff00");
  });

  it("uses color from data item if available", () => {
    const dataWithColors = [
      { name: "A", value: 100, color: "#123456" },
      { name: "B", value: 200 },
    ];
    render(<SimplePieChart data={dataWithColors} />);
    const cells = screen.getAllByTestId("cell");
    expect(cells[0]).toHaveAttribute("data-fill", "#123456");
  });

  it("renders tooltip by default", () => {
    render(<SimplePieChart data={mockData} />);
    expect(screen.getByTestId("tooltip")).toBeInTheDocument();
  });

  it("hides tooltip when showTooltip is false", () => {
    render(<SimplePieChart data={mockData} showTooltip={false} />);
    expect(screen.queryByTestId("tooltip")).not.toBeInTheDocument();
  });

  it("renders legend by default", () => {
    render(<SimplePieChart data={mockData} />);
    expect(screen.getByTestId("legend")).toBeInTheDocument();
  });

  it("hides legend when showLegend is false", () => {
    render(<SimplePieChart data={mockData} showLegend={false} />);
    expect(screen.queryByTestId("legend")).not.toBeInTheDocument();
  });

  it("uses vertical legend layout", () => {
    render(<SimplePieChart data={mockData} />);
    const legend = screen.getByTestId("legend");
    expect(legend).toHaveAttribute("data-layout", "vertical");
    expect(legend).toHaveAttribute("data-align", "right");
  });

  it("shows label by default", () => {
    render(<SimplePieChart data={mockData} />);
    const pie = screen.getByTestId("pie");
    expect(pie).toHaveAttribute("data-has-label", "true");
  });

  it("hides label when showLabel is false", () => {
    render(<SimplePieChart data={mockData} showLabel={false} />);
    const pie = screen.getByTestId("pie");
    expect(pie).toHaveAttribute("data-has-label", "false");
  });

  it("handles empty data array", () => {
    render(<SimplePieChart data={[]} />);
    const pie = screen.getByTestId("pie");
    expect(pie).toHaveAttribute("data-items", "0");
  });

  it("handles single data item", () => {
    render(<SimplePieChart data={[{ name: "Only", value: 100 }]} />);
    const pie = screen.getByTestId("pie");
    expect(pie).toHaveAttribute("data-items", "1");
  });

  it("renders with custom height", () => {
    render(<SimplePieChart data={mockData} height={400} />);
    expect(screen.getByTestId("pie-chart")).toBeInTheDocument();
  });
});

describe("DonutChart", () => {
  const mockData = [
    { name: "Category A", value: 400 },
    { name: "Category B", value: 300 },
    { name: "Category C", value: 200 },
  ];

  it("renders without crashing", () => {
    render(<DonutChart data={mockData} />);
    expect(screen.getByTestId("responsive-container")).toBeInTheDocument();
  });

  it("renders pie chart component", () => {
    render(<DonutChart data={mockData} />);
    expect(screen.getByTestId("pie-chart")).toBeInTheDocument();
  });

  it("renders pie with correct data count", () => {
    render(<DonutChart data={mockData} />);
    const pie = screen.getByTestId("pie");
    expect(pie).toHaveAttribute("data-items", "3");
  });

  it("uses default inner radius of 60", () => {
    render(<DonutChart data={mockData} />);
    const pie = screen.getByTestId("pie");
    expect(pie).toHaveAttribute("data-inner-radius", "60");
  });

  it("uses default outer radius of 100", () => {
    render(<DonutChart data={mockData} />);
    const pie = screen.getByTestId("pie");
    expect(pie).toHaveAttribute("data-outer-radius", "100");
  });

  it("applies custom inner radius", () => {
    render(<DonutChart data={mockData} innerRadius={40} />);
    const pie = screen.getByTestId("pie");
    expect(pie).toHaveAttribute("data-inner-radius", "40");
  });

  it("applies custom outer radius", () => {
    render(<DonutChart data={mockData} outerRadius={90} />);
    const pie = screen.getByTestId("pie");
    expect(pie).toHaveAttribute("data-outer-radius", "90");
  });

  it("renders cells for each data item", () => {
    render(<DonutChart data={mockData} />);
    const cells = screen.getAllByTestId("cell");
    expect(cells.length).toBe(3);
  });

  it("uses palette colors for cells", () => {
    render(<DonutChart data={mockData} />);
    const cells = screen.getAllByTestId("cell");
    expect(cells[0]).toHaveAttribute("data-fill", CHART_COLORS.palette[0]);
  });

  it("uses custom colors when provided", () => {
    const customColors = ["#aaa", "#bbb", "#ccc"];
    render(<DonutChart data={mockData} colors={customColors} />);
    const cells = screen.getAllByTestId("cell");
    expect(cells[0]).toHaveAttribute("data-fill", "#aaa");
  });

  it("renders tooltip by default", () => {
    render(<DonutChart data={mockData} />);
    expect(screen.getByTestId("tooltip")).toBeInTheDocument();
  });

  it("hides tooltip when showTooltip is false", () => {
    render(<DonutChart data={mockData} showTooltip={false} />);
    expect(screen.queryByTestId("tooltip")).not.toBeInTheDocument();
  });

  it("renders legend by default", () => {
    render(<DonutChart data={mockData} />);
    expect(screen.getByTestId("legend")).toBeInTheDocument();
  });

  it("hides legend when showLegend is false", () => {
    render(<DonutChart data={mockData} showLegend={false} />);
    expect(screen.queryByTestId("legend")).not.toBeInTheDocument();
  });

  it("hides label by default", () => {
    render(<DonutChart data={mockData} />);
    const pie = screen.getByTestId("pie");
    expect(pie).toHaveAttribute("data-has-label", "false");
  });

  it("shows label when showLabel is true", () => {
    render(<DonutChart data={mockData} showLabel={true} />);
    const pie = screen.getByTestId("pie");
    expect(pie).toHaveAttribute("data-has-label", "true");
  });

  it("handles empty data array", () => {
    render(<DonutChart data={[]} />);
    const pie = screen.getByTestId("pie");
    expect(pie).toHaveAttribute("data-items", "0");
  });

  it("renders with centerLabel prop", () => {
    render(<DonutChart data={mockData} centerLabel="Total" />);
    expect(screen.getByTestId("pie-chart")).toBeInTheDocument();
  });

  it("renders with centerValue prop", () => {
    render(<DonutChart data={mockData} centerValue={900} />);
    expect(screen.getByTestId("pie-chart")).toBeInTheDocument();
  });

  it("renders with both centerLabel and centerValue", () => {
    render(<DonutChart data={mockData} centerLabel="Total" centerValue={900} />);
    expect(screen.getByTestId("pie-chart")).toBeInTheDocument();
  });

  it("renders with custom height", () => {
    render(<DonutChart data={mockData} height={350} />);
    expect(screen.getByTestId("pie-chart")).toBeInTheDocument();
  });

  it("uses color from data item if available", () => {
    const dataWithColors = [
      { name: "A", value: 100, color: "#abcdef" },
      { name: "B", value: 200 },
    ];
    render(<DonutChart data={dataWithColors} />);
    const cells = screen.getAllByTestId("cell");
    expect(cells[0]).toHaveAttribute("data-fill", "#abcdef");
  });
});
