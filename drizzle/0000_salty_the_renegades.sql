CREATE TABLE `camp_memories` (
	`id` text PRIMARY KEY NOT NULL,
	`nickname` text NOT NULL,
	`caption` text NOT NULL,
	`story` text DEFAULT '' NOT NULL,
	`gear` text DEFAULT '' NOT NULL,
	`image_key` text NOT NULL,
	`image_type` text NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`created_at` integer NOT NULL,
	`reviewed_at` integer,
	`consent` integer DEFAULT 1 NOT NULL
);
--> statement-breakpoint
CREATE INDEX `camp_memories_status_created` ON `camp_memories` (`status`,`created_at`);--> statement-breakpoint
CREATE TABLE `camp_memory_limits` (
	`id` text PRIMARY KEY NOT NULL,
	`day` text NOT NULL,
	`count` integer DEFAULT 0 NOT NULL
);
