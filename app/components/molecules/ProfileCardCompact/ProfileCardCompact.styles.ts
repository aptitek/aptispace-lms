import { styled, alpha } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import { SOLARIZED_BASE } from "~/tokens/theme";

export const CompactCardContainer = styled("div", {
  shouldForwardProp: (prop) =>
    prop !== "isInteractive" && prop !== "cardVariant",
})<{ isInteractive?: boolean; cardVariant?: string }>(({
  theme,
  isInteractive,
}) => {
  const isDark = theme.palette.mode === "dark";

  return {
    position: "relative",
    width: "100%",
    minWidth: "300px",
    maxWidth: "400px",
    borderRadius: "16px",
    padding: theme.spacing(2),
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(1.5),
    backgroundColor: isDark
      ? alpha(SOLARIZED_BASE.base02, 0.75)
      : alpha(theme.palette.background.paper, 0.9),
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    border: `1px solid ${
      isDark
        ? alpha(SOLARIZED_BASE.base01, 0.35)
        : alpha(SOLARIZED_BASE.base01, 0.2)
    }`,
    boxShadow: isDark
      ? `0 4px 20px -2px ${alpha(SOLARIZED_BASE.base03, 0.6)}, inset 0 1px 0 ${alpha(
          theme.palette.common.white,
          0.05,
        )}`
      : `0 4px 16px -2px ${alpha(SOLARIZED_BASE.base03, 0.08)}, inset 0 1px 0 ${alpha(
          theme.palette.common.white,
          0.8,
        )}`,
    cursor: isInteractive ? "pointer" : "default",
    overflow: "hidden",
    transition: theme.transitions.create(
      ["transform", "box-shadow", "border-color", "background-color"],
      { duration: theme.transitions.duration.shorter },
    ),
    userSelect: "none",

    ...(isInteractive && {
      "&:hover": {
        transform: "translateY(-3px)",
        borderColor: isDark ? SOLARIZED_BASE.cyan : SOLARIZED_BASE.blue,
        boxShadow: isDark
          ? `0 12px 28px -4px ${alpha(SOLARIZED_BASE.base03, 0.8)}, 0 0 0 1px ${alpha(
              SOLARIZED_BASE.cyan,
              0.4,
            )}`
          : `0 10px 24px -4px ${alpha(SOLARIZED_BASE.blue, 0.2)}, 0 0 0 1px ${alpha(
              SOLARIZED_BASE.blue,
              0.3,
            )}`,
      },
      "&:focus-visible": {
        outline: `2px solid ${
          isDark ? SOLARIZED_BASE.cyan : SOLARIZED_BASE.blue
        }`,
        outlineOffset: "2px",
      },
    }),
  };
});

export const CardHoloAura = styled("div")(({ theme }) => {
  const isDark = theme.palette.mode === "dark";
  return {
    position: "absolute",
    top: 0,
    right: 0,
    width: "140px",
    height: "140px",
    background: isDark
      ? `radial-gradient(circle at 100% 0%, ${alpha(
          SOLARIZED_BASE.cyan,
          0.15,
        )}, transparent 70%)`
      : `radial-gradient(circle at 100% 0%, ${alpha(
          SOLARIZED_BASE.blue,
          0.12,
        )}, transparent 70%)`,
    pointerEvents: "none",
    zIndex: 1,
  };
});

export const CardHeaderRow = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  width: "100%",
  paddingBottom: theme.spacing(1),
  borderBottom: `1px solid ${theme.palette.divider}`,
  position: "relative",
  zIndex: 2,
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
  position: "relative",
  zIndex: 2,
}));

export const AvatarContainer = styled("div")({
  position: "relative",
  width: "77px",
  height: "99px",
  minWidth: "77px",
  maxWidth: "77px",
  flexShrink: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  overflow: "visible",

  "& [data-testid='avatar'], & [data-testid='compact-avatar']": {
    width: "77px !important",
    height: "99px !important",
    maxWidth: "77px !important",
    maxHeight: "99px !important",
    aspectRatio: "35 / 45",
  },
  "& .MuiBox-root": {
    width: "77px !important",
    height: "99px !important",
    maxWidth: "77px !important",
    maxHeight: "99px !important",
    aspectRatio: "35 / 45",
  },
});

export const FloatingBadge = styled("div")({
  position: "absolute",
  bottom: -2,
  right: -2,
  zIndex: 5,
});

export const StudentDetails = styled("div")({
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  minHeight: "99px",
  minWidth: 0,
  flex: 1,
  overflow: "visible",
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
  position: "relative",
  zIndex: 2,
  overflow: "visible",
  minWidth: 0,
}));

export const ImpersonateIconButton = styled(IconButton)(({ theme }) => {
  const isDark = theme.palette.mode === "dark";
  return {
    width: "24px",
    height: "24px",
    padding: "3px",
    borderRadius: "6px",
    color: SOLARIZED_BASE.magenta,
    backgroundColor: isDark
      ? alpha(SOLARIZED_BASE.magenta, 0.15)
      : alpha(SOLARIZED_BASE.magenta, 0.1),
    border: `1px solid ${
      isDark
        ? alpha(SOLARIZED_BASE.magenta, 0.4)
        : alpha(SOLARIZED_BASE.magenta, 0.3)
    }`,
    flexShrink: 0,
    transition: theme.transitions.create(
      ["background-color", "border-color", "transform", "color"],
      { duration: theme.transitions.duration.shorter },
    ),
    "&:hover": {
      backgroundColor: isDark
        ? alpha(SOLARIZED_BASE.magenta, 0.25)
        : alpha(SOLARIZED_BASE.magenta, 0.2),
      borderColor: SOLARIZED_BASE.magenta,
      color: SOLARIZED_BASE.magenta,
      transform: "scale(1.08)",
    },
    "& .MuiSvgIcon-root": {
      fontSize: "14px",
    },
  };
});
