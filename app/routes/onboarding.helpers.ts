import type { Database } from "~/db";
import type {
  SchoolConfig,
  OnboardingProfile,
} from "~/components/organisms/OnboardingCard/OnboardingCard.types";
import { formatInstitutionalEmail } from "~/components/organisms/OnboardingCard/OnboardingCard.utils";
import { validateFixedDomainEmail } from "~/utils/emailSecurity";
import { authGuard } from "~/utils/session.server";
import {
  updateUser,
  updateUserAffiliation,
  type getUserWithAffiliations,
} from "~/services/userService";

export const CADET_FIXED_DOMAIN = "cadet.aptispace.io";

export const AVAILABLE_SCHOOLS: SchoolConfig[] = [
  {
    id: "school-aptispace-orbital",
    name: "AptiSpace Orbital Academy",
    slug: "aptispace-orbital-academy",
    logoUrl: "/favicon.svg",
    emailDomain: "cadet.aptispace.io",
    emailPattern: "{first}.{last}@{domain}",
  },
  {
    id: "school-quantum-aerospace",
    name: "Quantum Aerospace Institute",
    slug: "quantum-aerospace",
    logoUrl: null,
    emailDomain: "quantum.aptispace.io",
    emailPattern: "{first}.{last}@{domain}",
  },
  {
    id: "school-polytechnique-spatiale",
    name: "École Polytechnique Spatiale",
    slug: "polytechnique-spatiale",
    logoUrl: null,
    emailDomain: "polytechnique.aptispace.io",
    emailPattern: "{f}{last}@{domain}",
  },
];

export const DEFAULT_AVATAR_URL =
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80";

export function resolveSchool(schoolId?: string): SchoolConfig {
  return (
    AVAILABLE_SCHOOLS.find((s) => s.id === schoolId) ?? AVAILABLE_SCHOOLS[0]
  );
}

type UserWithAffiliationsResult = Awaited<
  ReturnType<typeof getUserWithAffiliations>
>;

export function buildInitialProfile(
  dbUser?: UserWithAffiliationsResult,
): OnboardingProfile {
  const primaryAffiliation = dbUser?.affiliations?.[0];
  return {
    firstName: dbUser?.firstName ?? "",
    familyName: dbUser?.lastName ?? "",
    email: primaryAffiliation?.email ?? "",
    avatarUrl: DEFAULT_AVATAR_URL,
    documentNumber: "0942",
    callSign: "AETH-9042",
    division: "Orbital Flight Dynamics",
    clearanceLevel: "LEVEL-4 OMNI",
  };
}

export function resolveDefaultProfile(
  loaderProfile?: OnboardingProfile,
): OnboardingProfile {
  const first = loaderProfile?.firstName || "Alex";
  const family = loaderProfile?.familyName || "Mercer";
  const email =
    loaderProfile?.email ||
    formatInstitutionalEmail(first, family, AVAILABLE_SCHOOLS[0]);

  return {
    firstName: first,
    familyName: family,
    email,
    avatarUrl: loaderProfile?.avatarUrl || DEFAULT_AVATAR_URL,
    documentNumber: "0942",
    callSign: "AETH-9042",
    division: "Orbital Flight Dynamics",
    clearanceLevel: "LEVEL-4 OMNI",
  };
}

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
}

export async function saveUserEdits(params: SaveUserEditsParams) {
  const { db, userId, firstName, familyName, fullEmail, schoolId } = params;
  if (!db || !userId) return;

  const typedDb = db as Database;

  if (firstName || familyName) {
    await updateUser(typedDb, userId, {
      firstName: firstName || "Cadet",
      lastName: familyName || "Cadet",
      displayName: `${firstName} ${familyName}`.trim() || undefined,
    });
  }

  if (fullEmail) {
    await updateUserAffiliation(typedDb, userId, {
      email: fullEmail,
      institutionId: schoolId,
    });
  }
}

export function computeMissingFields(
  isFirst: boolean,
  isFamily: boolean,
  isEmail: boolean,
): string[] {
  const missing: string[] = [];
  if (!isFirst) missing.push("First Name");
  if (!isFamily) missing.push("Family Name");
  if (!isEmail) missing.push("Institutional Email");
  return missing;
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

  if (userId) {
    await saveUserEdits({
      db: auth?.db,
      userId,
      firstName: data.firstName,
      familyName: data.familyName,
      fullEmail: validation.fullEmail,
      schoolId: data.school.id,
    });
  }

  return createActionResponse(data.actionType, validation.fullEmail);
}
