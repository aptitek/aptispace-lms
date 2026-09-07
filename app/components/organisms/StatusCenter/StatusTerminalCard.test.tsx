import { describe, it, expect, vi, afterEach } from "vitest";
import React from "react";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { ThemeProvider } from "@mui/material/styles";
import { I18nextProvider } from "react-i18next";
import i18n from "~/i18n";
import { appTheme } from "~/tokens/theme";
import StatusTerminalCard from "./StatusTerminalCard";
import { StatusTerminalHeader } from "./StatusTerminalHeader";
import { StatusTerminalFilterChips } from "./StatusTerminalFilterChips";
import { StatusTerminalEventRow } from "./StatusTerminalEventRow";
import { StatusTerminalDetails } from "./StatusTerminalDetails";
import type { TelemetryEventItem } from "~/utils/statusCenter.types";

const mockCloseTerminal = vi.fn();
const mockClearAll = vi.fn();
const mockSetActiveFilter = vi.fn();
const mockSimulateEvent = vi.fn();
const mockClearItem = vi.fn();
const mockReportItem = vi.fn().mockResolvedValue({ reportId: "rep-123" });

let mockContextValue = {
  events: [] as TelemetryEventItem[],
  isTerminalOpen: true,
  closeTerminal: mockCloseTerminal,
  systemStatus: "nominal" as const,
  bpm: 72,
  activeFilter: "all" as const,
  setActiveFilter: mockSetActiveFilter,
  clearItem: mockClearItem,
  clearAll: mockClearAll,
  reportItem: mockReportItem,
  simulateEvent: mockSimulateEvent,
  infraHealth: {
    status: "nominal" as const,
    d1: { status: "nominal" as const, latencyMs: 12 },
    r2: { status: "nominal" as const, latencyMs: 25 },
    worker: { status: "nominal" as const, latencyMs: 5 },
  },
  refreshInfrastructureHealth: vi.fn(),
  isInfraRefreshing: false,
};

vi.mock("~/utils/statusCenterContext", () => ({
  useStatusCenter: () => mockContextValue,
}));

afterEach(cleanup);

function renderWithProviders(ui: React.ReactElement) {
  return render(
    <I18nextProvider i18n={i18n}>
      <ThemeProvider theme={appTheme}>{ui}</ThemeProvider>
    </I18nextProvider>,
  );
}

describe("StatusTerminalCard Organism", () => {
  const sampleEvent: TelemetryEventItem = {
    id: "evt-1",
    title: "Gateway Timeout Error",
    message: "Failed connecting to upstream socket",
    severity: "error",
    statusCode: 504,
    timestamp: new Date(),
    contextData: { endpoint: "/api/status", method: "GET" },
  };

  it("renders StatusTerminalCard modal when isTerminalOpen is true", () => {
    mockContextValue = {
      ...mockContextValue,
      isTerminalOpen: true,
      events: [],
    };

    renderWithProviders(<StatusTerminalCard />);

    expect(screen.getByTestId("status-terminal-card")).toBeDefined();
    expect(screen.getByTestId("status-terminal-infrastructure")).toBeDefined();
    expect(
      screen.getByText("No active diagnostic events. Carrier nominal."),
    ).toBeDefined();
  });

  it("renders StatusTerminalHeader with system status and triggers close", () => {
    const onClose = vi.fn();
    renderWithProviders(
      <StatusTerminalHeader
        systemStatus="nominal"
        bpm={72}
        onClose={onClose}
        onSimulate={vi.fn()}
      />,
    );

    expect(screen.getByText("ALL SYSTEMS OPERATIONAL")).toBeDefined();
    const closeBtn = screen.getByLabelText("Close telemetry terminal");
    fireEvent.click(closeBtn);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("renders StatusTerminalFilterChips and triggers onSelectFilter", () => {
    const onSelectFilter = vi.fn();
    const onClearAll = vi.fn();

    renderWithProviders(
      <StatusTerminalFilterChips
        events={[sampleEvent]}
        activeFilter="all"
        onSelectFilter={onSelectFilter}
        onClearAll={onClearAll}
      />,
    );

    expect(screen.getByText("All (1)")).toBeDefined();
  });

  it("renders StatusTerminalEventRow and expands details", () => {
    const onToggle = vi.fn();
    const onClear = vi.fn();

    renderWithProviders(
      <StatusTerminalEventRow
        eventEntry={sampleEvent}
        isExpanded={true}
        onToggleExpand={onToggle}
        onClear={onClear}
        onReport={mockReportItem}
      />,
    );

    expect(screen.getByText("Gateway Timeout Error")).toBeDefined();
    expect(
      screen.getByText("Failed connecting to upstream socket"),
    ).toBeDefined();
  });

  it("renders StatusTerminalDetails with JSON data", () => {
    renderWithProviders(
      <StatusTerminalDetails
        eventEntry={sampleEvent}
        onReport={mockReportItem}
      />,
    );

    expect(screen.getByText("SOURCE & SUBSYSTEM")).toBeDefined();
    expect(screen.getByText("Report to Mission Control")).toBeDefined();
  });
});
