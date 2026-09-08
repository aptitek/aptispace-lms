import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import dayjs, { type Dayjs } from "dayjs";
import { useTranslation } from "react-i18next";
import { AnimatePresence, useReducedMotion } from "framer-motion";
import Tooltip from "@mui/material/Tooltip";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import EditCalendarRoundedIcon from "@mui/icons-material/EditCalendarRounded";

import Chip from "../../atoms/Chip";
import type {
  CalendarCardProps,
  CalendarCardSize,
  CalendarCardOrientation,
  CalendarCardHeaderColor,
  RelativeStatusInfo,
} from "./CalendarCard.types";
import {
  SheetCard,
  SheetHeader,
  MonthYearText,
  PerforationHoles,
  SheetBody,
  DayNumber,
  WeekdayName,
  ChipWrapper,
  SheetMotionContainer,
  CalendarCardFab,
  SHEET_TEAR_VARIANTS,
} from "./CalendarCard.styles";
import {
  DEFAULT_CALENDAR_PROPS,
  type ComputeRelativeStatusOptions,
  computeRelativeStatus,
  buildAccessibleLabel,
  resolveActiveLocale,
  resolveCardDisplayConfig,
  resolveCardAccessibility,
  useCalendarCardCalculations,
} from "./CalendarCard.utils";

export { computeRelativeStatus };

interface ControllerOptions {
  date: CalendarCardProps["date"];
  editable?: boolean;
  disabled?: boolean;
  onDateChange?: (newDate: Dayjs) => void;
  onChange?: (newDate: Dayjs) => void;
  onClick?: () => void;
}

function useCalendarCardController({
  date,
  editable,
  disabled,
  onDateChange,
  onChange,
  onClick,
}: ControllerOptions) {
  const [currentDate, setCurrentDate] = useState<Dayjs>(() => dayjs(date));
  const [pickerOpen, setPickerOpen] = useState(false);
  const prevPropDateRef = useRef(date);

  useEffect(() => {
    const prevDayjs = dayjs(prevPropDateRef.current);
    const nextDayjs = dayjs(date);
    prevPropDateRef.current = date;

    if (
      nextDayjs.isValid() &&
      (!prevDayjs.isValid() || !prevDayjs.isSame(nextDayjs, "day"))
    ) {
      setCurrentDate(nextDayjs);
    }
  }, [date]);

  const handleDateSelect = useCallback(
    (newVal: Dayjs | null) => {
      if (!newVal || !newVal.isValid()) return;
      setPickerOpen(false);
      if (!currentDate.isSame(newVal, "day")) {
        setCurrentDate(newVal);
        onDateChange?.(newVal);
        onChange?.(newVal);
      }
    },
    [currentDate, onDateChange, onChange],
  );

  const isInteractive = Boolean(onClick || (editable && !disabled));

  const handleCardClick = () => {
    onClick?.();
    if (editable && !disabled) {
      setPickerOpen((prev) => !prev);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (editable && !disabled && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      setPickerOpen((prev) => !prev);
    }
  };

  return {
    currentDate,
    pickerOpen,
    isInteractive,
    handleCardClick,
    handleKeyDown,
    handleDateSelect,
    setPickerOpen,
  };
}

interface CalendarCardSheetContentProps {
  size: CalendarCardSize;
  orientation: CalendarCardOrientation;
  effectiveHeaderColor: CalendarCardHeaderColor;
  monthYear: string;
  dayNumber: string;
  weekday: string;
  showChip?: boolean;
  chipSize: "small" | "medium";
  relativeInfo: RelativeStatusInfo;
  chipVariantStyle: "filled" | "outlined";
  displayChipLabel: React.ReactNode;
  isEditableAndActive: boolean;
}

function CalendarCardSheetContent({
  size,
  orientation,
  effectiveHeaderColor,
  monthYear,
  dayNumber,
  weekday,
  showChip,
  chipSize,
  relativeInfo,
  chipVariantStyle,
  displayChipLabel,
  isEditableAndActive,
}: CalendarCardSheetContentProps) {
  return (
    <>
      <SheetHeader $size={size} $headerColor={effectiveHeaderColor}>
        <MonthYearText $size={size} data-testid="calendar-card-month-year">
          {monthYear}
        </MonthYearText>
      </SheetHeader>

      <SheetBody $size={size} $orientation={orientation}>
        <DayNumber $size={size} data-testid="calendar-card-day">
          {dayNumber}
        </DayNumber>
        <WeekdayName $size={size} data-testid="calendar-card-weekday">
          {weekday}
        </WeekdayName>
      </SheetBody>

      {showChip && (
        <ChipWrapper
          $size={size}
          $orientation={orientation}
          $isEditable={isEditableAndActive}
          data-testid="calendar-card-chip-wrapper"
        >
          <Chip
            size={chipSize}
            color={relativeInfo.statusColor}
            variant={chipVariantStyle}
            label={displayChipLabel}
            data-testid="calendar-card-chip"
          />
        </ChipWrapper>
      )}
    </>
  );
}

interface CalendarCardPickerProps {
  currentDate: Dayjs;
  normLocale: string;
  pickerOpen: boolean;
  disabled?: boolean;
  minDate?: Date | string | number | Dayjs;
  maxDate?: Date | string | number | Dayjs;
  anchorEl: HTMLDivElement | null;
  onDateSelect: (newVal: Dayjs | null) => void;
  onOpen: () => void;
  onClose: () => void;
}

function CalendarCardPicker({
  currentDate,
  normLocale,
  pickerOpen,
  disabled,
  minDate,
  maxDate,
  anchorEl,
  onDateSelect,
  onOpen,
  onClose,
}: CalendarCardPickerProps) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={normLocale}>
      <DatePicker
        value={currentDate}
        onChange={onDateSelect}
        open={pickerOpen}
        onOpen={onOpen}
        onClose={onClose}
        disabled={disabled}
        minDate={minDate ? dayjs(minDate) : undefined}
        maxDate={maxDate ? dayjs(maxDate) : undefined}
        slotProps={{
          popper: {
            anchorEl,
            placement: "bottom-start",
          },
          textField: {
            sx: {
              position: "absolute",
              bottom: 0,
              left: 0,
              width: 0,
              height: 0,
              opacity: 0,
              padding: 0,
              margin: 0,
              border: "none",
              pointerEvents: "none",
              visibility: "hidden",
            },
            slotProps: {
              htmlInput: {
                "aria-hidden": true,
                tabIndex: -1,
              },
            },
          },
        }}
      />
    </LocalizationProvider>
  );
}

