import { styled, alpha } from "@mui/material/styles";

export const CardContainer = styled("div", {
  shouldForwardProp: (prop) =>
    prop !== "isInteractive" && prop !== "isSelected",
})<{ isInteractive?: boolean; isSelected?: boolean }>(
  ({ theme, isInteractive, isSelected }) => ({
    position: "relative",
    width: "100%",
    minWidth: "200px",
    maxWidth: "350px",
    borderRadius: "16px",
    padding: theme.spacing(3),
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing(2),
    backgroundColor: isSelected
      ? alpha(theme.palette.primary.main, 0.08)
      : alpha(theme.palette.background.paper, 0.9),
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    border: `1px solid ${isSelected ? theme.palette.primary.main : alpha(theme.palette.divider, 0.2)}`,
    boxShadow: isSelected
      ? `0 4px 16px -2px ${alpha(theme.palette.primary.main, 0.2)}, inset 0 1px 0 ${alpha(theme.palette.primary.main, 0.1)}`
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
        borderColor: theme.palette.primary.main,
        boxShadow: `0 10px 24px -4px ${alpha(theme.palette.primary.main, 0.2)}, 0 0 0 1px ${alpha(theme.palette.primary.main, 0.3)}`,
      },
      "&:focus-visible": {
        outline: `2px solid ${theme.palette.primary.main}`,
        outlineOffset: "2px",
      },
    }),
  }),
);

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

export const SkeletonContainer = styled(CardContainer)({
  borderStyle: "dashed",
  backgroundColor: "transparent",
  opacity: 0.7,
});
