import { Anvil, Clock, Hash, Sword } from "lucide-react";
import { useGameStore } from "../_store/gameStore";
import { Button } from "~/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import Link from "next/link";

interface GameModeConfigProps {
  userId: string | null;
  onReset: () => void;
}

export function GameModeConfig({ userId, onReset }: GameModeConfigProps) {
  const isInitialized = useGameStore((s) => s.isInitialized);
  const mode = useGameStore((s) => s.mode);
  const timeLimit = useGameStore((s) => s.timeLimit);
  const wordCount = useGameStore((s) => s.wordCount);
  const isRanked = useGameStore((s) => s.isRanked);
  const status = useGameStore((s) => s.status);
  const isTextChanging = useGameStore((s) => s.isTextChanging);

  const setMode = useGameStore((s) => s.setMode);
  const setWordCount = useGameStore((s) => s.setWordCount);
  const setTimeLimit = useGameStore((s) => s.setTimeLimit);
  const setRanked = useGameStore((s) => s.setRanked);

  const wordOptions = [10, 25, 50, 100];
  const timeOptions = [15, 30, 60];

  const showUi = isInitialized && !isTextChanging && status !== "playing";

  const handleModeChange = (newMode: "words" | "time") => {
    setMode(newMode);
    onReset();
  };

  const handleTimeLimitChange = (seconds: number) => {
    setTimeLimit(seconds);
    if (mode === "time") {
      setWordCount(seconds * 2.5);
    }
  };

  const handleWordCountChange = (count: number) => {
    setWordCount(count);
  };

  return (
    <div
      className={`bg-card text-muted-foreground flex items-center justify-center rounded-md border transition-opacity duration-300 ${
        showUi ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      <div className="flex space-x-2">
        <Button
          variant="link"
          size="sm"
          className={`text-muted-foreground hover:text-foreground px-2 py-1 transition-colors hover:cursor-pointer ${
            !isRanked ? "text-green-400" : ""
          }`}
          onClick={() => setRanked(false)}
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
            className={`text-muted-foreground hover:text-foreground px-2 py-1 transition-colors hover:cursor-pointer ${
              isRanked ? "text-red-400" : ""
            }`}
            onClick={() => setRanked(true)}
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
                    className={`text-muted-foreground hover:text-foreground px-2 py-1 transition-colors hover:cursor-pointer ${
                      isRanked ? "text-red-200" : ""
                    }`}
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

      <div className="bg-border mx-3 h-6 w-px rounded-sm p-0.5"></div>

      <div className="flex space-x-2">
        <Button
          variant="link"
          size="sm"
          className={`text-muted-foreground hover:text-foreground px-2 py-1 transition-colors hover:cursor-pointer ${
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
          className={`text-muted-foreground hover:text-foreground px-2 py-1 transition-colors hover:cursor-pointer ${
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

      <div className="bg-border mx-3 h-6 w-px rounded-sm p-0.5"></div>

      <div className="flex space-x-2">
        {mode === "time" && (
          <>
            {timeOptions.map((seconds) => (
              <Button
                key={seconds}
                variant="link"
                className={`text-muted-foreground hover:text-foreground rounded px-2 py-1 transition-colors ${
                  timeLimit === seconds ? "text-foreground" : ""
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
                  wordCount === count ? "text-foreground" : ""
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
}
