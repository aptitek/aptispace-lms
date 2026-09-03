import { describe, it, expect } from "vitest";
import { matchesUserFilters, mapDbUserToStudent } from "./admin.helpers";

describe("Admin Helpers", () => {
  describe("matchesUserFilters with year range", () => {
    const sampleUser = {
      id: "u1",
      firstName: "Jean",
      familyName: "DUPONT",
      email: "jean.dupont@aptitek.io",
      role: "student" as const,
      cohortId: "c1",
      cohortName: "Cohort 2026",
      cohortStartYear: 2026,
      cohortStartDate: "2026-09-01",
      institutionId: "school-1",
      cohorts: [
        {
          id: "c1",
          name: "Cohort 2026",
          startDate: "2026-09-01",
          startYear: 2026,
        },
      ],
    };

    it("matches when no year filter is provided", () => {
      expect(
        matchesUserFilters(sampleUser, {
          role: "all",
          school: "all",
          cohort: "all",
          query: "",
          startYearMin: null,
          startYearMax: null,
        }),
      ).toBe(true);
    });

    it("matches when user start year is within range", () => {
      expect(
        matchesUserFilters(sampleUser, {
          role: "all",
          school: "all",
          cohort: "all",
          query: "",
          startYearMin: 2025,
          startYearMax: 2027,
        }),
      ).toBe(true);
    });

    it("does not match when user start year is outside range", () => {
      expect(
        matchesUserFilters(sampleUser, {
          role: "all",
          school: "all",
          cohort: "all",
          query: "",
          startYearMin: 2027,
          startYearMax: 2029,
        }),
      ).toBe(false);
    });
  });

  describe("mapDbUserToStudent", () => {
    const mockInstitution = {
      id: "inst-1",
      name: "Aptitek",
      slug: "aptitek",
      type: "academic" as const,
      logoUrl: null,
      emailDomain: null,
      usernamePattern: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it("preserves role for admin users and does not assign student cohort details", () => {
      const dbAdmin = {
        id: "admin-u1",
        firstName: "Grace",
        lastName: "HOPPER",
        displayName: "Grace Hopper",
        avatarUrl: null,
        githubId: "ghopper",
        githubEmail: "grace@aptitek.io",
        createdAt: new Date(),
        updatedAt: new Date(),
        affiliations: [
          {
            id: "aff-admin",
            userId: "admin-u1",
            institutionId: "inst-1",
            cohortId: null,
            email: "grace@aptitek.io",
            role: "admin" as const,
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date(),
            institution: mockInstitution,
            cohort: null,
          },
        ],
      };

      const mapped = mapDbUserToStudent(dbAdmin);
      expect(mapped.role).toBe("admin");
      expect(mapped.cohortName).toBeUndefined();
      expect(mapped.cohortId).toBeNull();
      expect(mapped.institutionName).toBe("Aptitek");
    });

    it("preserves role for instructor and student users", () => {
      const dbInstructor = {
        id: "inst-u1",
        firstName: "Alan",
        lastName: "TURING",
        displayName: "Alan Turing",
        avatarUrl: null,
        githubId: "aturing",
        githubEmail: "alan@aptitek.io",
        createdAt: new Date(),
        updatedAt: new Date(),
        affiliations: [
          {
            id: "aff-inst",
            userId: "inst-u1",
            institutionId: "inst-1",
            cohortId: null,
            email: "alan@aptitek.io",
            role: "instructor" as const,
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date(),
            institution: mockInstitution,
            cohort: null,
          },
        ],
      };

      const mappedInst = mapDbUserToStudent(dbInstructor);
      expect(mappedInst.role).toBe("instructor");

      const dbStudent = {
        id: "std-u1",
        firstName: "Ada",
        lastName: "LOVELACE",
        displayName: "Ada Lovelace",
        avatarUrl: null,
        githubId: "alovelace",
        githubEmail: "ada@aptitek.io",
        createdAt: new Date(),
        updatedAt: new Date(),
        affiliations: [
          {
            id: "aff-std",
            userId: "std-u1",
            institutionId: "inst-1",
            cohortId: "cohort-1",
            email: "ada@aptitek.io",
            role: "student" as const,
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date(),
            institution: mockInstitution,
            cohort: {
              id: "cohort-1",
              institutionId: "inst-1",
              diploma: "M",
              year: 1,
              tags: ["IA"],
              description: null,
              startDate: new Date("2026-09-01"),
              endDate: null,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          },
        ],
      };

      const mappedStd = mapDbUserToStudent(dbStudent);
      expect(mappedStd.role).toBe("student");
      expect(mappedStd.cohortId).toBe("cohort-1");
    });
  });

  describe("matchesUserFilters with role filter", () => {
    const adminUser = {
      id: "u-admin",
      firstName: "Grace",
      familyName: "HOPPER",
      email: "grace@aptitek.io",
      role: "admin" as const,
      cohortId: null,
    };

    it("matches admin user when role filter is admin or all", () => {
      expect(
        matchesUserFilters(adminUser, {
          role: "admin",
          school: "all",
          cohort: "all",
          query: "",
        }),
      ).toBe(true);

      expect(
        matchesUserFilters(adminUser, {
          role: "all",
          school: "all",
          cohort: "all",
          query: "",
        }),
      ).toBe(true);
    });

    it("does not match admin user when role filter is student or instructor", () => {
      expect(
        matchesUserFilters(adminUser, {
          role: "student",
          school: "all",
          cohort: "all",
          query: "",
        }),
      ).toBe(false);

      expect(
        matchesUserFilters(adminUser, {
          role: "instructor",
          school: "all",
          cohort: "all",
          query: "",
        }),
      ).toBe(false);
    });
  });
});
