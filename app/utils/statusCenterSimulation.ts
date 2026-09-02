import type { NotifyInput, TelemetryEventItem } from "./statusCenter.types";
import { recordHydrationError } from "./hydrationTracker";

export interface SimulationHandlers {
  notify: (input: NotifyInput) => TelemetryEventItem;
  notifyError: (
    error: unknown,
    options?: Partial<NotifyInput>,
  ) => TelemetryEventItem;
  notifySecurityBreach: (
    message?: string,
    options?: Partial<NotifyInput>,
  ) => TelemetryEventItem;
  notifyWarning: (
    message: string,
    options?: Partial<NotifyInput>,
  ) => TelemetryEventItem;
  notifySuccess: (
    message: string,
    options?: Partial<NotifyInput>,
  ) => TelemetryEventItem;
  setIsOnline: (online: boolean) => void;
}

export function executeTelemetrySimulation(
  simulationType:
    | "nominal"
    | "warning"
    | "error"
    | "critical"
    | "security_403"
    | "offline"
    | "hydration",
  handlers: SimulationHandlers,
) {
  const {
    notify,
    notifyError,
    notifySecurityBreach,
    notifySuccess,
    notifyWarning,
    setIsOnline,
  } = handlers;

  switch (simulationType) {
    case "nominal":
      notifySuccess("API Gateway synchronization verified.");
      break;
    case "warning":
      notifyWarning(
        "Gateway node latency elevated to 240ms. Minor packet jitter.",
      );
      break;
    case "error":
      notifyError(new Error("Diagnostic runtime exception: D1 query timeout"));
      break;
    case "critical":
      notify({
        title: "STATION FAULT: TELEMETRY ANOMALY",
        message:
          "Primary propulsion sub-controller dropped out of consensus ring.",
        severity: "critical",
        source: "flight-control",
      });
      break;
    case "security_403":
      notifySecurityBreach(
        "Security Infraction (403): Unauthorized attempt to access /api/admin/credentials",
      );
      break;
    case "offline":
      setIsOnline(false);
      notify({
        title: "GATEWAY CARRIER LOST",
        message:
          "Station connection flatlined. Operating on emergency cached telemetry.",
        severity: "critical",
        source: "carrier-detect",
      });
      break;
    case "hydration":
      recordHydrationError(
        new Error(
          "Hydration failed because the server rendered HTML didn't match the client. As a result this tree will be regenerated on the client.",
        ),
        {
          componentStack:
            "\n    in ShapeDefs (at root.tsx:57)\n    in AppThemeContainer (at root.tsx:100)\n    in ThemeProvider (at root.tsx:55)",
        },
      );
      break;
  }
}
