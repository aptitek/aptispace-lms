import { styled, alpha } from "@mui/material/styles";

export const CardContainer = styled("div", {
  shouldForwardProp: (prop) =>
    prop !== "isInteractive" && prop !== "isSelected",
})<{ isInteractive?: boolean; isSelected?: boolean }>(({
  theme,
  isInteractive,
  isSelected,
}) => {
  const primary = theme.palette.primary.main;
  const bg = isSelected
    ? alpha(primary, 0.08)
    : alpha(theme.palette.background.paper, 0.9);
  const border = `1px solid ${isSelected ? primary : alpha(theme.palette.divider, 0.2)}`;
  const shadow = isSelected
    ? `0 4px 20px -2px ${alpha(primary, 0.25)}, inset 0 0 0 1px ${alpha(primary, 0.2)}`
    : `0 4px 16px -2px ${alpha(theme.palette.common.black, 0.06)}, inset 0 1px 0 rgba(255, 255, 255, 0.8)`;

  return {
    position: "relative",
    width: "100%",
    minWidth: "260px",
    maxWidth: "100%",
    borderRadius: "16px",
    padding: theme.spacing(3),
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing(2),
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
          ? `0 10px 24px -4px ${alpha(primary, 0.3)}, 0 0 0 1px ${alpha(primary, 0.4)}`
          : `0 10px 24px -4px ${alpha(theme.palette.common.black, 0.12)}, 0 0 0 1px ${alpha(primary, 0.2)}`,
      },
      "&:focus-visible": {
        outline: `2px solid ${primary}`,
        outlineOffset: "2px",
      },
    }),
    ...theme.applyStyles("dark", {
      backgroundColor: isSelected
        ? alpha(primary, 0.16)
        : alpha(theme.palette.background.paper, 0.9),
      boxShadow: isSelected
        ? `0 4px 20px -2px ${alpha(primary, 0.25)}, inset 0 0 0 1px ${alpha(primary, 0.2)}`
        : `0 4px 16px -2px ${alpha(theme.palette.common.black, 0.3)}, inset 0 1px 0 rgba(255, 255, 255, 0.05)`,
    }),
  };
});

export const LogoContainer = styled("div")({
  height: "60px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "100%",
});

export const LogoImage = styled("img")({
  maxHeight: "100%",
  maxWidth: "100%",
  objectFit: "contain",
});

export const SchoolName = styled("div")(({ theme }) => ({
  fontSize: "1.1rem",
  fontWeight: 700,
  color: theme.palette.text.primary,
  textAlign: "center",
  width: "100%",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
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
