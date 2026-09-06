import React from "react";
import NumberPicker from "~/components/atoms/NumberPicker/NumberPicker";

export interface YearRangePickerProps {
  startYearMin: number | null;
  onStartYearMinChange: (year: number | null) => void;
  startYearMax: number | null;
  onStartYearMaxChange: (year: number | null) => void;
  label?: string;
  testId?: string;
}

export function YearRangePicker({
  startYearMin,
  startYearMax,
  onStartYearMinChange,
  onStartYearMaxChange,
  label,
  testId = "year-range-picker",
}: YearRangePickerProps) {
  return (
    <NumberPicker
      mode="range"
      label={label}
      startYearMin={startYearMin}
      startYearMax={startYearMax}
      onStartYearMinChange={onStartYearMinChange}
      onStartYearMaxChange={onStartYearMaxChange}
      testId={testId}
    />
  );
}

export default YearRangePicker;
