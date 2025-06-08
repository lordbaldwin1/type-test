"use client";

import { useEffect, useCallback, useState, useRef } from "react";
import { useAuth } from "@clerk/nextjs";
import { generateRandomWords } from "../_utils/generateRandomWords";
import { useGameTimer } from "~/app/(test)/_hooks/useGameTimer";
import { useTypingGame } from "~/app/(test)/_hooks/useTypingGame";
import { saveGameStats } from "~/server/db/actions";
import { useGameState } from "~/app/(test)/_hooks/useGameState";
import { calculateStats } from "~/app/(test)/_utils/gameStats";
import { GameStats } from "./game-stats";
import { GameArea } from "./game-area";
import { GameModeConfig } from "./game-mode-config";
import { useTestLayout } from "../_context/test-layout-context";
import type { LetterCount, wpmPerSecond } from "~/app/(test)/_utils/types";


export default function TypeTest(props: { initialSampleText: string[] }) {
  const { userId } = useAuth();
  const [isTextChanging, setIsTextChanging] = useState(false);
  const isInitialLoad = useRef(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const { showUi, setShowUi } = useTestLayout();
  const [wpmPerSecond, setWpmPerSecond] = useState<wpmPerSecond[]>([]);

  const {
    gameState,
    updateGameStatus,
    updateGameMode,
    updateStats,
    updateWordCount,
    updateTimeLimit,
    updateSampleText,
    resetGameState,
    updateSaveStats,
  } = useGameState(props.initialSampleText);

  const { time } = useGameTimer(
    gameState.mode,
    gameState.status,
    gameState.timeLimit,
  );

  // Handle input focus changes for UI visibility
  useEffect(() => {
    if (gameState.status === "during") {
      setShowUi(!isInputFocused);
    } else {
      setShowUi(true);
    }
  }, [isInputFocused, gameState.status, setShowUi]);

  // Generate random words when game mode is changed or game is reset with fade animation
  useEffect(() => {
    // Skip animation on initial load
    if (isInitialLoad.current) {
      isInitialLoad.current = false;
      return;
    }

    if (gameState.status === "before" || gameState.status === "restart") {
      setIsTextChanging(true);

      // Fade out, then update text, then fade in
      setTimeout(() => {
        updateSampleText(generateRandomWords(gameState.wordCount).split(" "));
        setTimeout(() => {
          setIsTextChanging(false);
        }, 50); // Quick fade in
      }, 150); // Fade out duration
    }
  }, [gameState.wordCount, gameState.status, updateSampleText]);

  const startGame = useCallback(() => {
    updateGameStatus("during");
  }, [updateGameStatus]);

  const handleTypingGameComplete = useCallback(
    async (finalLetterCount: LetterCount, finalCompletedWords: string[]) => {
      const stats = calculateStats({
        letterCount: finalLetterCount,
        completedWords: finalCompletedWords,
        timeInSeconds: time,
        mode: gameState.mode,
        timeLimit: gameState.timeLimit,
      });

      updateGameStatus("after");
      updateStats(stats);

      if (userId && gameState.saveStats === "true") {
        try {
          await saveGameStats({
            userId: userId,
            ...stats,
            mode: gameState.mode,
            timeLimit: gameState.timeLimit,
            wordCount: gameState.wordCount,
          });
        } catch (error) {
          console.log(error);
        }
      }
    },
    [
      gameState.mode,
      time,
      updateGameStatus,
      updateStats,
      gameState.timeLimit,
      userId,
      gameState.wordCount,
      gameState.saveStats,
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

  useEffect(() => {
    // Reset WPM tracking when game starts or resets
    if (gameState.status === "before" || gameState.status === "restart") {
      setWpmPerSecond([]);
      return;
    }

    if (gameState.status === "during") {
      const timeInMinutes = time / 60;
      
      if (timeInMinutes > 0) {
        // Calculate total characters typed correctly (including spaces between words)
        const totalCorrectChars = letterCount.correct + (completedWords.length > 0 ? completedWords.length - 1 : 0);
        
        // Calculate total characters typed (including incorrect/extra/missed and spaces)
        const totalChars = letterCount.correct + letterCount.incorrect + letterCount.extra + letterCount.missed + 
          (completedWords.length > 0 ? completedWords.length - 1 : 0);

        const newWpmPerSecond = {
          time: time,
          wpm: (totalCorrectChars / 5) / timeInMinutes,
          rawWpm: (totalChars / 5) / timeInMinutes,
        };
        
        setWpmPerSecond(prev => [...prev, newWpmPerSecond]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState.status, time]); // Only run when status or time changes

  const handleTimeUp = useCallback(async () => {
    if (gameState.status === "after") return;

    const stats = calculateStats({
      letterCount,
      completedWords,
      timeInSeconds: time,
      mode: gameState.mode,
      timeLimit: gameState.timeLimit,
    });

    updateGameStatus("after");
    updateStats(stats);

    if (userId && gameState.saveStats === "true") {
      try {
        await saveGameStats({
          userId: userId,
          ...stats,
          mode: gameState.mode,
          timeLimit: gameState.timeLimit,
          wordCount: gameState.wordCount,
        });
      } catch (error) {
        console.log(error);
      }
    }
  }, [
    gameState.status,
    gameState.timeLimit,
    letterCount,
    completedWords,
    updateGameStatus,
    updateStats,
    userId,
    gameState.mode,
    gameState.wordCount,
    time,
    gameState.saveStats,
  ]);

  if (
    gameState.mode === "time" &&
    time === 0 &&
    gameState.status === "during"
  ) {
    void handleTimeUp();
  }

  const handleReset = () => {
    resetInputState();
    resetGameState();
  };

  const handleInputFocus = () => {
    setIsInputFocused(true);
  };

  const handleInputBlur = () => {
    setIsInputFocused(false);
  };

  return (
    <div className="flex flex-col items-center justify-start px-4 py-8">
      {gameState.status === "after" ? (
        <GameStats
          stats={gameState.stats}
          mode={gameState.mode}
          timeLimit={gameState.timeLimit}
          time={time}
          onReset={handleReset}
          wpmPerSecond={wpmPerSecond}
        />
      ) : (
        <div className="flex w-full max-w-3xl flex-col gap-2">
          <div className="flex w-full justify-center">
            <GameModeConfig
              mode={gameState.mode}
              setGameMode={updateGameMode}
              timeLimit={gameState.timeLimit}
              wordCount={gameState.wordCount}
              setTimeLimit={updateTimeLimit}
              setWordCount={updateWordCount}
              resetGameState={resetGameState}
              saveStats={gameState.saveStats}
              updateSaveStats={updateSaveStats}
              showUi={showUi}
            />
          </div>
          <GameArea
            mode={gameState.mode}
            status={gameState.status}
            sampleText={gameState.sampleText}
            completedWords={completedWords}
            currentWordIndex={currentWordIndex}
            input={input}
            time={time}
            onInputChange={handleInputChange}
            onInputSubmit={handleSubmit}
            onReset={handleReset}
            saveStats={gameState.saveStats}
            isTextChanging={isTextChanging}
            inputRef={inputRef}
            onInputFocus={handleInputFocus}
            onInputBlur={handleInputBlur}
            showUi={showUi}
          />
        </div>
      )}
    </div>
  );
}
