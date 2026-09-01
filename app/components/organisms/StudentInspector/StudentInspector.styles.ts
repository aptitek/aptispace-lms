import { styled, alpha } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import { SOLARIZED_BASE } from "~/tokens/theme";

export const InspectorRoot = styled(Paper)(({ theme }) => {
  const isDark = theme.palette.mode === "dark";
  return {
    width: "100%",
    maxWidth: "520px",
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(2.5),
    padding: theme.spacing(2.5),
    borderRadius: 20,
    backgroundColor: isDark
      ? alpha(SOLARIZED_BASE.base02, 0.75)
      : alpha(theme.palette.background.paper, 0.85),
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    border: `1px solid ${
      isDark
        ? alpha(SOLARIZED_BASE.base01, 0.4)
        : alpha(SOLARIZED_BASE.base1, 0.25)
    }`,
    boxShadow: isDark
      ? "0 16px 32px rgba(0, 0, 0, 0.45)"
      : "0 12px 28px rgba(0, 43, 54, 0.12)",
    boxSizing: "border-box",
    position: "sticky",
    top: theme.spacing(2),
    alignSelf: "flex-start",
    maxHeight: "calc(100vh - 120px)",
    overflowY: "auto",
    scrollbarWidth: "thin",
    "&::-webkit-scrollbar": {
      width: "6px",
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: alpha(theme.palette.text.secondary, 0.2),
      borderRadius: "3px",
    },
    animation: "inspectorSlideIn 240ms cubic-bezier(0.16, 1, 0.3, 1) forwards",

    "@keyframes inspectorSlideIn": {
      from: {
        opacity: 0,
        transform: "translateX(24px) scale(0.98)",
      },
      to: {
        opacity: 1,
        transform: "translateX(0) scale(1)",
      },
    },

    [theme.breakpoints.down("md")]: {
      maxWidth: "100%",
      position: "static",
      maxHeight: "none",
    },
  };
});

export const InspectorHeader = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  width: "100%",
  paddingBottom: theme.spacing(1),
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

export const HeaderTitleRow = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
}));

export const CardPreviewSlot = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  width: "100%",
  minHeight: "285px",
  perspective: 1200,
  padding: theme.spacing(1, 0),
  overflow: "visible",
}));

export const AssignmentSection = styled(Box)(({ theme }) => {
  const isDark = theme.palette.mode === "dark";
  return {
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(2),
    padding: theme.spacing(2),
    borderRadius: 14,
    backgroundColor: isDark
      ? alpha(SOLARIZED_BASE.base03, 0.6)
      : alpha(SOLARIZED_BASE.base3, 0.6),
    border: `1px solid ${theme.palette.divider}`,
  };
});

export const SectionHeader = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: theme.spacing(1),
}));

export const CohortChipsList = styled(Box)(({ theme }) => ({
  display: "flex",
  flexWrap: "wrap",
  gap: theme.spacing(1),
  alignItems: "center",
  minHeight: 32,
}));

export const ActiveCohortChip = styled(Chip)(({ theme }) => {
  const isDark = theme.palette.mode === "dark";
  return {
    fontWeight: 700,
    fontSize: "0.8rem",
    borderRadius: 8,
    backgroundColor: isDark
      ? alpha(SOLARIZED_BASE.cyan, 0.16)
      : alpha(SOLARIZED_BASE.blue, 0.12),
    border: `1px solid ${
      isDark ? alpha(SOLARIZED_BASE.cyan, 0.4) : alpha(SOLARIZED_BASE.blue, 0.3)
    }`,
    color: isDark ? SOLARIZED_BASE.cyan : SOLARIZED_BASE.blue,
    transition: theme.transitions.create([
      "background-color",
      "transform",
      "box-shadow",
    ]),
    "& .MuiChip-avatar": {
      width: 18,
      height: 18,
      marginLeft: 4,
    },
    "& .MuiChip-deleteIcon": {
      color: isDark ? SOLARIZED_BASE.cyan : SOLARIZED_BASE.blue,
      fontSize: 16,
      transition: theme.transitions.create(["transform", "color"]),
      "&:hover": {
        color: theme.palette.error.main,
        transform: "scale(1.2)",
      },
    },
  };
});

