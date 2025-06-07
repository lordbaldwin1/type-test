import { useCallback, useEffect, useState } from "react";
import type { GameMode, GameStatus } from "../_utils/types";

export function useGameTimer(
  mode: GameMode, 
  status: GameStatus, 
  timeLimit: number
) {
  const [time, setTime] = useState<number>(() => {
    return mode === "time" ? timeLimit : 0;
  });

  // Handle timer updates during game
  useEffect(() => {
    let intervalId: NodeJS.Timeout | undefined;

    if (status === "during") {
      intervalId = setInterval(() => {
        if (mode === "words") {
          setTime(prev => prev + 1);
        } else if (mode === "time") {
          setTime(prev => Math.max(0, prev - 1));
        }
      }, 1000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [status, mode]);

  // Reset timer when mode changes or game resets
  useEffect(() => {
    if (status === "before") {
      setTime(mode === "time" ? timeLimit : 0);
    }
  }, [status, mode, timeLimit]);

  const resetTimer = useCallback(() => {
    setTime(mode === "time" ? timeLimit : 0);
  }, [mode, timeLimit]);

  return {
    time,
    resetTimer,
  };
}