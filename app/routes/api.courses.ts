import type { LoaderFunctionArgs } from "react-router";
import { getCourses } from "~/services/courseService";
import { authGuard } from "~/utils/session.server";

export async function loader({ request, context }: LoaderFunctionArgs) {
  const auth = await authGuard(request, context);
  const db = auth?.db;

  if (!db) {
    return Response.json(
      { error: "Database binding unavailable", code: "DATABASE_UNAVAILABLE" },
      { status: 503 },
    );
  }

  const coursesList = await getCourses(db);
  return Response.json({ courses: coursesList, total: coursesList.length });
}
