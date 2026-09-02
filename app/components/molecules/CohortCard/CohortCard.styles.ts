import { styled, alpha, type Theme } from "@mui/material/styles";

function resolveCardThemeTokens(theme: Theme, isSelected?: boolean) {
  const primary = theme.palette.primary.main;
  const bg = isSelected
    ? alpha(primary, 0.1)
    : alpha(theme.palette.background.paper, 0.9);
  const border = `1.5px solid ${isSelected ? primary : alpha(theme.palette.divider, 0.2)}`;
  const shadow = isSelected
    ? `0 4px 20px -2px ${alpha(primary, 0.3)}, inset 0 0 0 1px ${alpha(primary, 0.3)}`
    : `0 4px 16px -2px ${alpha(theme.palette.common.black, 0.06)}, inset 0 1px 0 rgba(255, 255, 255, 0.8)`;
  return { primary, bg, border, shadow };
}

function resolveDarkSelectionTokens(theme: Theme, isSelected?: boolean) {
  const primary = theme.palette.primary.main;
  return {
    backgroundColor: isSelected
      ? alpha(primary, 0.18)
      : alpha(theme.palette.background.paper, 0.9),
    borderColor: isSelected ? primary : alpha(theme.palette.divider, 0.2),
    boxShadow: isSelected
      ? `0 4px 20px -2px ${alpha(primary, 0.35)}, inset 0 0 0 1px ${alpha(primary, 0.35)}`
      : `0 4px 16px -2px ${alpha(theme.palette.common.black, 0.3)}, inset 0 1px 0 rgba(255, 255, 255, 0.05)`,
  };
}

export const CardContainer = styled("div", {
  shouldForwardProp: (prop) =>
    prop !== "isInteractive" && prop !== "isSelected",
})<{ isInteractive?: boolean; isSelected?: boolean }>(({
  theme,
  isInteractive,
  isSelected,
}) => {
  const { primary, bg, border, shadow } = resolveCardThemeTokens(
    theme,
    isSelected,
  );

  return {
    position: "relative",
    width: "100%",
    minWidth: "260px",
    maxWidth: "100%",
    borderRadius: "16px",
    padding: theme.spacing(2.5),
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(1),
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
    userSelect: "none",
    ...(isInteractive && {
      "&:hover": {
        transform: "translateY(-3px)",
        borderColor: isSelected ? primary : alpha(primary, 0.5),
        boxShadow: isSelected
          ? `0 10px 24px -4px ${alpha(primary, 0.35)}, 0 0 0 1px ${alpha(primary, 0.4)}`
          : `0 10px 24px -4px ${alpha(theme.palette.common.black, 0.12)}, 0 0 0 1px ${alpha(primary, 0.2)}`,
      },
      "&:focus-visible": {
        outline: `2px solid ${primary}`,
        outlineOffset: "2px",
      },
    }),
    ...theme.applyStyles("dark", resolveDarkSelectionTokens(theme, isSelected)),
  };
});

export const CohortName = styled("div")(({ theme }) => ({
  fontSize: "1.05rem",
  fontWeight: 700,
  color: theme.palette.text.primary,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
}));

export const CohortDescription = styled("div")(({ theme }) => ({
  fontSize: "0.85rem",
  color: theme.palette.text.secondary,
  display: "-webkit-box",
  WebkitLineClamp: 2,
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
  textOverflow: "ellipsis",
  minHeight: "2.5em",
}));

export const CohortDates = styled("div")(({ theme }) => ({
  fontSize: "0.75rem",
  color: theme.palette.text.disabled,
  marginTop: theme.spacing(1),
  fontWeight: 600,
  textTransform: "uppercase",
  letterSpacing: "0.05em",
}));

export const SkeletonContainer = styled(CardContainer, {
  shouldForwardProp: (prop) => prop !== "isInteractive",
})<{ isInteractive?: boolean }>(({ theme, isInteractive }) => {
  const primary = theme.palette.primary.main;

  return {
    position: "relative",
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
});

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
