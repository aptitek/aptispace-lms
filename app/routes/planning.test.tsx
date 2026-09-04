import { describe, it, expect, vi, beforeEach } from "vitest";
import React from "react";
import Planning, { meta, loader } from "./planning";
import * as sessionServer from "~/utils/session.server";

describe("Planning Route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns correct metadata", () => {
    const metaTags = meta();
    expect(metaTags).toEqual([
      { title: "AptiSpace LMS • Planning & Timetable" },
      {
        name: "description",
        content:
          "Interactive academic planning, lectures, labs, and cohort timetables.",
      },
    ]);
  });

  it("redirects to onboarding if profile is incomplete or unauthenticated", async () => {
    vi.spyOn(sessionServer, "authGuard").mockResolvedValue(null);

    const request = new Request("http://localhost:3000/planning");
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

  it("exports Planning component", () => {
    expect(Planning).toBeDefined();
    expect(typeof Planning).toBe("function");
    const element = React.createElement(Planning);
    expect(element).toBeDefined();
  });
});
