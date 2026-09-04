import type { LoaderFunctionArgs } from "react-router";
import { getCourseWithModules } from "~/services/courseService";
import { authGuard } from "~/utils/session.server";

export async function loader({ request, params, context }: LoaderFunctionArgs) {
  const auth = await authGuard(request, context);
  const db = auth?.db;
  const courseId = params.courseId;

  if (!db) {
    return Response.json(
      { error: "Database binding unavailable", code: "DATABASE_UNAVAILABLE" },
      { status: 503 },
    );
  }

  if (!courseId) {
    return Response.json(
      { error: "Missing course ID", code: "BAD_REQUEST" },
      { status: 400 },
    );
  }

  const course = await getCourseWithModules(db, courseId);
  if (!course) {
    return Response.json(
      { error: "Course not found", code: "NOT_FOUND" },
      { status: 404 },
    );
  }

  return Response.json({ course });
}
