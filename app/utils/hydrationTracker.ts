export interface HydrationErrorDetail {
  error: unknown;
  message: string;
  componentStack?: string;
  contextData?: Record<string, unknown>;
  timestamp: Date;
}

export const HYDRATION_EVENT_NAME = "aptispace:hydration-error";

declare global {
  interface Window {
    __APTISPACE_HYDRATION_QUEUE__?: HydrationErrorDetail[];
    __APTISPACE_LAST_HYDRATION_HASH__?: string;
    __APTISPACE_LAST_HYDRATION_TIME__?: number;
  }
}

/**
 * Checks if an error or message corresponds to a React SSR / Client hydration mismatch.
 */
export function isHydrationError(
  errorCandidate: unknown,
  messageOverride?: string,
): boolean {
  const msg = (
    messageOverride ||
    (errorCandidate instanceof Error
      ? errorCandidate.message
      : String(errorCandidate || ""))
  ).toLowerCase();

  const hydrationSignatures = [
    "hydration failed",
    "did not match",
    "didn't match",
    "server-rendered html",
    "server rendered html",
    "text content does not match",
    "expected server html to contain",
    "minified react error #418",
    "minified react error #421",
    "minified react error #422",
    "minified react error #423",
    "minified react error #425",
    "react.dev/link/hydration-mismatch",
    "error while hydrating",
    "during hydration",
  ];

  return hydrationSignatures.some((sig) => msg.includes(sig));
}

/**
 * Normalizes error messages and extracts documentation links or context.
 */
export function parseHydrationErrorDetails(
  error: unknown,
  errorInfo?: { componentStack?: string },
): {
  message: string;
  componentStack?: string;
  contextData?: Record<string, unknown>;
} {
  const rawMessage =
    error instanceof Error
      ? error.message
      : typeof error === "string"
        ? error
        : "React hydration mismatch detected between SSR markup and client virtual DOM.";

  const componentStack =
    errorInfo?.componentStack ||
    (typeof error === "object" && error !== null && "componentStack" in error
      ? String((error as { componentStack: unknown }).componentStack)
      : undefined);

  return {
    message: rawMessage,
    componentStack,
    contextData: {
      type: "hydration_mismatch",
      documentationUrl: "https://react.dev/link/hydration-mismatch",
      environment: typeof window !== "undefined" ? "browser-client" : "ssr",
    },
  };
}

/**
 * Global dispatcher to queue and emit hydration errors for the Status Center.
 */
export function recordHydrationError(
  error: unknown,
  errorInfo?: { componentStack?: string },
): void {
  const parsed = parseHydrationErrorDetails(error, errorInfo);
  const detail: HydrationErrorDetail = {
    error: error instanceof Error ? error : new Error(parsed.message),
    message: parsed.message,
    componentStack: parsed.componentStack,
    contextData: parsed.contextData,
    timestamp: new Date(),
  };

  if (typeof window === "undefined") {
    return;
  }

  // Deduplicate errors within 2 seconds
  const now = Date.now();
  const errorKey = `${parsed.message.slice(0, 100)}_${parsed.componentStack?.slice(0, 100) || ""}`;
  if (
    window.__APTISPACE_LAST_HYDRATION_HASH__ === errorKey &&
    now - (window.__APTISPACE_LAST_HYDRATION_TIME__ || 0) < 2000
  ) {
    return;
  }
  window.__APTISPACE_LAST_HYDRATION_HASH__ = errorKey;
  window.__APTISPACE_LAST_HYDRATION_TIME__ = now;

  if (!window.__APTISPACE_HYDRATION_QUEUE__) {
    window.__APTISPACE_HYDRATION_QUEUE__ = [];
  }
  window.__APTISPACE_HYDRATION_QUEUE__.push(detail);

  window.dispatchEvent(
    new CustomEvent<HydrationErrorDetail>(HYDRATION_EVENT_NAME, {
      detail,
    }),
  );
}

/**
 * Subscribes to hydration errors, instantly flushing any pre-queued events.
 */
export function subscribeHydrationErrors(
  callback: (detail: HydrationErrorDetail) => void,
): () => void {
  if (typeof window === "undefined") {
    return () => {};
  }

  // Flush already queued hydration errors
  if (
    window.__APTISPACE_HYDRATION_QUEUE__ &&
    window.__APTISPACE_HYDRATION_QUEUE__.length > 0
  ) {
    const queued = [...window.__APTISPACE_HYDRATION_QUEUE__];
    window.__APTISPACE_HYDRATION_QUEUE__ = [];
    queued.forEach((errorEntry) => callback(errorEntry));
  }

  const handleCustomEvent = (event: Event) => {
    const customEvent = event as CustomEvent<HydrationErrorDetail>;
    if (customEvent.detail) {
      callback(customEvent.detail);
    }
  };

  window.addEventListener(HYDRATION_EVENT_NAME, handleCustomEvent);
  return () => {
    window.removeEventListener(HYDRATION_EVENT_NAME, handleCustomEvent);
  };
}
