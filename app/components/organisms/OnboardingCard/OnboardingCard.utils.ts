import type { SchoolConfig, OnboardingProfile } from "./OnboardingCard.types";
import type { Td1MrzData } from "../../atoms/MrzZone/MrzZone.types";

function sanitizeEmailPart(name: string, fallback: string): string {
  const sanitized = (name || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, ".");
  return sanitized || fallback;
}

export function formatInstitutionalEmail(
  firstName: string,
  familyName: string,
  school: SchoolConfig,
): string {
  const cleanDomain = (school.emailDomain || "cadet.aptispace.io")
    .replace(/^@+/, "")
    .trim()
    .toLowerCase();

  const pattern = school.emailPattern || "{first}.{last}@{domain}";
  const cleanFirst = sanitizeEmailPart(firstName, "cadet");
  const cleanLast = sanitizeEmailPart(familyName, "user");

  let result = pattern
    .replace("{first}", cleanFirst)
    .replace("{last}", cleanLast)
    .replace("{f}", cleanFirst.charAt(0) || "c")
    .replace("{l}", cleanLast.charAt(0) || "u")
    .replace("{domain}", cleanDomain);

  if (!result.includes("@")) {
    result = `${cleanFirst}.${cleanLast}@${cleanDomain}`;
  }

  return result;
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
    surname: sanitizeMrzString(profile.familyName, "CADET"),
    givenNames: sanitizeMrzString(profile.firstName, "UNKNOWN"),
    nationality: profile.nationality || "APT",
    birthDate: profile.birthDate || "980412",
    sex: profile.sex || "X",
    expiryDate: profile.expiryDate || "300828",
    optional1: school.id ? school.id.slice(0, 15).toUpperCase() : undefined,
  };
}
