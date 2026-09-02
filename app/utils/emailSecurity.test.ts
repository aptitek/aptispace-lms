import { describe, it, expect } from "vitest";
import {
  validateFixedDomainEmail,
  enforceFixedDomainEmail,
  cleanDomain,
} from "./emailSecurity";

describe("Fixed & Free Domain Email Security Enforcer", () => {
  it("normalizes required domain cleanly", () => {
    expect(cleanDomain("@aptitek.io")).toBe("aptitek.io");
    expect(cleanDomain("  Student.Aptitek.IO  ")).toBe("student.aptitek.io");
    expect(cleanDomain("")).toBe("");
    expect(cleanDomain(null)).toBe("");
    expect(cleanDomain(undefined)).toBe("");
  });

  describe("Fixed Domain Mode", () => {
    it("validates valid email matching the specified domain", () => {
      const res = validateFixedDomainEmail("john.doe@aptitek.io", "aptitek.io");
      expect(res.isValid).toBe(true);
      expect(res.fullEmail).toBe("john.doe@aptitek.io");
      expect(res.localPart).toBe("john.doe");
      expect(res.domain).toBe("aptitek.io");
    });

    it("validates when only local part is passed for the fixed domain", () => {
      const res = validateFixedDomainEmail("alex.smith", "aptitek.io");
      expect(res.isValid).toBe(true);
      expect(res.fullEmail).toBe("alex.smith@aptitek.io");
    });

    it("strictly REJECTS any unauthorized or spoofed domains", () => {
      const maliciousAttempts = [
        "user@evil.com",
        "user@attacker.org",
        "user@gmail.com",
        "spoof@sub.aptitek.io",
        "admin@other-domain.net",
      ];

      for (const attempt of maliciousAttempts) {
        const res = validateFixedDomainEmail(attempt, "aptitek.io");
        expect(res.isValid).toBe(false);
        expect(res.error).toContain("Security Violation: Unauthorized domain");
      }
    });

    it("rejects multiple @ symbols", () => {
      const res = validateFixedDomainEmail(
        "user@evil.com@aptitek.io",
        "aptitek.io",
      );
      expect(res.isValid).toBe(false);
      expect(res.error).toContain("Multiple '@' characters detected");
    });

    it("enforceFixedDomainEmail guarantees only the required domain is produced", () => {
      expect(enforceFixedDomainEmail("user@evil.com", "aptitek.io")).toBe(
        "user@aptitek.io",
      );
      expect(enforceFixedDomainEmail("john.doe@other.org", "aptitek.io")).toBe(
        "john.doe@aptitek.io",
      );
      expect(enforceFixedDomainEmail("admin", "aptitek.io")).toBe(
        "admin@aptitek.io",
      );
    });
  });

  describe("Free Domain Mode (empty institution domain)", () => {
    it("allows personal email addresses with any valid domain", () => {
      const validEmails = [
        "alex@gmail.com",
        "john.doe@yahoo.fr",
        "dev+test@github.com",
        "student@university.edu",
        "user@company.co.uk",
      ];

      for (const email of validEmails) {
        const res = validateFixedDomainEmail(email, "");
        expect(res.isValid).toBe(true);
        expect(res.fullEmail).toBe(email.toLowerCase());
      }
    });

    it("works when requiredDomain is null or undefined", () => {
      const resNull = validateFixedDomainEmail("user@gmail.com", null);
      expect(resNull.isValid).toBe(true);
      expect(resNull.fullEmail).toBe("user@gmail.com");

      const resUndef = validateFixedDomainEmail("user@gmail.com", undefined);
      expect(resUndef.isValid).toBe(true);
      expect(resUndef.fullEmail).toBe("user@gmail.com");
    });

    it("rejects invalid email formats in free domain mode", () => {
      expect(validateFixedDomainEmail("nodomain", "").isValid).toBe(false);
      expect(validateFixedDomainEmail("user@localhost", "").isValid).toBe(
        false,
      );
      expect(validateFixedDomainEmail("user@domain", "").isValid).toBe(false);
      expect(
        validateFixedDomainEmail("user@evil@attacker.com", "").isValid,
      ).toBe(false);
      expect(validateFixedDomainEmail("", "").isValid).toBe(false);
    });

    it("enforceFixedDomainEmail preserves raw email when requiredDomain is empty", () => {
      expect(enforceFixedDomainEmail("Alex@Gmail.com", "")).toBe(
        "alex@gmail.com",
      );
      expect(enforceFixedDomainEmail("user@custom.org", undefined)).toBe(
        "user@custom.org",
      );
    });
  });
});
