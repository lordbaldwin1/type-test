import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { oxford3000 } from "./oxford3000";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateRandomWords(wordCount = 25): string {
  const result: string[] = [];
  
  for (let i = 0; i < wordCount; i++) {
    let randomIndex = Math.floor(Math.random() * oxford3000.length);
    while ((oxford3000[randomIndex]?.length ?? 0) >= 7 || (oxford3000[randomIndex]?.split(" ").length ?? 0) > 1) {
      randomIndex = Math.floor(Math.random() * oxford3000.length);
    }
    result.push(oxford3000[randomIndex] ?? "");
  }
  
  return result.join(" ");
}
