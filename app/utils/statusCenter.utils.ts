import type {
  EventFilterType,
  NotificationSeverity,
  NotifyInput,
  StatusCenterContextValue,
  SystemHealthStatus,
  SystemInfrastructureHealth,
  TelemetryEventItem,
} from "./statusCenter.types";

export const DEFAULT_SEVERITY_TITLES: Record<NotificationSeverity, string> = {
  ["info"]: "Telemetry Notice",
  warning: "Telemetry Alert",
  error: "System Diagnostic Error",
  critical: "CRITICAL SYSTEM FAULT",
  security: "SECURITY INFRACTION (403)",
  success: "Operation Nominal",
};

export function createTelemetryEvent(
  eventInput: NotifyInput,
): TelemetryEventItem {
  const severity = eventInput.severity || "error";
  const currentUrl =
    typeof window !== "undefined" ? window.location.href : undefined;
  const currentPath =
    typeof window !== "undefined" ? window.location.pathname : undefined;

  const eventIdentifier =
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : `event-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  return {
    id: eventIdentifier,
    title: eventInput.title || DEFAULT_SEVERITY_TITLES[severity],
    message: eventInput.message,
    severity,
    timestamp: new Date(),
    errorCode: eventInput.errorCode,
    statusCode: eventInput.statusCode,
    source: eventInput.source || "application",
    stack: eventInput.stack,
    componentStack: eventInput.componentStack,
    url: eventInput.url || currentUrl,
    path: eventInput.path || currentPath,
    contextData: eventInput.contextData,
    reported: false,
  };
}

export function resolveErrorMessage(errorEntity: unknown): string {
  if (errorEntity instanceof Error) {
    return errorEntity.message;
  }
  if (typeof errorEntity === "string") {
    return errorEntity;
  }
  if (
    typeof errorEntity === "object" &&
    errorEntity !== null &&
    "message" in errorEntity
  ) {
    return String((errorEntity as { message: unknown }).message);
  }
  return "An unexpected error occurred.";
}

export function resolveErrorStack(errorEntity: unknown): string | undefined {
  if (errorEntity instanceof Error) {
    return errorEntity.stack;
  }
  return undefined;
}

export function extractErrorCode(
  errorEntity: unknown,
  overrideCode?: string,
): string | undefined {
  if (overrideCode) return overrideCode;
  if (typeof errorEntity === "object" && errorEntity !== null) {
    const candidate = errorEntity as { errorCode?: unknown; code?: unknown };
    if (typeof candidate.errorCode === "string") return candidate.errorCode;
    if (typeof candidate.code === "string") return candidate.code;
  }
  return undefined;
}

export interface ViteErrorPayload {
  err?: {
    message?: string;
    stack?: string;
    frame?: string;
    plugin?: string;
  };
}

export function resolveViteErrorDetails(payload: ViteErrorPayload): {
  message: string;
  title: string;
  stack?: string;
} {
  const err = payload.err;
  const message = err?.message || "Vite HMR compilation error";
  const title = err?.plugin
    ? `HMR Build Alert (${err.plugin})`
    : "HMR Build Alert";
  const details = [err?.frame, err?.stack].filter(Boolean).join("\n\n");

  return {
    message,
    title,
    stack: details.length > 0 ? details : undefined,
  };
}

export function createFallbackHealthReport(
  errorMessage: string,
): SystemInfrastructureHealth {
  return {
    status: "critical",
    timestamp: new Date().toISOString(),
    services: {
      d1: {
        name: "Cloudflare D1 (Database)",
        status: "offline",
        error: errorMessage,
      },
      r2: {
        name: "Cloudflare R2 (Avatars Bucket)",
        status: "offline",
        error: errorMessage,
      },
    },
  };
}

export function notifyIfServiceCritical(
  report: SystemInfrastructureHealth,
  notifyFn: (input: NotifyInput) => TelemetryEventItem,
) {
  if (!report.services) return;
  const { d1, r2 } = report.services;
  if (d1.status === "critical" || d1.status === "offline") {
    notifyFn({
      title: "Database Connectivity Alert",
      message: d1.error || d1.details || "Cloudflare D1 Database offline.",
      severity: "critical",
      source: "d1-healthcheck",
    });
  }
  if (r2.status === "critical" || r2.status === "offline") {
    notifyFn({
      title: "Storage Connectivity Alert",
      message:
        r2.error || r2.details || "Cloudflare R2 Object Storage offline.",
      severity: "critical",
      source: "r2-healthcheck",
    });
  }
}

export function calculateSystemStatus(
  eventList: TelemetryEventItem[],
  isNetworkOnline: boolean,
): SystemHealthStatus {
  if (!isNetworkOnline) return "offline";

  const hasSecurityBreach = eventList.some(
    (ev) => ev.severity === "security" || ev.statusCode === 403,
  );
  if (hasSecurityBreach) return "security_breach";

  const hasCriticalFault = eventList.some((ev) => ev.severity === "critical");
  const hasErrorFault = eventList.some((ev) => ev.severity === "error");
  if (hasCriticalFault || hasErrorFault) return "critical";

  const hasWarningFault = eventList.some((ev) => ev.severity === "warning");
  if (hasWarningFault) return "degraded";

  return "nominal";
}

export function calculateBpm(healthStatus: SystemHealthStatus): number {
  switch (healthStatus) {
    case "offline":
      return 0; // Flatline
    case "nominal":
      return 68; // Regular relaxed pulse
    case "degraded":
      return 98; // Elevated pulse
    case "security_breach":
      return 132; // Security alert pulse
    case "critical":
      return 156; // High emergency tachycardia
  }
}

export function filterTelemetryEvents(
  eventList: TelemetryEventItem[],
  filterCategory: EventFilterType,
): TelemetryEventItem[] {
  switch (filterCategory) {
    case "errors":
      return eventList.filter(
        (ev) => ev.severity === "error" || ev.severity === "critical",
      );
    case "security":
      return eventList.filter(
        (ev) => ev.severity === "security" || ev.statusCode === 403,
      );
    case "warnings":
      return eventList.filter((ev) => ev.severity === "warning");
    case "all":
    default:
      return eventList;
  }
}

export function formatDiagnosticDetails(
  eventEntry: TelemetryEventItem,
): string {
  const sections = [
    `=== TELEMETRY DIAGNOSTIC REPORT ===`,
    `ID: ${eventEntry.id}`,
    `Severity: ${eventEntry.severity.toUpperCase()}`,
    `Timestamp: ${eventEntry.timestamp.toISOString()}`,
    `Source: ${eventEntry.source || "N/A"}`,
    `HTTP Status: ${eventEntry.statusCode ?? "N/A"}`,
    `URL: ${eventEntry.url || "N/A"}`,
    `Path: ${eventEntry.path || "N/A"}`,
    `Message: ${eventEntry.message}`,
  ];

  if (eventEntry.contextData) {
    sections.push(
      `Context: ${JSON.stringify(eventEntry.contextData, null, 2)}`,
    );
  }

  if (eventEntry.stack) {
    sections.push(`Stack Trace:\n${eventEntry.stack}`);
  }

  if (eventEntry.componentStack) {
    sections.push(`Component Stack:\n${eventEntry.componentStack}`);
  }

  return sections.join("\n");
}

export const DEFAULT_STATUS_CENTER_FALLBACK: StatusCenterContextValue = {
  events: [],
  activeSnackbar: null,
  isTerminalOpen: false,
  isOnline: true,
  systemStatus: "nominal",
  bpm: 68,
  activeFilter: "all",
  infrastructureHealth: null,
  isCheckingHealth: false,
  setActiveFilter: () => {},
  notify: (eventInput) => ({
    id: "fallback-id",
    title: eventInput.title || "Telemetry Notice",
    message: eventInput.message,
    severity: eventInput.severity || "info",
    timestamp: new Date(),
  }),
  notifyError: () =>
    DEFAULT_STATUS_CENTER_FALLBACK.notify({ message: "Error fallback" }),
  notifySecurityBreach: () =>
    DEFAULT_STATUS_CENTER_FALLBACK.notify({ message: "Security fallback" }),
  notifyWarning: () =>
    DEFAULT_STATUS_CENTER_FALLBACK.notify({ message: "Warning fallback" }),
  notifyInfo: () =>
    DEFAULT_STATUS_CENTER_FALLBACK.notify({ message: "Info fallback" }),
  notifySuccess: () =>
    DEFAULT_STATUS_CENTER_FALLBACK.notify({ message: "Success fallback" }),
  dismissSnackbar: () => {},
  openTerminal: () => {},
  closeTerminal: () => {},
  toggleTerminal: () => {},
  clearItem: () => {},
  clearAll: () => {},
  reportItem: async () => null,
  checkInfrastructureHealth: async () => null,
  simulateEvent: () => {},
};
