import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { getDatabaseFromContext, type Database } from "~/db";
import {
  getUserWithAffiliations,
  getAllUsersWithAffiliations,
  createUser,
  createAffiliation,
  updateUser,
  updateUserAffiliation,
  isUserProfileComplete,
} from "~/services/userService";
import { seedDatabase, resetDatabase } from "~/db/seed";
import { institutions, cohorts } from "~/db/schema";
import {
  DEV_PERSONAS,
  type PersonaDefinition,
  type UserRole,
} from "~/utils/auth";
import { getSession, type SessionPayload } from "~/utils/session.server";

type UserWithAffiliationsResult = NonNullable<
  Awaited<ReturnType<typeof getUserWithAffiliations>>
>;

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
      return "Student";
  }
}

function resolveAccountName(
  user: UserWithAffiliationsResult,
  role: UserRole,
): string {
  const fullName =
    `${user.firstName?.trim() || ""} ${(user.lastName || "").trim().toUpperCase()}`.trim();
  return (
    user.displayName ||
    fullName ||
    `New ${resolveRoleBadge(role)} (Pending Onboarding)`
  );
}

function formatAccountFromDb(
  user: UserWithAffiliationsResult,
): FormattedAccount {
  const primaryAffiliation = user.affiliations[0];
  const role = (primaryAffiliation?.role as UserRole) || "student";
  const isComplete = isUserProfileComplete(user);

  return {
    id: user.id,
    name: resolveAccountName(user, role),
    firstName: user.firstName?.trim() || "",
    lastName: (user.lastName || "").trim().toUpperCase(),
    email: primaryAffiliation?.email || "",
    role,
    isProfileComplete: isComplete,
    createdAt: user.createdAt,
    institutionId: primaryAffiliation?.institutionId,
    cohortId: primaryAffiliation?.cohortId,
    badge: resolveRoleBadge(role),
    title: resolveRoleTitle(role, isComplete),
  };
}

function formatPersona(
  user: UserWithAffiliationsResult,
  fallback: PersonaDefinition,
): PersonaDefinition {
  const primaryAffiliation = user.affiliations[0];
  const fullName =
    `${user.firstName?.trim() || ""} ${(user.lastName || "").trim().toUpperCase()}`.trim();
  return {
    id: user.id,
    name: user.displayName ?? fullName ?? fallback.name,
    email: primaryAffiliation?.email ?? fallback.email,
    role: (primaryAffiliation?.role as UserRole) ?? fallback.role,
    title: fallback.title,
    badge: fallback.badge,
  };
}

async function fetchAccounts(db: Database): Promise<FormattedAccount[]> {
  const dbUsers = await getAllUsersWithAffiliations(db);
  return dbUsers.map(formatAccountFromDb);
}

async function fetchPersonas(db: Database) {
  if (DEV_PERSONAS.length === 0) {
    return [];
  }

  const [adminFallback, instructorFallback, studentFallback] = DEV_PERSONAS;

  const admin = await getUserWithAffiliations(db, adminFallback.id);
  const instructor = await getUserWithAffiliations(db, instructorFallback.id);
  const student = await getUserWithAffiliations(db, studentFallback.id);

  return [
    admin ? formatPersona(admin, adminFallback) : adminFallback,
    instructor
      ? formatPersona(instructor, instructorFallback)
      : instructorFallback,
    student ? formatPersona(student, studentFallback) : studentFallback,
  ];
}

function formatCurrentUser(user: UserWithAffiliationsResult) {
  const primaryAffil = user.affiliations[0];
  const role = (primaryAffil?.role as UserRole) || "student";
  const first = user.firstName?.trim() || "";
  const last = (user.lastName || "").trim().toUpperCase();
  const calculatedName = `${first} ${last}`.trim() || "User";

  return {
    id: user.id,
    name: user.displayName ?? calculatedName,
    email: primaryAffil?.email ?? "",
    role,
    isProfileComplete: isUserProfileComplete(user),
  };
}

async function fetchCurrentUser(db: Database, userId: string) {
  const dbUser = await getUserWithAffiliations(db, userId);
  return dbUser ? formatCurrentUser(dbUser) : null;
}

async function handleMeLoader(
  db: Database,
  activeUserId: string | null,
  session: SessionPayload | null,
) {
  if (activeUserId) {
    const user = await fetchCurrentUser(db, activeUserId);
    if (user) {
      return Response.json({ user, session });
    }
  }

  return Response.json({
    status: "ok",
    authenticated: Boolean(session),
    session: session ?? null,
    availablePersonas: DEV_PERSONAS,
  });
}

