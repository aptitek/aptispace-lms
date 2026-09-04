import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { getDatabaseFromContext } from "~/db";
import { getAllUsersWithAffiliations } from "~/services/userService";
import { getSession } from "~/utils/session.server";
import {
  formatAccountFromDb,
  handleCreateUser,
  type CreateUserBody,
} from "~/routes/api.users";

function isDevOrAdmin(sessionRole?: string): boolean {
  const isDev =
    typeof process !== "undefined" && process.env.NODE_ENV !== "production";
  return isDev || sessionRole === "admin";
}

export async function loader({ request, context }: LoaderFunctionArgs) {
  const session = await getSession(request);

  if (!isDevOrAdmin(session?.role)) {
    return Response.json(
      { error: "Forbidden: Development utility only", code: "FORBIDDEN" },
      { status: 403 },
    );
  }

  const db = getDatabaseFromContext(context);
  if (!db) {
    return Response.json({
      personas: [],
      accounts: [],
      users: [],
      total: 0,
    });
  }

  const rawUsers = await getAllUsersWithAffiliations(db);
  const accounts = rawUsers.map(formatAccountFromDb);

  return Response.json({
    personas: accounts,
    accounts,
    users: accounts,
    total: accounts.length,
  });
}

export async function action({ request, context }: ActionFunctionArgs) {
  if (request.method !== "POST") {
    return Response.json(
      { error: "Method not allowed", code: "METHOD_NOT_ALLOWED" },
      { status: 405 },
    );
  }

  const session = await getSession(request);

  if (!isDevOrAdmin(session?.role)) {
    return Response.json(
      { error: "Forbidden: Development utility only", code: "FORBIDDEN" },
      { status: 403 },
    );
  }

  const db = getDatabaseFromContext(context);
  if (!db) {
    return Response.json(
      { error: "Database binding unavailable", code: "DATABASE_UNAVAILABLE" },
      { status: 503 },
    );
  }

  const body = (await request.json().catch(() => ({}))) as CreateUserBody;
  return handleCreateUser(db, session, body);
}
