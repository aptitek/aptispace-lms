import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { ThemeProvider } from "@mui/material/styles";
import { appTheme } from "~/tokens/theme";
import EcgTelemetry from "~/components/atoms/StatusCenter/EcgTelemetry";
import StatusSnackbar from "./StatusSnackbar";
import StatusGatewayTrigger from "./StatusGatewayTrigger";
import type { TelemetryEventItem } from "~/utils/statusCenterContext";

describe("StatusCenter Molecule Components", () => {
  afterEach(() => {
    cleanup();
  });
  it("exports EcgTelemetry properly", () => {
    expect(EcgTelemetry).toBeDefined();
    expect(typeof EcgTelemetry).toBe("function");
  });

  it("exports StatusSnackbar properly", () => {
    expect(StatusSnackbar).toBeDefined();
    expect(typeof StatusSnackbar).toBe("function");
  });

  it("exports StatusGatewayTrigger properly", () => {
    expect(StatusGatewayTrigger).toBeDefined();
    expect(typeof StatusGatewayTrigger).toBe("function");
  });

  describe("StatusSnackbar", () => {
    it("renders only the message and icon without displaying event type as title", () => {
      const mockEvent: TelemetryEventItem = {
        id: "evt-error-1",
        title: "Diagnostic Error",
        message: "Failed to communicate with orbital telemetry server.",
        severity: "error",
        timestamp: new Date(),
      };

      render(
        <ThemeProvider theme={appTheme}>
          <StatusSnackbar eventEntry={mockEvent} />
        </ThemeProvider>,
      );

      // Verify the message is rendered
      const messageEl = screen.getByTestId("status-snackbar-message");
      expect(messageEl.textContent).toBe(
        "Failed to communicate with orbital telemetry server.",
      );

      // Verify "Diagnostic Error" is NOT rendered as a title
      expect(screen.queryByText("Diagnostic Error")).toBeNull();

      // Verify icon box exists
      const iconBox = screen.getByTestId("status-snackbar-icon");
      expect(iconBox).toBeDefined();
    });

    it("triggers onDismiss when the dismiss button is clicked", () => {
      const handleDismiss = vi.fn();
      const mockEvent: TelemetryEventItem = {
        id: "evt-info-1",
        title: "Telemetry Notice",
        message: "Cache flushed successfully.",
        severity: "info",
        timestamp: new Date(),
      };

      render(
        <ThemeProvider theme={appTheme}>
          <StatusSnackbar eventEntry={mockEvent} onDismiss={handleDismiss} />
        </ThemeProvider>,
      );

      const dismissBtn = screen.getByRole("button", { name: /dismiss/i });
      fireEvent.click(dismissBtn);
      expect(handleDismiss).toHaveBeenCalledTimes(1);
    });
  });
});
