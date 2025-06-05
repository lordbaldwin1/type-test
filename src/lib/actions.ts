"use server";

import { db } from "~/server/db";
import { games } from "~/server/db/schema";

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
  // You might want to add a userId if you have authentication
  // userId: string;
}

export async function saveGameStats(params: SaveGameStatsParams) {

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

    return { message: "Stats saved."}
  } catch (error) {
    return { message: "Failed to add game stats.", error: error };
  }
}
