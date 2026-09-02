export type NotificationSeverity =
  "info" | "warning" | "error" | "critical" | "security" | "success";

export type SystemHealthStatus =
  "nominal" | "degraded" | "security_breach" | "critical" | "offline";

export type EventFilterType = "all" | "errors" | "security" | "warnings";

export interface TelemetryEventItem {
  id: string;
  title: string;
  message: string;
  severity: NotificationSeverity;
  timestamp: Date;
  errorCode?: string;
  statusCode?: number;
  source?: string;
  stack?: string;
  componentStack?: string;
  url?: string;
  path?: string;
  contextData?: Record<string, unknown>;
  reported?: boolean;
}

export interface NotifyInput {
  title?: string;
  message: string;
  severity?: NotificationSeverity;
  errorCode?: string;
  statusCode?: number;
  source?: string;
  stack?: string;
  componentStack?: string;
  url?: string;
  path?: string;
  contextData?: Record<string, unknown>;
  showSnackbar?: boolean;
}

export interface ServiceHealthReport {
  name: string;
  status: SystemHealthStatus;
  latencyMs?: number;
  details?: string;
  error?: string;
}

export interface SystemInfrastructureHealth {
  status: SystemHealthStatus;
  timestamp: string;
  services: {
    d1: ServiceHealthReport;
    r2: ServiceHealthReport;
  };
}

export interface StatusCenterContextValue {
  events: TelemetryEventItem[];
  activeSnackbar: TelemetryEventItem | null;
  isTerminalOpen: boolean;
  isOnline: boolean;
  systemStatus: SystemHealthStatus;
  bpm: number;
  activeFilter: EventFilterType;
  infrastructureHealth: SystemInfrastructureHealth | null;
  isCheckingHealth: boolean;
  setActiveFilter: (filter: EventFilterType) => void;
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
  notifyInfo: (
    message: string,
    options?: Partial<NotifyInput>,
  ) => TelemetryEventItem;
  notifySuccess: (
    message: string,
    options?: Partial<NotifyInput>,
  ) => TelemetryEventItem;
  dismissSnackbar: () => void;
  openTerminal: () => void;
  closeTerminal: () => void;
  toggleTerminal: () => void;
  clearItem: (eventId: string) => void;
  clearAll: () => void;
  reportItem: (eventId: string) => Promise<{ reportId: string } | null>;
  checkInfrastructureHealth: () => Promise<SystemInfrastructureHealth | null>;
  simulateEvent: (
    type:
      | "nominal"
      | "warning"
      | "error"
      | "critical"
      | "security_403"
      | "offline"
      | "hydration",
  ) => void;
}
