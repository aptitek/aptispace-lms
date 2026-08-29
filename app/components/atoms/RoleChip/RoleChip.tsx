import Chip, { type ChipProps } from "@mui/material/Chip";
import type { UserRole } from "~/utils/auth";

export interface RoleChipProps {
  role: UserRole;
  label?: string;
  size?: "small" | "medium";
  className?: string;
  "data-testid"?: string;
}

function getRoleColor(role: UserRole): ChipProps["color"] {
  if (role === "admin") return "warning";
  if (role === "instructor") return "info";
  return "success";
}

export default function RoleChip({
  role,
  label,
  size = "small",
  className,
  "data-testid": testId,
}: RoleChipProps) {
  const displayLabel = label ?? role;

  return (
    <Chip
      color={getRoleColor(role)}
      variant="outlined"
      label={displayLabel}
      size={size}
      className={className}
      data-testid={testId || `role-chip-${role}`}
      sx={{ fontWeight: 700 }}
    />
  );
}
