CREATE TABLE IF NOT EXISTS `classes` (
	`id` text PRIMARY KEY NOT NULL,
	`session_id` text NOT NULL,
	`instructor_id` text,
	`title` text NOT NULL,
	`description` text,
	`type` text DEFAULT 'lecture' NOT NULL,
	`start_time` integer NOT NULL,
	`end_time` integer NOT NULL,
	`location` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`session_id`) REFERENCES `sessions`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`instructor_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
DROP TABLE IF EXISTS `seances`;--> statement-breakpoint
ALTER TABLE `users` ADD `calendar_feed_token` text;--> statement-breakpoint
CREATE UNIQUE INDEX `users_calendar_feed_token_unique` ON `users` (`calendar_feed_token`);