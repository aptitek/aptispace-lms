import type { UserRole } from "../../../utils/auth";

export type RoleBadgeSize = "small" | "medium" | "large";
export type RoleBadgeVariant = "icon-only" | "chip" | "badge";

export interface RoleBadgeProps {
  /**
   * Active user role ("student" | "instructor" | "admin")
   * @default "student"
   */
  role?: UserRole | string;
  userRole?: UserRole | string;
  /**
   * Sizing scale
   * @default "small"
   */
  size?: RoleBadgeSize;
  /**
   * Visual layout variant
   * @default "icon-only"
   */
  variant?: RoleBadgeVariant;
  /**
   * Whether to wrap in an accessible tooltip
   * @default true
   */
  showTooltip?: boolean;
  /**
   * Custom override for tooltip content
   */
  tooltipText?: string;
  /**
   * Optional custom class
   */
  className?: string;
  /**
   * Optional inline styles
   */
  style?: React.CSSProperties;
  /**
   * Test identifier
   */
  testId?: string;
  "data-testid"?: string;
}
