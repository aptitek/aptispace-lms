import { styled, alpha, type Theme } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import ButtonBase from "@mui/material/ButtonBase";
import Chip from "@mui/material/Chip";
import TextField from "@mui/material/TextField";
import { M3_MOTION } from "~/tokens/theme";
import type { UserRole } from "~/utils/auth";

export const DevContainer = styled(Paper)(({ theme }) => {
  const radius = Number(theme.shape.borderRadius) || 8;
  return {
    marginTop: theme.spacing(3),
    padding: theme.spacing(2.5),
    borderRadius: radius * 1.5,
    border: `1px solid ${alpha(theme.palette.warning.main, 0.45)}`,
    backgroundColor: alpha(theme.palette.warning.main, 0.03),
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(2),
    position: "relative",
    overflow: "hidden",
    boxShadow: `0 8px 32px ${alpha(theme.palette.common.black, 0.05)}`,
    transition: `border-color ${M3_MOTION.duration.medium2}ms ${M3_MOTION.easing.emphasized}`,

    "&::before": {
      content: '""',
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      height: 3,
      background: `linear-gradient(90deg, ${theme.palette.warning.main}, ${theme.palette.info.main}, ${theme.palette.success.main})`,
      opacity: 0.8,
    },

    ...theme.applyStyles("dark", {
      border: `1px solid ${alpha(theme.palette.warning.main, 0.35)}`,
      backgroundColor: alpha(theme.palette.warning.main, 0.04),
      boxShadow: `0 8px 32px ${alpha(theme.palette.common.black, 0.2)}`,
    }),
  };
});

export const ToolHeader = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: theme.spacing(1),
  flexWrap: "wrap",
}));

export const HeaderTitle = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
  fontSize: "0.8125rem",
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  color: theme.palette.warning.main,

  "& .MuiSvgIcon-root": {
    fontSize: "1.15rem",
  },
}));

export const HeaderActions = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
}));

export const ModeBadge = styled(Chip)(({ theme }) => ({
  height: 22,
  fontSize: "0.6875rem",
  borderRadius: 6,
  backgroundColor: theme.palette.warning.main,
  color: theme.palette.warning.contrastText,
  fontWeight: 800,
  letterSpacing: "0.04em",
  fontFamily: "monospace",
  "& .MuiChip-label": {
    paddingLeft: 8,
    paddingRight: 8,
  },
}));

export const QuickCreateSection = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(1),
  padding: theme.spacing(1.25),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.background.paper, 0.6),
  border: `1px solid ${alpha(theme.palette.divider, 0.6)}`,
}));

export const QuickCreateHeader = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  fontSize: "0.75rem",
  fontWeight: 700,
  letterSpacing: "0.04em",
  color: theme.palette.text.secondary,
  textTransform: "uppercase",
}));

export const QuickCreateButtonGroup = styled(Box)(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gap: theme.spacing(1),

  [theme.breakpoints.down("sm")]: {
    gridTemplateColumns: "1fr",
  },
}));

export const RoleCreateButton = styled(ButtonBase, {
  shouldForwardProp: (prop) => prop !== "roleType",
})<{ roleType: UserRole }>(({ theme, roleType }) => {
  const getRoleColor = () => {
    switch (roleType) {
      case "admin":
        return theme.palette.secondary.main;
      case "instructor":
        return theme.palette.info.main;
      case "student":
      default:
        return theme.palette.success.main;
    }
  };

  const color = getRoleColor();
  const radius = Number(theme.shape.borderRadius) || 8;

  return {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing(0.75),
    padding: theme.spacing(0.875, 1.25),
    borderRadius: radius * 0.8,
    backgroundColor: alpha(color, 0.12),
    border: `1px solid ${alpha(color, 0.3)}`,
    color: color,
    fontSize: "0.78125rem",
    fontWeight: 700,
    cursor: "pointer",
    transition: `all ${M3_MOTION.duration.short3}ms ${M3_MOTION.easing.emphasized}`,

    "&:hover": {
      backgroundColor: alpha(color, 0.22),
      borderColor: color,
      transform: "translateY(-1px)",
      boxShadow: `0 4px 12px ${alpha(color, 0.25)}`,
    },

    "&:active": {
      transform: "translateY(0)",
      backgroundColor: alpha(color, 0.3),
    },

    "&:focus-visible": {
      outline: `2px solid ${color}`,
      outlineOffset: 2,
    },

    "&:disabled": {
      opacity: 0.5,
      cursor: "not-allowed",
      transform: "none",
      boxShadow: "none",
    },

    "& .MuiSvgIcon-root": {
      fontSize: "0.95rem",
    },
  };
});

export const FilterBar = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(1),
}));

export const SearchField = styled(TextField)(({ theme }) => ({
  "& .MuiInputBase-root": {
    height: 36,
    fontSize: "0.8125rem",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.background.paper, 0.8),
  },
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: alpha(theme.palette.divider, 0.8),
  },
  "& .MuiInputBase-input": {
    padding: "6px 10px",
  },
}));

export const SegmentedFilter = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(0.5),
  padding: theme.spacing(0.375),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.divider, 0.2),
  overflowX: "auto",
}));

