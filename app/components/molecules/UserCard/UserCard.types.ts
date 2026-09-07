import type React from "react";
import type { UserRole } from "~/utils/auth";
import type { SchoolConfig, CohortConfig } from "~/types/institution";

export interface CompactCohortItem {
  id: string;
  name: string;
  diploma?: string | null;
  year?: number | null;
  tags?: string[] | null;
  startDate?: string | Date | null;
  startYear?: string | number | null;
  institutionId?: string;
  institutionName?: string;
}

export interface UserCardData {
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

export type UserCardVariant = "elevation" | "outlined";

export interface UserCardProps {
  user?: UserCardData;
  entity?: UserCardData;
  school?: SchoolConfig;
  cohort?: CohortConfig;
  variant?: UserCardVariant;
  onClick?: (user: UserCardData) => void;
  onImpersonate?: (user: UserCardData) => void;
  showImpersonate?: boolean;
  onDelete?: (user: UserCardData) => void;
  showDelete?: boolean;
  editableGithub?: boolean;
  onUpdateGithub?: (userId: string, newGithubUsername: string) => void;
  interactive?: boolean;
  isSelected?: boolean;
  isNested?: boolean;
  className?: string;
  testId?: string;
  style?: React.CSSProperties;
}

export interface UserCardSkeletonProps {
  variant?: "shimmer" | "static" | "ghost";
  animated?: boolean;
  opacity?: number;
  isGhost?: boolean;
  onClick?: () => void;
  tooltipTitle?: string;
  className?: string;
  testId?: string;
  style?: React.CSSProperties;
}
