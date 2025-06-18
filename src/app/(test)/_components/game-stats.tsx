"use client";

import type { GameStatsProps } from "~/app/(test)/_utils/types";
import { WpmChart } from "./wpm-chart";
import { SignInButton } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { Loader2 } from "lucide-react";

interface UserStats {
  userId: string | null;
  currentLevel: number;
  totalXp: number;
}

export function GameStats({
  stats,
  mode,
  timeLimit,
  time,
  wpmPerSecond,
  xp,
}: Omit<GameStatsProps, "onReset">) {
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [progressWidthBefore, setProgressWidthBefore] = useState(0);
  const [progressWidthAfter, setProgressWidthAfter] = useState(0);

  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        const response = await fetch("/api/get-user-stats");
        if (!response.ok) return;
        const data = (await response.json()) as UserStats;
        setUserStats(data);
      } catch (error) {
        console.error("Error fetching user stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    void fetchUserStats();
  }, []);

  // Calculate XP progress
  const calculateXpForLevel = (level: number) => {
    let xpRequired = 0;
    let xpIncrement = 100;
    for (let i = 1; i < level; i++) {
      xpRequired += xpIncrement;
      xpIncrement += 100;
    }
    return xpRequired;
  };

  const xpToNextLevel = userStats
    ? calculateXpForLevel(userStats.currentLevel + 1)
    : null;
  const xpIntoCurrentLevel = userStats ? userStats.totalXp : null;
  const progressWidthBeforeGame =
    xpIntoCurrentLevel && xpToNextLevel
      ? (xpIntoCurrentLevel - xp) / xpToNextLevel
      : 0;
  const progressWidthAfterGame =
    xpIntoCurrentLevel && xpToNextLevel
      ? xpIntoCurrentLevel / xpToNextLevel
      : 0;

  const displayXpToNextLevel = xpToNextLevel
    ? (xpToNextLevel / 1000).toFixed(1)
    : null;
  const displayXpIntoCurrentLevel = xpIntoCurrentLevel
    ? (xpIntoCurrentLevel / 1000).toFixed(1)
    : null;

  useEffect(() => {
    if (!isLoading && userStats) {
      const timer = setTimeout(() => {
        setProgressWidthBefore(progressWidthBeforeGame);
        setProgressWidthAfter(progressWidthAfterGame);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isLoading, userStats, progressWidthBeforeGame, progressWidthAfterGame]);

  return (
    <div
      className="flex w-full flex-col items-center gap-6 px-4 py-4"
      tabIndex={-1}
    >
      {/* Top Stats Row */}
      <div className="w-full">
        <div className="grid grid-cols-5 gap-6 text-center">
          {/* Raw WPM */}
          <div>
            <div className="text-muted-foreground mb-2 text-sm font-medium">
              raw wpm
            </div>
            <Tooltip>
              <TooltipTrigger>
                <div className="text-foreground text-3xl leading-none font-bold">
                  {stats.rawWpm}
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>correct + incorrect + extra</p>
              </TooltipContent>
            </Tooltip>
          </div>

          {/* Accuracy */}
          <div>
            <div className="text-muted-foreground mb-2 text-sm font-medium">
              acc
            </div>
            <Tooltip>
              <TooltipTrigger>
                <div className="text-primary text-3xl leading-none font-bold">
                  {stats.accuracy}%
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>correct / total</p>
              </TooltipContent>
            </Tooltip>
          </div>

          {/* WPM - Center and Largest */}
          <div>
            <div className="text-muted-foreground mb-2 text-sm font-medium">
              wpm
            </div>
            <Tooltip>
              <TooltipTrigger>
                <div className="text-primary text-6xl leading-none font-bold">
                  {stats.wpm}
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>only correct letters</p>
              </TooltipContent>
            </Tooltip>
          </div>

          {/* Time */}
          <div>
            <div className="text-muted-foreground mb-2 text-sm font-medium">
              time
            </div>
            <Tooltip>
              <TooltipTrigger>
                <div className="text-foreground text-3xl leading-none font-bold">
                  {mode === "time" ? timeLimit : time}s
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>yep, just game duration</p>
              </TooltipContent>
            </Tooltip>
          </div>

          {/* Characters */}
          <div>
            <div className="text-muted-foreground mb-2 text-sm font-medium">
              characters
            </div>
            <div className="text-3xl leading-none font-bold">
              <Tooltip>
                <TooltipTrigger>
                  <span className="text-primary">{stats.correct}</span>
                  <span className="text-muted-foreground">/</span>
                  <span className="text-destructive">{stats.incorrect}</span>
                  <span className="text-muted-foreground">/</span>
                  <span className="text-muted-foreground">{stats.extra}</span>
                  <span className="text-muted-foreground">/</span>
                  <span className="text-muted-foreground">{stats.missed}</span>
                </TooltipTrigger>
                <TooltipContent className="flex items-center gap-2">
                  <p>correct/incorrect/extra/missed</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>
      </div>

      {/* User Stats */}
      {isLoading ? (
        <div className="text-muted-foreground flex items-center gap-2 text-sm">
          <Loader2 className="animate-spin" />
        </div>
      ) : userStats ? (
        <div className="text-muted-foreground flex w-full max-w-5xl flex-row items-center gap-4 text-sm animate-in fade-in-0 duration-500">
          <span className="min-w-[100px] text-right text-2xl font-bold">
            {userStats.currentLevel}
          </span>
          <div className="bg-muted relative h-4 w-full max-w-2xl overflow-hidden rounded-sm">
            {/* Previous progress */}
            <div
              className="bg-primary absolute top-0 left-0 h-full transition-all duration-500 ease-out"
              style={{ width: `${progressWidthBefore * 100}%` }}
            />
            {/* New XP gain */}
            <div
              className="absolute top-0 h-full bg-green-500 transition-all duration-500 ease-out"
              style={{
                width: `${Math.max(progressWidthAfter - progressWidthBefore, 0) * 100}%`,
                left: `${progressWidthBefore * 100}%`,
                opacity: 0.8,
              }}
            />
          </div>
          <Tooltip>
            <TooltipTrigger>
              <span className="min-w-[120px] text-left text-xl font-bold">{`${displayXpIntoCurrentLevel}k / ${displayXpToNextLevel}k`}</span>
            </TooltipTrigger>
            <TooltipContent>
              <p>{`${xpIntoCurrentLevel} / ${xpToNextLevel} xp`}</p>
            </TooltipContent>
          </Tooltip>
        </div>
      ) : (
        <div className="text-muted-foreground flex items-center gap-2 text-sm">
          <SignInButton mode="modal">
            <span className="hover:text-foreground underline hover:scale-105 hover:cursor-pointer">
              sign in
            </span>
          </SignInButton>
          <span>to save future stats</span>
        </div>
      )}

      {/* Chart */}
      <div className="w-full max-w-[90rem]">
        <WpmChart wpmPerSecond={wpmPerSecond} />
      </div>
    </div>
  );
}
