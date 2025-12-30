import { create } from "zustand";
import { generateRandomWords } from "../_utils/generateRandomWords";
import { calculateStats, calculateXp } from "../_utils/gameStats";
import { saveGameStats, updateUserXp, updateTimeAndGamesStarted } from "~/server/db/actions";

export type GameStatus = "idle" | "playing" | "finished";
export type GameMode = "words" | "time";
export type WordSet = "oxford3000" | "common200";

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

export interface WpmPerSecond {
  time: number;
  wpm: number;
  rawWpm: number;
}

const initialLetterCount: LetterCount = {
  correct: 0,
  incorrect: 0,
  extra: 0,
  missed: 0,
};

const initialStats: GameStats = {
  wpm: 0,
  rawWpm: 0,
  accuracy: 0,
  correct: 0,
  incorrect: 0,
  extra: 0,
  missed: 0,
};

interface GameState {
  isInitialized: boolean;
  status: GameStatus;
  mode: GameMode;
  wordSet: WordSet;
  wordCount: number;
  timeLimit: number;
  isRanked: boolean;
  userId: string | null;
  sampleText: string[];
  completedWords: string[];
  letterCount: LetterCount;
  time: number;
  wpmPerSecond: WpmPerSecond[];
  isTextChanging: boolean;
  stats: GameStats;
  xp: number;
}

interface GameActions {
  initialize: (userId: string | null, initialText?: string[]) => void;
  startGame: () => void;
  endGame: () => Promise<void>;
  resetGame: () => Promise<void>;
  tick: () => void;
  completeWord: (word: string, newLetterCount: LetterCount) => void;
  undoWord: (letterCountToSubtract: LetterCount) => void;
  setMode: (mode: GameMode) => void;
  setWordCount: (count: number) => void;
  setTimeLimit: (limit: number) => void;
  setWordSet: (wordSet: WordSet) => void;
  setRanked: (isRanked: boolean) => void;
  generateNewText: (withAnimation?: boolean) => void;
}

export type GameStore = GameState & GameActions;

