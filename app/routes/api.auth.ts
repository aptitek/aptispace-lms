import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { getDatabaseFromContext, type Database } from "~/db";
import {
  getUserWithAffiliations,
  getAllUsersWithAffiliations,
  createUser,
  createAffiliation,
  isUserProfileComplete,
} from "~/services/userService";
import { seedDatabase } from "~/db/seed";
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
      return "Faculty Instructor";
    case "student":
    default:
      return "Enrolled Cadet";
  }
}

function resolveAccountName(
  user: UserWithAffiliationsResult,
  role: UserRole,
): string {
  const fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim();
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
    firstName: user.firstName,
    lastName: user.lastName,
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
  return {
    id: user.id,
    name: user.displayName ?? `${user.firstName} ${user.lastName}`,
    email: primaryAffiliation?.email ?? fallback.email,
    role: (primaryAffiliation?.role as UserRole) ?? fallback.role,
    title: fallback.title,
    badge: fallback.badge,
  };
}

function getFallbackAccounts(): FormattedAccount[] {
  return DEV_PERSONAS.map((p) => ({
    id: p.id,
    name: p.name,
    firstName: p.name.split(" ")[0] || "",
    lastName: p.name.split(" ").slice(1).join(" ") || "",
    email: p.email,
    role: p.role,
    isProfileComplete: true,
    badge: p.badge,
    title: p.title,
  }));
}

async function fetchAccounts(db: Database | null): Promise<FormattedAccount[]> {
  if (!db) {
    return getFallbackAccounts();
  }

  const dbUsers = await getAllUsersWithAffiliations(db);
  if (dbUsers.length === 0) {
    return getFallbackAccounts();
  }

  return dbUsers.map(formatAccountFromDb);
}

async function fetchPersonas(db: Database | null) {
  if (!db) {
    return DEV_PERSONAS;
  }

  const [adminFallback, instructorFallback, studentFallback] = DEV_PERSONAS;

  const admin = await getUserWithAffiliations(db, adminFallback.id);
  const instructor = await getUserWithAffiliations(db, instructorFallback.id);
  const student = await getUserWithAffiliations(db, studentFallback.id);

  if (!admin || !instructor || !student) {
    return DEV_PERSONAS;
  }

  return [
    formatPersona(admin, adminFallback),
    formatPersona(instructor, instructorFallback),
    formatPersona(student, studentFallback),
  ];
}

async function fetchCurrentUser(db: Database | null, userId: string | null) {
  if (!db || !userId) {
    return null;
  }

  const user = await getUserWithAffiliations(db, userId);
  if (!user) return null;

  return {
    id: user.id,
    name: user.displayName ?? `${user.firstName} ${user.lastName}`.trim(),
    email: user.affiliations[0]?.email ?? "",
    role: (user.affiliations[0]?.role as UserRole) ?? "student",
    affiliations: user.affiliations,
    isProfileComplete: isUserProfileComplete(user),
  };
}

async function handleMeLoader(
  db: Database | null,
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

async function handleCreateAccount(db: Database | null, targetRole: UserRole) {
  if (!db) {
    const mockId = `new-${targetRole}-${Date.now().toString(36)}`;
    const newMockAccount: FormattedAccount = {
      id: mockId,
      name: `New ${resolveRoleBadge(targetRole)} (Pending Onboarding)`,
      firstName: "",
      lastName: "",
      email: "",
      role: targetRole,
      isProfileComplete: false,
      badge: resolveRoleBadge(targetRole),
      title: resolveRoleTitle(targetRole, false),
    };
    return Response.json({ success: true, account: newMockAccount });
  }

  const defaultInst = await db.select().from(institutions).limit(1);
  const institutionId = defaultInst[0]?.id ?? "aptispace-orbital-academy";

  let cohortId: string | null = null;
  if (targetRole === "student") {
    const defaultCohort = await db.select().from(cohorts).limit(1);
    cohortId = defaultCohort[0]?.id ?? null;
  }

  const createdUser = await createUser(db, {
    firstName: "",
    lastName: "",
    displayName: null,
    githubId: null,
  });

  await createAffiliation(db, {
    userId: createdUser.id,
    institutionId,
    cohortId,
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

export async function action({ request, context }: ActionFunctionArgs) {
  const body = (await request.json().catch(() => ({}))) as {
    action?: string;
    role?: UserRole;
  };

  const db = getDatabaseFromContext(context);

  if (body.action === "seed" && db) {
    const result = await seedDatabase(db);
    return Response.json({ seeded: true, result });
  }

  if (body.action === "createAccount") {
    return handleCreateAccount(db, body.role ?? "student");
  }

  return Response.json({ error: "Invalid action" }, { status: 400 });
}