export async function loader({ request, context }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const actionType = url.searchParams.get("action") ?? "me";
  const explicitPersonaId = url.searchParams.get("personaId");
  const db = getDatabaseFromContext(context);
  if (!db) {
    return Response.json(
      { error: "Database binding unavailable." },
      { status: 503 },
    );
  }

  const session = await getSession(request);

  if (actionType === "accounts" || actionType === "users") {
    const accounts = await fetchAccounts(db);
    return Response.json({ accounts, total: accounts.length });
  }

  if (actionType === "personas") {
    const personas = await fetchPersonas(db);
    return Response.json({ personas });
  }

  const activeUserId = explicitPersonaId ?? session?.userId ?? null;
  return handleMeLoader(db, activeUserId, session);
}

async function ensureDefaultInstitutionAndCohort(db: Database) {
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
    where: (c, { eq }) => eq(c.name, "Cohort 2026"),
  });
  if (!cohort) {
    const [createdCohort] = await db
      .insert(cohorts)
      .values({
        institutionId: inst.id,
        name: "Cohort 2026",
        description: "Primary software engineering cohort.",
      })
      .returning();
    cohort = createdCohort;
  }

  return { institutionId: inst.id, cohortId: cohort.id };
}

async function handleCreateAccount(db: Database, targetRole: UserRole) {
  const { institutionId, cohortId } =
    await ensureDefaultInstitutionAndCohort(db);

  const createdUser = await createUser(db, {
    firstName: "",
    lastName: "",
    displayName: null,
    githubId: null,
  });

  await createAffiliation(db, {
    userId: createdUser.id,
    institutionId,
    cohortId: targetRole === "student" ? cohortId : null,
    email: "",
    role: targetRole,
    isActive: true,
  });

  const fullUser = await getUserWithAffiliations(db, createdUser.id);
  const formatted = fullUser
    ? formatAccountFromDb(fullUser)
    : {
        id: createdUser.id,
        name: `New ${resolveRoleBadge(targetRole)} (Pending Onboarding)`,
        firstName: "",
        lastName: "",
        email: "",
        role: targetRole,
        isProfileComplete: false,
        badge: resolveRoleBadge(targetRole),
        title: resolveRoleTitle(targetRole, false),
      };

  return Response.json({ success: true, account: formatted });
}

interface UpdateProfileBody {
  userId?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
}

function buildUserUpdatePayload(
  firstName?: string,
  lastName?: string,
): { firstName?: string; lastName?: string; displayName?: string } | null {
  if (firstName === undefined && lastName === undefined) return null;
  const payload: {
    firstName?: string;
    lastName?: string;
    displayName?: string;
  } = {};
  if (firstName !== undefined) payload.firstName = firstName;
  if (lastName !== undefined) payload.lastName = lastName;
  const f = firstName ?? "";
  const l = lastName ?? "";
  if (f || l) {
    payload.displayName = `${f.trim()} ${l.trim().toUpperCase()}`.trim();
  }
  return payload;
}

async function handleUpdateProfile(
  db: Database,
  request: Request,
  body: UpdateProfileBody,
) {
  const session = await getSession(request);
  const targetUserId = body.userId || session?.userId;
  if (!targetUserId) {
    return Response.json(
      { error: "Authentication required to update profile." },
      { status: 401 },
    );
  }

  const userPayload = buildUserUpdatePayload(body.firstName, body.lastName);
  if (userPayload) {
    await updateUser(db, targetUserId, userPayload);
  }

  if (body.email?.trim()) {
    await updateUserAffiliation(db, targetUserId, {
      email: body.email.trim().toLowerCase(),
    });
  }

  const updatedDbUser = await getUserWithAffiliations(db, targetUserId);
  const formatted = updatedDbUser ? formatAccountFromDb(updatedDbUser) : null;
  return Response.json({ success: true, account: formatted });
}

export async function action({ request, context }: ActionFunctionArgs) {
  const body = (await request.json().catch(() => ({}))) as {
    action?: string;
    role?: UserRole;
    userId?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
  };

  const db = getDatabaseFromContext(context);
  if (!db) {
    return Response.json(
      { error: "Database binding unavailable." },
      { status: 503 },
    );
  }

  switch (body.action) {
    case "updateProfile":
      return handleUpdateProfile(db, request, body);
    case "reset":
    case "empty":
      await resetDatabase(db);
      return Response.json({ success: true, reset: true });
    case "seed": {
      const result = await seedDatabase(db);
      return Response.json({ seeded: true, result });
    }
    case "createAccount":
      return handleCreateAccount(db, body.role ?? "student");
    default:
      return Response.json({ error: "Invalid action" }, { status: 400 });
  }
}
