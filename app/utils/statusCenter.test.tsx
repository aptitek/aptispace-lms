import { describe, it, expect } from "vitest";
import {
  calculateSystemStatus,
  calculateBpm,
  createTelemetryEvent,
  DEFAULT_SEVERITY_TITLES,
  DEFAULT_STATUS_CENTER_FALLBACK,
  StatusCenterProvider,
  useStatusCenter,
  isHydrationError,
  recordHydrationError,
  type TelemetryEventItem,
} from "./statusCenterContext";

describe("StatusCenter Pure Calculations & Telemetry Functions", () => {
  it("exports Provider, hook and helper functions", () => {
    expect(StatusCenterProvider).toBeDefined();
    expect(useStatusCenter).toBeDefined();
    expect(calculateSystemStatus).toBeDefined();
    expect(calculateBpm).toBeDefined();
    expect(createTelemetryEvent).toBeDefined();
    expect(DEFAULT_SEVERITY_TITLES).toBeDefined();
  });

  it("calculates nominal health and resting 68 BPM when 0 errors exist and online", () => {
    const status = calculateSystemStatus([], true);
    expect(status).toBe("nominal");
    expect(calculateBpm(status)).toBe(68);
  });

  it("calculates degraded health and 98 BPM when warnings exist", () => {
    const warningEvent: TelemetryEventItem = {
      id: "w-1",
      title: "Gateway Latency",
      message: "High latency on orbital gateway node (240ms)",
      severity: "warning",
      timestamp: new Date(),
    };

    const status = calculateSystemStatus([warningEvent], true);
    expect(status).toBe("degraded");
    expect(calculateBpm(status)).toBe(98);
  });

  it("calculates security_breach health and 132 BPM when 403 infraction exists", () => {
    const secEvent: TelemetryEventItem = {
      id: "s-1",
      title: "Security Infraction (403 Forbidden)",
      message: "Unauthorized attempt to access /api/admin/override",
      severity: "security",
      statusCode: 403,
      timestamp: new Date(),
    };

    const status = calculateSystemStatus([secEvent], true);
    expect(status).toBe("security_breach");
    expect(calculateBpm(status)).toBe(132);
  });

  it("calculates critical health and 156 BPM when errors exist", () => {
    const errEvent: TelemetryEventItem = {
      id: "e-1",
      title: "Diagnostic Exception",
      message: "SQLite D1 database constraint violation",
      severity: "error",
      statusCode: 500,
      timestamp: new Date(),
    };

    const status = calculateSystemStatus([errEvent], true);
    expect(status).toBe("critical");
    expect(calculateBpm(status)).toBe(156);
  });

  it("calculates offline health and 0 BPM flatline when connection is lost", () => {
    const status = calculateSystemStatus([], false);
    expect(status).toBe("offline");
    expect(calculateBpm(status)).toBe(0);
  });

  it("creates telemetry event with default severity titles and generated id", () => {
    const event = createTelemetryEvent({
      message: "Test message",
      severity: "warning",
      errorCode: "DATABASE_ERROR",
    });

    expect(event.id).toBeDefined();
    expect(event.title).toBe("Telemetry Alert");
    expect(event.message).toBe("Test message");
    expect(event.severity).toBe("warning");
    expect(event.errorCode).toBe("DATABASE_ERROR");
    expect(event.timestamp instanceof Date).toBe(true);
    expect(event.reported).toBe(false);
  });

  it("provides safe fallback defaults in DEFAULT_STATUS_CENTER_FALLBACK", () => {
    expect(DEFAULT_STATUS_CENTER_FALLBACK).toBeDefined();
    expect(DEFAULT_STATUS_CENTER_FALLBACK.systemStatus).toBe("nominal");
    expect(DEFAULT_STATUS_CENTER_FALLBACK.bpm).toBe(68);
    expect(DEFAULT_STATUS_CENTER_FALLBACK.isOnline).toBe(true);
    expect(DEFAULT_STATUS_CENTER_FALLBACK.events).toEqual([]);
    expect(DEFAULT_STATUS_CENTER_FALLBACK.isTerminalOpen).toBe(false);
  });

  it("exports hydration tracker utilities through statusCenterContext", () => {
    expect(typeof isHydrationError).toBe("function");
    expect(typeof recordHydrationError).toBe("function");
  });
});
