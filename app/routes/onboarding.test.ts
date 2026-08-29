import { describe, it, expect, vi } from "vitest";
import type { ReactNode } from "react";

vi.mock("~/components/templates/AuthLayout/AuthLayout", () => ({
  default: ({ children }: { children: ReactNode }) => children,
}));

vi.mock("~/components/molecules/Id1Card/Id1Card", () => ({
  default: () => null,
}));

vi.mock("~/components/molecules/EditableAvatar/EditableAvatar", () => ({
  default: () => null,
}));

import { action, CADET_FIXED_DOMAIN } from "./onboarding";

function createActionArgs(request: Request) {
  return {
    request,
    context: {},
    params: {},
  } as unknown as Parameters<typeof action>[0];
}

describe("Onboarding Route Security - Fixed Domain Enforcement", () => {
  it("defines the secure CADET_FIXED_DOMAIN constant", () => {
    expect(CADET_FIXED_DOMAIN).toBe("cadet.aptispace.io");
  });

  it("successfully accepts cadet emails matching the authorized fixed domain", async () => {
    const formData = new FormData();
    formData.set("email", "cadet.mercer@cadet.aptispace.io");

    const request = new Request("http://localhost:3000/onboarding", {
      method: "POST",
      body: formData,
    });

    const response = await action(createActionArgs(request));

    expect(response.status).toBe(200);
    const body = (await response.json()) as { success: boolean; email: string };
    expect(body.success).toBe(true);
    expect(body.email).toBe("cadet.mercer@cadet.aptispace.io");
  });

  it("strictly REJECTS submissions with unauthorized or tampered domains", async () => {
    const maliciousDomains = [
      "cadet.mercer@evil.com",
      "hacker@attacker.org",
      "cadet@gmail.com",
      "cadet@aptispace.com", // even main domain is rejected if not the cadet fixed subdomain
      "spoof@sub.cadet.aptispace.io",
    ];

    for (const email of maliciousDomains) {
      const formData = new FormData();
      formData.set("email", email);

      const request = new Request("http://localhost:3000/onboarding", {
        method: "POST",
        body: formData,
      });

      const response = await action(createActionArgs(request));

      expect(response.status).toBe(400);
      const body = (await response.json()) as { code: string; error: string };
      expect(body.code).toBe("UNAUTHORIZED_EMAIL_DOMAIN");
      expect(body.error).toContain("Security Violation: Unauthorized domain");
    }
  });

  it("accepts bare username prefix and formats it with the authorized domain", async () => {
    const formData = new FormData();
    formData.set("email", "pilot.vance");

    const request = new Request("http://localhost:3000/onboarding", {
      method: "POST",
      body: formData,
    });

    const response = await action(createActionArgs(request));

    expect(response.status).toBe(200);
    const body = (await response.json()) as { success: boolean; email: string };
    expect(body.success).toBe(true);
    expect(body.email).toBe("pilot.vance@cadet.aptispace.io");
  });
});
