import type React from "react";
import type { UserRole } from "~/utils/auth";
import type { SchoolConfig, CohortConfig } from "~/types/institution";

export interface CompactCohortItem {
  id: string;
  name: string;
  startDate?: string | Date | null;
  startYear?: string | number | null;
  institutionId?: string;
  institutionName?: string;
}

export interface EntityCardData {
  id: string;
  firstName: string;
  familyName: string;
  displayName?: string;
  email: string;
  role?: UserRole;
  avatarUrl?: string;
  githubUsername?: string;
  isProfileComplete?: boolean;
  cohortId?: string | null;
  cohortName?: string;
  cohortStartDate?: string | Date | null;
  cohortStartYear?: string | number | null;
  cohorts?: CompactCohortItem[];
  institutionId?: string;
  institutionName?: string;
}

export type EntityCardVariant = "elevation" | "outlined"; // MD3 variants mapped to MUI Card

export interface EntityCardProps {
  entity: EntityCardData;
  school?: SchoolConfig;
  cohort?: CohortConfig;
  variant?: EntityCardVariant;
  onClick?: (entity: EntityCardData) => void;
  onImpersonate?: (entity: EntityCardData) => void;
  showImpersonate?: boolean;
  onDelete?: (entity: EntityCardData) => void;
  showDelete?: boolean;
  interactive?: boolean;
  className?: string;
  testId?: string;
  style?: React.CSSProperties;
}
