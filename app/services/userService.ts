import { eq } from "drizzle-orm";
import type { Database } from "../db/index";
import {
  users,
  affiliations,
  type User,
  type NewUser,
  type Affiliation,
  type NewAffiliation,
  type Institution,
  type Cohort,
} from "../db/schema";

export type UserWithAffiliations = User & {
  affiliations: (Affiliation & {
    institution?: Institution | null;
    cohort?: Cohort | null;
  })[];
};

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

export async function getUserWithAffiliations(
  db: Database,
  id: string,
): Promise<UserWithAffiliations | null> {
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
  return (user as unknown as UserWithAffiliations) ?? null;
}

export async function getAllUsersWithAffiliations(
  db: Database,
): Promise<UserWithAffiliations[]> {
  const userList = await db.query.users.findMany({
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
  return userList as unknown as UserWithAffiliations[];
}

export async function createUser(
  db: Database,
  userFields: Omit<NewUser, "createdAt" | "updatedAt">,
): Promise<User> {
  const now = new Date();
  const normalizedLastName = userFields.lastName
    ? userFields.lastName.trim().toUpperCase()
    : userFields.lastName;
  const [created] = await db
    .insert(users)
    .values({
      ...userFields,
      lastName: normalizedLastName,
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
  const normalizedFields = { ...userFields };
  if (normalizedFields.lastName !== undefined) {
    normalizedFields.lastName = normalizedFields.lastName.trim().toUpperCase();
  }
  if (normalizedFields.firstName !== undefined) {
    normalizedFields.firstName = normalizedFields.firstName.trim();
  }
  const [updated] = await db
    .update(users)
    .set({
      ...normalizedFields,
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

export async function deleteUser(db: Database, id: string): Promise<boolean> {
  const result = await db
    .delete(users)
    .where(eq(users.id, id))
    .returning({ id: users.id });
  return result.length > 0;
}

export function isUserProfileComplete(
  user: {
    firstName?: string | null;
    lastName?: string | null;
    [key: string]: unknown;
  } | null,
): boolean {
  if (!user) return false;
  const hasFirstName = Boolean(
    user.firstName && user.firstName.trim().length > 0,
  );
  const hasLastName = Boolean(user.lastName && user.lastName.trim().length > 0);
  return hasFirstName && hasLastName;
}
