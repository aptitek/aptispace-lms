import type { ReactNode, CSSProperties } from "react";
import type { Dayjs } from "dayjs";

export type CalendarCardSize = "small" | "medium" | "large";
export type CalendarCardOrientation = "vertical" | "horizontal";
export type CalendarCardHeaderColor =
  "primary" | "secondary" | "error" | "default";
export type RelativeChipVariant = "auto" | "relative" | "days";

export interface CalendarCardProps {
  /**
   * The target event date or start time.
   */
  date: Date | string | number | Dayjs;

  /**
   * Optional end date/time of the event.
   */
  endDate?: Date | string | number | Dayjs;

  /**
   * Reference anchor date for computing relative time. Defaults to now.
   */
  referenceDate?: Date | string | number | Dayjs;

  /**
   * Override language locale (e.g. 'en', 'fr'). Defaults to current i18next language.
   */
  locale?: string;

  /**
   * Size variant of the calendar card.
   * @default "medium"
   */
  size?: CalendarCardSize;

  /**
   * Visual layout orientation.
   * @default "vertical"
   */
  orientation?: CalendarCardOrientation;

  /**
   * Whether to display the relative time chip.
   * @default true
   */
  showChip?: boolean;

  /**
   * Whether to include the formatted time string (e.g., in the chip or body).
   * @default false
   */
  showTime?: boolean;

  /**
   * Whether to render binder punch holes / perforation styling at the top edge.
   * @default true
   */
  showPerforations?: boolean;

  /**
   * Color theme of the top header binder.
   * @default "primary"
   */
  headerColor?: CalendarCardHeaderColor;

  /**
   * Explicit override for the chip text.
   */
  chipLabel?: ReactNode;

  /**
   * How the relative chip computes its label.
   * - "auto": Intelligent day/time formatting ("Today", "Tomorrow", "in 3 days", "3 days ago")
   * - "relative": Standard relative format ("in 2 hours", "3 days ago")
   * - "days": Day count format ("Today", "in 3 days", "3 days ago")
   * @default "auto"
   */
  chipVariant?: RelativeChipVariant;

  /**
   * Optional CSS class name.
   */
  className?: string;

  /**
   * Optional inline styles.
   */
  style?: CSSProperties;

  /**
   * Whether the calendar card is editable via date picker on click.
   * @default false
   */
  editable?: boolean;

  /**
   * Callback fired when a new date is selected via the date picker.
   */
  onDateChange?: (newDate: Dayjs) => void;

  /**
   * Alias for onDateChange for standard form / input compatibility.
   */
  onChange?: (newDate: Dayjs) => void;

  /**
   * Whether the calendar card interaction is disabled.
   * @default false
   */
  disabled?: boolean;

  /**
   * Optional minimum selectable date for the date picker.
   */
  minDate?: Date | string | number | Dayjs;

  /**
   * Optional maximum selectable date for the date picker.
   */
  maxDate?: Date | string | number | Dayjs;

  /**
   * Click handler if the calendar card is interactive.
   */
  onClick?: () => void;

  /**
   * Accessible ARIA label for screen readers.
   */
  ariaLabel?: string;
}

export interface RelativeStatusInfo {
  diffDays: number;
  isToday: boolean;
  isTomorrow: boolean;
  isYesterday: boolean;
  isFuture: boolean;
  isPast: boolean;
  label: string;
  statusColor: "primary" | "info" | "warning" | "default" | "success";
}
