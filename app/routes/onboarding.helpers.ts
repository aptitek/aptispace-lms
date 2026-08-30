import type {
  SchoolConfig,
  OnboardingProfile,
} from "~/components/organisms/OnboardingCard/OnboardingCard.types";
import { formatInstitutionalEmail } from "~/components/organisms/OnboardingCard/OnboardingCard.utils";
import type { getUserWithAffiliations } from "~/services/userService";

export const DEFAULT_INSTITUTIONAL_DOMAIN = "aptitek.io";
export const CADET_FIXED_DOMAIN = DEFAULT_INSTITUTIONAL_DOMAIN;

export const AVAILABLE_SCHOOLS: SchoolConfig[] = [
  {
    id: "school-aptitek",
    name: "Aptitek",
    slug: "aptitek",
    logoUrl: "/aptitek-logo.svg",
    emailDomain: "aptitek.io",
    emailPattern: "{first}.{last}@{domain}",
  },
];

export const DEFAULT_AVATAR_URL = "";

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
    avatarUrl: "",
  };
}

function resolveProfileEmail(
  first: string,
  family: string,
  providedEmail?: string,
): string {
  if (providedEmail) return providedEmail;
  if (first || family) {
    return formatInstitutionalEmail(first, family, AVAILABLE_SCHOOLS[0]);
  }
  return "";
}

export function resolveDefaultProfile(
  loaderProfile?: OnboardingProfile,
): OnboardingProfile {
  const first = loaderProfile?.firstName ?? "";
  const family = loaderProfile?.familyName ?? "";
  const email = resolveProfileEmail(first, family, loaderProfile?.email);

  return {
    firstName: first,
    familyName: family,
    email,
    avatarUrl: loaderProfile?.avatarUrl ?? "",
  };
}

export type RequiredFieldKey = "firstName" | "familyName" | "email";

export function computeMissingFields(
  isFirst: boolean,
  isFamily: boolean,
  isEmail: boolean,
): RequiredFieldKey[] {
  const missing: RequiredFieldKey[] = [];
  if (!isFirst) missing.push("firstName");
  if (!isFamily) missing.push("familyName");
  if (!isEmail) missing.push("email");
  return missing;
}
