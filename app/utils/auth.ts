export type UserRole = "admin" | "student" | "instructor";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  impersonating?: boolean;
  affiliations?: unknown[];
  isProfileComplete?: boolean;
}

export interface PersonaDefinition {
  id: string;
  role: UserRole;
  name: string;
  title: string;
  email: string;
  badge: string;
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

let inMemoryAccounts: AccountDefinition[] = DEV_PERSONAS.map((p) => ({
  id: p.id,
  name: p.name,
  firstName: p.name.split(" ")[0] || "",
  lastName: p.name.split(" ").slice(1).join(" ") || "",
  email: p.email,
  role: p.role,
  badge: p.badge,
  title: p.title,
  isProfileComplete: true,
}));

export function getInitialFallbackAccounts(): AccountDefinition[] {
  return [...inMemoryAccounts];
}

export async function fetchAccountsFromDb(): Promise<AccountDefinition[]> {
  if (typeof window !== "undefined" && typeof fetch !== "undefined") {
    try {
      const res = await fetch("/api/auth?action=accounts");
      if (res.ok) {
        const accountsResponse = (await res.json()) as {
          accounts?: AccountDefinition[];
        };
        if (
          accountsResponse.accounts &&
          Array.isArray(accountsResponse.accounts) &&
          accountsResponse.accounts.length > 0
        ) {
          inMemoryAccounts = accountsResponse.accounts;
          return accountsResponse.accounts;
        }
      }
    } catch {
      // Fallback cleanly to in-memory store
    }
  }
  return inMemoryAccounts;
}

export async function createAccountInDb(
  role: UserRole,
): Promise<AccountDefinition> {
  if (typeof window !== "undefined" && typeof fetch !== "undefined") {
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "createAccount", role }),
      });
      if (res.ok) {
        const createResponse = (await res.json()) as {
          account?: AccountDefinition;
        };
        if (createResponse.account) {
          inMemoryAccounts = [createResponse.account, ...inMemoryAccounts];
          return createResponse.account;
        }
      }
    } catch {
      // Fallback
    }
  }

  // In-memory fallback (e.g. Storybook / offline)
  const roleLabel =
    role === "admin"
      ? "Admin"
      : role === "instructor"
        ? "Instructor"
        : "Student";
  const newMockAccount: AccountDefinition = {
    id: `mock-${role}-${Date.now().toString(36)}`,
    name: `New ${roleLabel} (Pending Onboarding)`,
    firstName: "",
    lastName: "",
    email: "",
    role,
    badge: roleLabel,
    title: "Onboarding Pending • Unconfigured Profile",
    isProfileComplete: false,
    createdAt: new Date(),
  };

  inMemoryAccounts = [newMockAccount, ...inMemoryAccounts];
  return newMockAccount;
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
    try {
      const res = await fetch("/api/auth/impersonate", {
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
      }
    } catch {
      // Fallback cleanly if running offline or in tests
    }

    sessionStorage.setItem("aptispace_auth_user", JSON.stringify(resolvedUser));
  }

  return resolvedUser;
}

export async function loginAsPersona(personaRole: UserRole): Promise<AuthUser> {
  const matched =
    DEV_PERSONAS.find((p) => p.role === personaRole) ?? DEV_PERSONAS[0];

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

export interface ResolveActiveUserDbParam {
  id: string;
  firstName?: string | null;
  lastName?: string | null;
  displayName?: string | null;
  email?: string | null;
  role?: UserRole;
  avatarUrl?: string | null;
  affiliations?: Array<{
    email?: string | null;
    role?: UserRole;
    avatarUrl?: string | null;
  }>;
}

function resolveDbUserName(dbUser: ResolveActiveUserDbParam): string {
  if (dbUser.displayName) return dbUser.displayName;
  const first = dbUser.firstName || "";
  const last = dbUser.lastName || "";
  const combined = `${first} ${last}`.trim();
  return combined || "Cadet User";
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
  return dbUser.affiliations?.[0]?.email ?? dbUser.email ?? "";
}

function mapDbUserToAuth(
  dbUser: ResolveActiveUserDbParam,
  session?: { role?: UserRole; impersonating?: boolean } | null,
): AuthUser {
  const primaryAffil = dbUser.affiliations?.[0];
  return {
    id: dbUser.id,
    name: resolveDbUserName(dbUser),
    email: resolveDbUserEmail(dbUser),
    role: resolveDbUserRole(dbUser, session?.role),
    avatarUrl: primaryAffil?.avatarUrl ?? dbUser.avatarUrl ?? undefined,
    impersonating: session?.impersonating,
  };
}

export function resolveActiveUser(
  dbUser?: ResolveActiveUserDbParam | null,
  session?: {
    userId: string;
    role: UserRole;
    impersonating?: boolean;
  } | null,
): AuthUser | null {
  if (dbUser) {
    return mapDbUserToAuth(dbUser, session);
  }

  if (session) {
    return {
      id: session.userId,
      name: "Cadet User",
      email: "user@aptispace.io",
      role: session.role,
      impersonating: session.impersonating,
    };
  }

  return null;
}
