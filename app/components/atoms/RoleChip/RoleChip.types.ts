import type { ChipProps } from "../Chip/Chip.types";
import type { RoleType } from "~/tokens/roles";

export interface RoleChipProps extends Omit<ChipProps, "color" | "role"> {
  /** Target role ("student" | "instructor" | "admin" | "all" | string) */
  userRole?: RoleType | string | null;
  /** Alias for userRole */
  role?: RoleType | string;
  /** Optional override for chip color token */
  color?: ChipProps["color"];
  /** Whether to show the role's associated icon (defaults to true) */
  showIcon?: boolean;
}
