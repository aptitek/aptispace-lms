import React, { type ReactNode } from "react";
import type { Dayjs } from "dayjs";
import {
  TimePicker,
  type TimePickerProps,
} from "@mui/x-date-pickers/TimePicker";
import {
  DatePicker,
  type DatePickerProps,
} from "@mui/x-date-pickers/DatePicker";
import {
  DateTimePicker,
  type DateTimePickerProps,
} from "@mui/x-date-pickers/DateTimePicker";

import type {
  DateTimeFieldSize,
  DateTimeFieldMode,
  DateTimeFieldVisualVariant,
} from "./DateTimeField.types";
import { PickerItemWrapper } from "./DateTimeField.styles";

export interface DateTimeFieldPickerItemProps {
  mode: DateTimeFieldMode;
  size: DateTimeFieldSize;
  value: Dayjs | null;
  onChange: (newValue: Dayjs | null) => void;
  activeFormat?: string;
  is12Hour: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  error?: boolean;
  label?: ReactNode;
  placeholder?: string;
  helperText?: ReactNode;
  variant?: DateTimeFieldVisualVariant;
  fullWidth?: boolean;
  fitContent?: boolean;
  isRange?: boolean;
  textAlign?: "left" | "center";
  ariaLabel?: string;
  inputProps?: Record<string, unknown>;
  pickerProps?: Partial<
    TimePickerProps | DatePickerProps | DateTimePickerProps
  >;
  wrapperTestId?: string;
  inputTestId?: string;
}

function resolvePickerFieldSize(size: DateTimeFieldSize): "small" | "medium" {
  return size === "medium" || size === "large" ? "medium" : "small";
}

export function DateTimeFieldPickerItem({
  mode,
  size,
  value,
  onChange,
  activeFormat,
  is12Hour,
  disabled,
  readOnly,
  error,
  label,
  placeholder,
  helperText,
  variant = "outlined",
  fullWidth,
  fitContent = true,
  isRange = false,
  textAlign = "left",
  ariaLabel,
  inputProps,
  pickerProps,
  wrapperTestId,
  inputTestId,
}: DateTimeFieldPickerItemProps) {
  const htmlInput: Record<string, unknown> = {
    ...(inputTestId ? { "data-testid": inputTestId } : {}),
    ...(ariaLabel ? { "aria-label": ariaLabel } : {}),
    ...inputProps,
  };

  const mergedSlotProps = {
    textField: {
      size: resolvePickerFieldSize(size),
      variant,
      error,
      helperText,
      placeholder,
      fullWidth,
      slotProps: {
        htmlInput,
      },
      ...pickerProps?.slotProps?.textField,
    },
    ...pickerProps?.slotProps,
  };

  const commonProps = {
    value,
    onChange,
    disabled,
    readOnly,
    label,
    format: activeFormat,
    slotProps: mergedSlotProps,
  };

  const renderPickerControl = () => {
    if (mode === "date") {
      return (
        <DatePicker
          {...commonProps}
          {...(pickerProps as Partial<DatePickerProps>)}
        />
      );
    }

    if (mode === "datetime") {
      return (
        <DateTimePicker
          ampm={is12Hour}
          {...commonProps}
          {...(pickerProps as Partial<DateTimePickerProps>)}
        />
      );
    }

    return (
      <TimePicker
        ampm={is12Hour}
        {...commonProps}
        {...(pickerProps as Partial<TimePickerProps>)}
      />
    );
  };

  return (
    <PickerItemWrapper
      $size={size}
      $mode={mode}
      $isRange={isRange}
      $fullWidth={fullWidth}
      $fitContent={fitContent}
      $textAlign={textAlign}
      $variant={variant}
      data-testid={wrapperTestId}
    >
      {renderPickerControl()}
    </PickerItemWrapper>
  );
}

export default DateTimeFieldPickerItem;
