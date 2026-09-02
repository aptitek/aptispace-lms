import { useEffect } from "react";
import type { NotifyInput, TelemetryEventItem } from "./statusCenter.types";
import {
  resolveViteErrorDetails,
  type ViteErrorPayload,
} from "./statusCenter.utils";
import {
  isHydrationError,
  recordHydrationError,
  subscribeHydrationErrors,
} from "./hydrationTracker";

interface StatusCenterListenersProps {
  notify: (input: NotifyInput) => TelemetryEventItem;
  notifyError: (
    error: unknown,
    options?: Partial<NotifyInput>,
  ) => TelemetryEventItem;
  notifySuccess: (
    message: string,
    options?: Partial<NotifyInput>,
  ) => TelemetryEventItem;
  setIsOnline: (online: boolean) => void;
}

export function useStatusCenterListeners({
  notify,
  notifyError,
  notifySuccess,
  setIsOnline,
}: StatusCenterListenersProps) {
  useEffect(() => {
    const unsubscribe = subscribeHydrationErrors((detail) => {
      notifyError(detail.error, {
        title: "HYDRATION MISMATCH DETECTED",
        message: detail.message,
        severity: "error",
        source: "react.hydration",
        componentStack: detail.componentStack,
        contextData: detail.contextData,
        showSnackbar: true,
      });
    });

    return unsubscribe;
  }, [notifyError]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const originalConsoleError = console.error;
    console.error = (...args: unknown[]) => {
      originalConsoleError.apply(console, args);

      const firstArg = args[0];
      const fullLogText = args
        .map((a) =>
          typeof a === "string" ? a : a instanceof Error ? a.message : "",
        )
        .join(" ");

      if (isHydrationError(firstArg, fullLogText)) {
        const componentStackArg = args.find(
          (a) => typeof a === "string" && a.includes("in ") && a.includes("\n"),
        );
        recordHydrationError(
          firstArg instanceof Error ? firstArg : new Error(fullLogText),
          {
            componentStack:
              typeof componentStackArg === "string"
                ? componentStackArg
                : undefined,
          },
        );
      }
    };

    return () => {
      console.error = originalConsoleError;
    };
  }, []);

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

      const isHydration = isHydrationError(event.error, event.message);

      notifyError(event.error || new Error(event.message), {
        title: isHydration ? "HYDRATION MISMATCH DETECTED" : undefined,
        source: isHydration ? "react.hydration" : "window.onerror",
        url: event.filename,
      });
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const isHydration = isHydrationError(event.reason);
      notifyError(event.reason || new Error("Unhandled Promise Rejection"), {
        title: isHydration ? "HYDRATION MISMATCH DETECTED" : undefined,
        source: isHydration ? "react.hydration" : "unhandledrejection",
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
  }, [notify, notifyError, notifySuccess, setIsOnline]);
}
