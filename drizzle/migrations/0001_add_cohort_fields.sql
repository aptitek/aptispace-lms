ALTER TABLE `cohorts` ADD `diploma` text;--> statement-breakpoint
ALTER TABLE `cohorts` ADD `year` integer;--> statement-breakpoint
ALTER TABLE `cohorts` ADD `tags` text;--> statement-breakpoint
ALTER TABLE `institutions` ADD `email_domain` text;--> statement-breakpoint
ALTER TABLE `institutions` ADD `username_pattern` text DEFAULT '{first}.{last}';