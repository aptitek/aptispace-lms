import dayjs, { type Dayjs } from "dayjs";
import "dayjs/locale/fr";
import { PROGRESS_THEME_COLORS } from "~/tokens/theme";
import type { TimeIntervalInfo, HourFormat } from "./TimeSheet.types";

export interface ComputeTimeIntervalOptions {
  referenceTime?: Date | string | number | Dayjs;
  locale?: string;
  hourFormat?: HourFormat;
}

export function computeNeedleAngle(
  date: Date | string | number | Dayjs,
): number {
  const d = dayjs(date);
  const hour = d.hour() % 12;
  const minute = d.minute();
  return hour * 30 + minute * 0.5;
}

export const computeHourNeedleAngle = computeNeedleAngle;

export function computeMinuteNeedleAngle(
  date: Date | string | number | Dayjs,
): number {
  const d = dayjs(date);
  const minute = d.minute();
  return (minute * 6) % 360;
}

export function computeClockwiseTargetAngle(
  startAngle: number,
  endAngle: number,
): number {
  const diff = (endAngle - startAngle) % 360;
  const sweep = diff < 0 ? diff + 360 : diff;
  return startAngle + sweep;
}

export const HOUR_NEEDLE_LENGTH = 24; // center (50, 50) to hour needle tip (50, 26)

export function computeEndDotCoordinates(
  endHourAngle: number,
  radius = HOUR_NEEDLE_LENGTH,
): { x: number; y: number; angle: number; radius: number } {
  const thetaRad = (endHourAngle * Math.PI) / 180;
  const x = Number((50 + radius * Math.sin(thetaRad)).toFixed(2));
  const y = Number((50 - radius * Math.cos(thetaRad)).toFixed(2));
  return { x, y, angle: endHourAngle, radius };
}

export function formatDigitalInterval(
  start: Dayjs,
  end: Dayjs,
  normLocale: string,
  hourFormat: HourFormat = "auto",
): string {
  const is12Hour =
    hourFormat === "12h" ||
    (hourFormat === "auto" && normLocale.startsWith("en"));

  if (is12Hour) {
    const startStr = start.format("h:mm A");
    const endStr = end.format("h:mm A");
    return `${startStr} – ${endStr}`;
  }

  const startStr = start.format("HH:mm");
  const endStr = end.format("HH:mm");
  return `${startStr} – ${endStr}`;
}

function toClosedPath(points: [number, number][]): string {
  if (points.length === 0) return "";
  const d = [`M${points[0][0].toFixed(2)} ${points[0][1].toFixed(2)}`];
  const n = points.length;
  for (let i = 0; i < n; i++) {
    const p0 = points[(i - 1 + n) % n];
    const p1 = points[i];
    const p2 = points[(i + 1) % n];
    const p3 = points[(i + 2) % n];
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d.push(
      `C${c1x.toFixed(2)} ${c1y.toFixed(2)} ${c2x.toFixed(2)} ${c2y.toFixed(2)} ${p2[0].toFixed(2)} ${p2[1].toFixed(2)}`,
    );
  }
  return d.join(" ");
}

function toOpenPath(points: [number, number][]): string {
  if (points.length === 0) return "";
  const d = [`M${points[0][0].toFixed(2)} ${points[0][1].toFixed(2)}`];
  const n = points.length;
  for (let i = 0; i < n - 1; i++) {
    const p0 = points[Math.max(0, i - 1)];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[Math.min(n - 1, i + 2)];
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d.push(
      `C${c1x.toFixed(2)} ${c1y.toFixed(2)} ${c2x.toFixed(2)} ${c2y.toFixed(2)} ${p2[0].toFixed(2)} ${p2[1].toFixed(2)}`,
    );
  }
  return d.join(" ");
}

