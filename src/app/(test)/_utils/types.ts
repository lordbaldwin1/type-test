export type {
  GameStatus,
  GameMode,
  WordSet,
  LetterCount,
  GameStats,
  WpmPerSecond,
} from "../_store/gameStore";

export type { WpmPerSecond as wpmPerSecond } from "../_store/gameStore";

import type { Game, User } from "~/server/db/schema";

export type MaxWpmGameWithUser = Game & { user: User };

export interface StatsCalculationInput {
  letterCount: {
    correct: number;
    incorrect: number;
    extra: number;
    missed: number;
  };
  completedWords: string[];
  timeInSeconds: number;
  mode: "words" | "time";
  timeLimit?: number;
}
