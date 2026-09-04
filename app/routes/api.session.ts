import type { LoaderFunctionArgs } from "react-router";
import { authGuard } from "~/utils/session.server";
import { isUserProfileComplete } from "~/services/userService";
import { resolveActiveUser } from "~/utils/auth";

export async function loader({ request, context }: LoaderFunctionArgs) {
  const auth = await authGuard(request, context, { allowAnonymous: true });

  if (!auth || !auth.session) {
    return Response.json(
      {
        authenticated: false,
        session: null,
        user: null,
      },
      { status: 200 },
    );
  }

  const activeUser = auth.user
    ? resolveActiveUser(auth.user, auth.session)
    : null;

  return Response.json({
    status: "ok",
    authenticated: true,
    session: auth.session,
    user: activeUser,
    isProfileComplete: auth.user ? isUserProfileComplete(auth.user) : false,
  });
}
