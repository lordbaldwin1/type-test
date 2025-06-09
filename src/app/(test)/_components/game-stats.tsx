import { Button } from "~/components/ui/button";
import type { GameStatsProps } from "~/app/(test)/_utils/types";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { RotateCcw } from "lucide-react";
import { WpmChart } from "./wpm-chart";
import { SignInButton, useAuth } from "@clerk/nextjs";

export function GameStats({
  stats,
  mode,
  timeLimit,
  time,
  onReset,
  wpmPerSecond,
}: GameStatsProps) {
  const { userId } = useAuth();
  return (
    <div className="flex w-full flex-col items-center gap-6 px-4 py-4">
      {/* Top Stats Row */}
      <div className="w-full max-w-6xl">
        <div className="grid grid-cols-5 gap-6 text-center">
          {/* Raw WPM */}
          <div>
            <div className="text-muted-foreground mb-2 text-sm font-medium">
              raw
            </div>
            <div className="text-foreground text-3xl leading-none font-bold">
              {stats.rawWpm}
            </div>
          </div>

          {/* Accuracy */}
          <div>
            <div className="text-muted-foreground mb-2 text-sm font-medium">
              acc
            </div>
            <div className="text-primary text-3xl leading-none font-bold">
              {stats.accuracy}%
            </div>
          </div>

          {/* WPM - Center and Largest */}
          <div>
            <div className="text-muted-foreground mb-2 text-sm font-medium">
              wmp
            </div>
            <div className="text-primary text-6xl leading-none font-bold">
              {stats.wpm}
            </div>
          </div>

          {/* Time */}
          <div>
            <div className="text-muted-foreground mb-2 text-sm font-medium">
              time
            </div>
            <div className="text-foreground text-3xl leading-none font-bold">
              {mode === "time" ? timeLimit : time}s
            </div>
          </div>

          {/* Characters */}
          <div>
            <div className="text-muted-foreground mb-2 text-sm font-medium">
              characters
            </div>
            <div className="text-3xl leading-none font-bold">
              <span className="text-primary">{stats.correct}</span>
              <span className="text-muted-foreground">/</span>
              <span className="text-destructive">{stats.incorrect}</span>
              <span className="text-muted-foreground">/</span>
              <span className="text-muted-foreground">{stats.extra}</span>
              <span className="text-muted-foreground">/</span>
              <span className="text-muted-foreground">{stats.missed}</span>
            </div>
          </div>
        </div>
      </div>

      {!userId && (
        <div className="text-muted-foreground flex items-center gap-2 text-sm">
          <SignInButton mode="modal">
            <span className="underline hover:text-foreground hover:scale-105 hover:cursor-pointer">sign in</span>
          </SignInButton>
          <span>to save future stats</span>
        </div>
      )}
      {/* Chart and Button Container - using flex order for visual positioning */}
      <div className="flex w-full flex-col items-center gap-6">
        {/* Restart Button - First in DOM for focus, but visually second with order-2 */}
        <div className="order-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground"
                onClick={onReset}
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                restart test
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Start a new test</p>
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Chart - Second in DOM but visually first with order-1 */}
        <div className="order-1 w-full max-w-6xl">
          <WpmChart wpmPerSecond={wpmPerSecond} />
        </div>
      </div>
      {/* Footer Instructions */}
      <div className="text-muted-foreground flex items-center gap-2 text-xs">
        <kbd className="bg-muted text-foreground rounded px-1 py-0.5 font-mono">
          tab
        </kbd>
        <span>+</span>
        <kbd className="bg-muted text-foreground rounded px-1 py-0.5 font-mono">
          enter
        </kbd>
        <span>- restart test</span>
      </div>
    </div>
  );
}
