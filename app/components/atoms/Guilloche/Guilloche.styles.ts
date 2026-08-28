import { styled, type Theme } from "@mui/material/styles";
import type { GuillocheVariant } from "./Guilloche.types";

export const getGuillocheColors = (variant: GuillocheVariant, theme: Theme) => {
  switch (variant) {
    case "solarized-gold":
      return {
        strokePrimary: theme.palette.warning.light,
        strokeSecondary: theme.palette.warning.main,
        strokeTertiary: theme.palette.warning.dark,
        accent: theme.palette.primary.light,
      };
    case "cyber-cyan":
      return {
        strokePrimary: theme.palette.primary.light,
        strokeSecondary: theme.palette.primary.main,
        strokeTertiary: theme.palette.info.light,
        accent: theme.palette.success.light,
      };
    case "cosmic-crimson":
      return {
        strokePrimary: theme.palette.error.light,
        strokeSecondary: theme.palette.error.main,
        strokeTertiary: theme.palette.secondary.light,
        accent: theme.palette.warning.light,
      };
    case "deep-space":
      return {
        strokePrimary: theme.palette.text.secondary,
        strokeSecondary: theme.palette.text.primary,
        strokeTertiary: theme.palette.divider,
        accent: theme.palette.primary.main,
      };
    case "holo-spectrum":
    default:
      return {
        strokePrimary: theme.palette.primary.light,
        strokeSecondary: theme.palette.secondary.main,
        strokeTertiary: theme.palette.warning.light,
        accent: theme.palette.success.main,
      };
  }
};

export const GuillocheSvg = styled("svg")<{ customOpacity: number }>(
  ({ customOpacity }) => ({
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    pointerEvents: "none",
    opacity: customOpacity,
    overflow: "visible",
    zIndex: 2,

    "@keyframes holoIridescence": {
      "0%": { filter: "hue-rotate(0deg)" },
      "50%": { filter: "hue-rotate(45deg)" },
      "100%": { filter: "hue-rotate(0deg)" },
    },

    "&.holo-animated": {
      animation: "holoIridescence 12s ease-in-out infinite",
    },
  }),
);
