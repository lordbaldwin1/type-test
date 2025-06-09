"use client";

import { useState } from "react";
import LeaderboardTable from "./leaderboard-table";
import TimeLimit15Table from "./timelimit15-table";
import type { User, Game } from "~/server/db/schema";
import UserStats from "./user-stats";
import UserStats15 from "./user-stats-timelimit15";
import UsernameDialog from "./username-dialog";
import { Button } from "~/components/ui/button";

type MaxWpmGameWithUser = Game & { user: User };

export default function LeaderboardTableToggle({
  users,
  totalPlayers,
  games,
  userBestTime,
  userRank,
  user,
  userPosition,
  userId,
}: {
  users: User[];
  totalPlayers: number;
  games: (Game & { user: User })[];
  userBestTime: MaxWpmGameWithUser | null;
  userRank: { rank: number } | undefined;
  user: User | undefined;
  userPosition: { rank: number } | undefined;
  userId: string | null;
}) {
  const [show15s, setShow15s] = useState(true);

  return (
    <div className="w-full">
      {/* Mobile/Tablet Layout */}
      <div className="flex flex-col items-center gap-8 2xl:hidden">
        {/* Title */}
        <h1 className="text-2xl sm:text-3xl font-bold text-center px-2">
          {show15s ? "best 15s timed wpm" : "best average wpm overall"}
        </h1>

        {/* User Stats */}
        <div className="relative flex justify-center">
          {userId && (
            <div className="absolute top-1.25 text-muted-foreground right-full mr-3">
              you:
            </div>
          )}
          {show15s ? (
            <UserStats15
              userBestTime={userBestTime}
              userRank={userRank}
              user={user}
              totalPlayers={totalPlayers}
            />
          ) : (
            <UserStats
              userPosition={userPosition}
              user={user}
              totalPlayers={totalPlayers}
            />
          )}
          {userId && (
            <div className="absolute top-0 left-full ml-2">
              <UsernameDialog isAnonymous={user?.stayAnonymous ?? false} />
            </div>
          )}
        </div>

        {/* Toggle Buttons */}
        <div className="bg-muted flex w-full max-w-lg flex-row rounded-lg p-1">
          <Button
            variant={"default"}
            className={`w-1/2 rounded-md px-8 py-2 transition-all ${
              show15s
                ? "text-foreground bg-background hover:bg-background"
                : "text-muted-foreground bg-muted hover:bg-muted hover:text-foreground"
            }`}
            onClick={() => setShow15s(true)}
          >
            15s wpm
          </Button>
          <Button
            variant={"default"}
            className={`w-1/2 rounded-md px-8 py-2 transition-all ${
              show15s
                ? "text-muted-foreground bg-muted hover:text-foreground hover:bg-muted"
                : "text-foreground bg-background hover:text-foreground hover:bg-background"
            }`}
            onClick={() => setShow15s(false)}
          >
            ave. wpm
          </Button>
        </div>

        {/* Tables */}
        <div className="w-full flex justify-center">
          {show15s ? (
            <TimeLimit15Table games={games} totalPlayers={totalPlayers} />
          ) : (
            <LeaderboardTable users={users} totalPlayers={totalPlayers} />
          )}
        </div>
      </div>

      {/* Large Screen Layout */}
      <div className="hidden 2xl:block">
        <div className="relative mx-auto max-w-4xl px-64">
          {/* Toggle Buttons - Positioned to the left of the centered table */}
          <div className="absolute left-0 top-16 -translate-x-full pr-8">
            <div className="bg-muted flex flex-col w-48 rounded-lg p-1 sticky top-8">
              <Button
                variant={"default"}
                className={`w-full rounded-md px-8 py-2 transition-all ${
                  show15s
                    ? "text-foreground bg-background hover:bg-background"
                    : "text-muted-foreground bg-muted hover:bg-muted hover:text-foreground"
                }`}
                onClick={() => setShow15s(true)}
              >
                15s wpm
              </Button>
              <Button
                variant={"default"}
                className={`w-full rounded-md px-8 py-2 transition-all ${
                  show15s
                    ? "text-muted-foreground bg-muted hover:text-foreground hover:bg-muted"
                    : "text-foreground bg-background hover:text-foreground hover:bg-background"
                }`}
                onClick={() => setShow15s(false)}
              >
                ave. wpm
              </Button>
            </div>
          </div>

          {/* User Stats - Positioned to the right of the centered table */}
          <div className="absolute right-0 top-16 translate-x-full pl-8">
            <div className="sticky top-8">
              <div className="relative flex justify-center">
                {show15s ? (
                  <UserStats15
                    userBestTime={userBestTime}
                    userRank={userRank}
                    user={user}
                    totalPlayers={totalPlayers}
                  />
                ) : (
                  <UserStats
                    userPosition={userPosition}
                    user={user}
                    totalPlayers={totalPlayers}
                  />
                )}
                {userId && (
                  <div className="absolute top-0 left-full ml-2">
                    <UsernameDialog isAnonymous={user?.stayAnonymous ?? false} />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Centered Table Content */}
          <div className="flex flex-col items-center gap-6">
            {/* Title */}
            <h1 className="text-3xl font-bold whitespace-nowrap">
              {show15s ? "best 15s timed wpm" : "best average wpm overall"}
            </h1>

            {/* Tables */}
            <div className="w-full flex justify-center">
              {show15s ? (
                <TimeLimit15Table games={games} totalPlayers={totalPlayers} />
              ) : (
                <LeaderboardTable users={users} totalPlayers={totalPlayers} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
