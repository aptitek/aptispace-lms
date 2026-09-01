import type React from "react";
import type { UserRole } from "~/utils/auth";
import type { SchoolConfig, CohortConfig } from "~/types/institution";

export interface CompactStudentData {
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
  institutionId?: string;
  institutionName?: string;
}

export type ProfileCardCompactVariant = "elevated" | "outlined" | "glass";

export interface ProfileCardCompactProps {
  student: CompactStudentData;
  school?: SchoolConfig;
  cohort?: CohortConfig;
  variant?: ProfileCardCompactVariant;
  onClick?: (student: CompactStudentData) => void;
  interactive?: boolean;
  className?: string;
  testId?: string;
  style?: React.CSSProperties;
}
