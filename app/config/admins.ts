/**
 * List of default GitHub usernames granted administrator privileges by default.
 */
export const DEFAULT_ADMIN_GITHUB_USERNAMES: readonly string[] = [
  "aptitek",
] as const;

export type AdminGithubUsername =
  (typeof DEFAULT_ADMIN_GITHUB_USERNAMES)[number];

/**
 * Retrieves the full list of admin GitHub usernames, merging default usernames
 * with any configured in environment variables (e.g. comma/space separated list).
 *
 * @param envOverride - Optional environment string for testing or runtime overrides
 * @returns Array of normalized lowercase admin usernames
 */
export function getAdminGithubUsernames(envOverride?: string): string[] {
  const adminSet = new Set<string>(
    DEFAULT_ADMIN_GITHUB_USERNAMES.map((username) => username.toLowerCase()),
  );

  const envValue =
    envOverride ??
    (typeof process !== "undefined" && process.env?.ADMIN_GITHUB_USERNAMES
      ? process.env.ADMIN_GITHUB_USERNAMES
      : undefined);

  if (envValue) {
    const customUsernames = envValue
      .split(/[,\s]+/)
      .map((entry) => entry.trim().toLowerCase())
      .filter((entry) => entry.length > 0);

    for (const customUsername of customUsernames) {
      adminSet.add(customUsername);
    }
  }

  return Array.from(adminSet);
}

/**
 * Determines whether a given GitHub username matches an administrator account.
 * Comparison is case-insensitive and trims surrounding whitespace.
 *
 * @param username - The GitHub login/username to verify
 * @param envOverride - Optional environment string override
 * @returns True if the user is an admin, false otherwise
 */
export function isAdminGithubUser(
  username?: string | null,
  envOverride?: string,
): boolean {
  if (!username) {
    return false;
  }

  const normalized = username.trim().toLowerCase();
  if (!normalized) {
    return false;
  }

  const adminUsernames = getAdminGithubUsernames(envOverride);
  return adminUsernames.includes(normalized);
}

/**
 * Checks if the given username is present in the built-in hardcoded default admin list.
 *
 * @param username - The GitHub username to check
 * @returns True if included in DEFAULT_ADMIN_GITHUB_USERNAMES
 */
export function isDefaultAdminGithubUser(username?: string | null): boolean {
  if (!username) {
    return false;
  }

  const normalized = username.trim().toLowerCase();
  return DEFAULT_ADMIN_GITHUB_USERNAMES.some(
    (defaultAdmin) => defaultAdmin.toLowerCase() === normalized,
  );
}
