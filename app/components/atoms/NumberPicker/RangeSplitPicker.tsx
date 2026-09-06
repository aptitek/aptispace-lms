import React, { forwardRef } from "react";
import { useTranslation } from "react-i18next";
import IconButton from "@mui/material/IconButton";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";

import { SplitRangeContainer, RangeSeparator } from "./NumberPicker.styles";
import { SingleNumberPicker } from "./SingleNumberPicker";
import type { NumberPickerProps } from "./NumberPicker.types";

function parseBoundaryValue(value: number | string): number | null {
  if (value === "" || value === "all") return null;
  return Number(value);
}

function formatBoundaryLabel(label: string, placeholder: string): string {
  if (!label) return placeholder;
  return `${label} (${placeholder})`;
}

interface SplitFieldProps {
  label: string;
  value: number | null;
  onChange?: (value: number | null) => void;
  size: "small" | "medium";
  disabled: boolean;
  min: number;
  max: number;
  step: number;
  showStepButtons: boolean;
  testId: string;
}

function SplitField(props: SplitFieldProps) {
  const {
    label,
    value,
    onChange,
    size,
    disabled,
    min,
    max,
    step,
    showStepButtons,
    testId,
  } = props;
  const handleChange = (rawInput: number | string) => {
    onChange?.(parseBoundaryValue(rawInput));
  };

  return (
    <SingleNumberPicker
      label={label}
      value={value ?? ""}
      onChange={handleChange}
      size={size}
      disabled={disabled}
      min={min}
      max={max}
      step={step}
      showStepButtons={showStepButtons}
      allowAll={false}
      testId={testId}
    />
  );
}

export interface RangeViewProps extends NumberPickerProps {
  activeTestId: string;
  displayLabel: string;
  fromPlaceholder: string;
  toPlaceholder: string;
  effectiveMin: number | null;
  effectiveMax: number | null;
  hasValue: boolean;
  handleMinChange?: (value: number | null) => void;
  handleMaxChange?: (value: number | null) => void;
  handleClear: (e: React.MouseEvent) => void;
}

export const RangeSplitPicker = forwardRef<HTMLDivElement, RangeViewProps>(
  function RangeSplitPicker(props, ref) {
    const { t } = useTranslation("common");
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
      clearable = true,
      size = "small",
      disabled = false,
      min = 1900,
      max = 2100,
      step = 1,
      showStepButtons = true,
      className,
      sx,
    } = props;

    const fromLabel = formatBoundaryLabel(displayLabel, fromPlaceholder);
    const toLabel = formatBoundaryLabel(displayLabel, toPlaceholder);

    return (
      <SplitRangeContainer
        ref={ref}
        className={className}
        sx={sx}
        data-testid={activeTestId}
      >
        <SplitField
          label={fromLabel}
          value={effectiveMin}
          onChange={handleMinChange}
          size={size}
          disabled={disabled}
          min={min}
          max={max}
          step={step}
          showStepButtons={showStepButtons}
          testId={`${activeTestId}-from`}
        />
        <RangeSeparator>–</RangeSeparator>
        <SplitField
          label={toLabel}
          value={effectiveMax}
          onChange={handleMaxChange}
          size={size}
          disabled={disabled}
          min={min}
          max={max}
          step={step}
          showStepButtons={showStepButtons}
          testId={`${activeTestId}-to`}
        />
        {clearable && hasValue && (
          <IconButton
            size="small"
            onClick={handleClear}
            aria-label={t("filterBar.clearYearRange", "Clear range")}
            sx={{ p: 0.5 }}
            data-testid={`${activeTestId}-clear-button`}
          >
            <ClearRoundedIcon sx={{ fontSize: 16 }} />
          </IconButton>
        )}
      </SplitRangeContainer>
    );
  },
);

RangeSplitPicker.displayName = "RangeSplitPicker";
export default RangeSplitPicker;
