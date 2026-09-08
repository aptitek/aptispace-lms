import type { Database } from "../db/index";
import { auditLogs, type AuditLog, type NewAuditLog } from "../db/schema";

async function resolveExistingUserId(
  db: Database,
  userId?: string | null,
): Promise<string | null> {
  if (!userId) return null;
  const dbAny = db as unknown as {
    query?: {
      users?: {
        findFirst: (options: {
          where: (
            u: unknown,
            op: { eq: (a: unknown, b: unknown) => unknown },
          ) => unknown;
        }) => Promise<{ id: string } | null | undefined>;
      };
    };
  };

  if (dbAny?.query?.users) {
    try {
      const user = await dbAny.query.users.findFirst({
        where: (u, { eq }) => eq((u as { id: unknown }).id, userId),
      });
      return user ? user.id : null;
    } catch {
      return null;
    }
  }
  return userId;
}

export async function logAudit(
  db: Database,
  auditFields: Omit<NewAuditLog, "createdAt">,
): Promise<AuditLog> {
  const now = new Date();
  const validUserId = await resolveExistingUserId(db, auditFields.userId);

  try {
    const [log] = await db
      .insert(auditLogs)
      .values({
        ...auditFields,
        userId: validUserId,
        createdAt: now,
      })
      .returning();

    return (
      log ?? {
        id: crypto.randomUUID(),
        tableName: auditFields.tableName,
        recordId: auditFields.recordId,
        action: auditFields.action,
        userId: validUserId,
        oldValues: auditFields.oldValues ?? null,
        newValues: auditFields.newValues ?? null,
        createdAt: now,
      }
    );
  } catch (error) {
    try {
      const [fallbackLog] = await db
        .insert(auditLogs)
        .values({
          ...auditFields,
          userId: null,
          createdAt: now,
        })
        .returning();
      if (fallbackLog) return fallbackLog;
    } catch {
      // Best-effort fallback
    }

    console.error("[AuditLog Error] Failed to write audit record:", error);
    return {
      id: crypto.randomUUID(),
      tableName: auditFields.tableName,
      recordId: auditFields.recordId,
      action: auditFields.action,
      userId: null,
      oldValues: auditFields.oldValues ?? null,
      newValues: auditFields.newValues ?? null,
      createdAt: now,
    };
  }
}

function resolveAuditActorId(
  session?: {
    userId?: string;
    originalUserId?: string;
    impersonating?: boolean;
  } | null,
): { actorUserId?: string; isImpersonating: boolean } {
  const isImpersonating = Boolean(
    session?.impersonating && session?.originalUserId,
  );
  return {
    isImpersonating,
    actorUserId: isImpersonating
      ? session?.originalUserId
      : (session?.userId ?? undefined),
  };
}

function mergeImpersonationMetadata(
  newValuesString: string | undefined | null,
  meta: Record<string, unknown>,
): string {
  if (!newValuesString) {
    return JSON.stringify(meta);
  }
  try {
    const parsed = JSON.parse(newValuesString);
    return JSON.stringify({ ...parsed, ...meta });
  } catch {
    return newValuesString;
  }
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
  const { actorUserId, isImpersonating } = resolveAuditActorId(session);

  let newValues = auditFields.newValues;
  if (isImpersonating) {
    newValues = mergeImpersonationMetadata(newValues, {
      actorUserId,
      impersonatedUserId: session?.userId,
      targetUserId: auditFields.targetUserId,
      isImpersonated: true,
    });
  }

  return logAudit(db, {
    tableName: auditFields.tableName,
    recordId: auditFields.recordId,
    action: auditFields.action,
    userId: actorUserId,
    oldValues: auditFields.oldValues,
    newValues: newValues ?? undefined,
  });
}
