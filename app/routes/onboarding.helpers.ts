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

function extractDbProfileData(dbUser?: UserWithAffiliationsResult) {
  if (!dbUser) {
    return {
      firstName: "",
      familyName: "",
      email: "",
      role: "student" as const,
      githubUsername: undefined,
    };
  }

  const affiliations = dbUser.affiliations || [];
  const primary = affiliations[0];
  const firstName = dbUser.firstName ? dbUser.firstName.trim() : "";
  const lastName = dbUser.lastName ? dbUser.lastName.trim().toUpperCase() : "";
  const email = primary?.email || "";
  const role = (primary?.role as OnboardingProfile["role"]) || "student";
  const githubUsername = dbUser.githubId || undefined;

  return { firstName, familyName: lastName, email, role, githubUsername };
}

export function buildInitialProfile(
  dbUser?: UserWithAffiliationsResult,
): OnboardingProfile {
  const data = extractDbProfileData(dbUser);
  return {
    firstName: data.firstName,
    familyName: data.familyName,
    email: data.email,
    avatarUrl: "",
    role: data.role,
    githubUsername: data.githubUsername,
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
  if (!loaderProfile) {
    return {
      firstName: "",
      familyName: "",
      email: "",
      avatarUrl: "",
      role: "student",
      githubUsername: undefined,
    };
  }

  const first = loaderProfile.firstName ? loaderProfile.firstName.trim() : "";
  const family = loaderProfile.familyName
    ? loaderProfile.familyName.trim().toUpperCase()
    : "";
  const email = resolveProfileEmail(first, family, loaderProfile.email);

  return {
    firstName: first,
    familyName: family,
    email,
    avatarUrl: loaderProfile.avatarUrl || "",
    role: loaderProfile.role || "student",
    githubUsername: loaderProfile.githubUsername,
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
