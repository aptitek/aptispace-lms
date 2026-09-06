import { describe, it, expect, vi, beforeEach } from "vitest";
import React from "react";
import AppLayout, { loader } from "./_app";
import * as sessionServer from "~/utils/session.server";

describe("App Layout Shell", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("redirects to onboarding if profile is incomplete or unauthenticated", async () => {
    vi.spyOn(sessionServer, "authGuard").mockResolvedValue(null);

    const request = new Request("http://localhost:3000/");
    const args = {
      request,
      context: {},
      params: {},
    } as unknown as Parameters<typeof loader>[0];

    let redirectResponse: Response | null = null;
    try {
      await loader(args);
    } catch (response) {
      if (response instanceof Response) {
        redirectResponse = response;
      }
    }

    expect(redirectResponse).not.toBeNull();
    expect(redirectResponse?.status).toBe(302);
    expect(redirectResponse?.headers.get("Location")).toBe("/onboarding");
  });

  it("exports AppLayout component", () => {
    expect(AppLayout).toBeDefined();
    expect(typeof AppLayout).toBe("function");
    const element = React.createElement(AppLayout);
    expect(element).toBeDefined();
  });
});
