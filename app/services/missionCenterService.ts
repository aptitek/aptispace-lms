import { desc, eq, sql, count, type Table } from "drizzle-orm";
import type { Database } from "~/db/index";
import {
  auditLogs,
  errorReports,
  users,
  institutions,
  cohorts,
  courses,
  modules,
  submissions,
  grades,
  affiliations,
  type NewAuditLog,
} from "~/db/schema";
import type {
  AdminAuditLogItem,
  AdminErrorReportItem,
  ErrorStatusType,
  ErrorSeverityType,
  MissionCenterData,
  SecurityIncidentItem,
  SystemMetricsData,
  TableRowMetric,
} from "~/types/missionCenter";
import type { EntityCardData } from "~/components/molecules/EntityCard/EntityCard.types";
import type { AuthUser } from "~/utils/auth";
import { resolveR2Bucket } from "~/utils/r2.server";
import { probeD1, probeR2, resolveOverallStatus } from "~/routes/api.health";
import {
  mapDbUserToStudent,
  type DbUserWithAffil,
} from "~/routes/admin.helpers";
import {
  getMockAuditLogs,
  getMockErrorReports,
  getFallbackSystemMetrics,
} from "./missionCenterService.mock";

/* =========================================================================
 * Service Methods
 * ========================================================================= */

export async function getAuditLogs(
  db: Database | null,
  options?: { limit?: number; action?: string; tableName?: string },
): Promise<AdminAuditLogItem[]> {
  if (!db) {
    return getMockAuditLogs();
  }

  try {
    const rawLogs = await db.query.auditLogs.findMany({
      orderBy: [desc(auditLogs.createdAt)],
      limit: options?.limit ?? 100,
      with: {
        user: {
          with: {
            affiliations: {
              with: {
                institution: true,
                cohort: true,
              },
            },
          },
        },
      },
    });

    return rawLogs.map((log) => {
      let actor: EntityCardData | null = null;
      if (log.user) {
        actor = mapDbUserToStudent(log.user as unknown as DbUserWithAffil);
      }

      return {
        id: log.id,
        tableName: log.tableName,
        recordId: log.recordId,
        action: log.action as AdminAuditLogItem["action"],
        userId: log.userId,
        actor,
        oldValues: log.oldValues,
        newValues: log.newValues,
        createdAt:
          log.createdAt instanceof Date
            ? log.createdAt.toISOString()
            : String(log.createdAt),
      };
    });
  } catch (error) {
    console.error(
      "[MissionCenterService] Failed to load audit logs from DB:",
      error,
    );
    return getMockAuditLogs();
  }
}

export async function getErrorReports(
  db: Database | null,
  options?: { limit?: number; severity?: string; status?: string },
): Promise<AdminErrorReportItem[]> {
  if (!db) {
    return getMockErrorReports();
  }

  try {
    const rawReports = await db.query.errorReports.findMany({
      orderBy: [desc(errorReports.createdAt)],
      limit: options?.limit ?? 100,
      with: {
        user: {
          with: {
            affiliations: {
              with: {
                institution: true,
                cohort: true,
              },
            },
          },
        },
      },
    });

    return rawReports.map((report) => {
      let user: EntityCardData | null = null;
      if (report.user) {
        user = mapDbUserToStudent(report.user as unknown as DbUserWithAffil);
      }

      return {
        id: report.id,
        message: report.message,
        stack: report.stack,
        severity: report.severity as ErrorSeverityType,
        statusCode: report.statusCode,
        source: report.source,
        url: report.url,
        path: report.path,
        ipAddress: report.ipAddress,
        userAgent: report.userAgent,
        contextData: report.contextData,
        userId: report.userId,
        user,
        status: report.status as ErrorStatusType,
        createdAt:
          report.createdAt instanceof Date
            ? report.createdAt.toISOString()
            : String(report.createdAt),
      };
    });
  } catch (error) {
    console.error(
      "[MissionCenterService] Failed to load error reports from DB:",
      error,
    );
    return getMockErrorReports();
  }
}

export async function updateErrorReportStatus(
  db: Database,
  id: string,
  status: ErrorStatusType,
) {
  return db
    .update(errorReports)
    .set({ status })
    .where(eq(errorReports.id, id))
    .returning();
}

