import React, { forwardRef, type ReactNode } from "react";
import MuiTextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import { styled, alpha } from "@mui/material/styles";
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

export const TextField = forwardRef<HTMLDivElement, TextFieldProps>(
  function TextField(props, ref) {
    const {
      variant = "outlined",
      size = "small",
      value,
      onChange,
      onClear,
      clearable = true,
      placeholder,
      slotProps,
      testId,
      "data-testid": dataTestId,
      ...rest
    } = props;

    delete (rest as Record<string, unknown>).InputProps;

    const isSearch = variant === "search";
    const activeTestId = resolveTestId(testId, dataTestId, isSearch);
    const muiVariant: "outlined" | "filled" | "standard" = isSearch
      ? "outlined"
      : variant;
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

    const Component = isSearch ? StyledSearchTextField : MuiTextField;

    return (
      <Component
        ref={ref}
        variant={muiVariant}
        size={size}
        value={value}
        onChange={onChange}
        placeholder={resolvePlaceholder(placeholder, isSearch)}
        slotProps={mergedSlotProps}
        data-testid={activeTestId}
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

export default TextField;
