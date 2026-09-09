import type { ReactNode, CSSProperties } from "react";
import type { Dayjs } from "dayjs";
import type { SxProps, Theme } from "@mui/material/styles";
import type { TimePickerProps } from "@mui/x-date-pickers/TimePicker";
import type { DatePickerProps } from "@mui/x-date-pickers/DatePicker";
import type { DateTimePickerProps } from "@mui/x-date-pickers/DateTimePicker";

export type DateTimeFieldMode = "time" | "date" | "datetime";
export type DateTimeFieldLayout = "single" | "range" | "period";
export type DateTimeFieldVisualVariant = "outlined" | "filled" | "standard";
export type DateTimeFieldVariant =
  DateTimeFieldLayout | DateTimeFieldVisualVariant;
export type DateTimeFieldSize = "compact" | "small" | "medium" | "large";
export type HourFormat = "12h" | "24h" | "auto";
export type DateFormat = "iso" | "localized" | string;

export type DateTimeValue = Dayjs | Date | string | number | null;

export interface DateTimeRangeValue {
  start: DateTimeValue;
  end: DateTimeValue;
}

export interface DateTimeRangeOutput {
  start: Dayjs | null;
  end: Dayjs | null;
}

export interface DateTimeFieldProps {
  /**
   * Field mode:
   * - "time": Pick hours and minutes
   * - "date": Pick calendar date
   * - "datetime": Pick both date and time
   * @default "time"
   */
  mode?: DateTimeFieldMode;

  /**
   * Layout variant:
   * - "single": Single value picker
   * - "range" / "period": Interval with start and end fields separated by divider
   * Also accepts visual variant ("outlined" | "filled" | "standard") for TextField compatibility.
   * @default "single"
   */
  variant?: DateTimeFieldVariant;

  /**
   * Explicit visual input variant matching MUI TextField.
   * @default "outlined"
   */
  inputVariant?: DateTimeFieldVisualVariant;

  /**
   * Component sizing variant.
   * - "compact": Dense height (32px) for tight tables and cards
   * - "small": 40px height (standard small TextField)
   * - "medium": 56px standard comfortable height (standard TextField)
   * - "large": 56px large touch target
   * @default "medium"
   */
  size?: DateTimeFieldSize;

  /**
   * Shorthand boolean to activate compact 32px dense size variant.
   * When true, overrides size to "compact".
   * @default false
   */
  compact?: boolean;

  /**
   * Text alignment inside the input field.
   * @default "left"
   */
  textAlign?: "left" | "center";

  /**
   * Hour display format:
   * - "12h": 12-hour with AM/PM (e.g. 02:30 PM)
   * - "24h": 24-hour military/European format (e.g. 14:30)
   * - "auto": Inferred from active locale
   * @default "auto"
   */
  hourFormat?: HourFormat;

  /**
   * Boolean shorthand for 12-hour AM/PM format (corresponds to MUI ampm prop).
   */
  ampm?: boolean;

  /**
   * Date formatting mode:
   * - "iso": Always display dates in ISO 8601 format (YYYY-MM-DD)
   * - "localized": Default locale date format
   * - string: Custom Dayjs format string (e.g. "YYYY-MM-DD", "DD/MM/YYYY")
   * @default "iso"
   */
  dateFormat?: DateFormat;

  /**
   * Whether to force ISO format for date presentation (YYYY-MM-DD).
   * @default true
   */
  displayIsoDate?: boolean;

  /**
   * Explicit custom format pattern for Dayjs (overrides default mode formats).
   */
  format?: string;

  /**
   * Controlled value.
   * In "single" mode: DateTimeValue.
   * In "range" / "period" mode: DateTimeRangeValue.
   */
  value?: DateTimeValue | DateTimeRangeValue;

  /**
   * Dedicated start value for range/period mode.
   */
  startValue?: DateTimeValue;

  /**
   * Dedicated end value for range/period mode.
   */
  endValue?: DateTimeValue;

  /**
   * Default uncontrolled value for single mode.
   */
  defaultValue?: DateTimeValue;

