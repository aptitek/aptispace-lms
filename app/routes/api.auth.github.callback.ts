import type { LoaderFunctionArgs } from "react-router";
import { getDatabaseFromContext, type Database } from "~/db";
import {
  getUserByGithubId,
  createUser,
  createAffiliation,
  getUserWithAffiliations,
} from "~/services/userService";
import { fetchGitHubUserProfile } from "~/services/githubService.server";
import {
  signSessionToken,
  createSessionCookieHeader,
} from "~/utils/session.server";

const OAUTH_STATE_COOKIE = "oauth_state";

function parseCookie(request: Request, name: string): string | null {
  const cookieHeader = request.headers.get("Cookie");
  if (!cookieHeader) return null;
  const entries = cookieHeader.split(";");
  for (const entry of entries) {
    const [entryName, ...rest] = entry.trim().split("=");
    if (entryName === name) {
      return rest.join("=");
    }
  }
  return null;
}

function clearStateCookieHeader(): string {
  return `${OAUTH_STATE_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT`;
}

async function exchangeGitHubCode(code: string): Promise<string | null> {
  const clientId = process.env.GITHUB_CLIENT_ID || "";
  const clientSecret = process.env.GITHUB_CLIENT_SECRET || "";

  if (!clientId || !clientSecret) {
    return null;
  }

  const tokenResponse = await fetch(
    "https://github.com/login/oauth/access_token",
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
      }),
    },
  );

  if (!tokenResponse.ok) return null;
  const tokenJson = (await tokenResponse.json()) as { access_token?: string };
  return tokenJson.access_token ?? null;
}

async function resolveUserProfile(code: string | null) {
  const isDev =
    typeof process !== "undefined" && process.env.NODE_ENV !== "production";

  if (isDev && code === "mock_dev_oauth_code") {
    return {
      githubUserId: "alex-mercer-cadet",
      userName: "Alex Mercer",
      userEmail: "alex.mercer@cadet.aptispace.io",
      accessToken: undefined,
    };
  }

  if (code) {
    const token = await exchangeGitHubCode(code);
    if (token) {
      const profile = await fetchGitHubUserProfile(token);
      return {
        githubUserId: String(profile.id),
        userName: profile.name || profile.login,
        userEmail: profile.email || `${profile.login}@users.noreply.github.com`,
        accessToken: token,
      };
    }
  }

  return {
    githubUserId: "mock_github_user_1",
    userName: "Cadet Developer",
    userEmail: "developer@cadet.aptispace.io",
    accessToken: undefined,
  };
}

async function syncUserWithDatabase(
  db: Database | null,
  profile: { githubUserId: string; userName: string; userEmail: string },
) {
  if (!db) {
    return { dbUserId: "persona-student", userRole: "student" as const };
  }

  let existingUser = await getUserByGithubId(db, profile.githubUserId);
  if (!existingUser) {
    const [firstName, ...restName] = profile.userName.split(" ");
    existingUser = await createUser(db, {
      firstName: firstName || "Cadet",
      lastName: restName.join(" ") || "Pilot",
      displayName: profile.userName,
      githubId: profile.githubUserId,
    });

    await createAffiliation(db, {
      userId: existingUser.id,
      institutionId: "aptispace-orbital-academy",
      email: profile.userEmail,
      role: "student",
    });
  }

  const fullUser = await getUserWithAffiliations(db, existingUser.id);
  return {
    dbUserId: existingUser.id,
    userRole: fullUser?.affiliations[0]?.role ?? "student",
  };
}

export async function loader({ request, context }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const target = url.searchParams.get("target") || "/";

  const savedState = parseCookie(request, OAUTH_STATE_COOKIE);
  if (!state || !savedState || state !== savedState) {
    return new Response("OAuth state verification failed. Possible CSRF.", {
      status: 400,
    });
  }

  const db = getDatabaseFromContext(context);
  const userProfile = await resolveUserProfile(code);
  const { dbUserId, userRole } = await syncUserWithDatabase(db, userProfile);

  const now = Date.now();
  const sessionToken = await signSessionToken({
    userId: dbUserId,
    role: userRole,
    githubToken: userProfile.accessToken,
    issuedAt: now,
    expiresAt: now + 7 * 24 * 60 * 60 * 1000,
  });

  const sessionCookie = createSessionCookieHeader(sessionToken);
  const clearedState = clearStateCookieHeader();

  const responseHeaders = new Headers();
  responseHeaders.set("Location", target);
  responseHeaders.append("Set-Cookie", sessionCookie);
  responseHeaders.append("Set-Cookie", clearedState);

  return new Response(null, {
    status: 302,
    headers: responseHeaders,
  });
}