export function generate12SidedCookiePath(
  cx = 50,
  cy = 50,
  baseR = 41.5,
  amp = 3,
): string {
  const points: [number, number][] = [];
  const samples = 72;
  for (let i = 0; i < samples; i++) {
    const theta = (2 * Math.PI * i) / samples;
    const r = baseR + amp * Math.cos(12 * theta);
    const x = cx + r * Math.sin(theta);
    const y = cy - r * Math.cos(theta);
    points.push([x, y]);
  }
  return toClosedPath(points);
}

export interface WavyArcOptions {
  baseR?: number;
  amp?: number;
  phase?: number;
}

export function buildWavyArc(
  startAngle: number,
  sweepAngle: number,
  optionsOrBaseR?: WavyArcOptions | number,
  amp = 2.4,
): string {
  if (sweepAngle <= 0) return "";

  let baseR = 36.5;
  let phase = 0;
  let amplitude = amp;

  if (typeof optionsOrBaseR === "object" && optionsOrBaseR !== null) {
    if (optionsOrBaseR.baseR !== undefined) baseR = optionsOrBaseR.baseR;
    if (optionsOrBaseR.amp !== undefined) amplitude = optionsOrBaseR.amp;
    if (optionsOrBaseR.phase !== undefined) phase = optionsOrBaseR.phase;
  } else if (typeof optionsOrBaseR === "number") {
    baseR = optionsOrBaseR;
  }

  const samples = Math.max(16, Math.round((sweepAngle / 30) * 8));
  const points: [number, number][] = [];

  for (let i = 0; i <= samples; i++) {
    const t = i / samples;
    const angleDeg = startAngle + t * sweepAngle;
    const thetaRad = (angleDeg * Math.PI) / 180;
    const wave = amplitude * Math.cos(12 * thetaRad - phase);
    const r = baseR + wave;
    const x = 50 + r * Math.sin(thetaRad);
    const y = 50 - r * Math.cos(thetaRad);
    points.push([x, y]);
  }

  return toOpenPath(points);
}

export interface WavyArcPhasesOptions {
  numPhases?: number;
  baseR?: number;
  amp?: number;
}

export function generateWavyArcPhases(
  startAngle: number,
  sweepAngle: number,
  options: WavyArcPhasesOptions = {},
): string {
  if (sweepAngle <= 0) return "";
  const { numPhases = 12, baseR = 36.5, amp = 2.4 } = options;
  const phases: string[] = [];
  for (let i = 0; i <= numPhases; i++) {
    const phase = (2 * Math.PI * i) / numPhases;
    phases.push(buildWavyArc(startAngle, sweepAngle, { baseR, amp, phase }));
  }
  return phases.join(";");
}

function resolveUpcomingText(diffMins: number, isFr: boolean): string {
  const hours = Math.floor(diffMins / 60);
  const mins = diffMins % 60;
  if (hours > 0 && mins === 0) {
    return isFr ? `dans ${hours}h` : `in ${hours} hours`;
  }
  if (hours > 0) {
    return isFr ? `dans ${hours}h ${mins}m` : `in ${hours}h ${mins}m`;
  }
  return isFr ? `dans ${mins} min` : `in ${mins}m`;
}

function resolveRemainingText(remainingMins: number, isFr: boolean): string {
  const hours = Math.floor(remainingMins / 60);
  const mins = remainingMins % 60;
  if (hours > 0 && mins > 0) {
    return isFr
      ? `En cours • ${hours}h ${mins}m restantes`
      : `Now • ${hours}h ${mins}m remaining`;
  }
  if (hours > 0) {
    return isFr
      ? `En cours • ${hours}h restantes`
      : `Now • ${hours}h remaining`;
  }
  return isFr ? `En cours • ${mins} min restantes` : `Now • ${mins}m remaining`;
}

function resolveEndedText(endedMins: number, isFr: boolean): string {
  const hours = Math.floor(endedMins / 60);
  if (hours > 0) {
    return isFr ? `Terminé il y a ${hours}h` : `Ended ${hours}h ago`;
  }
  return isFr ? `Terminé il y a ${endedMins} min` : `Ended ${endedMins}m ago`;
}