  /**
   * Default uncontrolled value for range mode.
   */
  defaultRangeValue?: DateTimeRangeValue;

  /**
   * General change handler.
   * In "single" mode: returns Dayjs | null.
   * In "range" / "period" mode: returns DateTimeRangeOutput.
   */
  onChange?: (value: Dayjs | null | DateTimeRangeOutput) => void;

  /**
   * Callback fired when start value changes in range mode.
   */
  onStartChange?: (value: Dayjs | null) => void;

  /**
   * Callback fired when end value changes in range mode.
   */
  onEndChange?: (value: Dayjs | null) => void;

  /**
   * Aliases for ClockCard compatibility.
   */
  onStartTimeChange?: (value: Dayjs | null) => void;
  onEndTimeChange?: (value: Dayjs | null) => void;

  /**
   * Field label for single mode, or overall group label.
   */
  label?: ReactNode;

  /**
   * Label for start field in range mode.
   */
  startLabel?: string;

  /**
   * Label for end field in range mode.
   */
  endLabel?: string;

  /**
   * Placeholder text for single mode.
   */
  placeholder?: string;

  /**
   * Placeholder text for start field in range mode.
   */
  startPlaceholder?: string;

  /**
   * Placeholder text for end field in range mode.
   */
  endPlaceholder?: string;

  /**
   * Custom separator between start and end pickers.
   * @default "–"
   */
  separator?: ReactNode;

  /**
   * Active locale string (e.g. "en", "fr").
   */
  locale?: string;

  /**
   * Normalized locale string.
   */
  normLocale?: string;

  /**
   * Whether picker interactions are disabled.
   * @default false
   */
  disabled?: boolean;

  /**
   * Whether the field is read-only.
   * @default false
   */
  readOnly?: boolean;

  /**
   * Whether the field is displayed in an error state.
   * @default false
   */
  error?: boolean;

  /**
   * Helper text or error message displayed below the field.
   */
  helperText?: ReactNode;

  /**
   * Whether to stop click event propagation (useful when embedded inside clickable cards).
   * @default true
   */
  stopPropagation?: boolean;

  /**
   * Whether the field should span the full width of its parent container.
   * @default false
   */
  fullWidth?: boolean;

  /**
   * Automatically fit the component width to its contents to eliminate unused space.
   * When true (default when fullWidth is false), inputs snugly hug their text and icon adornment.
   * @default true
   */
  fitContent?: boolean;

  /**
   * Props forwarded to underlying MUI picker(s).
   */
  pickerProps?: Partial<
    TimePickerProps | DatePickerProps | DateTimePickerProps
  >;

  /**
   * Props forwarded specifically to start picker in range mode.
   */
  startPickerProps?: Partial<
    TimePickerProps | DatePickerProps | DateTimePickerProps
  >;

  /**
   * Props forwarded specifically to end picker in range mode.
   */
  endPickerProps?: Partial<
    TimePickerProps | DatePickerProps | DateTimePickerProps
  >;

  /**
   * HTML input props forwarded to start input.
   */
  startInputProps?: Record<string, unknown>;

  /**
   * HTML input props forwarded to end input.
   */
  endInputProps?: Record<string, unknown>;

  /**
   * Primary container test ID.
   */
  testId?: string;

  /**
   * data-testid attribute for the container element.
   */
  "data-testid"?: string;

  /**
   * Container test ID alias.
   */
  containerTestId?: string;

  /**
   * Test ID for start picker wrapper.
   */
  startPickerTestId?: string;

  /**
   * Test ID for end picker wrapper.
   */
  endPickerTestId?: string;

  /**
   * Test ID for start input element.
   */
  startInputTestId?: string;

  /**
   * Test ID for end input element.
   */
  endInputTestId?: string;

  /**
   * Optional CSS class name.
   */
  className?: string;

  /**
   * Optional inline styles.
   */
  style?: CSSProperties;

  /**
   * MUI SX style object.
   */
  sx?: SxProps<Theme>;
}
