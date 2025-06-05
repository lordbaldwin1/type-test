import { useCallback, useState } from "react";

export type GameMode = "words" | "time";
export type GameStatus = "before" | "during" | "after";

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
}

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
  });

  const updateGameStatus = useCallback((status: GameStatus) => {
    setGameState(prev => ({ ...prev, status }));
  }, []);

  const updateGameMode = useCallback((mode: GameMode) => {
    setGameState(prev => ({ ...prev, mode }));
  }, []);

  const updateStats = useCallback((stats: Partial<GameStats>) => {
    setGameState(prev => ({
      ...prev,
      stats: { ...prev.stats, ...stats },
    }));
  }, []);

  const updateWordCount = useCallback((wordCount: number) => {
    setGameState(prev => ({ ...prev, wordCount }));
  }, []);

  const updateTimeLimit = useCallback((timeLimit: number) => {
    setGameState(prev => ({ ...prev, timeLimit }));
  }, []);

  const updateSampleText = useCallback((sampleText: string[]) => {
    setGameState(prev => ({ ...prev, sampleText }));
  }, []);

  const resetGameState = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      status: "before",
      stats: initialStats,
    }));
  }, []);

  const resetAllState = useCallback(() => {
    setGameState({
      status: "before",
      mode: "words",
      stats: initialStats,
      wordCount: 10,
      timeLimit: 0,
      sampleText: initialSampleText,
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
  };
} 