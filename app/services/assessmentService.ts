import { eq } from "drizzle-orm";
import type { Database } from "../db/index";
import {
  submissions,
  grades,
  auditLogs,
  type Submission,
  type NewSubmission,
  type Grade,
  type AuditLog,
  type NewAuditLog,
} from "../db/schema";

export async function getSubmissionsForModule(db: Database, moduleId: string) {
  return db.query.submissions.findMany({
    where: eq(submissions.moduleId, moduleId),
    with: {
      user: true,
      group: {
        with: {
          members: {
            with: {
              user: true,
            },
          },
        },
      },
      grades: {
        with: {
          criterion: true,
        },
      },
    },
  });
}

export async function getSubmissionById(db: Database, submissionId: string) {
  return db.query.submissions.findFirst({
    where: eq(submissions.id, submissionId),
    with: {
      user: true,
      group: true,
      module: {
        with: {
          criteria: true,
        },
      },
      grades: {
        with: {
          criterion: true,
        },
      },
    },
  });
}

export async function createSubmission(
  db: Database,
  submissionFields: Omit<NewSubmission, "submittedAt" | "updatedAt">,
): Promise<Submission> {
  const now = new Date();
  const [created] = await db
    .insert(submissions)
    .values({
      ...submissionFields,
      submittedAt: now,
      updatedAt: now,
    })
    .returning();
  return created;
}

export async function gradeSubmission(
  db: Database,
  input: {
    submissionId: string;
    criteriaId: string;
    score: number;
    feedback?: string;
    graderUserId?: string;
  },
): Promise<Grade> {
  const now = new Date();

  const existing = await db
    .select()
    .from(grades)
    .where(eq(grades.submissionId, input.submissionId));

  const matchedGrade = existing.find((g) => g.criteriaId === input.criteriaId);

  let resultGrade: Grade;

  if (matchedGrade) {
    const [updated] = await db
      .update(grades)
      .set({
        score: input.score,
        feedback: input.feedback,
        updatedAt: now,
      })
      .where(eq(grades.id, matchedGrade.id))
      .returning();

    resultGrade = updated;

    await logAudit(db, {
      tableName: "grades",
      recordId: matchedGrade.id,
      action: "UPDATE",
      userId: input.graderUserId,
      oldValues: JSON.stringify({
        score: matchedGrade.score,
        feedback: matchedGrade.feedback,
      }),
      newValues: JSON.stringify({
        score: input.score,
        feedback: input.feedback,
      }),
    });
  } else {
    const [created] = await db
      .insert(grades)
      .values({
        submissionId: input.submissionId,
        criteriaId: input.criteriaId,
        score: input.score,
        feedback: input.feedback,
        createdAt: now,
        updatedAt: now,
      })
      .returning();

    resultGrade = created;

    await logAudit(db, {
      tableName: "grades",
      recordId: created.id,
      action: "INSERT",
      userId: input.graderUserId,
      newValues: JSON.stringify({
        score: input.score,
        feedback: input.feedback,
      }),
    });
  }

  return resultGrade;
}

export async function logAudit(
  db: Database,
  auditFields: Omit<NewAuditLog, "createdAt">,
): Promise<AuditLog> {
  const now = new Date();
  const [log] = await db
    .insert(auditLogs)
    .values({
      ...auditFields,
      createdAt: now,
    })
    .returning();
  return log;
}

export async function logImpersonatedAudit(
  db: Database,
  session:
    | {
        userId?: string;
        originalUserId?: string;
        impersonating?: boolean;
        role?: string;
      }
    | null
    | undefined,
  auditFields: Omit<NewAuditLog, "createdAt" | "userId"> & {
    targetUserId?: string;
  },
): Promise<AuditLog> {
  const isImpersonating = Boolean(
    session?.impersonating && session?.originalUserId,
  );
  const actorUserId = isImpersonating
    ? session?.originalUserId
    : (session?.userId ?? undefined);

  let newValuesString = auditFields.newValues;

  if (isImpersonating) {
    const impersonationMeta = {
      actorUserId,
      impersonatedUserId: session?.userId,
      targetUserId: auditFields.targetUserId,
      isImpersonated: true,
    };

    if (newValuesString) {
      try {
        const parsed = JSON.parse(newValuesString);
        newValuesString = JSON.stringify({ ...parsed, ...impersonationMeta });
      } catch {
        // If not JSON, retain as is
      }
    } else {
      newValuesString = JSON.stringify(impersonationMeta);
    }
  }

  return logAudit(db, {
    tableName: auditFields.tableName,
    recordId: auditFields.recordId,
    action: auditFields.action,
    userId: actorUserId,
    oldValues: auditFields.oldValues,
    newValues: newValuesString,
  });
}
