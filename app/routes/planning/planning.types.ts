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

export function formatTimeRange(start: Date, end: Date): string {
  const timeOpts: Intl.DateTimeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
  };
  const dateOpts: Intl.DateTimeFormatOptions = {
    weekday: "short",
    month: "short",
    day: "numeric",
  };
  const dateStr = start.toLocaleDateString(undefined, dateOpts);
  const startStr = start.toLocaleTimeString(undefined, timeOpts);
  const endStr = end.toLocaleTimeString(undefined, timeOpts);
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
