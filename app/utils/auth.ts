import type { CohortConfig } from "../types/institution";

export type UserRole = "admin" | "student" | "instructor";

export interface AuthUser {
  id: string;
  name: string;
  firstName?: string;
  familyName?: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  impersonating?: boolean;
  originalUserId?: string;
  affiliations?: unknown[];
  isProfileComplete?: boolean;
  githubUsername?: string;
  githubEmail?: string;
  institutionName?: string;
  schoolLogoUrl?: string;
  emailDomain?: string;
  usernamePattern?: string;
  cohort?: CohortConfig;
  cohortYear?: string;
}

export interface PersonaDefinition {
  id: string;
  role: UserRole;
  name: string;
  title: string;
  email: string;
  badge: string;
  githubUsername?: string;
}

export interface AccountDefinition {
  id: string;
  name: string;
  firstName?: string;
  lastName?: string;
  email: string;
  role: UserRole;
  badge: string;
  title: string;
  isProfileComplete?: boolean;
  createdAt?: string | Date;
  institutionId?: string;
  cohortId?: string | null;
  githubUsername?: string;
}

export const DEV_PERSONAS: readonly PersonaDefinition[] = [
  {
    id: "dev-admin",
    role: "admin",
    name: "Admin User",
    email: "admin@aptitek.io",
    title: "System Administrator",
    badge: "Admin",
  },
  {
    id: "dev-instructor",
    role: "instructor",
    name: "Instructor User",
    email: "instructor@aptitek.io",
    title: "Instructor",
    badge: "Instructor",
  },
  {
    id: "dev-student",
    role: "student",
    name: "Student User",
    email: "student@aptitek.io",
    title: "Student",
    badge: "Student",
  },
];

export function getRoleLabel(role: UserRole): string {
  if (role === "admin") return "Admin";
  if (role === "instructor") return "Instructor";
  return "Student";
}

export function getRoleTitle(role: UserRole, isComplete: boolean): string {
  if (!isComplete) return "Onboarding Pending • Unconfigured Profile";
  if (role === "admin") return "System Administrator";
  if (role === "instructor") return "Instructor";
  return "Student";
}

async function tryFetchAccounts(
  url: string,
): Promise<AccountDefinition[] | null> {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const responsePayload = (await res.json()) as {
      accounts?: AccountDefinition[];
      users?: AccountDefinition[];
      personas?: AccountDefinition[];
    };
    const list =
      responsePayload.accounts ||
      responsePayload.users ||
      responsePayload.personas;
    return Array.isArray(list) ? list : null;
  } catch {
    return null;
  }
}

export async function fetchAccountsFromDb(): Promise<AccountDefinition[]> {
  if (typeof fetch === "undefined") return [];

  const devAccounts = await tryFetchAccounts("/api/dev/personas");
  if (devAccounts) return devAccounts;

  const usersAccounts = await tryFetchAccounts("/api/users");
  return usersAccounts ?? [];
}

async function tryCreateAccount(
  url: string,
  role: UserRole,
): Promise<AccountDefinition | null> {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role }),
    });
    if (!res.ok) return null;
    const responsePayload = (await res.json()) as {
      account?: AccountDefinition;
      user?: AccountDefinition;
      persona?: AccountDefinition;
    };
    return (
      responsePayload.account ||
      responsePayload.user ||
      responsePayload.persona ||
      null
    );
  } catch {
    return null;
  }
}

export async function createAccountInDb(
  role: UserRole,
): Promise<AccountDefinition | null> {
  if (typeof fetch === "undefined") return null;

  const devCreated = await tryCreateAccount("/api/dev/personas", role);
  if (devCreated) return devCreated;

  return tryCreateAccount("/api/users", role);
}

export function loginWithGitHub(redirectTarget = "/"): void {
  if (typeof window === "undefined") return;
  const targetUrl = `/api/auth/github?redirect_uri=${encodeURIComponent(redirectTarget)}`;
  window.location.href = targetUrl;
}

