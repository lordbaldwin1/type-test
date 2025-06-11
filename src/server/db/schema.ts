import { sql } from "drizzle-orm";
import { index, pgTableCreator } from "drizzle-orm/pg-core";

export const createTable = pgTableCreator((name) => `type-test_${name}`);

export const games = createTable(
  "game",
  (d) => ({
    id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
    userId: d.varchar({ length: 256 }).references(() => users.id),
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

export const users = createTable(
  "user",
  (d) => ({
    id: d.varchar({ length: 256 }).primaryKey(),
    username: d.varchar({ length: 256 }).unique(),
    stayAnonymous: d.boolean().notNull().default(false),
    averageWpm: d.real().notNull(),
    averageAccuracy: d.real().notNull(),
    averageCorrect: d.real().notNull(),
    averageIncorrect: d.real().notNull(),
    averageExtra: d.real().notNull(),
    averageMissed: d.real().notNull(),
    totalGames: d.integer().notNull(),
    highestWpm: d.real().notNull(),
    highestAccuracy: d.real().notNull(),
    highestCorrect: d.real().notNull(),
    highestIncorrect: d.real().notNull(),
    highestExtra: d.real().notNull(),
    highestMissed: d.real().notNull(),
    createdAt: d
      .timestamp({ withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: d
      .timestamp({ withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  }),
  (t) => [index("id_idx").on(t.id)],
);

export type User = typeof users.$inferSelect;
export type Game = typeof games.$inferSelect;
