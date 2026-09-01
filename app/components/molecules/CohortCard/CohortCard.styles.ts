import { styled, alpha } from "@mui/material/styles";

export const CardContainer = styled("div", {
  shouldForwardProp: (prop) =>
    prop !== "isInteractive" && prop !== "isSelected",
})<{ isInteractive?: boolean; isSelected?: boolean }>(
  ({ theme, isInteractive, isSelected }) => ({
    position: "relative",
    width: "100%",
    minWidth: "220px",
    maxWidth: "350px",
    borderRadius: "16px",
    padding: theme.spacing(2.5),
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(1),
    backgroundColor: isSelected
      ? alpha(theme.palette.secondary.main, 0.08)
      : alpha(theme.palette.background.paper, 0.9),
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    border: `1px solid ${isSelected ? theme.palette.secondary.main : alpha(theme.palette.divider, 0.2)}`,
    boxShadow: isSelected
      ? `0 4px 16px -2px ${alpha(theme.palette.secondary.main, 0.2)}, inset 0 1px 0 ${alpha(theme.palette.secondary.main, 0.1)}`
      : `0 4px 16px -2px ${alpha(theme.palette.common.black, 0.08)}, inset 0 1px 0 ${alpha(theme.palette.common.white, 0.8)}`,
    cursor: isInteractive ? "pointer" : "default",
    transition: theme.transitions.create(
      ["transform", "box-shadow", "border-color", "background-color"],
      { duration: theme.transitions.duration.shorter },
    ),
    userSelect: "none",
    ...(isInteractive && {
      "&:hover": {
        transform: "translateY(-3px)",
        borderColor: theme.palette.secondary.main,
        boxShadow: `0 10px 24px -4px ${alpha(theme.palette.secondary.main, 0.2)}, 0 0 0 1px ${alpha(theme.palette.secondary.main, 0.3)}`,
      },
      "&:focus-visible": {
        outline: `2px solid ${theme.palette.secondary.main}`,
        outlineOffset: "2px",
      },
    }),
  }),
);

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
