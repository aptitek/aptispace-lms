import { styled, alpha } from "@mui/material/styles";
import type { GithubHandleSize } from "./GithubHandle.types";

const SIZE_CONFIG: Record<
  GithubHandleSize,
  {
    fontSize: string;
    iconSize: number;
    gap: number;
    padding: string;
  }
> = {
  small: {
    fontSize: "0.75rem",
    iconSize: 15,
    gap: 6,
    padding: "3px 8px",
  },
  medium: {
    fontSize: "0.82rem",
    iconSize: 17,
    gap: 7,
    padding: "4px 10px",
  },
  large: {
    fontSize: "0.92rem",
    iconSize: 20,
    gap: 8,
    padding: "6px 14px",
  },
};

export const GithubHandleRoot = styled("span", {
  shouldForwardProp: (prop) => prop !== "handleSize",
})<{ handleSize: GithubHandleSize }>(({ theme, handleSize }) => {
  const cfg = SIZE_CONFIG[handleSize] || SIZE_CONFIG.medium;

  return {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: `${cfg.gap}px`,
    padding: cfg.padding,
    borderRadius: "8px",
    backgroundColor: theme.palette.background.paper,
    border: `1px solid ${theme.palette.divider}`,
    boxShadow: `0 1px 2px ${alpha(theme.palette.common.black, 0.06)}`,
    color: theme.palette.text.primary,
    fontFamily: '"Roboto Mono", "Fira Code", monospace',
    fontSize: cfg.fontSize,
    fontWeight: 600,
    letterSpacing: "0.02em",
    lineHeight: 1.2,
    maxWidth: "100%",
    boxSizing: "border-box",
    userSelect: "none",
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    transition: theme.transitions.create([
      "border-color",
      "background-color",
      "box-shadow",
    ]),

    "& .octocat-icon": {
      fontSize: cfg.iconSize,
      color: theme.palette.text.secondary,
      flexShrink: 0,
      transition: theme.transitions.create("color"),
    },

    "&:hover": {
      borderColor: theme.palette.primary.main,
      boxShadow: `0 0 8px ${alpha(theme.palette.primary.main, 0.25)}`,
      "& .octocat-icon": {
        color: theme.palette.text.primary,
      },
    },

    ...theme.applyStyles("dark", {
      backgroundColor: theme.palette.background.paper,
      border: `1px solid ${theme.palette.divider}`,
      boxShadow: `0 1px 3px ${alpha(theme.palette.common.black, 0.4)}`,
      "&:hover": {
        borderColor: theme.palette.info.main,
        boxShadow: `0 0 8px ${alpha(theme.palette.info.main, 0.3)}`,
      },
    }),
  };
});

export const HandleText = styled("span")({
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
});
