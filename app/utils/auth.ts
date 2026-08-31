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

export const DEV_PERSONAS: readonly PersonaDefinition[] = [];

let inMemoryAccounts: AccountDefinition[] = [];

export function resetInMemoryAccounts(): void {
  inMemoryAccounts = [];
}

export function getInitialFallbackAccounts(): AccountDefinition[] {
  return [...inMemoryAccounts];
}

export function findInMemoryAccount(id: string): AccountDefinition | undefined {
  return inMemoryAccounts.find((a) => a.id === id);
}

function getRoleLabel(role: UserRole): string {
  if (role === "admin") return "Admin";
  if (role === "instructor") return "Instructor";
  return "Student";
}

function getRoleTitle(role: UserRole, isComplete: boolean): string {
  if (!isComplete) return "Onboarding Pending • Unconfigured Profile";
  if (role === "admin") return "System Administrator";
  if (role === "instructor") return "Instructor";
  return "Student";
}

function createInMemoryAccount(
  id: string,
  updates: Partial<AccountDefinition>,
): AccountDefinition {
  const role = updates.role ?? "student";
  const roleLabel = getRoleLabel(role);
  const firstName = (updates.firstName ?? "").trim();
  const lastName = (updates.lastName ?? "").trim().toUpperCase();
  const fullName = `${firstName} ${lastName}`.trim();
  const isComplete = Boolean(updates.isProfileComplete);

  return {
    id,
    name: updates.name || fullName || `New ${roleLabel} (Pending Onboarding)`,
    firstName,
    lastName,
    email: updates.email ?? "",
    role,
    badge: updates.badge ?? roleLabel,
    title: updates.title ?? getRoleTitle(role, isComplete),
    isProfileComplete: isComplete,
    institutionId: updates.institutionId ?? "school-aptitek",
    createdAt: new Date(),
  };
}

function mergeInMemoryAccount(
  existing: AccountDefinition,
  updates: Partial<AccountDefinition>,
): AccountDefinition {
  const firstName = (updates.firstName ?? existing.firstName ?? "").trim();
  const lastName = (updates.lastName ?? existing.lastName ?? "")
    .trim()
    .toUpperCase();
  const fullName = `${firstName} ${lastName}`.trim();
  const isComplete =
    updates.isProfileComplete !== undefined
      ? updates.isProfileComplete
      : Boolean(firstName && lastName);

  return {
    ...existing,
    ...updates,
    firstName,
    lastName,
    name: updates.name ?? (fullName || existing.name),
    isProfileComplete: isComplete,
    title: getRoleTitle(existing.role, isComplete),
  };
}

export function updateInMemoryAccount(
  id: string,
  updates: Partial<AccountDefinition>,
): AccountDefinition {
  const index = inMemoryAccounts.findIndex((a) => a.id === id);
  if (index === -1) {
    const newAcc = createInMemoryAccount(id, updates);
    inMemoryAccounts = [newAcc, ...inMemoryAccounts];
    return newAcc;
  }

  const updated = mergeInMemoryAccount(inMemoryAccounts[index], updates);
  inMemoryAccounts[index] = updated;
  return updated;
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
          Array.isArray(accountsResponse.accounts)
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
      name: "User",
      email: "user@aptitek.io",
      role: session.role,
      impersonating: session.impersonating,
    };
  }

  return null;
}
