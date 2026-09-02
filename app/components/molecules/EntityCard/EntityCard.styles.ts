import { styled, alpha, type Theme } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import IconButton from "@mui/material/IconButton";

export const StyledCard = styled(Card, {
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
    display: "flex",
    flexDirection: "column",
    boxSizing: "border-box",
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

export const StyledCardContent = styled(CardContent)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(1.5),
  padding: theme.spacing(2),
  "&:last-child": {
    paddingBottom: theme.spacing(2),
  },
}));

export const CardHeaderRow = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  width: "100%",
  paddingBottom: theme.spacing(1),
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

export const InstitutionBadge = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(0.75),
}));

export const InstitutionLogo = styled("img")({
  height: "20px",
  maxWidth: "80px",
  objectFit: "contain",
});

export const InstitutionName = styled("span")(({ theme }) => ({
  fontSize: "0.75rem",
  fontWeight: 800,
  textTransform: "uppercase",
  letterSpacing: "0.06em",
  color: theme.palette.text.primary,
}));

export const HeaderBadges = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(0.75),
}));

export const CardBodyRow = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(2),
  width: "100%",
  minWidth: 0,
}));

export const AvatarContainer = styled("div")({
  position: "relative",
  width: "80px",
  height: "80px",
  minWidth: "80px",
  maxWidth: "80px",
  flexShrink: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  "& > [data-testid='avatar'], & > [data-testid='compact-avatar'], & > .MuiBox-root":
    {
      width: "80px !important",
      height: "80px !important",
      maxWidth: "80px !important",
      maxHeight: "80px !important",
      aspectRatio: "1 / 1",
    },
});

export const FloatingBadge = styled("div")({
  position: "absolute",
  top: -4,
  right: -4,
  zIndex: 10,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

export const StudentDetails = styled("div")({
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  minHeight: "80px",
  minWidth: 0,
  flex: 1,
  gap: "3px",
});

export const StudentNameBlock = styled("div")({
  display: "flex",
  flexDirection: "column",
  gap: "1px",
  minWidth: 0,
  overflow: "hidden",
});

export const StudentFirstName = styled("div")(({ theme }) => ({
  fontSize: "0.925rem",
  fontWeight: 600,
  letterSpacing: "-0.01em",
  color: theme.palette.text.primary,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  lineHeight: 1.2,
}));

export const StudentFamilyName = styled("div")(({ theme }) => ({
  fontSize: "1.05rem",
  fontWeight: 800,
  textTransform: "uppercase",
  letterSpacing: "0.02em",
  color: theme.palette.text.primary,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  lineHeight: 1.2,
}));

export const StudentEmail = styled("div")(({ theme }) => ({
  fontSize: "0.775rem",
  color: theme.palette.text.secondary,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  fontFamily: 'monospace, "Roboto Mono", Consolas',
  letterSpacing: "0.01em",
}));

export const CardFooterRow = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: theme.spacing(1),
  marginTop: "auto",
  paddingTop: theme.spacing(0.25),
  minWidth: 0,
}));

export const ImpersonateIconButton = styled(IconButton)(({ theme }) => ({
  width: "24px",
  height: "24px",
  padding: "3px",
  borderRadius: "6px",
  color: theme.palette.secondary.main,
  backgroundColor: alpha(theme.palette.secondary.main, 0.1),
  border: `1px solid ${alpha(theme.palette.secondary.main, 0.3)}`,
  flexShrink: 0,
  transition: theme.transitions.create(
    ["background-color", "border-color", "transform", "color"],
    { duration: theme.transitions.duration.shorter },
  ),
  "&:hover": {
    backgroundColor: alpha(theme.palette.secondary.main, 0.2),
    borderColor: theme.palette.secondary.main,
    color: theme.palette.secondary.main,
    transform: "scale(1.08)",
  },
  "& .MuiSvgIcon-root": {
    fontSize: "14px",
  },
  ...theme.applyStyles("dark", {
    backgroundColor: alpha(theme.palette.secondary.main, 0.15),
    border: `1px solid ${alpha(theme.palette.secondary.main, 0.4)}`,
    "&:hover": {
      backgroundColor: alpha(theme.palette.secondary.main, 0.25),
    },
  }),
}));

export const DeleteHoldWrapper = styled("span")({
  display: "inline-flex",
  width: "24px",
  height: "24px",
  flexShrink: 0,
});

export const deleteHoldButtonSx = {
  width: "24px",
  height: "24px",
  minWidth: "24px",
  maxWidth: "24px",
  minHeight: "24px",
  maxHeight: "24px",
  p: 0,
  padding: "3px",
  borderRadius: "6px",
  boxSizing: "border-box" as const,
  color: "error.main",
  backgroundColor: (theme: Theme) => alpha(theme.palette.error.main, 0.1),
  border: (theme: Theme) => `1px solid ${alpha(theme.palette.error.main, 0.3)}`,
  "&:hover": {
    backgroundColor: (theme: Theme) => alpha(theme.palette.error.main, 0.2),
    borderColor: "error.main",
    color: "error.main",
    transform: "scale(1.08)",
  },
  "& .MuiSvgIcon-root": {
    fontSize: "14px",
  },
};
