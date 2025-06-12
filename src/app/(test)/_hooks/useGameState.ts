import { useCallback, useState, useRef, useEffect } from "react";
import { generateRandomWords } from "../_utils/generateRandomWords";
import type {
  GameStats,
  GameStatus,
  GameMode,
  SaveStats,
  WordSet,
  wpmPerSecond,
  LetterCount,
} from "../_utils/types";
import { updateTimeAndGamesStarted } from "~/server/db/actions";

const initialStats: GameStats = {
  wpm: 0,
  rawWpm: 0,
  accuracy: 0,
  correct: 0,
  incorrect: 0,
  extra: 0,
  missed: 0,
};

const initialLetterCount: LetterCount = {
  correct: 0,
  incorrect: 0,
  extra: 0,
  missed: 0,
};

interface GameState {
  status: GameStatus;
  mode: GameMode;
  stats: GameStats;
  wordCount: number;
  timeLimit: number;
  sampleText: string[];
  saveStats: SaveStats;
  wordSet: WordSet;
  time: number;
  isTextChanging: boolean;
  isInputFocused: boolean;
  wpmPerSecond: wpmPerSecond[];
  letterCount: LetterCount;
  completedWords: string[];
}

export function useGameState(initialSampleText: string[]) {
  // Generate initial text if none provided
  const initialText =
    initialSampleText.length > 0
      ? initialSampleText
      : generateRandomWords(10, "common200").split(" ");

  const [state, setState] = useState<GameState>({
    status: "before",
    mode: "words",
    stats: initialStats,
    wordCount: 10,
    timeLimit: 15,
    sampleText: initialText,
    saveStats: "false",
    wordSet: "common200",
    time: 0,
    isTextChanging: false,
    isInputFocused: false,
    wpmPerSecond: [],
    letterCount: initialLetterCount,
    completedWords: [],
  });

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Timer with WPM tracking
  useEffect(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (state.status === "during") {
      timerRef.current = setInterval(() => {
        setState((prev) => {
          const newTime =
            prev.mode === "words" ? prev.time + 1 : Math.max(0, prev.time - 1);

          // Track WPM when time changes
          const elapsedTime =
            prev.mode === "time" ? prev.timeLimit - newTime : newTime;

          if (elapsedTime > 0) {
            const timeInMinutes = elapsedTime / 60;
            const totalCorrectChars =
              prev.letterCount.correct +
              (prev.completedWords.length > 0
                ? prev.completedWords.length - 1
                : 0);
            const totalChars =
              prev.letterCount.correct +
              prev.letterCount.incorrect +
              prev.letterCount.extra +
              prev.letterCount.missed +
              (prev.completedWords.length > 0
                ? prev.completedWords.length - 1
                : 0);

            const newWpmPerSecond = {
              time: elapsedTime,
              wpm: totalCorrectChars / 5 / timeInMinutes,
              rawWpm: totalChars / 5 / timeInMinutes,
            };

            return {
              ...prev,
              time: newTime,
              wpmPerSecond: [...prev.wpmPerSecond, newWpmPerSecond],
            };
          }

          return {
            ...prev,
            time: newTime,
          };
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [state.status]);

  const showUi = state.status !== "during" || !state.isInputFocused;

  // Generic state update
  const updateGameState = useCallback((updates: Partial<GameState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  }, []);

  // Update letter count
  const updateLetterCount = useCallback((newLetterCount: LetterCount) => {
    setState((prev) => ({
      ...prev,
      letterCount: {
        correct: prev.letterCount.correct + newLetterCount.correct,
        incorrect: prev.letterCount.incorrect + newLetterCount.incorrect,
        extra: prev.letterCount.extra + newLetterCount.extra,
        missed: prev.letterCount.missed + newLetterCount.missed,
      },
    }));
  }, []);

  // Update completed words
  const updateCompletedWords = useCallback((newCompletedWords: string[]) => {
    setState((prev) => ({ ...prev, completedWords: newCompletedWords }));
  }, []);

  // Reset typing state
  const resetTypingState = useCallback(() => {
    setState((prev) => ({
      ...prev,
      letterCount: initialLetterCount,
      completedWords: [],
    }));
  }, []);

  // Text generation with animation
  const generateNewText = useCallback(
    (wordCount: number, wordSet: WordSet, withAnimation = true) => {
      if (withAnimation) {
        setState((prev) => ({ ...prev, isTextChanging: true }));
        setTimeout(() => {
          const newText = generateRandomWords(wordCount, wordSet).split(" ");
          setState((prev) => ({ ...prev, sampleText: newText }));
          setTimeout(() => {
            setState((prev) => ({ ...prev, isTextChanging: false }));
          }, 50);
        }, 150);
      } else {
        const newText = generateRandomWords(wordCount, wordSet).split(" ");
        setState((prev) => ({
          ...prev,
          sampleText: newText,
          isTextChanging: false,
        }));
      }
    },
    [],
  );

  // Complex operations that need side effects
  const switchMode = useCallback(
    (mode: GameMode) => {
      if (mode === "time") {
        const newStatus = state.status === "before" ? "restart" : "before";
        // First hide UI
        setState((prev) => ({ ...prev, isTextChanging: true }));

        // After fade out, update all values and generate new text
        setTimeout(() => {
          setState((prev) => ({
            ...prev,
            mode,
            timeLimit: 15,
            wordCount: 50,
            time: 15,
            status: newStatus,
            stats: initialStats,
            wpmPerSecond: [],
            letterCount: initialLetterCount,
            completedWords: [],
          }));

          const newText = generateRandomWords(50, state.wordSet).split(" ");
          setState((prev) => ({ ...prev, sampleText: newText }));

          // Fade back in
          setTimeout(() => {
            setState((prev) => ({ ...prev, isTextChanging: false }));
          }, 50);
        }, 150);
      } else {
        const newStatus = state.status === "before" ? "restart" : "before";
        // First hide UI
        setState((prev) => ({ ...prev, isTextChanging: true }));

        // After fade out, update all values and generate new text
        setTimeout(() => {
          setState((prev) => ({
            ...prev,
            mode,
            wordCount: 10,
            time: 0,
            timeLimit: 15,
            status: newStatus,
            stats: initialStats,
            wpmPerSecond: [],
            letterCount: initialLetterCount,
            completedWords: [],
          }));

          const newText = generateRandomWords(10, state.wordSet).split(" ");
          setState((prev) => ({ ...prev, sampleText: newText }));

          // Fade back in
          setTimeout(() => {
            setState((prev) => ({ ...prev, isTextChanging: false }));
          }, 50);
        }, 150);
      }
    },
    [state.wordSet, state.status],
  );

  const changeWordCount = useCallback(
    (wordCount: number) => {
      updateGameState({ wordCount });
      generateNewText(wordCount, state.wordSet, true);
    },
    [updateGameState, generateNewText, state.wordSet],
  );

  const changeWordSet = useCallback(
    (wordSet: WordSet) => {
      updateGameState({ wordSet });
      generateNewText(state.wordCount, wordSet, true);
    },
    [updateGameState, generateNewText, state.wordCount],
  );

  const changeTimeLimit = useCallback(
    (timeLimit: number) => {
      const time = state.mode === "time" ? timeLimit : state.time;
      updateGameState({ timeLimit, time });
    },
    [updateGameState, state.mode, state.time],
  );

  const resetGame = useCallback(async () => {
    const newStatus = state.status === "before" ? "restart" : "before";
    const newTime = state.mode === "time" ? state.timeLimit : 0;

    if (state.status === "during" && state.saveStats === "true") {
      const elapsedTime =
        state.mode === "words" ? state.time : state.timeLimit - state.time;
      await updateTimeAndGamesStarted(elapsedTime);
    }

    updateGameState({
      status: newStatus,
      stats: initialStats,
      time: newTime,
      wpmPerSecond: [],
      letterCount: initialLetterCount,
      completedWords: [],
    });

    generateNewText(state.wordCount, state.wordSet, true);
  }, [
    updateGameState,
    generateNewText,
    state.status,
    state.mode,
    state.timeLimit,
    state.wordCount,
    state.wordSet,
    state.time,
    state.saveStats,
  ]);

  const resetAllState = useCallback(() => {
    setState({
      status: "before",
      mode: "words",
      stats: initialStats,
      wordCount: 10,
      timeLimit: 15,
      sampleText: initialText,
      saveStats: "false",
      wordSet: "oxford3000",
      time: 0,
      isTextChanging: false,
      isInputFocused: false,
      wpmPerSecond: [],
      letterCount: initialLetterCount,
      completedWords: [],
    });
  }, [initialText]);

  return {
    // State
    ...state,
    showUi, // Derived state

    // Generic updater (for simple updates)
    updateGameState,

    // Typing state updaters
    updateLetterCount,
    updateCompletedWords,
    resetTypingState,

    // Specific operations (for complex logic)
    switchMode,
    changeWordCount,
    changeWordSet,
    changeTimeLimit,
    resetGame,
    resetAllState,
    generateNewText,
  };
}