export const useGameStore = create<GameStore>((set, get) => ({
  isInitialized: false,
  status: "idle",
  mode: "words",
  wordSet: "common200",
  wordCount: 10,
  timeLimit: 15,
  isRanked: false,
  userId: null,
  sampleText: [],
  completedWords: [],
  letterCount: initialLetterCount,
  time: 0,
  wpmPerSecond: [],
  isTextChanging: false,
  stats: initialStats,
  xp: 0,

  initialize: (userId, initialText) => {
    const text = initialText ?? generateRandomWords(10, "common200").split(" ");
    set({
      isInitialized: true,
      userId,
      isRanked: userId !== null,
      sampleText: text,
      status: "idle",
      completedWords: [],
      letterCount: initialLetterCount,
      time: 0,
      wpmPerSecond: [],
      stats: initialStats,
      xp: 0,
    });
  },

  startGame: () => {
    const { mode, timeLimit } = get();
    set({
      status: "playing",
      time: mode === "time" ? timeLimit : 0,
      wpmPerSecond: [],
    });
  },

  endGame: async () => {
    const state = get();
    if (state.status === "finished") return;

    const effectiveTime = state.mode === "time" ? state.timeLimit : state.time;

    const stats = calculateStats({
      letterCount: state.letterCount,
      completedWords: state.completedWords,
      timeInSeconds: effectiveTime,
      mode: state.mode,
      timeLimit: state.timeLimit,
    });

    const xp = calculateXp({
      letterCount: state.letterCount,
      completedWords: state.completedWords,
      wpm: stats.wpm,
      accuracy: stats.accuracy,
    });

    set({ status: "finished", stats, xp });

    if (state.userId) {
      try {
        await updateUserXp(xp);
        if (state.isRanked) {
          await saveGameStats({
            userId: state.userId,
            ...stats,
            mode: state.mode,
            timeLimit: state.timeLimit,
            wordCount: state.wordCount,
            time: effectiveTime,
          });
        }
      } catch (error) {
        console.error("Error saving game stats:", error);
      }
    }
  },

  resetGame: async () => {
    const state = get();

    // Trigger fade-out before any async work
    set({ isTextChanging: true });

    if (state.status === "playing" && state.isRanked && state.userId) {
      const elapsedTime =
        state.mode === "words" ? state.time : state.timeLimit - state.time;
      updateTimeAndGamesStarted(elapsedTime).catch((error) => {
        console.error("Error updating time:", error);
      });
    }

    // Wait for CSS fade-out to complete before updating state
    await new Promise<void>((resolve) => {
      setTimeout(() => {
        const currentState = get();
        const newText = generateRandomWords(currentState.wordCount, currentState.wordSet).split(" ");
        const newTime = currentState.mode === "time" ? currentState.timeLimit : 0;

        set({
          status: "idle",
          sampleText: newText,
          completedWords: [],
          letterCount: initialLetterCount,
          time: newTime,
          wpmPerSecond: [],
          stats: initialStats,
          xp: 0,
        });

        setTimeout(() => {
          set({ isTextChanging: false });
          resolve();
        }, 50);
      }, 180);
    });
  },

  tick: () => {
    const state = get();
    if (state.status !== "playing") return;

    const newTime =
      state.mode === "words" ? state.time + 0.5 : Math.max(0, state.time - 0.5);

    const elapsedTime =
      state.mode === "time" ? state.timeLimit - newTime : newTime;

    let newWpmPerSecond = state.wpmPerSecond;
    if (elapsedTime > 0) {
      const timeInMinutes = elapsedTime / 60;
      const spaceCount = state.completedWords.length > 0 ? state.completedWords.length - 1 : 0;
      const totalCorrectChars = state.letterCount.correct + spaceCount;
      const totalChars =
        state.letterCount.correct +
        state.letterCount.incorrect +
        state.letterCount.extra +
        state.letterCount.missed +
        spaceCount;

      newWpmPerSecond = [
        ...state.wpmPerSecond,
        {
          time: elapsedTime,
          wpm: totalCorrectChars / 5 / timeInMinutes,
          rawWpm: totalChars / 5 / timeInMinutes,
        },
      ];
    }

    set({ time: newTime, wpmPerSecond: newWpmPerSecond });

    if (state.mode === "time" && newTime <= 0) {
      void get().endGame();
    }
  },

  completeWord: (word, newLetterCount) => {
    const state = get();
    set({
      completedWords: [...state.completedWords, word],
      letterCount: {
        correct: state.letterCount.correct + newLetterCount.correct,
        incorrect: state.letterCount.incorrect + newLetterCount.incorrect,
        extra: state.letterCount.extra + newLetterCount.extra,
        missed: state.letterCount.missed + newLetterCount.missed,
      },
    });
  },

  undoWord: (letterCountToSubtract) => {
    const state = get();
    if (state.completedWords.length === 0) return;

    set({
      completedWords: state.completedWords.slice(0, -1),
      letterCount: {
        correct: state.letterCount.correct - letterCountToSubtract.correct,
        incorrect: state.letterCount.incorrect - letterCountToSubtract.incorrect,
        extra: state.letterCount.extra - letterCountToSubtract.extra,
        missed: state.letterCount.missed - letterCountToSubtract.missed,
      },
    });
  },

  setMode: (mode) => {
    const state = get();
    set({ isTextChanging: true });

    setTimeout(() => {
      if (mode === "time") {
        const newText = generateRandomWords(50, state.wordSet).split(" ");
        set({
          mode,
          timeLimit: 15,
          wordCount: 50,
          time: 15,
          status: "idle",
          sampleText: newText,
          completedWords: [],
          letterCount: initialLetterCount,
          wpmPerSecond: [],
          stats: initialStats,
        });
      } else {
        const newText = generateRandomWords(10, state.wordSet).split(" ");
        set({
          mode,
          wordCount: 10,
          time: 0,
          timeLimit: 15,
          status: "idle",
          sampleText: newText,
          completedWords: [],
          letterCount: initialLetterCount,
          wpmPerSecond: [],
          stats: initialStats,
        });
      }

      setTimeout(() => set({ isTextChanging: false }), 50);
    }, 150);
  },

  setWordCount: (count) => {
    set({ wordCount: count });
    get().generateNewText(true);
  },

  setTimeLimit: (limit) => {
    const { mode, time } = get();
    set({
      timeLimit: limit,
      time: mode === "time" ? limit : time,
    });
  },

  setWordSet: (wordSet) => {
    set({ wordSet });
    get().generateNewText(true);
  },

  setRanked: (isRanked) => {
    set({ isRanked });
  },

  generateNewText: (withAnimation = true) => {
    const { wordCount, wordSet } = get();

    if (withAnimation) {
      set({ isTextChanging: true });
      setTimeout(() => {
        const newText = generateRandomWords(wordCount, wordSet).split(" ");
        set({ sampleText: newText });
        setTimeout(() => set({ isTextChanging: false }), 50);
      }, 150);
    } else {
      const newText = generateRandomWords(wordCount, wordSet).split(" ");
      set({ sampleText: newText, isTextChanging: false });
    }
  },
}));
