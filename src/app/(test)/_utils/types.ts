// =====================================
// Basic Types & Enums
// =====================================

import type { Game, User } from "~/server/db/schema";

export type GameMode = "words" | "time";
export type GameStatus = "before" | "during" | "after" | "restart";
export type SaveStats = "true" | "false";
export type WordSet = "oxford3000" | "common200";

// =====================================
// Core Data Structures
// =====================================

export interface LetterCount {
  correct: number;
  incorrect: number;
  extra: number;
  missed: number;
}

export interface GameStats {
  wpm: number;
  rawWpm: number;
  accuracy: number;
  correct: number;
  incorrect: number;
  extra: number;
  missed: number;
}

export interface wpmPerSecond {
  time: number;
  wpm: number;
  rawWpm: number;
}

export type MaxWpmGameWithUser = Game & { user: User };

// =====================================
// Component Props Interfaces
// =====================================

export interface GameAreaProps {
  mode: GameMode;
  status: GameStatus;
  sampleText: string[];
  completedWords: string[];
  currentWordIndex: number;
  input: string;
  time: number;
  saveStats: SaveStats;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onInputSubmit: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onReset: () => void;
  isTextChanging: boolean;
  inputRef: React.RefObject<HTMLInputElement | null>;
  onInputFocus: () => void;
  onInputBlur: () => void;
  showUi: boolean;
}

export interface GameStatsProps {
  stats: GameStats;
  mode: "words" | "time";
  timeLimit: number;
  time: number;
  onReset: () => void;
  wpmPerSecond: wpmPerSecond[];
}

export interface UseTypingGameProps {
  sampleText: string[];
  gameStatus: GameStatus;
  onGameStart?: () => void;
  onGameComplete?: (
    finalLetterCount: LetterCount,
    finalCompletedWords: string[],
  ) => Promise<void>;
}

export interface GameModeConfigProps {
  mode: GameMode;
  timeLimit: number;
  wordCount: number;
  saveStats: SaveStats;
  showUi: boolean;
  // Generic updater for simple state changes
  updateGameState: (updates: Partial<{ mode: GameMode; timeLimit: number; wordCount: number; saveStats: SaveStats }>) => void;
  // Specific operations for complex logic
  switchMode: (mode: GameMode) => void;
  changeWordCount: (count: number) => void;
  changeTimeLimit: (timeLimit: number) => void;
  resetGame: () => void;
  userId: string | null;
}

export interface WordsetSelectorProps {
  wordCount: number;
  wordSet: WordSet;
  showUi: boolean;
  updateGameState: (updates: Partial<{ wordSet: WordSet }>) => void;
  generateNewText: (
    wordCount: number,
    wordSet: WordSet,
    withAnimation: boolean,
  ) => void;
}

// =====================================
// Utility & Calculation Interfaces
// =====================================

export interface StatsCalculationInput {
  letterCount: LetterCount;
  completedWords: string[];
  timeInSeconds: number;
  mode: "words" | "time";
  timeLimit?: number;
}

