import { eq } from "drizzle-orm";
import type { Database } from "../db/index";
import {
  sessions,
  seances,
  groups,
  groupMembers,
  type Session,
  type NewSession,
  type Seance,
  type NewSeance,
  type Group,
  type NewGroup,
} from "../db/schema";

export async function getSessionsForCohort(db: Database, cohortId: string) {
  return db.query.sessions.findMany({
    where: eq(sessions.cohortId, cohortId),
    with: {
      course: true,
      seances: true,
      groups: {
        with: {
          members: {
            with: {
              user: true,
            },
          },
        },
      },
    },
  });
}

export async function getSessionDetails(db: Database, sessionId: string) {
  return db.query.sessions.findFirst({
    where: eq(sessions.id, sessionId),
    with: {
      course: {
        with: {
          modules: true,
        },
      },
      cohort: {
        with: {
          institution: true,
        },
      },
      seances: true,
      groups: {
        with: {
          members: {
            with: {
              user: true,
            },
          },
        },
      },
    },
  });
}

export async function createSession(
  db: Database,
  sessionFields: Omit<NewSession, "createdAt" | "updatedAt">,
): Promise<Session> {
  const now = new Date();
  const [created] = await db
    .insert(sessions)
    .values({
      ...sessionFields,
      createdAt: now,
      updatedAt: now,
    })
    .returning();
  return created;
}

export async function createSeance(
  db: Database,
  seanceFields: Omit<NewSeance, "createdAt" | "updatedAt">,
): Promise<Seance> {
  const now = new Date();
  const [created] = await db
    .insert(seances)
    .values({
      ...seanceFields,
      createdAt: now,
      updatedAt: now,
    })
    .returning();
  return created;
}

export async function createGroup(
  db: Database,
  groupFields: Omit<NewGroup, "createdAt" | "updatedAt">,
  memberUserIds: string[] = [],
): Promise<Group> {
  const now = new Date();
  const [group] = await db
    .insert(groups)
    .values({
      ...groupFields,
      createdAt: now,
      updatedAt: now,
    })
    .returning();

  for (const userId of memberUserIds) {
    await db
      .insert(groupMembers)
      .values({
        groupId: group.id,
        userId,
        joinedAt: now,
      })
      .onConflictDoNothing();
  }

  return group;
}

export async function addUserToGroup(
  db: Database,
  groupId: string,
  userId: string,
) {
  const now = new Date();
  return db
    .insert(groupMembers)
    .values({
      groupId,
      userId,
      joinedAt: now,
    })
    .onConflictDoNothing();
}
