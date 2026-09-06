import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { authGuard, type SessionPayload } from "~/utils/session.server";
import {
  getAllUsersWithAffiliations,
  getUserWithAffiliations,
  createUser,
  createAffiliation,
  isUserProfileComplete,
  type UserWithAffiliations,
} from "~/services/userService";
import { institutions, cohorts } from "~/db/schema";
import { getDatabaseFromContext, type Database } from "~/db";
import type { UserRole } from "~/utils/auth";
import { logImpersonatedAudit } from "~/services/assessmentService";

export interface FormattedAccount {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  isProfileComplete: boolean;
  createdAt?: string | Date;
  institutionId?: string;
  cohortId?: string | null;
  badge: string;
  title: string;
  githubUsername?: string;
}

function resolveRoleBadge(role: UserRole): string {
  switch (role) {
    case "admin":
      return "Admin";
    case "instructor":
      return "Instructor";
    case "student":
    default:
      return "Student";
  }
}

function resolveRoleTitle(role: UserRole, isComplete: boolean): string {
  if (!isComplete) {
    return "Onboarding Pending • Unconfigured Profile";
  }
  switch (role) {
    case "admin":
      return "System Administrator";
    case "instructor":
      return "Instructor";
    case "student":
    default:
      return "Cadet • Student";
  }
}

export type UserWithAffiliationsResult = UserWithAffiliations;

function resolveDisplayName(user: {
  displayName?: string | null;
  firstName?: string;
  lastName?: string;
}): string {
  if (user.displayName) return user.displayName;
  const name = `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim();
  return name.length > 0 ? name : "User";
}

function resolveAccountEmail(
  affilEmail?: string,
  githubEmail?: string | null,
): string {
  if (affilEmail) return affilEmail;
  return githubEmail ?? "";
}

export function formatAccountFromDb(
  user: UserWithAffiliationsResult,
): FormattedAccount {
  const affil = user.affiliations[0];
  const role = (affil?.role as UserRole) ?? "student";
  const isComplete = isUserProfileComplete(user);

  return {
    id: user.id,
    name: resolveDisplayName(user),
    firstName: user.firstName,
    lastName: user.lastName,
    email: resolveAccountEmail(affil?.email, user.githubEmail),
    role,
    isProfileComplete: isComplete,
    createdAt: user.createdAt,
    institutionId: affil?.institutionId,
    cohortId: affil?.cohortId,
    badge: resolveRoleBadge(role),
    title: resolveRoleTitle(role, isComplete),
    githubUsername: user.githubId ?? undefined,
  };
}

export async function ensureDefaultInstitutionAndCohort(db: Database) {
  let inst = await db.query.institutions.findFirst({
    where: (i, { eq }) => eq(i.slug, "aptitek"),
  });
  if (!inst) {
    const [created] = await db
      .insert(institutions)
      .values({
        name: "Aptitek",
        slug: "aptitek",
        type: "academic",
        logoUrl: "/aptitek-logo.svg",
      })
      .returning();
    inst = created;
  }

  let cohort = await db.query.cohorts.findFirst({
    where: (c, { eq, and }) => and(eq(c.diploma, "M"), eq(c.year, 1)),
  });
  if (!cohort) {
    const [createdCohort] = await db
      .insert(cohorts)
      .values({
        institutionId: inst.id,
        diploma: "M",
        year: 1,
        tags: ["AI", "Dev"],
        description: "Primary software engineering cohort.",
      })
      .returning();
    cohort = createdCohort;
  }

  return { institutionId: inst.id, cohortId: cohort.id };
}

// GET /api/users - List accounts (Admin only in production, dev-accessible locally)
export async function loader({ request, context }: LoaderFunctionArgs) {
  const isDev =
    typeof process !== "undefined" && process.env.NODE_ENV !== "production";
  const auth = await authGuard(
    request,
    context,
    isDev ? { allowAnonymous: true } : { requiredRole: "admin" },
  );
  const db = auth?.db ?? getDatabaseFromContext(context);
  if (!db) {
    return Response.json(
      { error: "Database binding unavailable", code: "DATABASE_UNAVAILABLE" },
      { status: 503 },
    );
  }

  const url = new URL(request.url);
  const roleFilter = url.searchParams.get("role");
  const cohortFilter = url.searchParams.get("cohortId");

  const rawUsers = await getAllUsersWithAffiliations(db);
  let accounts = rawUsers.map(formatAccountFromDb);

  if (roleFilter) {
    accounts = accounts.filter((a) => a.role === roleFilter);
  }
  if (cohortFilter) {
    accounts = accounts.filter((a) => a.cohortId === cohortFilter);
  }

  return Response.json({
    accounts,
    users: accounts,
    total: accounts.length,
  });
}

export interface CreateUserBody {
  role?: UserRole;
  firstName?: string;
  lastName?: string;
  email?: string;
  institutionId?: string;
  cohortId?: string;
}

export async function handleCreateUser(
  db: Database,
  session: SessionPayload | null | undefined,
  body: CreateUserBody,
) {
  const targetRole = body.role ?? "student";
  const defaults = await ensureDefaultInstitutionAndCohort(db);

  const createdUser = await createUser(db, {
    firstName: body.firstName ?? "",
    lastName: body.lastName ?? "",
    displayName: null,
    githubId: null,
  });

  const cohortId =
    targetRole === "student" ? (body.cohortId ?? defaults.cohortId) : null;
  await createAffiliation(db, {
    userId: createdUser.id,
    institutionId: body.institutionId ?? defaults.institutionId,
    cohortId,
    email: body.email ?? "",
    role: targetRole,
    isActive: true,
  });

  await logImpersonatedAudit(db, session, {
    tableName: "users",
    recordId: createdUser.id,
    action: "INSERT",
    targetUserId: createdUser.id,
    newValues: JSON.stringify({ role: targetRole, email: body.email }),
  });

  const fullUser = await getUserWithAffiliations(db, createdUser.id);
  const formatted = fullUser ? formatAccountFromDb(fullUser) : null;
  return Response.json(
    { success: true, account: formatted, user: formatted },
    { status: 201 },
  );
}

// POST /api/users - Create user account (Admin only in production, dev-accessible locally)
export async function action({ request, context }: ActionFunctionArgs) {
  if (request.method !== "POST") {
    return Response.json(
      { error: "Method not allowed", code: "METHOD_NOT_ALLOWED" },
      { status: 405 },
    );
  }

  const isDev =
    typeof process !== "undefined" && process.env.NODE_ENV !== "production";
  const auth = await authGuard(
    request,
    context,
    isDev ? { allowAnonymous: true } : { requiredRole: "admin" },
  );
  const db = auth?.db ?? getDatabaseFromContext(context);
  if (!db) {
    return Response.json(
      { error: "Database binding unavailable", code: "DATABASE_UNAVAILABLE" },
      { status: 503 },
    );
  }

  const body = (await request.json().catch(() => ({}))) as CreateUserBody;
  return handleCreateUser(db, auth?.session, body);
}
