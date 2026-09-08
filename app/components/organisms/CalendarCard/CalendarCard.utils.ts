import { useMemo, type ReactNode } from "react";
import dayjs, { type Dayjs } from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/fr";
import { alpha, type Theme } from "@mui/material/styles";
import type { useTranslation } from "react-i18next";
import { M3_SHAPE_CORNER_STRINGS } from "~/tokens/shapes";
import { M3_SPACINGS } from "~/tokens/spacing";

import type {
  CalendarCardProps,
  CalendarCardSize,
  CalendarCardHeaderColor,
  RelativeStatusInfo,
  RelativeChipVariant,
} from "./CalendarCard.types";

dayjs.extend(relativeTime);

export const CALENDAR_TERMS: Record<
  string,
  { today: string; tomorrow: string; yesterday: string }
> = {
  en: {
    today: "Today",
    tomorrow: "Tomorrow",
    yesterday: "Yesterday",
  },
  fr: {
    today: "Aujourd'hui",
    tomorrow: "Demain",
    yesterday: "Hier",
  },
};

export const DEFAULT_CALENDAR_PROPS = {
  size: "medium" as const,
  orientation: "vertical" as const,
  showChip: true,
  showTime: false,
  showPerforations: true,
  headerColor: "primary" as const,
  chipVariant: "auto" as const,
  editable: false,
  disabled: false,
};

export interface ComputeRelativeStatusOptions {
  referenceDate?: Date | string | number | Dayjs;
  locale?: string;
  variant?: RelativeChipVariant;
  showTime?: boolean;
  endDate?: Date | string | number | Dayjs;
}

export function formatTimeSuffix(
  targetD: Dayjs,
  normLocale: string,
  showTime?: boolean,
  endDate?: Date | string | number | Dayjs,
): string {
  if (!showTime) return "";
  const startStr = targetD.locale(normLocale).format("HH:mm");
  if (!endDate) return ` • ${startStr}`;
  const endStr = dayjs(endDate).locale(normLocale).format("HH:mm");
  return ` • ${startStr} - ${endStr}`;
}

export function resolveCalendarLabel(
  targetDay: Dayjs,
  refDay: Dayjs,
  normLocale: string,
  variant: RelativeChipVariant = "auto",
): string {
  const diffDays = targetDay.diff(refDay, "day");
  const terms = CALENDAR_TERMS[normLocale] || CALENDAR_TERMS.en;

  if (diffDays === 0) return terms.today;
  if (variant !== "days") {
    if (diffDays === 1) return terms.tomorrow;
    if (diffDays === -1) return terms.yesterday;
  }

  return targetDay.locale(normLocale).from(refDay);
}

export function resolveChipColor(
  isToday: boolean,
  isFuture: boolean,
): "primary" | "info" | "default" {
  if (isToday) return "primary";
  if (isFuture) return "info";
  return "default";
}

export function computeRelativeStatus(
  targetDate: Date | string | number | Dayjs,
  options: ComputeRelativeStatusOptions = {},
): RelativeStatusInfo {
  const {
    referenceDate,
    locale = "en",
    variant = "auto",
    showTime = false,
    endDate,
  } = options;

  const normLocale = locale.startsWith("fr") ? "fr" : "en";
  const targetD = dayjs(targetDate);
  const refD = referenceDate ? dayjs(referenceDate) : dayjs();

  const targetDay = targetD.startOf("day");
  const refDay = refD.startOf("day");
  const diffDays = targetDay.diff(refDay, "day");

  const isToday = diffDays === 0;
  const isTomorrow = diffDays === 1;
  const isYesterday = diffDays === -1;
  const isFuture = diffDays > 0;
  const isPast = diffDays < 0;

  const timeSuffix = formatTimeSuffix(targetD, normLocale, showTime, endDate);
  const statusColor = resolveChipColor(isToday, isFuture);

  const baseLabel =
    variant === "relative"
      ? targetD.locale(normLocale).from(refD)
      : resolveCalendarLabel(targetDay, refDay, normLocale, variant);

  const label =
    variant === "relative" ? baseLabel : `${baseLabel}${timeSuffix}`;

  return {
    diffDays,
    isToday,
    isTomorrow,
    isYesterday,
    isFuture,
    isPast,
    label,
    statusColor,
  };
}

