import type {
  SchedulerEvent,
  SchedulerEventColor,
} from "@mui/x-scheduler/models";
import type { ClassWithDetails } from "~/services/classService";
import type { AuthUser } from "~/utils/auth";

/**
 * Domain Invariant:
 * The planning timetable is strictly scoped to scheduled classes.
 * Asynchronous course activities/modules are non-calendar items and are excluded.
 */
export interface InstructorOption {
  id: string;
  name: string;
  email: string;
  role: "admin" | "instructor";
}

export interface SessionOption {
  id: string;
  courseTitle: string;
  cohortName: string;
}

export interface PlanningLoaderData {
  user: AuthUser;
  classes: ClassWithDetails[];
  feedToken: string;
  instructors: InstructorOption[];
  sessions: SessionOption[];
}

export function getSchedulerColor(isRemote: boolean): SchedulerEventColor {
  return isRemote ? "blue" : "green";
}

export function mapClassToSchedulerEvent(c: {
  id: string;
  title: string;
  startTime: Date | string;
  endTime: Date | string;
  isRemote: boolean;
  description?: string | null;
}): SchedulerEvent {
  return {
    id: c.id,
    title: c.title,
    start: new Date(c.startTime).toISOString(),
    end: new Date(c.endTime).toISOString(),
    color: getSchedulerColor(c.isRemote),
    description: c.description ?? undefined,
    className: c.isRemote ? "event-remote" : "event-in-person",
  };
}

export function formatTimeRange(
  start: Date,
  end: Date,
  locale?: string,
): string {
  const timeOpts: Intl.DateTimeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
  };
  const dateOpts: Intl.DateTimeFormatOptions = {
    weekday: "short",
    month: "short",
    day: "numeric",
  };
  let dateStr = start.toLocaleDateString(locale, dateOpts);
  if (locale?.startsWith("fr")) {
    dateStr = dateStr
      .split(" ")
      .map((w) => (w.length > 0 ? w[0].toUpperCase() + w.slice(1) : w))
      .join(" ");
  }
  const startStr = start.toLocaleTimeString(locale, timeOpts);
  const endStr = end.toLocaleTimeString(locale, timeOpts);
  return `${dateStr} • ${startStr} - ${endStr}`;
}

export function calculateDurationHours(start: Date, end: Date): string {
  const diffMinutes = Math.max(
    0,
    Math.round((end.getTime() - start.getTime()) / 60000),
  );
  const hours = Math.floor(diffMinutes / 60);
  const mins = diffMinutes % 60;
  if (hours === 0) return `${mins}m`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
}

export function buildMailtoUrl(classItem: ClassWithDetails): string {
  const subject = encodeURIComponent(`[AptiSpace] ${classItem.title}`);
  const instructorName =
    classItem.instructor?.displayName || "AptiSpace Faculty";
  const startStr = new Date(classItem.startTime).toLocaleString();
  const endStr = new Date(classItem.endTime).toLocaleString();
  const formatLabel = classItem.isRemote ? "Remote / Online" : "In-Person";

  const lines = [
    `Class: ${classItem.title}${classItem.isRemote ? " (Remote)" : ""}`,
    `Format: ${formatLabel}`,
    `Course: ${classItem.session.course.title}`,
    `Instructor: ${instructorName}`,
    `Date & Time: ${startStr} to ${endStr}`,
    classItem.location ? `Location: ${classItem.location}` : "",
    classItem.description ? `\nDetails:\n${classItem.description}` : "",
    `\nSubscribe to the live timetable feed in AptiSpace LMS.`,
  ].filter(Boolean);

  return `mailto:?subject=${subject}&body=${encodeURIComponent(lines.join("\n"))}`;
}

export function toDatetimeLocalString(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  const yr = date.getFullYear();
  const mo = pad(date.getMonth() + 1);
  const da = pad(date.getDate());
  const hr = pad(date.getHours());
  const mi = pad(date.getMinutes());
  return `${yr}-${mo}-${da}T${hr}:${mi}`;
}

export interface InitialFormTimes {
  startTime: string;
  endTime: string;
}

function getOccurrenceDate(
  field?: { timestamp?: number; value?: string | Date },
  fallback?: string | number | Date,
): Date | null {
  if (typeof field?.timestamp === "number") {
    return new Date(field.timestamp);
  }
  if (field?.value) {
    return new Date(field.value);
  }
  if (fallback) {
    return new Date(fallback);
  }
  return null;
}

function computeRangeEnd(startDate: Date, endDate: Date | null): Date {
  const defaultDurationMs = 60 * 60 * 1000;
  if (!endDate || isNaN(endDate.getTime())) {
    return new Date(startDate.getTime() + defaultDurationMs);
  }
  endDate.setSeconds(0, 0);
  const diff = endDate.getTime() - startDate.getTime();
  return new Date(startDate.getTime() + Math.max(defaultDurationMs, diff));
}

function isAllDayOccurrence(
  startDate: Date,
  endDate: Date | null,
  allDay?: boolean,
): boolean {
  if (allDay) return true;
  if (!endDate || isNaN(endDate.getTime())) return false;
  return endDate.getTime() - startDate.getTime() >= 23 * 3600 * 1000;
}

function getDayRangeTimes(startDate: Date): InitialFormTimes {
  const dayStart = new Date(startDate);
  dayStart.setHours(9, 0, 0, 0);
  const dayEnd = new Date(startDate);
  dayEnd.setHours(10, 0, 0, 0);
  return {
    startTime: toDatetimeLocalString(dayStart),
    endTime: toDatetimeLocalString(dayEnd),
  };
}

export function extractTimesFromOccurrence(
  occurrence: unknown,
): InitialFormTimes | null {
  if (!occurrence || typeof occurrence !== "object") return null;

  const occ = occurrence as {
    displayTimezone?: {
      start?: { timestamp?: number; value?: string | Date };
      end?: { timestamp?: number; value?: string | Date };
    };
    start?: string | number | Date;
    end?: string | number | Date;
    allDay?: boolean;
  };

  const startDate = getOccurrenceDate(occ.displayTimezone?.start, occ.start);
  if (!startDate || isNaN(startDate.getTime())) return null;
  startDate.setSeconds(0, 0);

  const endDate = getOccurrenceDate(occ.displayTimezone?.end, occ.end);
  if (isAllDayOccurrence(startDate, endDate, occ.allDay)) {
    return getDayRangeTimes(startDate);
  }

  const finalEnd = computeRangeEnd(startDate, endDate);
  return {
    startTime: toDatetimeLocalString(startDate),
    endTime: toDatetimeLocalString(finalEnd),
  };
}
