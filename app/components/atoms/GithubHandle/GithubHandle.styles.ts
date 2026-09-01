import { styled, alpha } from "@mui/material/styles";
import { SOLARIZED_BASE } from "~/tokens/theme";
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
  const isDark = theme.palette.mode === "dark";

  return {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: `${cfg.gap}px`,
    padding: cfg.padding,
    borderRadius: "8px",
    backgroundColor: isDark
      ? alpha(SOLARIZED_BASE.base02, 0.6)
      : alpha(theme.palette.background.paper, 0.85),
    backdropFilter: "blur(6px)",
    WebkitBackdropFilter: "blur(6px)",
    border: `1px solid ${
      isDark
        ? alpha(SOLARIZED_BASE.base01, 0.3)
        : alpha(SOLARIZED_BASE.base01, 0.2)
    }`,
    boxShadow: isDark
      ? `0 1px 3px ${alpha(SOLARIZED_BASE.base03, 0.4)}, inset 0 1px 0 ${alpha(
          theme.palette.common.white,
          0.05,
        )}`
      : `0 1px 2px ${alpha(SOLARIZED_BASE.base03, 0.06)}, inset 0 1px 0 ${alpha(
          theme.palette.common.white,
          0.8,
        )}`,
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
      borderColor: isDark ? SOLARIZED_BASE.cyan : SOLARIZED_BASE.blue,
      boxShadow: isDark
        ? `0 0 8px ${alpha(SOLARIZED_BASE.cyan, 0.3)}`
        : `0 0 8px ${alpha(SOLARIZED_BASE.blue, 0.25)}`,
      "& .octocat-icon": {
        color: theme.palette.text.primary,
      },
    },
  };
});

export const HandleText = styled("span")({
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
});
