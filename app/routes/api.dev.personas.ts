import type { LoaderFunctionArgs } from "react-router";
import { getDatabaseFromContext } from "~/db";
import { getUserWithAffiliations } from "~/services/userService";
import { DEV_PERSONAS } from "~/utils/auth";
import { getSession } from "~/utils/session.server";

type DbClient = Parameters<typeof getUserWithAffiliations>[0];
type PersonaItem = (typeof DEV_PERSONAS)[number];

async function resolvePersona(db: DbClient, persona: PersonaItem) {
  const user = await getUserWithAffiliations(db, persona.id);
  const displayName = user?.displayName || persona.name;
  return { ...persona, name: displayName };
}

async function fetchPersonas(db: DbClient) {
  if (DEV_PERSONAS.length === 0) return [];
  return Promise.all(DEV_PERSONAS.map((p) => resolvePersona(db, p)));
}

export async function loader({ request, context }: LoaderFunctionArgs) {
  const isDev =
    typeof process !== "undefined" && process.env.NODE_ENV !== "production";
  const session = await getSession(request);

  if (!isDev && session?.role !== "admin") {
    return Response.json(
      { error: "Forbidden: Development utility only", code: "FORBIDDEN" },
      { status: 403 },
    );
  }

  const db = getDatabaseFromContext(context);
  if (!db) {
    return Response.json({ personas: DEV_PERSONAS });
  }

  const personas = await fetchPersonas(db);
  return Response.json({ personas });
}
