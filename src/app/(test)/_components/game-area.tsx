import { useRef, useState, useEffect } from "react";
import { MousePointerClick } from "lucide-react";
import { Word } from "./word";
import { useGameStore } from "../_store/gameStore";

interface GameAreaProps {
  input: string;
  currentWordIndex: number;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
}

export function GameArea({
  input,
  currentWordIndex,
  onInputChange,
  onKeyDown,
  inputRef,
}: GameAreaProps) {
  const isInitialized = useGameStore((s) => s.isInitialized);
  const status = useGameStore((s) => s.status);
  const mode = useGameStore((s) => s.mode);
  const sampleText = useGameStore((s) => s.sampleText);
  const completedWords = useGameStore((s) => s.completedWords);
  const time = useGameStore((s) => s.time);
  const isTextChanging = useGameStore((s) => s.isTextChanging);

  const containerRef = useRef<HTMLDivElement>(null);
  const activeWordRef = useRef<HTMLDivElement>(null);
  const wordsContainerRef = useRef<HTMLDivElement>(null);
  const blurTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [isInputFocused, setIsInputFocused] = useState(false);
  const [showBlur, setShowBlur] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });

  const handleFocus = () => setIsInputFocused(true);
  const handleBlur = () => setIsInputFocused(false);

  useEffect(() => {
    if (!wordsContainerRef.current) return;

    const updateCursorPosition = () => {
      const wordsContainer = wordsContainerRef.current;
      if (!wordsContainer) return;

      const wordElements = wordsContainer.querySelectorAll("[data-word-index]");
      const currentWordElement = wordElements[currentWordIndex] as HTMLElement;

      if (!currentWordElement) return;

      const containerRect = wordsContainer.getBoundingClientRect();
      const wordRect = currentWordElement.getBoundingClientRect();

      const letterElements =
        currentWordElement.querySelectorAll("[data-letter-index]");
      const currentLetterIndex = input.length;

      let letterX = 0;
      if (currentLetterIndex < letterElements.length) {
        const letterElement = letterElements[currentLetterIndex] as HTMLElement;
        const letterRect = letterElement.getBoundingClientRect();
        letterX = letterRect.left - wordRect.left;
      } else {
        letterX = currentWordElement.offsetWidth;
      }

      const x = wordRect.left - containerRect.left + letterX;
      const y = wordRect.top - containerRect.top;

      setCursorPosition({ x, y });
    };

    const timeoutId = setTimeout(updateCursorPosition, 10);
    return () => clearTimeout(timeoutId);
  }, [currentWordIndex, input, sampleText]);

  useEffect(() => {
    if (activeWordRef.current && containerRef.current) {
      activeWordRef.current.scrollIntoView({
        behavior: "instant",
        block: "center",
        inline: "nearest",
      });
    }
  }, [currentWordIndex]);

  useEffect(() => {
    if (status === "playing" || status === "idle") {
      inputRef.current?.focus();
    }
  }, [status, sampleText, inputRef]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (status !== "playing" && status !== "idle") return;
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
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [status, inputRef]);

  // Delay showing blur overlay to avoid flash on quick focus changes
  useEffect(() => {
    if (blurTimeoutRef.current) {
      clearTimeout(blurTimeoutRef.current);
    }

    if (isInputFocused) {
      setShowBlur(false);
    } else if (status === "playing" || status === "idle") {
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
    if (status === "playing" || status === "idle") {
      inputRef.current?.focus();
    }
  };

  return (
    <div className="flex w-full max-w-5xl flex-col gap-4">
      <div className="flex flex-col items-center">
        <input
          ref={inputRef}
          onFocus={handleFocus}
          onBlur={handleBlur}
          type="text"
          value={input}
          maxLength={15}
          onChange={onInputChange}
          onKeyDown={onKeyDown}
          className="bg-background border-border text-foreground absolute mb-4 border-2 opacity-0"
        />
        <div className="relative">
          {showBlur && (
            <div className="pointer-events-none absolute inset-0 z-20 mt-8 flex items-center justify-center">
              <div className="bg-background/90 absolute inset-0 -mx-4 backdrop-blur-[4px]" />
              <div className="bg-background/80 relative z-10 rounded-lg p-0 text-center backdrop-blur-[4px]">
                <p className="mt-2 flex flex-row items-center gap-2">
                  <MousePointerClick className="h-4 w-4" /> Click or press any
                  key to start
                </p>
              </div>
            </div>
          )}

          <div
            className={`ml-4 w-full transition-opacity duration-150 ${
              !isInitialized || isTextChanging ? "opacity-0" : "opacity-100"
            }`}
          >
            {mode === "words" && (
              <p className="text-primary text-2xl font-bold">{`${completedWords.length}/${sampleText.length}`}</p>
            )}
            {mode === "time" && (
              <p className="text-primary text-2xl font-bold">{`${time.toFixed(0)}s`}</p>
            )}
          </div>

          <div
            ref={containerRef}
            className={`relative mx-auto ml-2 flex h-[7.5em] w-full max-w-full items-start justify-center overflow-hidden transition-opacity duration-150 ${
              !isInitialized || isTextChanging ? "opacity-0" : "opacity-100"
            }`}
          >
            <div
              ref={wordsContainerRef}
              className="flex flex-wrap gap-x-5 gap-y-0 text-center font-mono text-4xl tracking-wide"
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
                  showCursor={false}
                />
              ))}
            </div>

            {isInitialized && (status === "playing" || status === "idle") && (
              <div
                className={`pointer-events-none absolute transition-all duration-75 ease-out ${
                  status === "idle"
                    ? "animate-[blink_1s_ease-in-out_infinite]"
                    : ""
                }`}
                style={{
                  left: `${cursorPosition.x + 1.5}px`,
                  top: `${cursorPosition.y + 2}px`,
                  height: "2.25em",
                  width: "3px",
                  backgroundColor: "var(--primary)",
                  borderRadius: "2px",
                  transform: "translateX(-1px)",
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
