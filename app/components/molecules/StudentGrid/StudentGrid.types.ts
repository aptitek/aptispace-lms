import type React from "react";
import type { CompactStudentData } from "../ProfileCardCompact/ProfileCardCompact.types";
import type { SchoolConfig, CohortConfig } from "~/types/institution";

export interface StudentGridProps {
  students: CompactStudentData[];
  school?: SchoolConfig;
  cohort?: CohortConfig;
  onStudentClick?: (student: CompactStudentData) => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  showSearch?: boolean;
  columns?: number;
  gap?: number;
  className?: string;
  testId?: string;
  emptyMessage?: string;
  title?: React.ReactNode;
}
