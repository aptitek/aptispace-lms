import { eq, and } from "drizzle-orm";
import type { Database } from "../db/index";
import {
  groups,
  groupMembers,
  type Group,
  type NewGroup,
  type GroupMember,
} from "../db/schema";

export async function getGroupsForCohort(
  db: Database,
  cohortId: string,
): Promise<Group[]> {
  return db.select().from(groups).where(eq(groups.cohortId, cohortId));
}

export async function getGroupById(db: Database, groupId: string) {
  return db.query.groups.findFirst({
    where: eq(groups.id, groupId),
    with: {
      cohort: true,
      members: {
        with: {
          user: true,
        },
      },
      mapPositions: true,
    },
  });
}

export async function createGroup(
  db: Database,
  fields: Omit<NewGroup, "createdAt" | "updatedAt">,
  memberUserIds: string[] = [],
): Promise<Group> {
  const now = new Date();
  const [group] = await db
    .insert(groups)
    .values({
      ...fields,
      createdAt: now,
      updatedAt: now,
    })
    .returning();

  for (const userId of memberUserIds) {
    await db
      .insert(groupMembers)
      .values({
        groupId: group.id,
        userId,
        joinedAt: now,
      })
      .onConflictDoNothing();
  }

  return group;
}

export async function addUserToGroup(
  db: Database,
  groupId: string,
  userId: string,
): Promise<GroupMember | undefined> {
  const now = new Date();
  const [created] = await db
    .insert(groupMembers)
    .values({
      groupId,
      userId,
      joinedAt: now,
    })
    .onConflictDoNothing()
    .returning();
  return created;
}

export async function removeUserFromGroup(
  db: Database,
  groupId: string,
  userId: string,
): Promise<boolean> {
  const result = await db
    .delete(groupMembers)
    .where(
      and(eq(groupMembers.groupId, groupId), eq(groupMembers.userId, userId)),
    )
    .returning();
  return result.length > 0;
}
