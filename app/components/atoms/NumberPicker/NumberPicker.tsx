import React, { forwardRef, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import DateRangeRoundedIcon from "@mui/icons-material/DateRangeRounded";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import RemoveRoundedIcon from "@mui/icons-material/RemoveRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";

import {
  RangeContainer,
  RangeInputField,
  SingleNumberField,
} from "./NumberPicker.styles";
import type { NumberPickerProps } from "./NumberPicker.types";

function parseNumberInput(text: string): number | null {
  if (!text.trim()) return null;
  const num = parseInt(text, 10);
  if (isNaN(num)) return null;
  return num;
}

function checkIsRangeMode(props: NumberPickerProps): boolean {
  if (props.mode === "range") return true;
  if (props.mode === "single") return false;
  const hasRangeHandlers = Boolean(
    props.onMinChange ||
    props.onMaxChange ||
    props.onStartYearMinChange ||
    props.onStartYearMaxChange,
  );
  const hasRangeValues =
    props.minValue !== undefined ||
    props.maxValue !== undefined ||
    props.startYearMin !== undefined ||
    props.startYearMax !== undefined;
  return hasRangeHandlers || hasRangeValues;
}

function resolveEffectiveRangeValues(props: NumberPickerProps) {
  const effectiveMin =
    props.minValue !== undefined
      ? props.minValue
      : (props.startYearMin ?? null);
  const effectiveMax =
    props.maxValue !== undefined
      ? props.maxValue
      : (props.startYearMax ?? null);
  const handleMinChange = props.onMinChange ?? props.onStartYearMinChange;
  const handleMaxChange = props.onMaxChange ?? props.onStartYearMaxChange;
  const hasValue = effectiveMin !== null || effectiveMax !== null;
  return {
    effectiveMin,
    effectiveMax,
    handleMinChange,
    handleMaxChange,
    hasValue,
  };
}

function RangeIcon({
  icon,
  hasValue,
}: {
  icon?: ReactNode;
  hasValue: boolean;
}) {
  if (icon) return <>{icon}</>;
  return (
    <DateRangeRoundedIcon
      fontSize="small"
      sx={{
        color: hasValue ? "primary.main" : "text.secondary",
        flexShrink: 0,
      }}
      data-testid="range-icon"
    />
  );
}

function RangeLabel({
  label,
  hasValue,
}: {
  label?: string;
  hasValue: boolean;
}) {
  if (!label) return null;
  return (
    <Typography
      variant="caption"
      sx={{
        fontWeight: 600,
        color: hasValue ? "primary.main" : "text.secondary",
        whiteSpace: "nowrap",
      }}
    >
      {label}:
    </Typography>
  );
}

function RangeClearButton({
  clearable,
  hasValue,
  onClear,
  testId,
}: {
  clearable?: boolean;
  hasValue: boolean;
  onClear: () => void;
  testId: string;
}) {
  const { t } = useTranslation("common");
  if (!clearable || !hasValue) return null;
  return (
    <IconButton
      size="small"
      onClick={onClear}
      aria-label={t("filterBar.clearYearRange", "Clear range")}
      sx={{ p: 0.5 }}
      data-testid={`${testId}-clear-button`}
    >
      <ClearRoundedIcon sx={{ fontSize: 14 }} />
    </IconButton>
  );
}

const RangeNumberPicker = forwardRef<HTMLDivElement, NumberPickerProps>(
  function RangeNumberPicker(props, ref) {
    const { t } = useTranslation("common");
    const {
      label,
      placeholderMin,
      placeholderMax,
      icon,
      clearable = true,
      className,
      sx,
      testId,
      "data-testid": dataTestId,
    } = props;

    const {
      effectiveMin,
      effectiveMax,
      handleMinChange,
      handleMaxChange,
      hasValue,
    } = resolveEffectiveRangeValues(props);

    const activeTestId = testId ?? dataTestId ?? "number-range-picker";
    const displayLabel = label ?? t("filterBar.startYearRange", "Start Year");

    const handleClear = () => {
      handleMinChange?.(null);
      handleMaxChange?.(null);
    };

    return (
      <RangeContainer
        ref={ref}
        className={className}
        sx={sx}
        $hasValue={hasValue}
        data-testid={activeTestId}
      >
        <RangeIcon icon={icon} hasValue={hasValue} />
        <RangeLabel label={displayLabel} hasValue={hasValue} />

        <RangeInputField
          size="small"
          type="number"
          placeholder={placeholderMin ?? t("filterBar.yearFrom", "From")}
          value={effectiveMin ?? ""}
          onChange={(e) => handleMinChange?.(parseNumberInput(e.target.value))}
          slotProps={{
            htmlInput: {
              min: 1900,
              max: 2100,
              step: 1,
            },
          }}
          data-testid={`${activeTestId}-from`}
        />

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ userSelect: "none" }}
        >
          –
        </Typography>

        <RangeInputField
          size="small"
          type="number"
          placeholder={placeholderMax ?? t("filterBar.yearTo", "To")}
          value={effectiveMax ?? ""}
          onChange={(e) => handleMaxChange?.(parseNumberInput(e.target.value))}
          slotProps={{
            htmlInput: {
              min: 1900,
              max: 2100,
              step: 1,
            },
          }}
          data-testid={`${activeTestId}-to`}
        />

        <RangeClearButton
          clearable={clearable}
          hasValue={hasValue}
          onClear={handleClear}
          testId={activeTestId}
        />
      </RangeContainer>
    );
  },
);

RangeNumberPicker.displayName = "RangeNumberPicker";

function computeDecrementedValue(
  value: number | string,
  min: number,
  step: number,
  allowAll: boolean,
): number | string {
  if (value === "all" || value === "" || value === null) {
    return min;
  }
  const current = Number(value);
  if (current > min) {
    return current - step;
  }
  return allowAll ? "all" : min;
}

function computeIncrementedValue(
  value: number | string,
  min: number,
  max: number,
  step: number,
): number | string {
  if (value === "all" || value === "" || value === null) {
    return min + step;
  }
  const current = Number(value);
  if (current < max) {
    return current + step;
  }
  return current;
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
  const num = parseInt(raw, 10);
  if (!isNaN(num) && num >= min && num <= max) {
    return num;
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

const SingleNumberPicker = forwardRef<HTMLDivElement, NumberPickerProps>(
  function SingleNumberPicker(props, ref) {
    const { t } = useTranslation("common");
    const { onChange, label, placeholder, className, sx, ...rest } = props;

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
        size={size}
        label={label}
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
        }}
        {...rest}
      />
    );
  },
);

SingleNumberPicker.displayName = "SingleNumberPicker";

export const NumberPicker = forwardRef<HTMLDivElement, NumberPickerProps>(
  function NumberPicker(props, ref) {
    if (checkIsRangeMode(props)) {
      return <RangeNumberPicker ref={ref} {...props} />;
    }
    return <SingleNumberPicker ref={ref} {...props} />;
  },
);

NumberPicker.displayName = "NumberPicker";
export default NumberPicker;
