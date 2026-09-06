import React, { forwardRef, useState, useId, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import InputLabel from "@mui/material/InputLabel";
import DateRangeRoundedIcon from "@mui/icons-material/DateRangeRounded";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import RemoveRoundedIcon from "@mui/icons-material/RemoveRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";

import {
  RangeFormControl,
  RangeOutlinedInput,
  RangeInputsContainer,
  RangeSubInputWrapper,
  RangeSubInput,
  RangeSeparator,
} from "./NumberPicker.styles";
import type { InputBaseComponentProps } from "@mui/material/InputBase";
import { RangeSplitPicker, type RangeViewProps } from "./RangeSplitPicker";
import type { NumberPickerProps } from "./NumberPicker.types";

function parseNumberInput(text: string): number | null {
  const trimmed = text.trim();
  if (!trimmed) return null;
  const num = parseInt(trimmed, 10);
  if (isNaN(num)) return null;
  return num;
}

function getDefaultInitialYear(min: number, max: number): number {
  const currentYear = new Date().getFullYear();
  if (currentYear >= min && currentYear <= max) {
    return currentYear;
  }
  return min;
}

interface StepBounds {
  min: number;
  max: number;
  step: number;
}

function computeStepValue(
  current: number | null,
  direction: "increment" | "decrement",
  bounds: StepBounds,
  otherVal: number | null,
): number {
  const { min, max, step } = bounds;
  if (current === null) {
    if (otherVal !== null) {
      return direction === "increment"
        ? otherVal
        : Math.max(min, otherVal - step);
    }
    return getDefaultInitialYear(min, max);
  }

  if (direction === "increment") {
    return current + step <= max ? current + step : max;
  }
  return current - step >= min ? current - step : min;
}

export function resolveEffectiveRangeValues(props: NumberPickerProps) {
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

interface DualRangeInputsProps {
  className?: string;
  fromValue: number | null;
  toValue: number | null;
  fromPlaceholder: string;
  toPlaceholder: string;
  fromTestId: string;
  toTestId: string;
  fromId: string;
  toId: string;
  min: number;
  max: number;
  step: number;
  disabled: boolean;
  activeBoundary: "from" | "to";
  isFocused: boolean;
  onSelectBoundary: (boundary: "from" | "to") => void;
  onFromChange?: (value: number | null) => void;
  onToChange?: (value: number | null) => void;
}

const DualRangeInputs = forwardRef<HTMLInputElement, DualRangeInputsProps>(
  function DualRangeInputs(props, ref) {
    const {
      className,
      fromValue,
      toValue,
      fromPlaceholder,
      toPlaceholder,
      fromTestId,
      toTestId,
      fromId,
      toId,
      min,
      max,
      step,
      disabled,
      activeBoundary,
      isFocused,
      onSelectBoundary,
      onFromChange,
      onToChange,
    } = props;

    return (
      <RangeInputsContainer className={className}>
        <RangeSubInputWrapper
          $isActive={activeBoundary === "from"}
          $isFocused={isFocused}
          onClick={() => onSelectBoundary("from")}
        >
          <RangeSubInput
            ref={ref}
            id={fromId}
            type="number"
            value={fromValue ?? ""}
            placeholder={fromPlaceholder}
            onFocus={() => onSelectBoundary("from")}
            onChange={(e) => onFromChange?.(parseNumberInput(e.target.value))}
            disabled={disabled}
            min={min}
            max={max}
            step={step}
            data-testid={fromTestId}
            aria-label={fromPlaceholder}
          />
        </RangeSubInputWrapper>

        <RangeSeparator aria-hidden="true">–</RangeSeparator>

        <RangeSubInputWrapper
          $isActive={activeBoundary === "to"}
          $isFocused={isFocused}
          onClick={() => onSelectBoundary("to")}
        >
          <RangeSubInput
            id={toId}
            type="number"
            value={toValue ?? ""}
            placeholder={toPlaceholder}
            onFocus={() => onSelectBoundary("to")}
            onChange={(e) => onToChange?.(parseNumberInput(e.target.value))}
            disabled={disabled}
            min={min}
            max={max}
            step={step}
            data-testid={toTestId}
            aria-label={toPlaceholder}
          />
        </RangeSubInputWrapper>
      </RangeInputsContainer>
    );
  },
);

DualRangeInputs.displayName = "DualRangeInputs";

interface StartAdornmentOptions {
  icon: ReactNode | undefined;
  disabled: boolean;
  onDecrement: () => void;
  testId: string;
}

function buildStartAdornment(options: StartAdornmentOptions) {
  const { icon, disabled, onDecrement, testId } = options;
  return (
    <InputAdornment position="start" sx={{ mr: 0.5 }}>
      {icon !== null &&
        (icon ? (
          <Box sx={{ mr: 0.5, display: "flex", alignItems: "center" }}>
            {icon}
          </Box>
        ) : (
          <DateRangeRoundedIcon
            data-testid="range-icon"
            sx={{ display: "none" }}
          />
        ))}
      <IconButton
        size="small"
        onClick={onDecrement}
        disabled={disabled}
        aria-label="Decrease"
        sx={{ p: 0.5 }}
        data-testid={`${testId}-decrement`}
      >
        <RemoveRoundedIcon sx={{ fontSize: 16 }} />
      </IconButton>
    </InputAdornment>
  );
}

interface EndAdornmentOptions {
  clearable: boolean;
  hasValue: boolean;
  disabled: boolean;
  onClear: (e: React.MouseEvent) => void;
  onIncrement: () => void;
  clearLabel: string;
  testId: string;
}

function buildEndAdornment(options: EndAdornmentOptions) {
  const {
    clearable,
    hasValue,
    disabled,
    onClear,
    onIncrement,
    clearLabel,
    testId,
  } = options;

  return (
    <InputAdornment position="end" sx={{ ml: 0.25, gap: 0.25 }}>
      {clearable && hasValue && (
        <IconButton
          size="small"
          onClick={onClear}
          disabled={disabled}
          aria-label={clearLabel}
          sx={{
            p: 0.25,
            opacity: 0,
            transition: (theme) =>
              theme.transitions.create(["opacity", "color"], {
                duration: theme.transitions.duration.shorter,
              }),
            ".MuiOutlinedInput-root:hover &": {
              opacity: 0.6,
            },
            "&:hover": {
              opacity: "1 !important",
              color: "text.primary",
            },
          }}
          data-testid={`${testId}-clear-button`}
        >
          <ClearRoundedIcon sx={{ fontSize: 14 }} />
        </IconButton>
      )}
      <IconButton
        size="small"
        onClick={onIncrement}
        disabled={disabled}
        aria-label="Increase"
        sx={{ p: 0.5 }}
        data-testid={`${testId}-increment`}
      >
        <AddRoundedIcon sx={{ fontSize: 16 }} />
      </IconButton>
    </InputAdornment>
  );
}

const DEFAULT_UNIFIED_PROPS = {
  clearable: true,
  size: "small" as const,
  disabled: false,
  fullWidth: false,
  min: 1900,
  max: 2100,
  step: 1,
};

const RangeUnifiedPicker = forwardRef<HTMLDivElement, RangeViewProps>(
  function RangeUnifiedPicker(props, ref) {
    const { t } = useTranslation("common");
    const merged = { ...DEFAULT_UNIFIED_PROPS, ...props };
    const {
      activeTestId,
      displayLabel,
      fromPlaceholder,
      toPlaceholder,
      effectiveMin,
      effectiveMax,
      hasValue,
      handleMinChange,
      handleMaxChange,
      handleClear,
      icon,
      clearable,
      size,
      disabled,
      fullWidth,
      min,
      max,
      step,
      className,
      sx,
    } = merged;

    const [isFocused, setIsFocused] = useState(false);
    const [activeBoundary, setActiveBoundary] = useState<"from" | "to">("from");
    const autoId = useId();

    const handleFocus = () => {
      setIsFocused(true);
    };

    const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
      if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
        setIsFocused(false);
      }
    };

    const bounds: StepBounds = { min, max, step };

    const handleDecrement = () => {
      if (activeBoundary === "from") {
        const nextMin = computeStepValue(
          effectiveMin,
          "decrement",
          bounds,
          effectiveMax,
        );
        handleMinChange?.(nextMin);
      } else {
        const nextMax = computeStepValue(
          effectiveMax,
          "decrement",
          bounds,
          effectiveMin,
        );
        handleMaxChange?.(nextMax);
      }
    };

    const handleIncrement = () => {
      if (activeBoundary === "from") {
        const nextMin = computeStepValue(
          effectiveMin,
          "increment",
          bounds,
          effectiveMax,
        );
        handleMinChange?.(nextMin);
      } else {
        const nextMax = computeStepValue(
          effectiveMax,
          "increment",
          bounds,
          effectiveMin,
        );
        handleMaxChange?.(nextMax);
      }
    };

    const startAdornment = buildStartAdornment({
      icon,
      disabled,
      onDecrement: handleDecrement,
      testId: activeTestId,
    });

    const endAdornment = buildEndAdornment({
      clearable,
      hasValue,
      disabled,
      onClear: handleClear,
      onIncrement: handleIncrement,
      clearLabel: t("filterBar.clearYearRange", "Clear range"),
      testId: activeTestId,
    });

    const fromId = `${activeTestId}-from-input-${autoId}`;
    const toId = `${activeTestId}-to-input-${autoId}`;
    const isShrunk = props.shrink ?? true;
    const hasLabel = Boolean(displayLabel);

    return (
      <RangeFormControl
        ref={ref}
        size={size}
        variant="outlined"
        focused={isFocused}
        disabled={disabled}
        $fullWidth={fullWidth}
        className={className}
        sx={sx}
        data-testid={activeTestId}
        onFocus={handleFocus}
        onBlur={handleBlur}
      >
        {hasLabel && (
          <InputLabel
            shrink={isShrunk}
            htmlFor={fromId}
            sx={{ pointerEvents: "none" }}
          >
            {displayLabel}
          </InputLabel>
        )}

        <RangeOutlinedInput
          size={size}
          label={displayLabel}
          notched={isShrunk && hasLabel}
          startAdornment={startAdornment}
          endAdornment={endAdornment}
          inputComponent={
            DualRangeInputs as unknown as React.ElementType<InputBaseComponentProps>
          }
          inputProps={{
            fromValue: effectiveMin,
            toValue: effectiveMax,
            fromPlaceholder,
            toPlaceholder,
            fromTestId: `${activeTestId}-from`,
            toTestId: `${activeTestId}-to`,
            fromId,
            toId,
            min,
            max,
            step,
            disabled,
            activeBoundary,
            isFocused,
            onSelectBoundary: setActiveBoundary,
            onFromChange: handleMinChange,
            onToChange: handleMaxChange,
          }}
        />
      </RangeFormControl>
    );
  },
);

