import { auth } from "@clerk/nextjs/server";
import { db } from "~/server/db";
import { games, users, type Game, type User } from "~/server/db/schema";
import { count, desc, eq, gt, sql, and } from "drizzle-orm";
import { onBoardUser } from "~/server/db/actions";
import LeaderboardTableToggle from "./_components/leaderboard-table-toggle";
type MaxWpmGameWithUser = Game & { user: User };

export default async function Leaderboard() {
  const { userId } = await auth();

  let user = userId
    ? await db.query.users.findFirst({
        where: eq(users.id, userId),
      })
    : undefined;
  // If user doesn't exist but userId does, onboard them and refetch
  if (!user && userId) {
    await onBoardUser(userId);
    // Refetch the user after onboarding
    user = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });
  }
  let userPosition: { rank: number } | undefined = undefined;
  if (userId && user) {
    try {
      const higherRankedUsers = await db
        .select({ count: count() })
        .from(users)
        .where(sql`${users.averageWpm} > ${user.averageWpm}`);
      userPosition = { rank: (higherRankedUsers[0]?.count ?? 0) + 1 };
    } catch (error) {
      console.error("Error calculating user position:", error);
      userPosition = undefined;
    }
  }
  const userList = await db
    .select()
    .from(users)
    .orderBy(desc(users.averageWpm))
    .where(gt(users.totalGames, 0))
    .limit(50);
  const totalPlayers = await db.select({ count: count() }).from(users);

  // Time limit 15 leaderboard:
  const maxWpmSubquery = db
    .select({
      userId: games.userId,
      maxWpm: sql<number>`max(${games.wpm})`.as("max_wpm"),
    })
    .from(games)
    .where(eq(games.timeLimit, 15))
    .groupBy(games.userId)
    .as("max_wpm_per_user");
  const timeLimit15Games: MaxWpmGameWithUser[] = await db
    .select({
      id: games.id,
      userId: games.userId,
      mode: games.mode,
      timeLimit: games.timeLimit,
      wordCount: games.wordCount,
      wpm: games.wpm,
      rawWpm: games.rawWpm,
      accuracy: games.accuracy,
      correct: games.correct,
      incorrect: games.incorrect,
      extra: games.extra,
      missed: games.missed,
      createdAt: games.createdAt,
      user: {
        id: users.id,
        username: users.username,
        stayAnonymous: users.stayAnonymous,
        averageWpm: users.averageWpm,
        averageAccuracy: users.averageAccuracy,
        averageCorrect: users.averageCorrect,
        averageIncorrect: users.averageIncorrect,
        averageExtra: users.averageExtra,
        averageMissed: users.averageMissed,
        totalGames: users.totalGames,
        highestWpm: users.highestWpm,
        highestAccuracy: users.highestAccuracy,
        highestCorrect: users.highestCorrect,
        highestIncorrect: users.highestIncorrect,
        highestExtra: users.highestExtra,
        highestMissed: users.highestMissed,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      },
    })
    .from(games)
    .innerJoin(users, eq(games.userId, users.id))
    .innerJoin(
      maxWpmSubquery,
      sql`${games.userId} = ${maxWpmSubquery.userId} AND ${games.wpm} = ${maxWpmSubquery.maxWpm}`,
    )
    .where(and(eq(games.timeLimit, 15), eq(games.mode, "time")))
    .orderBy(desc(games.wpm))
    .limit(50);
  const userBestTime: MaxWpmGameWithUser | null = userId
    ? ((
        await db
          .select({
            id: games.id,
            userId: games.userId,
            mode: games.mode,
            timeLimit: games.timeLimit,
            wordCount: games.wordCount,
            wpm: games.wpm,
            rawWpm: games.rawWpm,
            accuracy: games.accuracy,
            correct: games.correct,
            incorrect: games.incorrect,
            extra: games.extra,
            missed: games.missed,
            createdAt: games.createdAt,
            user: {
              id: users.id,
              username: users.username,
              stayAnonymous: users.stayAnonymous,
              averageWpm: users.averageWpm,
              averageAccuracy: users.averageAccuracy,
              averageCorrect: users.averageCorrect,
              averageIncorrect: users.averageIncorrect,
              averageExtra: users.averageExtra,
              averageMissed: users.averageMissed,
              totalGames: users.totalGames,
              highestWpm: users.highestWpm,
              highestAccuracy: users.highestAccuracy,
              highestCorrect: users.highestCorrect,
              highestIncorrect: users.highestIncorrect,
              highestExtra: users.highestExtra,
              highestMissed: users.highestMissed,
              createdAt: users.createdAt,
              updatedAt: users.updatedAt,
            },
          })
          .from(games)
          .innerJoin(users, eq(games.userId, users.id))
          .where(
            and(
              eq(games.userId, userId),
              eq(games.timeLimit, 15),
              eq(games.mode, "time"),
            ),
          )
          .orderBy(desc(games.wpm))
          .limit(1)
      )[0] ?? null)
    : null;

  // Get user's rank on 15s leaderboard
  const userRank15 = userBestTime
    ? await db
        .select({ count: count() })
        .from(maxWpmSubquery)
        .where(sql`${maxWpmSubquery.maxWpm} > ${userBestTime.wpm}`)
        .then((result) => ({ rank: (result[0]?.count ?? 0) + 1 }))
    : undefined;

  return (
    <div className="animate-in fade-in mx-auto mt-8 flex max-w-4xl flex-col items-center gap-8 font-mono duration-500">
      {/* Leaderboard Toggle with conditional user stats */}
      <LeaderboardTableToggle
        users={userList}
        totalPlayers={totalPlayers?.[0]?.count ?? 0}
        userBestTime={userBestTime}
        userRank={userRank15}
        user={user}
        userPosition={userPosition}
        games={timeLimit15Games}
        userId={userId}
      />
    </div>
  );
}
