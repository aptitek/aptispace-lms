import { eq, desc, and } from "drizzle-orm";
import type { Database } from "../db/index";
import {
  institutions,
  cohorts,
  affiliations,
  users,
  type Institution,
  type Cohort,
} from "../db/schema";
import { logAudit } from "./assessmentService";

export async function getAllInstitutions(db: Database): Promise<Institution[]> {
  return db.select().from(institutions).orderBy(institutions.name);
}

export async function getAllCohorts(db: Database): Promise<Cohort[]> {
  return db
    .select()
    .from(cohorts)
    .orderBy(desc(cohorts.startDate), desc(cohorts.createdAt), cohorts.name);
}

export async function getCohortsByInstitution(
  db: Database,
  institutionId: string,
): Promise<Cohort[]> {
  return db
    .select()
    .from(cohorts)
    .where(eq(cohorts.institutionId, institutionId))
    .orderBy(desc(cohorts.startDate), desc(cohorts.createdAt), cohorts.name);
}

export interface AddStudentCohortParams {
  userId: string;
  cohortId: string;
  institutionId?: string;
  actorUserId?: string;
}

async function resolveUserEmail(db: Database, userId: string): Promise<string> {
  const existingAffil = await db
    .select()
    .from(affiliations)
    .where(eq(affiliations.userId, userId))
    .limit(1);

  if (existingAffil[0]?.email) {
    return existingAffil[0].email;
  }

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  if (user?.firstName && user?.lastName) {
    return `${user.firstName.toLowerCase()}.${user.lastName.toLowerCase()}@aptitek.io`;
  }
  return "student@aptitek.io";
}

async function upsertAffiliationRecord(
  db: Database,
  params: {
    userId: string;
    institutionId: string;
    cohortId: string;
    email: string;
  },
) {
  const { userId, institutionId, cohortId, email } = params;

  const unassigned = await db
    .select()
    .from(affiliations)
    .where(
      and(
        eq(affiliations.userId, userId),
        eq(affiliations.cohortId, null as unknown as string),
      ),
    )
    .limit(1);

  if (unassigned.length > 0) {
    const [updated] = await db
      .update(affiliations)
      .set({ institutionId, cohortId, updatedAt: new Date() })
      .where(eq(affiliations.id, unassigned[0].id))
      .returning();
    return updated;
  }

  const [created] = await db
    .insert(affiliations)
    .values({
      userId,
      institutionId,
      cohortId,
      email,
      role: "student",
      isActive: true,
    })
    .returning();
  return created;
}

export async function addStudentToCohort(
  db: Database,
  params: AddStudentCohortParams,
) {
  const { userId, cohortId, actorUserId } = params;

  const [cohort] = await db
    .select()
    .from(cohorts)
    .where(eq(cohorts.id, cohortId))
    .limit(1);

  if (!cohort) {
    throw new Error(`Cohort ${cohortId} not found`);
  }

  const institutionId = params.institutionId || cohort.institutionId;

  const existingAffils = await db
    .select()
    .from(affiliations)
    .where(
      and(eq(affiliations.userId, userId), eq(affiliations.cohortId, cohortId)),
    )
    .limit(1);

  if (existingAffils.length > 0) {
    return existingAffils[0];
  }

  const email = await resolveUserEmail(db, userId);
  const resultAffil = await upsertAffiliationRecord(db, {
    userId,
    institutionId,
    cohortId,
    email,
  });

  if (actorUserId) {
    await logAudit(db, {
      tableName: "affiliations",
      recordId: resultAffil.id,
      action: "INSERT",
      userId: actorUserId,
      newValues: JSON.stringify({ userId, institutionId, cohortId }),
    });
  }

  return resultAffil;
}

export interface RemoveStudentCohortParams {
  userId: string;
  cohortId: string;
  actorUserId?: string;
}

export async function removeStudentFromCohort(
  db: Database,
  params: RemoveStudentCohortParams,
) {
  const { userId, cohortId, actorUserId } = params;

  const targetAffils = await db
    .select()
    .from(affiliations)
    .where(
      and(eq(affiliations.userId, userId), eq(affiliations.cohortId, cohortId)),
    );

  if (!Array.isArray(targetAffils) || targetAffils.length === 0) {
    return { success: true, count: 0 };
  }

  for (const affil of targetAffils) {
    await db.delete(affiliations).where(eq(affiliations.id, affil.id));
    if (actorUserId) {
      await logAudit(db, {
        tableName: "affiliations",
        recordId: affil.id,
        action: "DELETE",
        userId: actorUserId,
        oldValues: JSON.stringify(affil),
      });
    }
  }

  return { success: true, count: targetAffils.length };
}

export interface AssignStudentCohortParams {
  userId: string;
  institutionId: string;
  cohortId: string | null;
  actorUserId?: string;
}

export async function assignStudentCohort(
  db: Database,
  params: AssignStudentCohortParams,
) {
  if (params.cohortId) {
    return addStudentToCohort(db, {
      userId: params.userId,
      cohortId: params.cohortId,
      institutionId: params.institutionId,
      actorUserId: params.actorUserId,
    });
  }
  return null;
}
