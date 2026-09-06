import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { M3_SHAPE_CORNER_STRINGS } from "~/tokens/shapes";

export const RangeContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== "$hasValue",
})<{ $hasValue: boolean }>(({ theme, $hasValue }) => ({
  display: "inline-flex",
  alignItems: "center",
  gap: theme.spacing(1),
  padding: "4px 10px",
  borderRadius: M3_SHAPE_CORNER_STRINGS.small,
  border: `1px solid ${$hasValue ? theme.palette.primary.main : theme.palette.divider}`,
  backgroundColor: $hasValue
    ? theme.palette.surfaceContainerLow || theme.palette.background.paper
    : "transparent",
  transition: theme.transitions.create(
    ["border-color", "background-color", "box-shadow"],
    { duration: theme.transitions.duration.shorter },
  ),
}));

export const RangeInputField = styled(TextField)(() => ({
  "& .MuiOutlinedInput-root": {
    fontSize: "0.85rem",
    borderRadius: M3_SHAPE_CORNER_STRINGS.extraSmall,
  },
  "& input": {
    padding: "4px 6px",
    width: 55,
    textAlign: "center",
  },
}));

export const SingleNumberField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: M3_SHAPE_CORNER_STRINGS.small,
    transition: theme.transitions.create(["border-color", "box-shadow"], {
      duration: theme.transitions.duration.shorter,
    }),
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: theme.palette.text.secondary,
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: theme.palette.primary.main,
      borderWidth: "2px",
    },
  },
  "& input": {
    textAlign: "center",
  },
}));
