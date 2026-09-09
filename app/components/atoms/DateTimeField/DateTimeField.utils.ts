import dayjs, { type Dayjs } from "dayjs";
import type {
  DateTimeValue,
  DateTimeFieldMode,
  HourFormat,
  DateFormat,
} from "./DateTimeField.types";

export interface ResolveFormatOptions {
  mode: DateTimeFieldMode;
  dateFormat: DateFormat;
  displayIsoDate: boolean;
  is12Hour: boolean;
  customFormat?: string;
}

export function toDayjs(dateInput?: DateTimeValue): Dayjs | null {
  if (dateInput === null || dateInput === undefined || dateInput === "") {
    return null;
  }
  const parsed = dayjs(dateInput);
  return parsed.isValid() ? parsed : null;
}

export function resolveIs12Hour(
  hourFormat: HourFormat,
  ampmProp?: boolean,
  normLocale = "en",
): boolean {
  if (typeof ampmProp === "boolean") return ampmProp;
  if (hourFormat === "12h") return true;
  if (hourFormat === "24h") return false;
  return normLocale.startsWith("en");
}

function resolveTimeFormat(is12Hour: boolean): string {
  return is12Hour ? "hh:mm A" : "HH:mm";
}

function resolveDateFormat(
  dateFormat: DateFormat,
  isIso: boolean,
): string | undefined {
  if (isIso) return "YYYY-MM-DD";
  if (typeof dateFormat === "string" && dateFormat !== "localized") {
    return dateFormat;
  }
  return undefined;
}

function resolveDateTimeFormat(
  dateFormat: DateFormat,
  isIso: boolean,
  is12Hour: boolean,
): string | undefined {
  if (isIso) {
    return is12Hour ? "YYYY-MM-DD hh:mm A" : "YYYY-MM-DD HH:mm";
  }
  if (typeof dateFormat === "string" && dateFormat !== "localized") {
    return dateFormat;
  }
  return undefined;
}

export function resolveFormatString(
  options: ResolveFormatOptions,
): string | undefined {
  const { mode, dateFormat, displayIsoDate, is12Hour, customFormat } = options;
  if (customFormat) return customFormat;

  const isIso = dateFormat === "iso" || displayIsoDate;
  if (mode === "time") return resolveTimeFormat(is12Hour);
  if (mode === "date") return resolveDateFormat(dateFormat, isIso);
  return resolveDateTimeFormat(dateFormat, isIso, is12Hour);
}

export function resolveStartAriaLabel(
  startLabel?: string,
  normLocale = "en",
): string {
  if (startLabel) return startLabel;
  return normLocale === "fr" ? "Heure de début" : "Start time";
}

export function resolveEndAriaLabel(
  endLabel?: string,
  normLocale = "en",
): string {
  if (endLabel) return endLabel;
  return normLocale === "fr" ? "Heure de fin" : "End time";
}
