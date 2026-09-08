import type { CSSProperties } from "react";
import type { Dayjs } from "dayjs";
import type { TimePickerProps } from "@mui/x-date-pickers/TimePicker";

export type ClockCardSize = "small" | "medium" | "large";
export type ClockCardOrientation = "vertical" | "horizontal";
export type ClockCardColor = "primary" | "secondary" | "error" | "default";
export type HourFormat = "12h" | "24h" | "auto";

export interface ClockCardProps {
  /**
   * Event start time.
   */
  startTime: Date | string | number | Dayjs;

  /**
   * Event end time.
   */
  endTime: Date | string | number | Dayjs;

  /**
   * Reference anchor time for calculating relative status (defaults to current time).
   */
  referenceTime?: Date | string | number | Dayjs;

  /**
   * Whether to display 12-hour (e.g. 2:00 PM - 3:30 PM) or 24-hour (14:00 - 15:30) format.
   * "auto" detects according to current locale.
   * @default "auto"
   */
  hourFormat?: HourFormat;

  /**
   * Component sizing variant.
   * @default "medium"
   */
  size?: ClockCardSize;

  /**
   * Card orientation.
   * @default "vertical"
   */
  orientation?: ClockCardOrientation;

  /**
   * Language locale (e.g. 'en', 'fr').
   */
  locale?: string;

  /**
   * Color theme.
   * @default "primary"
   */
  color?: ClockCardColor;

  /**
   * Whether to show calendar-style binder perforations at the top.
   * @default true
   */
  showPerforations?: boolean;

  /**
   * Optional CSS class.
   */
  className?: string;

  /**
   * Optional inline styles.
   */
  style?: CSSProperties;

  /**
   * Click handler for interactive cards.
   */
  onClick?: () => void;

  /**
   * Accessible ARIA label.
   */
  ariaLabel?: string;

  /**
   * Optional controlled hover state (previewing needle animation to end time).
   */
  isHovered?: boolean;

  /**
   * Whether the clock card is editable via MUI TimePickers.
   * When true, start and end times are rendered as interactive text fields.
   * @default false
   */
  editable?: boolean;

  /**
   * Whether time picker interaction is disabled.
   * @default false
   */
  disabled?: boolean;

  /**
   * Callback fired when start time changes.
   */
  onStartTimeChange?: (newStartTime: Dayjs) => void;

  /**
   * Callback fired when end time changes.
   */
  onEndTimeChange?: (newEndTime: Dayjs) => void;

  /**
   * Callback fired when either start or end time changes.
   */
  onTimeChange?: (times: TimeChangePayload) => void;

  /**
   * Alias for onTimeChange for standard form / input compatibility.
   */
  onChange?: (times: TimeChangePayload) => void;

  /**
   * Optional props forwarded to underlying MUI TimePicker components.
   */
  timePickerProps?: Partial<TimePickerProps>;
}

export interface TimeChangePayload {
  startTime: Dayjs;
  endTime: Dayjs;
}

export interface TimeIntervalInfo {
  isToday: boolean;
  isHappeningNow: boolean;
  isUpcomingToday: boolean;
  isPastToday: boolean;
  digitalRange: string;
  durationFormatted: string;
  startHourAngle: number;
  endHourAngle: number;
  startMinuteAngle: number;
  endMinuteAngle: number;
  targetEndHourAngle: number;
  targetEndMinuteAngle: number;
  sweepAngle: number;
  endDot: {
    x: number;
    y: number;
    angle: number;
    radius: number;
  };
  elapsedPercent: number;
  progressColor: string;
  remainingMinutes: number;
  totalDurationMinutes: number;
  chipLabel: string | null;
  chipColor: "primary" | "warning" | "info" | "default";
}
