import { db } from "~/server/db";
import { users, games, type Game, type User } from "./schema";
import { eq, count, desc, gt, sql, and } from "drizzle-orm";
import { onBoardUser } from "./actions";

type MaxWpmGameWithUser = Game & { user: User };

export const getUsername = async (userId: string | null) => {
  if (!userId) return null;
  const user = await db.query.users.findFirst({ where: eq(users.id, userId) });
  if (!user?.username) {
    await onBoardUser(userId);
  }
  return user?.username;
};

export const getUserById = async (userId: string) => {
  return await db.query.users.findFirst({
    where: eq(users.id, userId),
  });
};

export const getUserPosition = async (userAverageWpm: number) => {
  try {
    const higherRankedUsers = await db
      .select({ count: count() })
      .from(users)
      .where(sql`${users.averageWpm} > ${userAverageWpm}`);
    return { rank: (higherRankedUsers[0]?.count ?? 0) + 1 };
  } catch (error) {
    console.error("Error calculating user position:", error);
    return undefined;
  }
};

export const getTopUsers = async () => {
  return await db
    .select()
    .from(users)
    .orderBy(desc(users.averageWpm))
    .where(gt(users.totalGames, 0))
    .limit(50);
};

export const getTotalPlayersCount = async () => {
  const result = await db.select({ count: count() }).from(users);
  return result[0]?.count ?? 0;
};

export const getTimeLimit15Games = async (): Promise<MaxWpmGameWithUser[]> => {
  const maxWpmSubquery = db
    .select({
      userId: games.userId,
      maxWpm: sql<number>`max(${games.wpm})`.as("max_wpm"),
    })
    .from(games)
    .where(and(eq(games.timeLimit, 15), eq(games.mode, "time")))
    .groupBy(games.userId)
    .as("max_wpm_per_user");

  return await db
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
        totalGamesStarted: users.totalGamesStarted,
        timeTyping: users.timeTyping,
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
};

export const getUserBestTime15 = async (
  userId: string,
): Promise<MaxWpmGameWithUser | null> => {
  const result = await db
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
        totalGamesStarted: users.totalGamesStarted,
        timeTyping: users.timeTyping,
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
    .limit(1);

  return result[0] ?? null;
};

export const getUserRank15 = async (userWpm: number) => {
  const maxWpmSubquery = db
    .select({
      userId: games.userId,
      maxWpm: sql<number>`max(${games.wpm})`.as("max_wpm"),
    })
    .from(games)
    .where(and(eq(games.timeLimit, 15), eq(games.mode, "time")))
    .groupBy(games.userId)
    .as("max_wpm_per_user");

  const result = await db
    .select({ count: count() })
    .from(maxWpmSubquery)
    .where(sql`${maxWpmSubquery.maxWpm} > ${userWpm}`);

  return { rank: (result[0]?.count ?? 0) + 1 };
};

export type UserBestTimeStats = {
  time15: { wpm: number; accuracy: number } | null;
  time30: { wpm: number; accuracy: number } | null;
  time60: { wpm: number; accuracy: number } | null;
};

export const getUserBestTimeStats = async (
  userId: string,
): Promise<UserBestTimeStats> => {
  const result = await db
    .select({
      timeLimit: games.timeLimit,
      wpm: games.wpm,
      accuracy: games.accuracy,
    })
    .from(games)
    .where(
      and(
        eq(games.userId, userId),
        eq(games.mode, "time"),
        sql`${games.timeLimit} IN (15, 30, 60)`,
      ),
    )
    .orderBy(desc(games.wpm));

  // Group results by time limit and take the best for each
  const time15 = result.find((game) => game.timeLimit === 15);
  const time30 = result.find((game) => game.timeLimit === 30);
  const time60 = result.find((game) => game.timeLimit === 60);

  return {
    time15:
      time15 && time15.wpm !== null && time15.accuracy !== null
        ? { wpm: time15.wpm, accuracy: time15.accuracy }
        : null,
    time30:
      time30 && time30.wpm !== null && time30.accuracy !== null
        ? { wpm: time30.wpm, accuracy: time30.accuracy }
        : null,
    time60:
      time60 && time60.wpm !== null && time60.accuracy !== null
        ? { wpm: time60.wpm, accuracy: time60.accuracy }
        : null,
  };
};

export type UserBestWordStats = {
  word10: { wpm: number; accuracy: number } | null;
  word25: { wpm: number; accuracy: number } | null;
  word50: { wpm: number; accuracy: number } | null;
  word100: { wpm: number; accuracy: number } | null;
};

export const getUserBestWordStats = async (
  userId: string,
): Promise<UserBestWordStats> => {
  const result = await db
    .select({
      wordCount: games.wordCount,
      wpm: games.wpm,
      accuracy: games.accuracy,
    })
    .from(games)
    .where(and(eq(games.userId, userId), eq(games.mode, "words")))
    .orderBy(desc(games.wpm));

  const word10 = result.find((game) => game.wordCount === 10);
  const word25 = result.find((game) => game.wordCount === 25);
  const word50 = result.find((game) => game.wordCount === 50);
  const word100 = result.find((game) => game.wordCount === 100);

  return {
    word10:
      word10 && word10.wpm !== null && word10.accuracy !== null
        ? { wpm: word10.wpm, accuracy: word10.accuracy }
        : null,
    word25:
      word25 && word25.wpm !== null && word25.accuracy !== null
        ? { wpm: word25.wpm, accuracy: word25.accuracy }
        : null,
    word50:
      word50 && word50.wpm !== null && word50.accuracy !== null
        ? { wpm: word50.wpm, accuracy: word50.accuracy }
        : null,
    word100:
      word100 && word100.wpm !== null && word100.accuracy !== null
        ? { wpm: word100.wpm, accuracy: word100.accuracy }
        : null,
  };
};
