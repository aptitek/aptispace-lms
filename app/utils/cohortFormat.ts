/**
 * Utility for cohort name formatting, diploma definitions, and specialty tag helpers.
 *
 * Format specification:
 * First letter of diploma + Year (if not none) + Tags separated by dashes -
 * e.g. "M1-IA-Dev", "B3-Cyber", "F-Docker", "L2"
 */

export type DiplomaCode = "C" | "F" | "L" | "B" | "M" | "D";

export interface DiplomaOption {
  code: DiplomaCode;
  labelKey: string;
  defaultLabel: string;
  shortLabel: string;
}

export const DIPLOMA_OPTIONS: readonly DiplomaOption[] = [
  {
    code: "C",
    labelKey: "diplomas.c",
    defaultLabel: "Certification",
    shortLabel: "C",
  },
  {
    code: "F",
    labelKey: "diplomas.f",
    defaultLabel: "Formation",
    shortLabel: "F",
  },
  {
    code: "L",
    labelKey: "diplomas.l",
    defaultLabel: "Licence",
    shortLabel: "L",
  },
  {
    code: "B",
    labelKey: "diplomas.b",
    defaultLabel: "Bachelor",
    shortLabel: "B",
  },
  {
    code: "M",
    labelKey: "diplomas.m",
    defaultLabel: "Master",
    shortLabel: "M",
  },
  {
    code: "D",
    labelKey: "diplomas.d",
    defaultLabel: "Doctorate",
    shortLabel: "D",
  },
] as const;

export const YEAR_OPTIONS = [
  { value: 0, labelKey: "cohortYear.none", defaultLabel: "None (no year)" },
  { value: 1, labelKey: "cohortYear.year1", defaultLabel: "1 (1st year)" },
  { value: 2, labelKey: "cohortYear.year2", defaultLabel: "2 (2nd year)" },
  { value: 3, labelKey: "cohortYear.year3", defaultLabel: "3 (3rd year)" },
  { value: 4, labelKey: "cohortYear.year4", defaultLabel: "4 (4th year)" },
  { value: 5, labelKey: "cohortYear.year5", defaultLabel: "5 (5th year)" },
  { value: 6, labelKey: "cohortYear.year6", defaultLabel: "6" },
  { value: 7, labelKey: "cohortYear.year7", defaultLabel: "7" },
  { value: 8, labelKey: "cohortYear.year8", defaultLabel: "8" },
] as const;

export const COMMON_SPECIALTY_TAGS: readonly string[] = [
  "AI",
  "Dev",
  "Cyber",
  "IoT",
  "Network",
  "Cloud",
  "Data",
  "Security",
  "Web",
  "Mobile",
] as const;

/**
 * Returns a normalized lowercase slug suitable for i18n translation lookup.
 * e.g., "AI" -> "ai", "Dev" -> "dev", "Web-Dev" -> "webdev"
 */
