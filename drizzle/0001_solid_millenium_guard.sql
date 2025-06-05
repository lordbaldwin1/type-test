DROP INDEX "name_idx";--> statement-breakpoint
CREATE INDEX "userid_idx" ON "type-test_game" USING btree ("userId");