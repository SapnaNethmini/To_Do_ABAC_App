CREATE TYPE "public"."role" AS ENUM('user', 'manager', 'admin');--> statement-breakpoint
CREATE TYPE "public"."status" AS ENUM('draft', 'in_progress', 'completed');--> statement-breakpoint
CREATE TABLE "account" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"accountId" varchar(255) NOT NULL,
	"providerId" varchar(255) NOT NULL,
	"userId" varchar(255) NOT NULL,
	"accessToken" text,
	"refreshToken" text,
	"idToken" text,
	"accessTokenExpiresAt" varchar(255),
	"refreshTokenExpiresAt" varchar(255),
	"scope" text,
	"password" text,
	"createdAt" varchar(255) NOT NULL,
	"updatedAt" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"expiresAt" varchar(255) NOT NULL,
	"token" varchar(255) NOT NULL,
	"createdAt" varchar(255) NOT NULL,
	"updatedAt" varchar(255) NOT NULL,
	"ipAddress" varchar(255),
	"userAgent" text,
	"userId" varchar(255) NOT NULL,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "todos" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text,
	"status" "status" DEFAULT 'draft' NOT NULL,
	"userId" varchar(255) NOT NULL,
	"createdAt" varchar(255) NOT NULL,
	"updatedAt" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"name" varchar(255),
	"email" varchar(255) NOT NULL,
	"emailVerified" varchar(255),
	"image" varchar(255),
	"createdAt" varchar(255) NOT NULL,
	"updatedAt" varchar(255) NOT NULL,
	"role" "role" DEFAULT 'user' NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"identifier" varchar(255) NOT NULL,
	"value" varchar(255) NOT NULL,
	"expiresAt" varchar(255) NOT NULL,
	"createdAt" varchar(255),
	"updatedAt" varchar(255)
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;