export async function loginAsAccount(
  account: Pick<AccountDefinition, "id" | "role" | "name" | "email">,
): Promise<AuthUser> {
  let resolvedUser: AuthUser = {
    id: account.id,
    name: account.name,
    email: account.email,
    role: account.role,
  };

  if (typeof window !== "undefined" && typeof fetch !== "undefined") {
    const res = await fetch("/api/dev/impersonate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: account.id,
        role: account.role,
      }),
    });

    if (res.ok) {
      const responseBody = (await res.json()) as { user?: AuthUser };
      if (responseBody.user) {
        resolvedUser = responseBody.user;
      }
    } else {
      const errorData = (await res.json().catch(() => ({}))) as {
        error?: string;
        errorCode?: string;
      };
      const error = new Error(
        errorData.error || errorData.errorCode || "Impersonation failed",
      );
      Object.assign(error, {
        statusCode: res.status,
        errorCode: errorData.errorCode,
      });
      throw error;
    }

    sessionStorage.setItem("aptispace_auth_user", JSON.stringify(resolvedUser));
  }

  return resolvedUser;
}

export async function stopImpersonation(): Promise<AuthUser | null> {
  let resolvedUser: AuthUser | null = null;
  if (typeof window !== "undefined" && typeof fetch !== "undefined") {
    const res = await fetch("/api/dev/impersonate", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });

    if (res.ok) {
      const responseBody = (await res.json()) as { user?: AuthUser };
      if (responseBody.user) {
        resolvedUser = responseBody.user;
        sessionStorage.setItem(
          "aptispace_auth_user",
          JSON.stringify(resolvedUser),
        );
      }
    } else {
      const errorData = (await res.json().catch(() => ({}))) as {
        error?: string;
        errorCode?: string;
      };
      const error = new Error(
        errorData.error || errorData.errorCode || "Stop impersonation failed",
      );
      Object.assign(error, {
        statusCode: res.status,
        errorCode: errorData.errorCode,
      });
      throw error;
    }

    window.location.href = "/admin";
  }

  return resolvedUser;
}