export function getSpecialtySlug(tag?: string | null): string {
  if (!tag) return "";
  return tag
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

/**
 * Formats a cohort name based on diploma, year, and specialty tags.
 * Formula: First letter of diploma + Year (if not none / > 0) + Tags separated by dashes (-)
 *
 * Examples:
 * - { diploma: "M", year: 1, tags: ["IA", "Dev"] } -> "M1-IA-Dev"
 * - { diploma: "B", year: 3, tags: ["Cyber"] } -> "B3-Cyber"
 * - { diploma: "F", year: 0, tags: ["Docker"] } -> "F-Docker"
 * - { diploma: "L", year: 2, tags: [] } -> "L2"
 * - { diploma: "C", year: 0, tags: [] } -> "C"
 */
function parseYearNumber(year?: number | string | null): string {
  if (year === undefined || year === null || year === "") return "";
  const num = typeof year === "number" ? year : parseInt(String(year), 10);
  return !isNaN(num) && num > 0 ? String(num) : "";
}

export function formatCohortName({
  diploma,
  year,
  tags = [],
}: {
  diploma?: string | null;
  year?: number | string | null;
  tags?: string[] | null;
}): string {
  const cleanDiploma = diploma ? diploma.trim() : "";
  const diplomaLetter = cleanDiploma
    ? cleanDiploma.charAt(0).toUpperCase()
    : "";
  const yearPart = parseYearNumber(year);
  const prefix = `${diplomaLetter}${yearPart}`;

  const cleanTags = (tags || []).map((t) => t.trim()).filter(Boolean);

  const parts = [prefix, ...cleanTags].filter(Boolean);
  return parts.join("-");
}

export interface ParsedCohortName {
  diploma: DiplomaCode | null;
  year: number | null;
  tags: string[];
}

/**
 * Reverse parses a cohort name formatted like "M1-IA-Dev" into its components.
 * Useful when editing existing cohorts that do not yet have explicit database fields.
 */
export function parseCohortName(name?: string | null): ParsedCohortName {
  if (!name || typeof name !== "string") {
    return { diploma: null, year: null, tags: [] };
  }

  const trimmed = name.trim();
  const match = trimmed.match(/^([CFLBMD])([1-9]\d*)?(?:-(.+))?$/i);
  if (!match) {
    return { diploma: null, year: null, tags: [] };
  }

  const diplomaCode = match[1].toUpperCase() as DiplomaCode;
  const year = match[2] ? parseInt(match[2], 10) : 0;
  const rawTags = match[3];
  const tags = rawTags
    ? rawTags
        .split("-")
        .map((t) => t.trim())
        .filter((t) => t.length > 0)
    : [];

  return {
    diploma: diplomaCode,
    year,
    tags,
  };
}

export interface DiplomaColorTheme {
  main: string;
  light: string;
  dark: string;
  text: string;
  border: string;
}

export const DIPLOMA_COLORS: Record<
  DiplomaCode | "default",
  DiplomaColorTheme
> = {
  C: {
    // Certification: Teal
    main: "var(--color-diploma-c)",
    light: "var(--color-diploma-c)",
    dark: "var(--color-diploma-c)",
    text: "var(--color-flag-fr-white)",
    border: "var(--color-diploma-c)",
  },
  F: {
    // Formation: Amber / Orange
    main: "var(--color-diploma-f)",
    light: "var(--color-diploma-f)",
    dark: "var(--color-diploma-f)",
    text: "var(--color-flag-fr-white)",
    border: "var(--color-diploma-f)",
  },
  L: {
    // Licence: Fresh Emerald Green
    main: "var(--color-diploma-l)",
    light: "var(--color-diploma-l)",
    dark: "var(--color-diploma-l)",
    text: "var(--color-flag-fr-white)",
    border: "var(--color-diploma-l)",
  },
  B: {
    // Bachelor: Electric Sapphire Blue
    main: "var(--color-diploma-b)",
    light: "var(--color-diploma-b)",
    dark: "var(--color-diploma-b)",
    text: "var(--color-flag-fr-white)",
    border: "var(--color-diploma-b)",
  },
  M: {
    // Master: Royal Violet
    main: "var(--color-diploma-m)",
    light: "var(--color-diploma-m)",
    dark: "var(--color-diploma-m)",
    text: "var(--color-flag-fr-white)",
    border: "var(--color-diploma-m)",
  },
  D: {
    // Doctorate: Rose Crimson
    main: "var(--color-diploma-d)",
    light: "var(--color-diploma-d)",
    dark: "var(--color-diploma-d)",
    text: "var(--color-flag-fr-white)",
    border: "var(--color-diploma-d)",
  },
  default: {
    main: "var(--color-diploma-default)",
    light: "var(--color-diploma-default)",
    dark: "var(--color-diploma-default)",
    text: "var(--color-flag-fr-white)",
    border: "var(--color-diploma-default)",
  },
};

/**
 * Returns the theme colors for a given diploma code.
 */
export function getDiplomaColor(diploma?: string | null): DiplomaColorTheme {
  if (!diploma) return DIPLOMA_COLORS.default;
  const firstLetter = diploma.trim().charAt(0).toUpperCase() as DiplomaCode;
  return DIPLOMA_COLORS[firstLetter] || DIPLOMA_COLORS.default;
}

/**
 * Derives a human-readable display name for a cohort from its structured fields.
 */
export function getCohortDisplayName(cohort?: {
  diploma?: string | null;
  year?: number | string | null;
  tags?: string[] | null;
  name?: string | null;
}): string {
  if (!cohort) return "Cohort";
  if (cohort.diploma) {
    return formatCohortName({
      diploma: cohort.diploma,
      year: cohort.year,
      tags: cohort.tags || [],
    });
  }
  return cohort.name || "Cohort";
}
