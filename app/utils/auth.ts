export type UserRole = "admin" | "student" | "instructor";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
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

export async function loginWithGitHub(): Promise<void> {
  // Placeholder ready for OAuth backend integration
  const redirectUri = window.location.origin;
  const oauthUrl = `/api/auth/github?redirect_uri=${encodeURIComponent(redirectUri)}`;

  // When backend is connected, this redirects or fetches the auth challenge
  if (
    typeof window !== "undefined" &&
    window.location.pathname.startsWith("/api")
  ) {
    window.location.href = oauthUrl;
    return;
  }

  // Fallback demo toast / simulation until OAuth endpoint is online
  console.warn(
    "GitHub login invoked. Backend OAuth will connect to:",
    oauthUrl,
  );
}

export async function loginAsPersona(personaRole: UserRole): Promise<AuthUser> {
  const matched =
    DEV_PERSONAS.find((p) => p.role === personaRole) ?? DEV_PERSONAS[0];
  const user: AuthUser = {
    id: matched.id,
    name: matched.name,
    email: matched.email,
    role: matched.role,
  };

  // Simulating token persistence / session storage for future backend sync
  if (typeof window !== "undefined") {
    sessionStorage.setItem("aptispace_auth_user", JSON.stringify(user));
  }

  return user;
}