export async function deleteErrorReport(db: Database, id: string) {
  return db.delete(errorReports).where(eq(errorReports.id, id)).returning();
}

export async function clearResolvedErrorReports(db: Database) {
  return db
    .delete(errorReports)
    .where(sql`${errorReports.status} IN ('resolved', 'ignored')`)
    .returning();
}

export async function logAdminAudit(
  db: Database,
  params: {
    tableName: string;
    recordId: string;
    action: "INSERT" | "UPDATE" | "DELETE";
    actorUserId: string;
    oldValues?: Record<string, unknown> | string | null;
    newValues?: Record<string, unknown> | string | null;
  },
) {
  const oldSerialized =
    params.oldValues == null
      ? null
      : typeof params.oldValues === "string"
        ? params.oldValues
        : JSON.stringify(params.oldValues);

  const newSerialized =
    params.newValues == null
      ? null
      : typeof params.newValues === "string"
        ? params.newValues
        : JSON.stringify(params.newValues);

  try {
    const entry: NewAuditLog = {
      tableName: params.tableName,
      recordId: params.recordId,
      action: params.action,
      userId: params.actorUserId,
      oldValues: oldSerialized,
      newValues: newSerialized,
    };
    await db.insert(auditLogs).values(entry);
  } catch (error) {
    console.error(
      "[MissionCenterService] Failed to record admin audit log:",
      error,
    );
  }
}

/* =========================================================================
 * Metrics & Aggregations
 * ========================================================================= */

async function queryTableCount(db: Database, table: Table): Promise<number> {
  try {
    const result = await db.select({ count: count() }).from(table);
    return Number(result[0]?.count || 0);
  } catch {
    return 0;
  }
}

export async function getSystemMetrics(
  db: Database | null,
  context?: unknown,
): Promise<SystemMetricsData> {
  const r2Bucket = resolveR2Bucket(context);

  const [d1Report, r2Report] = await Promise.all([
    probeD1(db),
    probeR2(r2Bucket),
  ]);

  const overallStatus = resolveOverallStatus(d1Report, r2Report);

  if (!db) {
    return getFallbackSystemMetrics(overallStatus, d1Report, r2Report);
  }

  try {
    const [
      totalUsers,
      totalInstitutions,
      totalCohorts,
      totalCourses,
      totalModules,
      totalSubmissions,
      totalGrades,
      totalAuditLogs,
      allErrors,
      allAffils,
    ] = await Promise.all([
      queryTableCount(db, users),
      queryTableCount(db, institutions),
      queryTableCount(db, cohorts),
      queryTableCount(db, courses),
      queryTableCount(db, modules),
      queryTableCount(db, submissions),
      queryTableCount(db, grades),
      queryTableCount(db, auditLogs),
      db
        .select({
          severity: errorReports.severity,
          status: errorReports.status,
        })
        .from(errorReports),
      db.select({ role: affiliations.role }).from(affiliations),
    ]);

    let students = 0;
    let instructors = 0;
    let admins = 0;
    allAffils.forEach((a) => {
      if (a.role === "admin") admins++;
      else if (a.role === "instructor") instructors++;
      else students++;
    });

    let openErrors = 0;
    let criticalErrors = 0;
    let securityErrors = 0;
    allErrors.forEach((e) => {
      if (e.status === "open" || e.status === "investigating") {
        openErrors++;
      }
      if (e.severity === "critical") criticalErrors++;
      if (e.severity === "security") securityErrors++;
    });

    const tableInventory: TableRowMetric[] = [
      { tableName: "users", rowCount: totalUsers },
      { tableName: "institutions", rowCount: totalInstitutions },
      { tableName: "cohorts", rowCount: totalCohorts },
      { tableName: "affiliations", rowCount: allAffils.length },
      { tableName: "courses", rowCount: totalCourses },
      { tableName: "modules", rowCount: totalModules },
      { tableName: "submissions", rowCount: totalSubmissions },
      { tableName: "grades", rowCount: totalGrades },
      { tableName: "audit_logs", rowCount: totalAuditLogs },
      { tableName: "error_reports", rowCount: allErrors.length },
    ];

    return {
      infrastructure: {
        status: overallStatus,
        timestamp: new Date().toISOString(),
        d1: d1Report,
        r2: r2Report,
        environment: "Cloudflare D1 & Workers",
      },
      counts: {
        totalUsers,
        students,
        instructors,
        admins,
        institutions: totalInstitutions,
        cohorts: totalCohorts,
        courses: totalCourses,
        modules: totalModules,
        submissions: totalSubmissions,
        grades: totalGrades,
        auditLogs: totalAuditLogs,
        totalErrors: allErrors.length,
        openErrors,
        criticalErrors,
        securityIncidents: securityErrors,
      },
      tableInventory,
    };
  } catch (err) {
    console.error(
      "[MissionCenterService] Failed to query full system metrics:",
      err,
    );
    return {
      infrastructure: {
        status: overallStatus,
        timestamp: new Date().toISOString(),
        d1: d1Report,
        r2: r2Report,
        environment: "Cloudflare Workers",
      },
      counts: {
        totalUsers: 0,
        students: 0,
        instructors: 0,
        admins: 0,
        institutions: 0,
        cohorts: 0,
        courses: 0,
        modules: 0,
        submissions: 0,
        grades: 0,
        auditLogs: 0,
        totalErrors: 0,
        openErrors: 0,
        criticalErrors: 0,
        securityIncidents: 0,
      },
      tableInventory: [],
    };
  }
}

