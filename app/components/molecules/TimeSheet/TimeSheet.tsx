import React, { forwardRef, useMemo } from "react";
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
  LivePulseDot,
  TimeSheetChip,
  ProgressContainer,
  SPRING_TRANSITION,
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

  const cookiePath = useMemo(() => generate12SidedCookiePath(), []);

  return { intervalInfo, wavyArcPath, cookiePath };
}

interface DetailsSectionContentProps {
  intervalInfo: TimeIntervalInfo;
  size: TimeSheetSize;
  isFr: boolean;
}

function DetailsSectionContent({
  intervalInfo,
  size,
  isFr,
}: DetailsSectionContentProps) {
  const chipSize = resolveChipSize(size);
  const chipVariant = resolveChipVariant(intervalInfo.isHappeningNow);
  const liveTooltip = isFr ? "En direct" : "Live";
  const activeProgressColor = intervalInfo.isHappeningNow
    ? intervalInfo.progressColor
    : undefined;

  return (
    <>
      <DigitalIntervalRow>
        <DigitalIntervalText
          $size={size}
          data-testid="time-sheet-digital-interval"
        >
          {intervalInfo.digitalRange}
        </DigitalIntervalText>

        {intervalInfo.isHappeningNow && (
          <Tooltip title={liveTooltip} arrow>
            <LivePulseDot
              role="status"
              aria-label={liveTooltip}
              data-testid="time-sheet-live-dot"
            />
          </Tooltip>
        )}
      </DigitalIntervalRow>

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

    const { intervalInfo, wavyArcPath, cookiePath } = useTimeSheetCalculations(
      startTime,
      endTime,
      calculationOptions,
    );

    const primaryColor = theme.palette.primary.main;
    const activeColor = intervalInfo.isHappeningNow
      ? intervalInfo.progressColor
      : primaryColor;

    const accessibleLabel =
      ariaLabel ||
      `Time interval: ${intervalInfo.digitalRange}${
        intervalInfo.chipLabel ? `, ${intervalInfo.chipLabel}` : ""
      }`;

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

            {/* Inner guideline */}
            <circle
              cx="50"
              cy="50"
              r="38"
              fill="none"
              stroke={activeColor}
              strokeWidth="0.5"
              strokeOpacity="0.08"
            />

            {/* Tightly Scallop-Mirroring Squiggly Circular Progress Line */}
            {wavyArcPath && (
              <motion.path
                d={wavyArcPath}
                fill="none"
                stroke={activeColor}
                strokeWidth={2.8}
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={SPRING_TRANSITION}
                data-testid="time-sheet-wavy-arc"
              />
            )}

            {/* Start Needle: Rounded pill hand */}
            <line
              x1="50"
              y1="50"
              x2="50"
              y2="28"
              stroke={activeColor}
              strokeWidth="6"
              strokeLinecap="round"
              transform={`rotate(${intervalInfo.startHourAngle} 50 50)`}
              data-testid="time-sheet-start-needle"
            />

            {/* End Needle: Pastel / secondary pill hand */}
            <line
              x1="50"
              y1="50"
              x2="50"
              y2="18"
              stroke={alpha(activeColor, 0.42)}
              strokeWidth="6"
              strokeLinecap="round"
              transform={`rotate(${intervalInfo.endHourAngle} 50 50)`}
              data-testid="time-sheet-end-needle"
            />

            {/* Animated Needle with MD3 Spring Transition from Start to End */}
            <MotionHandGroup
              initial={{ rotate: intervalInfo.startHourAngle }}
              animate={{ rotate: intervalInfo.endHourAngle }}
              transition={SPRING_TRANSITION}
              transformTemplate={({ rotate }) => `rotate(${rotate} 50 50)`}
              data-testid="time-sheet-animated-needle"
            >
              <line
                x1="50"
                y1="50"
                x2="50"
                y2="18"
                stroke={activeColor}
                strokeWidth="6"
                strokeLinecap="round"
              />
            </MotionHandGroup>

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
          <DetailsSectionContent
            intervalInfo={intervalInfo}
            size={size}
            isFr={isFr}
          />
        </ConnectedCard>
      </SheetCard>
    );
  },
);

TimeSheet.displayName = "TimeSheet";

export {
  computeNeedleAngle,
  formatDigitalInterval,
  computeTimeIntervalInfo,
  buildWavyArc,
  generate12SidedCookiePath,
  interpolateProgressColor,
  getContrastTextColor,
  PROGRESS_COLOR_STOPS,
  type ComputeTimeIntervalOptions,
  type ProgressColorStop,
} from "./TimeSheet.utils";

export default TimeSheet;
