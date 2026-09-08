import React, {
  forwardRef,
  useMemo,
  useState,
  useRef,
  useEffect,
  useCallback,
} from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Progress } from "react-material-expressive";
import { useTheme, alpha } from "@mui/material/styles";
import dayjs, { type Dayjs } from "dayjs";

import Tooltip from "../../atoms/Tooltip";
import { ClockDialNeedles, ClockCenterHub } from "../../atoms/AnalogClock";
import type {
  ClockCardProps,
  ClockCardSize,
  TimeIntervalInfo,
  TimeChangePayload,
  HourFormat,
} from "./ClockCard.types";
import {
  computeTimeIntervalInfo,
  buildWavyArc,
  generateWavyArcPhases,
  generate12SidedCookiePath,
  type ComputeTimeIntervalOptions,
} from "./ClockCard.utils";
import {
  SheetCard,
  ClockMedallion,
  ClockSvg,
  ConnectedCard,
  DigitalIntervalRow,
  DigitalIntervalText,
  LiveBadge,
  DetailsChipsRow,
  DurationChip,
  ClockCardChip,
  ProgressContainer,
  SPRING_TRANSITION,
} from "./ClockCard.styles";
import {
  ClockCardEditablePickers,
  type ClockCardEditablePickersProps,
} from "./ClockCardEditablePickers";

const DEFAULT_TIME_PROPS = {
  size: "medium" as const,
  orientation: "horizontal" as const,
  color: "primary" as const,
  hourFormat: "auto" as const,
  editable: false,
  disabled: false,
};

function resolveActiveLocale(
  locale?: string,
  i18n?: ReturnType<typeof useTranslation>["i18n"],
): string {
  if (locale) return locale.startsWith("fr") ? "fr" : "en";
  if (i18n?.resolvedLanguage?.startsWith("fr")) return "fr";
  if (i18n?.language?.startsWith("fr")) return "fr";
  return "en";
}

function resolveChipVariant(isHappeningNow: boolean): "filled" | "outlined" {
  return isHappeningNow ? "filled" : "outlined";
}

function resolveChipSize(size: ClockCardSize): "small" | "medium" {
  return size === "large" ? "medium" : "small";
}

function resolveIs12Hour(
  hourFormat?: HourFormat,
  normLocale?: string,
): boolean {
  if (hourFormat === "12h") return true;
  if (hourFormat === "24h") return false;
  return !normLocale?.startsWith("fr");
}

function resolveActiveColor(
  isHappeningNow: boolean,
  progressColor: string,
  primaryColor: string,
): string {
  return isHappeningNow ? progressColor : primaryColor;
}

function resolveAccessibleLabel(
  ariaLabel?: string,
  digitalRange?: string,
  chipLabel?: string | null,
  editable?: boolean,
): string {
  if (ariaLabel) return ariaLabel;
  const prefix = editable ? "Editable time interval" : "Time interval";
  if (chipLabel) return `${prefix}: ${digitalRange}, ${chipLabel}`;
  return `${prefix}: ${digitalRange}`;
}

function useClockCardCalculations(
  startTime: ClockCardProps["startTime"],
  endTime: ClockCardProps["endTime"],
  options: ComputeTimeIntervalOptions,
) {
  const intervalInfo = useMemo(
    () => computeTimeIntervalInfo(startTime, endTime, options),
    [startTime, endTime, options],
  );

  const wavyArcPath = useMemo(
    () => buildWavyArc(intervalInfo.startHourAngle, intervalInfo.sweepAngle),
    [intervalInfo.startHourAngle, intervalInfo.sweepAngle],
  );

  const wavyArcPhases = useMemo(
    () =>
      generateWavyArcPhases(
        intervalInfo.startHourAngle,
        intervalInfo.sweepAngle,
      ),
    [intervalInfo.startHourAngle, intervalInfo.sweepAngle],
  );

  const cookiePath = useMemo(() => generate12SidedCookiePath(), []);

  return { intervalInfo, wavyArcPath, wavyArcPhases, cookiePath };
}

