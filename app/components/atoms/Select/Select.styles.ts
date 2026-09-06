import { styled, alpha, type Theme } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import { M3_SHAPE_CORNER_STRINGS } from "~/tokens/shapes";
import { M3_MOTION_DURATIONS } from "~/tokens/motion";

export const StyledMD3SelectRoot = styled(TextField, {
  shouldForwardProp: (prop) => prop !== "$hasLeadingIcon",
})<{ $hasLeadingIcon?: boolean }>(({ theme, variant }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius:
      variant === "filled" ? "12px 12px 0 0" : M3_SHAPE_CORNER_STRINGS.small,
    transition: theme.transitions.create(
      ["border-color", "box-shadow", "background-color"],
      { duration: M3_MOTION_DURATIONS.s.short2 },
    ),
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: theme.palette.text.secondary,
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderWidth: "2px",
      borderColor: theme.palette.primary.main,
    },
    "& .MuiSelect-select": {
      display: "flex",
      alignItems: "center",
      gap: theme.spacing(1),
      paddingTop: theme.spacing(1.25),
      paddingBottom: theme.spacing(1.25),
    },
  },
  "& .MuiFilledInput-root": {
    borderRadius: "12px 12px 0 0",
    backgroundColor:
      theme.palette.surfaceContainerHighest ||
      alpha(theme.palette.text.primary, 0.04),
    "&:hover": {
      backgroundColor: alpha(theme.palette.text.primary, 0.08),
    },
    "&.Mui-focused": {
      backgroundColor: alpha(theme.palette.text.primary, 0.08),
    },
    "& .MuiSelect-select": {
      display: "flex",
      alignItems: "center",
      gap: theme.spacing(1),
    },
  },
  "& .MuiInputLabel-root": {
    fontSize: "0.875rem",
    fontWeight: 500,
    "&.Mui-focused": {
      color: theme.palette.primary.main,
      fontWeight: 600,
    },
  },
}));

export const MENU_PROPS = {
  slotProps: {
    paper: {
      sx: {
        borderRadius: "12px",
        mt: 0.5,
        boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
        backdropFilter: "blur(12px)",
        maxHeight: 320,
        "& .MuiMenuItem-root": {
          fontSize: "0.875rem",
          borderRadius: "8px",
          mx: 0.5,
          my: 0.25,
          transition: "background-color 0.15s ease",
          "&.Mui-selected": {
            backgroundColor: (theme: Theme) =>
              alpha(theme.palette.primary.main, 0.12),
            fontWeight: 600,
            "&:hover": {
              backgroundColor: (theme: Theme) =>
                alpha(theme.palette.primary.main, 0.18),
            },
          },
        },
      },
    },
  },
};
