import { styled, alpha, type Theme } from "@mui/material/styles";

function resolveDashedCardStyles(theme: Theme, isInteractive?: boolean) {
  const primary = theme.palette.primary.main;
  return {
    position: "relative" as const,
    width: "100%",
    minWidth: "260px",
    maxWidth: "100%",
    borderRadius: "16px",
    padding: theme.spacing(3),
    boxSizing: "border-box" as const,
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing(2),
    borderStyle: "dashed",
    borderWidth: "1.5px",
    borderColor: alpha(theme.palette.divider, 0.35),
    backgroundColor: alpha(theme.palette.background.paper, 0.45),
    backdropFilter: "blur(8px)",
    WebkitBackdropFilter: "blur(8px)",
    minHeight: "140px",
    overflow: "hidden",
    userSelect: "none" as const,
    cursor: isInteractive ? "pointer" : "default",
    transition: theme.transitions.create(
      ["transform", "box-shadow", "border-color", "background-color"],
      { duration: theme.transitions.duration.shorter },
    ),
    ...(isInteractive && {
      "&:hover": {
        transform: "translateY(-3px)",
        borderColor: primary,
        backgroundColor: alpha(primary, 0.04),
        boxShadow: `0 8px 24px -4px ${alpha(primary, 0.15)}`,
        "& .md3-ghost-fab": {
          transform: "scale(1.1)",
          boxShadow: `0 8px 20px -2px ${alpha(primary, 0.55)}, 0 4px 10px -1px ${alpha(theme.palette.common.black, 0.25)}`,
        },
      },
      "&:focus-visible": {
        outline: `2px solid ${primary}`,
        outlineOffset: "2px",
      },
    }),
    ...theme.applyStyles("dark", {
      borderColor: alpha(theme.palette.divider, 0.25),
      backgroundColor: alpha(theme.palette.background.paper, 0.35),
      ...(isInteractive && {
        "&:hover": {
          borderColor: primary,
          backgroundColor: alpha(primary, 0.08),
          boxShadow: `0 8px 24px -4px ${alpha(primary, 0.25)}`,
        },
      }),
    }),
  };
}

function resolveStandardSurface(theme: Theme, isSelected?: boolean) {
  const primary = theme.palette.primary.main;
  const bg = isSelected
    ? alpha(primary, 0.08)
    : alpha(theme.palette.background.paper, 0.9);
  const border = `1px solid ${isSelected ? primary : alpha(theme.palette.divider, 0.2)}`;
  const shadow = isSelected
    ? `0 4px 20px -2px ${alpha(primary, 0.25)}, inset 0 0 0 1px ${alpha(primary, 0.2)}`
    : `0 4px 16px -2px ${alpha(theme.palette.common.black, 0.06)}, inset 0 1px 0 rgba(255, 255, 255, 0.8)`;
  return { bg, border, shadow };
}

function resolveInteractiveHover(theme: Theme, isSelected?: boolean) {
  const primary = theme.palette.primary.main;
  return {
    "&:hover": {
      transform: "translateY(-3px)",
      borderColor: isSelected ? primary : alpha(primary, 0.5),
      boxShadow: isSelected
        ? `0 10px 24px -4px ${alpha(primary, 0.3)}, 0 0 0 1px ${alpha(primary, 0.4)}`
        : `0 10px 24px -4px ${alpha(theme.palette.common.black, 0.12)}, 0 0 0 1px ${alpha(primary, 0.2)}`,
    },
    "&:focus-visible": {
      outline: `2px solid ${primary}`,
      outlineOffset: "2px",
    },
  };
}

function resolveStandardDarkStyles(theme: Theme, isSelected?: boolean) {
  const primary = theme.palette.primary.main;
  return {
    backgroundColor: isSelected
      ? alpha(primary, 0.16)
      : alpha(theme.palette.background.paper, 0.9),
    boxShadow: isSelected
      ? `0 4px 20px -2px ${alpha(primary, 0.25)}, inset 0 0 0 1px ${alpha(primary, 0.2)}`
      : `0 4px 16px -2px ${alpha(theme.palette.common.black, 0.3)}, inset 0 1px 0 rgba(255, 255, 255, 0.05)`,
  };
}

function resolveStandardCardStyles(
  theme: Theme,
  isInteractive?: boolean,
  isSelected?: boolean,
) {
  const { bg, border, shadow } = resolveStandardSurface(theme, isSelected);

  return {
    position: "relative" as const,
    width: "100%",
    minWidth: "260px",
    maxWidth: "100%",
    borderRadius: "16px",
    boxSizing: "border-box" as const,
    display: "flex",
    flexDirection: "column" as const,
    backgroundColor: bg,
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    border,
    boxShadow: shadow,
    cursor: isInteractive ? "pointer" : "default",
    transition: theme.transitions.create(
      ["transform", "box-shadow", "border-color", "background-color"],
      { duration: theme.transitions.duration.shorter },
    ),
    userSelect: "none" as const,
    ...(isInteractive && resolveInteractiveHover(theme, isSelected)),
    ...theme.applyStyles("dark", resolveStandardDarkStyles(theme, isSelected)),
  };
}

export const StyledExpressiveCard = styled("div", {
  shouldForwardProp: (prop) =>
    prop !== "isInteractive" && prop !== "isSelected" && prop !== "variant",
})<{
  isInteractive?: boolean;
  isSelected?: boolean;
  variant?: "elevated" | "elevation" | "outlined" | "dashed";
}>(({ theme, isInteractive, isSelected, variant = "elevated" }) => {
  if (variant === "dashed") {
    return resolveDashedCardStyles(theme, isInteractive);
  }
  return resolveStandardCardStyles(theme, isInteractive, isSelected);
});

export const DashedSkeletonCard = styled(StyledExpressiveCard, {
  shouldForwardProp: (prop) => prop !== "isInteractive",
})<{ isInteractive?: boolean }>(({ theme, isInteractive }) => ({
  borderStyle: "dashed",
  borderWidth: "1.5px",
  borderColor: alpha(theme.palette.divider, 0.35),
  backgroundColor: alpha(theme.palette.background.paper, 0.45),
  backdropFilter: "blur(8px)",
  WebkitBackdropFilter: "blur(8px)",
  minHeight: "140px",
  overflow: "hidden",
  userSelect: "none",
  cursor: isInteractive ? "pointer" : "default",
  ...(isInteractive && {
    "&:hover": {
      transform: "translateY(-3px)",
      borderColor: theme.palette.primary.main,
      backgroundColor: alpha(theme.palette.primary.main, 0.04),
      boxShadow: `0 8px 24px -4px ${alpha(theme.palette.primary.main, 0.15)}`,
      "& .md3-ghost-fab": {
        transform: "scale(1.1)",
        boxShadow: `0 8px 20px -2px ${alpha(theme.palette.primary.main, 0.55)}, 0 4px 10px -1px ${alpha(theme.palette.common.black, 0.25)}`,
      },
    },
  }),
  ...theme.applyStyles("dark", {
    borderColor: alpha(theme.palette.divider, 0.25),
    backgroundColor: alpha(theme.palette.background.paper, 0.35),
    ...(isInteractive && {
      "&:hover": {
        borderColor: theme.palette.primary.main,
        backgroundColor: alpha(theme.palette.primary.main, 0.08),
        boxShadow: `0 8px 24px -4px ${alpha(theme.palette.primary.main, 0.25)}`,
      },
    }),
  }),
}));

export const GhostFabOverlay = styled("div")({
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 2,
  pointerEvents: "auto",
});
