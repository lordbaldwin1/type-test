// input state
// currentWordIndex state
// completedWords state
// handleInputChange function
// handleSubmit function (the keydown handler)
// The logic for moving between words
// Word completion detection

import { useCallback, useEffect, useState } from "react";

type GameStatus = "before" | "during" | "after";
interface LetterCount {
  correct: number;
  incorrect: number;
  extra: number;
  missed: number;
}

interface UseTypingGameProps {
  sampleText: string[];
  gameStatus: GameStatus; // To know when to reset, etc.
  onGameStart?: () => void;
  onGameComplete?: (
    finalLetterCount: LetterCount,
    finalCompletedWords: string[],
  ) => Promise<void>; // Callback now expects these args
}

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

      setLetterCount((prev) => ({
        correct: prev.correct + correctCount,
        incorrect: prev.incorrect + incorrectCount,
        extra: prev.extra + extraCount,
        missed: prev.missed + missedCount,
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
