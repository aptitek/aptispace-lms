import { styled, alpha } from "@mui/material/styles";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { M3_MOTION_DURATIONS, M3_MOTION_EASINGS } from "~/tokens/motion";
import type { VerticalTabVariant } from "./VerticalTabs.types";

export const StyledMuiTabs = styled(Tabs, {
  shouldForwardProp: (prop) =>
    prop !== "$variant" && prop !== "$extended" && prop !== "$size",
})<{
  $variant: VerticalTabVariant;
  $extended: boolean;
  $size: number;
}>(({ theme, $variant, $extended }) => ({
  minWidth: 0,
  "& .MuiTabs-scroller": {
    overflow: "visible !important",
  },
  "& .MuiTabs-flexContainer": {
    display: "flex",
    flexDirection: "column",
    gap: $variant === "compact" ? theme.spacing(1) : theme.spacing(0.75),
    alignItems:
      $variant === "compact" ? ($extended ? "stretch" : "center") : "stretch",
  },
  "& .MuiTabs-indicator": {
    display: $variant === "compact" ? "none" : "block",
    left: 0,
    width: 3,
    borderRadius: "0 4px 4px 0",
    backgroundColor: theme.palette.primary.main,
    ...theme.applyStyles("dark", {
      backgroundColor: theme.palette.secondary.main,
    }),
  },
}));

export const StyledMuiTab = styled(Tab, {
  shouldForwardProp: (prop) =>
    prop !== "$variant" && prop !== "$extended" && prop !== "$size",
})<{
  $variant: VerticalTabVariant;
  $extended: boolean;
  $size: number;
}>(({ theme, $variant, $extended, $size }) => {
  const isCompact = $variant === "compact";

  if (isCompact) {
    const activeColor = theme.palette.primary.main;
    const activeDarkColor = theme.palette.secondary.main;

    return {
      textTransform: "none",
      boxSizing: "border-box",
      border: "1px solid transparent",
      width: $extended ? "100%" : $size,
      height: $size,
      minWidth: $size,
      minHeight: $size,
      borderRadius: $extended ? 9999 : "50%",
      padding: $extended ? theme.spacing(0, 1.5) : 0,
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: $extended ? "flex-start" : "center",
      gap: $extended ? theme.spacing(1.5) : 0,
      color: theme.palette.text.secondary,
      outline: "none",
      cursor: "pointer",
      transition: theme.transitions.create(
        [
          "width",
          "min-width",
          "border-radius",
          "padding",
          "gap",
          "background-color",
          "border-color",
          "transform",
          "color",
        ],
        {
          duration: M3_MOTION_DURATIONS.medium2,
          easing: M3_MOTION_EASINGS.css.standard,
        },
      ),

      "& .MuiTab-iconWrapper": {
        margin: 0,
        fontSize: 20,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: 20,
        minWidth: 20,
        lineHeight: 1,
      },

      "&:hover": {
        backgroundColor: alpha(theme.palette.action.hover, 0.08),
        transform: $extended ? "none" : "scale(1.05)",
      },

      "&.Mui-selected": {
        color: activeColor,
        backgroundColor: alpha(activeColor, 0.12),
        borderColor: alpha(activeColor, 0.35),
        fontWeight: 700,

        ...theme.applyStyles("dark", {
          color: activeDarkColor,
          backgroundColor: alpha(activeDarkColor, 0.16),
          borderColor: alpha(activeDarkColor, 0.4),
        }),
      },

      "&:focus-visible": {
        outline: `2px solid ${activeColor}`,
        outlineOffset: "2px",
        ...theme.applyStyles("dark", {
          outlineColor: activeDarkColor,
        }),
      },

      "&.Mui-disabled": {
        opacity: 0.4,
        pointerEvents: "none",
      },
    };
  }

  // Default variant
  return {
    textTransform: "none",
    boxSizing: "border-box",
    minHeight: 44,
    minWidth: 160,
    padding: theme.spacing(1, 2),
    borderRadius: theme.shape.borderRadius || 8,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: theme.spacing(1.5),
    color: theme.palette.text.secondary,
    fontWeight: 600,
    fontSize: "0.925rem",
    outline: "none",
    cursor: "pointer",
    transition: theme.transitions.create(
      ["background-color", "color", "border-color"],
      {
        duration: M3_MOTION_DURATIONS.short4,
        easing: M3_MOTION_EASINGS.css.standard,
      },
    ),

    "& .MuiTab-iconWrapper": {
      margin: 0,
      fontSize: 20,
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      lineHeight: 1,
    },

    "&:hover": {
      backgroundColor: alpha(theme.palette.action.hover, 0.06),
    },

    "&.Mui-selected": {
      color: theme.palette.primary.main,
      backgroundColor: alpha(theme.palette.primary.main, 0.08),
      fontWeight: 700,

      ...theme.applyStyles("dark", {
        color: theme.palette.secondary.main,
        backgroundColor: alpha(theme.palette.secondary.main, 0.12),
      }),
    },

    "&:focus-visible": {
      outline: `2px solid ${theme.palette.primary.main}`,
      outlineOffset: "2px",
    },

    "&.Mui-disabled": {
      opacity: 0.4,
      pointerEvents: "none",
    },
  };
});

export const TabLabelText = styled("span")({
  fontWeight: "inherit",
  fontSize: "0.875rem",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  lineHeight: 1.2,
  textAlign: "left",
  flex: 1,
});

export const TabBadgeSlot = styled(Box)(({ theme }) => ({
  display: "inline-flex",
  alignItems: "center",
  marginLeft: "auto",
  paddingLeft: theme.spacing(1),
}));
