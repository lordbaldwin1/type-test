import { oxford3000 } from "./oxford3000";
import { common200 } from "./common200";
import type { WordSet } from "./types";

export function generateRandomWords(wordCount = 25, wordSet: WordSet): string {
  const result: string[] = [];

  if (wordSet === "oxford3000") {
    for (let i = 0; i < wordCount; i++) {
      let randomIndex = Math.floor(Math.random() * oxford3000.length);
      while (
      (oxford3000[randomIndex]?.length ?? 0) >= 7 ||
      (oxford3000[randomIndex]?.split(" ").length ?? 0) > 1
    ) {
      randomIndex = Math.floor(Math.random() * oxford3000.length);
    }
      result.push(oxford3000[randomIndex] ?? "");
    }
  } else if (wordSet === "common200") {
    for (let i = 0; i < wordCount; i++) {
      result.push(common200[Math.floor(Math.random() * common200.length)] ?? "");
    }
  }

  return result.join(" ");
}
