import React, { forwardRef, useMemo } from "react";
import dayjs, { type Dayjs } from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/fr";
import "dayjs/locale/en";
import { useTranslation } from "react-i18next";

import Chip from "../../atoms/Chip";
import type {
  CalendarSheetProps,
  CalendarSheetSize,
  RelativeStatusInfo,
  RelativeChipVariant,
} from "./CalendarSheet.types";
import {
  SheetCard,
  SheetHeader,
  MonthYearText,
  PerforationHoles,
  SheetBody,
  DayNumber,
  WeekdayName,
  ChipWrapper,
} from "./CalendarSheet.styles";

// Initialize Dayjs relativeTime plugin
dayjs.extend(relativeTime);

const CALENDAR_TERMS: Record<
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

const DEFAULT_CALENDAR_PROPS = {
  size: "medium" as const,
  orientation: "vertical" as const,
  showChip: true,
  showTime: false,
  showPerforations: true,
  headerColor: "primary" as const,
  chipVariant: "auto" as const,
};

export interface ComputeRelativeStatusOptions {
  referenceDate?: Date | string | number | Dayjs;
  locale?: string;
  variant?: RelativeChipVariant;
  showTime?: boolean;
  endDate?: Date | string | number | Dayjs;
}

function formatTimeSuffix(
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

function resolveCalendarLabel(
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

function resolveChipColor(
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

function buildAccessibleLabel(
  weekday: string,
  fullDate: string,
  chipText?: React.ReactNode,
): string {
  if (typeof chipText === "string" && chipText.length > 0) {
    return `${weekday}, ${fullDate}, ${chipText}`;
  }
  return `${weekday}, ${fullDate}`;
}

function resolveActiveLocale(
  locale?: string,
  i18n?: ReturnType<typeof useTranslation>["i18n"],
): string {
  if (locale) return locale.startsWith("fr") ? "fr" : "en";
  if (i18n?.resolvedLanguage?.startsWith("fr")) return "fr";
  if (i18n?.language?.startsWith("fr")) return "fr";
  return "en";
}

function resolveChipSize(size: CalendarSheetSize): "small" | "medium" {
  return size === "large" ? "medium" : "small";
}

function useCalendarSheetCalculations(
  date: CalendarSheetProps["date"],
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

export const CalendarSheet = forwardRef<HTMLDivElement, CalendarSheetProps>(
  function CalendarSheet(props, ref) {
    const config = { ...DEFAULT_CALENDAR_PROPS, ...props };
    const {
      date,
      endDate,
      referenceDate,
      locale,
      size,
      orientation,
      showChip,
      showTime,
      showPerforations,
      headerColor,
      chipLabel,
      chipVariant,
      className,
      style,
      onClick,
      ariaLabel,
    } = config;

    const { i18n } = useTranslation();
    const normLocale = resolveActiveLocale(locale, i18n);

    const relativeOptions = useMemo<ComputeRelativeStatusOptions>(
      () => ({
        referenceDate,
        locale: normLocale,
        variant: chipVariant,
        showTime,
        endDate,
      }),
      [referenceDate, normLocale, chipVariant, showTime, endDate],
    );

    const { targetDayjs, monthYear, dayNumber, weekday, relativeInfo } =
      useCalendarSheetCalculations(date, normLocale, relativeOptions);

    const displayChipLabel = chipLabel ?? relativeInfo.label;
    const defaultAria = useMemo(
      () =>
        buildAccessibleLabel(
          weekday,
          targetDayjs.format("MMMM D, YYYY"),
          showChip ? displayChipLabel : undefined,
        ),
      [weekday, targetDayjs, showChip, displayChipLabel],
    );

    const chipVariantStyle = relativeInfo.isToday ? "filled" : "outlined";
    const chipSize = resolveChipSize(size);

    return (
      <SheetCard
        ref={ref}
        $size={size}
        $orientation={orientation}
        $isInteractive={Boolean(onClick)}
        className={className}
        style={style}
        onClick={onClick}
        role="group"
        aria-label={ariaLabel || defaultAria}
        data-testid="calendar-sheet"
      >
        <SheetHeader $size={size} $headerColor={headerColor}>
          {showPerforations && <PerforationHoles $size={size} />}
          <MonthYearText $size={size} data-testid="calendar-sheet-month-year">
            {monthYear}
          </MonthYearText>
        </SheetHeader>

        <SheetBody $size={size} $orientation={orientation}>
          <DayNumber $size={size} data-testid="calendar-sheet-day">
            {dayNumber}
          </DayNumber>
          <WeekdayName $size={size} data-testid="calendar-sheet-weekday">
            {weekday}
          </WeekdayName>
        </SheetBody>

        {showChip && (
          <ChipWrapper
            $size={size}
            $orientation={orientation}
            data-testid="calendar-sheet-chip-wrapper"
          >
            <Chip
              size={chipSize}
              color={relativeInfo.statusColor}
              variant={chipVariantStyle}
              label={displayChipLabel}
              data-testid="calendar-sheet-chip"
            />
          </ChipWrapper>
        )}
      </SheetCard>
    );
  },
);

CalendarSheet.displayName = "CalendarSheet";

export default CalendarSheet;
