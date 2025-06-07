// =====================================
// Basic Types & Enums
// =====================================

export type GameMode = "words" | "time";
export type GameStatus = "before" | "during" | "after" | "restart";
export type SaveStats = "true" | "false";

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

export interface GameState {
  status: GameStatus;
  mode: GameMode;
  stats: GameStats;
  wordCount: number;
  timeLimit: number;
  sampleText: string[];
  saveStats: SaveStats;
}

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
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onInputSubmit: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onReset: () => void;
}

export interface GameStatsProps {
  stats: GameStats;
  mode: "words" | "time";
  timeLimit: number;
  time: number;
  onReset: () => void;
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
  setGameMode: (mode: GameMode) => void;
  timeLimit: number;
  wordCount: number;
  setTimeLimit: (time: number) => void;
  setWordCount: (count: number) => void;
  resetGameState: () => void;
  saveStats: SaveStats;
  updateSaveStats: (saveStats: SaveStats) => void;
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
