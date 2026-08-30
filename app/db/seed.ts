import { eq } from "drizzle-orm";
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
  seances,
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
  await db.delete(seances);
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
        createdAt: now,
        updatedAt: now,
      })
      .returning();
    institutionId = inst.id;
  }

  // 2. Cohort
  const existingCohort = await db
    .select()
    .from(cohorts)
    .where(eq(cohorts.name, "Cohort 2026"))
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
        name: "Cohort 2026",
        description: "Primary software engineering cohort.",
        startDate,
        endDate,
        createdAt: now,
        updatedAt: now,
      })
      .returning();
    cohortId = cohort.id;
  }

  // 3. Courses & Modules (Neutral curriculum)
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
  }

  return { success: true, institutionId, cohortId };
}
