"use server";

import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { db } from "~/server/db";
import { games, users } from "~/server/db/schema";

interface SaveGameStatsParams {
  userId: string;
  mode: "words" | "time";
  wpm: number;
  rawWpm: number;
  accuracy: number;
  correct: number;
  incorrect: number;
  extra: number;
  missed: number;
  timeLimit?: number;
  wordCount?: number;
}

export async function saveGameStats(params: SaveGameStatsParams) {
  const { userId } = await auth();
  if (!userId) {
    return { message: "Unauthorized" };
  }

  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
  });

  if (!user) {
    await db.insert(users).values({
      id: userId,
      username: "Anonymous",
      averageWpm: params.wpm,
      averageAccuracy: params.accuracy,
      averageCorrect: params.correct,
      averageIncorrect: params.incorrect,
      averageExtra: params.extra,
      averageMissed: params.missed,
      totalGames: 1,
      highestWpm: params.wpm,
      highestAccuracy: params.accuracy,
      highestCorrect: params.correct,
      highestIncorrect: params.incorrect,
      highestExtra: params.extra,
      highestMissed: params.missed,
    });
  } else {
    const totalGames = user.totalGames + 1;
    const averageWpm =
      (user.averageWpm * user.totalGames + params.wpm) / totalGames;
    const averageAccuracy =
      (user.averageAccuracy * user.totalGames + params.accuracy) / totalGames;
    const averageCorrect =
      (user.averageCorrect * user.totalGames + params.correct) / totalGames;
    const averageIncorrect =
      (user.averageIncorrect * user.totalGames + params.incorrect) / totalGames;
    const averageExtra =
      (user.averageExtra * user.totalGames + params.extra) / totalGames;
    const averageMissed =
      (user.averageMissed * user.totalGames + params.missed) / totalGames;
    const highestWpm = Math.max(user.highestWpm, params.wpm);
    const highestAccuracy = Math.max(user.highestAccuracy, params.accuracy);
    const highestCorrect = Math.max(user.highestCorrect, params.correct);
    const highestIncorrect = Math.max(user.highestIncorrect, params.incorrect);
    const highestExtra = Math.max(user.highestExtra, params.extra);
    const highestMissed = Math.max(user.highestMissed, params.missed);

    await db
      .update(users)
      .set({
        averageWpm: averageWpm,
        averageAccuracy: averageAccuracy,
        averageCorrect: averageCorrect,
        averageIncorrect: averageIncorrect,
        averageExtra: averageExtra,
        averageMissed: averageMissed,
        totalGames: totalGames,
        highestWpm: highestWpm,
        highestAccuracy: highestAccuracy,
        highestCorrect: highestCorrect,
        highestIncorrect: highestIncorrect,
        highestExtra: highestExtra,
        highestMissed: highestMissed,
      })
      .where(eq(users.id, userId));
  }

  try {
    await db.insert(games).values({
      userId: params.userId,
      mode: params.mode,
      timeLimit: params.timeLimit,
      wordCount: params.wordCount,
      wpm: params.wpm,
      rawWpm: params.rawWpm,
      accuracy: params.accuracy,
      correct: params.correct,
      incorrect: params.incorrect,
      extra: params.extra,
      missed: params.missed,
    });

    return { message: "Stats saved." };
  } catch (error) {
    return { message: "Failed to add game stats.", error: error };
  }
}

export async function onBoardUser(userId: string) {
  try {
    await db.insert(users).values({
      id: userId,
      username: "Anonymous",
      stayAnonymous: false,
      averageWpm: 0,
      averageAccuracy: 0,
      averageCorrect: 0,
      averageIncorrect: 0,
      averageExtra: 0,
      averageMissed: 0,
      totalGames: 0,
      highestWpm: 0,
      highestAccuracy: 0,
      highestCorrect: 0,
      highestIncorrect: 0,
      highestExtra: 0,
      highestMissed: 0,
      });
  } catch (error) {
    return { message: "Failed to onboard user.", error: error };
  }
};

export async function makeUserAnonymous() {
  const { userId } = await auth();
  if (!userId) {
    return { message: "Unauthorized" };
  }
  try {
    await db.update(users).set({
      stayAnonymous: true,
    }).where(eq(users.id, userId));
    return { message: "You will remain anonymous." };
  } catch (error) {
    return { message: "Failed to make user anonymous.", error: error };
  }
};

export async function addUsername(username: string) {
  const { userId } = await auth();
  if (!userId) {
    return { message: "Unauthorized" };
  }

  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
  });

  if (user) {
    try {
      await db
        .update(users)
        .set({
        username: username,
        stayAnonymous: true,
      })
      .where(eq(users.id, userId));
      return { message: "Username added." };
    } catch (error) {
      return { message: "Failed to add username.", error: error };
    }
  } else {
    return { message: "User not found.", error: "User not found." };
  }
};
