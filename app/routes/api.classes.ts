import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { authGuard } from "~/utils/session.server";
import { resolveActiveUser } from "~/utils/auth";
import { getDatabaseFromContext, type Database } from "~/db";
import {
  getClassesForUser,
  getEligibleInstructors,
  createClass,
  updateClass,
  deleteClass,
  ensureCalendarFeedToken,
  regenerateCalendarFeedToken,
} from "~/services/classService";
import type { NewClass } from "~/db/schema";

export async function loader({ request, context }: LoaderFunctionArgs) {
  const auth = await authGuard(request, context);
  if (!auth?.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const activeUser = resolveActiveUser(auth.user, auth.session);
  if (!activeUser) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = getDatabaseFromContext(context) || auth.db;
  if (!db) {
    return Response.json({ error: "Database unavailable" }, { status: 503 });
  }

  const classesList = await getClassesForUser(db, activeUser);
  const feedToken = await ensureCalendarFeedToken(db, activeUser.id);

  let eligibleInstructors = undefined;
  let availableSessions = undefined;

  if (activeUser.role === "admin") {
    eligibleInstructors = await getEligibleInstructors(db);
    availableSessions = await db.query.sessions.findMany({
      with: {
        course: true,
        cohort: true,
      },
    });
  }

  return Response.json({
    classes: classesList,
    instructors: eligibleInstructors,
    sessions: availableSessions,
    feedToken,
    userRole: activeUser.role,
    userId: activeUser.id,
  });
}

async function handleRegenerateToken(
  db: Database,
  body: Record<string, unknown>,
  fallbackUserId: string,
): Promise<Response> {
  const targetUserId =
    typeof body.userId === "string" ? body.userId : fallbackUserId;
  const newToken = await regenerateCalendarFeedToken(db, targetUserId);
  return Response.json({ success: true, feedToken: newToken });
}

async function handleDeleteClass(
  db: Database,
  body: Record<string, unknown>,
): Promise<Response> {
  const id = typeof body.id === "string" ? body.id : null;
  if (!id) {
    return Response.json({ error: "Missing class ID" }, { status: 400 });
  }
  const success = await deleteClass(db, id);
  return Response.json({ success });
}

function buildClassPatch(
  body: Record<string, unknown>,
): Partial<Omit<NewClass, "id" | "createdAt" | "updatedAt">> {
  const patch: Partial<Omit<NewClass, "id" | "createdAt" | "updatedAt">> = {};
  if (typeof body.startTime === "string")
    patch.startTime = new Date(body.startTime);
  if (typeof body.endTime === "string") patch.endTime = new Date(body.endTime);
  if (typeof body.title === "string") patch.title = body.title;
  if (typeof body.description === "string")
    patch.description = body.description;
  if (typeof body.isRemote === "boolean") patch.isRemote = body.isRemote;
  if (typeof body.location === "string") patch.location = body.location;
  if ("instructorId" in body) {
    patch.instructorId =
      typeof body.instructorId === "string" ? body.instructorId : null;
  }
  if (typeof body.sessionId === "string") patch.sessionId = body.sessionId;
  return patch;
}

async function handleUpdateClass(
  db: Database,
  body: Record<string, unknown>,
): Promise<Response> {
  const id = typeof body.id === "string" ? body.id : null;
  if (!id) {
    return Response.json({ error: "Missing class ID" }, { status: 400 });
  }

  const patch = buildClassPatch(body);
  const updated = await updateClass(db, id, patch);
  if (!updated) {
    return Response.json({ error: "Class not found" }, { status: 404 });
  }
  return Response.json({ success: true, class: updated });
}

function asString(candidateValue: unknown): string | null {
  return typeof candidateValue === "string" ? candidateValue : null;
}

function parseNewClassInput(
  body: Record<string, unknown>,
): Omit<NewClass, "createdAt" | "updatedAt"> | null {
  const sessionId = asString(body.sessionId);
  const title = asString(body.title);
  const startTime = asString(body.startTime);
  const endTime = asString(body.endTime);

  if (!sessionId || !title || !startTime || !endTime) {
    return null;
  }

  return {
    sessionId,
    title,
    isRemote: Boolean(body.isRemote),
    startTime: new Date(startTime),
    endTime: new Date(endTime),
    location: asString(body.location),
    instructorId: asString(body.instructorId),
    description: asString(body.description),
  };
}

async function handleCreateClass(
  db: Database,
  body: Record<string, unknown>,
): Promise<Response> {
  const input = parseNewClassInput(body);
  if (!input) {
    return Response.json(
      {
        error: "Missing required fields (sessionId, title, startTime, endTime)",
      },
      { status: 400 },
    );
  }

  const created = await createClass(db, input);
  return Response.json({ success: true, class: created }, { status: 201 });
}

function dispatchAction(
  db: Database,
  operation: string,
  body: Record<string, unknown>,
  userId: string,
): Promise<Response> {
  switch (operation) {
    case "REGENERATE_TOKEN":
      return handleRegenerateToken(db, body, userId);
    case "DELETE":
      return handleDeleteClass(db, body);
    case "UPDATE":
    case "PUT":
    case "PATCH":
      return handleUpdateClass(db, body);
    case "CREATE":
    case "POST":
      return handleCreateClass(db, body);
    default:
      return Promise.resolve(
        Response.json({ error: "Method not allowed" }, { status: 405 }),
      );
  }
}

export async function action({ request, context }: ActionFunctionArgs) {
  const auth = await authGuard(request, context);
  if (!auth?.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const activeUser = resolveActiveUser(auth.user, auth.session);
  if (!activeUser) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = getDatabaseFromContext(context) || auth.db;
  if (!db) {
    return Response.json({ error: "Database unavailable" }, { status: 503 });
  }

  if (activeUser.role !== "admin") {
    return Response.json(
      { error: "Forbidden: Only administrators can modify classes or tokens" },
      { status: 403 },
    );
  }

  const body = (await request.json().catch(() => ({}))) as Record<
    string,
    unknown
  >;
  const method = request.method.toUpperCase();
  const operation =
    typeof body.intent === "string" ? body.intent.toUpperCase() : method;

  return dispatchAction(db, operation, body, activeUser.id);
}