export const CalendarCard = forwardRef<HTMLDivElement, CalendarCardProps>(
  function CalendarCard(props, ref) {
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
      editable,
      disabled,
      minDate,
      maxDate,
      onDateChange,
      onChange,
      onClick,
      ariaLabel,
    } = config;

    const innerRef = useRef<HTMLDivElement>(null);
    useImperativeHandle(ref, () => innerRef.current as HTMLDivElement);

    const controller = useCalendarCardController({
      date,
      editable,
      disabled,
      onDateChange,
      onChange,
      onClick,
    });

    const shouldReduceMotion = Boolean(useReducedMotion());
    const { t, i18n } = useTranslation();
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
      useCalendarCardCalculations(
        controller.currentDate,
        normLocale,
        relativeOptions,
      );

    const display = resolveCardDisplayConfig({
      propsHeaderColor: props.headerColor,
      defaultHeaderColor: headerColor,
      isPast: relativeInfo.isPast,
      isToday: relativeInfo.isToday,
      size,
      chipLabel,
      relativeLabel: relativeInfo.label,
    });

    const defaultAria = useMemo(
      () =>
        buildAccessibleLabel(
          weekday,
          targetDayjs.format("MMMM D, YYYY"),
          showChip ? display.displayChipLabel : undefined,
        ),
      [weekday, targetDayjs, showChip, display.displayChipLabel],
    );

    const sheetKey = targetDayjs.format("YYYY-MM-DD");
    const isEditableAndActive = Boolean(editable && !disabled);
    const a11y = resolveCardAccessibility(
      controller.isInteractive,
      isEditableAndActive,
      controller.pickerOpen,
    );

    return (
      <SheetCard
        ref={innerRef}
        $size={size}
        $orientation={orientation}
        $isInteractive={controller.isInteractive}
        $disabled={disabled}
        className={className}
        style={style}
        onClick={controller.handleCardClick}
        onKeyDown={controller.handleKeyDown}
        role={a11y.role}
        tabIndex={a11y.tabIndex}
        aria-label={ariaLabel || defaultAria}
        aria-haspopup={a11y.ariaHasPopup}
        aria-expanded={a11y.ariaExpanded}
        data-testid="calendar-card"
        data-editable={editable ? "true" : undefined}
      >
        {showPerforations && <PerforationHoles $size={size} />}

        <AnimatePresence mode="popLayout" initial={false}>
          <SheetMotionContainer
            key={sheetKey}
            $size={size}
            $orientation={orientation}
            custom={shouldReduceMotion}
            variants={SHEET_TEAR_VARIANTS}
            initial="initial"
            animate="animate"
            exit="exit"
            data-testid="calendar-card-sheet"
          >
            <CalendarCardSheetContent
              size={size}
              orientation={orientation}
              effectiveHeaderColor={display.effectiveHeaderColor}
              monthYear={monthYear}
              dayNumber={dayNumber}
              weekday={weekday}
              showChip={showChip}
              chipSize={display.chipSize}
              relativeInfo={relativeInfo}
              chipVariantStyle={display.chipVariantStyle}
              displayChipLabel={display.displayChipLabel}
              isEditableAndActive={isEditableAndActive}
            />
          </SheetMotionContainer>
        </AnimatePresence>

        {isEditableAndActive && (
          <Tooltip
            title={t("common.editDate", "Edit date")}
            arrow
            placement="top"
          >
            <CalendarCardFab
              $size={size}
              $headerColor={display.effectiveHeaderColor}
              $disabled={disabled}
              className="calendar-card-fab"
              data-testid="calendar-card-fab"
              aria-label={t("common.editDate", "Edit date")}
              onClick={(e) => {
                e.stopPropagation();
                controller.handleCardClick();
              }}
            >
              <EditCalendarRoundedIcon />
            </CalendarCardFab>
          </Tooltip>
        )}

        {isEditableAndActive && (
          <CalendarCardPicker
            currentDate={controller.currentDate}
            normLocale={normLocale}
            pickerOpen={controller.pickerOpen}
            disabled={disabled}
            minDate={minDate}
            maxDate={maxDate}
            anchorEl={innerRef.current}
            onDateSelect={controller.handleDateSelect}
            onOpen={() => controller.setPickerOpen(true)}
            onClose={() => controller.setPickerOpen(false)}
          />
        )}
      </SheetCard>
    );
  },
);

CalendarCard.displayName = "CalendarCard";

export default CalendarCard;
