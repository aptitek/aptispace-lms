import React from "react";
import type { Dayjs } from "dayjs";
import DateTimeField from "../../atoms/DateTimeField";
import type { ClockCardSize, ClockCardProps } from "./ClockCard.types";
import { EditableTimePickersRow } from "./ClockCard.styles";

export interface ClockCardEditablePickersProps {
  size: ClockCardSize;
  isHappeningNow: boolean;
  disabled?: boolean;
  currentStartTime: Dayjs;
  currentEndTime: Dayjs;
  onStartTimeChange: (newVal: Dayjs | null) => void;
  onEndTimeChange: (newVal: Dayjs | null) => void;
  isFr: boolean;
  is12Hour: boolean;
  normLocale: string;
  timePickerProps?: ClockCardProps["timePickerProps"];
}

export function ClockCardEditablePickers({
  size,
  isHappeningNow,
  disabled,
  currentStartTime,
  currentEndTime,
  onStartTimeChange,
  onEndTimeChange,
  isFr,
  is12Hour,
  normLocale,
  timePickerProps,
}: ClockCardEditablePickersProps) {
  const startInputProps: Record<string, unknown> = {
    "data-testid": "time-sheet-start-time-input",
    "aria-label": isFr ? "Heure de début" : "Start time",
  };

  const endInputProps: Record<string, unknown> = {
    "data-testid": "time-sheet-end-time-input",
    "aria-label": isFr ? "Heure de fin" : "End time",
  };

  return (
    <EditableTimePickersRow
      $size={size}
      $isHappeningNow={isHappeningNow}
      onClick={(e) => e.stopPropagation()}
      data-testid="time-sheet-editable-pickers"
    >
      <DateTimeField
        mode="time"
        variant="range"
        size={size}
        hourFormat={is12Hour ? "12h" : "24h"}
        disabled={disabled}
        startValue={currentStartTime}
        endValue={currentEndTime}
        onStartTimeChange={onStartTimeChange}
        onEndTimeChange={onEndTimeChange}
        normLocale={normLocale}
        locale={normLocale}
        startPickerTestId="time-sheet-start-time-picker"
        endPickerTestId="time-sheet-end-time-picker"
        startInputProps={startInputProps}
        endInputProps={endInputProps}
        pickerProps={timePickerProps}
        stopPropagation={true}
      />
    </EditableTimePickersRow>
  );
}

export default ClockCardEditablePickers;
