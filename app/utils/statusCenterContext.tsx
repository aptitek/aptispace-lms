import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type {
  EventFilterType,
  NotifyInput,
  StatusCenterContextValue,
  TelemetryEventItem,
} from "./statusCenter.types";
import {
  calculateBpm,
  calculateSystemStatus,
  createTelemetryEvent,
  DEFAULT_STATUS_CENTER_FALLBACK,
} from "./statusCenter.utils";

export * from "./statusCenter.types";
export * from "./statusCenter.utils";

const MAX_STORED_EVENTS = 100;
const SNACKBAR_AUTO_DISMISS_MS = 6000;

const StatusCenterContext = createContext<StatusCenterContextValue | null>(
  null,
);

function resolveErrorMessage(errorEntity: unknown): string {
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

function resolveErrorStack(errorEntity: unknown): string | undefined {
  if (errorEntity instanceof Error) {
    return errorEntity.stack;
  }
  return undefined;
}

export function StatusCenterProvider({
  children,
  initialEvents = [],
  initialOnline = true,
}: {
  children: React.ReactNode;
  initialEvents?: TelemetryEventItem[];
  initialOnline?: boolean;
}) {
  const [events, setEvents] = useState<TelemetryEventItem[]>(initialEvents);
  const [activeSnackbar, setActiveSnackbar] =
    useState<TelemetryEventItem | null>(null);
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [isOnline, setIsOnline] = useState<boolean>(() => {
    if (
      typeof navigator !== "undefined" &&
      typeof navigator.onLine === "boolean"
    ) {
      return navigator.onLine;
    }
    return initialOnline;
  });
  const [activeFilter, setActiveFilter] = useState<EventFilterType>("all");

  const dismissSnackbar = useCallback(() => {
    setActiveSnackbar(null);
  }, []);

  const notify = useCallback((eventInput: NotifyInput): TelemetryEventItem => {
    const newEvent = createTelemetryEvent(eventInput);

    setEvents((prev) => [newEvent, ...prev.slice(0, MAX_STORED_EVENTS - 1)]);

    if (eventInput.showSnackbar !== false) {
      setActiveSnackbar(newEvent);
    }

    return newEvent;
  }, []);

  const notifyError = useCallback(
    (errorEntity: unknown, options: Partial<NotifyInput> = {}) => {
      const messageText = resolveErrorMessage(errorEntity);
      const stackTrace = resolveErrorStack(errorEntity);

      return notify({
        title: options.title || "Diagnostic Error",
        message: options.message || messageText,
        severity: options.severity || "error",
        statusCode: options.statusCode,
        source: options.source || "application",
        stack: options.stack || stackTrace,
        componentStack: options.componentStack,
        url: options.url,
        path: options.path,
        contextData: options.contextData,
        showSnackbar: options.showSnackbar ?? true,
      });
    },
    [notify],
  );

  const notifySecurityBreach = useCallback(
    (
      message = "Access Forbidden: 403 Security Infraction",
      options: Partial<NotifyInput> = {},
    ) => {
      return notify({
        title: options.title || "SECURITY INFRACTION (403)",
        message,
        severity: "security",
        statusCode: 403,
        source: options.source || "authorization-guard",
        ...options,
        showSnackbar: options.showSnackbar ?? true,
      });
    },
    [notify],
  );

  const notifyWarning = useCallback(
    (message: string, options: Partial<NotifyInput> = {}) => {
      return notify({
        title: options.title || "Telemetry Warning",
        message,
        severity: "warning",
        ...options,
        showSnackbar: options.showSnackbar ?? true,
      });
    },
    [notify],
  );

  const notifyInfo = useCallback(
    (message: string, options: Partial<NotifyInput> = {}) => {
      return notify({
        title: options.title || "Telemetry Notice",
        message,
        severity: "info",
        ...options,
        showSnackbar: options.showSnackbar ?? true,
      });
    },
    [notify],
  );

  const notifySuccess = useCallback(
    (message: string, options: Partial<NotifyInput> = {}) => {
      return notify({
        title: options.title || "System Nominal",
        message,
        severity: "success",
        ...options,
        showSnackbar: options.showSnackbar ?? true,
      });
    },
    [notify],
  );

  const openTerminal = useCallback(() => setIsTerminalOpen(true), []);
  const closeTerminal = useCallback(() => setIsTerminalOpen(false), []);
  const toggleTerminal = useCallback(
    () => setIsTerminalOpen((prev) => !prev),
    [],
  );

  const clearItem = useCallback((eventId: string) => {
    setEvents((prev) => prev.filter((ev) => ev.id !== eventId));
    setActiveSnackbar((prev) => (prev?.id === eventId ? null : prev));
  }, []);

  const clearAll = useCallback(() => {
    setEvents([]);
    setActiveSnackbar(null);
  }, []);

  const reportItem = useCallback(
    async (eventId: string): Promise<{ reportId: string } | null> => {
      const targetEvent = events.find((ev) => ev.id === eventId);
      if (!targetEvent) return null;

      try {
        const response = await fetch("/api/errors/report", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: targetEvent.message,
            stack: targetEvent.stack,
            severity: targetEvent.severity,
            statusCode: targetEvent.statusCode,
            source: targetEvent.source,
            url: targetEvent.url,
            path: targetEvent.path,
            contextData: targetEvent.contextData,
          }),
        });

        if (!response.ok) {
          throw new Error(
            `Report submission failed with status ${response.status}`,
          );
        }

        const payloadResult = (await response.json()) as { reportId: string };

        setEvents((prev) =>
          prev.map((ev) =>
            ev.id === eventId ? { ...ev, reported: true } : ev,
          ),
        );

        notifySuccess(
          `Telemetry report ${payloadResult.reportId.slice(0, 8)} submitted to mission control.`,
        );
        return payloadResult;
      } catch (submissionError) {
        const failureMessage =
          submissionError instanceof Error
            ? submissionError.message
            : "Network error";
        notifyError(
          new Error(`Failed to transmit error report: ${failureMessage}`),
          { showSnackbar: true },
        );
        return null;
      }
    },
    [events, notifyError, notifySuccess],
  );

  const simulateEvent = useCallback(
    (
      simulationType:
        | "nominal"
        | "warning"
        | "error"
        | "critical"
        | "security_403"
        | "offline",
    ) => {
      switch (simulationType) {
        case "nominal":
          notifySuccess("Orbital Gateway carrier synchronization verified.");
          break;
        case "warning":
          notifyWarning(
            "Gateway node latency elevated to 240ms. Minor packet jitter.",
          );
          break;
        case "error":
          notifyError(
            new Error("Diagnostic runtime exception: D1 query timeout"),
          );
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
      }
    },
    [notify, notifyError, notifySecurityBreach, notifySuccess, notifyWarning],
  );

  const systemStatus = useMemo(
    () => calculateSystemStatus(events, isOnline),
    [events, isOnline],
  );

  const bpm = useMemo(() => calculateBpm(systemStatus), [systemStatus]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleOnline = () => {
      setIsOnline(true);
      notifySuccess("Station gateway link restored. System telemetry online.");
    };

    const handleOffline = () => {
      setIsOnline(false);
      notify({
        title: "GATEWAY CARRIER LOST",
        message:
          "Network link disconnected. Flatline telemetry mode activated.",
        severity: "critical",
        source: "carrier-detect",
      });
    };

    const handleError = (event: ErrorEvent) => {
      if (
        event.message?.includes("ResizeObserver loop") ||
        event.message?.includes("Script error.")
      ) {
        return;
      }

      notify({
        title: "Runtime Diagnostic Error",
        message: event.message || "Uncaught window runtime exception",
        severity: "error",
        source: "window.onerror",
        stack: event.error?.stack,
        url: event.filename,
      });
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      let rejectionMessage = "Unhandled asynchronous promise rejection";
      let stackTrace: string | undefined;

      if (event.reason instanceof Error) {
        rejectionMessage = event.reason.message;
        stackTrace = event.reason.stack;
      } else if (typeof event.reason === "string") {
        rejectionMessage = event.reason;
      }

      notify({
        title: "Unhandled Asynchronous Exception",
        message: rejectionMessage,
        severity: "error",
        source: "unhandledrejection",
        stack: stackTrace,
      });
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    window.addEventListener("error", handleError);
    window.addEventListener("unhandledrejection", handleUnhandledRejection);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("error", handleError);
      window.removeEventListener(
        "unhandledrejection",
        handleUnhandledRejection,
      );
    };
  }, [notify, notifySuccess]);

  useEffect(() => {
    if (!activeSnackbar) return;

    const timer = setTimeout(() => {
      setActiveSnackbar(null);
    }, SNACKBAR_AUTO_DISMISS_MS);

    return () => clearTimeout(timer);
  }, [activeSnackbar]);

  const contextValue = useMemo<StatusCenterContextValue>(
    () => ({
      events,
      activeSnackbar,
      isTerminalOpen,
      isOnline,
      systemStatus,
      bpm,
      activeFilter,
      setActiveFilter,
      notify,
      notifyError,
      notifySecurityBreach,
      notifyWarning,
      notifyInfo,
      notifySuccess,
      dismissSnackbar,
      openTerminal,
      closeTerminal,
      toggleTerminal,
      clearItem,
      clearAll,
      reportItem,
      simulateEvent,
    }),
    [
      events,
      activeSnackbar,
      isTerminalOpen,
      isOnline,
      systemStatus,
      bpm,
      activeFilter,
      notify,
      notifyError,
      notifySecurityBreach,
      notifyWarning,
      notifyInfo,
      notifySuccess,
      dismissSnackbar,
      openTerminal,
      closeTerminal,
      toggleTerminal,
      clearItem,
      clearAll,
      reportItem,
      simulateEvent,
    ],
  );

  return (
    <StatusCenterContext.Provider value={contextValue}>
      {children}
    </StatusCenterContext.Provider>
  );
}

export function useStatusCenter(): StatusCenterContextValue {
  const context = useContext(StatusCenterContext);
  return context || DEFAULT_STATUS_CENTER_FALLBACK;
}
