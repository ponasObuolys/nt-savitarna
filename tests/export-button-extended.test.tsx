import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ExportButton, type ReportType } from "@/components/reports/ExportButton";
import type { DateFilter } from "@/types";

// Mock fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Mock URL methods
const mockCreateObjectURL = vi.fn(() => "blob:test-url");
const mockRevokeObjectURL = vi.fn();
global.URL.createObjectURL = mockCreateObjectURL;
global.URL.revokeObjectURL = mockRevokeObjectURL;

// Mock alert
const mockAlert = vi.fn();
global.alert = mockAlert;

describe("ExportButton", () => {
  const defaultDateFilter: DateFilter = {
    preset: "month",
    dateFrom: null,
    dateTo: null,
  };

  const customDateFilter: DateFilter = {
    preset: "custom",
    dateFrom: new Date("2025-01-01"),
    dateTo: new Date("2025-01-31"),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // Mock successful response by default
    mockFetch.mockResolvedValue({
      ok: true,
      headers: new Headers({
        "Content-Disposition": 'attachment; filename="test-export.csv"',
      }),
      blob: () => Promise.resolve(new Blob(["test data"], { type: "text/csv" })),
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders without crashing", () => {
    render(<ExportButton reportType="orders" dateFilter={defaultDateFilter} />);
    expect(screen.getByText("Eksportuoti")).toBeInTheDocument();
  });

  it("displays download icon in button", () => {
    const { container } = render(
      <ExportButton reportType="orders" dateFilter={defaultDateFilter} />
    );
    // Check for SVG icon
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("shows dropdown menu when clicked", async () => {
    const user = userEvent.setup();
    render(<ExportButton reportType="orders" dateFilter={defaultDateFilter} />);

    await user.click(screen.getByText("Eksportuoti"));

    expect(screen.getByText("CSV formatas")).toBeInTheDocument();
    expect(screen.getByText("PDF formatas")).toBeInTheDocument();
  });

  it("calls fetch with correct params for CSV export", async () => {
    const user = userEvent.setup();
    render(<ExportButton reportType="orders" dateFilter={defaultDateFilter} />);

    await user.click(screen.getByText("Eksportuoti"));
    await user.click(screen.getByText("CSV formatas"));

    expect(mockFetch).toHaveBeenCalledWith("/api/admin/reports/export", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        reportType: "orders",
        format: "csv",
        filter: {
          preset: "month",
          dateFrom: null,
          dateTo: null,
        },
      }),
    });
  });

  it("calls fetch with correct params for PDF export", async () => {
    const user = userEvent.setup();
    render(<ExportButton reportType="revenue" dateFilter={defaultDateFilter} />);

    await user.click(screen.getByText("Eksportuoti"));
    await user.click(screen.getByText("PDF formatas"));

    expect(mockFetch).toHaveBeenCalledWith("/api/admin/reports/export", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        reportType: "revenue",
        format: "pdf",
        filter: {
          preset: "month",
          dateFrom: null,
          dateTo: null,
        },
      }),
    });
  });

  it("passes custom date filter correctly", async () => {
    const user = userEvent.setup();
    render(<ExportButton reportType="valuators" dateFilter={customDateFilter} />);

    await user.click(screen.getByText("Eksportuoti"));
    await user.click(screen.getByText("CSV formatas"));

    expect(mockFetch).toHaveBeenCalledWith("/api/admin/reports/export", expect.objectContaining({
      body: JSON.stringify({
        reportType: "valuators",
        format: "csv",
        filter: {
          preset: "custom",
          dateFrom: "2025-01-01",
          dateTo: "2025-01-31",
        },
      }),
    }));
  });

  it("shows loading state during export", async () => {
    // Make fetch hang to test loading state
    mockFetch.mockImplementation(() => new Promise(() => {}));

    const user = userEvent.setup();
    render(<ExportButton reportType="orders" dateFilter={defaultDateFilter} />);

    await user.click(screen.getByText("Eksportuoti"));
    await user.click(screen.getByText("CSV formatas"));

    await waitFor(() => {
      expect(screen.getByText("Eksportuojama...")).toBeInTheDocument();
    });
  });

  it("handles export error with message from server", async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({ error: "Server error message" }),
    });

    const user = userEvent.setup();
    render(<ExportButton reportType="orders" dateFilter={defaultDateFilter} />);

    await user.click(screen.getByText("Eksportuoti"));
    await user.click(screen.getByText("CSV formatas"));

    await waitFor(() => {
      expect(mockAlert).toHaveBeenCalledWith("Server error message");
    });
  });

  it("handles export error without message from server", async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({}),
    });

    const user = userEvent.setup();
    render(<ExportButton reportType="orders" dateFilter={defaultDateFilter} />);

    await user.click(screen.getByText("Eksportuoti"));
    await user.click(screen.getByText("CSV formatas"));

    await waitFor(() => {
      expect(mockAlert).toHaveBeenCalledWith("Eksporto klaida");
    });
  });

  it("handles network error", async () => {
    mockFetch.mockRejectedValue(new Error("Network error"));

    const user = userEvent.setup();
    render(<ExportButton reportType="orders" dateFilter={defaultDateFilter} />);

    await user.click(screen.getByText("Eksportuoti"));
    await user.click(screen.getByText("CSV formatas"));

    await waitFor(() => {
      expect(mockAlert).toHaveBeenCalledWith("Network error");
    });
  });

  it("handles non-Error thrown exception", async () => {
    mockFetch.mockRejectedValue("String error");

    const user = userEvent.setup();
    render(<ExportButton reportType="orders" dateFilter={defaultDateFilter} />);

    await user.click(screen.getByText("Eksportuoti"));
    await user.click(screen.getByText("CSV formatas"));

    await waitFor(() => {
      expect(mockAlert).toHaveBeenCalledWith("Eksporto klaida");
    });
  });

  it("triggers download on successful export", async () => {
    const user = userEvent.setup();
    render(<ExportButton reportType="orders" dateFilter={defaultDateFilter} />);

    await user.click(screen.getByText("Eksportuoti"));
    await user.click(screen.getByText("CSV formatas"));

    // Verify createObjectURL and revokeObjectURL were called
    await waitFor(() => {
      expect(mockCreateObjectURL).toHaveBeenCalled();
      expect(mockRevokeObjectURL).toHaveBeenCalled();
    });
  });

  it("handles Content-Disposition header correctly", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      headers: new Headers({
        "Content-Disposition": 'attachment; filename="custom-filename.csv"',
      }),
      blob: () => Promise.resolve(new Blob(["test"])),
    });

    const user = userEvent.setup();
    render(<ExportButton reportType="orders" dateFilter={defaultDateFilter} />);

    await user.click(screen.getByText("Eksportuoti"));
    await user.click(screen.getByText("CSV formatas"));

    // Verify blob was created for download
    await waitFor(() => {
      expect(mockCreateObjectURL).toHaveBeenCalled();
    });
  });

  it("works without Content-Disposition header", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      headers: new Headers({}),
      blob: () => Promise.resolve(new Blob(["test"])),
    });

    const user = userEvent.setup();
    render(<ExportButton reportType="geography" dateFilter={defaultDateFilter} />);

    await user.click(screen.getByText("Eksportuoti"));
    await user.click(screen.getByText("PDF formatas"));

    // Verify download was triggered
    await waitFor(() => {
      expect(mockCreateObjectURL).toHaveBeenCalled();
    });
  });

  it("is disabled when disabled prop is true", () => {
    render(<ExportButton reportType="orders" dateFilter={defaultDateFilter} disabled={true} />);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("is enabled when disabled prop is false", () => {
    render(<ExportButton reportType="orders" dateFilter={defaultDateFilter} disabled={false} />);
    expect(screen.getByRole("button")).not.toBeDisabled();
  });

  it("is enabled by default", () => {
    render(<ExportButton reportType="orders" dateFilter={defaultDateFilter} />);
    expect(screen.getByRole("button")).not.toBeDisabled();
  });

  // Test all report types
  const reportTypes: ReportType[] = ["orders", "revenue", "valuators", "clients", "geography"];

  reportTypes.forEach((reportType) => {
    it(`works with ${reportType} report type`, async () => {
      const user = userEvent.setup();
      render(<ExportButton reportType={reportType} dateFilter={defaultDateFilter} />);

      await user.click(screen.getByText("Eksportuoti"));
      await user.click(screen.getByText("CSV formatas"));

      expect(mockFetch).toHaveBeenCalledWith(
        "/api/admin/reports/export",
        expect.objectContaining({
          body: expect.stringContaining(`"reportType":"${reportType}"`),
        })
      );
    });
  });

  it("disables menu items during loading", async () => {
    mockFetch.mockImplementation(() => new Promise(() => {}));

    const user = userEvent.setup();
    render(<ExportButton reportType="orders" dateFilter={defaultDateFilter} />);

    await user.click(screen.getByText("Eksportuoti"));
    await user.click(screen.getByText("CSV formatas"));

    // The button should be disabled during loading
    await waitFor(() => {
      expect(screen.getByRole("button")).toBeDisabled();
    });
  });

  it("re-enables button after export completes", async () => {
    const user = userEvent.setup();
    render(<ExportButton reportType="orders" dateFilter={defaultDateFilter} />);

    await user.click(screen.getByText("Eksportuoti"));
    await user.click(screen.getByText("CSV formatas"));

    await waitFor(() => {
      expect(screen.getByRole("button")).not.toBeDisabled();
    });
  });

  it("re-enables button after export error", async () => {
    mockFetch.mockRejectedValue(new Error("Error"));

    const user = userEvent.setup();
    render(<ExportButton reportType="orders" dateFilter={defaultDateFilter} />);

    await user.click(screen.getByText("Eksportuoti"));
    await user.click(screen.getByText("CSV formatas"));

    await waitFor(() => {
      expect(screen.getByRole("button")).not.toBeDisabled();
    });
  });
});
