import { useCallback, useEffect, useState } from "react";

type GameMode = "words" | "time";
type GameStatus = "before" | "during" | "after";

export function useGameTimer(
  mode: GameMode, 
  status: GameStatus, 
  timeLimit: number
) {
  const [time, setTime] = useState<number>(() => {
    return mode === "time" ? timeLimit : 0;
  });

  useEffect(() => {
    let intervalId: NodeJS.Timeout | undefined;

    if (status === "during") {
      intervalId = setInterval(() => {
        if (mode === "words") {
          setTime(prev => prev + 1);
        } else if (mode === "time") {
          setTime(prev => prev - 1);
        }
      }, 1000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [status, mode]);

  useEffect(() => {
    setTime(mode === "time" ? timeLimit : 0);
  }, [mode, timeLimit]);

  const resetTimer = useCallback(() => {
    setTime(mode === "time" ? timeLimit : 0);
  }, [mode, timeLimit]);

  return {
    time,
    resetTimer,
  };
}