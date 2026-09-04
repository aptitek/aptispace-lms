import type { LoaderFunctionArgs } from "react-router";
import ical, { ICalEventStatus, type ICalCalendar } from "ical-generator";
import { getDatabaseFromContext } from "~/db";
import {
  getUserByCalendarFeedToken,
  getClassesForUser,
  type ClassWithDetails,
} from "~/services/classService";

function resolveRoleLabel(role: string): string {
  if (role === "admin") return "Administrator (All Classes)";
  if (role === "instructor") return "Instructor (Assigned Classes)";
  return "Cadet (Cohort Classes)";
}

function buildEventDescription(
  c: ClassWithDetails,
  instructorName: string,
  instructorEmail: string,
): string {
  const parts: string[] = [
    `Course: ${c.session.course.title}`,
    c.session.cohort
      ? `Cohort: ${c.session.cohort.diploma ?? ""} Year ${c.session.cohort.year ?? ""}`.trim()
      : "",
    `Format: ${c.isRemote ? "Remote / Online" : "In-Person"}`,
    `Instructor: ${instructorName} <${instructorEmail}>`,
    c.location ? `Location: ${c.location}` : "",
    c.description ? `\nNotes:\n${c.description}` : "",
  ];
  return parts.filter(Boolean).join("\n");
}

function addEventsToCalendar(
  calendar: ICalCalendar,
  classesList: ClassWithDetails[],
  originUrl: string,
): void {
  for (const c of classesList) {
    const instructorName = c.instructor?.displayName || "AptiSpace Faculty";
    const instructorEmail = c.instructor?.email || "faculty@aptispace.io";

    calendar.createEvent({
      id: c.id,
      start: new Date(c.startTime),
      end: new Date(c.endTime),
      summary: c.isRemote ? `[Remote] ${c.title}` : c.title,
      description: buildEventDescription(c, instructorName, instructorEmail),
      location: c.isRemote
        ? c.location || "Remote / Online"
        : c.location || "AptiSpace Virtual Campus",
      status: ICalEventStatus.CONFIRMED,
      organizer: {
        name: instructorName,
        email: instructorEmail,
      },
      url: `${originUrl}/planning`,
    });
  }
}

export async function loader({ params, request, context }: LoaderFunctionArgs) {
  const token = params.token || new URL(request.url).searchParams.get("token");

  if (!token) {
    return new Response("Unauthorized: Missing calendar feed token", {
      status: 401,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  const db = getDatabaseFromContext(context);
  if (!db) {
    return new Response("Database unavailable", {
      status: 503,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  const user = await getUserByCalendarFeedToken(db, token);
  if (!user) {
    return new Response(
      "Unauthorized: Invalid or revoked calendar feed token",
      {
        status: 401,
        headers: { "Content-Type": "text/plain; charset=utf-8" },
      },
    );
  }

  const classesList = await getClassesForUser(db, user);
  const userName =
    user.displayName || `${user.firstName} ${user.lastName}`.trim();
  const roleLabel = resolveRoleLabel(user.role);
  const url = new URL(request.url);

  const calendar = ical({
    name: `AptiSpace LMS • ${userName} [${roleLabel}]`,
    description: `Official AptiSpace academic schedule feed for ${userName}.`,
    timezone: "UTC",
    ttl: 3600,
    url: `${url.origin}/planning`,
  });

  addEventsToCalendar(calendar, classesList, url.origin);

  return new Response(calendar.toString(), {
    status: 200,
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `inline; filename="aptispace-${user.id}.ics"`,
      "Cache-Control": "no-cache, no-store, must-revalidate",
    },
  });
}
