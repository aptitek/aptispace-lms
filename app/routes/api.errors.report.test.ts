import { describe, it, expect } from "vitest";
import { action } from "./api.errors.report";

function makeActionArgs(request: Request, customContext: unknown = {}) {
  return {
    request,
    params: {},
    context: customContext,
    url: new URL(request.url),
    pattern: "",
  } as unknown as Parameters<typeof action>[0];
}

describe("API Error Reporting Route (POST /api/errors/report)", () => {
  it("rejects non-POST requests with 405 Method Not Allowed", async () => {
    const request = new Request("http://localhost/api/errors/report", {
      method: "GET",
    });

    const response = await action(makeActionArgs(request));
    expect(response.status).toBe(405);
    const resultPayload = (await response.json()) as { error: string };
    expect(resultPayload.error).toContain("Method not allowed");
  });

  it("returns 400 if message is missing or empty", async () => {
    const request = new Request("http://localhost/api/errors/report", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        stack: "some stack",
        severity: "error",
      }),
    });

    const response = await action(makeActionArgs(request));
    expect(response.status).toBe(400);
    const data = (await response.json()) as { error: string };
    expect(data.error).toContain("message");
  });

  it("successfully creates a diagnostic report in JSON mode", async () => {
    const request = new Request("http://localhost/api/errors/report", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "user-agent": "Mozilla/5.0 TestBrowser",
        "cf-connecting-ip": "198.51.100.42",
      },
      body: JSON.stringify({
        message: "Failed to load telemetry resource",
        stack: "Error: Failed to load\n    at test.ts:12:4",
        severity: "error",
        source: "unit-test",
        url: "http://localhost/test",
      }),
    });

    const response = await action(makeActionArgs(request));
    expect(response.status).toBe(201);
    const data = (await response.json()) as {
      success: boolean;
      reportId: string;
      message: string;
    };
    expect(data.success).toBe(true);
    expect(typeof data.reportId).toBe("string");
    expect(data.reportId.length).toBeGreaterThan(5);
  });

  it("successfully processes 403 security infraction report", async () => {
    const request = new Request("http://localhost/api/errors/report", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-forwarded-for": "203.0.113.195",
      },
      body: JSON.stringify({
        message: "Forbidden access attempt to /api/admin/override",
        severity: "security",
        statusCode: 403,
        source: "auth_guard",
        contextData: { attemptedEndpoint: "/api/admin/override" },
      }),
    });

    const response = await action(makeActionArgs(request));
    expect(response.status).toBe(201);
    const data = (await response.json()) as {
      success: boolean;
      reportId: string;
    };
    expect(data.success).toBe(true);
    expect(data.reportId).toBeDefined();
  });

  it("processes formData submissions as well", async () => {
    const formData = new FormData();
    formData.append("message", "Form error report");
    formData.append("severity", "warning");
    formData.append("source", "form-submit");

    const request = new Request("http://localhost/api/errors/report", {
      method: "POST",
      body: formData,
    });

    const response = await action(makeActionArgs(request));
    expect(response.status).toBe(201);
    const data = (await response.json()) as { success: boolean };
    expect(data.success).toBe(true);
  });

  it("inserts report into database when D1 is available in context", async () => {
    let executedQuery = false;
    const mockD1 = {
      prepare: () => ({
        bind: () => ({
          run: async () => {
            executedQuery = true;
            return { results: [], success: true, meta: { changes: 1 } };
          },
          all: async () => ({ results: [], success: true, meta: {} }),
          first: async () => null,
          raw: async () => [],
        }),
        run: async () => {
          executedQuery = true;
          return { results: [], success: true, meta: { changes: 1 } };
        },
        all: async () => ({ results: [], success: true, meta: {} }),
        first: async () => null,
        raw: async () => [],
      }),
      dump: async () => new ArrayBuffer(0),
      batch: async () => [],
      exec: async () => ({ count: 0, duration: 0 }),
    };

    const mockContext = {
      cloudflare: {
        env: {
          DB: mockD1,
        },
      },
    };

    const request = new Request("http://localhost/api/errors/report", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: "DB test message",
        severity: "critical",
      }),
    });

    const response = await action(makeActionArgs(request, mockContext));
    expect(response.status).toBe(201);
    const data = (await response.json()) as { success: boolean };
    expect(data.success).toBe(true);
    expect(executedQuery).toBe(true);
  });
});
