import React, { forwardRef, type ReactNode } from "react";
import MuiTextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import { styled, alpha, type SxProps } from "@mui/material/styles";
import { M3_SHAPE_CORNER_STRINGS } from "~/tokens/shapes";
import type { TextFieldProps } from "./TextField.types";

const StyledSearchTextField = styled(MuiTextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: M3_SHAPE_CORNER_STRINGS.full,
    backgroundColor:
      theme.palette.surfaceContainerHigh ||
      alpha(theme.palette.background.paper, 0.8),
    transition: theme.transitions.create(
      ["border-color", "box-shadow", "background-color"],
      { duration: theme.transitions.duration.shorter },
    ),
    "&:hover": {
      backgroundColor:
        theme.palette.surfaceContainerHighest ||
        alpha(theme.palette.background.paper, 0.95),
    },
    "&.Mui-focused": {
      backgroundColor: theme.palette.background.paper,
      boxShadow: `0 2px 8px ${alpha(theme.palette.primary.main, 0.15)}`,
    },
    "& fieldset": {
      borderColor: alpha(theme.palette.divider, 0.8),
    },
  },
}));

const StyledCompactTextField = styled(MuiTextField)({
  "& .MuiOutlinedInput-root": {
    height: 32,
    minHeight: 32,
    fontSize: "0.8125rem",
    borderRadius: M3_SHAPE_CORNER_STRINGS.extraSmall,
  },
  "& .MuiFilledInput-root": {
    height: 32,
    minHeight: 32,
    fontSize: "0.8125rem",
    borderRadius: "12px 12px 0 0",
  },
  "& .MuiOutlinedInput-input, & .MuiFilledInput-input": {
    padding: "2px 8px",
    fontSize: "0.8125rem",
  },
  "& .MuiInputLabel-root": {
    fontSize: "0.75rem",
    "&:not(.MuiInputLabel-shrink)": {
      transform: "translate(10px, 7px) scale(0.85)",
    },
    "&.MuiInputLabel-shrink": {
      transform: "translate(12px, -6px) scale(0.72)",
    },
  },
  "& .MuiInputAdornment-root": {
    marginRight: -4,
    "& .MuiIconButton-root": {
      width: 22,
      height: 22,
      minWidth: 22,
      minHeight: 22,
      padding: 2,
    },
    "& .MuiSvgIcon-root": {
      fontSize: "1rem",
    },
  },
});

const StyledCompactSearchTextField = styled(StyledSearchTextField)({
  "& .MuiOutlinedInput-root": {
    height: 32,
    minHeight: 32,
    fontSize: "0.8125rem",
  },
  "& .MuiOutlinedInput-input": {
    padding: "2px 8px",
    fontSize: "0.8125rem",
  },
});

function resolveTextFieldComponent(isSearch: boolean, isCompact: boolean) {
  if (isSearch && isCompact) return StyledCompactSearchTextField;
  if (isSearch) return StyledSearchTextField;
  if (isCompact) return StyledCompactTextField;
  return MuiTextField;
}

function resolveStartAdornment(
  isSearch: boolean,
  existing?: ReactNode,
): ReactNode {
  if (isSearch) {
    return (
      <InputAdornment position="start">
        <SearchRoundedIcon
          fontSize="small"
          sx={{ color: "text.secondary", ml: 0.5 }}
          data-testid="search-icon"
        />
      </InputAdornment>
    );
  }
  return existing;
}

function resolveEndAdornment(
  clearable: boolean,
  hasValue: boolean,
  onClear: () => void,
  existing?: ReactNode,
): ReactNode {
  if (clearable && hasValue) {
    return (
      <InputAdornment position="end">
        <IconButton
          size="small"
          onClick={onClear}
          aria-label="Clear text"
          edge="end"
          sx={{ mr: 0.25, p: 0.5 }}
          data-testid="clear-search-button"
        >
          <ClearRoundedIcon sx={{ fontSize: 16 }} />
        </IconButton>
      </InputAdornment>
    );
  }
  return existing;
}

function determineHasValue(value: unknown): boolean {
  if (typeof value === "string") {
    return value.length > 0;
  }
  return value !== undefined && value !== null;
}

