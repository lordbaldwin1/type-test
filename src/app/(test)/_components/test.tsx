"use client";

import { useEffect, useCallback } from "react";
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
import type { LetterCount } from "~/app/(test)/_utils/types";

export default function TypeTest(props: { initialSampleText: string[] }) {
  const { userId } = useAuth();
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
  // Generate random words when game mode is changed or game is reset
  useEffect(() => {
    if (gameState.status === "before" || gameState.status === "restart") {
      updateSampleText(generateRandomWords(gameState.wordCount).split(" "));
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

  return (
    <div className="flex flex-col items-center justify-start px-4 py-8">
      {gameState.status === "after" ? (
        <GameStats
          stats={gameState.stats}
          mode={gameState.mode}
          timeLimit={gameState.timeLimit}
          time={time}
          onReset={handleReset}
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
          />
        </div>
      )}
    </div>
  );
}
