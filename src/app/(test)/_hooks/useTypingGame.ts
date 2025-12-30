import { useCallback, useEffect, useState } from "react";
import { useGameStore } from "../_store/gameStore";
import { calculateLetterCount } from "../_utils/gameStats";

export function useTypingGame() {
  const [input, setInput] = useState("");

  const status = useGameStore((s) => s.status);
  const sampleText = useGameStore((s) => s.sampleText);
  const completedWords = useGameStore((s) => s.completedWords);
  const startGame = useGameStore((s) => s.startGame);
  const endGame = useGameStore((s) => s.endGame);
  const completeWord = useGameStore((s) => s.completeWord);
  const undoWord = useGameStore((s) => s.undoWord);

  const currentWordIndex = completedWords.length;

  useEffect(() => {
    if (status !== "playing") {
      setInput("");
    }
  }, [sampleText, status]);

  const handleInputChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;

      if (status === "idle" && newValue.length > 0) {
        startGame();
      }

      if (newValue.endsWith(" ")) {
        return;
      }

      // Complete last word without needing space
      const isLastWord = currentWordIndex === sampleText.length - 1;
      const lastWord = sampleText[sampleText.length - 1] ?? "";

      if (isLastWord && newValue === lastWord) {
        const letterCount = calculateLetterCount(
          newValue.split(""),
          lastWord.split("")
        );
        completeWord(newValue, letterCount);
        setInput("");
        await endGame();
        return;
      }

      setInput(newValue);
    },
    [status, currentWordIndex, sampleText, startGame, endGame, completeWord]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === " " && input.length > 0) {
        e.preventDefault();

        const currentWord = sampleText[currentWordIndex] ?? "";
        const letterCount = calculateLetterCount(
          input.split(""),
          currentWord.split("")
        );

        completeWord(input, letterCount);
        setInput("");

        if (currentWordIndex + 1 === sampleText.length) {
          void endGame();
        }
      }

      // Backspace at empty input goes back to previous word
      if (e.key === "Backspace" && input.length === 0 && completedWords.length > 0) {
        e.preventDefault();

        const previousWord = completedWords[completedWords.length - 1] ?? "";
        const sampleWord = sampleText[currentWordIndex - 1] ?? "";

        const letterCount = calculateLetterCount(
          previousWord.split(""),
          sampleWord.split("")
        );

        undoWord(letterCount);
        setInput(previousWord);
      }
    },
    [input, sampleText, currentWordIndex, completedWords, completeWord, undoWord, endGame]
  );

  return {
    input,
    currentWordIndex,
    handleInputChange,
    handleKeyDown,
  };
}
