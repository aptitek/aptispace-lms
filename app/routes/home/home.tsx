import type { LoaderFunctionArgs } from "react-router";
import { authGuard } from "~/utils/session.server";
import { isUserProfileComplete } from "~/services/userService";

export async function loader({ request, context }: LoaderFunctionArgs) {
  const auth = await authGuard(request, context);
  if (!auth || !auth.user || !isUserProfileComplete(auth.user)) {
    throw new Response(null, {
      status: 302,
      headers: { Location: "/onboarding" },
    });
  }

  throw new Response(null, {
    status: 302,
    headers: { Location: "/planning" },
  });
}

export function meta() {
  return [
    { title: "AptiSpace LMS • Planning" },
    {
      name: "description",
      content: "AptiSpace LMS Planning and Academic Timetable.",
    },
  ];
}

export default function Home() {
  return null;
}
