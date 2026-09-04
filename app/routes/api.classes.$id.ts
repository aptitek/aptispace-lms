import type { LoaderFunctionArgs } from "react-router";
import ical from "ical-generator";
import { getDatabaseFromContext } from "~/db";
import { getClassById, type ClassWithDetails } from "~/services/classService";

function createSingleEventIcsResponse(
  classItem: ClassWithDetails,
  originUrl: string,
): Response {
  const calendar = ical({
    name: `AptiSpace - ${classItem.title}`,
    timezone: "UTC",
  });

  const instructorName =
    classItem.instructor?.displayName || "AptiSpace Faculty";
  const instructorEmail = classItem.instructor?.email || "faculty@aptispace.io";

  const descParts = [
    `Course: ${classItem.session.course.title}`,
    classItem.session.cohort
      ? `Cohort: ${classItem.session.cohort.diploma} (Year ${classItem.session.cohort.year})`
      : "",
    `Instructor: ${instructorName} (${instructorEmail})`,
    classItem.description ? `\nDetails:\n${classItem.description}` : "",
  ];

  calendar.createEvent({
    id: classItem.id,
    start: classItem.startTime,
    end: classItem.endTime,
    summary: `[${classItem.type.toUpperCase()}] ${classItem.title}`,
    description: descParts.filter(Boolean).join("\n"),
    location: classItem.location || "AptiSpace Campus",
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
