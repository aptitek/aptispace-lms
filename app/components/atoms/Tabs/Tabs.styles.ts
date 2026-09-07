import {
  styled,
  alpha,
  type Theme,
  type CSSObject,
} from "@mui/material/styles";
import MuiTabs from "@mui/material/Tabs";
import MuiTab from "@mui/material/Tab";
import { M3_MOTION_DURATIONS, M3_MOTION_EASINGS } from "~/tokens/motion";
import type { TabVariant } from "./Tabs.types";

export const StyledTabs = styled(MuiTabs)<{
  orientation?: "horizontal" | "vertical";
}>(({ theme, orientation }) => {
  const isVertical = orientation === "vertical";
  const primaryColor = theme.palette.primary.main;
  const darkIndicatorColor = theme.palette.secondary.main;

  if (isVertical) {
    return {
      minWidth: 0,
      width: "100%",
      overflow: "visible !important",
      "& .MuiTabs-scroller": {
        overflow: "visible !important",
      },
      "& .MuiTabs-list, & .MuiTabs-flexContainer": {
        display: "flex",
        flexDirection: "column !important",
        gap: theme.spacing(1),
        alignItems: "flex-start",
        paddingLeft: theme.spacing(1.75),
        overflow: "visible !important",
      },
      "& .MuiTabs-indicator": {
        left: "0 !important",
        right: "auto !important",
        width: "3px !important",
        borderRadius: "0 4px 4px 0",
        backgroundColor: primaryColor,
        ...theme.applyStyles("dark", {
          backgroundColor: darkIndicatorColor,
        }),
      },
    };
  }

  return {
    width: "100%",
    borderBottom: `1px solid ${theme.palette.divider}`,
    "& .MuiTabs-indicator": {
      height: 3,
      borderRadius: "4px 4px 0 0",
      backgroundColor: primaryColor,
      ...theme.applyStyles("dark", {
        backgroundColor: darkIndicatorColor,
      }),
    },
  };
});

function getVerticalTabStyles(theme: Theme): CSSObject {
  return {
    boxSizing: "border-box" as const,
    width: 44,
    minWidth: 44,
    maxWidth: "none !important",
    height: 44,
    minHeight: 44,
    borderRadius: 9999,
    padding: 0,
    display: "flex" as const,
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "flex-start" as const,
    position: "relative" as const,
    zIndex: 1,
    overflow: "visible !important",
    flexShrink: "0 !important",
    backgroundColor: "transparent",
    border: "1px solid transparent",
    backgroundClip: "padding-box",
    transition: theme.transitions.create(
      [
        "width",
        "min-width",
        "padding",
        "background-color",
        "border-color",
        "box-shadow",
        "color",
      ],
      {
        duration: M3_MOTION_DURATIONS.medium3,
        easing: M3_MOTION_EASINGS.css.standard,
      },
    ),
    "&.MuiTab-iconPositionStart": {
      "& .MuiTab-iconSlot, & .MuiTab-icon, & .MuiTab-iconWrapper": {
        marginRight: 0,
      },
    },
    "& .MuiTab-iconSlot, & .MuiTab-iconWrapper, & .MuiTab-icon": {
      margin: 0,
      color: "inherit",
    },
    "&:hover, &:focus-visible": {
      width: "max-content !important",
      minWidth: "max-content !important",
      paddingRight: theme.spacing(2),
      backgroundColor:
        theme.palette.surfaceContainerHigh || theme.palette.background.paper,
      border: `1px solid ${theme.palette.divider}`,
      backgroundClip: "padding-box",
      boxShadow: `0 4px 16px ${alpha(theme.palette.common.black, 0.14)}`,
      zIndex: 100,
      "& .MuiTab-labelSlot": {
        opacity: 1,
        maxWidth: 240,
        marginLeft: theme.spacing(1),
        transform: "translateX(0)",
      },
      "& .MuiTab-badgeSlot": {
        opacity: 1,
        maxWidth: 80,
        marginLeft: theme.spacing(1),
      },
    },
  };
}

