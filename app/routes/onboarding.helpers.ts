import type { SchoolConfig } from "~/types/institution";
import type { OnboardingProfile } from "~/types/profile";
import type { getUserWithAffiliations } from "~/services/userService";
import type { Td1MrzData } from "~/components/atoms/MrzZone/MrzZone.types";
import { generateEmailFromPattern } from "~/utils/emailFormat";

export const DEFAULT_INSTITUTIONAL_DOMAIN = "aptitek.io";
export const CADET_FIXED_DOMAIN = DEFAULT_INSTITUTIONAL_DOMAIN;

export const AVAILABLE_SCHOOLS: SchoolConfig[] = [
  {
    id: "school-aptitek",
    name: "Aptitek",
    slug: "aptitek",
    logoUrl: "/aptitek-logo.svg",
    emailDomain: "aptitek.io",
    usernamePattern: "{first}.{last}",
  },
];

export const DEFAULT_AVATAR_URL = "";

export function formatInstitutionalEmail(
  first: string,
  family: string,
  school: SchoolConfig,
): string {
  if (!first.trim() && !family.trim()) return "";
  return generateEmailFromPattern({
    firstName: first,
    lastName: family,
    usernamePattern: school.usernamePattern || school.emailPattern,
    domain: school.emailDomain,
  });
}

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

export function extractEmailPrefix(email?: string): string {
  if (!email) return "";
  return email.includes("@") ? email.split("@")[0] : email;
}

export function formatEmailDomain(domain?: string): string {
  const effective = domain || CADET_FIXED_DOMAIN;
  return effective.startsWith("@") ? effective : `@${effective}`;
}

export function buildMrzData(
  schoolId?: string,
  userId?: number | string,
  firstName?: string,
  familyName?: string,
): Td1MrzData {
  return {
    documentCode: "I",
    issuingState: schoolId?.slice(0, 3).toUpperCase() || "APT",
    documentNumber: String(userId || 942).padStart(4, "0"),
    birthDate: "000101",
    sex: "X",
    expiryDate: "300828",
    nationality: "APT",
    surname: (familyName || "CADET").trim().toUpperCase(),
    givenNames: (firstName || "STUDENT").trim().toUpperCase(),
  };
}
