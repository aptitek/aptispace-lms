import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { getDatabaseFromContext, type Database } from "~/db";
import { getUserWithAffiliations } from "~/services/userService";
import { seedDatabase } from "~/db/seed";
import { DEV_PERSONAS, type PersonaDefinition } from "~/utils/auth";
import { getSession } from "~/utils/session.server";

type UserWithAffiliationsResult = NonNullable<
  Awaited<ReturnType<typeof getUserWithAffiliations>>
>;

function formatPersona(
  user: UserWithAffiliationsResult,
  fallback: PersonaDefinition,
): PersonaDefinition {
  const primaryAffiliation = user.affiliations[0];
  return {
    id: user.id,
    name: user.displayName ?? `${user.firstName} ${user.lastName}`,
    email: primaryAffiliation?.email ?? fallback.email,
    role: primaryAffiliation?.role ?? fallback.role,
    title: fallback.title,
    badge: fallback.badge,
  };
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
    name: user.displayName ?? `${user.firstName} ${user.lastName}`,
    email: user.affiliations[0]?.email ?? "",
    role: user.affiliations[0]?.role ?? "student",
    affiliations: user.affiliations,
  };
}

export async function loader({ request, context }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const actionType = url.searchParams.get("action") ?? "me";
  const explicitPersonaId = url.searchParams.get("personaId");
  const db = getDatabaseFromContext(context);
  const session = await getSession(request);

  if (actionType === "personas") {
    const personas = await fetchPersonas(db);
    return Response.json({ personas });
  }

  const activeUserId = explicitPersonaId || session?.userId;
  if (actionType === "me" && activeUserId) {
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

export async function action({ request, context }: ActionFunctionArgs) {
  const body = (await request.json().catch(() => ({}))) as {
    action?: string;
  };

  const db = getDatabaseFromContext(context);

  if (body.action === "seed" && db) {
    const result = await seedDatabase(db);
    return Response.json({ seeded: true, result });
  }

  return Response.json({ error: "Invalid action" }, { status: 400 });
}
