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
    <div className="flex w-full flex-col items-center gap-6">
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

      {/* Dynamic Title */}
      <h1 className="text-3xl font-bold">
        {show15s ? "best 15s timed wpm" : "best average wpm overall"}
      </h1>

      {/* User Stats with Username Dialog */}
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

      {/* Tables */}
      {show15s ? (
        <TimeLimit15Table games={games} totalPlayers={totalPlayers} />
      ) : (
        <LeaderboardTable users={users} totalPlayers={totalPlayers} />
      )}
    </div>
  );
}