export const FilterPill = styled(ButtonBase, {
  shouldForwardProp: (prop) => prop !== "isActive",
})<{ isActive?: boolean }>(({ theme, isActive }) => ({
  flex: 1,
  padding: theme.spacing(0.5, 1),
  borderRadius: Math.max(4, Number(theme.shape.borderRadius) - 4),
  fontSize: "0.71875rem",
  fontWeight: isActive ? 700 : 500,
  color: isActive ? theme.palette.text.primary : theme.palette.text.secondary,
  backgroundColor: isActive ? theme.palette.background.paper : "transparent",
  boxShadow: isActive
    ? `0 2px 6px ${alpha(theme.palette.common.black, 0.12)}`
    : "none",
  whiteSpace: "nowrap",
  transition: `all ${M3_MOTION.duration.short3}ms ${M3_MOTION.easing.standard}`,

  "&:hover": {
    backgroundColor: isActive
      ? theme.palette.background.paper
      : alpha(theme.palette.action.hover, 0.1),
    color: theme.palette.text.primary,
  },
}));

export const AccountsList = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(1),
  maxHeight: 280,
  overflowY: "auto",
  paddingRight: theme.spacing(0.5),

  /* Custom scrollbar */
  "&::-webkit-scrollbar": {
    width: 6,
  },
  "&::-webkit-scrollbar-track": {
    background: alpha(theme.palette.divider, 0.1),
    borderRadius: 3,
  },
  "&::-webkit-scrollbar-thumb": {
    background: alpha(theme.palette.text.secondary, 0.3),
    borderRadius: 3,
    "&:hover": {
      background: alpha(theme.palette.text.secondary, 0.5),
    },
  },
}));

function resolveCardBorder(
  theme: Theme,
  isSelected?: boolean,
  isCurrent?: boolean,
) {
  if (isSelected) return theme.palette.primary.main;
  if (isCurrent) return alpha(theme.palette.success.main, 0.5);
  return alpha(theme.palette.divider, 0.7);
}

function resolveCardBackground(
  theme: Theme,
  isSelected?: boolean,
  isCurrent?: boolean,
) {
  if (isSelected) return alpha(theme.palette.primary.main, 0.08);
  if (isCurrent) return alpha(theme.palette.success.main, 0.04);
  return alpha(theme.palette.background.paper, 0.9);
}

export const AccountCard = styled(ButtonBase, {
  shouldForwardProp: (prop) => prop !== "isSelected" && prop !== "isCurrent",
})<{ isSelected?: boolean; isCurrent?: boolean }>(({
  theme,
  isSelected,
  isCurrent,
}) => {
  const radius = Number(theme.shape.borderRadius) || 8;

  return {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: theme.spacing(1.125, 1.375),
    borderRadius: radius,
    border: `1px solid ${resolveCardBorder(theme, isSelected, isCurrent)}`,
    backgroundColor: resolveCardBackground(theme, isSelected, isCurrent),
    color: theme.palette.text.primary,
    cursor: "pointer",
    textAlign: "left",
    position: "relative",
    transition: `all ${M3_MOTION.duration.short3}ms ${M3_MOTION.easing.emphasized}`,

    "&:hover": {
      backgroundColor: isSelected
        ? alpha(theme.palette.primary.main, 0.12)
        : alpha(theme.palette.action.hover, 0.2),
      borderColor: isSelected
        ? theme.palette.primary.main
        : theme.palette.primary.light,
      transform: "translateX(3px)",
      boxShadow: `0 4px 12px ${alpha(theme.palette.common.black, 0.1)}`,
    },

    "&:focus-visible": {
      borderColor: theme.palette.primary.main,
      boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.35)}`,
    },

    "&:disabled": {
      opacity: 0.6,
      cursor: "not-allowed",
      transform: "none",
    },

    ...theme.applyStyles("dark", {
      backgroundColor: isSelected
        ? alpha(theme.palette.primary.main, 0.16)
        : isCurrent
          ? alpha(theme.palette.success.main, 0.08)
          : alpha(theme.palette.background.paper, 0.9),
      "&:hover": {
        backgroundColor: isSelected
          ? alpha(theme.palette.primary.main, 0.22)
          : alpha(theme.palette.action.hover, 0.2),
      },
    }),
  };
});

export const AccountCardLeft = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1.25),
  minWidth: 0,
  flex: 1,
}));

export const AccountAvatarWrapper = styled(Box)(() => ({
  flexShrink: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

export const AccountDetails = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(0.25),
  minWidth: 0,
  flex: 1,
}));

export const AccountNameRow = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(0.75),
  flexWrap: "wrap",
}));

export const AccountName = styled(Typography)(({ theme }) => ({
  fontSize: "0.84375rem",
  fontWeight: 700,
  color: theme.palette.text.primary,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
}));

export const AccountMeta = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
  fontSize: "0.71875rem",
  color: theme.palette.text.secondary,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
}));

export const AccountAction = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(0.75),
  flexShrink: 0,
  marginLeft: theme.spacing(1),
  color: theme.palette.text.secondary,

  "& .MuiSvgIcon-root": {
    fontSize: "1.15rem",
    transition: `transform ${M3_MOTION.duration.short3}ms ${M3_MOTION.easing.emphasized}`,
  },
}));

export const EmptyState = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3, 2),
  textAlign: "center",
  color: theme.palette.text.secondary,
  fontSize: "0.8125rem",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: theme.spacing(1),
}));

export const StatusPill = styled(Chip)(() => ({
  height: 18,
  fontSize: "0.625rem",
  fontWeight: 700,
  borderRadius: 4,
  "& .MuiChip-label": {
    paddingLeft: 4,
    paddingRight: 4,
  },
}));
