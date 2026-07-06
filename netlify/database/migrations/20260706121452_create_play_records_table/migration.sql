CREATE TABLE "play_records" (
	"id" serial PRIMARY KEY,
	"message" text NOT NULL,
	"score" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
