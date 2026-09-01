import { describe, it, expect } from "vitest";
import { GithubHandle, formatGithubUsername } from "./GithubHandle";

describe("GithubHandle Atom Component", () => {
  it("exports GithubHandle component properly", () => {
    expect(GithubHandle).toBeDefined();
    expect(typeof GithubHandle).toBe("object"); // forwardRef component
    expect(GithubHandle.displayName).toBe("GithubHandle");
  });

  it("formats username properly with @ prefix", () => {
    expect(formatGithubUsername("aptitek")).toBe("@aptitek");
    expect(formatGithubUsername("@octocat")).toBe("@octocat");
    expect(formatGithubUsername("")).toBe("@cadet");
    expect(formatGithubUsername(null)).toBe("@cadet");
    expect(formatGithubUsername(undefined)).toBe("@cadet");
    expect(formatGithubUsername("   ")).toBe("@cadet");
  });
});
