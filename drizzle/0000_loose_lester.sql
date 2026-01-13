CREATE TYPE "public"."role" AS ENUM('user', 'manager', 'admin');--> statement-breakpoint
CREATE TYPE "public"."status" AS ENUM('draft', 'in_progress', 'completed');--> statement-breakpoint
CREATE TABLE "todos" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text,
	"status" "status" DEFAULT 'draft' NOT NULL,
	"userId" varchar(255) NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"name" varchar(255),
	"email" varchar(255) NOT NULL,
	"emailVerified" timestamp,
	"image" varchar(255),
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"role" "role" DEFAULT 'user' NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
