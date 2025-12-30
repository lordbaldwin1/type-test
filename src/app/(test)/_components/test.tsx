"use client";

import { useRef, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { useGameStore } from "../_store/gameStore";
import { useTypingGame } from "../_hooks/useTypingGame";
import { useGameTimer } from "../_hooks/useGameTimer";
import { GameStats } from "./game-stats";
import { GameArea } from "./game-area";
import { GameModeConfig } from "./game-mode-config";
import { WordsetSelector } from "./wordset-selector";
import Navbar from "~/components/navbar";
import Footer from "~/components/footer";
import { Button } from "~/components/ui/button";
import { RotateCcw } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "~/components/ui/tooltip";

interface TypeTestProps {
  initialSampleText: string[];
}

export default function TypeTest({ initialSampleText }: TypeTestProps) {
  const { userId } = useAuth();
  const inputRef = useRef<HTMLInputElement>(null);

  const isInitialized = useGameStore((s) => s.isInitialized);
  const status = useGameStore((s) => s.status);
  const isTextChanging = useGameStore((s) => s.isTextChanging);
  const initialize = useGameStore((s) => s.initialize);
  const resetGame = useGameStore((s) => s.resetGame);

  const { input, currentWordIndex, handleInputChange, handleKeyDown } =
    useTypingGame();

  useGameTimer();

  useEffect(() => {
    initialize(userId ?? null, initialSampleText);
  }, [initialize, userId, initialSampleText]);

  const showUi = isInitialized && status !== "playing";

  const handleReset = () => {
    void resetGame();
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar showUi={showUi} />
      <div className="flex flex-1 flex-col">
        <main className="flex flex-1 flex-col">
          {status === "finished" ? (
            <div className="flex flex-1 items-center justify-center px-4">
              <div className="w-full animate-in fade-in duration-500">
                <GameStats onReset={handleReset} />
              </div>
            </div>
          ) : (
            <div className="flex min-h-0 flex-1 flex-col justify-center px-4">
              <div className="flex justify-center py-2 animate-in fade-in-0 duration-500 sm:py-4 md:py-6">
                <GameModeConfig userId={userId ?? null} onReset={handleReset} />
              </div>

              <div className="flex min-h-0 flex-1 flex-col items-center justify-center space-y-6 animate-in fade-in-0 duration-500">
                <WordsetSelector />

                <GameArea
                  input={input}
                  currentWordIndex={currentWordIndex}
                  onInputChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  inputRef={inputRef}
                />

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`text-muted-foreground hover:text-foreground transition-opacity duration-150 ${
                        !isInitialized || isTextChanging
                          ? "pointer-events-none opacity-0"
                          : "opacity-100"
                      }`}
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
          )}
        </main>
      </div>

      <div className="flex justify-center py-6 animate-in fade-in-0 duration-500">
        <div
          className={`text-muted-foreground flex flex-row items-center justify-center gap-2 text-sm transition-opacity duration-150 ${
            showUi && !isTextChanging ? "opacity-100" : "opacity-0"
          }`}
        >
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

      <Footer showUi={showUi} />
    </div>
  );
}
