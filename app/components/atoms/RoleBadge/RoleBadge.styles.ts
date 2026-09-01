import { styled, alpha, type Theme } from "@mui/material/styles";
import type { UserRole } from "../../../utils/auth";
import type { RoleBadgeSize, RoleBadgeVariant } from "./RoleBadge.types";

export function getRoleThemeColor(
  role: UserRole | string | undefined,
  theme: Theme,
) {
  switch (role) {
    case "admin":
      return theme.palette.secondary;
    case "instructor":
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

export const RoleBadgeRoot = styled("span", {
  shouldForwardProp: (prop) =>
    prop !== "roleVariant" && prop !== "roleSize" && prop !== "userRole",
})<RoleBadgeContainerProps>(({ theme, roleVariant, roleSize, userRole }) => {
  const paletteColor = getRoleThemeColor(userRole, theme);
  const sizeConfig = SIZE_MAP[roleSize] || SIZE_MAP.small;

  const isIconOnly = roleVariant === "icon-only";

  return {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing(0.5),
    backgroundColor: alpha(paletteColor.main, 0.15),
    color: paletteColor.main,
    border: `1px solid ${alpha(paletteColor.main, 0.5)}`,
    backdropFilter: "blur(8px)",
    WebkitBackdropFilter: "blur(8px)",
    boxShadow: `0 2px 8px ${alpha(paletteColor.main, 0.4)}`,
    boxSizing: "border-box",
    fontWeight: 700,
    letterSpacing: "0.04em",
    textTransform: "uppercase",
    transition: theme.transitions.create([
      "background-color",
      "border-color",
      "box-shadow",
      "transform",
    ]),
    userSelect: "none",
    flexShrink: 0,
    cursor: "default",

    ...(isIconOnly
      ? {
          width: sizeConfig.iconOnly.width,
          height: sizeConfig.iconOnly.height,
          borderRadius: "50%",
          padding: 0,
          "& svg": {
            fontSize: sizeConfig.iconOnly.iconSize,
          },
        }
      : {
          height: sizeConfig.chip.height,
          padding: sizeConfig.chip.padding,
          fontSize: sizeConfig.chip.fontSize,
          borderRadius: theme.shape.borderRadius,
          "& svg": {
            fontSize: sizeConfig.chip.iconSize,
          },
        }),

    "&:hover": {
      boxShadow: `0 0 12px ${alpha(paletteColor.main, 0.4)}`,
      borderColor: paletteColor.main,
      transform: "scale(1.05)",
    },

    ...theme.applyStyles("dark", {
      backgroundColor: alpha(paletteColor.main, 0.22),
    }),
  };
});
