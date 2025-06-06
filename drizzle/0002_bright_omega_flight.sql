CREATE TABLE "type-test_user" (
	"id" varchar(256) PRIMARY KEY NOT NULL,
	"username" varchar(256),
	"createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
DROP INDEX "userid_idx";--> statement-breakpoint
ALTER TABLE "type-test_game" ADD COLUMN "timeLimit" integer;--> statement-breakpoint
ALTER TABLE "type-test_game" ADD COLUMN "wordCount" integer;--> statement-breakpoint
CREATE INDEX "id_idx" ON "type-test_user" USING btree ("id");--> statement-breakpoint
CREATE INDEX "mode_idx" ON "type-test_game" USING btree ("mode");--> statement-breakpoint
ALTER TABLE "type-test_game" DROP COLUMN "updatedAt";