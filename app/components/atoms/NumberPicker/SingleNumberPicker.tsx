import React, { forwardRef } from "react";
import { useTranslation } from "react-i18next";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import RemoveRoundedIcon from "@mui/icons-material/RemoveRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";

import { SingleNumberField } from "./NumberPicker.styles";
import type { NumberPickerProps } from "./NumberPicker.types";

function computeDecrementedValue(
  currentValue: number | string,
  min: number,
  step: number,
  allowAll: boolean,
): number | string {
  if (currentValue === "all" || currentValue === "" || currentValue === null) {
    return min;
  }
  const numeric = Number(currentValue);
  if (numeric > min) {
    return numeric - step;
  }
  return allowAll ? "all" : min;
}

function computeIncrementedValue(
  currentValue: number | string,
  min: number,
  max: number,
  step: number,
): number | string {
  if (currentValue === "all" || currentValue === "" || currentValue === null) {
    return min + step;
  }
  const numeric = Number(currentValue);
  if (numeric < max) {
    return numeric + step;
  }
  return numeric;
}

function parseSingleNumberInput(
  rawInput: string,
  min: number,
  max: number,
  allowAll: boolean,
): number | string {
  const raw = rawInput.trim();
  if (raw === "" || raw.toLowerCase() === "all") {
    return allowAll ? "all" : min;
  }
  const parsed = parseInt(raw, 10);
  if (!isNaN(parsed) && parsed >= min && parsed <= max) {
    return parsed;
  }
  return allowAll ? "all" : min;
}

function buildStepAdornments(
  showStepButtons: boolean,
  handleDecrement: () => void,
  handleIncrement: () => void,
  activeTestId: string,
) {
  if (!showStepButtons) {
    return {};
  }
  return {
    startAdornment: (
      <InputAdornment position="start">
        <IconButton
          size="small"
          onClick={handleDecrement}
          aria-label="Decrease"
          sx={{ p: 0.5 }}
          data-testid={`${activeTestId}-decrement`}
        >
          <RemoveRoundedIcon sx={{ fontSize: 16 }} />
        </IconButton>
      </InputAdornment>
    ),
    endAdornment: (
      <InputAdornment position="end">
        <IconButton
          size="small"
          onClick={handleIncrement}
          aria-label="Increase"
          sx={{ p: 0.5 }}
          data-testid={`${activeTestId}-increment`}
        >
          <AddRoundedIcon sx={{ fontSize: 16 }} />
        </IconButton>
      </InputAdornment>
    ),
  };
}

const DEFAULT_SINGLE_CONFIG = {
  value: "all",
  min: 0,
  max: 2100,
  step: 1,
  showStepButtons: true,
  allowAll: true,
  size: "small" as const,
};

function resolveDisplayValue(value: number | string): number | string {
  if (value === "all" || value === "") return "";
  return value;
}

function resolveSinglePickerValues(props: NumberPickerProps) {
  const merged = { ...DEFAULT_SINGLE_CONFIG, ...props };
  const activeTestId = props.testId ?? props["data-testid"] ?? "number-picker";
  return {
    ...merged,
    activeTestId,
    displayValue: resolveDisplayValue(merged.value),
  };
}

function resolveSinglePlaceholder(
  placeholder?: string,
  allowAll?: boolean,
  allText?: string,
): string | undefined {
  if (placeholder !== undefined) {
    return placeholder;
  }
  return allowAll ? allText : undefined;
}

export const SingleNumberPicker = forwardRef<HTMLDivElement, NumberPickerProps>(
  function SingleNumberPicker(props, ref) {
    const { t } = useTranslation("common");
    const {
      onChange,
      label,
      placeholder,
      disabled,
      className,
      sx,
      ...restProps
    } = props;

    // Filter out custom props so they do not leak into MUI TextField
    const cleanProps: Record<string, unknown> = { ...restProps };
    delete cleanProps.showStepButtons;
    delete cleanProps.allowAll;
    delete cleanProps.step;
    delete cleanProps.min;
    delete cleanProps.max;
    delete cleanProps.value;
    delete cleanProps.mode;
    delete cleanProps.variant;
    delete cleanProps.testId;
    delete cleanProps["data-testid"];
    delete cleanProps.shrink;

    const {
      value,
      min,
      max,
      step,
      showStepButtons,
      allowAll,
      size,
      activeTestId,
      displayValue,
    } = resolveSinglePickerValues(props);

    const handleDecrement = () => {
      if (onChange) {
        onChange(computeDecrementedValue(value, min, step, allowAll));
      }
    };

    const handleIncrement = () => {
      if (onChange) {
        onChange(computeIncrementedValue(value, min, max, step));
      }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (onChange) {
        onChange(parseSingleNumberInput(e.target.value, min, max, allowAll));
      }
    };

    const stepAdornments = buildStepAdornments(
      showStepButtons,
      handleDecrement,
      handleIncrement,
      activeTestId,
    );

    return (
      <SingleNumberField
        ref={ref}
        variant="outlined"
        size={size}
        label={label}
        disabled={disabled}
        placeholder={resolveSinglePlaceholder(
          placeholder,
          allowAll,
          t("cohortYear.all", "All"),
        )}
        value={displayValue}
        onChange={handleInputChange}
        className={className}
        sx={{ minWidth: 130, ...sx }}
        data-testid={activeTestId}
        slotProps={{
          input: stepAdornments,
          inputLabel:
            props.shrink !== undefined ? { shrink: props.shrink } : undefined,
          htmlInput: {
            min,
            max,
            step,
          },
        }}
        {...cleanProps}
      />
    );
  },
);

SingleNumberPicker.displayName = "SingleNumberPicker";
export default SingleNumberPicker;