function createClearHandler(
  onClear?: () => void,
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void,
): () => void {
  return () => {
    if (onClear) {
      onClear();
      return;
    }
    if (onChange) {
      const syntheticEvent = {
        target: { value: "" },
      } as React.ChangeEvent<HTMLInputElement>;
      onChange(syntheticEvent);
    }
  };
}

function extractInputSlot(input: unknown): Record<string, unknown> {
  if (typeof input === "object" && input !== null) {
    return input as Record<string, unknown>;
  }
  return {};
}

function resolvePlaceholder(
  placeholder: string | undefined,
  isSearch: boolean,
): string | undefined {
  if (placeholder !== undefined) {
    return placeholder;
  }
  return isSearch ? "Search..." : undefined;
}

function resolveTestId(
  testId?: string,
  dataTestId?: string,
  isSearch?: boolean,
): string {
  if (testId) return testId;
  if (dataTestId) return dataTestId;
  return isSearch ? "search-text-field" : "text-field";
}

function resolveMuiVariant(
  isSearch: boolean,
  variant: "outlined" | "filled" | "standard" | "search" = "outlined",
): "outlined" | "filled" | "standard" {
  if (isSearch) return "outlined";
  return variant === "search" ? "outlined" : variant;
}

function resolveMuiSize(
  size: "compact" | "small" | "medium" = "small",
): "small" | "medium" {
  return size === "medium" ? "medium" : "small";
}

function resolveMergedSx(fitContent: boolean, sx: unknown) {
  if (!fitContent) return sx;
  const fitSx = {
    width: "fit-content",
    "& .MuiOutlinedInput-root, & .MuiFilledInput-root": {
      width: "fit-content",
    },
  };
  if (Array.isArray(sx)) return [...sx, fitSx];
  if (sx && typeof sx === "object") return { ...fitSx, ...sx };
  return fitSx;
}

export const TextField = forwardRef<HTMLDivElement, TextFieldProps>(
  function TextField(props, ref) {
    const {
      variant = "outlined",
      size = "small",
      compact = false,
      fitContent = false,
      value,
      onChange,
      onClear,
      clearable = true,
      placeholder,
      slotProps,
      testId,
      "data-testid": dataTestId,
      sx,
      ...rest
    } = props;

    delete (rest as Record<string, unknown>).InputProps;

    const isSearch = variant === "search";
    const isCompact = compact || size === "compact";
    const activeTestId = resolveTestId(testId, dataTestId, isSearch);
    const muiVariant = resolveMuiVariant(isSearch, variant);
    const muiSize = resolveMuiSize(size);
    const hasValue = determineHasValue(value);
    const handleClear = createClearHandler(onClear, onChange);
    const inputSlot = extractInputSlot(slotProps?.input);

    const startAdornment = resolveStartAdornment(
      isSearch,
      inputSlot.startAdornment as ReactNode,
    );

    const endAdornment = resolveEndAdornment(
      clearable,
      hasValue,
      handleClear,
      inputSlot.endAdornment as ReactNode,
    );

    const mergedSlotProps = {
      ...slotProps,
      input: {
        ...inputSlot,
        startAdornment,
        endAdornment,
      },
    };

    const Component = resolveTextFieldComponent(isSearch, isCompact);
    const mergedSx = resolveMergedSx(fitContent, sx);

    return (
      <Component
        ref={ref}
        variant={muiVariant}
        size={muiSize}
        value={value}
        onChange={onChange}
        placeholder={resolvePlaceholder(placeholder, isSearch)}
        slotProps={mergedSlotProps}
        data-testid={activeTestId}
        sx={mergedSx as SxProps}
        {...rest}
      />
    );
  },
);

TextField.displayName = "TextField";

export const SearchField = forwardRef<HTMLDivElement, TextFieldProps>(
  function SearchField(props, ref) {
    return <TextField ref={ref} variant="search" {...props} />;
  },
);

SearchField.displayName = "SearchField";

export const CompactTextField = forwardRef<HTMLDivElement, TextFieldProps>(
  function CompactTextField(props, ref) {
    return <TextField ref={ref} compact {...props} />;
  },
);

CompactTextField.displayName = "CompactTextField";

export default TextField;
