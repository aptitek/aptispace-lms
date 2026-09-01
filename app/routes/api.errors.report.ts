import type { ActionFunctionArgs } from "react-router";
import { getDatabaseFromContext } from "~/db";
import { errorReports, type NewErrorReport } from "~/db/schema";
import { getSession } from "~/utils/session.server";

export interface ErrorReportInput {
  message: string;
  stack?: string;
  severity?: "info" | "warning" | "error" | "critical" | "security";
  statusCode?: number;
  source?: string;
  url?: string;
  path?: string;
  contextData?: Record<string, unknown> | string;
}

function parseFormDataPayload(formPayload: FormData): ErrorReportInput {
  return {
    message: String(formPayload.get("message") || ""),
    stack: formPayload.get("stack")
      ? String(formPayload.get("stack"))
      : undefined,
    severity:
      (formPayload.get("severity") as ErrorReportInput["severity"]) || "error",
    statusCode: formPayload.get("statusCode")
      ? Number(formPayload.get("statusCode"))
      : undefined,
    source: formPayload.get("source")
      ? String(formPayload.get("source"))
      : undefined,
    url: formPayload.get("url") ? String(formPayload.get("url")) : undefined,
    path: formPayload.get("path") ? String(formPayload.get("path")) : undefined,
    contextData: formPayload.get("contextData")
      ? String(formPayload.get("contextData"))
      : undefined,
  };
}

async function parseErrorReportPayload(
  request: Request,
): Promise<ErrorReportInput> {
  const contentType = request.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return (await request.json()) as ErrorReportInput;
  }

  const formPayload = await request.formData();
  return parseFormDataPayload(formPayload);
}

function extractNetworkMetadata(request: Request) {
  const ipAddress =
    request.headers.get("cf-connecting-ip") ||
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    undefined;

  const userAgent = request.headers.get("user-agent") || undefined;
  return { ipAddress, userAgent };
}

function serializeContext(
  contextData?: Record<string, unknown> | string,
): string | null {
  if (!contextData) return null;
  return typeof contextData === "string"
    ? contextData
    : JSON.stringify(contextData);
}

function resolveDerivedPath(
  urlTarget?: string,
  fallbackUrl?: string,
): string | null {
  if (!urlTarget) return null;
  try {
    return new URL(urlTarget, fallbackUrl).pathname;
  } catch {
    return null;
  }
}

interface BuildReportOptions {
  reportId: string;
  payload: ErrorReportInput;
  requestUrl: string;
  clientMeta: { ipAddress?: string; userAgent?: string };
  userId: string | null;
}

function resolveSeverity(
  payload: ErrorReportInput,
): "info" | "warning" | "error" | "critical" | "security" {
  if (payload.severity) return payload.severity;
  return payload.statusCode === 403 ? "security" : "error";
}

function constructReportRecord(options: BuildReportOptions): NewErrorReport {
  const { reportId, payload, requestUrl, clientMeta, userId } = options;
  const severity = resolveSeverity(payload);

  return {
    id: reportId,
    message: payload.message.slice(0, 2000),
    stack: payload.stack?.slice(0, 10000) ?? null,
    severity,
    statusCode: payload.statusCode ?? (severity === "security" ? 403 : null),
    source: payload.source ?? "client",
    url: payload.url ?? requestUrl,
    path: payload.path ?? resolveDerivedPath(payload.url, requestUrl),
    ipAddress: clientMeta.ipAddress ?? null,
    userAgent: clientMeta.userAgent ?? null,
    contextData: serializeContext(payload.contextData),
    userId,
    status: "open",
    createdAt: new Date(),
  };
}

export async function action({ request, context }: ActionFunctionArgs) {
  if (request.method !== "POST") {
    return Response.json(
      { error: "Method not allowed. Only POST is supported." },
      { status: 405 },
    );
  }

  try {
    const payload = await parseErrorReportPayload(request);

    if (!payload.message || typeof payload.message !== "string") {
      return Response.json(
        { error: "Validation failed: 'message' is required." },
        { status: 400 },
      );
    }

    const clientMeta = extractNetworkMetadata(request);
    const session = await getSession(request);
    const isImpersonating = Boolean(
      session?.impersonating && session?.originalUserId,
    );
    const userId = isImpersonating
      ? (session?.originalUserId ?? null)
      : (session?.userId ?? null);

    if (isImpersonating) {
      const existingContext =
        typeof payload.contextData === "string"
          ? (() => {
              try {
                return JSON.parse(payload.contextData);
              } catch {
                return { rawContext: payload.contextData };
              }
            })()
          : (payload.contextData ?? {});

      payload.contextData = {
        ...existingContext,
        isImpersonated: true,
        impersonatedUserId: session?.userId,
        actorAdminUserId: session?.originalUserId,
      };
    }

    const reportId = crypto.randomUUID();

    const recordToInsert = constructReportRecord({
      reportId,
      payload,
      requestUrl: request.url,
      clientMeta,
      userId,
    });

    const databaseInstance = getDatabaseFromContext(context);
    if (databaseInstance) {
      await databaseInstance.insert(errorReports).values(recordToInsert);
    }

    return Response.json(
      {
        success: true,
        reportId,
        message: "Diagnostic telemetry error report logged successfully.",
        recordedAt: new Date().toISOString(),
      },
      { status: 201 },
    );
  } catch (caughtError) {
    const errorDetails =
      caughtError instanceof Error ? caughtError.message : "Internal error";
    return Response.json(
      { error: `Failed to process telemetry report: ${errorDetails}` },
      { status: 500 },
    );
  }
}
