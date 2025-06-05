"use client";

import {
  useEffect,
  useRef,
  useState,
  useMemo,
  useCallback,
  memo,
  forwardRef,
} from "react";
import { useAuth } from "@clerk/nextjs";
import { generateRandomWords } from "../lib/utils";
import { Clock, Hash, RotateCcw } from "lucide-react";
import { useGameTimer } from "~/lib/hooks/useGameTimer";
import { useTypingGame } from "~/lib/hooks/useTypingGame";
import { saveGameStats } from "~/lib/actions";
import { Button } from "./ui/button";

interface LetterCount {
  correct: number;
  incorrect: number;
  extra: number;
  missed: number;
}

type GameStatus = "before" | "during" | "after";
type GameMode = "words" | "time";

interface GameState {
  status: GameStatus;
  mode: GameMode;
  stats: {
    wpm: number;
    rawWpm: number;
    accuracy: number;
    correct: number;
    incorrect: number;
    extra: number;
    missed: number;
  };
  wordCount: number;
  timeLimit: number;
  sampleText: string[];
}

export default function TypeTest(props: { initialSampleText: string[] }) {
  const { userId } = useAuth();
  const containerRef = useRef<HTMLDivElement>(null);
  const activeWordRef = useRef<HTMLDivElement>(null);
  const [isInputFocused, setIsInputFocused] = useState(false);

  // GAME STATE
  const [gameState, setGameState] = useState<GameState>({
    status: "before",
    mode: "words",
    stats: {
      wpm: 0,
      rawWpm: 0,
      accuracy: 0,
      correct: 0,
      incorrect: 0,
      extra: 0,
      missed: 0,
    },
    wordCount: 10,
    timeLimit: 0,
    sampleText: props.initialSampleText,
  });

  useEffect(() => {
    if (gameState.sampleText.length === 0) {
      setGameState((prev) => ({
        ...prev,
        sampleText: generateRandomWords(prev.wordCount).split(" "),
      }));
    }
  }, [gameState.sampleText.length, gameState.wordCount]);

  const { time, resetTimer } = useGameTimer(
    gameState.mode,
    gameState.status,
    gameState.timeLimit,
  );

  const startGame = useCallback(() => {
    setGameState((prev) => ({
      ...prev,
      status: "during",
    }));
  }, [setGameState]);

  const handleTypingGameComplete = useCallback(
    async (finalLetterCount: LetterCount, finalCompletedWords: string[]) => {
      const characterCount = finalCompletedWords.reduce((count, string) => {
        return count + string.length;
      }, 0);
      const spaceCount = finalCompletedWords.length - 1;

      const totalCharCount = characterCount + spaceCount;

      const correctWordCount = (finalLetterCount.correct + spaceCount) / 5;
      const rawWordCount = totalCharCount / 5;

      let timeInMinutes;
      if (gameState.mode === "time") {
        timeInMinutes = gameState.timeLimit / 60;
      } else {
        timeInMinutes = time / 60;
      }
      if (timeInMinutes === 0) return;

      const wpm = Math.floor(correctWordCount / timeInMinutes);
      const rawWpm = Math.floor(rawWordCount / timeInMinutes);
      const accuracy = finalLetterCount.correct / totalCharCount;

      setGameState((prev) => ({
        ...prev,
        status: "after",
        stats: {
          wpm,
          rawWpm,
          accuracy: Math.floor(accuracy * 100),
          correct: finalLetterCount.correct,
          incorrect: finalLetterCount.incorrect,
          extra: finalLetterCount.extra,
          missed: finalLetterCount.missed,
        },
      }));
      if (userId) {
        console.log("in if userID:", userId);
        try {
          await saveGameStats({
            userId: userId,
            wpm,
            rawWpm,
            accuracy: Math.floor(accuracy * 100),
            correct: finalLetterCount.correct,
            incorrect: finalLetterCount.incorrect,
            extra: finalLetterCount.extra,
            missed: finalLetterCount.missed,
            mode: gameState.mode,
            timeLimit: gameState.timeLimit,
            wordCount: gameState.wordCount,
          });
        } catch (error) {
          // TODO: ADD DISPLAY ON STAT SCREEN TO INDICATE THAT STAT SAVE FAILED
          console.log(error);
        }
      }
    },
    [
      gameState.mode,
      time,
      setGameState,
      gameState.timeLimit,
      userId,
      gameState.wordCount,
    ],
  );

  const {
    input,
    completedWords,
    currentWordIndex,
    letterCount,
    handleInputChange,
    handleSubmit,
    resetInputState,
  } = useTypingGame({
    sampleText: gameState.sampleText,
    gameStatus: gameState.status,
    onGameStart: startGame,
    onGameComplete: handleTypingGameComplete,
  });

  const handleTimeUp = useCallback(async () => {
    if (gameState.status === "after") return;

    // Use the currentLetterCount and currentCompletedWords from useTypingGame's return
    const characterCount = completedWords.reduce(
      (count, string) => count + string.length,
      0,
    );
    const spaceCount =
      completedWords.length > 0 ? completedWords.length - 1 : 0;
    const totalCharCount = characterCount + spaceCount;

    const correctCharsForWPM = letterCount.correct;
    const rawCharsForWPM = totalCharCount;

    // In "time" mode, when timer ends, WPM is based on timeLimit
    const timeInMinutes = gameState.timeLimit / 60;

    const wpm =
      timeInMinutes > 0
        ? Math.floor(correctCharsForWPM / 5 / timeInMinutes)
        : 0;
    const rawWpm =
      timeInMinutes > 0 ? Math.floor(rawCharsForWPM / 5 / timeInMinutes) : 0;
    const accuracy =
      totalCharCount > 0
        ? Math.floor((letterCount.correct / totalCharCount) * 100)
        : 0;

    setGameState((prev) => ({
      ...prev,
      status: "after",
      stats: {
        wpm,
        rawWpm,
        accuracy,
        correct: letterCount.correct,
        incorrect: letterCount.incorrect,
        extra: letterCount.extra,
        missed: letterCount.missed,
      },
    }));

    if (userId) {
      console.log("in if userID:", userId);
      try {
        await saveGameStats({
          userId: userId,
          wpm,
          rawWpm,
          accuracy: Math.floor(accuracy * 100),
          correct: letterCount.correct,
          incorrect: letterCount.incorrect,
          extra: letterCount.extra,
          missed: letterCount.missed,
          mode: gameState.mode,
          timeLimit: gameState.timeLimit,
          wordCount: gameState.wordCount,
        });
      } catch (error) {
        // TODO: ADD DISPLAY ON STAT SCREEN TO INDICATE THAT STAT SAVE FAILED
        console.log(error);
      }
    }
  }, [
    gameState.status,
    gameState.timeLimit,
    letterCount, // From useTypingGame
    completedWords, // From useTypingGame
    setGameState,
    userId,
    gameState.mode,
    gameState.wordCount,
  ]);

  // Ref/useEffect to focus input box
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to active word
  useEffect(() => {
    if (activeWordRef.current && containerRef.current) {
      activeWordRef.current.scrollIntoView({
        behavior: "instant",
        block: "center",
        inline: "nearest",
      });
    }
  }, [currentWordIndex]);

  const resetGameState = useCallback(() => {
    setGameState((prev) => ({
      ...prev,
      status: "before",
      sampleText: generateRandomWords(prev.wordCount).split(" "),
      stats: {
        wpm: 0,
        rawWpm: 0,
        accuracy: 0,
        correct: 0,
        incorrect: 0,
        extra: 0,
        missed: 0,
      },
    }));
    resetTimer();
  }, [resetTimer]);

  const handleGameAreaClick = useCallback(() => {
    if (gameState.status === "during" || gameState.status === "before") {
      inputRef.current?.focus();
    }
  }, [gameState.status]);

  if (
    gameState.mode === "time" &&
    time === 0 &&
    gameState.status === "during"
  ) {
    void handleTimeUp();
  }

  // Focus input when game starts or resets
  useEffect(() => {
    if (gameState.status === "during" || gameState.status === "before") {
      inputRef.current?.focus();
    }
  }, [gameState.status]);

  const memoizedGameModeConfig = useMemo(
    () => (
      <GameModeConfig
        mode={gameState.mode}
        setGameMode={(mode) => setGameState((prev) => ({ ...prev, mode }))}
        timeLimit={gameState.timeLimit}
        wordCount={gameState.wordCount}
        setTimeLimit={(time) =>
          setGameState((prev) => ({ ...prev, timeLimit: time }))
        }
        setWordCount={(count) =>
          setGameState((prev) => ({ ...prev, wordCount: count }))
        }
        resetGameState={resetGameState}
      />
    ),
    [gameState.mode, gameState.timeLimit, gameState.wordCount, resetGameState],
  );

  return (
    <div
      className="flex flex-col items-center justify-start px-4 py-8"
      style={{ minHeight: "calc(100vh - 8rem)" }}
      onClick={handleGameAreaClick}
    >
      {gameState.status === "after" && (
        <div className="bg-card flex flex-col items-center gap-4 rounded-lg border p-6">
          <div className="grid w-full grid-cols-2 gap-4">
            <div className="bg-muted flex flex-col items-center rounded p-3">
              <span className="text-muted-foreground text-sm">WPM</span>
              <span className="text-primary text-2xl font-bold">
                {gameState.stats.wpm}
              </span>
            </div>
            <div className="bg-muted flex flex-col items-center rounded p-3">
              <span className="text-muted-foreground text-sm">Raw WPM</span>
              <span className="text-primary text-2xl font-bold">
                {gameState.stats.rawWpm}
              </span>
            </div>
            <div className="bg-muted flex flex-col items-center rounded p-3">
              <span className="text-muted-foreground text-sm">Accuracy</span>
              <span className="text-primary text-2xl font-bold">
                {gameState.stats.accuracy}%
              </span>
            </div>
            <div className="bg-muted flex flex-col items-center rounded p-3">
              <span className="text-muted-foreground text-sm">Time</span>
              <span className="text-primary text-2xl font-bold">{time}s</span>
            </div>
          </div>

          <div className="bg-muted w-full rounded p-3">
            <div className="grid grid-cols-4 gap-2 text-center">
              <div>
                <span className="text-primary text-sm">Correct</span>
                <p className="text-foreground text-lg font-bold">
                  {gameState.stats.correct}
                </p>
              </div>
              <div>
                <span className="text-destructive text-sm">Incorrect</span>
                <p className="text-foreground text-lg font-bold">
                  {gameState.stats.incorrect}
                </p>
              </div>
              <div>
                <span className="text-primary text-sm">Extra</span>
                <p className="text-foreground text-lg font-bold">
                  {gameState.stats.extra}
                </p>
              </div>
              <div>
                <span className="text-primary text-sm">Missed</span>
                <p className="text-foreground text-lg font-bold">
                  {gameState.stats.missed}
                </p>
              </div>
            </div>
          </div>

          <button
            className="bg-primary text-primary-foreground hover:bg-primary/90 rounded px-6 py-2 font-bold transition-colors"
            onClick={resetGameState}
          >
            Try Again
          </button>
        </div>
      )}
      {(gameState.status === "during" || gameState.status === "before") && (
        <div className="flex w-full max-w-3xl flex-col gap-2">
          <div className="flex w-full justify-center">
            {memoizedGameModeConfig}
          </div>
          <div className="mt-8 flex flex-col items-center">
            <input
              ref={inputRef}
              onFocus={() => setIsInputFocused(true)}
              onBlur={(e) => {
                setIsInputFocused(false);
                // Don't refocus if user is navigating to another focusable element
                if (e.relatedTarget) return;

                if (
                  gameState.status === "during" ||
                  gameState.status === "before"
                ) {
                  inputRef.current?.focus();
                }
              }}
              type="text"
              value={input}
              maxLength={15}
              onChange={handleInputChange}
              onKeyDown={handleSubmit}
              className="bg-background border-border text-foreground absolute mb-4 border-2 opacity-0"
            />

            {/* Wrapper for stats and text area with blur overlay */}
            <div className="relative">
              {/* Blur overlay when input not focused */}
              {!isInputFocused &&
                (gameState.status === "during" ||
                  gameState.status === "before") && (
                  <div className="absolute inset-0 z-20 flex items-center justify-center">
                    <div className="bg-background/20 absolute inset-0 backdrop-blur-[2px]" />
                    <div className="bg-background/80 relative z-10 rounded-lg p-4 text-center backdrop-blur-[4px]">
                      <p className="text-foreground mt-36 text-2xl font-medium">
                        Click to focus
                      </p>
                      <p className="text-foreground/70 mt-1 text-lg">
                        Start typing to begin
                      </p>
                    </div>
                  </div>
                )}

              <div className="mt-36 ml-4 w-full">
                {gameState.mode === "words" && (
                  <p className="text-primary text-2xl font-bold">{`${completedWords.length}/${gameState.sampleText.length}`}</p>
                )}
                {gameState.mode === "time" && (
                  <p className="text-primary text-2xl font-bold">{`${time}s`}</p>
                )}
              </div>

              <div
                ref={containerRef}
                className="relative mx-auto ml-2 flex h-[7.5em] w-full max-w-full items-start justify-center overflow-hidden"
              >
                <div className="flex flex-wrap gap-x-4 gap-y-0 text-center font-mono text-4xl tracking-wide">
                  {gameState.sampleText.map((word, index) => (
                    <Word
                      key={index}
                      ref={index === currentWordIndex ? activeWordRef : null}
                      word={word}
                      input={
                        index < completedWords.length
                          ? (completedWords[index] ?? "")
                          : index === currentWordIndex
                            ? input
                            : ""
                      }
                      isActive={index === currentWordIndex}
                      isCompleted={index < currentWordIndex}
                    />
                  ))}
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              className="text-muted-foreground hover:text-foreground mt-12 hover:scale-110"
              onClick={() => {
                resetInputState();
                resetGameState();
              }}
            >
              <RotateCcw />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

const Word = memo(
  forwardRef<
    HTMLDivElement,
    {
      word: string;
      input: string;
      isActive: boolean;
      isCompleted: boolean;
    }
  >(function Word(props, ref) {
    const word = props.word.split("");
    const input = props.input.split("");
    const cursorPosition = input.length;
    const isCorrect = props.word === props.input;
    const extraLetters =
      input.length > word.length ? input.slice(word.length) : [];
    const showEndCursor =
      props.isActive &&
      cursorPosition === word.length &&
      extraLetters.length === 0;

    return (
      <div
        ref={ref}
        className="relative flex flex-row font-mono text-4xl tracking-wide"
      >
        <div className="flex">
          {props.isCompleted && !isCorrect ? (
            <div className="decoration-destructive flex underline">
              {word.map((letter, index) => {
                if (letter === input[index]) {
                  return (
                    <Letter key={index} letter={letter} status={"correct"} />
                  );
                } else if (letter !== input[index] && input[index]) {
                  return (
                    <Letter key={index} letter={letter} status={"incorrect"} />
                  );
                } else {
                  return <Letter key={index} letter={letter} status={"none"} />;
                }
              })}
              {extraLetters.map((letter, index) => (
                <Letter
                  key={`extra-${index}`}
                  letter={letter}
                  status={"incorrect"}
                />
              ))}
            </div>
          ) : (
            <div className="flex">
              {word.map((letter, index) => {
                const showCursor =
                  props.isActive &&
                  index === cursorPosition &&
                  cursorPosition !== word.length + extraLetters.length;
                if (letter === input[index]) {
                  return (
                    <Letter
                      key={index}
                      letter={letter}
                      status={"correct"}
                      showCursor={showCursor}
                    />
                  );
                } else if (letter !== input[index] && input[index]) {
                  return (
                    <Letter
                      key={index}
                      letter={letter}
                      status={"incorrect"}
                      showCursor={showCursor}
                    />
                  );
                } else {
                  return (
                    <Letter
                      key={index}
                      letter={letter}
                      status={"none"}
                      showCursor={showCursor}
                    />
                  );
                }
              })}
              {extraLetters.map((letter, index) => (
                <Letter
                  key={`extra-${index}`}
                  letter={letter}
                  status={"incorrect"}
                  showCursor={
                    props.isActive &&
                    word.length + index === cursorPosition &&
                    cursorPosition === word.length + extraLetters.length
                  }
                />
              ))}
            </div>
          )}
        </div>

        {showEndCursor && (
          <span
            className="border-foreground absolute top-0 bottom-0 border-l-2"
            style={{
              left: "100%",
              height: "1em",
            }}
          ></span>
        )}
      </div>
    );
  }),
);

const Letter = memo(function Letter(props: {
  letter: string;
  status: string;
  showCursor?: boolean;
}) {
  const letter = props.letter;
  const status = props.status;
  const showCursor = props.showCursor;

  let textColorClass = "";
  if (status === "correct") {
    textColorClass = "text-foreground";
  } else if (status === "incorrect") {
    textColorClass = "text-destructive";
  } else if (status === "none") {
    textColorClass = "text-muted-foreground";
  }

  return (
    <div className="relative inline-block">
      <span className={textColorClass}>{letter}</span>
      {showCursor && (
        <span
          className="border-foreground absolute top-0 bottom-0 border-l-2"
          style={{
            left: "0",
            height: "1em",
            transform: "translateX(-1px)",
          }}
        ></span>
      )}
    </div>
  );
});

const GameModeConfig = memo(function GameModeConfig(props: {
  mode: GameMode;
  setGameMode: (mode: GameMode) => void;
  timeLimit: number;
  wordCount: number;
  setTimeLimit: (time: number) => void;
  setWordCount: (count: number) => void;
  resetGameState: () => void;
}) {
  const wordOptions = [10, 25, 50, 100];
  const timeOptions = [15, 30, 60];
  const {
    mode,
    setGameMode,
    timeLimit,
    wordCount,
    setTimeLimit,
    setWordCount,
    resetGameState,
  } = props;

  return (
    <div className="bg-card text-muted-foreground flex items-center justify-center rounded-md border p-2">
      {/* Mode toggles */}
      <div className="mr-4 flex space-x-4">
        <button
          className={`hover:text-primary flex items-center transition-colors hover:cursor-pointer ${
            mode === "time" ? "text-primary" : ""
          }`}
          onClick={() => {
            setGameMode("time");
            setTimeLimit(15);
            setWordCount(50);
            resetGameState();
          }}
        >
          <div className="flex flex-row items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>time</span>
          </div>
        </button>

        <button
          className={`hover:text-primary flex items-center transition-colors hover:cursor-pointer ${
            mode === "words" ? "text-primary" : ""
          }`}
          onClick={() => {
            setGameMode("words");
            setWordCount(10);
            resetGameState();
          }}
        >
          <div className="flex flex-row items-center gap-2">
            <Hash className="h-4 w-4" />
            <span>words</span>
          </div>
        </button>
      </div>

      {/* Divider */}
      <div className="bg-border mx-4 h-6 w-px"></div>

      {/* Options based on active mode */}
      <div className="flex space-x-2">
        {mode === "time" && (
          <>
            {timeOptions.map((seconds) => (
              <button
                key={seconds}
                className={`rounded px-2 py-1 transition-colors ${
                  timeLimit === seconds
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted hover:text-foreground"
                }`}
                onClick={() => {
                  setTimeLimit(seconds);
                  setWordCount(seconds * 2.5);
                  resetGameState();
                }}
              >
                {seconds}
              </button>
            ))}
          </>
        )}

        {mode === "words" && (
          <>
            {wordOptions.map((count) => (
              <button
                key={count}
                className={`rounded px-2 py-1 transition-colors ${
                  wordCount === count
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted hover:text-foreground"
                }`}
                onClick={() => {
                  setWordCount(count);
                  resetGameState();
                }}
              >
                {count}
              </button>
            ))}
          </>
        )}
      </div>
    </div>
  );
});