export const EmptyCohortsMessage = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(1, 1.5),
  borderRadius: 8,
  border: `1px dashed ${theme.palette.divider}`,
  color: theme.palette.text.secondary,
  fontSize: "0.85rem",
  fontStyle: "italic",
}));

export const QuickAddRow = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1.25),
  marginTop: theme.spacing(0.5),
}));

export const StyledFormControl = styled(FormControl)(({ theme }) => {
  const isDark = theme.palette.mode === "dark";
  return {
    flex: 1,
    "& .MuiOutlinedInput-root": {
      borderRadius: 10,
      backgroundColor: isDark
        ? alpha(theme.palette.background.paper, 0.4)
        : alpha(theme.palette.background.paper, 0.8),
      transition: theme.transitions.create(["border-color", "box-shadow"]),
      "&:hover .MuiOutlinedInput-notchedOutline": {
        borderColor: isDark ? SOLARIZED_BASE.cyan : SOLARIZED_BASE.blue,
      },
      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
        borderColor: isDark ? SOLARIZED_BASE.cyan : SOLARIZED_BASE.blue,
        borderWidth: 2,
      },
    },
    "& .MuiInputLabel-root.Mui-focused": {
      color: isDark ? SOLARIZED_BASE.cyan : SOLARIZED_BASE.blue,
    },
  };
});

export const AddCohortButton = styled(Button)(({ theme }) => {
  const isDark = theme.palette.mode === "dark";
  const primaryColor = isDark ? SOLARIZED_BASE.cyan : SOLARIZED_BASE.blue;
  return {
    height: 40,
    fontWeight: 700,
    borderRadius: 10,
    padding: theme.spacing(0, 2),
    textTransform: "none",
    backgroundColor: primaryColor,
    color: isDark ? SOLARIZED_BASE.base03 : SOLARIZED_BASE.base3,
    boxShadow: `0 4px 14px ${alpha(primaryColor, 0.35)}`,
    "&:hover": {
      backgroundColor: alpha(primaryColor, 0.9),
      boxShadow: `0 6px 18px ${alpha(primaryColor, 0.5)}`,
    },
    "&:disabled": {
      opacity: 0.5,
    },
  };
});

export const SchoolLogoMini = styled("img")(({ theme }) => ({
  height: 18,
  width: "auto",
  maxWidth: 26,
  maxHeight: 18,
  objectFit: "contain",
  borderRadius: 2,
  filter: theme.palette.mode === "dark" ? "brightness(1.1)" : "none",
}));

export const SchoolNameFallbackBadge = styled(Box)(({ theme }) => {
  const isDark = theme.palette.mode === "dark";
  return {
    fontSize: "0.625rem",
    fontWeight: 800,
    textTransform: "uppercase",
    letterSpacing: "0.04em",
    padding: theme.spacing(0.2, 0.6),
    borderRadius: 4,
    backgroundColor: isDark
      ? alpha(SOLARIZED_BASE.base01, 0.45)
      : alpha(SOLARIZED_BASE.base2, 0.8),
    color: isDark ? SOLARIZED_BASE.base1 : SOLARIZED_BASE.base01,
    border: `1px solid ${
      isDark
        ? alpha(SOLARIZED_BASE.base01, 0.6)
        : alpha(SOLARIZED_BASE.base2, 0.9)
    }`,
    whiteSpace: "nowrap",
    display: "inline-flex",
    alignItems: "center",
    lineHeight: 1.2,
  };
});

export const CohortOptionRow = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  width: "100%",
  gap: theme.spacing(1.5),
}));

export const CohortOptionLeft = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
  overflow: "hidden",
}));

export const SchoolGroupHeader = styled(Box)(({ theme }) => {
  const isDark = theme.palette.mode === "dark";
  return {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(1),
    padding: theme.spacing(0.75, 1.5),
    fontSize: "0.75rem",
    fontWeight: 800,
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    color: isDark ? SOLARIZED_BASE.cyan : SOLARIZED_BASE.blue,
    backgroundColor: isDark
      ? alpha(SOLARIZED_BASE.base03, 0.95)
      : alpha(SOLARIZED_BASE.base3, 0.95),
    borderBottom: `1px solid ${theme.palette.divider}`,
  };
});
