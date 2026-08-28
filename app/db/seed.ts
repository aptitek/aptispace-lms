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
} from "./schema";

export async function seedDatabase(db: Database) {
  const now = new Date();

  // 1. Institution
  const existingInst = await db
    .select()
    .from(institutions)
    .where(eq(institutions.slug, "aptispace-orbital-academy"))
    .limit(1);

  let institutionId: string;

  if (existingInst.length > 0) {
    institutionId = existingInst[0].id;
  } else {
    const [inst] = await db
      .insert(institutions)
      .values({
        name: "AptiSpace Orbital Academy",
        slug: "aptispace-orbital-academy",
        type: "academic",
        logoUrl: "/assets/images/brand-logo.svg",
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
    .where(eq(cohorts.name, "Cadet Cohort 2026"))
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
        name: "Cadet Cohort 2026",
        description: "Primary orbital navigation and avionics flight cohort.",
        startDate,
        endDate,
        createdAt: now,
        updatedAt: now,
      })
      .returning();
    cohortId = cohort.id;
  }

  // 3. Personas / Core Users
  const personaUsers = [
    {
      id: "persona-admin",
      firstName: "Eleanor",
      lastName: "Vance",
      displayName: "Dr. Eleanor Vance",
      githubId: "dr-eleanor-vance",
      email: "admin@aptispace.internal",
      role: "admin" as const,
    },
    {
      id: "persona-instructor",
      firstName: "Daniel",
      lastName: "Foster",
      displayName: "Cmdr. Daniel Foster",
      githubId: "cmdr-daniel-foster",
      email: "d.foster@faculty.aptispace.io",
      role: "instructor" as const,
    },
    {
      id: "persona-student",
      firstName: "Alex",
      lastName: "Mercer",
      displayName: "Alex Mercer",
      githubId: "alex-mercer-cadet",
      email: "alex.mercer@cadet.aptispace.io",
      role: "student" as const,
    },
  ];

  for (const p of personaUsers) {
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.id, p.id))
      .limit(1);

    if (existingUser.length === 0) {
      await db.insert(users).values({
        id: p.id,
        firstName: p.firstName,
        lastName: p.lastName,
        displayName: p.displayName,
        githubId: p.githubId,
        createdAt: now,
        updatedAt: now,
      });

      await db.insert(affiliations).values({
        userId: p.id,
        institutionId,
        cohortId: p.role === "student" ? cohortId : null,
        email: p.email,
        role: p.role,
        isActive: true,
        createdAt: now,
        updatedAt: now,
      });
    }
  }

  // 4. Courses & Modules
  const existingCourses = await db.select().from(courses).limit(1);
  if (existingCourses.length === 0) {
    // Course 1
    const [course1] = await db
      .insert(courses)
      .values({
        title: "Orbital Mechanics & Astrodynamics",
        description:
          "Comprehensive course on Keplerian trajectories, orbital rendezvous, and delta-v maneuvers.",
        createdAt: now,
        updatedAt: now,
      })
      .returning();

    // Tags
    const [tagPhysics] = await db
      .insert(tags)
      .values({ name: "Physics", createdAt: now })
      .onConflictDoNothing()
      .returning();
    const [tagSimulation] = await db
      .insert(tags)
      .values({ name: "Simulation", createdAt: now })
      .onConflictDoNothing()
      .returning();

    // Module 1 (Lecture)
    const [mod1] = await db
      .insert(modules)
      .values({
        courseId: course1.id,
        title: "Introduction to Orbital Flight Physics",
        type: "lecture",
        contentUrl: "https://courses.aptispace.io/modules/orbital-physics",
        createdAt: now,
        updatedAt: now,
      })
      .returning();

    if (tagPhysics) {
      await db
        .insert(moduleTags)
        .values({ moduleId: mod1.id, tagId: tagPhysics.id })
        .onConflictDoNothing();
    }

    // Module 2 (Lab)
    const [mod2] = await db
      .insert(modules)
      .values({
        courseId: course1.id,
        title: "Hohmann Transfer Simulation",
        type: "lab",
        contentUrl: "https://courses.aptispace.io/modules/hohmann-lab",
        createdAt: now,
        updatedAt: now,
      })
      .returning();

    if (tagSimulation) {
      await db
        .insert(moduleTags)
        .values({ moduleId: mod2.id, tagId: tagSimulation.id })
        .onConflictDoNothing();
    }

    // Module 3 (Evaluation)
    const [mod3] = await db
      .insert(modules)
      .values({
        courseId: course1.id,
        title: "Atmospheric Re-entry & Trajectory Assessment",
        type: "evaluation",
        contentUrl: "https://courses.aptispace.io/modules/re-entry-eval",
        createdAt: now,
        updatedAt: now,
      })
      .returning();

    const [crit1] = await db
      .insert(criteria)
      .values({
        moduleId: mod3.id,
        name: "Trajectory Delta-V Efficiency",
        maxPoints: 20,
        coefficient: 1,
        createdAt: now,
      })
      .returning();

    const [_crit2] = await db
      .insert(criteria)
      .values({
        moduleId: mod3.id,
        name: "Heat Shield Thermal Compliance",
        maxPoints: 20,
        coefficient: 1.5,
        createdAt: now,
      })
      .returning();

    // 5. Session, Seances, and Groups
    const [session1] = await db
      .insert(sessions)
      .values({
        courseId: course1.id,
        cohortId,
        createdAt: now,
        updatedAt: now,
      })
      .returning();

    const seanceStartTime = new Date(Date.now() + 86400000);
    const seanceEndTime = new Date(Date.now() + 86400000 + 7200000);

    await db.insert(seances).values({
      sessionId: session1.id,
      startTime: seanceStartTime,
      endTime: seanceEndTime,
      location: "Orbital Sim Room 402",
      createdAt: now,
      updatedAt: now,
    });

    const [group1] = await db
      .insert(groups)
      .values({
        sessionId: session1.id,
        name: "Alpha Flight Wing",
        createdAt: now,
        updatedAt: now,
      })
      .returning();

    await db
      .insert(groupMembers)
      .values({
        groupId: group1.id,
        userId: "persona-student",
        joinedAt: now,
      })
      .onConflictDoNothing();

    // Sample Student Submission
    const [sub1] = await db
      .insert(submissions)
      .values({
        moduleId: mod3.id,
        userId: "persona-student",
        groupId: group1.id,
        submissionUrl:
          "https://github.com/aptispace-cadets/orbital-calc-mercer",
        submissionType: "individual",
        submittedAt: now,
        updatedAt: now,
      })
      .returning();

    // Sample Grade
    await db.insert(grades).values({
      criteriaId: crit1.id,
      submissionId: sub1.id,
      score: 18.5,
      feedback: "Excellent delta-v optimization on final orbital insertion.",
      createdAt: now,
      updatedAt: now,
    });
  }

  return { success: true };
}
