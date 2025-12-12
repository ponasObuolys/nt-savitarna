import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { StatsCard, StatsCardWithSparkline, StatsGrid } from "@/components/reports/StatsCard";

describe("StatsCard", () => {
  it("renders without crashing", () => {
    render(<StatsCard title="Test Title" value="123" />);
    expect(screen.getByText("Test Title")).toBeInTheDocument();
  });

  it("displays the title correctly", () => {
    render(<StatsCard title="Total Orders" value="500" />);
    expect(screen.getByText("Total Orders")).toBeInTheDocument();
  });

  it("displays string value correctly", () => {
    render(<StatsCard title="Status" value="Active" />);
    expect(screen.getByText("Active")).toBeInTheDocument();
  });

  it("displays numeric value correctly", () => {
    render(<StatsCard title="Count" value={42} />);
    expect(screen.getByText("42")).toBeInTheDocument();
  });

  it("displays description when provided", () => {
    render(<StatsCard title="Revenue" value="1000" description="This month" />);
    expect(screen.getByText("This month")).toBeInTheDocument();
  });

  it("does not display description when not provided", () => {
    render(<StatsCard title="Revenue" value="1000" />);
    expect(screen.queryByText("This month")).not.toBeInTheDocument();
  });

  it("renders icon when provided", () => {
    const icon = <span data-testid="custom-icon">📊</span>;
    render(<StatsCard title="Stats" value="100" icon={icon} />);
    expect(screen.getByTestId("custom-icon")).toBeInTheDocument();
  });

  it("does not render icon wrapper when icon not provided", () => {
    const { container } = render(<StatsCard title="Stats" value="100" />);
    // Check that there's no icon container with bg-blue-50
    expect(container.querySelector(".bg-blue-50")).not.toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(<StatsCard title="Stats" value="100" className="custom-class" />);
    expect(container.firstChild).toHaveClass("custom-class");
  });

  // Trend tests
  it("displays positive trend correctly", () => {
    render(<StatsCard title="Revenue" value="1000" trend={{ value: 15.5 }} />);
    expect(screen.getByText("+15.5%")).toBeInTheDocument();
  });

  it("displays negative trend correctly", () => {
    render(<StatsCard title="Revenue" value="1000" trend={{ value: -10.2 }} />);
    expect(screen.getByText("-10.2%")).toBeInTheDocument();
  });

  it("displays neutral trend (zero) correctly", () => {
    render(<StatsCard title="Revenue" value="1000" trend={{ value: 0 }} />);
    expect(screen.getByText("0.0%")).toBeInTheDocument();
  });

  it("displays trend label when provided", () => {
    render(<StatsCard title="Revenue" value="1000" trend={{ value: 10, label: "vs last week" }} />);
    expect(screen.getByText("vs last week")).toBeInTheDocument();
  });

  it("shows green color for positive good trend (positive value, isPositiveGood true)", () => {
    const { container } = render(
      <StatsCard title="Revenue" value="1000" trend={{ value: 10, isPositiveGood: true }} />
    );
    expect(container.querySelector(".text-green-600")).toBeInTheDocument();
  });

  it("shows red color for negative trend when isPositiveGood is true", () => {
    const { container } = render(
      <StatsCard title="Revenue" value="1000" trend={{ value: -10, isPositiveGood: true }} />
    );
    expect(container.querySelector(".text-red-600")).toBeInTheDocument();
  });

  it("shows red color for positive trend when isPositiveGood is false", () => {
    const { container } = render(
      <StatsCard title="Errors" value="50" trend={{ value: 10, isPositiveGood: false }} />
    );
    expect(container.querySelector(".text-red-600")).toBeInTheDocument();
  });

  it("shows green color for negative trend when isPositiveGood is false", () => {
    const { container } = render(
      <StatsCard title="Errors" value="50" trend={{ value: -10, isPositiveGood: false }} />
    );
    expect(container.querySelector(".text-green-600")).toBeInTheDocument();
  });

  it("shows gray color for neutral (zero) trend", () => {
    const { container } = render(
      <StatsCard title="Revenue" value="1000" trend={{ value: 0 }} />
    );
    expect(container.querySelector(".text-gray-500")).toBeInTheDocument();
  });

  // Loading state tests
  it("shows loading state when isLoading is true", () => {
    const { container } = render(<StatsCard title="Revenue" value="1000" isLoading={true} />);
    expect(container.querySelectorAll(".animate-pulse").length).toBeGreaterThan(0);
  });

  it("does not show value when loading", () => {
    render(<StatsCard title="Revenue" value="1000" isLoading={true} />);
    expect(screen.queryByText("1000")).not.toBeInTheDocument();
  });

  it("does not show title when loading", () => {
    render(<StatsCard title="Revenue" value="1000" isLoading={true} />);
    expect(screen.queryByText("Revenue")).not.toBeInTheDocument();
  });

  it("shows content when isLoading is false", () => {
    render(<StatsCard title="Revenue" value="1000" isLoading={false} />);
    expect(screen.getByText("Revenue")).toBeInTheDocument();
    expect(screen.getByText("1000")).toBeInTheDocument();
  });

  it("defaults to not loading", () => {
    render(<StatsCard title="Revenue" value="1000" />);
    expect(screen.getByText("Revenue")).toBeInTheDocument();
    expect(screen.getByText("1000")).toBeInTheDocument();
  });
});

