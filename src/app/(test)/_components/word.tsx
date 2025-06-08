import { memo, forwardRef } from "react";

interface WordProps {
    word: string;
    input: string;
    isActive: boolean;
    isCompleted: boolean;
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
            props.isActive &&
            cursorPosition === word.length &&
            extraLetters.length === 0;

        return (
            <div
                ref={ref}
                className="relative flex flex-row font-mono text-4xl tracking-wide"
            >
                <div className="flex">
                    {props.isCompleted && !isCorrect ? (
                        <div className="decoration-destructive flex underline">
                            {word.map((letter, index) => {
                                if (letter === input[index]) {
                                    return (
                                        <Letter key={index} letter={letter} status={"correct"} />
                                    );
                                } else if (letter !== input[index] && input[index]) {
                                    return (
                                        <Letter key={index} letter={letter} status={"incorrect"} />
                                    );
                                } else {
                                    return <Letter key={index} letter={letter} status={"none"} />;
                                }
                            })}
                            {extraLetters.map((letter, index) => (
                                <Letter
                                    key={`extra-${index}`}
                                    letter={letter}
                                    status={"incorrect"}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="flex">
                            {word.map((letter, index) => {
                                const showCursor =
                                    props.isActive &&
                                    index === cursorPosition &&
                                    cursorPosition !== word.length + extraLetters.length;
                                if (letter === input[index]) {
                                    return (
                                        <Letter
                                            key={index}
                                            letter={letter}
                                            status={"correct"}
                                            showCursor={showCursor}
                                        />
                                    );
                                } else if (letter !== input[index] && input[index]) {
                                    return (
                                        <Letter
                                            key={index}
                                            letter={letter}
                                            status={"incorrect"}
                                            showCursor={showCursor}
                                        />
                                    );
                                } else {
                                    return (
                                        <Letter
                                            key={index}
                                            letter={letter}
                                            status={"none"}
                                            showCursor={showCursor}
                                        />
                                    );
                                }
                            })}
                            {extraLetters.map((letter, index) => (
                                <Letter
                                    key={`extra-${index}`}
                                    letter={letter}
                                    status={"incorrect"}
                                    showCursor={
                                        props.isActive &&
                                        word.length + index === cursorPosition &&
                                        cursorPosition === word.length + extraLetters.length
                                    }
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
    status: "correct" | "incorrect" | "none";
    showCursor?: boolean;
}

const Letter = memo(function Letter({ letter, status, showCursor }: LetterProps) {
    let textColorClass = "";
    if (status === "correct") {
        textColorClass = "text-foreground";
    } else if (status === "incorrect") {
        textColorClass = "text-destructive";
    } else if (status === "none") {
        textColorClass = "text-muted-foreground";
    }

    return (
        <div className="relative inline-block">
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