function getHorizontalTabStyles(theme: Theme): CSSObject {
  return {
    minHeight: 48,
    padding: theme.spacing(1, 2.5),
    display: "inline-flex" as const,
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    gap: theme.spacing(1),
    "& .MuiTab-iconWrapper": {
      margin: 0,
      fontSize: 20,
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      lineHeight: 1,
      color: "inherit",
    },
  };
}

export const StyledTab = styled(MuiTab, {
  shouldForwardProp: (prop) => prop !== "$variant",
})<{ $variant: TabVariant }>(({ theme, $variant }) => {
  const primaryColor = theme.palette.primary.main;
  const darkActiveColor = theme.palette.secondary.main;

  const baseStyles: CSSObject = {
    textTransform: "none",
    fontWeight: 700,
    fontSize: "0.925rem",
    color: theme.palette.text.secondary,
    outline: "none",
    cursor: "pointer" as const,
    transition: theme.transitions.create(
      ["color", "background-color", "border-color", "box-shadow"],
      {
        duration: M3_MOTION_DURATIONS.short4,
        easing: M3_MOTION_EASINGS.css.standard,
      },
    ),
    "&:hover": {
      color: theme.palette.text.primary,
      ...theme.applyStyles("dark", {
        color: theme.palette.common.white,
      }),
    },
    "&.Mui-selected": {
      color: primaryColor,
      fontWeight: 700,
      ...theme.applyStyles("dark", {
        color: darkActiveColor,
      }),
    },
    "&.Mui-disabled": {
      opacity: 0.4,
      pointerEvents: "none",
    },
    "&:focus-visible": {
      outline: `2px solid ${primaryColor}`,
      outlineOffset: "2px",
      ...theme.applyStyles("dark", {
        outlineColor: darkActiveColor,
      }),
    },
  };

  if ($variant === "vertical") {
    return {
      ...baseStyles,
      ...getVerticalTabStyles(theme),
    };
  }

  return {
    ...baseStyles,
    ...getHorizontalTabStyles(theme),
  };
});

export const TabIconSlot = styled("span")({
  width: 44,
  minWidth: 44,
  height: 44,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
  lineHeight: 1,
  margin: 0,
  padding: 0,
  color: "inherit",
  "& svg, & .MuiSvgIcon-root": {
    fontSize: 22,
    display: "block",
  },
});

export const TabLabelSlot = styled("span", {
  shouldForwardProp: (prop) => prop !== "$extended",
})<{ $extended?: boolean }>(({ theme, $extended }) => ({
  fontWeight: 700,
  fontSize: "0.875rem",
  lineHeight: 1.2,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  textAlign: "left",
  display: "inline-block",
  opacity: $extended ? 1 : 0,
  maxWidth: $extended ? 240 : 0,
  marginLeft: $extended ? theme.spacing(1) : 0,
  transform: $extended ? "translateX(0)" : "translateX(-6px)",
  transition: theme.transitions.create(
    ["opacity", "max-width", "margin-left", "transform"],
    {
      duration: M3_MOTION_DURATIONS.medium3,
      easing: M3_MOTION_EASINGS.css.standard,
    },
  ),
}));

export const TabBadgeSlot = styled("span", {
  shouldForwardProp: (prop) => prop !== "$extended",
})<{ $extended?: boolean }>(({ theme, $extended }) => ({
  display: "inline-flex",
  alignItems: "center",
  opacity: $extended ? 1 : 0,
  maxWidth: $extended ? 80 : 0,
  marginLeft: $extended ? theme.spacing(1) : 0,
  overflow: "hidden",
  transition: theme.transitions.create(
    ["opacity", "max-width", "margin-left"],
    {
      duration: M3_MOTION_DURATIONS.medium3,
      easing: M3_MOTION_EASINGS.css.standard,
    },
  ),
}));
