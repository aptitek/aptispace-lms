import { styled } from "@mui/material/styles";
import type { UserRole } from "~/utils/auth";

export interface RoleChipProps {
  role: UserRole;
  label?: string;
  size?: "small" | "medium";
}

const ChipRoot = styled("span")<{
  roleType: UserRole;
  chipSize: "small" | "medium";
}>(({ theme, roleType, chipSize }) => {
  const colorMap = {
    admin: {
      bg: theme.palette.warning.main,
      fg: theme.palette.warning.contrastText,
      border: theme.palette.warning.dark,
    },
    student: {
      bg: theme.palette.success.main,
      fg: theme.palette.success.contrastText,
      border: theme.palette.success.dark,
    },
    instructor: {
      bg: theme.palette.info.main,
      fg: theme.palette.info.contrastText,
      border: theme.palette.info.dark,
    },
  };

  const selectedPalette = colorMap[roleType] ?? colorMap.student;

  const radius = Number(theme.shape.borderRadius) || 8;
  return {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding:
      chipSize === "small"
        ? theme.spacing(0.25, 0.75)
        : theme.spacing(0.5, 1.25),
    borderRadius: radius * 0.75,
    backgroundColor: selectedPalette.bg,
    color: selectedPalette.fg,
    fontSize:
      chipSize === "small"
        ? (theme.typography.caption.fontSize ?? "0.75rem")
        : "0.825rem",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    lineHeight: 1,
    boxShadow: `0 2px 6px ${theme.palette.action.focus}`,
  };
});

export default function RoleChip({
  role,
  label,
  size = "small",
}: RoleChipProps) {
  const displayLabel = label ?? role;
  return (
    <ChipRoot roleType={role} chipSize={size}>
      {displayLabel}
    </ChipRoot>
  );
}
