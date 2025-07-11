"use server";

import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { db } from "~/server/db";
import { games, users } from "~/server/db/schema";

interface SaveGameStatsParams {
  userId: string;
  mode: "words" | "time";
  wpm: number;
  time: number;
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
    const randomUsername = generateRandomUsername();
    await db.insert(users).values({
      id: userId,
      username: randomUsername,
      bio: "",
      keyboard: "",
      githubUsername: "",
      xUsername: "",
      websiteUrl: "",
      averageWpm: params.wpm,
      averageAccuracy: params.accuracy,
      averageCorrect: params.correct,
      averageIncorrect: params.incorrect,
      averageExtra: params.extra,
      averageMissed: params.missed,
      totalGames: 1,
      totalGamesStarted: 1,
      timeTyping: params.time,
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
    const newTimeTyping = user.timeTyping + params.time;
    const newTotalGamesStarted = user.totalGamesStarted + 1;

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
        totalGamesStarted: newTotalGamesStarted,
        timeTyping: newTimeTyping,
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

export async function updateTimeAndGamesStarted(time: number) {
  const { userId } = await auth();
  if (!userId) {
    return { message: "Unauthorized" };
  }

  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
  });

  if (!user) {
    return { message: "User not found" };
  }

  const totalGamesStarted = user.totalGamesStarted + 1;
  const timeTyping = user.timeTyping + time;

  try {
    await db
      .update(users)
      .set({
        totalGamesStarted: totalGamesStarted,
        timeTyping: timeTyping,
      })
      .where(eq(users.id, userId));
    return { message: "Time and games started updated." };
  } catch (error) {
    return {
      message: "Failed to update time and games started.",
      error: error,
    };
  }
}

function generateRandomUsername() {
  const timeStamp = Date.now().toString(36);
  const randomSuffix = Math.random().toString(36).substring(2, 7);
  return `anon-${timeStamp}-${randomSuffix}`;
}

export async function onBoardUser(userId: string) {
  try {
    // generate a random username
    const randomUsername = generateRandomUsername();
    await db.insert(users).values({
      id: userId,
      username: randomUsername,
      bio: "",
      keyboard: "",
      githubUsername: "",
      xUsername: "",
      websiteUrl: "",
      stayAnonymous: false,
      averageWpm: 0,
      averageAccuracy: 0,
      averageCorrect: 0,
      averageIncorrect: 0,
      averageExtra: 0,
      averageMissed: 0,
      totalGames: 0,
      totalGamesStarted: 0,
      timeTyping: 0,
      highestWpm: 0,
      highestAccuracy: 0,
      highestCorrect: 0,
      highestIncorrect: 0,
      highestExtra: 0,
      highestMissed: 0,
    });

    await db.insert(games).values({
      userId: userId,
      mode: "time",
      timeLimit: 15,
      wordCount: 0,
      wpm: 0,
      rawWpm: 0,
      accuracy: 0,
      correct: 0,
      incorrect: 0,
      extra: 0,
      missed: 0,
      createdAt: new Date(0),
    });
  } catch (error) {
    return { message: "Failed to onboard user.", error: error };
  }
}

export async function addEmptyTimeLimit15Game(userId: string) {
  await db.insert(games).values({
    userId: userId,
    mode: "time",
    timeLimit: 15,
    wordCount: 0,
    wpm: 0,
    rawWpm: 0,
    accuracy: 0,
    correct: 0,
    incorrect: 0,
    extra: 0,
    missed: 0,
    createdAt: new Date(0),
  });
}

export async function makeUserAnonymous() {
  const { userId } = await auth();
  if (!userId) {
    return { message: "Unauthorized" };
  }
  try {
    await db
      .update(users)
      .set({
        stayAnonymous: true,
      })
      .where(eq(users.id, userId));
    return { message: "You will remain anonymous." };
  } catch (error) {
    return { message: "Failed to make user anonymous.", error: error };
  }
}

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
      const existingUser = await db.query.users.findFirst({
        where: eq(users.username, username),
      });
      if (existingUser) {
        return { message: "Username already exists." };
      }
      await db
        .update(users)
        .set({
          username: username,
          stayAnonymous: true,
        })
        .where(eq(users.id, userId));
      return { message: "Username added." };
    } catch (error) {
      return { message: "Failed to add username111.", error: error };
    }
  } else {
    try {
      const existingUser = await db.query.users.findFirst({
        where: eq(users.username, username),
      });
      if (existingUser) {
        return { message: "Username already exists." };
      }
      await db.insert(users).values({
        id: userId,
        username: username,
        bio: "",
        keyboard: "",
        githubUsername: "",
        xUsername: "",
        websiteUrl: "",
        stayAnonymous: false,
        averageWpm: 0,
        averageAccuracy: 0,
        averageCorrect: 0,
        averageIncorrect: 0,
        averageExtra: 0,
        averageMissed: 0,
        totalGames: 0,
        totalGamesStarted: 0,
        timeTyping: 0,
        highestWpm: 0,
        highestAccuracy: 0,
        highestCorrect: 0,
        highestIncorrect: 0,
        highestExtra: 0,
        highestMissed: 0,
      });
  
      await db.insert(games).values({
        userId: userId,
        mode: "time",
        timeLimit: 15,
        wordCount: 0,
        wpm: 0,
        rawWpm: 0,
        accuracy: 0,
        correct: 0,
        incorrect: 0,
        extra: 0,
        missed: 0,
        createdAt: new Date(0),
      });

      return { message: "Username added." };
    } catch (error) {
      return { message: "Failed to add username222.", error: error };
    }
  }
}

