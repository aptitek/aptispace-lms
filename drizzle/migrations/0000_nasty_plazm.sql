CREATE TABLE `activity_transitions` (
	`id` text PRIMARY KEY NOT NULL,
	`from_activity_id` text,
	`to_activity_id` text NOT NULL,
	FOREIGN KEY (`from_activity_id`) REFERENCES `module_activities`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`to_activity_id`) REFERENCES `module_activities`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `activity_votes` (
	`id` text PRIMARY KEY NOT NULL,
	`group_id` text NOT NULL,
	`target_activity_id` text NOT NULL,
	`user_id` text NOT NULL,
	`vote` integer DEFAULT true NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`group_id`) REFERENCES `groups`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`target_activity_id`) REFERENCES `module_activities`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `affiliations` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`institution_id` text NOT NULL,
	`cohort_id` text,
	`email` text NOT NULL,
	`role` text DEFAULT 'student' NOT NULL,
	`is_active` integer DEFAULT true NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`institution_id`) REFERENCES `institutions`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`cohort_id`) REFERENCES `cohorts`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE TABLE `audit_logs` (
	`id` text PRIMARY KEY NOT NULL,
	`table_name` text NOT NULL,
	`record_id` text NOT NULL,
	`action` text NOT NULL,
	`user_id` text,
	`old_values` text,
	`new_values` text,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE TABLE `cohorts` (
	`id` text PRIMARY KEY NOT NULL,
	`institution_id` text NOT NULL,
	`diploma` text,
	`year` integer,
	`tags` text,
	`description` text,
	`start_date` integer,
	`end_date` integer,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`institution_id`) REFERENCES `institutions`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `error_reports` (
	`id` text PRIMARY KEY NOT NULL,
	`message` text NOT NULL,
	`stack` text,
	`severity` text DEFAULT 'error' NOT NULL,
	`status_code` integer,
	`source` text DEFAULT 'client',
	`url` text,
	`path` text,
	`ip_address` text,
	`user_agent` text,
	`context_data` text,
	`user_id` text,
	`status` text DEFAULT 'open' NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE TABLE `fight_phases` (
	`id` text PRIMARY KEY NOT NULL,
	`fight_id` text NOT NULL,
	`phase_order` integer NOT NULL,
	`power_required` real NOT NULL,
	FOREIGN KEY (`fight_id`) REFERENCES `fights`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `fights` (
	`id` text PRIMARY KEY NOT NULL,
	`activity_id` text NOT NULL,
	`enemy_name` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`activity_id`) REFERENCES `module_activities`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `group_members` (
	`group_id` text NOT NULL,
	`user_id` text NOT NULL,
	`joined_at` integer NOT NULL,
	PRIMARY KEY(`group_id`, `user_id`),
	FOREIGN KEY (`group_id`) REFERENCES `groups`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `groups` (
	`id` text PRIMARY KEY NOT NULL,
	`cohort_id` text NOT NULL,
	`name` text NOT NULL,
	`currency_points` real DEFAULT 0 NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`cohort_id`) REFERENCES `cohorts`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `institutions` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`type` text DEFAULT 'academic' NOT NULL,
	`logo_url` text,
	`email_domain` text,
	`username_pattern` text DEFAULT '{first}.{last}',
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `map_positions` (
	`id` text PRIMARY KEY NOT NULL,
	`activity_id` text NOT NULL,
	`cohort_id` text,
	`group_id` text,
	`user_id` text,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`activity_id`) REFERENCES `module_activities`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`cohort_id`) REFERENCES `cohorts`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`group_id`) REFERENCES `groups`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `module_activities` (
	`id` text PRIMARY KEY NOT NULL,
	`module_id` text NOT NULL,
	`title` text NOT NULL,
	`range` text NOT NULL,
	`pedagogical_value` real DEFAULT 0 NOT NULL,
	`reward_value` real DEFAULT 0 NOT NULL,
	`power_value` real DEFAULT 0 NOT NULL,
	`resource_urls` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`module_id`) REFERENCES `modules`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `modules` (
	`id` text PRIMARY KEY NOT NULL,
	`cohort_id` text NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`cohort_id`) REFERENCES `cohorts`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `student_decks` (
	`user_id` text NOT NULL,
	`activity_id` text NOT NULL,
	`acquired_at` integer NOT NULL,
	PRIMARY KEY(`user_id`, `activity_id`),
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`activity_id`) REFERENCES `module_activities`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`display_name` text,
	`first_name` text NOT NULL,
	`last_name` text NOT NULL,
	`avatar_url` text,
	`github_id` text,
	`github_email` text,
	`calendar_feed_token` text,
	`is_online` integer DEFAULT false NOT NULL,
	`last_seen_at` integer,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_github_id_unique` ON `users` (`github_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_calendar_feed_token_unique` ON `users` (`calendar_feed_token`);