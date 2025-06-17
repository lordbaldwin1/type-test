import type { GameStats, LetterCount, StatsCalculationInput } from "./types";

export function calculateStats({
  letterCount,
  completedWords,
  timeInSeconds,
  mode,
  timeLimit,
}: StatsCalculationInput): GameStats {
  const characterCount = completedWords.reduce(
    (count, string) => count + string.length,
    0,
  );
  const spaceCount = completedWords.length > 0 ? completedWords.length - 1 : 0;
  const totalCharCount = characterCount + spaceCount;

  // Calculate correct and raw word counts
  const correctWordCount = (letterCount.correct + spaceCount) / 5;
  const rawWordCount = totalCharCount / 5;

  // Determine the time to use for WPM calculation
  const timeInMinutes =
    mode === "time" ? (timeLimit ?? 0) / 60 : timeInSeconds / 60;

  // Calculate WPM and accuracy
  const wpm =
    timeInMinutes > 0 ? Math.floor(correctWordCount / timeInMinutes) : 0;

  const rawWpm =
    timeInMinutes > 0 ? Math.floor(rawWordCount / timeInMinutes) : 0;

  const accuracy =
    totalCharCount > 0
      ? Math.floor(((letterCount.correct + spaceCount) / totalCharCount) * 100)
      : 0;

  return {
    wpm,
    rawWpm,
    accuracy,
    correct: letterCount.correct,
    incorrect: letterCount.incorrect,
    extra: letterCount.extra,
    missed: letterCount.missed,
  };
}

export function calculateLetterCount(
  submittedWord: string[],
  sampleWord: string[],
): LetterCount {
  const extraCount =
    submittedWord.length > sampleWord.length
      ? submittedWord.slice(sampleWord.length).length
      : 0;

  const missedCount =
    submittedWord.length < sampleWord.length
      ? sampleWord.length - submittedWord.length
      : 0;

  let correctCount = 0;
  let incorrectCount = 0;

  for (let i = 0; i < submittedWord.length; i++) {
    if (submittedWord[i] === sampleWord[i]) {
      correctCount++;
    } else if (submittedWord[i] !== sampleWord[i]) {
      incorrectCount++;
    }
  }

  return {
    correct: correctCount,
    incorrect: incorrectCount,
    extra: extraCount,
    missed: missedCount,
  };
}

interface XpCalculationInput {
  letterCount: LetterCount;
  completedWords: string[];
  wpm: number;
  accuracy: number;
}

export function calculateXp({
  letterCount,
  completedWords,
  wpm,
  accuracy,
}: XpCalculationInput) {
  // Add 1 xp for correct character, xp multiplier based on wpm, and xp multiplier based on accuracy

  const correctCharCount = letterCount.correct + completedWords.length;
  let xpMultiplier;
  let accuracyMultiplier;
  if (wpm < 50) {
    xpMultiplier = 1;
  } else if (wpm < 100) {
    xpMultiplier = 1.25;
  } else if (wpm < 150) {
    xpMultiplier = 1.5;
  } else if (wpm < 200) {
    xpMultiplier = 2;
  } else if (wpm < 250) {
    xpMultiplier = 2.5;
  } else if (wpm < 300) {
    xpMultiplier = 3;
  } else if (wpm < 350) {
    xpMultiplier = 3.5;
  } else {
    xpMultiplier = 4;
  }

  if (accuracy < 90) {
    accuracyMultiplier = 0.85;
  } else if (accuracy < 95) {
    accuracyMultiplier = 0.95;
  } else if (accuracy < 98) {
    accuracyMultiplier = 1;
  } else {
    accuracyMultiplier = 1.25;
  }

  const xp = correctCharCount * xpMultiplier * accuracyMultiplier;

  return xp;
}