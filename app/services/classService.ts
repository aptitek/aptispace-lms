import { eq, or, inArray, and } from "drizzle-orm";
import type { Database } from "../db/index";
import { users, affiliations, type User } from "../db/schema";
import type { UserRole } from "../utils/auth";

export interface Class {
  id: string;
  sessionId: string;
  instructorId: string | null;
  title: string;
  description: string | null;
  isRemote: boolean;
  startTime: Date;
  endTime: Date;
  location: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export type NewClass = Partial<Class>;

export interface ClassWithDetails extends Class {
  session: {
    id: string;
    courseId: string;
    cohortId: string;
    course: {
      id: string;
      title: string;
      description?: string | null;
    };
    cohort?: {
      id: string;
      diploma?: string | null;
      year?: number | null;
      description?: string | null;
    } | null;
  };
  instructor?: {
    id: string;
    displayName?: string | null;
    firstName: string;
    lastName: string;
    avatarUrl?: string | null;
    email?: string | null;
    role?: UserRole;
  } | null;
}

export interface EligibleInstructor {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "admin" | "instructor";
  avatarUrl?: string | null;
}

export async function getClassesForUser(
  _db: Database,
  _user: {
    id: string;
    role: UserRole | string;
    cohort?: { id?: string } | null;
    cohortId?: string | null;
  },
): Promise<ClassWithDetails[]> {
  // Roguelike schema replaces legacy scheduled classes with async module activities
  return [];
}

export async function getClassById(
  _db: Database,
  _id: string,
): Promise<ClassWithDetails | null> {
  return null;
}

export async function createClass(
  _db: Database,
  _input: Omit<NewClass, "createdAt" | "updatedAt">,
): Promise<Class | null> {
  return null;
}

export async function updateClass(
  _db: Database,
  _id: string,
  _input: Partial<Omit<NewClass, "id" | "createdAt" | "updatedAt">>,
): Promise<Class | null> {
  return null;
}

export async function deleteClass(
  _db: Database,
  _id: string,
): Promise<boolean> {
  return false;
}

/**
 * Retrieve eligible instructors (users who are admin or instructor)
 */
export async function getEligibleInstructors(
  db: Database,
): Promise<EligibleInstructor[]> {
  const matchingAffils = await db
    .select({
      userId: affiliations.userId,
      email: affiliations.email,
      role: affiliations.role,
    })
    .from(affiliations)
    .where(
      and(
        or(eq(affiliations.role, "admin"), eq(affiliations.role, "instructor")),
        eq(affiliations.isActive, true),
      ),
    );

  const userIds = Array.from(new Set(matchingAffils.map((a) => a.userId)));
  if (userIds.length === 0) return [];

  const foundUsers = await db
    .select()
    .from(users)
    .where(inArray(users.id, userIds));

  const roleMap = new Map<
    string,
    { email: string; role: "admin" | "instructor" }
  >();
  for (const a of matchingAffils) {
    roleMap.set(a.userId, {
      email: a.email,
      role: a.role as "admin" | "instructor",
    });
  }

  return foundUsers.map((u) => {
    const roleInfo = roleMap.get(u.id);
    const name = u.displayName || `${u.firstName} ${u.lastName}`.trim();
    return {
      id: u.id,
      name,
      firstName: u.firstName,
      lastName: u.lastName,
      email: roleInfo?.email || u.githubEmail || "",
      role: roleInfo?.role || "instructor",
      avatarUrl: u.avatarUrl,
    };
  });
}

export async function getUserByCalendarFeedToken(
  db: Database,
  token: string,
): Promise<(User & { role: UserRole; cohortId?: string | null }) | null> {
  if (!token || token.trim().length === 0) return null;

  const [foundUser] = await db
    .select()
    .from(users)
    .where(eq(users.calendarFeedToken, token))
    .limit(1);

  if (!foundUser) return null;

  const [affil] = await db
    .select()
    .from(affiliations)
    .where(
      and(
        eq(affiliations.userId, foundUser.id),
        eq(affiliations.isActive, true),
      ),
    )
    .limit(1);

  const role = (affil?.role as UserRole) || "student";
  const cohortId = affil?.cohortId || null;

  return {
    ...foundUser,
    role,
    cohortId,
  };
}

export async function regenerateCalendarFeedToken(
  db: Database,
  userId: string,
): Promise<string> {
  const newToken = crypto.randomUUID();
  const [updated] = await db
    .update(users)
    .set({
      calendarFeedToken: newToken,
      updatedAt: new Date(),
    })
    .where(eq(users.id, userId))
    .returning({ token: users.calendarFeedToken });

  return updated?.token || newToken;
}

export async function ensureCalendarFeedToken(
  db: Database,
  userId: string,
): Promise<string> {
  const [u] = await db
    .select({ token: users.calendarFeedToken })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  if (u?.token) {
    return u.token;
  }

  return regenerateCalendarFeedToken(db, userId);
}
