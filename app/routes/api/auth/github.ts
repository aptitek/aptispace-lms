import type { LoaderFunctionArgs } from "react-router";

const OAUTH_STATE_COOKIE = "oauth_state";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const redirectTarget = url.searchParams.get("redirect_uri") || "/";

  const stateToken = crypto.randomUUID();
  const origin = url.origin;
  const callbackUrl = `${origin}/api/auth/github/callback`;

  const clientId =
    (typeof process !== "undefined" && process.env.GITHUB_CLIENT_ID) ||
    "dev_client_id_placeholder";

  const isDev =
    typeof process !== "undefined" && process.env.NODE_ENV !== "production";

  // In development without real client ID, provide mock fallback
  if (isDev && clientId === "dev_client_id_placeholder") {
    const mockRedirect = `${callbackUrl}?code=mock_dev_oauth_code&state=${stateToken}&target=${encodeURIComponent(redirectTarget)}`;
    const cookieHeader = `${OAUTH_STATE_COOKIE}=${stateToken}; Path=/; HttpOnly; SameSite=Lax; Max-Age=600`;
    return new Response(null, {
      status: 302,
      headers: {
        Location: mockRedirect,
        "Set-Cookie": cookieHeader,
      },
    });
  }

  const githubAuthUrl = new URL("https://github.com/login/oauth/authorize");
  githubAuthUrl.searchParams.set("client_id", clientId);
  githubAuthUrl.searchParams.set("redirect_uri", callbackUrl);
  githubAuthUrl.searchParams.set("scope", "read:user user:email repo");
  githubAuthUrl.searchParams.set("state", stateToken);

  const cookieHeader = `${OAUTH_STATE_COOKIE}=${stateToken}; Path=/; HttpOnly; SameSite=Lax; Max-Age=600`;

  return new Response(null, {
    status: 302,
    headers: {
      Location: githubAuthUrl.toString(),
      "Set-Cookie": cookieHeader,
    },
  });
}
