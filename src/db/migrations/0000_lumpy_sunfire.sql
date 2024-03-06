CREATE TABLE IF NOT EXISTS "drizzle_todo"."todo" (
	"id" integer PRIMARY KEY NOT NULL,
	"text" text NOT NULL,
	"done" boolean DEFAULT false NOT NULL
);
