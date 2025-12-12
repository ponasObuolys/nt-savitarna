import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ChartWrapper, ChartContainer, ResponsiveChart } from "@/components/charts/ChartWrapper";

describe("ChartWrapper", () => {
  const defaultProps = {
    title: "Test Chart",
    children: <div data-testid="chart-content">Chart Content</div>,
  };

  it("renders without crashing", () => {
    render(<ChartWrapper {...defaultProps} />);
    expect(screen.getByText("Test Chart")).toBeInTheDocument();
  });

  it("displays the title", () => {
    render(<ChartWrapper {...defaultProps} />);
    expect(screen.getByText("Test Chart")).toBeInTheDocument();
  });

  it("displays description when provided", () => {
    render(<ChartWrapper {...defaultProps} description="Test description" />);
    expect(screen.getByText("Test description")).toBeInTheDocument();
  });

  it("does not display description when not provided", () => {
    render(<ChartWrapper {...defaultProps} />);
    expect(screen.queryByText("Test description")).not.toBeInTheDocument();
  });

  it("renders children when not loading, no error, and not empty", () => {
    render(<ChartWrapper {...defaultProps} />);
    expect(screen.getByTestId("chart-content")).toBeInTheDocument();
  });

  it("shows loading state when isLoading is true", () => {
    render(<ChartWrapper {...defaultProps} isLoading={true} />);
    expect(screen.getByText("Kraunama...")).toBeInTheDocument();
    expect(screen.queryByTestId("chart-content")).not.toBeInTheDocument();
  });

  it("shows error state when error is provided", () => {
    render(<ChartWrapper {...defaultProps} error="Something went wrong" />);
    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
    expect(screen.queryByTestId("chart-content")).not.toBeInTheDocument();
  });

  it("does not show error when loading", () => {
    render(<ChartWrapper {...defaultProps} isLoading={true} error="Error" />);
    expect(screen.queryByText("Error")).not.toBeInTheDocument();
    expect(screen.getByText("Kraunama...")).toBeInTheDocument();
  });

  it("shows retry button when error and onRetry provided", () => {
    const onRetry = vi.fn();
    render(<ChartWrapper {...defaultProps} error="Error" onRetry={onRetry} />);
    expect(screen.getByText("Bandyti dar kartą")).toBeInTheDocument();
  });

  it("calls onRetry when retry button clicked", () => {
    const onRetry = vi.fn();
    render(<ChartWrapper {...defaultProps} error="Error" onRetry={onRetry} />);
    fireEvent.click(screen.getByText("Bandyti dar kartą"));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it("does not show retry button when no onRetry provided", () => {
    render(<ChartWrapper {...defaultProps} error="Error" />);
    expect(screen.queryByText("Bandyti dar kartą")).not.toBeInTheDocument();
  });

  it("shows empty state when isEmpty is true", () => {
    render(<ChartWrapper {...defaultProps} isEmpty={true} />);
    expect(screen.getByText("Nėra duomenų")).toBeInTheDocument();
    expect(screen.queryByTestId("chart-content")).not.toBeInTheDocument();
  });

  it("shows custom empty message", () => {
    render(<ChartWrapper {...defaultProps} isEmpty={true} emptyMessage="No data available" />);
    expect(screen.getByText("No data available")).toBeInTheDocument();
  });

  it("does not show empty state when loading", () => {
    render(<ChartWrapper {...defaultProps} isLoading={true} isEmpty={true} />);
    expect(screen.queryByText("Nėra duomenų")).not.toBeInTheDocument();
    expect(screen.getByText("Kraunama...")).toBeInTheDocument();
  });

  it("does not show empty state when error", () => {
    render(<ChartWrapper {...defaultProps} error="Error" isEmpty={true} />);
    expect(screen.queryByText("Nėra duomenų")).not.toBeInTheDocument();
    expect(screen.getByText("Error")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(<ChartWrapper {...defaultProps} className="custom-class" />);
    expect(container.firstChild).toHaveClass("custom-class");
  });

  it("uses default height of 300px", () => {
    const { container } = render(<ChartWrapper {...defaultProps} />);
    const chartDiv = container.querySelector('[style*="height"]');
    expect(chartDiv).toHaveStyle({ height: "300px" });
  });

  it("accepts numeric height", () => {
    const { container } = render(<ChartWrapper {...defaultProps} height={400} />);
    const chartDiv = container.querySelector('[style*="height"]');
    expect(chartDiv).toHaveStyle({ height: "400px" });
  });

  it("accepts string height", () => {
    const { container } = render(<ChartWrapper {...defaultProps} height="50vh" />);
    const chartDiv = container.querySelector('[style*="height"]');
    expect(chartDiv).toHaveStyle({ height: "50vh" });
  });

  it("renders actions when provided", () => {
    render(
      <ChartWrapper {...defaultProps} actions={<button data-testid="action-btn">Action</button>} />
    );
    expect(screen.getByTestId("action-btn")).toBeInTheDocument();
  });

  it("does not render actions container when no actions", () => {
    const { container } = render(<ChartWrapper {...defaultProps} />);
    // When no actions, there shouldn't be an extra div with gap-2
    expect(container.querySelector('.flex.items-center.gap-2')).not.toBeInTheDocument();
  });
});

describe("ChartContainer", () => {
  it("renders without crashing", () => {
    render(
      <ChartContainer>
        <div data-testid="content">Content</div>
      </ChartContainer>
    );
    expect(screen.getByTestId("content")).toBeInTheDocument();
  });

  it("renders children when not loading", () => {
    render(
      <ChartContainer isLoading={false}>
        <div data-testid="content">Content</div>
      </ChartContainer>
    );
    expect(screen.getByTestId("content")).toBeInTheDocument();
  });

  it("shows loading skeleton when isLoading is true", () => {
    render(
      <ChartContainer isLoading={true}>
        <div data-testid="content">Content</div>
      </ChartContainer>
    );
    expect(screen.getByText("Kraunama...")).toBeInTheDocument();
    expect(screen.queryByTestId("content")).not.toBeInTheDocument();
  });

  it("uses default height of 300px", () => {
    const { container } = render(
      <ChartContainer>
        <div>Content</div>
      </ChartContainer>
    );
    expect(container.firstChild).toHaveStyle({ height: "300px" });
  });

  it("accepts numeric height", () => {
    const { container } = render(
      <ChartContainer height={500}>
        <div>Content</div>
      </ChartContainer>
    );
    expect(container.firstChild).toHaveStyle({ height: "500px" });
  });

  it("accepts string height", () => {
    const { container } = render(
      <ChartContainer height="100%">
        <div>Content</div>
      </ChartContainer>
    );
    expect(container.firstChild).toHaveStyle({ height: "100%" });
  });

  it("applies custom className", () => {
    const { container } = render(
      <ChartContainer className="custom-container">
        <div>Content</div>
      </ChartContainer>
    );
    expect(container.firstChild).toHaveClass("custom-container");
  });
});

describe("ResponsiveChart", () => {
  it("renders without crashing", () => {
    render(
      <ResponsiveChart>
        <div data-testid="chart">Chart</div>
      </ResponsiveChart>
    );
    expect(screen.getByTestId("chart")).toBeInTheDocument();
  });

  it("renders children", () => {
    render(
      <ResponsiveChart>
        <div data-testid="content">Content</div>
      </ResponsiveChart>
    );
    expect(screen.getByTestId("content")).toBeInTheDocument();
  });

  it("uses default aspect ratio of 16/9", () => {
    const { container } = render(
      <ResponsiveChart>
        <div>Content</div>
      </ResponsiveChart>
    );
    expect(container.firstChild).toHaveStyle({ aspectRatio: `${16 / 9}` });
  });

  it("accepts custom aspect ratio", () => {
    const { container } = render(
      <ResponsiveChart aspectRatio={4 / 3}>
        <div>Content</div>
      </ResponsiveChart>
    );
    expect(container.firstChild).toHaveStyle({ aspectRatio: `${4 / 3}` });
  });

  it("uses default minHeight of 200px", () => {
    const { container } = render(
      <ResponsiveChart>
        <div>Content</div>
      </ResponsiveChart>
    );
    expect(container.firstChild).toHaveStyle({ minHeight: "200px" });
  });

  it("accepts custom minHeight", () => {
    const { container } = render(
      <ResponsiveChart minHeight={300}>
        <div>Content</div>
      </ResponsiveChart>
    );
    expect(container.firstChild).toHaveStyle({ minHeight: "300px" });
  });

  it("uses default maxHeight of 400px", () => {
    const { container } = render(
      <ResponsiveChart>
        <div>Content</div>
      </ResponsiveChart>
    );
    expect(container.firstChild).toHaveStyle({ maxHeight: "400px" });
  });

  it("accepts custom maxHeight", () => {
    const { container } = render(
      <ResponsiveChart maxHeight={600}>
        <div>Content</div>
      </ResponsiveChart>
    );
    expect(container.firstChild).toHaveStyle({ maxHeight: "600px" });
  });

  it("applies w-full class", () => {
    const { container } = render(
      <ResponsiveChart>
        <div>Content</div>
      </ResponsiveChart>
    );
    expect(container.firstChild).toHaveClass("w-full");
  });
});
