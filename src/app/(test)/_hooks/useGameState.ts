import { useCallback, useState } from "react";
import type {
  GameState,
  GameStats,
  GameStatus,
  GameMode,
  SaveStats,
} from "../_utils/types";

const initialStats: GameStats = {
  wpm: 0,
  rawWpm: 0,
  accuracy: 0,
  correct: 0,
  incorrect: 0,
  extra: 0,
  missed: 0,
};

export function useGameState(initialSampleText: string[]) {
  const [gameState, setGameState] = useState<GameState>({
    status: "before",
    mode: "words",
    stats: initialStats,
    wordCount: 10,
    timeLimit: 0,
    sampleText: initialSampleText,
    saveStats: "false",
  });

  const updateGameStatus = useCallback((status: GameStatus) => {
    setGameState((prev) => ({ ...prev, status }));
  }, []);

  const updateGameMode = useCallback((mode: GameMode) => {
    setGameState((prev) => ({ ...prev, mode }));
  }, []);

  const updateStats = useCallback((stats: Partial<GameStats>) => {
    setGameState((prev) => ({
      ...prev,
      stats: { ...prev.stats, ...stats },
    }));
  }, []);

  const updateWordCount = useCallback((wordCount: number) => {
    setGameState((prev) => ({ ...prev, wordCount }));
  }, []);

  const updateTimeLimit = useCallback((timeLimit: number) => {
    setGameState((prev) => ({ ...prev, timeLimit }));
  }, []);

  const updateSampleText = useCallback((sampleText: string[]) => {
    setGameState((prev) => ({ ...prev, sampleText }));
  }, []);

  const updateSaveStats = useCallback((saveStats: SaveStats) => {
    setGameState((prev) => ({ ...prev, saveStats }));
  }, []);

  const resetGameState = useCallback(() => {
    if (gameState.status === "before") {
      setGameState((prev) => ({
        ...prev,
        status: "restart",
        stats: initialStats,
      }));
    } else {
      setGameState((prev) => ({
        ...prev,
        status: "before",
      }));
    }
  }, [gameState.status]);

  const resetAllState = useCallback(() => {
    setGameState({
      status: "before",
      mode: "words",
      stats: initialStats,
      wordCount: 10,
      timeLimit: 0,
      sampleText: initialSampleText,
      saveStats: "false",
    });
  }, [initialSampleText]);

  return {
    gameState,
    updateGameStatus,
    updateGameMode,
    updateStats,
    updateWordCount,
    updateTimeLimit,
    updateSampleText,
    resetGameState,
    resetAllState,
    updateSaveStats,
  };
}
