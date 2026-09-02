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

export const SkeletonContainer = styled(CardContainer)({
  borderStyle: "dashed",
  backgroundColor: "transparent",
  opacity: 0.7,
  alignItems: "center",
  justifyContent: "center",
  minHeight: "130px",
});
