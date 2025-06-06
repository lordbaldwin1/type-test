import { useRef, useState, useEffect } from "react";
import { Button } from "~/components/ui/button";
import { RotateCcw } from "lucide-react";
import { Word } from "./word";
import type { GameMode } from "~/app/(test)/_hooks/useGameState";

interface GameAreaProps {
    mode: GameMode;
    status: "before" | "during" | "after";
    sampleText: string[];
    completedWords: string[];
    currentWordIndex: number;
    input: string;
    time: number;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onInputSubmit: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    onReset: () => void;
}

export function GameArea({
    mode,
    status,
    sampleText,
    completedWords,
    currentWordIndex,
    input,
    time,
    onInputChange,
    onInputSubmit,
    onReset,
}: GameAreaProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const activeWordRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const [isInputFocused, setIsInputFocused] = useState(false);

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

    // Focus input when game starts or resets
    useEffect(() => {
        if (status === "during" || status === "before") {
            inputRef.current?.focus();
        }
    }, [status, sampleText]);

    const handleGameAreaClick = () => {
        if (status === "during" || status === "before") {
            inputRef.current?.focus();
        }
    };

    return (
        <div className="flex w-full max-w-3xl flex-col gap-2">
            <div className="mt-8 flex flex-col items-center" onClick={handleGameAreaClick}>
                <input
                    ref={inputRef}
                    onFocus={() => setIsInputFocused(true)}
                    onBlur={() => inputRef.current?.blur()}
                    type="text"
                    value={input}
                    maxLength={15}
                    onChange={onInputChange}
                    onKeyDown={onInputSubmit}
                    className="bg-background border-border text-foreground absolute mb-4 border-2 opacity-0"
                />

                {/* Wrapper for stats and text area with blur overlay */}
                <div className="relative">
                    {/* Blur overlay when input not focused */}
                    {!isInputFocused && (status === "during" || status === "before") && (
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

                    <div className="mt-24 ml-4 w-full">
                        {mode === "words" && (
                            <p className="text-primary text-2xl font-bold">{`${completedWords.length}/${sampleText.length}`}</p>
                        )}
                        {mode === "time" && (
                            <p className="text-primary text-2xl font-bold">{`${time}s`}</p>
                        )}
                    </div>

                    <div
                        ref={containerRef}
                        className="relative mx-auto ml-2 flex h-[7.5em] w-full max-w-full items-start justify-center overflow-hidden"
                        onClick={handleGameAreaClick}
                    >
                        <div className="flex flex-wrap gap-x-4 gap-y-0 text-center font-mono text-4xl tracking-wide">
                            {sampleText.map((word, index) => (
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
                    className="text-muted-foreground hover:text-foreground mt-24 hover:scale-110"
                    onClick={onReset}
                >
                    <RotateCcw />
                </Button>
            </div>
        </div>
    );
} 