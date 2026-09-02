import {
  sqliteTable,
  text,
  integer,
  real,
  primaryKey,
} from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";

/* =========================================================================
 * 1. Administration & Utilisateurs (Core)
 * ========================================================================= */

export const users = sqliteTable("users", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  displayName: text("display_name"), // Defaults to FirstName + ' ' + LastName if not set
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  githubId: text("github_id").unique(),
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
  slug: text("slug").notNull().unique(),
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
  diploma: text("diploma"), // "C", "F", "L", "B", "M", "D"
  year: integer("year"), // 0 / null = no year, 1 = 1st year, etc.
  tags: text("tags", { mode: "json" }).$type<string[]>(), // JSON array e.g. ["AI", "Dev"]
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

// Remplace enrollments et memberships
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
  cohortId: text("cohort_id") // Optionnel : un prof ou un admin peut ne pas être lié à une cohorte
    .references(() => cohorts.id, { onDelete: "set null" }),
  email: text("email").notNull(), // Email spécifique à ce contexte (institutionnel ou personnel pour Aptitek)
  role: text("role", { enum: ["admin", "instructor", "student"] })
    .notNull()
    .default("student"),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true), // Permet de garder l'historique en cas de réorientation
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

/* =========================================================================
 * 2. Ingénierie Pédagogique (Courses & Modules)
 * ========================================================================= */

