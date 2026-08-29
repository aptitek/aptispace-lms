import { describe, it, expect } from "vitest";
import {
  validateFixedDomainEmail,
  enforceFixedDomainEmail,
  cleanDomain,
} from "./emailSecurity";

describe("Fixed Domain Email Security Enforcer", () => {
  it("normalizes required domain cleanly", () => {
    expect(cleanDomain("@aptispace.com")).toBe("aptispace.com");
    expect(cleanDomain("  Cadet.Aptispace.IO  ")).toBe("cadet.aptispace.io");
    expect(cleanDomain("")).toBe("aptispace.com");
  });

  it("validates valid email matching the specified domain", () => {
    const res = validateFixedDomainEmail(
      "alex.mercer@cadet.aptispace.io",
      "cadet.aptispace.io",
    );
    expect(res.isValid).toBe(true);
    expect(res.fullEmail).toBe("alex.mercer@cadet.aptispace.io");
    expect(res.localPart).toBe("alex.mercer");
    expect(res.domain).toBe("cadet.aptispace.io");
  });

  it("validates when only local part is passed for the fixed domain", () => {
    const res = validateFixedDomainEmail(
      "commander.riker",
      "fleet.aptispace.com",
    );
    expect(res.isValid).toBe(true);
    expect(res.fullEmail).toBe("commander.riker@fleet.aptispace.com");
  });

  it("strictly REJECTS any unauthorized or spoofed domains", () => {
    const maliciousAttempts = [
      "alex.mercer@evil.com",
      "cadet@attacker.org",
      "user@gmail.com",
      "spoof@sub.aptispace.com",
      "admin@other-domain.net",
    ];

    for (const attempt of maliciousAttempts) {
      const res = validateFixedDomainEmail(attempt, "aptispace.com");
      expect(res.isValid).toBe(false);
      expect(res.error).toContain("Security Violation: Unauthorized domain");
    }
  });

  it("rejects multiple @ symbols", () => {
    const res = validateFixedDomainEmail(
      "user@evil.com@aptispace.com",
      "aptispace.com",
    );
    expect(res.isValid).toBe(false);
    expect(res.error).toContain("Multiple '@' characters detected");
  });

  it("enforceFixedDomainEmail guarantees only the required domain is produced", () => {
    expect(enforceFixedDomainEmail("cadet@evil.com", "aptispace.com")).toBe(
      "cadet@aptispace.com",
    );
    expect(
      enforceFixedDomainEmail("john.doe@other.org", "cadet.aptispace.io"),
    ).toBe("john.doe@cadet.aptispace.io");
    expect(enforceFixedDomainEmail("pilot", "starfleet.org")).toBe(
      "pilot@starfleet.org",
    );
  });
});
