import type { LoaderFunctionArgs } from "react-router";
import { createLogoutCookieHeader } from "~/utils/session.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const redirectTarget = url.searchParams.get("redirect") || "/";

  return new Response(null, {
    status: 302,
    headers: {
      Location: redirectTarget,
      "Set-Cookie": createLogoutCookieHeader(),
    },
  });
}

export async function action() {
  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Set-Cookie": createLogoutCookieHeader(),
    },
  });
}
