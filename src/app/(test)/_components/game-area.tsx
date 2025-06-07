import { useRef, useState, useEffect } from "react";
import { Button } from "~/components/ui/button";
import { MousePointerClick, RotateCcw } from "lucide-react";
import { Word } from "./word";
import type { GameAreaProps } from "~/app/(test)/_utils/types";

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
    if (status === "during" || status === "before" || status === "restart") {
      inputRef.current?.focus();
    }
  }, [status, sampleText]);

  // Focus input on keypress
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (status !== "during" && status !== "before") return;

      if (document.activeElement === inputRef.current) return;

      const specialKeys = [
        "Tab",
        "Escape",
        "Enter",
        "ArrowUp",
        "ArrowDown",
        "ArrowLeft",
        "ArrowRight",
        "Control",
        "Alt",
        "Shift",
        "Meta",
        "F1",
        "F2",
        "F3",
        "F4",
        "F5",
        "F6",
        "F7",
        "F8",
        "F9",
        "F10",
        "F11",
        "F12",
      ];

      if (specialKeys.includes(e.key)) return;

      inputRef.current?.focus();
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [status]);

  const handleGameAreaClick = () => {
    if (status === "during" || status === "before") {
      inputRef.current?.focus();
    }
  };

  return (
    <div className="flex w-full max-w-3xl flex-col gap-2">
      <div className="mt-8 flex flex-col items-center">
        <input
          ref={inputRef}
          onFocus={() => setIsInputFocused(true)}
          onBlur={() => setIsInputFocused(false)}
          type="text"
          value={input}
          maxLength={15}
          onChange={onInputChange}
          onKeyDown={onInputSubmit}
          className="bg-background border-border text-foreground absolute mb-4 border-2 opacity-0"
        />

        {/* Wrapper for stats and text area with blur overlay */}
        <div className="relative" onClick={handleGameAreaClick}>
          {/* Blur overlay when input not focused */}
          {!isInputFocused && (status === "during" || status === "before") && (
            <div className="absolute inset-0 z-20 mt-32 flex items-center justify-center">
              <div className="absolute inset-0 backdrop-blur-[4px]" />
              <div className="bg-background/80 relative z-10 rounded-lg p-0 text-center backdrop-blur-[4px]">
                <p className="flex flex-row items-center gap-2">
                  <MousePointerClick className="h-4 w-4" /> Click or press any
                  key to start
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
            className="relative mx-auto ml-2 flex h-[7.9em] w-full max-w-full items-start justify-center overflow-hidden"
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
        
        <div className="mt-24">
          <div className="flex flex-row items-center justify-center gap-2 text-sm text-muted-foreground">
            <p className="bg-card text-foreground rounded-sm px-2 py-1 font-mono">
              tab
            </p>
            <p>+</p>
            <p className="bg-card text-foreground rounded-sm px-2 py-1 font-mono">
              enter
            </p>
            <p>- restart test</p>
          </div>
        </div>
      </div>
    </div>
  );
}
