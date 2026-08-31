import { describe, it, expect, vi } from "vitest";
import { handleError } from "./entry.server";

describe("Server Entrypoint Error Handling", () => {
  it("filters 404 No route matches URL as warning instead of error stack dump", () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const notFoundError = new Error(
      'Error: No route matches URL "/avatars/unknown.webp"',
    );
    const request = new Request("http://localhost/avatars/unknown.webp", {
      method: "GET",
    });

    handleError(notFoundError, { request });

    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining("[Router 404]"),
    );
    expect(errorSpy).not.toHaveBeenCalled();

    warnSpy.mockRestore();
    errorSpy.mockRestore();
  });

  it("logs standard server 500 errors with full diagnostic context", () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const runtimeError = new Error("Database connection dropped unexpectedly");
    const request = new Request("http://localhost/api/courses", {
      method: "POST",
    });

    handleError(runtimeError, { request });

    expect(errorSpy).toHaveBeenCalledWith(
      expect.stringContaining("[Server Error]"),
      expect.any(String),
    );

    errorSpy.mockRestore();
  });

  it("ignores aborted client requests", () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const controller = new AbortController();
    controller.abort();

    const request = new Request("http://localhost/api/courses", {
      signal: controller.signal,
    });

    handleError(new Error("aborted request"), { request });

    expect(errorSpy).not.toHaveBeenCalled();

    errorSpy.mockRestore();
  });
});
