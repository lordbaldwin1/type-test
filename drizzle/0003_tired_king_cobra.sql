ALTER TABLE "type-test_user" ADD COLUMN "stayAnonymous" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "type-test_user" ADD COLUMN "averageWpm" real NOT NULL;--> statement-breakpoint
ALTER TABLE "type-test_user" ADD COLUMN "averageAccuracy" real NOT NULL;--> statement-breakpoint
ALTER TABLE "type-test_user" ADD COLUMN "averageCorrect" real NOT NULL;--> statement-breakpoint
ALTER TABLE "type-test_user" ADD COLUMN "averageIncorrect" real NOT NULL;--> statement-breakpoint
ALTER TABLE "type-test_user" ADD COLUMN "averageExtra" real NOT NULL;--> statement-breakpoint
ALTER TABLE "type-test_user" ADD COLUMN "averageMissed" real NOT NULL;--> statement-breakpoint
ALTER TABLE "type-test_user" ADD COLUMN "totalGames" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "type-test_user" ADD COLUMN "highestWpm" real NOT NULL;--> statement-breakpoint
ALTER TABLE "type-test_user" ADD COLUMN "highestAccuracy" real NOT NULL;--> statement-breakpoint
ALTER TABLE "type-test_user" ADD COLUMN "highestCorrect" real NOT NULL;--> statement-breakpoint
ALTER TABLE "type-test_user" ADD COLUMN "highestIncorrect" real NOT NULL;--> statement-breakpoint
ALTER TABLE "type-test_user" ADD COLUMN "highestExtra" real NOT NULL;--> statement-breakpoint
ALTER TABLE "type-test_user" ADD COLUMN "highestMissed" real NOT NULL;