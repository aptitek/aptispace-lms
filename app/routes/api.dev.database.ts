import type { ActionFunctionArgs } from "react-router";
import { getDatabaseFromContext } from "~/db";
import { seedDatabase, resetDatabase } from "~/db/seed";
import { authGuard } from "~/utils/session.server";

function checkProductionBlock(): Response | null {
  if (typeof process !== "undefined" && process.env.NODE_ENV === "production") {
    return Response.json(
      {
        error:
          "CRITICAL: Database administrative dev actions are completely prohibited in production.",
        code: "FORBIDDEN",
      },
      { status: 403 },
    );
  }
  return null;
}

function resolveActionType(url: URL, bodyAction?: string): string {
  if (bodyAction) return bodyAction;
  const param = url.searchParams.get("action");
  if (param) return param;
  return url.pathname.endsWith("/seed") ? "seed" : "reset";
}

async function executeAction(
  db: Parameters<typeof seedDatabase>[0],
  actionType: string,
) {
  if (actionType === "seed") {
    const result = await seedDatabase(db);
    return Response.json({ success: true, seeded: true, result });
  }

  if (actionType === "reset" || actionType === "empty") {
    await resetDatabase(db);
    return Response.json({ success: true, reset: true });
  }

  return Response.json(
    {
      error: "Invalid database action. Must be 'seed' or 'reset'.",
      code: "BAD_REQUEST",
    },
    { status: 400 },
  );
}

export async function action({ request, context }: ActionFunctionArgs) {
  if (request.method !== "POST") {
    return Response.json(
      {
        error: "Method not allowed. Only POST is supported.",
        code: "METHOD_NOT_ALLOWED",
      },
      { status: 405 },
    );
  }

  const prodError = checkProductionBlock();
  if (prodError) return prodError;

  const auth = await authGuard(request, context, { requiredRole: "admin" });
  const db = auth?.db || getDatabaseFromContext(context);
  if (!db) {
    return Response.json(
      { error: "Database binding unavailable.", code: "SERVICE_UNAVAILABLE" },
      { status: 503 },
    );
  }

  const body = (await request.json().catch(() => ({}))) as { action?: string };
  const actionType = resolveActionType(new URL(request.url), body.action);
  return executeAction(db, actionType);
}
