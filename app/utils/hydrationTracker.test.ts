import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  isHydrationError,
  parseHydrationErrorDetails,
  recordHydrationError,
  subscribeHydrationErrors,
} from "./hydrationTracker";

type ListenerFn = (event: unknown) => void;

function createMockWindow(listeners: Record<string, ListenerFn[]>) {
  return {
    addEventListener(event: string, handler: ListenerFn) {
      if (!listeners[event]) listeners[event] = [];
      listeners[event].push(handler);
    },
    removeEventListener(event: string, handler: ListenerFn) {
      if (!listeners[event]) return;
      const index = listeners[event].indexOf(handler);
      if (index !== -1) {
        listeners[event].splice(index, 1);
      }
    },
    dispatchEvent(event: { detail?: unknown }) {
      const eventListeners = listeners["aptispace:hydration-error"];
      if (!eventListeners) return true;
      for (const handler of eventListeners) {
        handler(event);
      }
      return true;
    },
  };
}

describe("hydrationTracker error detection", () => {
  it("detects React hydration mismatch error strings", () => {
    expect(
      isHydrationError(
        new Error(
          "Hydration failed because the server rendered HTML didn't match the client.",
        ),
      ),
    ).toBe(true);

    expect(
      isHydrationError(
        "Warning: Text content did not match. Server: 'EN' Client: 'FR'",
      ),
    ).toBe(true);

    expect(
      isHydrationError(
        "Minified React error #418; visit https://react.dev/errors/418",
      ),
    ).toBe(true);

    expect(
      isHydrationError(
        "Minified React error #425; visit https://react.dev/errors/425",
      ),
    ).toBe(true);

    expect(
      isHydrationError(
        "An error occurred during hydration mismatch at https://react.dev/link/hydration-mismatch",
      ),
    ).toBe(true);
  });

  it("returns false for regular non-hydration errors", () => {
    expect(isHydrationError(new Error("Network timeout (504)"))).toBe(false);
    expect(isHydrationError("Failed to fetch /api/users")).toBe(false);
    expect(
      isHydrationError(new TypeError("Cannot read properties of null")),
    ).toBe(false);
  });
});

describe("hydrationTracker details parser", () => {
  it("extracts message, componentStack, and contextData", () => {
    const error = new Error("Hydration failed mismatch");
    const errorInfo = {
      componentStack: "\n    in ShapeDefs\n    in AppThemeContainer",
    };

    const result = parseHydrationErrorDetails(error, errorInfo);

    expect(result.message).toBe("Hydration failed mismatch");
    expect(result.componentStack).toContain("in ShapeDefs");
    expect(result.contextData?.type).toBe("hydration_mismatch");
    expect(result.contextData?.documentationUrl).toBe(
      "https://react.dev/link/hydration-mismatch",
    );
  });
});

describe("hydrationTracker subscription and dispatch", () => {
  const listeners: Record<string, ListenerFn[]> = {};

  beforeEach(() => {
    listeners["aptispace:hydration-error"] = [];
    const mockWindow = createMockWindow(listeners);

    vi.stubGlobal("window", mockWindow);
    vi.stubGlobal(
      "CustomEvent",
      class CustomEventMock {
        type: string;
        detail: unknown;
        constructor(type: string, params?: { detail?: unknown }) {
          this.type = type;
          this.detail = params?.detail;
        }
      },
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("notifies active subscribers when a hydration error is recorded", () => {
    const listener = vi.fn();
    const unsubscribe = subscribeHydrationErrors(listener);

    recordHydrationError(new Error("Hydration failed test"), {
      componentStack: "\n    in Header",
    });

    expect(listener).toHaveBeenCalledTimes(1);
    const detail = listener.mock.calls[0][0];
    expect(detail.message).toBe("Hydration failed test");
    expect(detail.componentStack).toContain("in Header");

    unsubscribe();
  });

  it("flushes pre-queued errors when a subscriber mounts later", () => {
    recordHydrationError(new Error("Early SSR hydration error"));

    const lateSubscriber = vi.fn();
    const unsubscribe = subscribeHydrationErrors(lateSubscriber);

    expect(lateSubscriber).toHaveBeenCalledTimes(1);
    expect(lateSubscriber.mock.calls[0][0].message).toBe(
      "Early SSR hydration error",
    );

    unsubscribe();
  });

  it("deduplicates identical hydration errors fired within a short duration", () => {
    const listener = vi.fn();
    const unsubscribe = subscribeHydrationErrors(listener);

    const err = new Error("Duplicate hydration error");
    recordHydrationError(err);
    recordHydrationError(err);

    expect(listener).toHaveBeenCalledTimes(1);

    unsubscribe();
  });
});