/* =========================================================================
 * Security Incidents Aggregator
 * ========================================================================= */

function buildSecurityIncidents(
  errors: AdminErrorReportItem[],
  audits: AdminAuditLogItem[],
): SecurityIncidentItem[] {
  const incidents: SecurityIncidentItem[] = [];

  // 1. Map security & 401/403 errors
  errors.forEach((err) => {
    if (
      err.severity === "security" ||
      err.statusCode === 403 ||
      err.statusCode === 401
    ) {
      incidents.push({
        id: `sec-${err.id}`,
        type:
          err.statusCode === 403
            ? "403_forbidden"
            : err.statusCode === 401
              ? "401_unauthorized"
              : "security_alert",
        title:
          err.statusCode === 403
            ? "403 Forbidden Access Attempt"
            : err.statusCode === 401
              ? "401 Unauthorized Access"
              : "Security Alert",
        description: err.message,
        severity: err.severity,
        ipAddress: err.ipAddress,
        userAgent: err.userAgent,
        timestamp: err.createdAt,
        userId: err.userId,
        user: err.user,
        rawError: err,
      });
    }
  });

  // 2. Map sensitive audit entries (e.g., impersonations or critical deletions)
  audits.forEach((aud) => {
    if (aud.tableName === "users" && aud.action === "DELETE") {
      incidents.push({
        id: `sec-aud-${aud.id}`,
        type: "critical_deletion",
        title: "Administrative User Deletion",
        description: `User account deleted by admin (Record: ${aud.recordId})`,
        severity: "warning",
        timestamp: aud.createdAt,
        userId: aud.recordId,
        actorUserId: aud.userId,
        actorUser: aud.actor,
        rawAudit: aud,
      });
    }

    if (
      (aud.oldValues && aud.oldValues.includes("impersonating")) ||
      (aud.newValues && aud.newValues.includes("impersonat"))
    ) {
      incidents.push({
        id: `sec-aud-${aud.id}`,
        type: "impersonation",
        title: "Admin Account Impersonation Active",
        description: `Administrator initiated impersonation session`,
        severity: "info",
        timestamp: aud.createdAt,
        actorUserId: aud.userId,
        actorUser: aud.actor,
        rawAudit: aud,
      });
    }
  });

  return incidents.sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
  );
}

/* =========================================================================
 * Full Mission Center Data Bundle
 * ========================================================================= */

export async function getMissionCenterData(
  db: Database | null,
  _activeUser: AuthUser | null,
  context?: unknown,
): Promise<MissionCenterData> {
  const [auditLogsData, errorReportsData, metricsData] = await Promise.all([
    getAuditLogs(db),
    getErrorReports(db),
    getSystemMetrics(db, context),
  ]);

  const securityIncidents = buildSecurityIncidents(
    errorReportsData,
    auditLogsData,
  );

  const openIssuesCount = errorReportsData.filter(
    (e) => e.status === "open" || e.status === "investigating",
  ).length;

  return {
    auditLogs: auditLogsData,
    errorReports: errorReportsData,
    securityIncidents,
    metrics: metricsData,
    openIssuesCount,
  };
}
