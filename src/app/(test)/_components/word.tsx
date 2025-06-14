import { memo, forwardRef } from "react";

interface WordProps {
    word: string;
    input: string;
    isActive: boolean;
    isCompleted: boolean;
    wordIndex?: number;
    showCursor?: boolean;
}

export const Word = memo(
    forwardRef<HTMLDivElement, WordProps>(function Word(props, ref) {
        const word = props.word.split("");
        const input = props.input.split("");
        const cursorPosition = input.length;
        const isCorrect = props.word === props.input;
        const extraLetters =
            input.length > word.length ? input.slice(word.length) : [];
        const showEndCursor =
            props.showCursor !== false &&
            props.isActive &&
            cursorPosition === word.length &&
            extraLetters.length === 0;

        return (
            <div
                ref={ref}
                className="relative flex flex-row font-mono text-4xl tracking-wider"
                data-word-index={props.wordIndex}
            >
                <div className="flex">
                    {props.isCompleted && !isCorrect ? (
                        <div className="decoration-destructive flex underline">
                            {word.map((letter, index) => (
                                <Letter 
                                    key={index} 
                                    letter={letter} 
                                    status={letter === input[index] ? "correct" : input[index] ? "incorrect" : "none"}
                                    letterIndex={index}
                                />
                            ))}
                            {extraLetters.map((letter, index) => (
                                <Letter
                                    key={`extra-${index}`}
                                    letter={letter}
                                    status={"extra"}
                                    letterIndex={word.length + index}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="flex">
                            {word.map((letter, index) => {
                                const showCursor =
                                    props.showCursor !== false &&
                                    props.isActive &&
                                    index === cursorPosition &&
                                    cursorPosition !== word.length + extraLetters.length;
                                return (
                                    <Letter
                                        key={index}
                                        letter={letter}
                                        status={
                                            letter === input[index] 
                                                ? "correct" 
                                                : input[index] 
                                                    ? "incorrect" 
                                                    : "none"
                                        }
                                        showCursor={showCursor}
                                        letterIndex={index}
                                    />
                                );
                            })}
                            {extraLetters.map((letter, index) => (
                                <Letter
                                    key={`extra-${index}`}
                                    letter={letter}
                                    status={"extra"}
                                    showCursor={
                                        props.showCursor !== false &&
                                        props.isActive &&
                                        word.length + index === cursorPosition &&
                                        cursorPosition === word.length + extraLetters.length
                                    }
                                    letterIndex={word.length + index}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {showEndCursor && (
                    <span
                        className="border-foreground absolute border-l-2"
                        style={{
                            left: "100%",
                            height: "0.8em",
                            top: "0.15em",
                        }}
                    ></span>
                )}
            </div>
        );
    }),
);

interface LetterProps {
    letter: string;
    status: "correct" | "incorrect" | "none" | "extra";
    showCursor?: boolean;
    letterIndex?: number;
}

const Letter = memo(function Letter({ letter, status, showCursor, letterIndex }: LetterProps) {
    let textColorClass = "";
    if (status === "correct") {
        textColorClass = "text-foreground";
    } else if (status === "incorrect") {
        textColorClass = "text-destructive";
    } else if (status === "none") {
        textColorClass = "text-muted-foreground/30";
    } else if (status === "extra") {
        textColorClass = "text-red-400/40";
    }

    return (
        <div className="relative inline-block" data-letter-index={letterIndex}>
            <span className={textColorClass}>{letter}</span>
            {showCursor && (
                <span
                    className="border-foreground absolute border-l-2"
                    style={{
                        left: "0",
                        height: "0.8em",
                        top: "0.15em",
                        transform: "translateX(-1px)",
                    }}
                ></span>
            )}
        </div>
    );
}); 