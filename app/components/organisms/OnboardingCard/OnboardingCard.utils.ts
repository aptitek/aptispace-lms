import type {
  SchoolConfig,
  OnboardingProfile,
  CohortConfig,
  CohortValidity,
} from "./OnboardingCard.types";
import type { Td1MrzData } from "../../atoms/MrzZone/MrzZone.types";

function sanitizeEmailPart(name: string, fallback = ""): string {
  const sanitized = (name || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, ".");
  return sanitized || fallback;
}

function generateLocalPart(
  pattern: string,
  cleanFirst: string,
  cleanLast: string,
): string {
  if (cleanFirst && cleanLast) {
    return pattern
      .replace("{first}", cleanFirst)
      .replace("{last}", cleanLast)
      .replace("{f}", cleanFirst.charAt(0))
      .replace("{l}", cleanLast.charAt(0))
      .replace(/@.*$/, "");
  }
  return cleanFirst || cleanLast;
}

export function formatInstitutionalEmail(
  firstName: string,
  familyName: string,
  school: SchoolConfig,
): string {
  const cleanFirst = sanitizeEmailPart(firstName, "");
  const cleanLast = sanitizeEmailPart(familyName, "");

  if (!cleanFirst && !cleanLast) {
    return "";
  }

  const cleanDomain = (school.emailDomain || "aptitek.io")
    .replace(/^@+/, "")
    .trim()
    .toLowerCase();

  const pattern = school.emailPattern || "{first}.{last}@{domain}";
  const local = generateLocalPart(pattern, cleanFirst, cleanLast);
  const normalizedLocal = local.replace(/\.+/g, ".").replace(/^\.|\.$/g, "");

  if (!normalizedLocal) {
    return "";
  }

  return `${normalizedLocal}@${cleanDomain}`;
}

function extractStartYear(cohort?: CohortConfig): number {
  const targetStr = cohort?.validFrom || cohort?.startDate || cohort?.name;
  if (!targetStr) return 2026;
  const match = targetStr.match(/\b(20\d{2})\b/);
  return match ? parseInt(match[1], 10) : 2026;
}

export function calculateCohortValidity(cohort?: CohortConfig): CohortValidity {
  const startYear = extractStartYear(cohort);
  const endYear = startYear + 1;
  const validFrom = cohort?.validFrom || `01/09/${startYear}`;
  const validUntil = cohort?.validUntil || `31/08/${endYear}`;

  return {
    startYear,
    endYear,
    validFrom,
    validUntil,
    formatted: `${validFrom} – ${validUntil}`,
  };
}

function sanitizeMrzString(text: string | undefined, fallback: string): string {
  const sanitized = (text || fallback)
    .toUpperCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^A-Z]/g, "");
  return sanitized || fallback;
}

export function buildTd1MrzData(
  profile: OnboardingProfile,
  school: SchoolConfig,
): Td1MrzData {
  const docNum = profile.documentNumber
    ? profile.documentNumber
        .replace(/[^A-Z0-9]/gi, "")
        .slice(0, 9)
        .toUpperCase()
    : "0942";

  const issuingState = (school.slug || school.id || "APT")
    .slice(0, 3)
    .toUpperCase()
    .padEnd(3, "X");

  return {
    documentCode: "ID",
    issuingState,
    documentNumber: docNum,
    surname: sanitizeMrzString(profile.familyName, "STUDENT"),
    givenNames: sanitizeMrzString(profile.firstName, "UNKNOWN"),
    nationality: profile.nationality || "APT",
    birthDate: profile.birthDate || "980412",
    sex: profile.sex || "X",
    expiryDate: profile.expiryDate || "300828",
    optional1: school.id ? school.id.slice(0, 15).toUpperCase() : undefined,
  };
}
