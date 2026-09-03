import type {
  AdminAuditLogItem,
  AdminErrorReportItem,
  SystemMetricsData,
} from "~/types/missionCenter";
import type { EntityCardData } from "~/components/molecules/EntityCard/EntityCard.types";
import { getDefaultAdmins, getDefaultStudents } from "~/routes/admin.helpers";

export function getMockAdminUser(): EntityCardData {
  const admins = getDefaultAdmins();
  return (
    admins[0] || {
      id: "admin-system",
      firstName: "Admin",
      familyName: "SYSTEM",
      role: "admin",
      email: "admin@aptitek.io",
      avatarUrl: "https://avatars.githubusercontent.com/u/10101?v=4",
      institutionName: "Aptitek",
    }
  );
}

export function getMockStudentUser(): EntityCardData {
  const students = getDefaultStudents();
  return (
    students[0] || {
      id: "student-1",
      firstName: "Alex",
      familyName: "MOREAU",
      role: "student",
      email: "alex.moreau@etna.io",
      avatarUrl: "https://avatars.githubusercontent.com/u/987654?v=4",
      institutionName: "ETNA",
    }
  );
}

export function getMockAuditLogs(): AdminAuditLogItem[] {
  const admin = getMockAdminUser();
  const student = getMockStudentUser();
  const now = new Date();

  return [
    {
      id: "audit-1",
      tableName: "cohorts",
      recordId: "cohort-m1-ia-2026",
      action: "INSERT",
      userId: admin.id,
      actor: admin,
      oldValues: null,
      newValues: JSON.stringify({
        diploma: "M",
        year: 1,
        tags: ["IA", "Dev"],
        description: "Master 1 IA & Development Cohort 2026",
      }),
      createdAt: new Date(now.getTime() - 1000 * 60 * 15).toISOString(),
    },
    {
      id: "audit-2",
      tableName: "users",
      recordId: student.id,
      action: "UPDATE",
      userId: admin.id,
      actor: admin,
      oldValues: JSON.stringify({ githubId: null, role: "student" }),
      newValues: JSON.stringify({ githubId: "alexmoreau", role: "student" }),
      createdAt: new Date(now.getTime() - 1000 * 60 * 45).toISOString(),
    },
    {
      id: "audit-3",
      tableName: "sessions",
      recordId: "sess-react-patterns",
      action: "INSERT",
      userId: admin.id,
      actor: admin,
      oldValues: null,
      newValues: JSON.stringify({
        title: "Advanced Component Patterns",
        courseId: "course-react-1",
      }),
      createdAt: new Date(now.getTime() - 1000 * 60 * 120).toISOString(),
    },
    {
      id: "audit-4",
      tableName: "users",
      recordId: "user-deleted-temp",
      action: "DELETE",
      userId: admin.id,
      actor: admin,
      oldValues: JSON.stringify({
        id: "user-deleted-temp",
        firstName: "Spam",
        familyName: "BOT",
        email: "spam@disposable.com",
      }),
      newValues: JSON.stringify({
        deletedBy: admin.id,
        reason: "Security clean-up: bot account",
      }),
      createdAt: new Date(now.getTime() - 1000 * 60 * 240).toISOString(),
    },
    {
      id: "audit-5",
      tableName: "grades",
      recordId: "grade-eval-44",
      action: "UPDATE",
      userId: admin.id,
      actor: admin,
      oldValues: JSON.stringify({ score: 14.5 }),
      newValues: JSON.stringify({
        score: 17,
        feedback: "Grade adjusted after appeal",
      }),
      createdAt: new Date(now.getTime() - 1000 * 60 * 360).toISOString(),
    },
  ];
}

