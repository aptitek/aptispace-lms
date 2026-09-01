import type { Database } from "~/db";
import { institutions } from "~/db/schema";
import type { SchoolConfig } from "~/components/organisms/OnboardingCard/OnboardingCard.types";
import { validateFixedDomainEmail } from "~/utils/emailSecurity";
import { authGuard } from "~/utils/session.server";
import { resolveActiveUser } from "~/utils/auth";
import { logImpersonatedAudit } from "~/services/assessmentService";
import {
  updateUser,
  updateUserAffiliation,
  getUserById,
  createUser,
  isUserProfileComplete,
} from "~/services/userService";
import {
  CADET_FIXED_DOMAIN,
  resolveSchool,
  buildInitialProfile,
} from "./onboarding.helpers";

export interface ValidateActionParams {
  actionType: string;
  firstName: string;
  familyName: string;
  validation: { isValid: boolean; error?: string };
  hasNameFields: boolean;
}

export function validateActionInputs(
  params: ValidateActionParams,
): Response | null {
  const { actionType, firstName, familyName, validation, hasNameFields } =
    params;

  if (actionType !== "update_draft" && !validation.isValid) {
    return Response.json(
      {
        error: validation.error,
        code: "UNAUTHORIZED_EMAIL_DOMAIN",
        errorCode: "UNAUTHORIZED_EMAIL_DOMAIN",
        success: false,
      },
      { status: 400 },
    );
  }

  if (
    actionType === "validate_credential" &&
    hasNameFields &&
    (!firstName || !familyName)
  ) {
    return Response.json(
      {
        error: "First Name and Family Name are required.",
        code: "MISSING_REQUIRED_FIELDS",
        errorCode: "MISSING_REQUIRED_FIELDS",
        success: false,
      },
      { status: 400 },
    );
  }

  return null;
}

export interface SaveUserEditsParams {
  db: unknown;
  userId?: string | null;
  firstName: string;
  familyName: string;
  fullEmail?: string;
  schoolId: string;
  hasNameFields?: boolean;
}

async function findExistingInstitutionId(
  db: Database,
  schoolId?: string,
): Promise<string | undefined> {
  if (!schoolId) return undefined;
  const slugCandidate = schoolId.replace(/^school-/, "");
  const inst = await db.query.institutions.findFirst({
    where: (i, { eq, or }) => or(eq(i.id, schoolId), eq(i.slug, slugCandidate)),
  });
  return inst?.id;
}

async function resolveTargetInstitutionId(
  db: Database,
  schoolId?: string,
): Promise<string> {
  const existingId = await findExistingInstitutionId(db, schoolId);
  if (existingId) return existingId;

  const anyInst = await db.query.institutions.findFirst();
  if (anyInst) return anyInst.id;

  const now = new Date();
  const [created] = await db
    .insert(institutions)
    .values({
      name: "Aptitek",
      slug: "aptitek",
      type: "academic",
      logoUrl: "/aptitek-logo.svg",
      createdAt: now,
      updatedAt: now,
    })
    .returning();
  return created.id;
}

interface SyncUserRecordParams {
  db: Database;
  userId: string;
  firstName: string;
  familyName: string;
  displayName: string;
  hasNameFields?: boolean;
}

async function updateExistingUser(
  db: Database,
  userId: string,
  existingUser: NonNullable<Awaited<ReturnType<typeof getUserById>>>,
  params: SyncUserRecordParams,
) {
  if (params.hasNameFields || params.firstName || params.familyName) {
    await updateUser(db, userId, {
      firstName: params.firstName || existingUser.firstName,
      lastName: params.familyName || existingUser.lastName,
      displayName: params.displayName || null,
    });
  }
}

async function syncUserRecord(params: SyncUserRecordParams) {
  const { db, userId, firstName, familyName, displayName } = params;
  const existingUser = await getUserById(db, userId);

  if (existingUser) {
    await updateExistingUser(db, userId, existingUser, params);
    return;
  }

  const fallbackFirst = firstName || "Student";
  const fallbackFamily = familyName || "CADET";
  await createUser(db, {
    id: userId,
    firstName: fallbackFirst,
    lastName: fallbackFamily,
    displayName: displayName || `${fallbackFirst} ${fallbackFamily}`,
  });
}

export async function saveUserEdits(params: SaveUserEditsParams) {
  const {
    db,
    userId,
    firstName,
    familyName,
    fullEmail,
    schoolId,
    hasNameFields,
  } = params;
  if (!userId || !db) return;

  const trimmedFirst = firstName.trim();
  const trimmedFamily = familyName.trim().toUpperCase();
  const displayName = `${trimmedFirst} ${trimmedFamily}`.trim();

  const typedDb = db as Database;

  await syncUserRecord({
    db: typedDb,
    userId,
    firstName: trimmedFirst,
    familyName: trimmedFamily,
    displayName,
    hasNameFields,
  });

  if (fullEmail !== undefined) {
    const targetInstId = await resolveTargetInstitutionId(typedDb, schoolId);
    await updateUserAffiliation(typedDb, userId, {
      email: fullEmail,
      institutionId: targetInstId,
    });
  }
}