interface UpdateUserProfileParams {
  bio: string;
  keyboard: string;
  githubUsername: string;
  xUsername: string;
  websiteUrl: string;
}

export async function updateUserProfile(params: UpdateUserProfileParams) {
  const { userId } = await auth();
  if (!userId) {
    return { message: "Unauthorized" };
  }

  const bio = params.bio.length > 0 ? params.bio : null;
  const keyboard = params.keyboard.length > 0 ? params.keyboard : null;
  const githubUsername = params.githubUsername.length > 0 ? params.githubUsername : null;
  const xUsername = params.xUsername.length > 0 ? params.xUsername : null;
  const websiteUrl = params.websiteUrl.length > 0 ? params.websiteUrl : null;

  try {
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
      columns: {
        bio: true,
        keyboard: true,
        githubUsername: true,
        xUsername: true,
        websiteUrl: true,
      }
    });

    if (!user) {
      return { message: "User not found" };
    }

    await db.update(users).set({
      bio: bio ?? user.bio,
      keyboard: keyboard ?? user.keyboard,
      githubUsername: githubUsername ?? user.githubUsername,
      xUsername: xUsername ?? user.xUsername,
      websiteUrl: websiteUrl ?? user.websiteUrl,
    }).where(eq(users.id, userId));

    return { message: "User profile updated." };
  } catch (error) {
    return { message: "Failed to update user profile.", error: error };
  }
}

export async function updateUserXp (xp: number) {
  const { userId } = await auth();

  if (!userId) {
    return { message: "Unauthorized" };
  }

  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
  });

  if (!user) {
    return { message: "User not found" };
  }

  const totalXp = Math.ceil(user.totalXp + xp);
  
  // Calculate new level based on cumulative XP
  // Level 1: 0 XP
  // Level 2: 100 XP
  // Level 3: 300 XP (100 + 200)
  // Level 4: 600 XP (100 + 200 + 300)
  // Level 5: 1000 XP (100 + 200 + 300 + 400)
  // etc...
  let newLevel = 1;
  let xpRequired = 0;
  let xpIncrement = 100;

  while (totalXp >= xpRequired) {
    xpRequired += xpIncrement;
    xpIncrement += 100;
    newLevel++;
  }

  try {
    await db.update(users).set({
      totalXp: totalXp,
      currentLevel: newLevel,
    }).where(eq(users.id, user.id));

    return { message: "User xp updated." };
  } catch (error) {
    console.log("error", error);
    return { message: "Failed to update user xp.", error: error };
  }
}