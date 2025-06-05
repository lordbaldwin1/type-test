import { sql } from "drizzle-orm";
import { index, pgTableCreator } from "drizzle-orm/pg-core";

export const createTable = pgTableCreator((name) => `type-test_${name}`);

export const games = createTable(
  "game",
  (d) => ({
    id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
    userId: d.varchar({ length: 256 }),
    mode: d.varchar({ length: 256 }),
    timeLimit: d.integer(),
    wordCount: d.integer(),
    wpm: d.integer(),
    rawWpm: d.integer(),
    accuracy: d.integer(),
    correct: d.integer(),
    incorrect: d.integer(),
    extra: d.integer(),
    missed: d.integer(),
    createdAt: d
      .timestamp({ withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  }),
  (t) => [index("mode_idx").on(t.mode)],
);
