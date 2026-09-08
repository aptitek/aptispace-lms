import { eq } from "drizzle-orm";
import type { Database } from "./index";
import {
  institutions,
  cohorts,
  users,
  affiliations,
  groups,
  groupMembers,
  modules,
  moduleActivities,
  activityTransitions,
  mapPositions,
  activityVotes,
  fights,
  fightPhases,
  studentDecks,
  auditLogs,
  errorReports,
} from "./schema";

export async function resetDatabase(db: Database) {
  // Delete in reverse foreign-key dependency order
  await db.delete(studentDecks);
  await db.delete(fightPhases);
  await db.delete(fights);
  await db.delete(activityVotes);
  await db.delete(mapPositions);
  await db.delete(activityTransitions);
  await db.delete(moduleActivities);
  await db.delete(modules);
  await db.delete(groupMembers);
  await db.delete(groups);
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
): Promise<{
  adminUserId: string;
  instructorUserId: string;
  studentUserId: string;
}> {
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
        avatarUrl: "/avatars/seed-sarah.webp",
        calendarFeedToken: "feed-token-admin-sarah-1234",
        isOnline: false,
        lastSeenAt: now,
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
    if (!existingAdmin[0].avatarUrl) {
      await db
        .update(users)
        .set({ avatarUrl: "/avatars/seed-sarah.webp", updatedAt: now })
        .where(eq(users.id, adminUserId));
    }
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
        avatarUrl: "/avatars/seed-alex.webp",
        calendarFeedToken: "feed-token-instructor-alex-5678",
        isOnline: false,
        lastSeenAt: now,
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
    if (!existingInstructor[0].avatarUrl) {
      await db
        .update(users)
        .set({ avatarUrl: "/avatars/seed-alex.webp", updatedAt: now })
        .where(eq(users.id, instructorUserId));
    }
  }

  const existingStudent = await db
    .select()
    .from(users)
    .where(eq(users.githubEmail, "cadet.elena@aptitek.io"))
    .limit(1);

  let studentUserId: string;
  if (existingStudent.length === 0) {
    const [student] = await db
      .insert(users)
      .values({
        firstName: "Elena",
        lastName: "Rostova",
        displayName: "Elena Rostova",
        githubEmail: "cadet.elena@aptitek.io",
        githubId: "student-elena",
        avatarUrl: "/avatars/seed-elena.webp",
        calendarFeedToken: "feed-token-student-elena-9012",
        isOnline: false,
        lastSeenAt: now,
        createdAt: now,
        updatedAt: now,
      })
      .returning();
    studentUserId = student.id;

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
  } else {
    studentUserId = existingStudent[0].id;
    if (!existingStudent[0].avatarUrl) {
      await db
        .update(users)
        .set({ avatarUrl: "/avatars/seed-elena.webp", updatedAt: now })
        .where(eq(users.id, studentUserId));
    }
  }

  return { adminUserId, instructorUserId, studentUserId };
}

async function seedRoguelikeModule(params: {
  db: Database;
  cohortId: string;
  studentUserId: string;
  groupId: string;
  now: Date;
}) {
  const { db, cohortId, studentUserId, groupId, now } = params;
  const existingModules = await db
    .select()
    .from(modules)
    .where(eq(modules.cohortId, cohortId))
    .limit(1);

  if (existingModules.length > 0) return;

  const [mod] = await db
    .insert(modules)
    .values({
      cohortId,
      title: "Roguelike Core Protocol",
      description:
        "Primary cybernetic mission tree: Map progression, team encounters, and system defense.",
      createdAt: now,
      updatedAt: now,
    })
    .returning();

  const [act1] = await db
    .insert(moduleActivities)
    .values({
      moduleId: mod.id,
      title: "Orientation & Node Verification",
      range: "student",
      pedagogicalValue: 10,
      rewardValue: 50,
      powerValue: 5,
      resourceUrls: ["https://aptitek.io/manuals/orientation"],
      createdAt: now,
      updatedAt: now,
    })
    .returning();

  const [act2] = await db
    .insert(moduleActivities)
    .values({
      moduleId: mod.id,
      title: "Edge Network Infrastructure Raid",
      range: "group",
      pedagogicalValue: 25,
      rewardValue: 150,
      powerValue: 20,
      resourceUrls: ["https://aptitek.io/manuals/edge-networks"],
      createdAt: now,
      updatedAt: now,
    })
    .returning();

  const [act3] = await db
    .insert(moduleActivities)
    .values({
      moduleId: mod.id,
      title: "Sentinel Overlord Boss Encounter",
      range: "cohort",
      pedagogicalValue: 50,
      rewardValue: 500,
      powerValue: 100,
      resourceUrls: ["https://aptitek.io/manuals/sentinel-encounter"],
      createdAt: now,
      updatedAt: now,
    })
    .returning();

  // Activity Transitions: act1 -> act2 -> act3
  await db.insert(activityTransitions).values([
    { fromActivityId: act1.id, toActivityId: act2.id },
    { fromActivityId: act2.id, toActivityId: act3.id },
  ]);

  // Fight for Boss Encounter
  const [bossFight] = await db
    .insert(fights)
    .values({
      activityId: act3.id,
      enemyName: "Sentinel Overlord Prime",
      createdAt: now,
      updatedAt: now,
    })
    .returning();

  await db.insert(fightPhases).values([
    { fightId: bossFight.id, phaseOrder: 1, powerRequired: 30 },
    { fightId: bossFight.id, phaseOrder: 2, powerRequired: 70 },
  ]);

  // Initial Student Map Position & Deck Card
  await db.insert(mapPositions).values({
    activityId: act1.id,
    cohortId,
    groupId,
    userId: studentUserId,
    updatedAt: now,
  });

  await db.insert(studentDecks).values({
    userId: studentUserId,
    activityId: act1.id,
    acquiredAt: now,
  });
}

export async function seedDatabase(db: Database) {
  const now = new Date();

  // 1. Institution (Note: no slug)
  const existingInst = await db
    .select()
    .from(institutions)
    .where(eq(institutions.name, "Aptitek"))
    .limit(1);

  let institutionId: string;
  if (existingInst.length > 0) {
    institutionId = existingInst[0].id;
  } else {
    const [inst] = await db
      .insert(institutions)
      .values({
        name: "Aptitek",
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

  // 2. Cohort
  const existingCohort = await db
    .select()
    .from(cohorts)
    .where(eq(cohorts.institutionId, institutionId))
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

  // 3. Default Seed Users
  const { studentUserId } = await seedUsers(db, institutionId, cohortId, now);

  // 4. Groups & Group Members
  const existingGroup = await db
    .select()
    .from(groups)
    .where(eq(groups.cohortId, cohortId))
    .limit(1);

  let groupId: string;
  if (existingGroup.length > 0) {
    groupId = existingGroup[0].id;
  } else {
    const [newGroup] = await db
      .insert(groups)
      .values({
        cohortId,
        name: "Alpha Vanguard",
        currencyPoints: 100,
        createdAt: now,
        updatedAt: now,
      })
      .returning();
    groupId = newGroup.id;

    await db.insert(groupMembers).values({
      groupId: newGroup.id,
      userId: studentUserId,
      joinedAt: now,
    });
  }

  // 5. Roguelike Modules & Activities
  await seedRoguelikeModule({ db, cohortId, studentUserId, groupId, now });

  return { success: true, institutionId, cohortId, groupId };
}