export function buildAccessibleLabel(
  weekday: string,
  fullDate: string,
  chipText?: ReactNode,
): string {
  if (typeof chipText === "string" && chipText.length > 0) {
    return `${weekday}, ${fullDate}, ${chipText}`;
  }
  return `${weekday}, ${fullDate}`;
}

export function resolveActiveLocale(
  locale?: string,
  i18n?: ReturnType<typeof useTranslation>["i18n"],
): string {
  if (locale) return locale.startsWith("fr") ? "fr" : "en";
  if (i18n?.resolvedLanguage?.startsWith("fr")) return "fr";
  if (i18n?.language?.startsWith("fr")) return "fr";
  return "en";
}

export function resolveChipSize(size: CalendarCardSize): "small" | "medium" {
  return size === "large" ? "medium" : "small";
}

export function useCalendarCardCalculations(
  date: CalendarCardProps["date"],
  normLocale: string,
  options: ComputeRelativeStatusOptions,
) {
  const targetDayjs = useMemo(
    () => dayjs(date).locale(normLocale),
    [date, normLocale],
  );

  const monthYear = useMemo(
    () => targetDayjs.format("MMMM YYYY"),
    [targetDayjs],
  );

  const dayNumber = useMemo(() => targetDayjs.format("D"), [targetDayjs]);
  const weekday = useMemo(() => targetDayjs.format("dddd"), [targetDayjs]);

  const relativeInfo = useMemo(
    () => computeRelativeStatus(date, options),
    [date, options],
  );

  return { targetDayjs, monthYear, dayNumber, weekday, relativeInfo };
}

export interface CardDisplayOptions {
  propsHeaderColor?: CalendarCardHeaderColor;
  defaultHeaderColor?: CalendarCardHeaderColor;
  isPast?: boolean;
  isToday?: boolean;
  size?: CalendarCardSize;
  chipLabel?: ReactNode;
  relativeLabel?: string;
}

export function resolveCardDisplayConfig(options: CardDisplayOptions) {
  const {
    propsHeaderColor,
    defaultHeaderColor = "primary",
    isPast,
    isToday,
    size = "medium",
    chipLabel,
    relativeLabel,
  } = options;

  const effectiveHeaderColor =
    propsHeaderColor ?? (isPast ? "default" : defaultHeaderColor);
  const displayChipLabel = chipLabel ?? relativeLabel;
  const chipVariantStyle = isToday
    ? ("filled" as const)
    : ("outlined" as const);
  const chipSize = resolveChipSize(size);

  return { effectiveHeaderColor, displayChipLabel, chipVariantStyle, chipSize };
}

export function resolveCardAccessibility(
  isInteractive: boolean,
  isEditableAndActive: boolean,
  pickerOpen: boolean,
) {
  return {
    role: isInteractive ? ("button" as const) : ("group" as const),
    tabIndex: isInteractive ? 0 : undefined,
    ariaHasPopup: isEditableAndActive ? ("dialog" as const) : undefined,
    ariaExpanded: isEditableAndActive ? pickerOpen : undefined,
  };
}

export const FAB_SIZE_CONFIG = {
  small: {
    size: 26,
    iconSize: "0.875rem",
    borderRadius: M3_SHAPE_CORNER_STRINGS.small,
    bottom: M3_SPACINGS.micro,
    right: M3_SPACINGS.micro,
  },
  medium: {
    size: 34,
    iconSize: "1.125rem",
    borderRadius: M3_SHAPE_CORNER_STRINGS.medium,
    bottom: M3_SPACINGS.compact,
    right: M3_SPACINGS.compact,
  },
  large: {
    size: 42,
    iconSize: "1.375rem",
    borderRadius: M3_SHAPE_CORNER_STRINGS.large,
    bottom: M3_SPACINGS.compact,
    right: M3_SPACINGS.compact,
  },
};

export function resolveFabColors(
  theme: Theme,
  headerColor: CalendarCardHeaderColor,
) {
  const colorMap = {
    primary: theme.palette.primary,
    secondary: theme.palette.secondary,
    error: theme.palette.error,
  };
  const targetPalette =
    headerColor === "default"
      ? theme.palette.primary
      : colorMap[headerColor] || theme.palette.primary;

  return {
    bg: targetPalette.main,
    color: targetPalette.contrastText || theme.palette.common.white,
    hoverBg: targetPalette.dark || targetPalette.main,
    shadowColor: alpha(targetPalette.main, 0.45),
  };
}
