import React, { forwardRef, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Progress } from "react-material-expressive";
import { useTheme, alpha } from "@mui/material/styles";

import Tooltip from "../../atoms/Tooltip";
import type {
  TimeSheetProps,
  TimeSheetSize,
  TimeIntervalInfo,
} from "./TimeSheet.types";
import {
  computeTimeIntervalInfo,
  buildWavyArc,
  generateWavyArcPhases,
  generate12SidedCookiePath,
  type ComputeTimeIntervalOptions,
} from "./TimeSheet.utils";
import {
  SheetCard,
  ClockMedallion,
  ClockSvg,
  MotionHandGroup,
  ConnectedCard,
  DigitalIntervalRow,
  DigitalIntervalText,
  LiveBadge,
  DetailsChipsRow,
  DurationChip,
  TimeSheetChip,
  ProgressContainer,
  SPRING_TRANSITION,
  HOUR_SPRING_TRANSITION,
  MINUTE_SPRING_TRANSITION,
  DOT_SPRING_TRANSITION,
} from "./TimeSheet.styles";

const DEFAULT_TIME_PROPS = {
  size: "medium" as const,
  orientation: "horizontal" as const,
  color: "primary" as const,
  hourFormat: "auto" as const,
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

function resolveChipSize(size: TimeSheetSize): "small" | "medium" {
  return size === "large" ? "medium" : "small";
}

function resolveAccessibleLabel(
  ariaLabel?: string,
  digitalRange?: string,
  chipLabel?: string | null,
): string {
  if (ariaLabel) return ariaLabel;
  if (chipLabel) return `Time interval: ${digitalRange}, ${chipLabel}`;
  return `Time interval: ${digitalRange}`;
}

function useTimeSheetCalculations(
  startTime: TimeSheetProps["startTime"],
  endTime: TimeSheetProps["endTime"],
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

interface DetailsSectionContentProps {
  intervalInfo: TimeIntervalInfo;
  size: TimeSheetSize;
}

function DetailsSectionContent({
  intervalInfo,
  size,
}: DetailsSectionContentProps) {
  const chipSize = resolveChipSize(size);
  const chipVariant = resolveChipVariant(intervalInfo.isHappeningNow);
  const activeProgressColor = intervalInfo.isHappeningNow
    ? intervalInfo.progressColor
    : undefined;

  return (
    <>
      <DigitalIntervalRow $isHappeningNow={intervalInfo.isHappeningNow}>
        <DigitalIntervalText
          $size={size}
          data-testid="time-sheet-digital-interval"
        >
          {intervalInfo.digitalRange}
        </DigitalIntervalText>
      </DigitalIntervalRow>

      <DetailsChipsRow>
        <DurationChip
          size={chipSize}
          variant="outlined"
          label={intervalInfo.durationFormatted}
          data-testid="time-sheet-duration-chip"
        />

        {intervalInfo.isToday && intervalInfo.chipLabel && (
          <TimeSheetChip
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

interface ClockDialNeedlesProps {
  intervalInfo: TimeIntervalInfo;
  activeColor: string;
  isHovered: boolean;
}

function ClockDialNeedles({
  intervalInfo,
  activeColor,
  isHovered,
}: ClockDialNeedlesProps) {
  const ghostColor = alpha(activeColor, 0.38);

  return (
    <>
      {/* End Time Dot: Ghostly accent dot at the same distance from center as the hour needle */}
      <motion.circle
        cx={intervalInfo.endDot.x}
        cy={intervalInfo.endDot.y}
        r={3.2}
        fill={ghostColor}
        animate={{
          scale: isHovered ? 1.2 : 1,
          opacity: isHovered ? 0.6 : 1,
        }}
        transition={DOT_SPRING_TRANSITION}
        data-testid="time-sheet-end-dot"
      />

      {/* Start Hour Needle: Shorter & sturdier, springs to end hour on hover */}
      <MotionHandGroup
        initial={{
          rotate: isHovered
            ? intervalInfo.targetEndHourAngle
            : intervalInfo.startHourAngle,
        }}
        animate={{
          rotate: isHovered
            ? intervalInfo.targetEndHourAngle
            : intervalInfo.startHourAngle,
        }}
        transition={HOUR_SPRING_TRANSITION}
        data-testid="time-sheet-hour-needle"
      >
        <line
          x1="50"
          y1="50"
          x2="50"
          y2="26"
          stroke={activeColor}
          strokeWidth="4.8"
          strokeLinecap="round"
        />
      </MotionHandGroup>

      {/* Start Minute Needle: Longer & sleeker, springs to end minute on hover */}
      <MotionHandGroup
        initial={{
          rotate: isHovered
            ? intervalInfo.targetEndMinuteAngle
            : intervalInfo.startMinuteAngle,
        }}
        animate={{
          rotate: isHovered
            ? intervalInfo.targetEndMinuteAngle
            : intervalInfo.startMinuteAngle,
        }}
        transition={MINUTE_SPRING_TRANSITION}
        data-testid="time-sheet-minute-needle"
      >
        <line
          x1="50"
          y1="50"
          x2="50"
          y2="16"
          stroke={activeColor}
          strokeWidth="3.2"
          strokeLinecap="round"
        />
      </MotionHandGroup>
    </>
  );
}

export const TimeSheet = forwardRef<HTMLDivElement, TimeSheetProps>(
  function TimeSheet(props, ref) {
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
    } = config;

    const theme = useTheme();
    const { i18n } = useTranslation();
    const normLocale = resolveActiveLocale(locale, i18n);
    const isFr = normLocale === "fr";

    const calculationOptions = useMemo<ComputeTimeIntervalOptions>(
      () => ({
        referenceTime,
        locale: normLocale,
        hourFormat,
      }),
      [referenceTime, normLocale, hourFormat],
    );

    const { intervalInfo, wavyArcPath, wavyArcPhases, cookiePath } =
      useTimeSheetCalculations(startTime, endTime, calculationOptions);

    const [internalHovered, setInternalHovered] = useState(false);
    const isHovered = config.isHovered ?? internalHovered;

    const primaryColor = theme.palette.primary.main;
    const activeColor = intervalInfo.isHappeningNow
      ? intervalInfo.progressColor
      : primaryColor;
    const liveTooltip = isFr ? "En direct" : "Live";

    const accessibleLabel = resolveAccessibleLabel(
      ariaLabel,
      intervalInfo.digitalRange,
      intervalInfo.chipLabel,
    );

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
                {wavyArcPhases && (
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
              intervalInfo={intervalInfo}
              activeColor={activeColor}
              isHovered={isHovered}
            />

            {/* Center Pivot Hub (matching Material You widget) */}
            <circle cx="50" cy="50" r="4.2" fill={activeColor} />
            <circle
              cx="50"
              cy="50"
              r="1.8"
              fill={theme.palette.background.paper}
            />
          </ClockSvg>
        </ClockMedallion>

        {/* Card Connected From Underneath '=]' */}
        <ConnectedCard
          $size={size}
          $orientation={orientation}
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

          <DetailsSectionContent intervalInfo={intervalInfo} size={size} />
        </ConnectedCard>
      </SheetCard>
    );
  },
);

TimeSheet.displayName = "TimeSheet";

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
} from "./TimeSheet.utils";

export default TimeSheet;
