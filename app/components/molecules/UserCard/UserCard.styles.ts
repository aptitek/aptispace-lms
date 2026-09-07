import { styled, alpha, type Theme } from "@mui/material/styles";
import CardContent from "@mui/material/CardContent";
import IconButton from "@mui/material/IconButton";
import { StyledCard } from "../../atoms/Card";
import { FONT_FAMILIES } from "~/tokens/typography";

export { StyledCard };

export const StyledCardContent = styled(CardContent)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(1),
  padding: theme.spacing(1.25, 1.5, 1.25),
  "&:last-child": {
    paddingBottom: theme.spacing(1.25),
  },
}));

export const CardHeaderRow = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  width: "100%",
  paddingBottom: theme.spacing(0.5),
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

export const InstitutionBadge = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(0.75),
}));

export const InstitutionLogo = styled("img")({
  height: "18px",
  maxWidth: "70px",
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
  gap: theme.spacing(1.5),
  width: "100%",
  minWidth: 0,
}));

export const AvatarContainer = styled("div")({
  position: "relative",
  width: "56px",
  height: "56px",
  minWidth: "56px",
  maxWidth: "56px",
  flexShrink: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  "& > [data-testid='avatar'], & > [data-testid='compact-avatar'], & > .MuiBox-root":
    {
      width: "56px !important",
      height: "56px !important",
      maxWidth: "56px !important",
      maxHeight: "56px !important",
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
  minHeight: "56px",
  minWidth: 0,
  flex: 1,
  gap: "2px",
});

export const StudentNameBlock = styled("div")({
  display: "flex",
  flexDirection: "column",
  gap: "1px",
  minWidth: 0,
  overflow: "hidden",
});

export const StudentFirstName = styled("div")(({ theme }) => ({
  fontSize: "0.85rem",
  fontWeight: 600,
  letterSpacing: "-0.01em",
  color: theme.palette.text.primary,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  lineHeight: 1.2,
}));

export const StudentFamilyName = styled("div")(({ theme }) => ({
  fontSize: "0.95rem",
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
  fontSize: "0.75rem",
  color: theme.palette.text.secondary,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  fontFamily: FONT_FAMILIES.mono,
  letterSpacing: "0.01em",
}));

export const CardFooterRow = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: theme.spacing(0.75),
  marginTop: "auto",
  paddingTop: theme.spacing(0.25),
  minWidth: 0,
}));

export const ImpersonateIconButton = styled(IconButton)(({ theme }) => ({
  width: "22px",
  height: "22px",
  padding: "4px",
  borderRadius: "4px",
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
    fontSize: "13px",
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
  width: "22px",
  height: "22px",
  flexShrink: 0,
});

export const deleteHoldButtonSx = {
  width: "22px",
  height: "22px",
  minWidth: "22px",
  maxWidth: "22px",
  minHeight: "22px",
  maxHeight: "22px",
  p: 0,
  padding: "4px",
  borderRadius: "4px",
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
    fontSize: "13px",
  },
};
