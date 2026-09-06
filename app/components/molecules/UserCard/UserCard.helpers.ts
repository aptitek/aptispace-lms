import type React from "react";
import type { EntityCardData } from "./EntityCard.types";
import type { SchoolConfig, CohortConfig } from "~/types/institution";
import type { UserRole } from "~/utils/auth";

export function formatGithubHandle(username?: string | null): string {
  if (!username) return "@cadet";
  const trimmed = username.trim();
  if (!trimmed) return "@cadet";
  return trimmed.startsWith("@") ? trimmed : `@${trimmed}`;
}

export function resolveDisplayName(entity: EntityCardData): string {
  if (entity.displayName) return entity.displayName;
  const fullName = `${entity.firstName} ${entity.familyName}`.trim();
  return fullName || "User";
}

export function resolveCohortLabel(
  entity: EntityCardData,
  cohort?: CohortConfig,
): string {
  if (cohort?.name) return cohort.name;
  if (entity.cohortName) return entity.cohortName;
  return "Cohort 2026";
}

export function parseDateYear(dateInput?: string | Date | null): string | null {
  if (!dateInput) return null;
  const d = new Date(dateInput);
  const yr = d.getFullYear();
  return isNaN(yr) ? null : String(yr);
}

export function resolveCohortYear(
  entity: EntityCardData,
  cohort?: CohortConfig,
): string {
  if (cohort?.startYear) return String(cohort.startYear);
  const cohortDateYear = parseDateYear(cohort?.startDate);
  if (cohortDateYear) return cohortDateYear;

  if (entity.cohortStartYear) return String(entity.cohortStartYear);
  const studentDateYear = parseDateYear(entity.cohortStartDate);
  if (studentDateYear) return studentDateYear;

  const match = entity.cohortName?.match(/\b(20\d{2})\b/);
  return match ? match[1] : "2026";
}

export function resolveInstitutionLabel(
  entity: EntityCardData,
  school?: SchoolConfig,
): string {
  if (school?.name) return school.name;
  if (entity.institutionName) return entity.institutionName;
  return "Aptitek";
}

export const DEFAULT_SCHOOL: SchoolConfig = {
  id: "default-school",
  name: "Aptitek",
  logoUrl: "/aptitek-logo.svg",
};

export function resolveCohortConfigForChip(
  entity: EntityCardData,
  cohortProp?: CohortConfig,
): CohortConfig {
  if (cohortProp) return cohortProp;
  const primaryCompact = entity.cohorts?.[0];
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
    name: entity.cohortName || "Cohort 2026",
    startDate: entity.cohortStartDate
      ? String(entity.cohortStartDate)
      : undefined,
  };
}

export function resolveEntityCardLabels(
  entity: EntityCardData,
  school?: SchoolConfig,
  cohort?: CohortConfig,
) {
  const role: UserRole = entity.role ?? "student";
  const displayName = resolveDisplayName(entity);
  const cohortLabel = resolveCohortLabel(entity, cohort);
  const cohortYear = resolveCohortYear(entity, cohort);
  const institutionLabel = resolveInstitutionLabel(entity, school);
  const cohortConfig = resolveCohortConfigForChip(entity, cohort);
  return {
    role,
    displayName,
    cohortLabel,
    cohortYear,
    institutionLabel,
    cohortConfig,
  };
}

export function useCardInteractivity(
  interactive: boolean,
  onClick: ((entity: EntityCardData) => void) | undefined,
  entity: EntityCardData,
) {
  const isInteractive = Boolean(interactive && onClick);
  const handleClick = () => {
    if (isInteractive && onClick) onClick(entity);
  };
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const isActivationKey = event.key === "Enter" || event.key === " ";
    if (isInteractive && isActivationKey) {
      event.preventDefault();
      onClick?.(entity);
    }
  };
  return { isInteractive, handleClick, handleKeyDown };
}
