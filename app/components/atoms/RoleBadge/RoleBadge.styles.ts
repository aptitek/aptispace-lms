import { styled, alpha, type Theme } from "@mui/material/styles";
import type { UserRole } from "../../../utils/auth";
import type { RoleBadgeSize, RoleBadgeVariant } from "./RoleBadge.types";

export function getRoleThemeColor(
  role: UserRole | string | undefined,
  theme: Theme,
) {
  const normalized = (role || "").toLowerCase().trim();
  switch (normalized) {
    case "admin":
    case "administrator":
      return theme.palette.secondary;
    case "instructor":
    case "teacher":
    case "editingteacher":
    case "faculty":
      return theme.palette.primary;
    case "student":
    default:
      return theme.palette.success;
  }
}

interface RoleBadgeContainerProps {
  roleVariant: RoleBadgeVariant;
  roleSize: RoleBadgeSize;
  userRole?: UserRole | string;
}

const SIZE_MAP: Record<
  RoleBadgeSize,
  {
    iconOnly: { width: number; height: number; iconSize: number };
    chip: {
      height: number;
      padding: string;
      fontSize: string;
      iconSize: number;
    };
  }
> = {
  small: {
    iconOnly: { width: 22, height: 22, iconSize: 14 },
    chip: { height: 20, padding: "2px 6px", fontSize: "0.68rem", iconSize: 13 },
  },
  medium: {
    iconOnly: { width: 26, height: 26, iconSize: 17 },
    chip: { height: 24, padding: "3px 8px", fontSize: "0.75rem", iconSize: 15 },
  },
  large: {
    iconOnly: { width: 32, height: 32, iconSize: 20 },
    chip: {
      height: 28,
      padding: "4px 10px",
      fontSize: "0.82rem",
      iconSize: 18,
    },
  },
};

const BORDER_RADIUS_MAP: Record<string, { iconOnly: string; chip: string }> = {
  admin: { iconOnly: "7px 2px 7px 2px", chip: "8px 3px 8px 3px" },
  administrator: { iconOnly: "7px 2px 7px 2px", chip: "8px 3px 8px 3px" },
  instructor: { iconOnly: "10px 10px 3px 3px", chip: "12px 12px 4px 4px" },
  teacher: { iconOnly: "10px 10px 3px 3px", chip: "12px 12px 4px 4px" },
  editingteacher: { iconOnly: "10px 10px 3px 3px", chip: "12px 12px 4px 4px" },
  faculty: { iconOnly: "10px 10px 3px 3px", chip: "12px 12px 4px 4px" },
};

const DEFAULT_BORDER_RADIUS = {
  iconOnly: "11px 4px 11px 4px",
  chip: "9999px",
};

export function getRoleBadgeBorderRadius(
  role: UserRole | string | undefined,
  isIconOnly: boolean,
): string {
  const key = (role || "").toLowerCase().trim();
  const config = BORDER_RADIUS_MAP[key] || DEFAULT_BORDER_RADIUS;
  return isIconOnly ? config.iconOnly : config.chip;
}

export const RoleBadgeRoot = styled("span", {
  shouldForwardProp: (prop) =>
    prop !== "roleVariant" && prop !== "roleSize" && prop !== "userRole",
})<RoleBadgeContainerProps>(({ theme, roleVariant, roleSize, userRole }) => {
  const paletteColor = getRoleThemeColor(userRole, theme);
  const sizeConfig = SIZE_MAP[roleSize] || SIZE_MAP.small;

  const isIconOnly = roleVariant === "icon-only";
  const badgeRadius = getRoleBadgeBorderRadius(userRole, isIconOnly);

  return {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing(0.5),
    backgroundColor: alpha(paletteColor.main, 0.22),
    color: paletteColor.main,
    border: `1px solid ${alpha(paletteColor.main, 0.65)}`,
    borderRadius: badgeRadius,
    backdropFilter: "blur(8px)",
    WebkitBackdropFilter: "blur(8px)",
    boxShadow: `0 2px 8px ${alpha(paletteColor.main, 0.45)}`,
    boxSizing: "border-box",
    fontWeight: 700,
    letterSpacing: "0.04em",
    textTransform: "uppercase",
    userSelect: "none",
    flexShrink: 0,
    cursor: "default",
    position: "relative",
    zIndex: 10,
    isolation: "isolate",
    lineHeight: 1,
    verticalAlign: "middle",
    whiteSpace: "nowrap",
    transition: theme.transitions.create([
      "background-color",
      "border-color",
      "box-shadow",
      "transform",
      "border-radius",
    ]),

    "& svg, & .MuiSvgIcon-root": {
      display: "inline-block",
      flexShrink: 0,
      fill: "currentColor",
      color: "inherit",
      fontSize: isIconOnly
        ? `${sizeConfig.iconOnly.iconSize}px !important`
        : `${sizeConfig.chip.iconSize}px !important`,
      width: "1em",
      height: "1em",
    },

    "& > span": {
      display: "inline-block",
      lineHeight: 1,
      whiteSpace: "nowrap",
    },

    ...(isIconOnly
      ? {
          width: sizeConfig.iconOnly.width,
          height: sizeConfig.iconOnly.height,
          minWidth: sizeConfig.iconOnly.width,
          minHeight: sizeConfig.iconOnly.height,
          padding: 0,
        }
      : {
          height: sizeConfig.chip.height,
          minHeight: sizeConfig.chip.height,
          padding: sizeConfig.chip.padding,
          fontSize: sizeConfig.chip.fontSize,
        }),

    "&:hover": {
      boxShadow: `0 0 12px ${alpha(paletteColor.main, 0.6)}`,
      borderColor: paletteColor.main,
      transform: "scale(1.08)",
    },

    ...theme.applyStyles("dark", {
      backgroundColor: alpha(paletteColor.main, 0.28),
      border: `1px solid ${alpha(paletteColor.main, 0.65)}`,
      color: paletteColor.main,
    }),
  };
});
