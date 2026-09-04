import { eq, and } from "drizzle-orm";
import type { Database } from "./index";
import {
  institutions,
  cohorts,
  users,
  affiliations,
  courses,
  modules,
  tags,
  moduleTags,
  criteria,
  sessions,
  classes,
  groups,
  groupMembers,
  submissions,
  grades,
  auditLogs,
  errorReports,
} from "./schema";

export async function resetDatabase(db: Database) {
  // Delete in reverse dependency order
  await db.delete(grades);
  await db.delete(submissions);
  await db.delete(criteria);
  await db.delete(moduleTags);
  await db.delete(tags);
  await db.delete(modules);
  await db.delete(groupMembers);
  await db.delete(groups);
  await db.delete(classes);
  await db.delete(sessions);
  await db.delete(courses);
  await db.delete(affiliations);
  await db.delete(cohorts);
  await db.delete(auditLogs);
  await db.delete(errorReports);
  await db.delete(users);
  await db.delete(institutions);

  return { success: true, reset: true };
}

async function seedUsers(
  db: Database,
  institutionId: string,
  cohortId: string,
  now: Date,
): Promise<{ adminUserId: string; instructorUserId: string }> {
  const existingAdmin = await db
    .select()
    .from(users)
    .where(eq(users.githubEmail, "admin@aptitek.io"))
    .limit(1);

  let adminUserId: string;
  if (existingAdmin.length === 0) {
    const [admin] = await db
      .insert(users)
      .values({
        firstName: "Sarah",
        lastName: "Connor",
        displayName: "Sarah Connor",
        githubEmail: "admin@aptitek.io",
        githubId: "admin-sarah",
        calendarFeedToken: "feed-token-admin-sarah-1234",
        createdAt: now,
        updatedAt: now,
      })
      .returning();
    adminUserId = admin.id;

    await db.insert(affiliations).values({
      userId: admin.id,
      institutionId,
      email: "admin@aptitek.io",
      role: "admin",
      isActive: true,
      createdAt: now,
      updatedAt: now,
    });
  } else {
    adminUserId = existingAdmin[0].id;
  }

  const existingInstructor = await db
    .select()
    .from(users)
    .where(eq(users.githubEmail, "alex.mercer@aptitek.io"))
    .limit(1);

  let instructorUserId: string;
  if (existingInstructor.length === 0) {
    const [instructor] = await db
      .insert(users)
      .values({
        firstName: "Alex",
        lastName: "Mercer",
        displayName: "Alex Mercer",
        githubEmail: "alex.mercer@aptitek.io",
        githubId: "instructor-alex",
        calendarFeedToken: "feed-token-instructor-alex-5678",
        createdAt: now,
        updatedAt: now,
      })
      .returning();
    instructorUserId = instructor.id;

    await db.insert(affiliations).values({
      userId: instructor.id,
      institutionId,
      email: "alex.mercer@aptitek.io",
      role: "instructor",
      isActive: true,
      createdAt: now,
      updatedAt: now,
    });
  } else {
    instructorUserId = existingInstructor[0].id;
  }

  const existingStudent = await db
    .select()
    .from(users)
    .where(eq(users.githubEmail, "cadet.elena@aptitek.io"))
    .limit(1);

  if (existingStudent.length === 0) {
    const [student] = await db
      .insert(users)
      .values({
        firstName: "Elena",
        lastName: "Rostova",
        displayName: "Elena Rostova",
        githubEmail: "cadet.elena@aptitek.io",
        githubId: "student-elena",
        calendarFeedToken: "feed-token-student-elena-9012",
        createdAt: now,
        updatedAt: now,
      })
      .returning();

    await db.insert(affiliations).values({
      userId: student.id,
      institutionId,
      cohortId,
      email: "cadet.elena@aptitek.io",
      role: "student",
      isActive: true,
      createdAt: now,
      updatedAt: now,
    });
  }

  return { adminUserId, instructorUserId };
}

