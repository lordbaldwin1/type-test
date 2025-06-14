import { memo, useCallback } from "react";
import { Anvil, Clock, Hash, Sword } from "lucide-react";
import type { GameMode, GameModeConfigProps } from "../_utils/types";
import { Button } from "~/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "~/components/ui/tooltip";
import Link from "next/link";

export const GameModeConfig = memo(function GameModeConfig({
  mode,
  timeLimit,
  wordCount,
  saveStats,
  showUi,
  updateGameState,
  switchMode,
  changeWordCount,
  changeTimeLimit,
  userId,
}: GameModeConfigProps) {
  const wordOptions = [10, 25, 50, 100];
  const timeOptions = [15, 30, 60];

  const handleModeChange = useCallback(
    (newMode: GameMode) => {
      switchMode(newMode);
    },
    [switchMode],
  );

  const handleTimeLimitChange = useCallback(
    (seconds: number) => {
      changeTimeLimit(seconds);
      // Auto-adjust word count for time mode
      if (mode === "time") {
        changeWordCount(seconds * 2.5);
      }
    },
    [changeTimeLimit, changeWordCount, mode],
  );

  const handleWordCountChange = useCallback(
    (count: number) => {
      changeWordCount(count);
    },
    [changeWordCount],
  );

  return (
    <div
      className={`bg-card text-muted-foreground flex items-center justify-center rounded-md border transition-opacity duration-300 ${showUi ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
    >
      <div className="flex space-x-2">
        <Button
          variant="link"
          size="sm"
          className={`text-muted-foreground hover:text-foreground px-2 py-1 transition-colors hover:cursor-pointer ${saveStats === "false" ? "text-green-400" : ""
            }`}
          onClick={() => updateGameState({ saveStats: "false" })}
        >
          <div className="flex flex-row items-center gap-1">
            <Anvil className="h-3 w-3" />
            <span className="text-sm">practice</span>
          </div>
        </Button>
        {userId ? (
          <Button
            variant="link"
            size="sm"
            className={`text-muted-foreground hover:text-foreground px-2 py-1 transition-colors hover:cursor-pointer ${saveStats === "true" ? "text-red-400" : ""
              }`}
            onClick={() => updateGameState({ saveStats: "true" })}
          >
            <div className="flex flex-row items-center gap-1">
              <Sword className="h-3 w-3" />
              <span className="text-sm">ranked</span>
            </div>
          </Button>
        ) : (
          <Tooltip>
            <TooltipTrigger asChild>
              <Link href={`/login`}>
                <span className="inline-block">
                  <Button
                    variant="link"
                    size="sm"
                    disabled={true}
                    className={`text-muted-foreground hover:text-foreground px-2 py-1 transition-colors hover:cursor-pointer ${saveStats === "true" ? "text-red-200" : ""
                      }`}
                    onClick={() => updateGameState({ saveStats: "true" })}
                  >
                    <div className="flex flex-row items-center gap-1">
                      <Anvil className="h-3 w-3" />
                      <span className="text-sm">ranked</span>
                    </div>
                  </Button>
                </span>
              </Link>
            </TooltipTrigger>
            <TooltipContent>
              <span>click to sign in and play ranked</span>
            </TooltipContent>
          </Tooltip>
        )}
      </div>

      {/* Divider */}
      <div className="bg-border mx-3 h-6 w-px rounded-sm p-0.5"></div>

      {/* Mode toggles */}
      <div className="flex space-x-2">
        <Button
          variant="link"
          size="sm"
          className={`text-muted-foreground hover:text-foreground px-2 py-1 transition-colors hover:cursor-pointer ${mode === "time" ? "text-foreground" : ""
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
          className={`text-muted-foreground hover:text-foreground px-2 py-1 transition-colors hover:cursor-pointer ${mode === "words" ? "text-foreground" : ""
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
      <div className="bg-border mx-3 h-6 w-px rounded-sm p-0.5"></div>

      {/* Options based on active mode */}
      <div className="flex space-x-2">
        {mode === "time" && (
          <>
            {timeOptions.map((seconds) => (
              <Button
                key={seconds}
                variant="link"
                className={`text-muted-foreground hover:text-foreground rounded px-2 py-1 transition-colors ${timeLimit === seconds ? "text-foreground" : ""
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
                className={`text-muted-foreground hover:text-foreground rounded px-2 py-1 transition-colors ${wordCount === count ? "text-foreground" : ""
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