function useClockCardController(options: {
  startTime: ClockCardProps["startTime"];
  endTime: ClockCardProps["endTime"];
  editable?: boolean;
  disabled?: boolean;
  onStartTimeChange?: (newStartTime: Dayjs) => void;
  onEndTimeChange?: (newEndTime: Dayjs) => void;
  onTimeChange?: (times: TimeChangePayload) => void;
  onChange?: (times: TimeChangePayload) => void;
}) {
  const {
    startTime,
    endTime,
    editable,
    disabled,
    onStartTimeChange,
    onEndTimeChange,
    onTimeChange,
    onChange,
  } = options;

  const [currentStartTime, setCurrentStartTime] = useState<Dayjs>(() =>
    dayjs(startTime),
  );
  const [currentEndTime, setCurrentEndTime] = useState<Dayjs>(() =>
    dayjs(endTime),
  );

  const prevStartTimeRef = useRef(startTime);
  const prevEndTimeRef = useRef(endTime);

  useEffect(() => {
    const prevStart = dayjs(prevStartTimeRef.current);
    const nextStart = dayjs(startTime);
    prevStartTimeRef.current = startTime;
    if (
      nextStart.isValid() &&
      (!prevStart.isValid() || !prevStart.isSame(nextStart))
    ) {
      setCurrentStartTime(nextStart);
    }
  }, [startTime]);

  useEffect(() => {
    const prevEnd = dayjs(prevEndTimeRef.current);
    const nextEnd = dayjs(endTime);
    prevEndTimeRef.current = endTime;
    if (nextEnd.isValid() && (!prevEnd.isValid() || !prevEnd.isSame(nextEnd))) {
      setCurrentEndTime(nextEnd);
    }
  }, [endTime]);

  const handleStartTimeChange = useCallback(
    (newVal: Dayjs | null) => {
      if (!newVal || !newVal.isValid() || (editable && disabled)) return;
      setCurrentStartTime(newVal);
      onStartTimeChange?.(newVal);
      const payload: TimeChangePayload = {
        startTime: newVal,
        endTime: currentEndTime,
      };
      onTimeChange?.(payload);
      onChange?.(payload);
    },
    [
      editable,
      disabled,
      currentEndTime,
      onStartTimeChange,
      onTimeChange,
      onChange,
    ],
  );

  const handleEndTimeChange = useCallback(
    (newVal: Dayjs | null) => {
      if (!newVal || !newVal.isValid() || (editable && disabled)) return;
      setCurrentEndTime(newVal);
      onEndTimeChange?.(newVal);
      const payload: TimeChangePayload = {
        startTime: currentStartTime,
        endTime: newVal,
      };
      onTimeChange?.(payload);
      onChange?.(payload);
    },
    [
      editable,
      disabled,
      currentStartTime,
      onEndTimeChange,
      onTimeChange,
      onChange,
    ],
  );

  return {
    currentStartTime,
    currentEndTime,
    handleStartTimeChange,
    handleEndTimeChange,
  };
}

interface DetailsSectionContentProps {
  intervalInfo: TimeIntervalInfo;
  size: ClockCardSize;
  editable?: boolean;
  editablePickersProps: ClockCardEditablePickersProps;
}

function DetailsSectionContent({
  intervalInfo,
  size,
  editable,
  editablePickersProps,
}: DetailsSectionContentProps) {
  const chipSize = resolveChipSize(size);
  const chipVariant = resolveChipVariant(intervalInfo.isHappeningNow);
  const activeProgressColor = intervalInfo.isHappeningNow
    ? intervalInfo.progressColor
    : undefined;

  return (
    <>
      {editable ? (
        <ClockCardEditablePickers {...editablePickersProps} />
      ) : (
        <DigitalIntervalRow $isHappeningNow={intervalInfo.isHappeningNow}>
          <DigitalIntervalText
            $size={size}
            data-testid="time-sheet-digital-interval"
          >
            {intervalInfo.digitalRange}
          </DigitalIntervalText>
        </DigitalIntervalRow>
      )}

      <DetailsChipsRow>
        <DurationChip
          size={chipSize}
          variant="outlined"
          label={intervalInfo.durationFormatted}
          data-testid="time-sheet-duration-chip"
        />

        {intervalInfo.isToday && intervalInfo.chipLabel && (
          <ClockCardChip
            size={chipSize}
            color={intervalInfo.chipColor}
            variant={chipVariant}
            label={intervalInfo.chipLabel}
            $progressColor={activeProgressColor}
            data-testid="time-sheet-chip"
          />
        )}
      </DetailsChipsRow>

      {intervalInfo.isHappeningNow && (
        <ProgressContainer
          $progressColor={activeProgressColor}
          data-testid="time-sheet-wavy-progress"
        >
          <Progress wavy value={intervalInfo.elapsedPercent} thickness={4} />
        </ProgressContainer>
      )}
    </>
  );
}

