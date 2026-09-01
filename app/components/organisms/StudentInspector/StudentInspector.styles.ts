import { styled, alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";

export const HeaderTitleRow = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
}));

export const ContentSplit = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  gap: theme.spacing(4),
  alignItems: "flex-start",
  width: "100%",
  [theme.breakpoints.down("md")]: {
    flexDirection: "column",
  },
}));

export const LeftPanel = styled(Box)(({ theme }) => ({
  flex: "1 1 55%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "360px",
  perspective: 1200,
  padding: theme.spacing(1, 0),
}));

export const RightPanel = styled(Box)(({ theme }) => ({
  flex: "1 1 45%",
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(3),
  width: "100%",
}));

export const AssignmentSection = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(2),
  width: "100%",
}));

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
  return {
    fontWeight: 700,
    fontSize: "0.8rem",
    borderRadius: 8,
    backgroundColor: alpha(theme.palette.primary.main, 0.12),
    border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`,
    color: theme.palette.primary.main,
    transition: theme.transitions.create([
      "background-color",
      "transform",
      "box-shadow",
    ]),
    ...theme.applyStyles("dark", {
      backgroundColor: alpha(theme.palette.primary.light, 0.16),
      border: `1px solid ${alpha(theme.palette.primary.light, 0.4)}`,
      color: theme.palette.primary.light,
    }),
    "& .MuiChip-avatar": {
      width: 18,
      height: 18,
      marginLeft: 4,
    },
    "& .MuiChip-deleteIcon": {
      color: theme.palette.primary.main,
      fontSize: 16,
      transition: theme.transitions.create(["transform", "color"]),
      ...theme.applyStyles("dark", {
        color: theme.palette.primary.light,
      }),
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
  return {
    flex: 1,
    "& .MuiOutlinedInput-root": {
      borderRadius: 10,
      backgroundColor: alpha(theme.palette.background.paper, 0.8),
      transition: theme.transitions.create(["border-color", "box-shadow"]),
      "&:hover .MuiOutlinedInput-notchedOutline": {
        borderColor: theme.palette.primary.main,
      },
      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
        borderColor: theme.palette.primary.main,
        borderWidth: 2,
      },
      ...theme.applyStyles("dark", {
        backgroundColor: alpha(theme.palette.background.paper, 0.4),
        "&:hover .MuiOutlinedInput-notchedOutline": {
          borderColor: theme.palette.primary.light,
        },
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
          borderColor: theme.palette.primary.light,
          borderWidth: 2,
        },
      }),
    },
    "& .MuiInputLabel-root.Mui-focused": {
      color: theme.palette.primary.main,
      ...theme.applyStyles("dark", {
        color: theme.palette.primary.light,
      }),
    },
  };
});

export const AddCohortButton = styled(Button)(({ theme }) => {
  return {
    height: 40,
    fontWeight: 700,
    borderRadius: 10,
    padding: theme.spacing(0, 2),
    textTransform: "none",
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    boxShadow: `0 4px 14px ${alpha(theme.palette.primary.main, 0.35)}`,
    "&:hover": {
      backgroundColor: alpha(theme.palette.primary.main, 0.9),
      boxShadow: `0 6px 18px ${alpha(theme.palette.primary.main, 0.5)}`,
    },
    "&:disabled": {
      opacity: 0.5,
    },
    ...theme.applyStyles("dark", {
      backgroundColor: theme.palette.primary.light,
      color: theme.palette.background.default,
      boxShadow: `0 4px 14px ${alpha(theme.palette.primary.light, 0.35)}`,
      "&:hover": {
        backgroundColor: alpha(theme.palette.primary.light, 0.9),
        boxShadow: `0 6px 18px ${alpha(theme.palette.primary.light, 0.5)}`,
      },
    }),
  };
});

export const SchoolLogoMini = styled("img")(({ theme }) => ({
  height: 18,
  width: "auto",
  maxWidth: 26,
  maxHeight: 18,
  objectFit: "contain",
  borderRadius: 2,
  ...theme.applyStyles("dark", {
    filter: "brightness(1.1)",
  }),
}));

export const SchoolGroupHeader = styled(Box)(({ theme }) => {
  return {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(1),
    padding: theme.spacing(0.75, 1.5),
    fontSize: "0.75rem",
    fontWeight: 800,
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    color: theme.palette.primary.main,
    backgroundColor: alpha(theme.palette.background.default, 0.95),
    borderBottom: `1px solid ${theme.palette.divider}`,
    ...theme.applyStyles("dark", {
      color: theme.palette.primary.light,
    }),
  };
});

export const SchoolNameFallbackBadge = styled(Box)(({ theme }) => {
  return {
    fontSize: "0.625rem",
    fontWeight: 800,
    textTransform: "uppercase",
    letterSpacing: "0.04em",
    padding: theme.spacing(0.2, 0.6),
    borderRadius: 4,
    backgroundColor: alpha(theme.palette.background.paper, 0.8),
    color: theme.palette.text.secondary,
    border: `1px solid ${alpha(theme.palette.background.paper, 0.9)}`,
    whiteSpace: "nowrap",
    display: "inline-flex",
    alignItems: "center",
    lineHeight: 1.2,
    ...theme.applyStyles("dark", {
      backgroundColor: alpha(theme.palette.text.secondary, 0.45),
      color: theme.palette.action.active,
      border: `1px solid ${alpha(theme.palette.text.secondary, 0.6)}`,
    }),
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
