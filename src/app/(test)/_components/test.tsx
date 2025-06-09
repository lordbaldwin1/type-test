"use client";

import { useCallback, useRef, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { useTypingGame } from "~/app/(test)/_hooks/useTypingGame";
import { saveGameStats } from "~/server/db/actions";
import { useGameState } from "~/app/(test)/_hooks/useGameState";
import { calculateStats } from "~/app/(test)/_utils/gameStats";
import { GameStats } from "./game-stats";
import { GameArea } from "./game-area";
import { GameModeConfig } from "./game-mode-config";
import type { LetterCount } from "~/app/(test)/_utils/types";
import { WordsetSelector } from "./wordset-selector";
import Navbar from "~/components/navbar";
import Footer from "~/components/footer";

export default function TypeTest(props: { initialSampleText: string[] }) {
  const { userId } = useAuth();
  const inputRef = useRef<HTMLInputElement>(null);

  const gameState = useGameState(props.initialSampleText);

  const startGame = useCallback(() => {
    gameState.updateGameState({ status: "during" });
  }, [gameState]);

  const handleTypingGameComplete = useCallback(
    async (finalLetterCount: LetterCount, finalCompletedWords: string[]) => {
      const stats = calculateStats({
        letterCount: finalLetterCount,
        completedWords: finalCompletedWords,
        timeInSeconds: gameState.time,
        mode: gameState.mode,
        timeLimit: gameState.timeLimit,
      });

      gameState.updateGameState({ status: "after", stats });

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
    [gameState, userId],
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
      timeInSeconds: gameState.time,
      mode: gameState.mode,
      timeLimit: gameState.timeLimit,
    });

    gameState.updateGameState({ status: "after", stats });

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
  }, [gameState, userId, completedWords, letterCount]);

  // Handle time up for time mode
  useEffect(() => {
    if (gameState.mode === "time" && gameState.time === 0 && gameState.status === "during") {
      void handleTimeUp();
    }
  }, [gameState.mode, gameState.time, gameState.status, handleTimeUp]);

  const handleReset = () => {
    resetInputState();
    gameState.resetGame();
  };

  // Custom input change handler that includes WPM tracking
  const handleInputChangeWithTracking = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    void handleInputChange(e);
    // Track WPM on every keystroke during game
    if (gameState.status === "during") {
      gameState.trackWpm(letterCount, completedWords);
    }
  }, [handleInputChange, gameState, letterCount, completedWords]);

  return (
    <div className="flex h-screen flex-col">
      <Navbar showUi={gameState.showUi} />
      <main className="flex-1 overflow-auto">
        <div className="flex flex-col items-center justify-start px-4 py-8">
          {gameState.status === "after" ? (
            <div className="animate-in fade-in duration-500">
              <GameStats
                stats={gameState.stats}
                mode={gameState.mode}
                timeLimit={gameState.timeLimit}
                time={gameState.time}
                onReset={handleReset}
                wpmPerSecond={gameState.wpmPerSecond}
              />
            </div>
          ) : (
            <div className="flex w-full max-w-3xl flex-col gap-2">
              <div className="flex w-full justify-center">
                <GameModeConfig
                  mode={gameState.mode}
                  timeLimit={gameState.timeLimit}
                  wordCount={gameState.wordCount}
                  saveStats={gameState.saveStats}
                  showUi={gameState.showUi}
                  updateGameState={gameState.updateGameState}
                  switchMode={gameState.switchMode}
                  changeWordCount={gameState.changeWordCount}
                  changeTimeLimit={gameState.changeTimeLimit}
                  resetGame={gameState.resetGame}
                  userId={userId ?? null}
                />
              </div>
              <WordsetSelector
                wordCount={gameState.wordCount}
                wordSet={gameState.wordSet}
                showUi={gameState.showUi}
                updateGameState={gameState.updateGameState}
                generateNewText={gameState.generateNewText}
              />
              <GameArea
                mode={gameState.mode}
                status={gameState.status}
                sampleText={gameState.sampleText}
                completedWords={completedWords}
                currentWordIndex={currentWordIndex}
                input={input}
                time={gameState.time}
                onInputChange={handleInputChangeWithTracking}
                onInputSubmit={handleSubmit}
                onReset={handleReset}
                saveStats={gameState.saveStats}
                isTextChanging={gameState.isTextChanging}
                inputRef={inputRef}
                onInputFocus={() => gameState.updateGameState({ isInputFocused: true })}
                onInputBlur={() => gameState.updateGameState({ isInputFocused: false })}
                showUi={gameState.showUi}
              />
            </div>
          )}
        </div>
      </main>
      <Footer showUi={gameState.showUi} />
    </div>
  );
}