export const ClockCard = forwardRef<HTMLDivElement, ClockCardProps>(
  function ClockCard(props, ref) {
    const config = { ...DEFAULT_TIME_PROPS, ...props };
    const {
      startTime,
      endTime,
      referenceTime,
      hourFormat,
      size,
      orientation,
      locale,
      className,
      style,
      onClick,
      ariaLabel,
      editable,
      disabled,
      onStartTimeChange,
      onEndTimeChange,
      onTimeChange,
      onChange,
      timePickerProps,
    } = config;

    const theme = useTheme();
    const { i18n } = useTranslation();
    const normLocale = resolveActiveLocale(locale, i18n);
    const isFr = normLocale === "fr";
    const is12Hour = resolveIs12Hour(hourFormat, normLocale);

    const controller = useClockCardController({
      startTime,
      endTime,
      editable,
      disabled,
      onStartTimeChange,
      onEndTimeChange,
      onTimeChange,
      onChange,
    });

    const calculationOptions = useMemo<ComputeTimeIntervalOptions>(
      () => ({
        referenceTime,
        locale: normLocale,
        hourFormat,
      }),
      [referenceTime, normLocale, hourFormat],
    );

    const { intervalInfo, wavyArcPath, wavyArcPhases, cookiePath } =
      useClockCardCalculations(
        controller.currentStartTime,
        controller.currentEndTime,
        calculationOptions,
      );

    const [internalHovered, setInternalHovered] = useState(false);
    const isHovered = config.isHovered ?? internalHovered;

    const primaryColor = theme.palette.primary.main;
    const activeColor = resolveActiveColor(
      intervalInfo.isHappeningNow,
      intervalInfo.progressColor,
      primaryColor,
    );
    const liveTooltip = isFr ? "En direct" : "Live";

    const accessibleLabel = resolveAccessibleLabel(
      ariaLabel,
      intervalInfo.digitalRange,
      intervalInfo.chipLabel,
      editable,
    );

    const editablePickersProps: ClockCardEditablePickersProps = {
      size,
      isHappeningNow: intervalInfo.isHappeningNow,
      disabled,
      currentStartTime: controller.currentStartTime,
      currentEndTime: controller.currentEndTime,
      onStartTimeChange: controller.handleStartTimeChange,
      onEndTimeChange: controller.handleEndTimeChange,
      isFr,
      is12Hour,
      normLocale,
      timePickerProps,
    };

    return (
      <SheetCard
        ref={ref}
        $size={size}
        $orientation={orientation}
        $isInteractive={Boolean(onClick)}
        className={className}
        style={style}
        onClick={onClick}
        onMouseEnter={() => setInternalHovered(true)}
        onMouseLeave={() => setInternalHovered(false)}
        onFocusCapture={() => setInternalHovered(true)}
        onBlurCapture={() => setInternalHovered(false)}
        role="group"
        aria-label={accessibleLabel}
        data-testid="time-sheet"
      >
        {/* Clock Medallion 'O' (Floating on top, outside/overlapping the card) */}
        <ClockMedallion $size={size} data-testid="time-sheet-clock-medallion">
          <ClockSvg
            $size={size}
            viewBox="0 0 100 100"
            data-testid="time-sheet-clock"
          >
            {/* Opaque Base Cookie Face (masks the connected card underneath) */}
            <path d={cookiePath} fill={theme.palette.background.paper} />

            {/* 12-sided Scalloped Cookie Clock Face (Material You) */}
            <path
              d={cookiePath}
              fill={alpha(activeColor, 0.08)}
              stroke={alpha(activeColor, 0.22)}
              strokeWidth="1.2"
              data-testid="time-sheet-cookie-dial"
            />

            {/* Tightly Scallop-Mirroring Squiggly Circular Progress Line with MD3 Animation */}
            {wavyArcPath && (
              <motion.path
                d={wavyArcPath}
                fill="none"
                stroke={activeColor}
                strokeWidth={isHovered ? 3.4 : 2.8}
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={SPRING_TRANSITION}
                data-testid="time-sheet-wavy-arc"
              >
                {wavyArcPhases && isHovered && (
                  <animate
                    attributeName="d"
                    dur="2.4s"
                    repeatCount="indefinite"
                    values={wavyArcPhases}
                  />
                )}
              </motion.path>
            )}

            <ClockDialNeedles
              startHourAngle={intervalInfo.startHourAngle}
              startMinuteAngle={intervalInfo.startMinuteAngle}
              targetEndHourAngle={intervalInfo.targetEndHourAngle}
              targetEndMinuteAngle={intervalInfo.targetEndMinuteAngle}
              endDot={intervalInfo.endDot}
              activeColor={activeColor}
              isHovered={isHovered}
              hourTestId="time-sheet-hour-needle"
              minuteTestId="time-sheet-minute-needle"
              endDotTestId="time-sheet-end-dot"
            />

            {/* Center Pivot Hub (matching Material You widget) */}
            <ClockCenterHub
              color={activeColor}
              innerColor={theme.palette.background.paper}
            />
          </ClockSvg>
        </ClockMedallion>

        {/* Card Connected From Underneath '=]' */}
        <ConnectedCard
          $size={size}
          $orientation={orientation}
          $isEditable={editable}
          data-testid="time-sheet-connected-card"
        >
          {intervalInfo.isHappeningNow && (
            <Tooltip title={liveTooltip} arrow>
              <LiveBadge
                role="status"
                aria-label={liveTooltip}
                $size={size}
                data-testid="time-sheet-live-badge"
              />
            </Tooltip>
          )}

          <DetailsSectionContent
            intervalInfo={intervalInfo}
            size={size}
            editable={editable}
            editablePickersProps={editablePickersProps}
          />
        </ConnectedCard>
      </SheetCard>
    );
  },
);

ClockCard.displayName = "ClockCard";

export {
  computeNeedleAngle,
  computeHourNeedleAngle,
  computeMinuteNeedleAngle,
  computeClockwiseTargetAngle,
  computeEndDotCoordinates,
  HOUR_NEEDLE_LENGTH,
  formatDigitalInterval,
  formatDigitalDuration,
  computeTimeIntervalInfo,
  buildWavyArc,
  generateWavyArcPhases,
  generate12SidedCookiePath,
  interpolateProgressColor,
  getContrastTextColor,
  PROGRESS_COLOR_STOPS,
  type ComputeTimeIntervalOptions,
  type ProgressColorStop,
} from "./ClockCard.utils";

export default ClockCard;
