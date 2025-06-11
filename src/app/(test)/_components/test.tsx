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
import { Button } from "~/components/ui/button";
import { RotateCcw } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "~/components/ui/tooltip";

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
    currentWordIndex,
    handleInputChange,
    handleSubmit,
    resetInputState,
  } = useTypingGame({
    sampleText: gameState.sampleText,
    gameStatus: gameState.status,
    completedWords: gameState.completedWords,
    letterCount: gameState.letterCount,
    onGameStart: startGame,
    onGameComplete: handleTypingGameComplete,
    onLetterCountUpdate: gameState.updateLetterCount,
    onCompletedWordsUpdate: gameState.updateCompletedWords,
    onReset: gameState.resetTypingState,
  });

  const handleTimeUp = useCallback(async () => {
    if (gameState.status === "after") return;

    const stats = calculateStats({
      letterCount: gameState.letterCount,
      completedWords: gameState.completedWords,
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
  }, [gameState, userId]);

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

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar showUi={gameState.showUi} />
      <div className="flex-1 flex flex-col">
        <main className="flex-1 flex flex-col">
          {gameState.status === "after" ? (
            <div className="flex items-center justify-center px-4 py-8">
              <div className="animate-in fade-in duration-500">
                <GameStats
                  stats={gameState.stats}
                  mode={gameState.mode}
                  timeLimit={gameState.timeLimit}
                  time={gameState.time}
                  wpmPerSecond={gameState.wpmPerSecond}
                />
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col justify-center px-4 min-h-0">
              {/* Game Mode Config - Fixed at top */}
              <div className="flex justify-center py-2 sm:py-4 md:py-6">
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

              {/* Centered Content Container - WordsetSelector + GameArea */}
              <div className="flex-1 flex flex-col items-center justify-center space-y-6 min-h-0">
                {/* WordsetSelector */}
                <WordsetSelector
                  wordCount={gameState.wordCount}
                  wordSet={gameState.wordSet}
                  showUi={gameState.showUi}
                  updateGameState={gameState.updateGameState}
                  generateNewText={gameState.generateNewText}
                />

                {/* GameArea */}
                <GameArea
                  mode={gameState.mode}
                  status={gameState.status}
                  sampleText={gameState.sampleText}
                  completedWords={gameState.completedWords}
                  currentWordIndex={currentWordIndex}
                  input={input}
                  time={gameState.time}
                  onInputChange={handleInputChange}
                  onInputSubmit={handleSubmit}
                  saveStats={gameState.saveStats}
                  isTextChanging={gameState.isTextChanging}
                  inputRef={inputRef}
                  onInputFocus={() => gameState.updateGameState({ isInputFocused: true })}
                  onInputBlur={() => gameState.updateGameState({ isInputFocused: false })}
                  showUi={gameState.showUi}
                />
              </div>
            </div>
          )}
        </main>

        {/* Restart Button - Always positioned right after content */}
        <div className="flex justify-center">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="flex items-center justify-center text-muted-foreground hover:text-foreground"
                onClick={handleReset}
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>restart test</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>

      {/* Tab Instructions - Always at bottom */}
      <div className="flex justify-center py-6">
        <div className={`flex flex-row items-center justify-center gap-2 text-sm text-muted-foreground transition-opacity duration-300 ${gameState.showUi ? "opacity-100" : "opacity-0"}`}>
          <kbd className="bg-card text-foreground rounded-sm px-2 py-1 font-mono">
            tab
          </kbd>
          <p>+</p>
          <kbd className="bg-card text-foreground rounded-sm px-2 py-1 font-mono">
            enter
          </kbd>
          <p>- restart test</p>
        </div>
      </div>

      <Footer showUi={gameState.showUi} />
    </div>
  );
}
