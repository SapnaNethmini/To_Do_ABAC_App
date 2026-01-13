CREATE TABLE `todos` (
	`id` varchar(255) NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`status` enum('draft','in_progress','completed') NOT NULL DEFAULT 'draft',
	`userId` varchar(255) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `todos_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` varchar(255) NOT NULL,
	`name` varchar(255),
	`email` varchar(255) NOT NULL,
	`emailVerified` timestamp,
	`image` varchar(255),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()),
	`role` enum('user','manager','admin') NOT NULL DEFAULT 'user',
	CONSTRAINT `user_id` PRIMARY KEY(`id`),
	CONSTRAINT `user_email_unique` UNIQUE(`email`)
);
