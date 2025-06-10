import type { GameStatsProps } from "~/app/(test)/_utils/types";
import { WpmChart } from "./wpm-chart";
import { SignInButton, useAuth } from "@clerk/nextjs";

export function GameStats({
  stats,
  mode,
  timeLimit,
  time,
  wpmPerSecond,
}: Omit<GameStatsProps, 'onReset'>) {
  const { userId } = useAuth();

  return (
    <div className="flex w-full flex-col items-center gap-6 px-4 py-4" tabIndex={-1}>
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

      {/* Chart */}
      <div className="w-full max-w-6xl">
        <WpmChart wpmPerSecond={wpmPerSecond} />
      </div>
    </div>
  );
}
