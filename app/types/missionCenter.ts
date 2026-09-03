import type { EntityCardData } from "~/components/molecules/EntityCard/EntityCard.types";
import type { SystemHealthStatus } from "~/utils/statusCenter.types";

export type AuditActionType = "INSERT" | "UPDATE" | "DELETE";

export interface AdminAuditLogItem {
  id: string;
  tableName: string;
  recordId: string;
  action: AuditActionType;
  userId: string | null;
  actor?: EntityCardData | null;
  oldValues: string | null;
  newValues: string | null;
  createdAt: string | Date;
}

export type ErrorSeverityType =
  "info" | "warning" | "error" | "critical" | "security";

export type ErrorStatusType = "open" | "investigating" | "resolved" | "ignored";

export interface AdminErrorReportItem {
  id: string;
  message: string;
  stack?: string | null;
  severity: ErrorSeverityType;
  statusCode?: number | null;
  source?: string | null;
  url?: string | null;
  path?: string | null;
  ipAddress?: string | null;
  userAgent?: string | null;
  contextData?: string | null;
  userId?: string | null;
  user?: EntityCardData | null;
  status: ErrorStatusType;
  createdAt: string | Date;
}

export interface SecurityIncidentItem {
  id: string;
  type:
    | "403_forbidden"
    | "401_unauthorized"
    | "impersonation"
    | "security_alert"
    | "critical_deletion";
  title: string;
  description: string;
  severity: ErrorSeverityType;
  ipAddress?: string | null;
  userAgent?: string | null;
  timestamp: string | Date;
  userId?: string | null;
  user?: EntityCardData | null;
  actorUserId?: string | null;
  actorUser?: EntityCardData | null;
  rawError?: AdminErrorReportItem | null;
  rawAudit?: AdminAuditLogItem | null;
}

export interface TableRowMetric {
  tableName: string;
  rowCount: number;
}

export interface SystemMetricsData {
  infrastructure: {
    status: SystemHealthStatus;
    timestamp: string;
    d1: {
      name: string;
      status: SystemHealthStatus;
      latencyMs?: number;
      details?: string;
    };
    r2: {
      name: string;
      status: SystemHealthStatus;
      latencyMs?: number;
      details?: string;
    };
    environment: string;
  };
  counts: {
    totalUsers: number;
    students: number;
    instructors: number;
    admins: number;
    institutions: number;
    cohorts: number;
    courses: number;
    modules: number;
    submissions: number;
    grades: number;
    auditLogs: number;
    totalErrors: number;
    openErrors: number;
    criticalErrors: number;
    securityIncidents: number;
  };
  tableInventory: TableRowMetric[];
}

export interface MissionCenterData {
  auditLogs: AdminAuditLogItem[];
  errorReports: AdminErrorReportItem[];
  securityIncidents: SecurityIncidentItem[];
  metrics: SystemMetricsData;
  openIssuesCount: number;
}
