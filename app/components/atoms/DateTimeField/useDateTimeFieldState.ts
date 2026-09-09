import { useState, useCallback } from "react";
import type { Dayjs } from "dayjs";
import type {
  DateTimeFieldProps,
  DateTimeRangeValue,
  DateTimeValue,
} from "./DateTimeField.types";
import { toDayjs } from "./DateTimeField.utils";

function resolveInitialValue(
  directValue?: DateTimeValue,
  nestedValue?: DateTimeValue,
  fallbackValue?: DateTimeValue,
): Dayjs | null {
  const selected = directValue ?? nestedValue ?? fallbackValue;
  return toDayjs(selected);
}

function resolveControlledValue(
  directValue: DateTimeValue | undefined,
  nestedValue: DateTimeValue | undefined,
  fallbackValue: Dayjs | null,
): Dayjs | null {
  if (directValue !== undefined) return toDayjs(directValue);
  if (nestedValue !== undefined) return toDayjs(nestedValue);
  return fallbackValue;
}

export function useDateTimeFieldState(props: DateTimeFieldProps) {
  const {
    variant = "single",
    value,
    startValue,
    endValue,
    defaultValue,
    defaultRangeValue,
    onChange,
    onStartChange,
    onEndChange,
    onStartTimeChange,
    onEndTimeChange,
  } = props;

  const isRange = variant === "range" || variant === "period";
  const rangePropValue = value as DateTimeRangeValue | undefined;

  const [uncontrolledStart, setUncontrolledStart] = useState<Dayjs | null>(() =>
    resolveInitialValue(
      startValue,
      rangePropValue?.start,
      defaultRangeValue?.start,
    ),
  );
  const [uncontrolledEnd, setUncontrolledEnd] = useState<Dayjs | null>(() =>
    resolveInitialValue(endValue, rangePropValue?.end, defaultRangeValue?.end),
  );
  const [uncontrolledSingle, setUncontrolledSingle] = useState<Dayjs | null>(
    () => toDayjs((value as DateTimeValue) ?? defaultValue),
  );

  const resolvedStart = resolveControlledValue(
    startValue,
    rangePropValue?.start,
    uncontrolledStart,
  );
  const resolvedEnd = resolveControlledValue(
    endValue,
    rangePropValue?.end,
    uncontrolledEnd,
  );
  const resolvedSingle =
    value !== undefined && !isRange
      ? toDayjs(value as DateTimeValue)
      : uncontrolledSingle;

  const handleSingleChange = useCallback(
    (newValue: Dayjs | null) => {
      setUncontrolledSingle(newValue);
      onChange?.(newValue);
      onStartChange?.(newValue);
      onStartTimeChange?.(newValue);
    },
    [onChange, onStartChange, onStartTimeChange],
  );

  const handleStartChange = useCallback(
    (newValue: Dayjs | null) => {
      setUncontrolledStart(newValue);
      onStartChange?.(newValue);
      onStartTimeChange?.(newValue);
      onChange?.({ start: newValue, end: resolvedEnd });
    },
    [onStartChange, onStartTimeChange, onChange, resolvedEnd],
  );

  const handleEndChange = useCallback(
    (newValue: Dayjs | null) => {
      setUncontrolledEnd(newValue);
      onEndChange?.(newValue);
      onEndTimeChange?.(newValue);
      onChange?.({ start: resolvedStart, end: newValue });
    },
    [onEndChange, onEndTimeChange, onChange, resolvedStart],
  );

  return {
    isRange,
    resolvedStart,
    resolvedEnd,
    resolvedSingle,
    handleSingleChange,
    handleStartChange,
    handleEndChange,
  };
}
