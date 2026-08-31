import React from "react";
import type {
  SchoolConfig,
  OnboardingProfile,
  CohortConfig,
  CohortValidity,
  OnboardingHoloVariant,
} from "./OnboardingCard.types";
import type { Td1MrzData } from "../../atoms/MrzZone/MrzZone.types";
import type { GuillocheVariant } from "../../atoms/Guilloche/Guilloche.types";
import type { IdHoloLayer } from "../../molecules/IdCard/IdCard.types";

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

export function resolveGuillocheVariant(
  variant?: OnboardingHoloVariant,
): GuillocheVariant {
  if (variant === "gold") return "solarized-gold";
  if (variant === "cosmic") return "cosmic-crimson";
  return "holo-spectrum";
}

export function resolveGuillocheSeed(school: SchoolConfig): string {
  return school.id || school.name || school.slug || "APTISPACE-SCHOOL";
}

export function buildHoloLayers(
  schoolLogoUrl?: string | null,
  customHoloLayers?: (string | IdHoloLayer)[],
): IdHoloLayer[] {
  const layers: IdHoloLayer[] = [];

  if (schoolLogoUrl) {
    // 1) Main Front Holographic Logo
    layers.push({
      id: "school-holo-logo",
      src: schoolLogoUrl,
      side: "front",
      left: "3%",
      top: "2.8%",
      width: "28%",
      height: "9%",
      objectFit: "contain",
      blendMode: "screen",
      opacity: 0.95,
      holographic: true,
      zIndex: 20,
    });

    // 2) Ghost of Front Logo (mirrored onto the back face)
    layers.push({
      id: "school-holo-logo-ghost",
      side: "back",
      left: 0,
      top: 0,
      width: "100%",
      height: "100%",
      blendMode: "screen",
      opacity: 0.25, // Lower opacity for ghost effect
      holographic: true,
      zIndex: 1, // Below content on the back face
      style: {
        filter: "blur(0.35px) contrast(0.95)",
      },
      children: React.createElement(
        "div",
        { style: { width: "100%", height: "100%", transform: "scaleX(-1)" } },
        React.createElement("img", {
          src: schoolLogoUrl,
          alt: "",
          style: {
            position: "absolute",
            left: "3%",
            top: "2.8%",
            width: "28%",
            height: "9%",
            objectFit: "contain",
          },
        }),
      ),
    });
  }

  // 1) Main Back Holographic Logo
  layers.push({
    id: "aptispace-holo-logo",
    src: "/aptispace-logo.svg",
    side: "back",
    left: "28%",
    top: "12%",
    width: "52%",
    height: "22%",
    objectFit: "contain",
    blendMode: "screen",
    opacity: 0.95,
    holographic: true,
    zIndex: 20,
  });

  // 2) Ghost of Back Logo (mirrored onto the front face)
  layers.push({
    id: "aptispace-holo-logo-ghost",
    side: "front",
    left: 0,
    top: 0,
    width: "100%",
    height: "100%",
    blendMode: "screen",
    opacity: 0.25, // Lower opacity for ghost effect
    holographic: true,
    zIndex: 1, // Below content on the front face
    style: {
      filter: "blur(0.35px) contrast(0.95)",
    },
    children: React.createElement(
      "div",
      { style: { width: "100%", height: "100%", transform: "scaleX(-1)" } },
      React.createElement("img", {
        src: "/aptispace-logo.svg",
        alt: "",
        style: {
          position: "absolute",
          left: "28%",
          top: "12%",
          width: "52%",
          height: "22%",
          objectFit: "contain",
        },
      }),
    ),
  });

  if (customHoloLayers && Array.isArray(customHoloLayers)) {
    customHoloLayers.forEach((layerItem, idx) => {
      if (typeof layerItem === "string") {
        layers.push({
          id: `custom-holo-${idx}`,
          src: layerItem,
          side: "front",
          holographic: true,
        });
      } else {
        layers.push(layerItem);
      }
    });
  }

  return layers;
}

export const DEFAULT_PROFILE_TEMPLATE: OnboardingProfile = {
  firstName: "",
  familyName: "",
  email: "",
  avatarUrl: "",
};

export function createInitialProfile(
  controlled?: OnboardingProfile,
  defaultProfile?: OnboardingProfile,
  school?: SchoolConfig,
): OnboardingProfile {
  const base = controlled || defaultProfile || DEFAULT_PROFILE_TEMPLATE;
  const normalizedBase: OnboardingProfile = {
    ...base,
    familyName: base.familyName ? base.familyName.toUpperCase() : "",
  };
  if (!normalizedBase.email && school) {
    return {
      ...normalizedBase,
      email: formatInstitutionalEmail(
        normalizedBase.firstName,
        normalizedBase.familyName,
        school,
      ),
    };
  }
  return normalizedBase;
}
