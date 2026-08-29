/**
 * Security validation utility to enforce fixed domains on email addresses.
 * Prevents clients from tampering with or submitting unauthorized domains.
 */

export interface DomainValidationResult {
  isValid: boolean;
  localPart: string;
  domain: string;
  fullEmail: string;
  error?: string;
}

export function cleanDomain(domain?: string): string {
  if (!domain) return "aptispace.com";
  return domain.replace(/^@+/, "").trim().toLowerCase();
}

/**
 * Validates that an email strictly belongs to the specified required domain.
 * Throws or returns an error if any other domain is set.
 */
export function validateFixedDomainEmail(
  email: string | null | undefined,
  requiredDomain = "aptispace.com",
): DomainValidationResult {
  const expectedDomain = cleanDomain(requiredDomain);

  if (!email || typeof email !== "string" || email.trim().length === 0) {
    return {
      isValid: false,
      localPart: "",
      domain: expectedDomain,
      fullEmail: "",
      error: "Email address is required.",
    };
  }

  const trimmed = email.trim();
  const atCount = (trimmed.match(/@/g) || []).length;

  if (atCount > 1) {
    return {
      isValid: false,
      localPart: "",
      domain: expectedDomain,
      fullEmail: "",
      error: "Security Violation: Multiple '@' characters detected.",
    };
  }

  let localPart = trimmed;
  let submittedDomain = expectedDomain;

  if (atCount === 1) {
    const parts = trimmed.split("@");
    localPart = parts[0].trim();
    submittedDomain = cleanDomain(parts[1]);
  }

  // Enforce that submitted domain strictly matches the specified domain
  if (submittedDomain !== expectedDomain) {
    return {
      isValid: false,
      localPart,
      domain: submittedDomain,
      fullEmail: `${localPart}@${submittedDomain}`,
      error: `Security Violation: Unauthorized domain '@${submittedDomain}'. Only '@${expectedDomain}' is permitted.`,
    };
  }

  // Validate local part identifier format
  const localPartRegex = /^[a-zA-Z0-9]+([._-][a-zA-Z0-9]+)*$/;
  if (!localPartRegex.test(localPart)) {
    return {
      isValid: false,
      localPart,
      domain: expectedDomain,
      fullEmail: `${localPart}@${expectedDomain}`,
      error:
        "Invalid username format: only alphanumeric characters, periods, underscores, and hyphens are allowed.",
    };
  }

  const fullEmail = `${localPart.toLowerCase()}@${expectedDomain}`;

  return {
    isValid: true,
    localPart: localPart.toLowerCase(),
    domain: expectedDomain,
    fullEmail,
  };
}

/**
 * Enforces the fixed domain on a local part or raw email input.
 * Strips any tampered domain from the client and strictly appends the specified domain.
 */
export function enforceFixedDomainEmail(
  rawInput: string,
  requiredDomain = "aptispace.com",
): string {
  const expectedDomain = cleanDomain(requiredDomain);
  const local = rawInput.trim().split("@")[0].trim().toLowerCase();
  return `${local}@${expectedDomain}`;
}
