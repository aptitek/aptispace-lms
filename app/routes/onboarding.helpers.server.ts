import type { Database } from "~/db";
import type { SchoolConfig } from "~/components/organisms/OnboardingCard/OnboardingCard.types";
import { validateFixedDomainEmail } from "~/utils/emailSecurity";
import { authGuard } from "~/utils/session.server";
import {
  updateUser,
  updateUserAffiliation,
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

  if (actionType !== "validate_credential") {
    return null;
  }

  if (!validation.isValid) {
    return Response.json(
      { error: validation.error, code: "UNAUTHORIZED_EMAIL_DOMAIN" },
      { status: 400 },
    );
  }

  if (hasNameFields && (!firstName || !familyName)) {
    return Response.json(
      {
        error: "First Name and Family Name are required.",
        code: "MISSING_REQUIRED_FIELDS",
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
  if (!db || !userId) return;

  const typedDb = db as Database;

  if (hasNameFields || firstName || familyName) {
    const trimmedFirst = firstName.trim();
    const trimmedFamily = familyName.trim();
    const displayName = `${trimmedFirst} ${trimmedFamily}`.trim();
    await updateUser(typedDb, userId, {
      firstName: trimmedFirst,
      lastName: trimmedFamily,
      displayName: displayName || null,
    });
  }

  if (fullEmail !== undefined) {
    await updateUserAffiliation(typedDb, userId, {
      email: fullEmail,
      institutionId: schoolId,
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
  return {
    actionType: String(formData.get("actionType") || "validate_credential"),
    firstName: String(formData.get("firstName") || "").trim(),
    familyName: String(formData.get("familyName") || "").trim(),
    rawEmail: String(formData.get("email") || "").trim(),
    school: resolveSchool(String(formData.get("schoolId") || "")),
    hasNameFields: formData.has("firstName") || formData.has("familyName"),
  };
}

function createActionResponse(
  actionType: string,
  fullEmail?: string,
): Response {
  if (actionType === "update_draft") {
    return Response.json({
      success: true,
      draftSaved: true,
      email: fullEmail,
    });
  }

  return Response.json({
    success: true,
    email: fullEmail,
    redirect: "/",
  });
}

async function saveUserEditsIfPresent(
  auth: Awaited<ReturnType<typeof authGuard>>,
  userId: string | undefined | null,
  data: ActionFormData,
  validation: ReturnType<typeof validateFixedDomainEmail>,
) {
  if (userId) {
    await saveUserEdits({
      db: auth?.db,
      userId,
      firstName: data.firstName,
      familyName: data.familyName,
      fullEmail: validation.fullEmail || data.rawEmail,
      schoolId: data.school.id,
      hasNameFields: data.hasNameFields,
    });
  }
}

export async function handleOnboardingAction(
  request: Request,
  context: unknown,
): Promise<Response> {
  const auth = await authGuard(request, context, { allowAnonymous: true });
  const userId = auth?.session?.userId ?? auth?.user?.id;

  const formData = await request.formData().catch(() => new FormData());
  const data = parseActionFormData(formData);

  const domain = data.school.emailDomain || CADET_FIXED_DOMAIN;
  const validation = validateFixedDomainEmail(data.rawEmail, domain);

  const validationError = validateActionInputs({
    actionType: data.actionType,
    firstName: data.firstName,
    familyName: data.familyName,
    validation,
    hasNameFields: data.hasNameFields,
  });
  if (validationError) {
    return validationError;
  }

  await saveUserEditsIfPresent(auth, userId, data, validation);

  return createActionResponse(data.actionType, validation.fullEmail);
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
