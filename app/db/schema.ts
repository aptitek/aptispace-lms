import {
  sqliteTable,
  text,
  integer,
  real,
  primaryKey,
} from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";

/* =========================================================================
 * 1. Administration, Users & Status
 * ========================================================================= */
export const users = sqliteTable("users", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  displayName: text("display_name"),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  avatarUrl: text("avatar_url"),
  githubId: text("github_id").unique(),
  githubEmail: text("github_email"),
  calendarFeedToken: text("calendar_feed_token")
    .unique()
    .$defaultFn(() => crypto.randomUUID()),
  isOnline: integer("is_online", { mode: "boolean" }).notNull().default(false),
  lastSeenAt: integer("last_seen_at", { mode: "timestamp" }),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const institutions = sqliteTable("institutions", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  type: text("type", { enum: ["academic", "company"] })
    .notNull()
    .default("academic"),
  logoUrl: text("logo_url"),
  emailDomain: text("email_domain"),
  usernamePattern: text("username_pattern").default("{first}.{last}"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const cohorts = sqliteTable("cohorts", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  institutionId: text("institution_id")
    .notNull()
    .references(() => institutions.id, { onDelete: "cascade" }),
  diploma: text("diploma"),
  year: integer("year"),
  tags: text("tags", { mode: "json" }).$type<string[]>(),
  description: text("description"),
  startDate: integer("start_date", { mode: "timestamp" }),
  endDate: integer("end_date", { mode: "timestamp" }),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const affiliations = sqliteTable("affiliations", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  institutionId: text("institution_id")
    .notNull()
    .references(() => institutions.id, { onDelete: "cascade" }),
  cohortId: text("cohort_id").references(() => cohorts.id, {
    onDelete: "set null",
  }),
  email: text("email").notNull(),
  role: text("role", { enum: ["admin", "instructor", "student"] })
    .notNull()
    .default("student"),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

/* =========================================================================
 * 2. Groups (Team Aggregations & Collective Progression)
 * ========================================================================= */
export const groups = sqliteTable("groups", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  cohortId: text("cohort_id")
    .notNull()
    .references(() => cohorts.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  currencyPoints: real("currency_points").notNull().default(0),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const groupMembers = sqliteTable(
  "group_members",
  {
    groupId: text("group_id")
      .notNull()
      .references(() => groups.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    joinedAt: integer("joined_at", { mode: "timestamp" })
      .notNull()
      .$defaultFn(() => new Date()),
  },
  (table) => [primaryKey({ columns: [table.groupId, table.userId] })],
);

/* =========================================================================
 * 3. Roguelike Modules & Activities (Replaces Courses/Sessions)
 * ========================================================================= */
export const modules = sqliteTable("modules", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  cohortId: text("cohort_id")
    .notNull()
    .references(() => cohorts.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const moduleActivities = sqliteTable("module_activities", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  moduleId: text("module_id")
    .notNull()
    .references(() => modules.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  range: text("range", { enum: ["cohort", "group", "student"] }).notNull(),
  pedagogicalValue: real("pedagogical_value").notNull().default(0),
  rewardValue: real("reward_value").notNull().default(0),
  powerValue: real("power_value").notNull().default(0),
  resourceUrls: text("resource_urls", { mode: "json" }).$type<string[]>(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

/* =========================================================================
 * 4. Map State Machine & Progression
 * ========================================================================= */
export const activityTransitions = sqliteTable("activity_transitions", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  fromActivityId: text("from_activity_id").references(
    () => moduleActivities.id,
    { onDelete: "cascade" },
  ),
  toActivityId: text("to_activity_id")
    .notNull()
    .references(() => moduleActivities.id, { onDelete: "cascade" }),
});

export const mapPositions = sqliteTable("map_positions", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  activityId: text("activity_id")
    .notNull()
    .references(() => moduleActivities.id, { onDelete: "cascade" }),
  cohortId: text("cohort_id").references(() => cohorts.id, {
    onDelete: "cascade",
  }),
  groupId: text("group_id").references(() => groups.id, {
    onDelete: "cascade",
  }),
  userId: text("user_id").references(() => users.id, { onDelete: "cascade" }),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const activityVotes = sqliteTable("activity_votes", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  groupId: text("group_id")
    .notNull()
    .references(() => groups.id, { onDelete: "cascade" }),
  targetActivityId: text("target_activity_id")
    .notNull()
    .references(() => moduleActivities.id, { onDelete: "cascade" }),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  vote: integer("vote", { mode: "boolean" }).notNull().default(true),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

/* =========================================================================
 * 5. Fights & Card Deck Mechanisms
 * ========================================================================= */
export const fights = sqliteTable("fights", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  activityId: text("activity_id")
    .notNull()
    .references(() => moduleActivities.id, { onDelete: "cascade" }),
  enemyName: text("enemy_name").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const fightPhases = sqliteTable("fight_phases", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  fightId: text("fight_id")
    .notNull()
    .references(() => fights.id, { onDelete: "cascade" }),
  phaseOrder: integer("phase_order").notNull(),
  powerRequired: real("power_required").notNull(),
});

export const studentDecks = sqliteTable(
  "student_decks",
  {
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    activityId: text("activity_id")
      .notNull()
      .references(() => moduleActivities.id, { onDelete: "cascade" }),
    acquiredAt: integer("acquired_at", { mode: "timestamp" })
      .notNull()
      .$defaultFn(() => new Date()),
  },
  (table) => [primaryKey({ columns: [table.userId, table.activityId] })],
);

/* =========================================================================
 * 6. System Traceability
 * ========================================================================= */
export const auditLogs = sqliteTable("audit_logs", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  tableName: text("table_name").notNull(),
  recordId: text("record_id").notNull(),
  action: text("action", { enum: ["INSERT", "UPDATE", "DELETE"] }).notNull(),
  userId: text("user_id").references(() => users.id, { onDelete: "set null" }),
  oldValues: text("old_values"),
  newValues: text("new_values"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const errorReports = sqliteTable("error_reports", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  message: text("message").notNull(),
  stack: text("stack"),
  severity: text("severity", {
    enum: ["info", "warning", "error", "critical", "security"],
  })
    .notNull()
    .default("error"),
  statusCode: integer("status_code"),
  source: text("source").default("client"),
  url: text("url"),
  path: text("path"),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  contextData: text("context_data"),
  userId: text("user_id").references(() => users.id, { onDelete: "set null" }),
  status: text("status", {
    enum: ["open", "investigating", "resolved", "ignored"],
  })
    .notNull()
    .default("open"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

/* =========================================================================
 * Relations Definitions
 * ========================================================================= */
export const usersRelations = relations(users, ({ many }) => ({
  affiliations: many(affiliations),
  groupMemberships: many(groupMembers),
  deckCards: many(studentDecks),
  mapPositions: many(mapPositions),
  auditLogs: many(auditLogs),
  errorReports: many(errorReports),
}));

export const institutionsRelations = relations(institutions, ({ many }) => ({
  cohorts: many(cohorts),
  affiliations: many(affiliations),
}));

export const cohortsRelations = relations(cohorts, ({ one, many }) => ({
  institution: one(institutions, {
    fields: [cohorts.institutionId],
    references: [institutions.id],
  }),
  affiliations: many(affiliations),
  modules: many(modules),
  groups: many(groups),
  mapPositions: many(mapPositions),
}));

export const affiliationsRelations = relations(affiliations, ({ one }) => ({
  user: one(users, { fields: [affiliations.userId], references: [users.id] }),
  institution: one(institutions, {
    fields: [affiliations.institutionId],
    references: [institutions.id],
  }),
  cohort: one(cohorts, {
    fields: [affiliations.cohortId],
    references: [cohorts.id],
  }),
}));

export const groupsRelations = relations(groups, ({ one, many }) => ({
  cohort: one(cohorts, { fields: [groups.cohortId], references: [cohorts.id] }),
  members: many(groupMembers),
  mapPositions: many(mapPositions),
  activityVotes: many(activityVotes),
}));

export const groupMembersRelations = relations(groupMembers, ({ one }) => ({
  group: one(groups, {
    fields: [groupMembers.groupId],
    references: [groups.id],
  }),
  user: one(users, { fields: [groupMembers.userId], references: [users.id] }),
}));

export const modulesRelations = relations(modules, ({ one, many }) => ({
  cohort: one(cohorts, {
    fields: [modules.cohortId],
    references: [cohorts.id],
  }),
  activities: many(moduleActivities),
}));

export const moduleActivitiesRelations = relations(
  moduleActivities,
  ({ one, many }) => ({
    module: one(modules, {
      fields: [moduleActivities.moduleId],
      references: [modules.id],
    }),
    outgoingTransitions: many(activityTransitions, {
      relationName: "fromActivity",
    }),
    incomingTransitions: many(activityTransitions, {
      relationName: "toActivity",
    }),
    fights: many(fights),
    mapPositions: many(mapPositions),
    deckCards: many(studentDecks),
  }),
);

export const activityTransitionsRelations = relations(
  activityTransitions,
  ({ one }) => ({
    fromActivity: one(moduleActivities, {
      fields: [activityTransitions.fromActivityId],
      references: [moduleActivities.id],
      relationName: "fromActivity",
    }),
    toActivity: one(moduleActivities, {
      fields: [activityTransitions.toActivityId],
      references: [moduleActivities.id],
      relationName: "toActivity",
    }),
  }),
);

export const mapPositionsRelations = relations(mapPositions, ({ one }) => ({
  activity: one(moduleActivities, {
    fields: [mapPositions.activityId],
    references: [moduleActivities.id],
  }),
  cohort: one(cohorts, {
    fields: [mapPositions.cohortId],
    references: [cohorts.id],
  }),
  group: one(groups, {
    fields: [mapPositions.groupId],
    references: [groups.id],
  }),
  user: one(users, { fields: [mapPositions.userId], references: [users.id] }),
}));

export const activityVotesRelations = relations(activityVotes, ({ one }) => ({
  group: one(groups, {
    fields: [activityVotes.groupId],
    references: [groups.id],
  }),
  targetActivity: one(moduleActivities, {
    fields: [activityVotes.targetActivityId],
    references: [moduleActivities.id],
  }),
  user: one(users, { fields: [activityVotes.userId], references: [users.id] }),
}));

export const fightsRelations = relations(fights, ({ one, many }) => ({
  activity: one(moduleActivities, {
    fields: [fights.activityId],
    references: [moduleActivities.id],
  }),
  phases: many(fightPhases),
}));

export const fightPhasesRelations = relations(fightPhases, ({ one }) => ({
  fight: one(fights, {
    fields: [fightPhases.fightId],
    references: [fights.id],
  }),
}));

export const studentDecksRelations = relations(studentDecks, ({ one }) => ({
  user: one(users, { fields: [studentDecks.userId], references: [users.id] }),
  activity: one(moduleActivities, {
    fields: [studentDecks.activityId],
    references: [moduleActivities.id],
  }),
}));

export const auditLogsRelations = relations(auditLogs, ({ one }) => ({
  user: one(users, { fields: [auditLogs.userId], references: [users.id] }),
}));

export const errorReportsRelations = relations(errorReports, ({ one }) => ({
  user: one(users, { fields: [errorReports.userId], references: [users.id] }),
}));

/* =========================================================================
 * Inferred Types
 * ========================================================================= */
export type User = Omit<typeof users.$inferSelect, "calendarFeedToken"> & {
  calendarFeedToken?: string | null;
};
export type NewUser = typeof users.$inferInsert;

export type Institution = typeof institutions.$inferSelect;
export type NewInstitution = typeof institutions.$inferInsert;

export type Cohort = typeof cohorts.$inferSelect;
export type NewCohort = typeof cohorts.$inferInsert;

export type Affiliation = typeof affiliations.$inferSelect;
export type NewAffiliation = typeof affiliations.$inferInsert;

export type Group = typeof groups.$inferSelect;
export type NewGroup = typeof groups.$inferInsert;

export type GroupMember = typeof groupMembers.$inferSelect;
export type NewGroupMember = typeof groupMembers.$inferInsert;

export type Module = typeof modules.$inferSelect;
export type NewModule = typeof modules.$inferInsert;

export type ModuleActivity = typeof moduleActivities.$inferSelect;
export type NewModuleActivity = typeof moduleActivities.$inferInsert;

export type ActivityTransition = typeof activityTransitions.$inferSelect;
export type NewActivityTransition = typeof activityTransitions.$inferInsert;

export type MapPosition = typeof mapPositions.$inferSelect;
export type NewMapPosition = typeof mapPositions.$inferInsert;

export type ActivityVote = typeof activityVotes.$inferSelect;
export type NewActivityVote = typeof activityVotes.$inferInsert;

export type Fight = typeof fights.$inferSelect;
export type NewFight = typeof fights.$inferInsert;

export type FightPhase = typeof fightPhases.$inferSelect;
export type NewFightPhase = typeof fightPhases.$inferInsert;

export type StudentDeck = typeof studentDecks.$inferSelect;
export type NewStudentDeck = typeof studentDecks.$inferInsert;

export type AuditLog = typeof auditLogs.$inferSelect;
export type NewAuditLog = typeof auditLogs.$inferInsert;

export type ErrorReport = typeof errorReports.$inferSelect;
export type NewErrorReport = typeof errorReports.$inferInsert;
