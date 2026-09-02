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

export function cleanDomain(domain?: string | null): string {
  if (!domain) return "";
  return domain.replace(/^@+/, "").trim().toLowerCase();
}

function validateFreeDomainEmail(
  trimmed: string,
  atCount: number,
): DomainValidationResult {
  if (atCount === 0) {
    return {
      isValid: false,
      localPart: trimmed,
      domain: "",
      fullEmail: trimmed,
      error: "Email must include a valid domain (e.g. user@example.com).",
    };
  }

  const [localPartRaw, domainRaw] = trimmed.split("@");
  const localPart = localPartRaw.trim().toLowerCase();
  const domain = cleanDomain(domainRaw);

  const localPartRegex = /^[a-zA-Z0-9]+([._+-][a-zA-Z0-9]+)*$/;
  if (!localPartRegex.test(localPart)) {
    return {
      isValid: false,
      localPart,
      domain,
      fullEmail: trimmed,
      error:
        "Invalid username format: only alphanumeric characters, periods, underscores, and hyphens are allowed.",
    };
  }

  const domainRegex = /^[a-zA-Z0-9]+([.-][a-zA-Z0-9]+)*\.[a-zA-Z]{2,}$/;
  if (!domainRegex.test(domain)) {
    return {
      isValid: false,
      localPart,
      domain,
      fullEmail: trimmed,
      error: "Invalid email domain format.",
    };
  }

  return {
    isValid: true,
    localPart,
    domain,
    fullEmail: `${localPart}@${domain}`,
  };
}

function validateStrictDomainEmail(
  trimmed: string,
  atCount: number,
  expectedDomain: string,
): DomainValidationResult {
  let localPart = trimmed;
  let submittedDomain = expectedDomain;

  if (atCount === 1) {
    const parts = trimmed.split("@");
    localPart = parts[0].trim();
    submittedDomain = cleanDomain(parts[1]);
  }

  if (submittedDomain !== expectedDomain) {
    return {
      isValid: false,
      localPart,
      domain: submittedDomain,
      fullEmail: `${localPart}@${submittedDomain}`,
      error: `Security Violation: Unauthorized domain '@${submittedDomain}'. Only '@${expectedDomain}' is permitted.`,
    };
  }

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

  const normalizedLocal = localPart.toLowerCase();
  return {
    isValid: true,
    localPart: normalizedLocal,
    domain: expectedDomain,
    fullEmail: `${normalizedLocal}@${expectedDomain}`,
  };
}

/**
 * Validates that an email strictly belongs to the specified required domain.
 * When requiredDomain is empty or null, free domain mode is enabled, allowing
 * any valid email address with any domain (e.g. personal GitHub email).
 */
export function validateFixedDomainEmail(
  email: string | null | undefined,
  requiredDomain?: string | null,
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

  if (!expectedDomain) {
    return validateFreeDomainEmail(trimmed, atCount);
  }

  return validateStrictDomainEmail(trimmed, atCount, expectedDomain);
}

/**
 * Enforces the fixed domain on a local part or raw email input.
 * Strips any tampered domain from the client and strictly appends the specified domain.
 * If requiredDomain is empty or null, returns the raw input trimmed and lowercased.
 */
export function enforceFixedDomainEmail(
  rawInput: string,
  requiredDomain?: string | null,
): string {
  const expectedDomain = cleanDomain(requiredDomain);
  if (!expectedDomain) {
    return rawInput.trim().toLowerCase();
  }
  const local = rawInput.trim().split("@")[0].trim().toLowerCase();
  return `${local}@${expectedDomain}`;
}