export function getMockErrorReports(): AdminErrorReportItem[] {
  const student = getMockStudentUser();
  const admin = getMockAdminUser();
  const now = new Date();

  return [
    {
      id: "err-101",
      message: "Security Infraction: 403 Forbidden on /api/admin/credentials",
      stack:
        "Error: 403 Forbidden\n    at authGuard (session.server.ts:48)\n    at loader (admin.tsx:50)",
      severity: "security",
      statusCode: 403,
      source: "server",
      url: "https://lms.aptitek.io/api/admin/credentials",
      path: "/api/admin/credentials",
      ipAddress: "194.254.120.45",
      userAgent:
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/128.0",
      contextData: JSON.stringify({
        targetRoute: "/api/admin/credentials",
        method: "POST",
      }),
      userId: student.id,
      user: student,
      status: "open",
      createdAt: new Date(now.getTime() - 1000 * 60 * 10).toISOString(),
    },
    {
      id: "err-102",
      message: "D1 Query Transient Latency Elevated (> 580ms)",
      stack:
        "D1Error: SQLite statement execution latency spike\n    at probeD1 (api.health.ts:27)",
      severity: "warning",
      statusCode: 504,
      source: "server",
      url: "https://lms.aptitek.io/api/health",
      path: "/api/health",
      ipAddress: "127.0.0.1",
      userAgent: "Cloudflare-Worker-Probe/2.0",
      contextData: JSON.stringify({
        query: "SELECT 1 as ping",
        latencyMs: 582,
      }),
      userId: null,
      user: null,
      status: "investigating",
      createdAt: new Date(now.getTime() - 1000 * 60 * 35).toISOString(),
    },
    {
      id: "err-103",
      message:
        "TypeError: Cannot read properties of undefined (reading 'diploma')",
      stack:
        "TypeError: Cannot read properties of undefined (reading 'diploma')\n    at formatCohortName (cohortFormat.ts:24)\n    at StudentInspector (StudentInspector.tsx:88)",
      severity: "error",
      statusCode: 500,
      source: "client",
      url: "https://lms.aptitek.io/admin?cohort=c-99",
      path: "/admin",
      ipAddress: "82.65.14.202",
      userAgent:
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/129.0",
      contextData: JSON.stringify({ cohortId: "c-99", activeTab: 1 }),
      userId: admin.id,
      user: admin,
      status: "open",
      createdAt: new Date(now.getTime() - 1000 * 60 * 90).toISOString(),
    },
    {
      id: "err-104",
      message: "Hydration mismatch between server and client DOM",
      stack:
        "Error: Hydration failed because server rendered HTML didn't match client\n    at Header (Header.tsx:120)",
      severity: "info",
      statusCode: 200,
      source: "client",
      url: "https://lms.aptitek.io/login",
      path: "/login",
      ipAddress: "90.84.21.115",
      userAgent:
        "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15",
      contextData: JSON.stringify({ component: "Header", mode: "light" }),
      userId: null,
      user: null,
      status: "resolved",
      createdAt: new Date(now.getTime() - 1000 * 60 * 300).toISOString(),
    },
  ];
}

export function getFallbackSystemMetrics(
  overallStatus: SystemMetricsData["infrastructure"]["status"],
  d1Report: SystemMetricsData["infrastructure"]["d1"],
  r2Report: SystemMetricsData["infrastructure"]["r2"],
): SystemMetricsData {
  return {
    infrastructure: {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      d1: d1Report,
      r2: r2Report,
      environment: "local-dev (mock fallback)",
    },
    counts: {
      totalUsers: 14,
      students: 10,
      instructors: 2,
      admins: 2,
      institutions: 4,
      cohorts: 6,
      courses: 3,
      modules: 8,
      submissions: 12,
      grades: 12,
      auditLogs: 5,
      totalErrors: 4,
      openErrors: 2,
      criticalErrors: 0,
      securityIncidents: 1,
    },
    tableInventory: [
      { tableName: "users", rowCount: 14 },
      { tableName: "institutions", rowCount: 4 },
      { tableName: "cohorts", rowCount: 6 },
      { tableName: "affiliations", rowCount: 16 },
      { tableName: "courses", rowCount: 3 },
      { tableName: "modules", rowCount: 8 },
      { tableName: "submissions", rowCount: 12 },
      { tableName: "grades", rowCount: 12 },
      { tableName: "audit_logs", rowCount: 5 },
      { tableName: "error_reports", rowCount: 4 },
    ],
  };
}
