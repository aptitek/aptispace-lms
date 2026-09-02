import type React from "react";
import type { EntityCardData } from "../EntityCard/EntityCard.types";
import type { SchoolConfig, CohortConfig } from "~/types/institution";

export interface UserGridProps {
  students: EntityCardData[];
  school?: SchoolConfig;
  cohort?: CohortConfig;
  onStudentClick?: (student: EntityCardData) => void;
  selectedStudentId?: string | null;
  onAddUser?: () => void;
  showAddUser?: boolean;
  addUserTooltip?: string;
  onImpersonate?: (student: EntityCardData) => void;
  showImpersonate?: boolean;
  onDelete?: (student: EntityCardData) => void;
  showDelete?: boolean;
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
  showHeader?: boolean;
  searchPlaceholder?: string;
  searchAriaLabel?: string;
  userType?: "student" | "instructor" | "user";
  isLoading?: boolean;
  skeletonCount?: number;
  lazy?: boolean;
  pageSize?: number;
  emptyPlaceholderCount?: number;
}