interface ChipResolutionParams {
  isHappeningNow: boolean;
  isUpcomingToday: boolean;
  isPastToday: boolean;
  remainingMinutes: number;
  diffMins: number;
  endedMins: number;
  isFr: boolean;
}

function resolveChipState(params: ChipResolutionParams): {
  chipLabel: string | null;
  chipColor: "primary" | "warning" | "info" | "default";
} {
  const {
    isHappeningNow,
    isUpcomingToday,
    isPastToday,
    remainingMinutes,
    diffMins,
    endedMins,
    isFr,
  } = params;

  if (isHappeningNow) {
    return {
      chipLabel: resolveRemainingText(remainingMinutes, isFr),
      chipColor: "warning",
    };
  }

  if (isUpcomingToday) {
    return {
      chipLabel: resolveUpcomingText(diffMins, isFr),
      chipColor: "info",
    };
  }

  if (isPastToday) {
    return {
      chipLabel: resolveEndedText(endedMins, isFr),
      chipColor: "default",
    };
  }

  return { chipLabel: null, chipColor: "default" };
}

function checkIntervalTiming(startD: Dayjs, endD: Dayjs, refD: Dayjs) {
  const isToday = startD.startOf("day").isSame(refD.startOf("day"));
  const isHappeningNow =
    isToday &&
    (refD.isAfter(startD) || refD.isSame(startD)) &&
    refD.isBefore(endD);
  const isUpcomingToday = isToday && refD.isBefore(startD);
  const isPastToday = isToday && (refD.isAfter(endD) || refD.isSame(endD));

  return { isToday, isHappeningNow, isUpcomingToday, isPastToday };
}

function calculateDurationStats(startD: Dayjs, endD: Dayjs, refD: Dayjs) {
  const totalDurationMinutes = Math.max(1, endD.diff(startD, "minute"));
  const elapsedMinutes = Math.max(0, refD.diff(startD, "minute"));
  const elapsedPercent = Math.min(
    100,
    Math.round((elapsedMinutes / totalDurationMinutes) * 100),
  );
  const remainingMinutes = Math.max(0, endD.diff(refD, "minute"));
  const diffMins = Math.max(0, startD.diff(refD, "minute"));
  const endedMins = Math.max(0, refD.diff(endD, "minute"));

  return {
    totalDurationMinutes,
    elapsedPercent,
    remainingMinutes,
    diffMins,
    endedMins,
  };
}

export interface ProgressColorStop {
  percent: number;
  color: string;
  name: string;
}

export const PROGRESS_COLOR_STOPS: readonly ProgressColorStop[] = [
  { percent: 0, color: PROGRESS_THEME_COLORS.purple, name: "purple" },
  { percent: 20, color: PROGRESS_THEME_COLORS.blue, name: "blue" },
  { percent: 38, color: PROGRESS_THEME_COLORS.cyan, name: "cyan" },
  { percent: 55, color: PROGRESS_THEME_COLORS.green, name: "green" },
  { percent: 70, color: PROGRESS_THEME_COLORS.yellow, name: "yellow" },
  { percent: 82, color: PROGRESS_THEME_COLORS.orange, name: "orange" },
  { percent: 92, color: PROGRESS_THEME_COLORS.red, name: "red" },
  { percent: 100, color: PROGRESS_THEME_COLORS.magenta, name: "magenta" },
] as const;

export function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace("#", "");
  const num = parseInt(clean, 16);
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

