import React from "react";
import type { Dayjs } from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";

import type { ClockCardSize, ClockCardProps } from "./ClockCard.types";
import {
  EditableTimePickersRow,
  PickerWrapper,
  IntervalSeparator,
} from "./ClockCard.styles";

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

function resolvePickerFieldSize(size: ClockCardSize): "small" | "medium" {
  return size === "large" ? "medium" : "small";
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
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={normLocale}>
      <EditableTimePickersRow
        $size={size}
        $isHappeningNow={isHappeningNow}
        onClick={(e) => e.stopPropagation()}
        data-testid="time-sheet-editable-pickers"
      >
        <PickerWrapper $size={size} data-testid="time-sheet-start-time-picker">
          <TimePicker
            value={currentStartTime}
            onChange={onStartTimeChange}
            disabled={disabled}
            ampm={is12Hour}
            slotProps={{
              textField: {
                size: resolvePickerFieldSize(size),
                variant: "outlined",
                slotProps: {
                  htmlInput: startInputProps,
                },
                ...timePickerProps?.slotProps?.textField,
              },
              ...timePickerProps?.slotProps,
            }}
            {...timePickerProps}
          />
        </PickerWrapper>

        <IntervalSeparator $size={size} aria-hidden="true">
          –
        </IntervalSeparator>

        <PickerWrapper $size={size} data-testid="time-sheet-end-time-picker">
          <TimePicker
            value={currentEndTime}
            onChange={onEndTimeChange}
            disabled={disabled}
            ampm={is12Hour}
            slotProps={{
              textField: {
                size: resolvePickerFieldSize(size),
                variant: "outlined",
                slotProps: {
                  htmlInput: endInputProps,
                },
                ...timePickerProps?.slotProps?.textField,
              },
              ...timePickerProps?.slotProps,
            }}
            {...timePickerProps}
          />
        </PickerWrapper>
      </EditableTimePickersRow>
    </LocalizationProvider>
  );
}

export default ClockCardEditablePickers;
