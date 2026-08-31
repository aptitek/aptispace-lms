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
  SystemInfrastructureHealth,
  TelemetryEventItem,
} from "./statusCenter.types";
import {
  calculateBpm,
  calculateSystemStatus,
  createFallbackHealthReport,
  createTelemetryEvent,
  DEFAULT_STATUS_CENTER_FALLBACK,
  extractErrorCode,
  notifyIfServiceCritical,
  resolveErrorMessage,
  resolveErrorStack,
} from "./statusCenter.utils";

export * from "./statusCenter.types";
export * from "./statusCenter.utils";

const MAX_STORED_EVENTS = 100;
const SNACKBAR_AUTO_DISMISS_MS = 6000;

const StatusCenterContext = createContext<StatusCenterContextValue | null>(
  null,
);

interface ViteErrorPayload {
  err?: {
    message?: string;
    stack?: string;
    frame?: string;
    plugin?: string;
  };
}

function resolveViteErrorDetails(payload: ViteErrorPayload): {
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
  const [infrastructureHealth, setInfrastructureHealth] =
    useState<SystemInfrastructureHealth | null>(null);
  const [isCheckingHealth, setIsCheckingHealth] = useState(false);
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
      const resolvedErrorCode = extractErrorCode(
        errorEntity,
        options.errorCode,
      );

      return notify({
        title: options.title || "Diagnostic Error",
        message: options.message || messageText,
        severity: options.severity || "error",
        errorCode: resolvedErrorCode,
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
          notifySuccess("API Gateway synchronization verified.");
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

  const checkInfrastructureHealth =
    useCallback(async (): Promise<SystemInfrastructureHealth | null> => {
      if (typeof fetch === "undefined") return null;
      setIsCheckingHealth(true);
      try {
        const response = await fetch("/api/health", { cache: "no-store" });
        const healthPayload =
          (await response.json()) as SystemInfrastructureHealth;
        setInfrastructureHealth(healthPayload);
        notifyIfServiceCritical(healthPayload, notify);
        return healthPayload;
      } catch (checkError) {
        const failureMessage =
          checkError instanceof Error
            ? checkError.message
            : "Health check failed";
        const fallback = createFallbackHealthReport(failureMessage);
        setInfrastructureHealth(fallback);
        return fallback;
      } finally {
        setIsCheckingHealth(false);
      }
    }, [notify]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      void checkInfrastructureHealth();
    }
  }, [checkInfrastructureHealth]);

  useEffect(() => {
    if (isTerminalOpen) {
      void checkInfrastructureHealth();
    }
  }, [isTerminalOpen, checkInfrastructureHealth]);

  const systemStatus = useMemo(
    () => calculateSystemStatus(events, isOnline),
    [events, isOnline],
  );

  const bpm = useMemo(() => calculateBpm(systemStatus), [systemStatus]);

  useEffect(() => {
    if (typeof window === "undefined" || !import.meta.hot) return;

    const handleViteError = (payload: ViteErrorPayload) => {
      const details = resolveViteErrorDetails(payload);
      notifyError(new Error(details.message), {
        title: details.title,
        source: "vite.hmr",
        stack: details.stack,
        severity: "error",
        showSnackbar: true,
      });
    };

    import.meta.hot.on("vite:error", handleViteError);
  }, [notifyError]);

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

      notifyError(event.error || new Error(event.message), {
        source: "window.onerror",
        url: event.filename,
      });
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      notifyError(event.reason || new Error("Unhandled Promise Rejection"), {
        source: "unhandledrejection",
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
  }, [notify, notifyError, notifySuccess]);

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
      infrastructureHealth,
      isCheckingHealth,
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
      checkInfrastructureHealth,
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
      infrastructureHealth,
      isCheckingHealth,
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
      checkInfrastructureHealth,
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
  if (!context) {
    return DEFAULT_STATUS_CENTER_FALLBACK;
  }
  return context;
}
