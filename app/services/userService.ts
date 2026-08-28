import { eq } from "drizzle-orm";
import type { Database } from "../db/index";
import {
  users,
  affiliations,
  type User,
  type NewUser,
  type Affiliation,
  type NewAffiliation,
} from "../db/schema";

export async function getUsers(db: Database): Promise<User[]> {
  return db.select().from(users);
}

export async function getUserById(
  db: Database,
  id: string,
): Promise<User | null> {
  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result[0] ?? null;
}

export async function getUserByGithubId(
  db: Database,
  githubId: string,
): Promise<User | null> {
  const result = await db
    .select()
    .from(users)
    .where(eq(users.githubId, githubId))
    .limit(1);
  return result[0] ?? null;
}

export async function getUserWithAffiliations(db: Database, id: string) {
  const user = await db.query.users.findFirst({
    where: eq(users.id, id),
    with: {
      affiliations: {
        with: {
          institution: true,
          cohort: true,
        },
      },
    },
  });
  return user ?? null;
}

export async function createUser(
  db: Database,
  userFields: Omit<NewUser, "createdAt" | "updatedAt">,
): Promise<User> {
  const now = new Date();
  const [created] = await db
    .insert(users)
    .values({
      ...userFields,
      createdAt: now,
      updatedAt: now,
    })
    .returning();
  return created;
}

export async function createAffiliation(
  db: Database,
  affiliationFields: Omit<NewAffiliation, "createdAt" | "updatedAt">,
): Promise<Affiliation> {
  const now = new Date();
  const [created] = await db
    .insert(affiliations)
    .values({
      ...affiliationFields,
      createdAt: now,
      updatedAt: now,
    })
    .returning();
  return created;
}

export async function getAffiliationsForUser(
  db: Database,
  userId: string,
): Promise<Affiliation[]> {
  return db.select().from(affiliations).where(eq(affiliations.userId, userId));
}