export const courses = sqliteTable("courses", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  title: text("title").notNull(),
  description: text("description"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const modules = sqliteTable("modules", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  courseId: text("course_id")
    .notNull()
    .references(() => courses.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  type: text("type", {
    enum: ["lecture", "lab", "game", "evaluation", "project"],
  }).notNull(),
  contentUrl: text("content_url"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const tags = sqliteTable("tags", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull().unique(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const moduleTags = sqliteTable(
  "module_tags",
  {
    moduleId: text("module_id")
      .notNull()
      .references(() => modules.id, { onDelete: "cascade" }),
    tagId: text("tag_id")
      .notNull()
      .references(() => tags.id, { onDelete: "cascade" }),
  },
  (table) => [primaryKey({ columns: [table.moduleId, table.tagId] })],
);

/* =========================================================================
 * 3. Planification & Réalisation (Planning)
 * ========================================================================= */

export const sessions = sqliteTable("sessions", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  courseId: text("course_id")
    .notNull()
    .references(() => courses.id, { onDelete: "cascade" }),
  cohortId: text("cohort_id")
    .notNull()
    .references(() => cohorts.id, { onDelete: "cascade" }),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const seances = sqliteTable("seances", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  sessionId: text("session_id")
    .notNull()
    .references(() => sessions.id, { onDelete: "cascade" }),
  startTime: integer("start_time", { mode: "timestamp" }).notNull(),
  endTime: integer("end_time", { mode: "timestamp" }).notNull(),
  location: text("location"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const groups = sqliteTable("groups", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  sessionId: text("session_id")
    .notNull()
    .references(() => sessions.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
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
 * 4. Rendus & Évaluations (Assessments)
 * ========================================================================= */

// La présence d'une soumission définit implicitement que le module est évalué
export const submissions = sqliteTable("submissions", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  moduleId: text("module_id")
    .notNull()
    .references(() => modules.id, { onDelete: "cascade" }),
  userId: text("user_id").references(() => users.id, { onDelete: "set null" }),
  groupId: text("group_id").references(() => groups.id, {
    onDelete: "set null",
  }),
  submissionUrl: text("submission_url").notNull(),
  submissionType: text("submission_type", { enum: ["individual", "group"] })
    .notNull()
    .default("individual"),
  submittedAt: integer("submitted_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const DEFAULT_MAX_POINTS = 20;

export const criteria = sqliteTable("criteria", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  moduleId: text("module_id")
    .notNull()
    .references(() => modules.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  maxPoints: real("max_points").notNull().default(DEFAULT_MAX_POINTS),
  coefficient: real("coefficient").notNull().default(1),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const grades = sqliteTable("grades", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  criteriaId: text("criteria_id")
    .notNull()
    .references(() => criteria.id, { onDelete: "cascade" }),
  submissionId: text("submission_id")
    .notNull()
    .references(() => submissions.id, { onDelete: "cascade" }),
  score: real("score").notNull(),
  feedback: text("feedback"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

/* =========================================================================
 * 5. Traçabilité (System)
 * ========================================================================= */

// Réservé aux actions lourdes / critiques (changements de notes, suppressions, etc.)
export const auditLogs = sqliteTable("audit_logs", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  tableName: text("table_name").notNull(),
  recordId: text("record_id").notNull(),
  action: text("action", { enum: ["INSERT", "UPDATE", "DELETE"] }).notNull(),
  userId: text("user_id").references(() => users.id, { onDelete: "set null" }),
  oldValues: text("old_values"), // JSON serialized
  newValues: text("new_values"), // JSON serialized
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

// Suivi télémétrique des erreurs, alertes et infractions de sécurité (403/401/500/exceptions)
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
  contextData: text("context_data"), // Serialized JSON metadata
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
  submissions: many(submissions),
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
  sessions: many(sessions),
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

export const coursesRelations = relations(courses, ({ many }) => ({
  modules: many(modules),
  sessions: many(sessions),
}));

export const modulesRelations = relations(modules, ({ one, many }) => ({
  course: one(courses, {
    fields: [modules.courseId],
    references: [courses.id],
  }),
  moduleTags: many(moduleTags),
  criteria: many(criteria),
  submissions: many(submissions),
}));

export const tagsRelations = relations(tags, ({ many }) => ({
  moduleTags: many(moduleTags),
}));

export const moduleTagsRelations = relations(moduleTags, ({ one }) => ({
  module: one(modules, {
    fields: [moduleTags.moduleId],
    references: [modules.id],
  }),
  tag: one(tags, { fields: [moduleTags.tagId], references: [tags.id] }),
}));

export const sessionsRelations = relations(sessions, ({ one, many }) => ({
  course: one(courses, {
    fields: [sessions.courseId],
    references: [courses.id],
  }),
  cohort: one(cohorts, {
    fields: [sessions.cohortId],
    references: [cohorts.id],
  }),
  seances: many(seances),
  groups: many(groups),
}));

export const seancesRelations = relations(seances, ({ one }) => ({
  session: one(sessions, {
    fields: [seances.sessionId],
    references: [sessions.id],
  }),
}));

export const groupsRelations = relations(groups, ({ one, many }) => ({
  session: one(sessions, {
    fields: [groups.sessionId],
    references: [sessions.id],
  }),
  members: many(groupMembers),
  submissions: many(submissions),
}));

export const groupMembersRelations = relations(groupMembers, ({ one }) => ({
  group: one(groups, {
    fields: [groupMembers.groupId],
    references: [groups.id],
  }),
  user: one(users, { fields: [groupMembers.userId], references: [users.id] }),
}));

export const submissionsRelations = relations(submissions, ({ one, many }) => ({
  module: one(modules, {
    fields: [submissions.moduleId],
    references: [modules.id],
  }),
  user: one(users, { fields: [submissions.userId], references: [users.id] }),
  group: one(groups, {
    fields: [submissions.groupId],
    references: [groups.id],
  }),
  grades: many(grades),
}));

export const criteriaRelations = relations(criteria, ({ one, many }) => ({
  module: one(modules, {
    fields: [criteria.moduleId],
    references: [modules.id],
  }),
  grades: many(grades),
}));

export const gradesRelations = relations(grades, ({ one }) => ({
  criterion: one(criteria, {
    fields: [grades.criteriaId],
    references: [criteria.id],
  }),
  submission: one(submissions, {
    fields: [grades.submissionId],
    references: [submissions.id],
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

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Institution = typeof institutions.$inferSelect;
export type NewInstitution = typeof institutions.$inferInsert;

export type Cohort = typeof cohorts.$inferSelect;
export type NewCohort = typeof cohorts.$inferInsert;

export type Affiliation = typeof affiliations.$inferSelect;
export type NewAffiliation = typeof affiliations.$inferInsert;

export type Course = typeof courses.$inferSelect;
export type NewCourse = typeof courses.$inferInsert;

export type Module = typeof modules.$inferSelect;
export type NewModule = typeof modules.$inferInsert;

export type Tag = typeof tags.$inferSelect;
export type NewTag = typeof tags.$inferInsert;

export type ModuleTag = typeof moduleTags.$inferSelect;
export type NewModuleTag = typeof moduleTags.$inferInsert;

export type Session = typeof sessions.$inferSelect;
export type NewSession = typeof sessions.$inferInsert;

export type Seance = typeof seances.$inferSelect;
export type NewSeance = typeof seances.$inferInsert;

export type Group = typeof groups.$inferSelect;
export type NewGroup = typeof groups.$inferInsert;

export type GroupMember = typeof groupMembers.$inferSelect;
export type NewGroupMember = typeof groupMembers.$inferInsert;

export type Submission = typeof submissions.$inferSelect;
export type NewSubmission = typeof submissions.$inferInsert;

export type Criterion = typeof criteria.$inferSelect;
export type NewCriterion = typeof criteria.$inferInsert;

export type Grade = typeof grades.$inferSelect;
export type NewGrade = typeof grades.$inferInsert;

export type AuditLog = typeof auditLogs.$inferSelect;
export type NewAuditLog = typeof auditLogs.$inferInsert;

export type ErrorReport = typeof errorReports.$inferSelect;
export type NewErrorReport = typeof errorReports.$inferInsert;
