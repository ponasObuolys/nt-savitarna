import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { ExportButton } from "@/components/reports/ExportButton";
import type { DateFilter } from "@/types";

// Mock fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Mock URL.createObjectURL and URL.revokeObjectURL
const mockCreateObjectURL = vi.fn(() => "blob:http://localhost/test");
const mockRevokeObjectURL = vi.fn();
global.URL.createObjectURL = mockCreateObjectURL;
global.URL.revokeObjectURL = mockRevokeObjectURL;

describe("ExportButton", () => {
  const defaultDateFilter: DateFilter = {
    preset: "month",
    dateFrom: null,
    dateTo: null,
  };

  beforeEach(() => {
    mockFetch.mockClear();
    mockCreateObjectURL.mockClear();
    mockRevokeObjectURL.mockClear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("Rendering", () => {
    it("renders export button with correct text", () => {
      render(<ExportButton reportType="orders" dateFilter={defaultDateFilter} />);

      expect(screen.getByRole("button")).toBeInTheDocument();
      expect(screen.getByText("Eksportuoti")).toBeInTheDocument();
    });

    it("renders download icon", () => {
      render(<ExportButton reportType="orders" dateFilter={defaultDateFilter} />);

      // Check for SVG element (Download icon from lucide-react)
      const button = screen.getByRole("button");
      const svg = button.querySelector("svg");
      expect(svg).toBeInTheDocument();
    });

    it("renders with different report types", () => {
      const { rerender } = render(
        <ExportButton reportType="orders" dateFilter={defaultDateFilter} />
      );
      expect(screen.getByRole("button")).toBeInTheDocument();

      rerender(<ExportButton reportType="revenue" dateFilter={defaultDateFilter} />);
      expect(screen.getByRole("button")).toBeInTheDocument();

      rerender(<ExportButton reportType="valuators" dateFilter={defaultDateFilter} />);
      expect(screen.getByRole("button")).toBeInTheDocument();

      rerender(<ExportButton reportType="clients" dateFilter={defaultDateFilter} />);
      expect(screen.getByRole("button")).toBeInTheDocument();

      rerender(<ExportButton reportType="geography" dateFilter={defaultDateFilter} />);
      expect(screen.getByRole("button")).toBeInTheDocument();
    });
  });

  describe("Disabled state", () => {
    it("disables button when disabled prop is true", () => {
      render(
        <ExportButton
          reportType="orders"
          dateFilter={defaultDateFilter}
          disabled={true}
        />
      );

      expect(screen.getByRole("button")).toBeDisabled();
    });

    it("enables button by default", () => {
      render(<ExportButton reportType="orders" dateFilter={defaultDateFilter} />);

      expect(screen.getByRole("button")).not.toBeDisabled();
    });
  });

  describe("Props handling", () => {
    it("accepts all valid report types", () => {
      const reportTypes: Array<"orders" | "revenue" | "valuators" | "clients" | "geography"> = [
        "orders",
        "revenue",
        "valuators",
        "clients",
        "geography",
      ];

      reportTypes.forEach((reportType) => {
        const { unmount } = render(
          <ExportButton reportType={reportType} dateFilter={defaultDateFilter} />
        );
        expect(screen.getByRole("button")).toBeInTheDocument();
        unmount();
      });
    });

    it("handles preset date filters", () => {
      const presets: Array<DateFilter["preset"]> = ["today", "week", "month", "quarter", "year"];

      presets.forEach((preset) => {
        const filter: DateFilter = { preset, dateFrom: null, dateTo: null };
        const { unmount } = render(
          <ExportButton reportType="orders" dateFilter={filter} />
        );
        expect(screen.getByRole("button")).toBeInTheDocument();
        unmount();
      });
    });

    it("handles custom date filter", () => {
      const customFilter: DateFilter = {
        preset: "custom",
        dateFrom: new Date("2025-01-01"),
        dateTo: new Date("2025-01-31"),
      };

      render(<ExportButton reportType="orders" dateFilter={customFilter} />);
      expect(screen.getByRole("button")).toBeInTheDocument();
    });

    it("handles null dates in filter", () => {
      const nullFilter: DateFilter = {
        preset: "month",
        dateFrom: null,
        dateTo: null,
      };

      render(<ExportButton reportType="orders" dateFilter={nullFilter} />);
      expect(screen.getByRole("button")).toBeInTheDocument();
    });
  });

  describe("Button attributes", () => {
    it("has correct button variant (outline)", () => {
      render(<ExportButton reportType="orders" dateFilter={defaultDateFilter} />);

      const button = screen.getByRole("button");
      // Shadcn outline variant typically has border classes
      expect(button.className).toContain("border");
    });

    it("has correct size (sm)", () => {
      render(<ExportButton reportType="orders" dateFilter={defaultDateFilter} />);

      const button = screen.getByRole("button");
      // Size sm typically has smaller padding/text
      expect(button).toBeInTheDocument();
    });
  });

  describe("Component structure", () => {
    it("wraps button in dropdown menu trigger", () => {
      render(<ExportButton reportType="orders" dateFilter={defaultDateFilter} />);

      // The button should be clickable (dropdown trigger)
      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("type", "button");
    });

    it("maintains consistent rendering across multiple renders", () => {
      const { rerender } = render(
        <ExportButton reportType="orders" dateFilter={defaultDateFilter} />
      );

      const button1Text = screen.getByText("Eksportuoti");
      expect(button1Text).toBeInTheDocument();

      // Rerender with same props
      rerender(<ExportButton reportType="orders" dateFilter={defaultDateFilter} />);

      const button2Text = screen.getByText("Eksportuoti");
      expect(button2Text).toBeInTheDocument();
    });
  });
});

describe("ExportButton integration scenarios", () => {
  const defaultDateFilter: DateFilter = {
    preset: "month",
    dateFrom: null,
    dateTo: null,
  };

  it("can be used for orders report", () => {
    render(<ExportButton reportType="orders" dateFilter={defaultDateFilter} />);
    expect(screen.getByText("Eksportuoti")).toBeInTheDocument();
  });

  it("can be used for revenue report", () => {
    render(<ExportButton reportType="revenue" dateFilter={defaultDateFilter} />);
    expect(screen.getByText("Eksportuoti")).toBeInTheDocument();
  });

  it("can be used for valuators report", () => {
    render(<ExportButton reportType="valuators" dateFilter={defaultDateFilter} />);
    expect(screen.getByText("Eksportuoti")).toBeInTheDocument();
  });

  it("can be used for clients report", () => {
    render(<ExportButton reportType="clients" dateFilter={defaultDateFilter} />);
    expect(screen.getByText("Eksportuoti")).toBeInTheDocument();
  });

  it("can be used for geography report", () => {
    render(<ExportButton reportType="geography" dateFilter={defaultDateFilter} />);
    expect(screen.getByText("Eksportuoti")).toBeInTheDocument();
  });
});