describe("StatsCardWithSparkline", () => {
  it("renders without crashing", () => {
    render(<StatsCardWithSparkline title="Test Title" value="123" />);
    expect(screen.getByText("Test Title")).toBeInTheDocument();
  });

  it("displays title and value", () => {
    render(<StatsCardWithSparkline title="Orders" value="500" />);
    expect(screen.getByText("Orders")).toBeInTheDocument();
    expect(screen.getByText("500")).toBeInTheDocument();
  });

  it("displays description when provided", () => {
    render(<StatsCardWithSparkline title="Revenue" value="1000" description="Per month" />);
    expect(screen.getByText("Per month")).toBeInTheDocument();
  });

  it("renders icon when provided", () => {
    const icon = <span data-testid="spark-icon">💹</span>;
    render(<StatsCardWithSparkline title="Stats" value="100" icon={icon} />);
    expect(screen.getByTestId("spark-icon")).toBeInTheDocument();
  });

  it("renders sparkline when data provided", () => {
    const { container } = render(
      <StatsCardWithSparkline title="Orders" value="500" sparklineData={[10, 20, 15, 25, 30]} />
    );
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("does not render sparkline when data is empty", () => {
    const { container } = render(
      <StatsCardWithSparkline title="Orders" value="500" sparklineData={[]} />
    );
    expect(container.querySelector("svg")).not.toBeInTheDocument();
  });

  it("does not render sparkline when data is not provided", () => {
    const { container } = render(
      <StatsCardWithSparkline title="Orders" value="500" />
    );
    expect(container.querySelector("svg")).not.toBeInTheDocument();
  });

  it("renders sparkline with correct color for positive trend", () => {
    const { container } = render(
      <StatsCardWithSparkline title="Orders" value="500" sparklineData={[10, 20, 30]} />
    );
    const polyline = container.querySelector("polyline");
    expect(polyline).toHaveAttribute("stroke", "#22c55e");
  });

  it("renders sparkline with correct color for negative trend", () => {
    const { container } = render(
      <StatsCardWithSparkline title="Orders" value="500" sparklineData={[30, 20, 10]} />
    );
    const polyline = container.querySelector("polyline");
    expect(polyline).toHaveAttribute("stroke", "#ef4444");
  });

  it("renders sparkline with green color for flat trend (first equals last)", () => {
    const { container } = render(
      <StatsCardWithSparkline title="Orders" value="500" sparklineData={[20, 10, 30, 20]} />
    );
    const polyline = container.querySelector("polyline");
    expect(polyline).toHaveAttribute("stroke", "#22c55e");
  });

  it("applies custom className", () => {
    const { container } = render(
      <StatsCardWithSparkline title="Stats" value="100" className="sparkline-custom" />
    );
    expect(container.firstChild).toHaveClass("sparkline-custom");
  });
});

describe("StatsGrid", () => {
  it("renders without crashing", () => {
    render(
      <StatsGrid>
        <StatsCard title="A" value="1" />
      </StatsGrid>
    );
    expect(screen.getByText("A")).toBeInTheDocument();
  });

  it("renders multiple children", () => {
    render(
      <StatsGrid>
        <StatsCard title="A" value="1" />
        <StatsCard title="B" value="2" />
        <StatsCard title="C" value="3" />
      </StatsGrid>
    );
    expect(screen.getByText("A")).toBeInTheDocument();
    expect(screen.getByText("B")).toBeInTheDocument();
    expect(screen.getByText("C")).toBeInTheDocument();
  });

  it("applies grid classes", () => {
    const { container } = render(
      <StatsGrid>
        <StatsCard title="A" value="1" />
      </StatsGrid>
    );
    expect(container.firstChild).toHaveClass("grid");
    expect(container.firstChild).toHaveClass("gap-4");
  });

  it("applies custom className", () => {
    const { container } = render(
      <StatsGrid className="custom-grid-class">
        <StatsCard title="A" value="1" />
      </StatsGrid>
    );
    expect(container.firstChild).toHaveClass("custom-grid-class");
  });

  it("has responsive grid columns", () => {
    const { container } = render(
      <StatsGrid>
        <StatsCard title="A" value="1" />
      </StatsGrid>
    );
    expect(container.firstChild).toHaveClass("grid-cols-1");
    expect(container.firstChild).toHaveClass("sm:grid-cols-2");
    expect(container.firstChild).toHaveClass("lg:grid-cols-4");
  });
});
