import { styled, alpha, type Theme } from "@mui/material/styles";
import "@material/web/chips/assist-chip.js";
import type { UserRole } from "~/utils/auth";

export interface RoleChipProps {
  role: UserRole;
  label?: string;
  size?: "small" | "medium";
  className?: string;
  "data-testid"?: string;
}

function getRolePalette(theme: Theme, role: UserRole) {
  if (role === "admin") {
    return {
      bg: alpha(theme.palette.warning.main, 0.22),
      fg: theme.palette.warning.light,
      border: alpha(theme.palette.warning.main, 0.55),
      hoverBg: alpha(theme.palette.warning.main, 0.32),
    };
  }
  if (role === "instructor") {
    return {
      bg: alpha(theme.palette.info.main, 0.22),
      fg: theme.palette.info.light,
      border: alpha(theme.palette.info.main, 0.55),
      hoverBg: alpha(theme.palette.info.main, 0.32),
    };
  }
  return {
    bg: alpha(theme.palette.success.main, 0.22),
    fg: theme.palette.success.light,
    border: alpha(theme.palette.success.main, 0.55),
    hoverBg: alpha(theme.palette.success.main, 0.32),
  };
}

const ChipContainer = styled("span")<{
  roleType: UserRole;
  chipSize: "small" | "medium";
}>(({ theme, roleType, chipSize }) => {
  const isSmall = chipSize === "small";
  const palette = getRolePalette(theme, roleType);

  return {
    display: "inline-flex",
    alignItems: "center",
    verticalAlign: "middle",

    "& md-assist-chip": {
      fontFamily: theme.typography.fontFamily,
      cursor: "default",

      /* MD3 Assist Chip Custom Role Tokens */
      "--md-assist-chip-container-shape": "6px",
      "--md-assist-chip-container-color": palette.bg,
      "--md-assist-chip-outline-color": palette.border,
      "--md-assist-chip-label-text-color": palette.fg,
      "--md-assist-chip-hover-label-text-color": palette.fg,
      "--md-assist-chip-hover-outline-color": palette.border,
      "--md-assist-chip-hover-state-layer-color": palette.hoverBg,
      "--md-assist-chip-focus-outline-color": palette.border,
      "--md-assist-chip-label-text-size": isSmall ? "0.7rem" : "0.8rem",
      "--md-assist-chip-label-text-weight": "800",
      "--md-assist-chip-label-text-font": theme.typography.fontFamily,
      "--md-assist-chip-container-height": isSmall ? "20px" : "26px",
      "--md-assist-chip-leading-space": isSmall ? "6px" : "10px",
      "--md-assist-chip-trailing-space": isSmall ? "6px" : "10px",
    },
  };
});

export default function RoleChip({
  role,
  label,
  size = "small",
  className,
  "data-testid": testId,
}: RoleChipProps) {
  const displayLabel = label ?? role;

  return (
    <ChipContainer
      roleType={role}
      chipSize={size}
      className={className}
      data-testid={testId || `role-chip-${role}`}
    >
      <md-assist-chip label={displayLabel} />
    </ChipContainer>
  );
}
