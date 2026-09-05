import type { CSSProperties } from "react";
import type { Dayjs } from "dayjs";

export type TimeSheetSize = "small" | "medium" | "large";
export type TimeSheetOrientation = "vertical" | "horizontal";
export type TimeSheetColor = "primary" | "secondary" | "error" | "default";
export type HourFormat = "12h" | "24h" | "auto";

export interface TimeSheetProps {
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
  size?: TimeSheetSize;

  /**
   * Card orientation.
   * @default "vertical"
   */
  orientation?: TimeSheetOrientation;

  /**
   * Language locale (e.g. 'en', 'fr').
   */
  locale?: string;

  /**
   * Color theme.
   * @default "primary"
   */
  color?: TimeSheetColor;

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
}

export interface TimeIntervalInfo {
  isToday: boolean;
  isHappeningNow: boolean;
  isUpcomingToday: boolean;
  isPastToday: boolean;
  digitalRange: string;
  startHourAngle: number;
  endHourAngle: number;
  sweepAngle: number;
  elapsedPercent: number;
  progressColor: string;
  remainingMinutes: number;
  totalDurationMinutes: number;
  chipLabel: string | null;
  chipColor: "primary" | "warning" | "info" | "default";
}