async function seedClassesForSession(
  db: Database,
  sessionId: string,
  adminUserId: string,
  instructorUserId: string,
): Promise<void> {
  const now = new Date();
  const existingClasses = await db
    .select()
    .from(classes)
    .where(eq(classes.sessionId, sessionId))
    .limit(1);

  if (existingClasses.length > 0) return;

  const baseDate = new Date();
  const dayOfWeek = baseDate.getDay();
  const distanceToMonday = (dayOfWeek + 6) % 7;
  const monday = new Date(baseDate);
  monday.setDate(baseDate.getDate() - distanceToMonday);
  monday.setHours(9, 0, 0, 0);

  const makeDate = (
    dayOffset: number,
    startHour: number,
    durationHours: number,
  ) => {
    const s = new Date(monday);
    s.setDate(monday.getDate() + dayOffset);
    s.setHours(startHour, 0, 0, 0);
    const e = new Date(s);
    e.setHours(startHour + durationHours, 0, 0, 0);
    return { startTime: s, endTime: e };
  };

  const d1 = makeDate(0, 9, 2.5);
  const d2 = makeDate(1, 14, 3);
  const d3 = makeDate(2, 10, 2);
  const d4 = makeDate(3, 15, 2.5);
  const d5 = makeDate(4, 11, 2);

  await db.insert(classes).values([
    {
      sessionId,
      instructorId: instructorUserId,
      title: "Cloud Infrastructure & Edge Computing",
      description:
        "Core architectures, Cloudflare Workers, edge caching, and KV/D1 databases.",
      isRemote: false,
      startTime: d1.startTime,
      endTime: d1.endTime,
      location: "Amphitheater Turing",
      createdAt: now,
      updatedAt: now,
    },
    {
      sessionId,
      instructorId: instructorUserId,
      title: "Microservices & Distributed Systems Lab",
      description:
        "Hands-on lab deploying decoupled microservices and event queues.",
      isRemote: false,
      startTime: d2.startTime,
      endTime: d2.endTime,
      location: "Lab Room Kepler-12",
      createdAt: now,
      updatedAt: now,
    },
    {
      sessionId,
      instructorId: adminUserId,
      title: "Fullstack Architecture & GraphQL Workshop",
      description:
        "Interactive session on schema design, resolvers, and subscriptions.",
      isRemote: true,
      startTime: d3.startTime,
      endTime: d3.endTime,
      location: "Online (Teams / Virtual Campus)",
      createdAt: now,
      updatedAt: now,
    },
    {
      sessionId,
      instructorId: instructorUserId,
      title: "Database Indexing & Query Tuning Lab",
      description:
        "Optimizing SQL query plans, SQLite internal B-Trees, and indexes.",
      isRemote: false,
      startTime: d4.startTime,
      endTime: d4.endTime,
      location: "Lab Room Kepler-12",
      createdAt: now,
      updatedAt: now,
    },
    {
      sessionId,
      instructorId: adminUserId,
      title: "Midterm Architectural Assessment",
      description:
        "Individual oral presentation and evaluation of system designs.",
      isRemote: true,
      startTime: d5.startTime,
      endTime: d5.endTime,
      location: "Online (Oral Examination)",
      createdAt: now,
      updatedAt: now,
    },
  ]);
}

export async function seedDatabase(db: Database) {
  const now = new Date();

  // 1. Institution
  const existingInst = await db
    .select()
    .from(institutions)
    .where(eq(institutions.slug, "aptitek"))
    .limit(1);

  let institutionId: string;
  if (existingInst.length > 0) {
    institutionId = existingInst[0].id;
  } else {
    const [inst] = await db
      .insert(institutions)
      .values({
        name: "Aptitek",
        slug: "aptitek",
        type: "academic",
        logoUrl: "/aptitek-logo.svg",
        emailDomain: null,
        usernamePattern: "{first}.{last}",
        createdAt: now,
        updatedAt: now,
      })
      .returning();
    institutionId = inst.id;
  }

  // 2. Cohorts
  const existingCohort = await db
    .select()
    .from(cohorts)
    .where(and(eq(cohorts.diploma, "M"), eq(cohorts.year, 1)))
    .limit(1);

  let cohortId: string;
  if (existingCohort.length > 0) {
    cohortId = existingCohort[0].id;
  } else {
    const startDate = new Date();
    const endDate = new Date();
    endDate.setFullYear(endDate.getFullYear() + 1);

    const [cohort] = await db
      .insert(cohorts)
      .values({
        institutionId,
        diploma: "M",
        year: 1,
        tags: ["IA", "Dev"],
        description: "Primary software engineering cohort.",
        startDate,
        endDate,
        createdAt: now,
        updatedAt: now,
      })
      .returning();
    cohortId = cohort.id;
  }

  // 3. Courses
  let courseId: string;
  const existingCourses = await db.select().from(courses).limit(1);
  if (existingCourses.length === 0) {
    const [course1] = await db
      .insert(courses)
      .values({
        title: "Fullstack Web Engineering",
        description:
          "Comprehensive course covering React, TypeScript, serverless architecture, and databases.",
        createdAt: now,
        updatedAt: now,
      })
      .returning();
    courseId = course1.id;

    const [tagDev] = await db
      .insert(tags)
      .values({ name: "Web Development", createdAt: now })
      .onConflictDoNothing()
      .returning();

    const [mod1] = await db
      .insert(modules)
      .values({
        courseId: course1.id,
        title: "Modern React & Component Systems",
        type: "lecture",
        contentUrl: "https://courses.aptitek.io/modules/react-systems",
        createdAt: now,
        updatedAt: now,
      })
      .returning();

    if (tagDev) {
      await db
        .insert(moduleTags)
        .values({ moduleId: mod1.id, tagId: tagDev.id })
        .onConflictDoNothing();
    }
  } else {
    courseId = existingCourses[0].id;
  }

  // 4. Default Seed Users
  const { adminUserId, instructorUserId } = await seedUsers(
    db,
    institutionId,
    cohortId,
    now,
  );

  // 5. Session & Classes
  const existingSession = await db
    .select()
    .from(sessions)
    .where(
      and(eq(sessions.courseId, courseId), eq(sessions.cohortId, cohortId)),
    )
    .limit(1);

  let sessionId: string;
  if (existingSession.length === 0) {
    const [newSession] = await db
      .insert(sessions)
      .values({
        courseId,
        cohortId,
        createdAt: now,
        updatedAt: now,
      })
      .returning();
    sessionId = newSession.id;
  } else {
    sessionId = existingSession[0].id;
  }

  await seedClassesForSession(db, sessionId, adminUserId, instructorUserId);

  return { success: true, institutionId, cohortId, sessionId };
}
