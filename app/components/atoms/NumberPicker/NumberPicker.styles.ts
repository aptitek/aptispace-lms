import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import OutlinedInput from "@mui/material/OutlinedInput";
import TextField from "@mui/material/TextField";
import { M3_SHAPE_CORNER_STRINGS } from "~/tokens/shapes";

export const SingleNumberField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: M3_SHAPE_CORNER_STRINGS.small,
    boxSizing: "border-box",
    height: 56,
    "&.MuiInputBase-sizeSmall": {
      height: 40,
    },
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

export const RangeFormControl = styled(FormControl, {
  shouldForwardProp: (prop) => prop !== "$fullWidth",
})<{ $fullWidth?: boolean }>(({ $fullWidth }) => ({
  minWidth: $fullWidth ? "100%" : 180,
  width: $fullWidth ? "100%" : "auto",
  display: "inline-flex",
  verticalAlign: "middle",
}));

export const RangeOutlinedInput = styled(OutlinedInput)(({ theme }) => ({
  borderRadius: M3_SHAPE_CORNER_STRINGS.small,
  boxSizing: "border-box",
  height: 56,
  "&.MuiInputBase-sizeSmall": {
    height: 40,
  },
  transition: theme.transitions.create(
    ["border-color", "box-shadow", "background-color"],
    { duration: theme.transitions.duration.shorter },
  ),
  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: theme.palette.text.secondary,
  },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: theme.palette.primary.main,
    borderWidth: "2px",
  },
  "& .MuiOutlinedInput-input": {
    padding: 0,
    height: "100%",
    boxSizing: "border-box",
    display: "flex",
    alignItems: "center",
  },
}));

export const RangeInputsContainer = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "100%",
  gap: theme.spacing(0.75),
}));

export const RangeSubInputWrapper = styled("span", {
  shouldForwardProp: (prop) => prop !== "$isActive" && prop !== "$isFocused",
})<{ $isActive: boolean; $isFocused: boolean }>(({ theme, $isActive, $isFocused }) => ({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "0 2px",
  cursor: "text",
  color: $isActive && $isFocused ? theme.palette.primary.main : theme.palette.text.primary,
  borderBottom: $isActive && $isFocused
    ? `2px solid ${theme.palette.primary.main}`
    : "2px solid transparent",
  transition: theme.transitions.create(["color", "border-color"], {
    duration: theme.transitions.duration.shorter,
  }),
}));

export const RangeSubInput = styled("input")(({ theme }) => ({
  border: "none",
  outline: "none",
  background: "transparent",
  textAlign: "center",
  fontFamily: "inherit",
  fontSize: "inherit",
  color: "inherit",
  fontWeight: "inherit",
  width: 44,
  minWidth: 38,
  padding: 0,
  margin: 0,
  cursor: "text",
  "&::placeholder": {
    color: theme.palette.text.secondary,
    opacity: 0.6,
    fontWeight: 400,
  },
  "&::-webkit-inner-spin-button, &::-webkit-outer-spin-button": {
    WebkitAppearance: "none",
    margin: 0,
  },
  "&[type=number]": {
    MozAppearance: "textfield",
  },
  "&:disabled": {
    color: theme.palette.text.disabled,
    cursor: "default",
  },
}));

export const RangeSeparator = styled("span")(({ theme }) => ({
  color: theme.palette.text.secondary,
  userSelect: "none",
  lineHeight: 1,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
  fontWeight: 500,
}));

export const SplitRangeContainer = styled(Box)(({ theme }) => ({
  display: "inline-flex",
  alignItems: "center",
  gap: theme.spacing(1),
}));
