/**
 * Utility for institution username & email pattern formatting and generation.
 *
 * Supports token syntax for username formatting:
 * - `{first}` or `{firstname}`: Full sanitized first name (e.g., "john")
 * - `{last}` or `{lastname}`: Full sanitized last name (e.g., "doe")
 * - `{first:N}` or `{firstname:N}` or `{f}`: First N characters of first name (e.g., `{first:1}` -> "j")
 * - `{last:N}` or `{lastname:N}` or `{l}`: First N characters of last name (e.g., `{last:3}` -> "doe")
 */

export const DEFAULT_USERNAME_PATTERN = "{first}.{last}";
export const DEFAULT_EMAIL_DOMAIN = "aptitek.io";

export function sanitizeNamePart(name?: string | null): string {
  if (!name) return "";
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove accents/diacritics
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9-]/g, ""); // Keep only alphanumeric & hyphens
}

export function cleanDomainName(domain?: string | null): string {
  if (!domain) return "";
  return domain.trim().toLowerCase().replace(/^@+/, "");
}

function resolveFirstToken(first: string, lenStr?: string): string {
  if (!first) return "";
  if (!lenStr) return first;
  const num = parseInt(lenStr, 10);
  return isNaN(num) || num <= 0 ? first : first.slice(0, num);
}

function resolveLastToken(last: string, lenStr?: string): string {
  if (!last) return "";
  if (!lenStr) return last;
  const num = parseInt(lenStr, 10);
  return isNaN(num) || num <= 0 ? last : last.slice(0, num);
}

/**
 * Generates the username (email prefix) from firstName and lastName using a pattern template.
 */
export function generateUsernameFromPattern({
  firstName = "",
  lastName = "",
  pattern = DEFAULT_USERNAME_PATTERN,
}: {
  firstName?: string;
  lastName?: string;
  pattern?: string;
}): string {
  const cleanFirst = sanitizeNamePart(firstName);
  const cleanLast = sanitizeNamePart(lastName);
  const rawPattern = (pattern || DEFAULT_USERNAME_PATTERN).trim();

  // If pattern has "@", take only the username prefix part
  const patternPrefix =
    rawPattern.split("@")[0].trim() || DEFAULT_USERNAME_PATTERN;

  let result = patternPrefix
    // Replace {f} shorthand
    .replace(/\{f\}/gi, resolveFirstToken(cleanFirst, "1"))
    // Replace {l} shorthand
    .replace(/\{l\}/gi, resolveLastToken(cleanLast, "1"))
    // Replace {first:N} or {firstname:N}
    .replace(/\{(?:first|firstname):(\d+)\}/gi, (_, len) =>
      resolveFirstToken(cleanFirst, len),
    )
    // Replace {last:N} or {lastname:N}
    .replace(/\{(?:last|lastname):(\d+)\}/gi, (_, len) =>
      resolveLastToken(cleanLast, len),
    )
    // Replace {first} or {firstname}
    .replace(/\{(?:first|firstname)\}/gi, cleanFirst)
    // Replace {last} or {lastname}
    .replace(/\{(?:last|lastname)\}/gi, cleanLast);

  // Clean trailing/leading separators or multiple dots/underscores if names are partially empty
  result = result
    .replace(/^[._-]+|[._-]+$/g, "")
    .replace(/[._-]{2,}/g, (m) => m[0]);

  return result;
}

/**
 * Generates the full institutional email address from names, pattern, and domain.
 */
export function generateEmailFromPattern({
  firstName = "",
  lastName = "",
  usernamePattern = DEFAULT_USERNAME_PATTERN,
  domain = DEFAULT_EMAIL_DOMAIN,
}: {
  firstName?: string;
  lastName?: string;
  usernamePattern?: string;
  domain?: string;
}): string {
  const username = generateUsernameFromPattern({
    firstName,
    lastName,
    pattern: usernamePattern,
  });
  const cleanDomain = cleanDomainName(domain);

  if (!username) return "";
  return cleanDomain ? `${username}@${cleanDomain}` : username;
}

/**
 * Generates a preview object with sample "john" and "doe" for inspector UI.
 */
export function formatUsernameSamplePreview(
  usernamePattern?: string,
  domain?: string,
): { username: string; email: string } {
  const sampleFirst = "John";
  const sampleLast = "Doe";
  const username = generateUsernameFromPattern({
    firstName: sampleFirst,
    lastName: sampleLast,
    pattern: usernamePattern || DEFAULT_USERNAME_PATTERN,
  });
  const cleanDomain = cleanDomainName(domain) || DEFAULT_EMAIL_DOMAIN;
  const email = `${username}@${cleanDomain}`;

  return { username, email };
}
