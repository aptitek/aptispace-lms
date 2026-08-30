import type {
  SchoolConfig,
  OnboardingProfile,
} from "~/components/organisms/OnboardingCard/OnboardingCard.types";
import { formatInstitutionalEmail } from "~/components/organisms/OnboardingCard/OnboardingCard.utils";
import type { getUserWithAffiliations } from "~/services/userService";

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
    avatarUrl: loaderProfile?.avatarUrl ?? DEFAULT_AVATAR_URL,
    documentNumber: "0942",
    callSign: "AETH-9042",
    division: "Orbital Flight Dynamics",
    clearanceLevel: "LEVEL-4 OMNI",
  };
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
