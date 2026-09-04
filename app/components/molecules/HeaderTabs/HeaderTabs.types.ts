import type { ReactNode } from "react";
import type { UserRole, AuthUser } from "~/utils/auth";

export interface HeaderTabItem {
  id: string;
  labelKey: string;
  fallbackLabel: string;
  to: string;
  icon: ReactNode;
  badge?: ReactNode | number | string;
  exact?: boolean;
  matchPaths: string[];
  allowedRoles?: UserRole[];
  requireImpersonating?: boolean;
  testId?: string;
}

export interface HeaderTabsProps {
  tabs?: HeaderTabItem[];
  user?: AuthUser | null;
  className?: string;
  "data-testid"?: string;
}