RangeUnifiedPicker.displayName = "RangeUnifiedPicker";

export const RangeNumberPicker = forwardRef<HTMLDivElement, NumberPickerProps>(
  function RangeNumberPicker(props, ref) {
    const { t } = useTranslation("common");
    const {
      variant = "unified",
      label,
      placeholderMin,
      placeholderMax,
    } = props;

    const {
      effectiveMin,
      effectiveMax,
      handleMinChange,
      handleMaxChange,
      hasValue,
    } = resolveEffectiveRangeValues(props);

    const activeTestId =
      props.testId ?? props["data-testid"] ?? "number-range-picker";
    const displayLabel = label ?? t("filterBar.startYearRange", "Start Year");
    const fromPlaceholder = placeholderMin ?? t("filterBar.yearFrom", "From");
    const toPlaceholder = placeholderMax ?? t("filterBar.yearTo", "To");

    const handleClear = (e: React.MouseEvent) => {
      e.stopPropagation();
      handleMinChange?.(null);
      handleMaxChange?.(null);
    };

    const viewProps: RangeViewProps = {
      ...props,
      activeTestId,
      displayLabel,
      fromPlaceholder,
      toPlaceholder,
      effectiveMin,
      effectiveMax,
      hasValue,
      handleMinChange,
      handleMaxChange,
      handleClear,
    };

    if (variant === "split") {
      return <RangeSplitPicker ref={ref} {...viewProps} />;
    }

    return <RangeUnifiedPicker ref={ref} {...viewProps} />;
  },
);

RangeNumberPicker.displayName = "RangeNumberPicker";
export default RangeNumberPicker;
