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

export async function getAllUsersWithAffiliations(db: Database) {
  return db.query.users.findMany({
    with: {
      affiliations: {
        with: {
          institution: true,
          cohort: true,
        },
      },
    },
    orderBy: (users, { desc }) => [desc(users.createdAt)],
  });
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

export async function updateUser(
  db: Database,
  id: string,
  userFields: Partial<Omit<NewUser, "id" | "createdAt" | "updatedAt">>,
): Promise<User | null> {
  const [updated] = await db
    .update(users)
    .set({
      ...userFields,
      updatedAt: new Date(),
    })
    .where(eq(users.id, id))
    .returning();
  return updated ?? null;
}

export async function updateUserAffiliation(
  db: Database,
  userId: string,
  affiliationFields: Partial<
    Omit<NewAffiliation, "id" | "userId" | "createdAt" | "updatedAt">
  >,
): Promise<Affiliation | null> {
  const existing = await db
    .select()
    .from(affiliations)
    .where(eq(affiliations.userId, userId))
    .limit(1);

  if (existing.length > 0) {
    const [updated] = await db
      .update(affiliations)
      .set({
        ...affiliationFields,
        updatedAt: new Date(),
      })
      .where(eq(affiliations.id, existing[0].id))
      .returning();
    return updated ?? null;
  }

  if (affiliationFields.email && affiliationFields.institutionId) {
    return createAffiliation(db, {
      userId,
      email: affiliationFields.email,
      institutionId: affiliationFields.institutionId,
      cohortId: affiliationFields.cohortId ?? null,
      role: affiliationFields.role ?? "student",
      isActive: affiliationFields.isActive ?? true,
    });
  }

  return null;
}

export function isUserProfileComplete(
  user: Awaited<ReturnType<typeof getUserWithAffiliations>> | null,
): boolean {
  if (!user) return false;
  const hasFirstName = Boolean(
    user.firstName && user.firstName.trim().length > 0,
  );
  const hasLastName = Boolean(user.lastName && user.lastName.trim().length > 0);
  return hasFirstName && hasLastName;
}