interface ActionFormData {
  actionType: string;
  firstName: string;
  familyName: string;
  rawEmail: string;
  school: SchoolConfig;
  hasNameFields: boolean;
}

function parseActionFormData(formData: FormData): ActionFormData {
  const actionType = String(formData.get("actionType") || "");
  const firstName = String(formData.get("firstName") || "");
  const familyName = String(formData.get("familyName") || "");
  const rawEmail = String(formData.get("email") || "");
  const schoolId = String(formData.get("schoolId") || "");
  const school = resolveSchool(schoolId);
  const hasNameFields = formData.has("firstName") || formData.has("familyName");

  return {
    actionType,
    firstName,
    familyName,
    rawEmail,
    school,
    hasNameFields,
  };
}

function createActionResponse(
  actionType: string,
  fullEmail?: string,
): Response {
  if (actionType === "validate_credential") {
    return Response.json({
      success: true,
      redirect: "/",
      issuedAt: new Date().toISOString(),
    });
  }

  return Response.json({
    success: true,
    draftSaved: true,
    email: fullEmail,
  });
}

async function saveUserEditsIfPresent(
  auth: Awaited<ReturnType<typeof authGuard>>,
  userId: string | undefined | null,
  payload: ActionFormData,
  validation: ReturnType<typeof validateFixedDomainEmail>,
) {
  if (userId) {
    await saveUserEdits({
      db: auth?.db,
      userId,
      firstName: payload.firstName,
      familyName: payload.familyName,
      fullEmail: validation.isValid ? validation.fullEmail : undefined,
      schoolId: payload.school.id,
      hasNameFields: payload.hasNameFields,
    });
  }
}

function classifyErrorMessage(errorMessage: string): {
  errorCode: string;
  isForeignKey: boolean;
} {
  const isForeignKey =
    errorMessage.includes("FOREIGN KEY") ||
    errorMessage.includes("SQLITE_CONSTRAINT");
  return {
    errorCode: isForeignKey ? "FOREIGN_KEY_ERROR" : "DATABASE_ERROR",
    isForeignKey,
  };
}

export async function handleOnboardingAction(
  request: Request,
  context: unknown,
): Promise<Response> {
  try {
    const auth = await authGuard(request, context, { allowAnonymous: true });
    const userId = auth?.session?.userId ?? auth?.user?.id;

    const formData = await request.formData().catch(() => new FormData());
    const payload = parseActionFormData(formData);

    const domain = payload.school.emailDomain || CADET_FIXED_DOMAIN;
    const validation = validateFixedDomainEmail(payload.rawEmail, domain);

    const validationError = validateActionInputs({
      actionType: payload.actionType,
      firstName: payload.firstName,
      familyName: payload.familyName,
      validation,
      hasNameFields: payload.hasNameFields,
    });
    if (validationError) {
      return validationError;
    }

    await saveUserEditsIfPresent(auth, userId, payload, validation);

    if (auth?.session?.impersonating && auth.db && userId) {
      await logImpersonatedAudit(auth.db, auth.session, {
        tableName: "users",
        recordId: userId,
        action: "UPDATE",
        targetUserId: userId,
        newValues: JSON.stringify({
          actionType: payload.actionType,
          firstName: payload.firstName,
          familyName: payload.familyName,
          schoolId: payload.school.id,
        }),
      });
    }

    return createActionResponse(payload.actionType, validation.fullEmail);
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Failed to process onboarding action";
    const { errorCode } = classifyErrorMessage(errorMessage);

    return Response.json(
      {
        success: false,
        error: errorMessage,
        code: errorCode,
        errorCode,
        details: errorMessage,
      },
      {
        status: 400,
        headers: { "Cache-Control": "no-store" },
      },
    );
  }
}

function resolveAuthUserId(
  auth: Awaited<ReturnType<typeof authGuard>>,
): string | null {
  if (auth?.session?.userId) return auth.session.userId;
  if (auth?.user?.id) return auth.user.id;
  return null;
}

function resolveUserSchool(
  user: { affiliations?: Array<{ institutionId?: string }> } | null | undefined,
) {
  const primaryAffil = user?.affiliations?.[0];
  return resolveSchool(primaryAffil?.institutionId);
}

function extractLoaderData(auth: Awaited<ReturnType<typeof authGuard>>) {
  const user = auth?.user ?? null;
  return {
    userId: resolveAuthUserId(auth),
    user: resolveActiveUser(user, auth?.session),
    profile: buildInitialProfile(user ?? undefined),
    isComplete: isUserProfileComplete(user),
    school: resolveUserSchool(user),
  };
}

export async function handleOnboardingLoader(
  request: Request,
  context: unknown,
) {
  const auth = await authGuard(request, context, { allowAnonymous: true });
  return extractLoaderData(auth);
}
