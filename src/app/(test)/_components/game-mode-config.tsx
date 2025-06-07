import { memo, useCallback } from "react";
import { Anvil, Clock, Hash, Pencil } from "lucide-react";
import type { GameMode, GameModeConfigProps } from "../_utils/types";
import { Button } from "~/components/ui/button";

export const GameModeConfig = memo(function GameModeConfig({
  mode,
  setGameMode,
  timeLimit,
  wordCount,
  setTimeLimit,
  setWordCount,
  resetGameState,
  saveStats,
  updateSaveStats,
}: GameModeConfigProps) {
  const wordOptions = [10, 25, 50, 100];
  const timeOptions = [15, 30, 60];

  const handleModeChange = useCallback(
    (newMode: GameMode) => {
      setGameMode(newMode);
      if (newMode === "time") {
        setTimeLimit(15);
        setWordCount(50);
      } else {
        setWordCount(10);
      }
      resetGameState();
    },
    [setGameMode, setTimeLimit, setWordCount, resetGameState],
  );

  const handleTimeLimitChange = useCallback(
    (seconds: number) => {
      setTimeLimit(seconds);
      setWordCount(seconds * 2.5);
      resetGameState();
    },
    [setTimeLimit, setWordCount, resetGameState],
  );

  const handleWordCountChange = useCallback(
    (count: number) => {
      setWordCount(count);
      resetGameState();
    },
    [setWordCount, resetGameState],
  );

  return (
    <div className="bg-card text-muted-foreground flex items-center justify-center rounded-md border">
      <div className="flex space-x-2">
        <Button
          variant="link"
          size="sm"
          className={`text-muted-foreground hover:text-foreground transition-colors hover:cursor-pointer px-2 py-1 ${
            saveStats === "false" ? "text-green-200" : ""
          }`}
          onClick={() => updateSaveStats("false")}
        >
          <div className="flex flex-row items-center gap-1">
            <Pencil className="h-3 w-3" />
            <span className="text-sm">practice</span>
          </div>
        </Button>

        <Button
          variant="link"
          size="sm"
          className={`text-muted-foreground hover:text-foreground transition-colors hover:cursor-pointer px-2 py-1 ${
            saveStats === "true" ? "text-red-200" : ""
          }`}
          onClick={() => updateSaveStats("true")}
        >
          <div className="flex flex-row items-center gap-1">
            <Anvil className="h-3 w-3" />
            <span className="text-sm">ranked</span>
          </div>
        </Button>
      </div>

      {/* Divider */}
      <div className="bg-border p-0.5 rounded-sm mx-3 h-6 w-px"></div>
      
      {/* Mode toggles */}
      <div className="flex space-x-2">
        <Button
          variant="link"
          size="sm"
          className={`text-muted-foreground hover:text-foreground transition-colors hover:cursor-pointer px-2 py-1 ${
            mode === "time" ? "text-foreground" : ""
          }`}
          onClick={() => handleModeChange("time")}
        >
          <div className="flex flex-row items-center gap-1">
            <Clock className="h-3 w-3" />
            <span className="text-sm">time</span>
          </div>
        </Button>

        <Button
          variant="link"
          size="sm"
          className={`text-muted-foreground hover:text-foreground transition-colors hover:cursor-pointer px-2 py-1 ${
            mode === "words" ? "text-foreground" : ""
          }`}
          onClick={() => handleModeChange("words")}
        >
          <div className="flex flex-row items-center gap-1">
            <Hash className="h-3 w-3" />
            <span className="text-sm">words</span>
          </div>
        </Button>
      </div>

      {/* Divider */}
      <div className="bg-border p-0.5 rounded-sm mx-3 h-6 w-px"></div>

      {/* Options based on active mode */}
      <div className="flex space-x-2">
        {mode === "time" && (
          <>
            {timeOptions.map((seconds) => (
              <Button
                key={seconds}
                variant="link"
                className={`text-muted-foreground hover:text-foreground rounded px-2 py-1 transition-colors ${
                  timeLimit === seconds
                    ? "text-foreground"
                    : ""
                }`}
                onClick={() => handleTimeLimitChange(seconds)}
              >
                {seconds}
              </Button>
            ))}
          </>
        )}

        {mode === "words" && (
          <>
            {wordOptions.map((count) => (
              <Button
                key={count}
                variant="link"
                className={`text-muted-foreground hover:text-foreground rounded px-2 py-1 transition-colors ${
                  wordCount === count
                    ? "text-foreground"
                    : ""
                }`}
                onClick={() => handleWordCountChange(count)}
              >
                {count}
              </Button>
            ))}
          </>
        )}
      </div>
    </div>
  );
});
