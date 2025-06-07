import { useCallback, useEffect, useState } from "react";
import { calculateLetterCount } from "../_utils/gameStats";
import type { LetterCount, UseTypingGameProps } from "../_utils/types";

export function useTypingGame({
  sampleText,
  gameStatus,
  onGameStart,
  onGameComplete,
}: UseTypingGameProps) {
  const [input, setInput] = useState<string>("");
  const [currentWordIndex, setCurrentWordIndex] = useState<number>(0);
  const [completedWords, setCompletedWords] = useState<string[]>([]);
  const [letterCount, setLetterCount] = useState<LetterCount>({
    correct: 0,
    incorrect: 0,
    extra: 0,
    missed: 0,
  });

  // Handle resetting typing state when gameStatus or sampleText changes
  useEffect(() => {
    if (gameStatus === "during") return;

    setInput("");
    setCurrentWordIndex(0);
    setCompletedWords([]);
    setLetterCount({
      correct: 0,
      incorrect: 0,
      extra: 0,
      missed: 0,
    });
  }, [sampleText, gameStatus]);

  const resetInputState = () => {
    setInput("");
    setCurrentWordIndex(0);
    setCompletedWords([]);
    setLetterCount({
      correct: 0,
      incorrect: 0,
      extra: 0,
      missed: 0,
    });
  };

  const updateLetterCount = useCallback(
    (submittedWord: string[], sampleWord: string[]) => {
      if (gameStatus !== "during") {
        return;
      }

      const newLetterCount = calculateLetterCount(submittedWord, sampleWord);
      setLetterCount((prev) => ({
        correct: prev.correct + newLetterCount.correct,
        incorrect: prev.incorrect + newLetterCount.incorrect,
        extra: prev.extra + newLetterCount.extra,
        missed: prev.missed + newLetterCount.missed,
      }));
    },
    [gameStatus],
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
        setCompletedWords(newCompletedWords);
        setCurrentWordIndex(currentWordIndex + 1);

        const submittedWord =
          newCompletedWords[newCompletedWords.length - 1]?.split("") ?? [];
        const sampleWord =
          sampleText[newCompletedWords.length - 1]?.split("") ?? [];
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
        setInput(completedWords[completedWords.length - 1] ?? "");
        setCurrentWordIndex(currentWordIndex - 1);
        setCompletedWords(newCompletedWords);
        // TODO: UPDATE LETTER COUNT HERE TOO!!!!
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
    ],
  );

  return {
    input,
    completedWords,
    currentWordIndex,
    letterCount,
    handleInputChange,
    handleSubmit,
    resetInputState,
  };
}
