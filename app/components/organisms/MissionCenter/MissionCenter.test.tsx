import { describe, it, expect, vi } from "vitest";
import React from "react";
import MissionCenter from "./MissionCenter";
import { MissionCenterKpiCards } from "./MissionCenterKpiCards";
import { MissionCenterAuditTab } from "./MissionCenterAuditTab";
import { MissionCenterErrorsTab } from "./MissionCenterErrorsTab";
import { MissionCenterSecurityTab } from "./MissionCenterSecurityTab";
import { MissionCenterMetricsTab } from "./MissionCenterMetricsTab";
import { MissionCenterUserProfileCard } from "./MissionCenterUserProfileCard";
import type { MissionCenterData } from "~/types/missionCenter";

const mockMissionData: MissionCenterData = {
  auditLogs: [
    {
      id: "aud-1",
      tableName: "users",
      recordId: "usr-1",
      action: "UPDATE",
      userId: "admin-1",
      actor: {
        id: "admin-1",
        firstName: "System",
        familyName: "ADMIN",
        email: "admin@aptitek.io",
        role: "admin",
      },
      oldValues: JSON.stringify({ role: "student" }),
      newValues: JSON.stringify({ role: "instructor" }),
      createdAt: new Date().toISOString(),
    },
  ],
  errorReports: [
    {
      id: "err-1",
      message: "403 Forbidden on /api/admin/system",
      stack: "Error: 403 Forbidden\n    at authGuard",
      severity: "security",
      statusCode: 403,
      source: "server",
      url: "https://lms.aptitek.io/api/admin/system",
      path: "/api/admin/system",
      ipAddress: "192.168.1.50",
      userAgent: "Mozilla/5.0 TestBrowser",
      contextData: JSON.stringify({ route: "/api/admin/system" }),
      userId: "std-42",
      user: {
        id: "std-42",
        firstName: "Bad",
        familyName: "ACTOR",
        email: "bad.actor@example.com",
        role: "student",
      },
      status: "open",
      createdAt: new Date().toISOString(),
    },
  ],
  securityIncidents: [
    {
      id: "sec-1",
      type: "403_forbidden",
      title: "403 Forbidden Access Attempt",
      description: "Access denied on administrative endpoint",
      severity: "security",
      ipAddress: "192.168.1.50",
      userAgent: "Mozilla/5.0 TestBrowser",
      timestamp: new Date().toISOString(),
      userId: "std-42",
      user: {
        id: "std-42",
        firstName: "Bad",
        familyName: "ACTOR",
        email: "bad.actor@example.com",
        role: "student",
      },
    },
  ],
  metrics: {
    infrastructure: {
      status: "nominal",
      timestamp: new Date().toISOString(),
      d1: {
        name: "Cloudflare D1",
        status: "nominal",
        latencyMs: 12,
      },
      r2: {
        name: "Cloudflare R2",
        status: "nominal",
        latencyMs: 45,
      },
      environment: "Cloudflare Workers",
    },
    counts: {
      totalUsers: 20,
      students: 15,
      instructors: 3,
      admins: 2,
      institutions: 2,
      cohorts: 4,
      courses: 2,
      modules: 6,
      submissions: 10,
      grades: 10,
      auditLogs: 1,
      totalErrors: 1,
      openErrors: 1,
      criticalErrors: 0,
      securityIncidents: 1,
    },
    tableInventory: [
      { tableName: "users", rowCount: 20 },
      { tableName: "cohorts", rowCount: 4 },
      { tableName: "institutions", rowCount: 2 },
    ],
  },
  openIssuesCount: 1,
};

describe("MissionCenter Organism", () => {
  it("renders MissionCenter main cockpit component", () => {
    const el = React.createElement(MissionCenter, {
      missionData: mockMissionData,
    });
    expect(el).toBeDefined();
  });

  it("renders MissionCenterKpiCards component", () => {
    const el = React.createElement(MissionCenterKpiCards, {
      metrics: mockMissionData.metrics,
    });
    expect(el).toBeDefined();
  });

  it("renders MissionCenterAuditTab component", () => {
    const el = React.createElement(MissionCenterAuditTab, {
      auditLogs: mockMissionData.auditLogs,
    });
    expect(el).toBeDefined();
  });

  it("renders MissionCenterErrorsTab component", () => {
    const el = React.createElement(MissionCenterErrorsTab, {
      errorReports: mockMissionData.errorReports,
      onUpdateStatus: vi.fn(),
      onDeleteReport: vi.fn(),
      onClearResolved: vi.fn(),
    });
    expect(el).toBeDefined();
  });

  it("renders MissionCenterSecurityTab component", () => {
    const el = React.createElement(MissionCenterSecurityTab, {
      securityIncidents: mockMissionData.securityIncidents,
    });
    expect(el).toBeDefined();
  });

  it("renders MissionCenterMetricsTab component", () => {
    const el = React.createElement(MissionCenterMetricsTab, {
      metrics: mockMissionData.metrics,
    });
    expect(el).toBeDefined();
  });

  it("renders MissionCenterUserProfileCard with user and IP origin", () => {
    const el = React.createElement(MissionCenterUserProfileCard, {
      user: mockMissionData.errorReports[0].user,
      ipAddress: "192.168.1.50",
      userAgent: "Mozilla/5.0 TestBrowser",
      title: "Attributed User Profile Card",
      isSecurityInfraction: true,
    });
    expect(el).toBeDefined();
  });

  it("renders MissionCenterUserProfileCard for anonymous visitor", () => {
    const el = React.createElement(MissionCenterUserProfileCard, {
      user: null,
      ipAddress: "10.0.0.1",
      userAgent: "Mozilla/5.0 Anonymous",
      title: "Anonymous Visitor",
      isSecurityInfraction: false,
    });
    expect(el).toBeDefined();
  });
});
