import { and, avg, gt, sum } from "drizzle-orm";
import { db } from "~/server/db";
import { users } from "~/server/db/schema";

export default async function PlayerBaseStats() {
  const [playerBaseAverages] = await db
    .select({
      avgWpm: avg(users.averageWpm),
      avgAcc: avg(users.averageAccuracy),
      gamesPlayed: sum(users.totalGames),
      gamesStarted: sum(users.totalGamesStarted),
      timeTyping: sum(users.timeTyping),
    })
    .from(users)
    .where(and(gt(users.averageWpm, 0), gt(users.averageAccuracy, 0)));

  if (!playerBaseAverages) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <h1>unable to load player statistics.</h1>
      </div>
    );
  }

  return (
    <div className="mb-8 w-full">
      <h2 className="mb-8 text-center text-4xl font-bold">
        stats across all players
      </h2>
      <div className="flex flex-wrap items-start justify-center gap-12">
        <div className="flex flex-col items-center">
          <h3 className="text-sm font-semibold tracking-wider text-muted-foreground mb-2">ave. wpm</h3>
          <p className="text-3xl font-bold">
            {playerBaseAverages.avgWpm
              ? parseInt(playerBaseAverages.avgWpm).toFixed(2)
              : "N/A"}
          </p>
        </div>
        <div className="flex flex-col items-center">
          <h3 className="text-sm font-semibold tracking-wider text-muted-foreground mb-2">ave. accuracy</h3>
          <p className="text-3xl font-bold">
            {playerBaseAverages.avgAcc
              ? parseInt(playerBaseAverages.avgAcc).toFixed(2) + "%"
              : "N/A"}
          </p>
        </div>
        <div className="flex flex-col items-center">
          <h3 className="text-sm font-semibold tracking-wider text-muted-foreground mb-2">games finished</h3>
          <p className="text-3xl font-bold">
            {playerBaseAverages.gamesPlayed ?? "N/A"}
          </p>
        </div>
        <div className="flex flex-col items-center">
          <h3 className="text-sm font-semibold tracking-wider text-muted-foreground mb-2">games started</h3>
          <p className="text-3xl font-bold">
            {playerBaseAverages.gamesStarted ?? "N/A"}
          </p>
        </div>
        <div className="flex flex-col items-center">
          <h3 className="text-sm font-semibold tracking-wider text-muted-foreground mb-2">time played</h3>
          <p className="text-3xl font-bold">
            {playerBaseAverages.timeTyping ?? "N/A"}s
          </p>
        </div>
      </div>
    </div>
  );
}
