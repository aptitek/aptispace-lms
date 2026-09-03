import type { LoaderFunctionArgs } from "react-router";
import { sql } from "drizzle-orm";
import { getDatabaseFromContext, type Database } from "~/db";
import { resolveR2Bucket } from "~/utils/r2.server";
import type { R2Bucket } from "@cloudflare/workers-types";
import type {
  ServiceHealthReport,
  SystemInfrastructureHealth,
  SystemHealthStatus,
} from "~/utils/statusCenter.types";

const LATENCY_DEGRADED_THRESHOLD_MS = 500;

export async function probeD1(
  db: Database | null,
): Promise<ServiceHealthReport> {
  const serviceName = "Cloudflare D1 (Database)";
  if (!db) {
    return {
      name: serviceName,
      status: "offline",
      error: "D1 database binding unavailable",
      details: "No active D1 connection configured in runtime environment.",
    };
  }

  const startTime = performance.now();
  try {
    await db.run(sql`SELECT 1 as ping`);
    const latencyMs = Math.max(1, Math.round(performance.now() - startTime));
    const isDegraded = latencyMs > LATENCY_DEGRADED_THRESHOLD_MS;

    return {
      name: serviceName,
      status: isDegraded ? "degraded" : "nominal",
      latencyMs,
      details: isDegraded
        ? `SQLite database latency elevated (${latencyMs}ms)`
        : "SQLite database operational (ping verified)",
    };
  } catch (error) {
    const latencyMs = Math.max(1, Math.round(performance.now() - startTime));
    const errorMessage =
      error instanceof Error ? error.message : "Database query failed";
    return {
      name: serviceName,
      status: "critical",
      latencyMs,
      error: errorMessage,
      details: "Failed to execute database ping query.",
    };
  }
}

export async function probeR2(
  bucket: R2Bucket | undefined,
): Promise<ServiceHealthReport> {
  const serviceName = "Cloudflare R2 (Avatars Bucket)";
  if (!bucket) {
    return {
      name: serviceName,
      status: "offline",
      error: "R2 bucket binding unavailable",
      details: "No active AVATARS_BUCKET binding found in runtime environment.",
    };
  }

  const startTime = performance.now();
  try {
    await bucket.list({ limit: 1 });
    const latencyMs = Math.max(1, Math.round(performance.now() - startTime));
    const isDegraded = latencyMs > LATENCY_DEGRADED_THRESHOLD_MS;

    return {
      name: serviceName,
      status: isDegraded ? "degraded" : "nominal",
      latencyMs,
      details: isDegraded
        ? `R2 storage latency elevated (${latencyMs}ms)`
        : "R2 object storage operational (list verified)",
    };
  } catch (error) {
    const latencyMs = Math.max(1, Math.round(performance.now() - startTime));
    const errorMessage =
      error instanceof Error ? error.message : "R2 storage operation failed";
    return {
      name: serviceName,
      status: "critical",
      latencyMs,
      error: errorMessage,
      details: "Failed to query R2 storage bucket.",
    };
  }
}

export function resolveOverallStatus(
  d1Report: ServiceHealthReport,
  r2Report: ServiceHealthReport,
): SystemHealthStatus {
  if (d1Report.status === "offline" || r2Report.status === "offline") {
    return "offline";
  }
  if (d1Report.status === "critical" || r2Report.status === "critical") {
    return "critical";
  }
  if (d1Report.status === "degraded" || r2Report.status === "degraded") {
    return "degraded";
  }
  return "nominal";
}

export async function loader({ context }: LoaderFunctionArgs) {
  const db = getDatabaseFromContext(context);
  const r2Bucket = resolveR2Bucket(context);

  const [d1Report, r2Report] = await Promise.all([
    probeD1(db),
    probeR2(r2Bucket),
  ]);

  const overallStatus = resolveOverallStatus(d1Report, r2Report);
  const timestamp = new Date().toISOString();

  const healthPayload: SystemInfrastructureHealth = {
    status: overallStatus,
    timestamp,
    services: {
      d1: d1Report,
      r2: r2Report,
    },
  };

  const isHealthy =
    d1Report.status === "nominal" || d1Report.status === "degraded";
  const httpStatus =
    isHealthy &&
    (r2Report.status === "nominal" || r2Report.status === "degraded")
      ? 200
      : 503;

  return Response.json(healthPayload, {
    status: httpStatus,
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate",
    },
  });
}
