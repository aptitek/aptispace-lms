import { eq, or, inArray, and } from "drizzle-orm";
import type { Database } from "../db/index";
import {
  classes,
  sessions,
  users,
  affiliations,
  type Class,
  type NewClass,
  type User,
} from "../db/schema";
import type { UserRole } from "../utils/auth";

/**
 * Domain Invariant:
 * Calendar events in AptiSpace LMS model exclusively timetabled classes
 * linked to an academic session and assigned instructor.
 * Asynchronous pedagogical activities (modules, homework, projects) are NOT calendar events.
 */
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
  db: Database,
  user: {
    id: string;
    role: UserRole | string;
    cohort?: { id?: string } | null;
    cohortId?: string | null;
  },
): Promise<ClassWithDetails[]> {
  const role = user.role as UserRole;

  // 1. Admin: View all classes across all courses, cohorts, and instructors
  if (role === "admin") {
    const rawClasses = await db.query.classes.findMany({
      with: {
        session: {
          with: {
            course: true,
            cohort: true,
          },
        },
        instructor: true,
      },
      orderBy: (c, { asc }) => [asc(c.startTime)],
    });

    return formatClassesWithInstructors(
      db,
      rawClasses as unknown as RawClassQuery[],
    );
  }

  // 2. Instructor: View ONLY classes assigned to them
  if (role === "instructor") {
    const rawClasses = await db.query.classes.findMany({
      where: eq(classes.instructorId, user.id),
      with: {
        session: {
          with: {
            course: true,
            cohort: true,
          },
        },
        instructor: true,
      },
      orderBy: (c, { asc }) => [asc(c.startTime)],
    });

    return formatClassesWithInstructors(
      db,
      rawClasses as unknown as RawClassQuery[],
    );
  }

  // 3. Student: View ONLY classes for their affiliated cohort
  const targetCohortId = user.cohort?.id || user.cohortId;

  // If no cohort is directly supplied on user object, resolve from affiliations
  let studentCohortId = targetCohortId;
  if (!studentCohortId) {
    const affils = await db
      .select({ cohortId: affiliations.cohortId })
      .from(affiliations)
      .where(
        and(eq(affiliations.userId, user.id), eq(affiliations.isActive, true)),
      );
    studentCohortId = affils.find((a) => a.cohortId)?.cohortId ?? null;
  }

  if (!studentCohortId) {
    return [];
  }

  // Find all session IDs for student's cohort
  const cohortSessions = await db
    .select({ id: sessions.id })
    .from(sessions)
    .where(eq(sessions.cohortId, studentCohortId));

  const sessionIds = cohortSessions.map((s) => s.id);
  if (sessionIds.length === 0) {
    return [];
  }

  const rawClasses = await db.query.classes.findMany({
    where: inArray(classes.sessionId, sessionIds),
    with: {
      session: {
        with: {
          course: true,
          cohort: true,
        },
      },
      instructor: true,
    },
    orderBy: (c, { asc }) => [asc(c.startTime)],
  });

  return formatClassesWithInstructors(
    db,
    rawClasses as unknown as RawClassQuery[],
  );
}

interface RawClassQuery extends Class {
  session: {
    id: string;
    courseId: string;
    cohortId: string;
    course: {
      id: string;
      title: string;
      description: string | null;
    };
    cohort: {
      id: string;
      diploma: string | null;
      year: number | null;
      description: string | null;
    } | null;
  };
  instructor?: User | null;
}

async function formatClassesWithInstructors(
  db: Database,
  rawList: RawClassQuery[],
): Promise<ClassWithDetails[]> {
  if (rawList.length === 0) return [];

  // Resolve emails for instructors
  const instructorIds = Array.from(
    new Set(rawList.map((c) => c.instructorId).filter(Boolean) as string[]),
  );

  const emailMap = new Map<string, { email: string; role: UserRole }>();
  if (instructorIds.length > 0) {
    const affils = await db
      .select({
        userId: affiliations.userId,
        email: affiliations.email,
        role: affiliations.role,
      })
      .from(affiliations)
      .where(inArray(affiliations.userId, instructorIds));

    for (const a of affils) {
      emailMap.set(a.userId, { email: a.email, role: a.role as UserRole });
    }
  }

  return rawList.map((c) => {
    let instructorObj = null;
    if (c.instructor) {
      const affilInfo = emailMap.get(c.instructor.id);
      const name =
        c.instructor.displayName ||
        `${c.instructor.firstName} ${c.instructor.lastName}`.trim();
      instructorObj = {
        id: c.instructor.id,
        displayName: name,
        firstName: c.instructor.firstName,
        lastName: c.instructor.lastName,
        avatarUrl: c.instructor.avatarUrl,
        email: affilInfo?.email || c.instructor.githubEmail || null,
        role: affilInfo?.role || "instructor",
      };
    }

    return {
      ...c,
      instructor: instructorObj,
    };
  });
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

export async function getClassById(
  db: Database,
  id: string,
): Promise<ClassWithDetails | null> {
  const found = await db.query.classes.findFirst({
    where: eq(classes.id, id),
    with: {
      session: {
        with: {
          course: true,
          cohort: true,
        },
      },
      instructor: true,
    },
  });

  if (!found) return null;

  const formatted = await formatClassesWithInstructors(db, [
    found as unknown as RawClassQuery,
  ]);
  return formatted[0] || null;
}

export async function createClass(
  db: Database,
  input: Omit<NewClass, "createdAt" | "updatedAt">,
): Promise<Class> {
  const now = new Date();
  const [created] = await db
    .insert(classes)
    .values({
      ...input,
      createdAt: now,
      updatedAt: now,
    })
    .returning();
  return created;
}

export async function updateClass(
  db: Database,
  id: string,
  input: Partial<Omit<NewClass, "id" | "createdAt" | "updatedAt">>,
): Promise<Class | null> {
  const now = new Date();
  const [updated] = await db
    .update(classes)
    .set({
      ...input,
      updatedAt: now,
    })
    .where(eq(classes.id, id))
    .returning();
  return updated || null;
}

export async function deleteClass(db: Database, id: string): Promise<boolean> {
  const result = await db.delete(classes).where(eq(classes.id, id)).returning();
  return result.length > 0;
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

  // Resolve user's active affiliation role and cohort
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
