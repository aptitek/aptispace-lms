import type {
  EventFilterType,
  NotificationSeverity,
  NotifyInput,
  StatusCenterContextValue,
  SystemHealthStatus,
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
  simulateEvent: () => {},
};
