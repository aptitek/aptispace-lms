import type { LoaderFunctionArgs } from "react-router";
import { getCourses, getCourseWithModules } from "~/services/courseService";
import { authGuard } from "~/utils/session.server";

export async function loader({ request, context }: LoaderFunctionArgs) {
  // Auth by default: guarantees request is authenticated before returning data
  const auth = await authGuard(request, context);
  const db = auth?.db;

  const url = new URL(request.url);
  const courseId = url.searchParams.get("id");

  if (!db) {
    return Response.json({
      courses: [
        {
          id: "demo-course-1",
          title: "Orbital Mechanics & Astrodynamics",
          description:
            "Comprehensive course on Keplerian trajectories, orbital rendezvous, and delta-v maneuvers.",
        },
      ],
    });
  }

  if (courseId) {
    const course = await getCourseWithModules(db, courseId);
    if (!course) {
      return Response.json({ error: "Course not found" }, { status: 404 });
    }
    return Response.json({ course });
  }

  const coursesList = await getCourses(db);
  return Response.json({ courses: coursesList });
}
