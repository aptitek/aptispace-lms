import { eq } from "drizzle-orm";
import type { Database } from "../db/index";
import {
  modules,
  moduleActivities,
  activityTransitions,
  mapPositions,
  studentDecks,
  type Module,
  type NewModule,
  type ModuleActivity,
  type NewModuleActivity,
  type MapPosition,
  type StudentDeck,
} from "../db/schema";

export async function getModuleById(
  db: Database,
  id: string,
): Promise<Module | null> {
  const [row] = await db
    .select()
    .from(modules)
    .where(eq(modules.id, id))
    .limit(1);
  return row ?? null;
}

export async function getModulesForCohort(
  db: Database,
  cohortId: string,
): Promise<Module[]> {
  return db.select().from(modules).where(eq(modules.cohortId, cohortId));
}

export async function getModuleWithActivities(db: Database, moduleId: string) {
  return db.query.modules.findFirst({
    where: eq(modules.id, moduleId),
    with: {
      cohort: true,
      activities: {
        with: {
          outgoingTransitions: true,
          incomingTransitions: true,
          fights: {
            with: {
              phases: true,
            },
          },
          mapPositions: true,
        },
      },
    },
  });
}

export async function createModule(
  db: Database,
  fields: Omit<NewModule, "createdAt" | "updatedAt">,
): Promise<Module> {
  const now = new Date();
  const [created] = await db
    .insert(modules)
    .values({
      ...fields,
      createdAt: now,
      updatedAt: now,
    })
    .returning();
  return created;
}

export async function createModuleActivity(
  db: Database,
  fields: Omit<NewModuleActivity, "createdAt" | "updatedAt">,
): Promise<ModuleActivity> {
  const now = new Date();
  const [created] = await db
    .insert(moduleActivities)
    .values({
      ...fields,
      createdAt: now,
      updatedAt: now,
    })
    .returning();
  return created;
}

export async function createActivityTransition(
  db: Database,
  fromActivityId: string | null,
  toActivityId: string,
) {
  const [created] = await db
    .insert(activityTransitions)
    .values({
      fromActivityId: fromActivityId ?? undefined,
      toActivityId,
    })
    .returning();
  return created;
}

export async function getMapPositionsForCohort(
  db: Database,
  cohortId: string,
): Promise<MapPosition[]> {
  return db
    .select()
    .from(mapPositions)
    .where(eq(mapPositions.cohortId, cohortId));
}

export async function updateMapPosition(
  db: Database,
  userId: string,
  activityId: string,
  options?: { cohortId?: string; groupId?: string },
): Promise<MapPosition> {
  const now = new Date();
  const existing = await db
    .select()
    .from(mapPositions)
    .where(eq(mapPositions.userId, userId))
    .limit(1);

  if (existing.length > 0) {
    const [updated] = await db
      .update(mapPositions)
      .set({
        activityId,
        cohortId: options?.cohortId ?? existing[0].cohortId,
        groupId: options?.groupId ?? existing[0].groupId,
        updatedAt: now,
      })
      .where(eq(mapPositions.id, existing[0].id))
      .returning();
    return updated;
  }

  const [created] = await db
    .insert(mapPositions)
    .values({
      userId,
      activityId,
      cohortId: options?.cohortId,
      groupId: options?.groupId,
      updatedAt: now,
    })
    .returning();
  return created;
}

export async function getStudentDeck(
  db: Database,
  userId: string,
): Promise<StudentDeck[]> {
  return db.select().from(studentDecks).where(eq(studentDecks.userId, userId));
}

export async function addCardToDeck(
  db: Database,
  userId: string,
  activityId: string,
): Promise<StudentDeck> {
  const now = new Date();
  const [created] = await db
    .insert(studentDecks)
    .values({
      userId,
      activityId,
      acquiredAt: now,
    })
    .onConflictDoNothing()
    .returning();
  return created;
}
