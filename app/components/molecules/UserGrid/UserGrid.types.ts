import type React from "react";
import type { UserCardData } from "../UserCard/UserCard.types";
import type { SchoolConfig, CohortConfig } from "~/types/institution";

export interface UserGridProps {
  students: UserCardData[];
  school?: SchoolConfig;
  cohort?: CohortConfig;
  onStudentClick?: (student: UserCardData) => void;
  selectedStudentId?: string | null;
  onAddUser?: () => void;
  showAddUser?: boolean;
  addUserTooltip?: string;
  onImpersonate?: (student: UserCardData) => void;
  showImpersonate?: boolean;
  onDelete?: (student: UserCardData) => void;
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
  userType?: "student" | "instructor" | "admin" | "user";
  isLoading?: boolean;
  skeletonCount?: number;
  lazy?: boolean;
  pageSize?: number;
  emptyPlaceholderCount?: number;
}
