import { useCallback, useEffect, useState } from "react";
import { calculateLetterCount } from "../_utils/gameStats";
import type { UseTypingGameProps } from "../_utils/types";

export function useTypingGame({
  sampleText,
  gameStatus,
  completedWords,
  letterCount,
  onGameStart,
  onGameComplete,
  onLetterCountUpdate,
  onCompletedWordsUpdate,
  onReset,
}: UseTypingGameProps) {
  const [input, setInput] = useState<string>("");
  const [currentWordIndex, setCurrentWordIndex] = useState<number>(0);

  // Handle resetting typing state when gameStatus or sampleText changes
  useEffect(() => {
    if (gameStatus === "during") return;

    setInput("");
    setCurrentWordIndex(0);
    onReset?.();
  }, [sampleText, gameStatus, onReset]);

  const resetInputState = () => {
    setInput("");
    setCurrentWordIndex(0);
    onReset?.();
  };

  const updateLetterCount = useCallback(
    (submittedWord: string[], sampleWord: string[]) => {
      if (gameStatus !== "during") {
        return;
      }

      const newLetterCount = calculateLetterCount(submittedWord, sampleWord);
      onLetterCountUpdate?.(newLetterCount);
    },
    [gameStatus, onLetterCountUpdate],
  );

  const handleInputChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;

      if (completedWords.length === 0) {
        onGameStart?.();
      }
      if (newValue.endsWith(" ")) {
        return;
      }

      if (
        sampleText.length - 1 === completedWords.length &&
        sampleText[sampleText.length - 1] === newValue
      ) {
        updateLetterCount(
          newValue.split(""),
          sampleText[sampleText.length - 1]?.split("") ?? [],
        );
        await onGameComplete?.(letterCount, completedWords);
      }
      setInput(newValue);
    },
    [
      updateLetterCount,
      sampleText,
      completedWords,
      letterCount,
      onGameComplete,
      onGameStart,
    ],
  );

  const handleSubmit = useCallback(
    async (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === " " && input.length > 0) {
        const newCompletedWords = [...completedWords, input];
        setInput("");
        onCompletedWordsUpdate?.(newCompletedWords);
        setCurrentWordIndex(currentWordIndex + 1);

        const submittedWord = input.split("");
        const sampleWord = sampleText[completedWords.length]?.split("") ?? [];
        updateLetterCount(submittedWord, sampleWord);

        if (newCompletedWords.length === sampleText.length) {
          await onGameComplete?.(letterCount, completedWords);
        }
      } else if (
        e.key === "Backspace" &&
        input.length === 0 &&
        completedWords.length > 0
      ) {
        e.preventDefault();
        const newCompletedWords = completedWords.slice(
          0,
          completedWords.length - 1,
        );
        const sampleTextPreviousWord = sampleText[currentWordIndex - 1] ?? "";
        const submittedPreviousWord =
          completedWords[completedWords.length - 1] ?? "";
        if (sampleTextPreviousWord.length > 0) {
          const newLetterCount = calculateLetterCount(
            submittedPreviousWord.split(""),
            sampleTextPreviousWord.split(""),
          );
          onLetterCountUpdate?.({
            correct: -newLetterCount.correct,
            incorrect: -newLetterCount.incorrect,
            extra: -newLetterCount.extra,
            missed: -newLetterCount.missed,
          });
        }
        setInput(completedWords[completedWords.length - 1] ?? "");
        setCurrentWordIndex(currentWordIndex - 1);
        onCompletedWordsUpdate?.(newCompletedWords);
      }
    },
    [
      input,
      completedWords,
      currentWordIndex,
      sampleText,
      updateLetterCount,
      letterCount,
      onGameComplete,
      onCompletedWordsUpdate,
      onLetterCountUpdate,
    ],
  );

  return {
    input,
    currentWordIndex,
    handleInputChange,
    handleSubmit,
    resetInputState,
  };
}
