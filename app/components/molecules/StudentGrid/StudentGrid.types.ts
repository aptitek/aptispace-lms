import type React from "react";
import type { CompactStudentData } from "../ProfileCardCompact/ProfileCardCompact.types";
import type { SchoolConfig, CohortConfig } from "~/types/institution";

export interface StudentGridProps {
  students: CompactStudentData[];
  school?: SchoolConfig;
  cohort?: CohortConfig;
  onStudentClick?: (student: CompactStudentData) => void;
  onImpersonate?: (student: CompactStudentData) => void;
  showImpersonate?: boolean;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  showSearch?: boolean;
  columns?: number;
  gap?: number;
  className?: string;
  testId?: string;
  emptyMessage?: string;
  title?: React.ReactNode;
  icon?: React.ReactNode;
  searchPlaceholder?: string;
  searchAriaLabel?: string;
  userType?: "student" | "instructor" | "user";
  isLoading?: boolean;
  skeletonCount?: number;
  lazy?: boolean;
  pageSize?: number;
  emptyPlaceholderCount?: number;
}
