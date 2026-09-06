import type React from "react";
import type { UserCardData } from "./UserCard.types";
import type { SchoolConfig, CohortConfig } from "~/types/institution";
import type { UserRole } from "~/utils/auth";

export function formatGithubHandle(username?: string | null): string {
  if (!username) return "@cadet";
  const trimmed = username.trim();
  if (!trimmed) return "@cadet";
  return trimmed.startsWith("@") ? trimmed : `@${trimmed}`;
}

export function resolveDisplayName(user: UserCardData): string {
  if (user.displayName) return user.displayName;
  const fullName = `${user.firstName} ${user.familyName}`.trim();
  return fullName || "User";
}

export function resolveCohortLabel(
  user: UserCardData,
  cohort?: CohortConfig,
): string {
  if (cohort?.name) return cohort.name;
  if (user.cohortName) return user.cohortName;
  return "Cohort 2026";
}

export function parseDateYear(dateInput?: string | Date | null): string | null {
  if (!dateInput) return null;
  const d = new Date(dateInput);
  const yr = d.getFullYear();
  return isNaN(yr) ? null : String(yr);
}

export function resolveCohortYear(
  user: UserCardData,
  cohort?: CohortConfig,
): string {
  if (cohort?.startYear) return String(cohort.startYear);
  const cohortDateYear = parseDateYear(cohort?.startDate);
  if (cohortDateYear) return cohortDateYear;

  if (user.cohortStartYear) return String(user.cohortStartYear);
  const studentDateYear = parseDateYear(user.cohortStartDate);
  if (studentDateYear) return studentDateYear;

  const match = user.cohortName?.match(/\b(20\d{2})\b/);
  return match ? match[1] : "2026";
}

export function resolveInstitutionLabel(
  user: UserCardData,
  school?: SchoolConfig,
): string {
  if (school?.name) return school.name;
  if (user.institutionName) return user.institutionName;
  return "Aptitek";
}

export const DEFAULT_SCHOOL: SchoolConfig = {
  id: "default-school",
  name: "Aptitek",
  logoUrl: "/aptitek-logo.svg",
};

export function resolveCohortConfigForChip(
  user: UserCardData,
  cohortProp?: CohortConfig,
): CohortConfig {
  if (cohortProp) return cohortProp;
  const primaryCompact = user.cohorts?.[0];
  if (primaryCompact) {
    return {
      id: primaryCompact.id,
      name: primaryCompact.name,
      diploma: primaryCompact.diploma || undefined,
      year: primaryCompact.year ?? undefined,
      tags: primaryCompact.tags || undefined,
      startDate: primaryCompact.startDate
        ? String(primaryCompact.startDate)
        : undefined,
    };
  }
  return {
    name: user.cohortName || "Cohort 2026",
    startDate: user.cohortStartDate ? String(user.cohortStartDate) : undefined,
  };
}

export function resolveUserCardLabels(
  user: UserCardData,
  school?: SchoolConfig,
  cohort?: CohortConfig,
) {
  const role: UserRole = user.role ?? "student";
  const displayName = resolveDisplayName(user);
  const cohortLabel = resolveCohortLabel(user, cohort);
  const cohortYear = resolveCohortYear(user, cohort);
  const institutionLabel = resolveInstitutionLabel(user, school);
  const cohortConfig = resolveCohortConfigForChip(user, cohort);
  return {
    role,
    displayName,
    cohortLabel,
    cohortYear,
    institutionLabel,
    cohortConfig,
  };
}

export const resolveEntityCardLabels = resolveUserCardLabels;

export function resolveCardTestId(
  testId?: string,
  hasEntityProp?: boolean,
): string {
  if (testId) return testId;
  return hasEntityProp ? "entity-card" : "user-card";
}

export function resolveCardAccessibility(
  isInteractive: boolean,
  displayName: string,
) {
  return {
    tabIndex: isInteractive ? 0 : undefined,
    role: isInteractive ? "button" : "article",
    ariaLabel: `User card for ${displayName}`,
  };
}

export function resolveCardInteractivity(
  interactive: boolean,
  onClick: ((user: UserCardData) => void) | undefined,
  user?: UserCardData,
) {
  const isInteractive = Boolean(interactive && onClick && user);
  const handleClick = () => {
    if (isInteractive && onClick && user) onClick(user);
  };
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const isActivationKey = event.key === "Enter" || event.key === " ";
    if (isInteractive && isActivationKey && user) {
      event.preventDefault();
      onClick?.(user);
    }
  };
  return { isInteractive, handleClick, handleKeyDown };
}

export const useCardInteractivity = resolveCardInteractivity;
