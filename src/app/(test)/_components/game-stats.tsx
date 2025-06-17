"use client";

import type { GameStatsProps } from "~/app/(test)/_utils/types";
import { WpmChart } from "./wpm-chart";
import { SignInButton } from "@clerk/nextjs";
import { useEffect, useState } from "react";

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
  // xp,
}: Omit<GameStatsProps, 'onReset'>) {
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [progressWidth, setProgressWidth] = useState(0);

  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        const response = await fetch("/api/get-user-stats");
        if (!response.ok) {
          throw new Error("Failed to fetch user stats");
        }
        const data = await response.json() as UserStats;
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

  const xpToNextLevel = userStats ? calculateXpForLevel(userStats.currentLevel + 1) : null;
  const xpIntoCurrentLevel = userStats ? userStats.totalXp : null;
  const progressRatio = xpIntoCurrentLevel && xpToNextLevel ? xpIntoCurrentLevel / xpToNextLevel : 0;

  // Animate progress bar when stats change
  useEffect(() => {
    if (!isLoading && userStats) {
      setProgressWidth(0);
      const timer = setTimeout(() => {
        setProgressWidth(progressRatio * 100);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isLoading, userStats, progressRatio]);

  return (
    <div className="flex w-full flex-col items-center gap-6 px-4 py-4" tabIndex={-1}>
      {/* Top Stats Row */}
      <div className="w-full">
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

      {/* User Stats */}
      {isLoading ? (
        <div className="text-muted-foreground text-sm">Loading...</div>
      ) : userStats ? (
        <div className="text-muted-foreground flex w-full max-w-[90rem] flex-row items-center gap-4 text-sm">
          <span className="min-w-[100px] text-right">Level {userStats.currentLevel}</span>
          <div className="relative h-4 w-full max-w-2xl rounded-full bg-muted">
            <div 
              className="absolute left-0 top-0 h-full rounded-full bg-primary transition-all duration-1000 ease-out"
              style={{ width: `${progressWidth}%` }}
            />
          </div>
          <span className="min-w-[120px] text-left">XP: {xpIntoCurrentLevel} / {xpToNextLevel}</span>
        </div>
      ) : (
        <div className="text-muted-foreground flex items-center gap-2 text-sm">
          <SignInButton mode="modal">
            <span className="underline hover:text-foreground hover:scale-105 hover:cursor-pointer">sign in</span>
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
