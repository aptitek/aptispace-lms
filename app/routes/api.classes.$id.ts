import type { LoaderFunctionArgs } from "react-router";
import ical from "ical-generator";
import { getDatabaseFromContext } from "~/db";
import { getClassById, type ClassWithDetails } from "~/services/classService";

function resolveInstructorContact(instructor?: ClassWithDetails["instructor"]) {
  return {
    name: instructor?.displayName || "AptiSpace Faculty",
    email: instructor?.email || "faculty@aptispace.io",
  };
}

function resolveEventLocation(classItem: ClassWithDetails): string {
  if (classItem.isRemote) {
    return classItem.location || "Remote / Online";
  }
  return classItem.location || "AptiSpace Campus";
}

function buildSingleEventDescription(
  classItem: ClassWithDetails,
  instructorName: string,
  instructorEmail: string,
): string {
  const parts = [
    `Course: ${classItem.session.course.title}`,
    classItem.session.cohort
      ? `Cohort: ${classItem.session.cohort.diploma} (Year ${classItem.session.cohort.year})`
      : "",
    `Instructor: ${instructorName} (${instructorEmail})`,
    classItem.description ? `\nDetails:\n${classItem.description}` : "",
  ];
  return parts.filter(Boolean).join("\n");
}

function createSingleEventIcsResponse(
  classItem: ClassWithDetails,
  originUrl: string,
): Response {
  const calendar = ical({
    name: `AptiSpace - ${classItem.title}`,
    timezone: "UTC",
  });

  const { name: instructorName, email: instructorEmail } =
    resolveInstructorContact(classItem.instructor);

  calendar.createEvent({
    id: classItem.id,
    start: classItem.startTime,
    end: classItem.endTime,
    summary: classItem.isRemote
      ? `[Remote] ${classItem.title}`
      : classItem.title,
    description: buildSingleEventDescription(
      classItem,
      instructorName,
      instructorEmail,
    ),
    location: resolveEventLocation(classItem),
    organizer: {
      name: instructorName,
      email: instructorEmail,
    },
    url: `${originUrl}/planning`,
  });

  return new Response(calendar.toString(), {
    status: 200,
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="class-${classItem.id}.ics"`,
      "Cache-Control": "no-cache",
    },
  });
}

export async function loader({ params, request, context }: LoaderFunctionArgs) {
  const classId = params.id;
  if (!classId) {
    return Response.json({ error: "Missing class ID" }, { status: 400 });
  }

  const db = getDatabaseFromContext(context);
  if (!db) {
    return Response.json({ error: "Database unavailable" }, { status: 503 });
  }

  const classItem = await getClassById(db, classId);
  if (!classItem) {
    return Response.json({ error: "Class not found" }, { status: 404 });
  }

  const url = new URL(request.url);
  if (url.searchParams.get("format") === "ics") {
    return createSingleEventIcsResponse(classItem, url.origin);
  }

  return Response.json({ class: classItem });
}
