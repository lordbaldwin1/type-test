import { memo, useCallback } from "react";
import { Clock, Hash } from "lucide-react";
import type { GameMode } from "~/app/(test)/_hooks/useGameState";

interface GameModeConfigProps {
    mode: GameMode;
    setGameMode: (mode: GameMode) => void;
    timeLimit: number;
    wordCount: number;
    setTimeLimit: (time: number) => void;
    setWordCount: (count: number) => void;
    resetGameState: () => void;
}

export const GameModeConfig = memo(function GameModeConfig({
    mode,
    setGameMode,
    timeLimit,
    wordCount,
    setTimeLimit,
    setWordCount,
    resetGameState,
}: GameModeConfigProps) {
    const wordOptions = [10, 25, 50, 100];
    const timeOptions = [15, 30, 60];

    const handleModeChange = useCallback((newMode: GameMode) => {
        setGameMode(newMode);
        if (newMode === "time") {
            setTimeLimit(15);
            setWordCount(50);
        } else {
            setWordCount(10);
        }
        resetGameState();
    }, [setGameMode, setTimeLimit, setWordCount, resetGameState]);

    const handleTimeLimitChange = useCallback((seconds: number) => {
        setTimeLimit(seconds);
        setWordCount(seconds * 2.5);
        resetGameState();
    }, [setTimeLimit, setWordCount, resetGameState]);

    const handleWordCountChange = useCallback((count: number) => {
        setWordCount(count);
        resetGameState();
    }, [setWordCount, resetGameState]);

    return (
        <div className="bg-card text-muted-foreground flex items-center justify-center rounded-md border p-2">
            {/* Mode toggles */}
            <div className="mr-4 flex space-x-4">
                <button
                    className={`hover:text-primary flex items-center transition-colors hover:cursor-pointer ${mode === "time" ? "text-primary" : ""
                        }`}
                    onClick={() => handleModeChange("time")}
                >
                    <div className="flex flex-row items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>time</span>
                    </div>
                </button>

                <button
                    className={`hover:text-primary flex items-center transition-colors hover:cursor-pointer ${mode === "words" ? "text-primary" : ""
                        }`}
                    onClick={() => handleModeChange("words")}
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
                                className={`rounded px-2 py-1 transition-colors ${timeLimit === seconds
                                    ? "bg-primary text-primary-foreground"
                                    : "hover:bg-muted hover:text-foreground"
                                    }`}
                                onClick={() => handleTimeLimitChange(seconds)}
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
                                className={`rounded px-2 py-1 transition-colors ${wordCount === count
                                    ? "bg-primary text-primary-foreground"
                                    : "hover:bg-muted hover:text-foreground"
                                    }`}
                                onClick={() => handleWordCountChange(count)}
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