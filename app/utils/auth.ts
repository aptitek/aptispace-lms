export type UserRole = "admin" | "student" | "instructor";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  impersonating?: boolean;
  affiliations?: unknown[];
}

export interface PersonaDefinition {
  id: string;
  role: UserRole;
  name: string;
  title: string;
  email: string;
  badge: string;
}

export const DEV_PERSONAS: readonly PersonaDefinition[] = [
  {
    id: "persona-admin",
    role: "admin",
    name: "Dr. Eleanor Vance",
    title: "System Administrator & Lead Instructor",
    email: "admin@aptispace.internal",
    badge: "Admin",
  },
  {
    id: "persona-student",
    role: "student",
    name: "Alex Mercer",
    title: "Enrolled Cadet • Term 02",
    email: "alex.mercer@cadet.aptispace.io",
    badge: "Student",
  },
  {
    id: "persona-instructor",
    role: "instructor",
    name: "Cmdr. Daniel Foster",
    title: "Astrophysics Instructor",
    email: "d.foster@faculty.aptispace.io",
    badge: "Instructor",
  },
] as const;

export function loginWithGitHub(redirectTarget = "/"): void {
  if (typeof window === "undefined") return;
  const targetUrl = `/api/auth/github?redirect_uri=${encodeURIComponent(redirectTarget)}`;
  window.location.href = targetUrl;
}

export async function loginAsPersona(personaRole: UserRole): Promise<AuthUser> {
  const matched =
    DEV_PERSONAS.find((p) => p.role === personaRole) ?? DEV_PERSONAS[0];

  let resolvedUser: AuthUser = {
    id: matched.id,
    name: matched.name,
    email: matched.email,
    role: matched.role,
  };

  if (typeof window !== "undefined" && typeof fetch !== "undefined") {
    try {
      const res = await fetch("/api/auth/impersonate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: personaRole,
          personaId: matched.id,
        }),
      });

      if (res.ok) {
        const responseBody = (await res.json()) as { user?: AuthUser };
        if (responseBody.user) {
          resolvedUser = responseBody.user;
        }
      }
    } catch {
      // Fallback cleanly if running offline or in tests
    }

    sessionStorage.setItem("aptispace_auth_user", JSON.stringify(resolvedUser));
  }

  return resolvedUser;
}

export async function logout(): Promise<void> {
  if (typeof window !== "undefined") {
    sessionStorage.removeItem("aptispace_auth_user");
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      // Offline fallback
    }
    window.location.href = "/";
  }
}

export async function getStoredUser(): Promise<AuthUser | null> {
  if (typeof window === "undefined") return null;

  try {
    const raw = sessionStorage.getItem("aptispace_auth_user");
    if (raw) {
      return JSON.parse(raw) as AuthUser;
    }

    // Try fetching from server session
    const res = await fetch("/api/auth?action=me");
    if (res.ok) {
      const responseBody = (await res.json()) as { user?: AuthUser };
      if (responseBody.user) {
        sessionStorage.setItem(
          "aptispace_auth_user",
          JSON.stringify(responseBody.user),
        );
        return responseBody.user;
      }
    }
  } catch {
    return null;
  }
  return null;
}
