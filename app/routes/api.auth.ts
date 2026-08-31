import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { getDatabaseFromContext, type Database } from "~/db";
import {
  getUserWithAffiliations,
  getAllUsersWithAffiliations,
  createUser,
  createAffiliation,
  isUserProfileComplete,
} from "~/services/userService";
import { seedDatabase, resetDatabase } from "~/db/seed";
import { institutions, cohorts } from "~/db/schema";
import {
  DEV_PERSONAS,
  type PersonaDefinition,
  type AccountDefinition,
  type UserRole,
  resetInMemoryAccounts,
  getInitialFallbackAccounts,
  findInMemoryAccount,
  updateInMemoryAccount,
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

function getFallbackAccounts(): FormattedAccount[] {
  return getInitialFallbackAccounts().map((a) => ({
    id: a.id,
    name: a.name,
    firstName: a.firstName?.trim() ?? "",
    lastName: (a.lastName ?? "").trim().toUpperCase(),
    email: a.email,
    role: a.role,
    isProfileComplete: Boolean(a.isProfileComplete),
    badge: a.badge,
    title: a.title,
  }));
}

async function fetchAccounts(db: Database | null): Promise<FormattedAccount[]> {
  if (!db) {
    return getFallbackAccounts();
  }

  const dbUsers = await getAllUsersWithAffiliations(db);
  return dbUsers.map(formatAccountFromDb);
}

async function fetchPersonas(db: Database | null) {
  if (!db) {
    return DEV_PERSONAS;
  }

  if (DEV_PERSONAS.length === 0) {
    return [];
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

function formatDbCurrentUser(user: UserWithAffiliationsResult) {
  const name =
    user.displayName ??
    `${user.firstName?.trim() || ""} ${(user.lastName || "").trim().toUpperCase()}`.trim();
  return {
    id: user.id,
    name: name || "User",
    email: user.affiliations[0]?.email ?? "",
    role: (user.affiliations[0]?.role as UserRole) ?? "student",
    affiliations: user.affiliations,
    isProfileComplete: isUserProfileComplete(user),
  };
}

function formatInMemoryCurrentUser(inMem: AccountDefinition) {
  const firstName = inMem.firstName?.trim() || "";
  const lastName = (inMem.lastName || "").trim().toUpperCase();
  const isComplete = Boolean(firstName && lastName);
  const fullName = `${firstName} ${lastName}`.trim();
  return {
    id: inMem.id,
    name: inMem.name || fullName || "User",
    email: inMem.email,
    role: inMem.role,
    affiliations: [
      {
        institutionId: inMem.institutionId ?? "school-aptitek",
        cohortId: inMem.cohortId ?? null,
        email: inMem.email,
        role: inMem.role,
      },
    ],
    isProfileComplete: isComplete,
  };
}

async function fetchCurrentUser(db: Database | null, userId: string | null) {
  if (!userId) return null;

  if (db) {
    const user = await getUserWithAffiliations(db, userId);
    return user ? formatDbCurrentUser(user) : null;
  }

  const inMem = findInMemoryAccount(userId);
  return inMem ? formatInMemoryCurrentUser(inMem) : null;
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

async function ensureDefaultInstitutionAndCohort(db: Database) {
  let inst = await db.query.institutions.findFirst({
    where: (inst, { eq }) => eq(inst.slug, "aptitek"),
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

async function handleCreateAccount(db: Database | null, targetRole: UserRole) {
  if (!db) {
    const mockId = `new-${targetRole}-${Date.now().toString(36)}`;
    const newMockAccount = updateInMemoryAccount(mockId, {
      id: mockId,
      name: `New ${resolveRoleBadge(targetRole)} (Pending Onboarding)`,
      firstName: "",
      lastName: "",
      email: "",
      role: targetRole,
      isProfileComplete: false,
      badge: resolveRoleBadge(targetRole),
      title: resolveRoleTitle(targetRole, false),
    });
    return Response.json({ success: true, account: newMockAccount });
  }

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

export async function action({ request, context }: ActionFunctionArgs) {
  const body = (await request.json().catch(() => ({}))) as {
    action?: string;
    role?: UserRole;
  };

  const db = getDatabaseFromContext(context);

  if (body.action === "reset" || body.action === "empty") {
    resetInMemoryAccounts();
    if (db) {
      await resetDatabase(db);
    }
    return Response.json({ success: true, reset: true });
  }

  if (body.action === "seed" && db) {
    const result = await seedDatabase(db);
    return Response.json({ seeded: true, result });
  }

  if (body.action === "createAccount") {
    return handleCreateAccount(db, body.role ?? "student");
  }

  return Response.json({ error: "Invalid action" }, { status: 400 });
}