export async function loginAsPersona(personaRole: UserRole): Promise<AuthUser> {
  const matched = DEV_PERSONAS.find((p) => p.role === personaRole) ?? {
    id: `dev-${personaRole}`,
    role: personaRole,
    name: `${personaRole.charAt(0).toUpperCase() + personaRole.slice(1)} User`,
    email: `${personaRole}@aptitek.io`,
    title: `${personaRole.charAt(0).toUpperCase() + personaRole.slice(1)}`,
    badge: `${personaRole.charAt(0).toUpperCase() + personaRole.slice(1)}`,
  };

  return loginAsAccount({
    id: matched.id,
    role: matched.role,
    name: matched.name,
    email: matched.email,
  });
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
    const res = await fetch("/api/session");
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

export interface ResolveActiveUserDbParam {
  id: string;
  firstName?: string | null;
  lastName?: string | null;
  displayName?: string | null;
  email?: string | null;
  role?: UserRole;
  avatarUrl?: string | null;
  githubId?: string | null;
  githubEmail?: string | null;
  affiliations?: Array<{
    email?: string | null;
    role?: UserRole;
    avatarUrl?: string | null;
    institution?: {
      id?: string;
      name?: string;
      slug?: string;
      logoUrl?: string | null;
      emailDomain?: string | null;
      usernamePattern?: string | null;
    } | null;
    cohort?: {
      id: string;
      diploma?: string | null;
      year?: number | null;
      tags?: string[] | null;
      name?: string | null;
      startDate?: Date | number | string | null;
    } | null;
  }>;
}

function resolveDbUserName(dbUser: ResolveActiveUserDbParam): string {
  if (dbUser.displayName) return dbUser.displayName;
  const first = dbUser.firstName?.trim() || "";
  const last = (dbUser.lastName || "").trim().toUpperCase();
  const combined = `${first} ${last}`.trim();
  return combined || "User";
}

function resolveDbUserRole(
  dbUser: ResolveActiveUserDbParam,
  sessionRole?: UserRole,
): UserRole {
  return (
    dbUser.affiliations?.[0]?.role ?? sessionRole ?? dbUser.role ?? "student"
  );
}

function resolveDbUserEmail(dbUser: ResolveActiveUserDbParam): string {
  return (
    dbUser.affiliations?.[0]?.email || dbUser.githubEmail || dbUser.email || ""
  );
}

type AffiliationItem = NonNullable<
  ResolveActiveUserDbParam["affiliations"]
>[number];

function resolveDbCohortYear(
  startDate?: Date | number | string | null,
): string {
  if (!startDate) return "2026";
  return String(new Date(startDate).getFullYear());
}

function resolveDbAffilCohort(
  primaryAffil?: AffiliationItem,
): CohortConfig | undefined {
  const cohort = primaryAffil?.cohort;
  if (!cohort) return undefined;
  return {
    id: cohort.id,
    name: cohort.name ?? undefined,
    diploma: cohort.diploma ?? undefined,
    year: cohort.year ?? undefined,
    tags: cohort.tags ?? undefined,
  };
}

function resolveDbInstitutionMetadata(primaryAffil?: AffiliationItem) {
  const institution = primaryAffil?.institution;
  return {
    institutionName: institution?.name,
    schoolLogoUrl: institution?.logoUrl || undefined,
    emailDomain: institution?.emailDomain || "",
    usernamePattern: institution?.usernamePattern || undefined,
  };
}

function resolveDbUserNames(dbUser: ResolveActiveUserDbParam) {
  const firstName = dbUser.firstName ? dbUser.firstName.trim() : undefined;
  const familyName = dbUser.lastName
    ? dbUser.lastName.trim().toUpperCase()
    : undefined;
  return { firstName, familyName };
}

function resolveDbUserAvatar(
  primaryAffil?: AffiliationItem,
  fallbackAvatar?: string | null,
  githubId?: string | null,
): string | undefined {
  return (
    fallbackAvatar ||
    primaryAffil?.avatarUrl ||
    (githubId
      ? `https://avatars.githubusercontent.com/u/${githubId}?v=4`
      : undefined)
  );
}

function mapDbUserToAuth(
  dbUser: ResolveActiveUserDbParam,
  session?: {
    role?: UserRole;
    impersonating?: boolean;
    originalUserId?: string;
  } | null,
): AuthUser {
  const primaryAffil = dbUser.affiliations?.[0];
  const cohort = resolveDbAffilCohort(primaryAffil);
  const cohortYear = resolveDbCohortYear(primaryAffil?.cohort?.startDate);
  const instMeta = resolveDbInstitutionMetadata(primaryAffil);
  const names = resolveDbUserNames(dbUser);
  const avatarUrl = resolveDbUserAvatar(
    primaryAffil,
    dbUser.avatarUrl,
    dbUser.githubId,
  );

  return {
    id: dbUser.id,
    name: resolveDbUserName(dbUser),
    firstName: names.firstName,
    familyName: names.familyName,
    email: resolveDbUserEmail(dbUser),
    role: resolveDbUserRole(dbUser, session?.role),
    avatarUrl,
    impersonating: session?.impersonating,
    originalUserId: session?.originalUserId,
    githubUsername: dbUser.githubId ?? undefined,
    githubEmail: dbUser.githubEmail ?? undefined,
    ...instMeta,
    cohort,
    cohortYear,
  };
}

export function resolveActiveUser(
  dbUser?: ResolveActiveUserDbParam | null,
  session?: {
    userId: string;
    role: UserRole;
    impersonating?: boolean;
    originalUserId?: string;
  } | null,
): AuthUser | null {
  if (dbUser) {
    return mapDbUserToAuth(dbUser, session);
  }

  if (session) {
    return {
      id: session.userId,
      name: "User",
      email: "user@aptitek.io",
      role: session.role,
      impersonating: session.impersonating,
      originalUserId: session.originalUserId,
    };
  }

  return null;
}
