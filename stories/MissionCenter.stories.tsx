/* eslint-disable sonarjs/no-hardcoded-ip */
import type { Meta, StoryObj } from "@storybook/react-vite";
import Box from "@mui/material/Box";

import MissionCenter from "~/components/organisms/MissionCenter/MissionCenter";
import type { MissionCenterData } from "~/types/missionCenter";

const mockMissionData: MissionCenterData = {
  auditLogs: [
    {
      id: "aud-1",
      tableName: "users",
      recordId: "usr-42",
      action: "UPDATE",
      userId: "admin-1",
      actor: {
        id: "admin-1",
        firstName: "Eleanor",
        familyName: "VANCE",
        displayName: "Eleanor VANCE",
        email: "admin@aptitek.io",
        role: "admin",
      },
      oldValues: JSON.stringify({ role: "student" }),
      newValues: JSON.stringify({ role: "instructor" }),
      createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    },
    {
      id: "aud-2",
      tableName: "cohorts",
      recordId: "cohort-dev-2026",
      action: "INSERT",
      userId: "admin-1",
      actor: {
        id: "admin-1",
        firstName: "Eleanor",
        familyName: "VANCE",
        displayName: "Eleanor VANCE",
        email: "admin@aptitek.io",
        role: "admin",
      },
      oldValues: null,
      newValues: JSON.stringify({ name: "Cohort 2026 Alpha", diploma: "M" }),
      createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    },
  ],
  errorReports: [
    {
      id: "err-1",
      message: "403 Forbidden on /api/admin/system-override",
      stack:
        "Error: 403 Forbidden\n    at authGuard (app/utils/session.server.ts:182:11)",
      severity: "security",
      statusCode: 403,
      source: "auth-guard-sentinel",
      url: "https://lms.aptispace.internal/api/admin/system-override",
      path: "/api/admin/system-override",
      ipAddress: "192.168.1.105",
      userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
      contextData: JSON.stringify({ route: "/api/admin/system-override" }),
      userId: "std-42",
      user: {
        id: "std-42",
        firstName: "Lucas",
        familyName: "BERNARD",
        displayName: "Lucas BERNARD",
        email: "lucas@example.com",
        role: "student",
      },
      status: "open",
      createdAt: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
    },
    {
      id: "err-2",
      message: "Unique constraint violation on submissions table",
      stack:
        "D1DatabaseError: UNIQUE constraint failed: submissions.id\n    at DrizzleD1Database.insert",
      severity: "error",
      statusCode: 500,
      source: "db-sync-service",
      url: "https://lms.aptispace.internal/api/courses/progress",
      path: "/api/courses/progress",
      ipAddress: "192.168.1.80",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
      status: "investigating",
      createdAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    },
  ],
  securityIncidents: [
    {
      id: "sec-1",
      type: "403_forbidden",
      title: "403 Forbidden Access Attempt",
      description:
        "Unauthorized access attempt to administrative orbital control bridge",
      severity: "security",
      ipAddress: "192.168.1.105",
      userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
      timestamp: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
      userId: "std-42",
      user: {
        id: "std-42",
        firstName: "Lucas",
        familyName: "BERNARD",
        displayName: "Lucas BERNARD",
        email: "lucas@example.com",
        role: "student",
      },
    },
  ],
  metrics: {
    infrastructure: {
      status: "nominal",
      timestamp: new Date().toISOString(),
      d1: {
        name: "Cloudflare D1 (aptispace-lms-db)",
        status: "nominal",
        latencyMs: 14,
        details: "Read/Write replication synchronized",
      },
      r2: {
        name: "Cloudflare R2 (aptispace-avatars)",
        status: "nominal",
        latencyMs: 32,
        details: "Public bucket active",
      },
      environment: "production",
    },
    counts: {
      totalUsers: 142,
      students: 120,
      instructors: 18,
      admins: 4,
      institutions: 3,
      cohorts: 8,
      courses: 12,
      modules: 48,
      submissions: 340,
      grades: 310,
      auditLogs: 24,
      totalErrors: 6,
      openErrors: 2,
      criticalErrors: 0,
      securityIncidents: 1,
    },
    tableInventory: [
      { tableName: "users", rowCount: 142 },
      { tableName: "institutions", rowCount: 3 },
      { tableName: "cohorts", rowCount: 8 },
      { tableName: "courses", rowCount: 12 },
      { tableName: "submissions", rowCount: 340 },
      { tableName: "audit_logs", rowCount: 24 },
      { tableName: "error_reports", rowCount: 6 },
    ],
  },
  openIssuesCount: 2,
};

const meta = {
  title: "Organisms/MissionCenter",
  component: MissionCenter,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => (
      <Box
        sx={{
          width: "100%",
          minHeight: "100vh",
          p: 3,
          bgcolor: "background.default",
        }}
      >
        <Story />
      </Box>
    ),
  ],
} satisfies Meta<typeof MissionCenter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const CockpitOverview: Story = {
  args: {
    missionData: mockMissionData,
    onRefresh: () => alert("Diagnostic probe executed"),
    onUpdateErrorStatus: (id, status) =>
      alert(`Status updated for ${id}: ${status}`),
    onDeleteErrorReport: (id) => alert(`Report deleted: ${id}`),
    onClearResolvedErrors: () => alert("Cleared resolved error reports"),
  },
};

export const ZeroIssuesState: Story = {
  args: {
    missionData: {
      ...mockMissionData,
      openIssuesCount: 0,
      errorReports: [],
      securityIncidents: [],
      metrics: {
        ...mockMissionData.metrics,
        counts: {
          ...mockMissionData.metrics.counts,
          openErrors: 0,
          criticalErrors: 0,
          securityIncidents: 0,
        },
      },
    },
    onRefresh: () => alert("Probe run"),
  },
};

export const SubmittingState: Story = {
  args: {
    missionData: mockMissionData,
    isSubmitting: true,
  },
};
