import { useRef, useState, useEffect } from "react";
import { Button } from "~/components/ui/button";
import { MousePointerClick, RotateCcw } from "lucide-react";
import { Word } from "./word";
import type { GameAreaProps } from "~/app/(test)/_utils/types";
import { TooltipContent, TooltipTrigger } from "~/components/ui/tooltip";
import { Tooltip } from "~/components/ui/tooltip";

export function GameArea({
  mode,
  status,
  sampleText,
  completedWords,
  currentWordIndex,
  input,
  time,
  saveStats,
  onInputChange,
  onInputSubmit,
  onReset,
  isTextChanging,
  inputRef,
  onInputFocus,
  onInputBlur,
  showUi,
}: GameAreaProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const activeWordRef = useRef<HTMLDivElement>(null);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [showBlur, setShowBlur] = useState(false);
  const blurTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const wordsContainerRef = useRef<HTMLDivElement>(null);

  // Handle internal focus state and call parent callbacks
  const handleFocus = () => {
    setIsInputFocused(true);
    onInputFocus();
  };

  const handleBlur = () => {
    setIsInputFocused(false);
    onInputBlur();
  };

  // Calculate cursor position for smooth animation
  useEffect(() => {
    if (!wordsContainerRef.current) return;

    const updateCursorPosition = () => {
      const wordsContainer = wordsContainerRef.current;
      if (!wordsContainer) return;

      // Find the current word element
      const wordElements = wordsContainer.querySelectorAll('[data-word-index]');
      const currentWordElement = wordElements[currentWordIndex] as HTMLElement;
      
      if (!currentWordElement) return;

      const containerRect = wordsContainer.getBoundingClientRect();
      const wordRect = currentWordElement.getBoundingClientRect();
      
      // Find the current letter position within the word
      const letterElements = currentWordElement.querySelectorAll('[data-letter-index]');
      const currentLetterIndex = input.length;
      
      let letterX = 0;
      if (currentLetterIndex < letterElements.length) {
        const letterElement = letterElements[currentLetterIndex] as HTMLElement;
        const letterRect = letterElement.getBoundingClientRect();
        letterX = letterRect.left - wordRect.left;
      } else {
        // Cursor is at the end of the word
        letterX = currentWordElement.offsetWidth;
      }

      const x = (wordRect.left - containerRect.left) + letterX;
      const y = wordRect.top - containerRect.top;

      setCursorPosition({ x, y });
    };

    // Small delay to ensure DOM has updated
    const timeoutId = setTimeout(updateCursorPosition, 10);
    
    return () => clearTimeout(timeoutId);
  }, [currentWordIndex, input, sampleText]);

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
  }, [status, sampleText, saveStats, inputRef]);

  // Focus input on keypress
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (status !== "during" && status !== "before" && status !== "restart") return;

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
  }, [status, inputRef]);

  // Handle blur visibility with delay to prevent flashing during mode changes
  useEffect(() => {
    if (blurTimeoutRef.current) {
      clearTimeout(blurTimeoutRef.current);
    }

    if (isInputFocused) {
      setShowBlur(false);
    } else if (status === "during" || status === "before" || status === "restart") {
      blurTimeoutRef.current = setTimeout(() => {
        setShowBlur(true);
      }, 300);
    } else {
      setShowBlur(false);
    }

    return () => {
      if (blurTimeoutRef.current) {
        clearTimeout(blurTimeoutRef.current);
      }
    };
  }, [isInputFocused, status]);

  const handleGameAreaClick = () => {
    if (status === "during" || status === "before" || status === "restart") {
      inputRef.current?.focus();
    }
  };

  return (
    <div className="flex w-full max-w-3xl flex-col gap-2">
      <div className="flex flex-col items-center">
        <input
          ref={inputRef}
          onFocus={handleFocus}
          onBlur={handleBlur}
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
          {showBlur && (
            <div className="absolute inset-0 z-20 mt-8 flex items-center justify-center pointer-events-none">
              <div className="absolute inset-0 bg-background/90 backdrop-blur-[4px]" />
              <div className="bg-background/80 relative z-10 rounded-lg p-0 text-center backdrop-blur-[4px]">
                <p className="flex flex-row items-center mt-2 gap-2">
                  <MousePointerClick className="h-4 w-4" /> Click or press any
                  key to start
                </p>
              </div>
            </div>
          )}

          <div className={`ml-4 w-full transition-opacity duration-150 ${
            isTextChanging ? "opacity-0" : "opacity-100"
          }`}>
            {mode === "words" && (
              <p className="text-primary text-2xl font-bold">{`${completedWords.length}/${sampleText.length}`}</p>
            )}
            {mode === "time" && (
              <p className="text-primary text-2xl font-bold">{`${time}s`}</p>
            )}
          </div>

          <div
            ref={containerRef}
            className={`relative mx-auto ml-2 flex h-[7.5em] w-full max-w-full items-start justify-center overflow-hidden transition-opacity duration-150 ${
              isTextChanging ? "opacity-0" : "opacity-100"
            }`}
          >
            <div 
              ref={wordsContainerRef}
              className="flex flex-wrap gap-x-4 gap-y-0 text-center font-mono text-4xl tracking-wide" 
              onClick={handleGameAreaClick}
            >
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
                  wordIndex={index}
                  showCursor={false} // Disable individual word cursors
                />
              ))}
            </div>
            
            {/* Animated cursor overlay */}
            {(status === "during" || status === "before" || status === "restart") && (
              <div
                className="absolute border-l-2 border-foreground pointer-events-none transition-all duration-150 ease-out"
                style={{
                  left: `${cursorPosition.x}px`,
                  top: `${cursorPosition.y + 4}px`, // Slight offset for better positioning
                  height: '2em',
                  transform: 'translateX(-1px)',
                }}
              />
            )}
          </div>
        </div>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              className="text-muted-foreground hover:text-foreground mt-24 hover:scale-110"
          onClick={onReset}
        >
          <RotateCcw />
        </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>restart test</p>
        </TooltipContent>
        </Tooltip>

        <div className="mt-24">
          <div className={`flex flex-row items-center justify-center gap-2 text-sm text-muted-foreground animate-fade-in transition-opacity duration-300 ${showUi ? "opacity-100" : "opacity-0"}`}>
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

      </div>
    </div>
  );
}
