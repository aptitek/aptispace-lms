import { describe, it, expect, beforeEach, afterEach } from "vitest";
import {
  DEFAULT_ADMIN_GITHUB_USERNAMES,
  isAdminGithubUser,
  isDefaultAdminGithubUser,
  getAdminGithubUsernames,
} from "./admins";

describe("Admin Configuration & GitHub Usernames", () => {
  const originalEnv = process.env.ADMIN_GITHUB_USERNAMES;

  beforeEach(() => {
    delete process.env.ADMIN_GITHUB_USERNAMES;
  });

  afterEach(() => {
    if (originalEnv !== undefined) {
      process.env.ADMIN_GITHUB_USERNAMES = originalEnv;
    } else {
      delete process.env.ADMIN_GITHUB_USERNAMES;
    }
  });

  it("includes aptitek in DEFAULT_ADMIN_GITHUB_USERNAMES", () => {
    expect(DEFAULT_ADMIN_GITHUB_USERNAMES).toContain("aptitek");
    expect(DEFAULT_ADMIN_GITHUB_USERNAMES.length).toBeGreaterThanOrEqual(1);
  });

  it("identifies aptitek as an admin case-insensitively", () => {
    expect(isAdminGithubUser("aptitek")).toBe(true);
    expect(isAdminGithubUser("Aptitek")).toBe(true);
    expect(isAdminGithubUser("APTITEK")).toBe(true);
    expect(isAdminGithubUser("  aptitek  ")).toBe(true);
    expect(isDefaultAdminGithubUser("aptitek")).toBe(true);
    expect(isDefaultAdminGithubUser("Aptitek")).toBe(true);
  });

  it("rejects non-admin usernames by default", () => {
    expect(isAdminGithubUser("random_user")).toBe(false);
    expect(isAdminGithubUser("octocat")).toBe(false);
    expect(isAdminGithubUser("")).toBe(false);
    expect(isAdminGithubUser(null)).toBe(false);
    expect(isAdminGithubUser(undefined)).toBe(false);
    expect(isDefaultAdminGithubUser("random_user")).toBe(false);
    expect(isDefaultAdminGithubUser(null)).toBe(false);
  });

  it("supports environment variable overrides and additions", () => {
    process.env.ADMIN_GITHUB_USERNAMES = "extra_admin, another_admin";

    expect(isAdminGithubUser("aptitek")).toBe(true);
    expect(isAdminGithubUser("extra_admin")).toBe(true);
    expect(isAdminGithubUser("Another_Admin")).toBe(true);
    expect(isAdminGithubUser("unknown_user")).toBe(false);

    // isDefaultAdminGithubUser only checks built-in defaults
    expect(isDefaultAdminGithubUser("extra_admin")).toBe(false);
    expect(isDefaultAdminGithubUser("aptitek")).toBe(true);
  });

  it("handles explicit envOverride parameter", () => {
    const customEnv = "custom_superadmin, dev_lead";
    expect(isAdminGithubUser("custom_superadmin", customEnv)).toBe(true);
    expect(isAdminGithubUser("dev_lead", customEnv)).toBe(true);
    expect(isAdminGithubUser("aptitek", customEnv)).toBe(true);
    expect(isAdminGithubUser("not_an_admin", customEnv)).toBe(false);
  });

  it("returns unique lowercase list of usernames from getAdminGithubUsernames", () => {
    const list = getAdminGithubUsernames("aptitek, custom_one, custom_two");
    expect(list).toContain("aptitek");
    expect(list).toContain("custom_one");
    expect(list).toContain("custom_two");

    // Ensure no duplicates
    const uniqueCount = new Set(list).size;
    expect(list).toHaveLength(uniqueCount);
  });
});
