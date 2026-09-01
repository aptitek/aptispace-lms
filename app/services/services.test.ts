import { describe, it, expect } from "vitest";
import type { D1Database } from "@cloudflare/workers-types";
import { getDb, getDatabaseFromContext } from "../db/index";
import * as schema from "../db/schema";
import {
  createUser,
  getUserById,
  createAffiliation,
  getAffiliationsForUser,
} from "./userService";
import {
  createCourse,
  getCourseById,
  createModule,
  addCriteriaToModule,
} from "./courseService";
import {
  createSession,
  createSeance,
  createGroup,
  addUserToGroup,
} from "./sessionService";
import {
  createSubmission,
  gradeSubmission,
  logAudit,
} from "./assessmentService";
import {
  getAllInstitutions,
  getAllCohorts,
  addStudentToCohort,
  removeStudentFromCohort,
} from "./cohortService";
import { seedDatabase } from "../db/seed";

// Helper to create a mock D1Database for unit testing Drizzle D1 integration
function createMockD1(): D1Database {
  const createStatement = (query: string, _boundParams: unknown[] = []) => {
    return {
      bind: (...newParams: unknown[]) => createStatement(query, newParams),
      all: async () => ({ results: [], success: true, meta: {} }),
      first: async () => null,
      run: async () => ({
        results: [],
        success: true,
        meta: { changes: 1, last_row_id: 1 },
      }),
      raw: async () => [],
    };
  };

  return {
    prepare: (query: string) => createStatement(query),
    dump: async () => new ArrayBuffer(0),
    batch: async (statements: unknown[]) =>
      statements.map(() => ({ results: [], success: true, meta: {} })),
    exec: async () => ({ count: 0, duration: 0 }),
  } as unknown as D1Database;
}