export function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (c: number) =>
    Math.round(Math.min(255, Math.max(0, c)))
      .toString(16)
      .padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export function interpolateProgressColor(percent: number): string {
  const clamped = Math.min(100, Math.max(0, percent));

  let lower = PROGRESS_COLOR_STOPS[0];
  let upper = PROGRESS_COLOR_STOPS[PROGRESS_COLOR_STOPS.length - 1];

  for (let i = 0; i < PROGRESS_COLOR_STOPS.length - 1; i++) {
    const current = PROGRESS_COLOR_STOPS[i];
    const next = PROGRESS_COLOR_STOPS[i + 1];
    if (clamped >= current.percent && clamped <= next.percent) {
      lower = current;
      upper = next;
      break;
    }
  }

  const span = upper.percent - lower.percent;
  if (span <= 0) return lower.color;

  const factor = (clamped - lower.percent) / span;
  const [r1, g1, b1] = hexToRgb(lower.color);
  const [r2, g2, b2] = hexToRgb(upper.color);

  const r = r1 + factor * (r2 - r1);
  const g = g1 + factor * (g2 - g1);
  const b = b1 + factor * (b2 - b1);

  return rgbToHex(r, g, b);
}

export function getContrastTextColor(hexColor: string): string {
  const [r, g, b] = hexToRgb(hexColor);
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 128
    ? PROGRESS_THEME_COLORS.darkContrast
    : PROGRESS_THEME_COLORS.lightContrast;
}

export function formatDigitalDuration(
  totalMinutes: number,
  isFr = false,
): string {
  const safeMinutes = Math.max(1, Math.round(totalMinutes));
  const hours = Math.floor(safeMinutes / 60);
  const mins = safeMinutes % 60;

  if (hours > 0 && mins > 0) {
    return `${hours}h ${mins}m`;
  }
  if (hours > 0) {
    return `${hours}h`;
  }
  return isFr ? `${mins} min` : `${mins}m`;
}

export function computeTimeIntervalInfo(
  startTime: Date | string | number | Dayjs,
  endTime: Date | string | number | Dayjs,
  options: ComputeTimeIntervalOptions = {},
): TimeIntervalInfo {
  const { referenceTime, locale = "en", hourFormat = "auto" } = options;
  const startD = dayjs(startTime);
  const endD = dayjs(endTime);
  const refD = referenceTime ? dayjs(referenceTime) : dayjs();
  const normLocale = locale.startsWith("fr") ? "fr" : "en";
  const isFr = normLocale === "fr";

  const timing = checkIntervalTiming(startD, endD, refD);
  const startHourAngle = computeNeedleAngle(startD);
  const endHourAngle = computeNeedleAngle(endD);
  const startMinuteAngle = computeMinuteNeedleAngle(startD);
  const endMinuteAngle = computeMinuteNeedleAngle(endD);

  const targetEndHourAngle = computeClockwiseTargetAngle(
    startHourAngle,
    endHourAngle,
  );
  const targetEndMinuteAngle = computeClockwiseTargetAngle(
    startMinuteAngle,
    endMinuteAngle,
  );

  const rawDiff = endHourAngle - startHourAngle;
  const sweepAngle = rawDiff <= 0 ? rawDiff + 360 : rawDiff;
  const endDot = computeEndDotCoordinates(endHourAngle);

  const duration = calculateDurationStats(startD, endD, refD);
  const durationFormatted = formatDigitalDuration(
    duration.totalDurationMinutes,
    isFr,
  );
  const progressColor = interpolateProgressColor(duration.elapsedPercent);

  const { chipLabel, chipColor } = resolveChipState({
    ...timing,
    ...duration,
    isFr,
  });

  const digitalRange = formatDigitalInterval(
    startD,
    endD,
    normLocale,
    hourFormat,
  );

  return {
    ...timing,
    ...duration,
    durationFormatted,
    progressColor,
    digitalRange,
    startHourAngle,
    endHourAngle,
    startMinuteAngle,
    endMinuteAngle,
    targetEndHourAngle,
    targetEndMinuteAngle,
    sweepAngle,
    endDot,
    chipLabel,
    chipColor,
  };
}