describe("Backend Database & Service Architecture", () => {
  it("initializes Drizzle D1 database instance with complete schema", () => {
    const mockD1 = createMockD1();
    const db = getDb(mockD1);
    expect(db).toBeDefined();
    expect(db.query).toBeDefined();
  });

  it("extracts database from Cloudflare load context", () => {
    const mockD1 = createMockD1();
    const context = {
      cloudflare: {
        env: {
          DB: mockD1,
        },
      },
    };

    const db = getDatabaseFromContext(context);
    expect(db).toBeDefined();
  });

  it("returns null gracefully when DB binding is absent from context", () => {
    expect(getDatabaseFromContext(undefined)).toBeNull();
    expect(getDatabaseFromContext({})).toBeNull();
  });

  it("validates all schema tables and relationships export correctly", () => {
    expect(schema.users).toBeDefined();
    expect(schema.institutions).toBeDefined();
    expect(schema.cohorts).toBeDefined();
    expect(schema.affiliations).toBeDefined();
    expect(schema.courses).toBeDefined();
    expect(schema.modules).toBeDefined();
    expect(schema.tags).toBeDefined();
    expect(schema.moduleTags).toBeDefined();
    expect(schema.sessions).toBeDefined();
    expect(schema.seances).toBeDefined();
    expect(schema.groups).toBeDefined();
    expect(schema.groupMembers).toBeDefined();
    expect(schema.submissions).toBeDefined();
    expect(schema.criteria).toBeDefined();
    expect(schema.grades).toBeDefined();
    expect(schema.auditLogs).toBeDefined();
  });

  it("seeds the database successfully without throwing", async () => {
    const mockDb = {
      select: () => ({
        from: () => ({
          where: () => ({
            limit: () => Promise.resolve([]),
          }),
          limit: () => Promise.resolve([]),
        }),
      }),
      insert: () => ({
        values: (recordValues: Record<string, unknown>) => ({
          returning: () =>
            Promise.resolve([{ id: "test-id-1", ...recordValues }]),
          onConflictDoNothing: () => ({
            returning: () =>
              Promise.resolve([{ id: "test-id-1", ...recordValues }]),
          }),
        }),
      }),
    } as unknown as ReturnType<typeof getDb>;

    const result = await seedDatabase(mockDb);
    expect(result.success).toBe(true);
  });

  it("executes user and affiliation domain operations", async () => {
    const mockUserRecord = [
      { id: "user-1", firstName: "Test", lastName: "PILOT", role: "student" },
    ];
    const mockDb = {
      select: () => ({
        from: () => ({
          where: () =>
            Object.assign(Promise.resolve(mockUserRecord), {
              limit: () => Promise.resolve(mockUserRecord),
            }),
        }),
      }),
      insert: () => ({
        values: (recordValues: Record<string, unknown>) => ({
          returning: () => Promise.resolve([{ id: "user-1", ...recordValues }]),
        }),
      }),
    } as unknown as ReturnType<typeof getDb>;

    const user = await createUser(mockDb, {
      firstName: "Test",
      lastName: "pilot",
      displayName: "Test PILOT",
    });
    expect(user.id).toBe("user-1");
    expect(user.lastName).toBe("PILOT");

    const fetchedUser = await getUserById(mockDb, "user-1");
    expect(fetchedUser?.firstName).toBe("Test");

    const affiliation = await createAffiliation(mockDb, {
      userId: "user-1",
      institutionId: "inst-1",
      email: "test@aptispace.io",
      role: "student",
    });
    expect(affiliation.id).toBe("user-1");

    const affiliationsList = await getAffiliationsForUser(mockDb, "user-1");
    expect(Array.isArray(affiliationsList)).toBe(true);
  });

  it("updates existing user and affiliation records and evaluates completeness", async () => {
    const mockDb = {
      select: () => ({
        from: () => ({
          where: () => ({
            limit: () =>
              Promise.resolve([
                {
                  id: "affil-1",
                  userId: "user-1",
                  institutionId: "inst-1",
                  email: "old@aptispace.io",
                },
              ]),
          }),
        }),
      }),
      update: () => ({
        set: (updateValues: Record<string, unknown>) => ({
          where: () => ({
            returning: () =>
              Promise.resolve([{ id: "user-1", ...updateValues }]),
          }),
        }),
      }),
    } as unknown as ReturnType<typeof getDb>;

    const { updateUser, updateUserAffiliation, isUserProfileComplete } =
      await import("./userService");

    const updatedUser = await updateUser(mockDb, "user-1", {
      firstName: "Alex",
      lastName: "mercer",
      displayName: "Alex MERCER",
    });
    expect(updatedUser?.firstName).toBe("Alex");
    expect(updatedUser?.lastName).toBe("MERCER");

    const updatedAffiliation = await updateUserAffiliation(mockDb, "user-1", {
      email: "alex.mercer@aptitek.io",
    });
    expect(updatedAffiliation?.email).toBe("alex.mercer@aptitek.io");

    expect(
      isUserProfileComplete({
        id: "user-1",
        firstName: "Alex",
        lastName: "MERCER",
        displayName: "Alex MERCER",
        githubId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        affiliations: [
          {
            id: "affil-1",
            userId: "user-1",
            institutionId: "inst-1",
            cohortId: null,
            email: "alex.mercer@aptitek.io",
            role: "student",
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date(),
            institution: {} as never,
            cohort: null,
          },
        ],
      }),
    ).toBe(true);

    expect(
      isUserProfileComplete({
        id: "user-1",
        firstName: "",
        lastName: "MERCER",
        displayName: "Alex MERCER",
        githubId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        affiliations: [],
      }),
    ).toBe(false);
  });

  it("executes course and module domain operations", async () => {
    const mockDb = {
      select: () => ({
        from: () => ({
          where: () => ({
            limit: () =>
              Promise.resolve([
                { id: "course-1", title: "Orbital Navigation" },
              ]),
          }),
        }),
      }),
      insert: () => ({
        values: (recordValues: Record<string, unknown>) => ({
          returning: () =>
            Promise.resolve([{ id: "course-1", ...recordValues }]),
          onConflictDoNothing: () => ({
            returning: () =>
              Promise.resolve([{ id: "tag-1", ...recordValues }]),
          }),
        }),
      }),
    } as unknown as ReturnType<typeof getDb>;

    const course = await createCourse(mockDb, {
      title: "Orbital Navigation",
      description: "Flight mechanics",
    });
    expect(course.title).toBe("Orbital Navigation");

    const fetchedCourse = await getCourseById(mockDb, "course-1");
    expect(fetchedCourse?.id).toBe("course-1");

    const courseModule = await createModule(
      mockDb,
      {
        courseId: "course-1",
        title: "Docking Protocol",
        type: "lab",
      },
      ["Physics"],
    );
    expect(courseModule.id).toBe("course-1");

    const criteriaList = await addCriteriaToModule(mockDb, "mod-1", [
      { name: "Precision", maxPoints: 20 },
    ]);
    expect(criteriaList).toHaveLength(1);
  });

  it("executes session, seance, and group domain operations", async () => {
    const mockDb = {
      insert: () => ({
        values: (recordValues: Record<string, unknown>) => ({
          returning: () =>
            Promise.resolve([{ id: "session-1", ...recordValues }]),
          onConflictDoNothing: () =>
            Promise.resolve([{ id: "member-1", ...recordValues }]),
        }),
      }),
    } as unknown as ReturnType<typeof getDb>;

    const session = await createSession(mockDb, {
      courseId: "course-1",
      cohortId: "cohort-1",
    });
    expect(session.id).toBe("session-1");

    const seance = await createSeance(mockDb, {
      sessionId: "session-1",
      startTime: new Date(),
      endTime: new Date(),
      location: "Room 1",
    });
    expect(seance.id).toBe("session-1");

    const group = await createGroup(
      mockDb,
      {
        sessionId: "session-1",
        name: "Squadron Alpha",
      },
      ["user-1"],
    );
    expect(group.id).toBe("session-1");

    await addUserToGroup(mockDb, "group-1", "user-2");
  });

  it("executes assessment, grading, and audit log domain operations", async () => {
    const mockDb = {
      select: () => ({
        from: () => ({
          where: () =>
            Promise.resolve([
              {
                id: "grade-1",
                submissionId: "sub-1",
                criteriaId: "crit-1",
                score: 15,
                feedback: "Good",
              },
            ]),
        }),
      }),
      insert: () => ({
        values: (recordValues: Record<string, unknown>) => ({
          returning: () =>
            Promise.resolve([{ id: "record-1", ...recordValues }]),
        }),
      }),
      update: () => ({
        set: (updateValues: Record<string, unknown>) => ({
          where: () => ({
            returning: () =>
              Promise.resolve([{ id: "grade-1", ...updateValues }]),
          }),
        }),
      }),
    } as unknown as ReturnType<typeof getDb>;

    const submission = await createSubmission(mockDb, {
      moduleId: "mod-1",
      userId: "user-1",
      submissionUrl: "https://github.com/test",
      submissionType: "individual",
    });
    expect(submission.id).toBe("record-1");

    const grade = await gradeSubmission(mockDb, {
      submissionId: "sub-1",
      criteriaId: "crit-1",
      score: 19,
      feedback: "Improved",
      graderUserId: "instructor-1",
    });
    expect(grade.score).toBe(19);

    const audit = await logAudit(mockDb, {
      tableName: "grades",
      recordId: "grade-1",
      action: "UPDATE",
      userId: "instructor-1",
    });
    expect(audit.id).toBe("record-1");
  });

  it("queries institutions and cohorts and manages cohort assignment", async () => {
    const mockDb = {
      select: () => ({
        from: () => ({
          orderBy: () =>
            Promise.resolve([
              { id: "cohort-1", name: "Cohort 2026", institutionId: "inst-1" },
            ]),
          where: () =>
            Object.assign(
              Promise.resolve([
                {
                  id: "affil-1",
                  userId: "user-1",
                  cohortId: "cohort-1",
                  institutionId: "inst-1",
                },
              ]),
              {
                limit: () =>
                  Promise.resolve([
                    {
                      id: "cohort-1",
                      name: "Cohort 2026",
                      institutionId: "inst-1",
                    },
                  ]),
              },
            ),
        }),
      }),
      insert: () => ({
        values: (recordValues: Record<string, unknown>) => ({
          returning: () =>
            Promise.resolve([{ id: "affil-1", ...recordValues }]),
        }),
      }),
      delete: () => ({
        where: () => Promise.resolve({ success: true }),
      }),
    } as unknown as ReturnType<typeof getDb>;

    const insts = await getAllInstitutions(mockDb);
    expect(insts).toHaveLength(1);

    const cohortList = await getAllCohorts(mockDb);
    expect(cohortList).toHaveLength(1);

    const added = await addStudentToCohort(mockDb, {
      userId: "user-1",
      cohortId: "cohort-1",
      actorUserId: "admin-1",
    });
    expect(added.id).toBe("cohort-1");

    const removed = await removeStudentFromCohort(mockDb, {
      userId: "user-1",
      cohortId: "cohort-1",
      actorUserId: "admin-1",
    });
    expect(removed.success).toBe(true);
  });
});
