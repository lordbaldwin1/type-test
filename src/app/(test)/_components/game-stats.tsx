import { Button } from "~/components/ui/button";
import type { GameStats as GameStatsType } from "~/app/(test)/_hooks/useGameState";

interface GameStatsProps {
    stats: GameStatsType;
    mode: "words" | "time";
    timeLimit: number;
    time: number;
    onReset: () => void;
}

export function GameStats({ stats, mode, timeLimit, time, onReset }: GameStatsProps) {
    return (
        <div className="bg-card flex flex-col items-center gap-4 rounded-lg border p-6">
            <div className="grid w-full grid-cols-2 gap-4">
                <div className="bg-muted flex flex-col items-center rounded p-3">
                    <span className="text-muted-foreground text-sm">WPM</span>
                    <span className="text-primary text-2xl font-bold">
                        {stats.wpm}
                    </span>
                </div>
                <div className="bg-muted flex flex-col items-center rounded p-3">
                    <span className="text-muted-foreground text-sm">Raw WPM</span>
                    <span className="text-primary text-2xl font-bold">
                        {stats.rawWpm}
                    </span>
                </div>
                <div className="bg-muted flex flex-col items-center rounded p-3">
                    <span className="text-muted-foreground text-sm">Accuracy</span>
                    <span className="text-primary text-2xl font-bold">
                        {stats.accuracy}%
                    </span>
                </div>
                <div className="bg-muted flex flex-col items-center rounded p-3">
                    <span className="text-muted-foreground text-sm">Time</span>
                    <span className="text-primary text-2xl font-bold">
                        {mode === "time" ? timeLimit : time}s
                    </span>
                </div>
            </div>

            <div className="bg-muted w-full rounded p-3">
                <div className="grid grid-cols-4 gap-2 text-center">
                    <div>
                        <span className="text-primary text-sm">Correct</span>
                        <p className="text-foreground text-lg font-bold">
                            {stats.correct}
                        </p>
                    </div>
                    <div>
                        <span className="text-destructive text-sm">Incorrect</span>
                        <p className="text-foreground text-lg font-bold">
                            {stats.incorrect}
                        </p>
                    </div>
                    <div>
                        <span className="text-primary text-sm">Extra</span>
                        <p className="text-foreground text-lg font-bold">
                            {stats.extra}
                        </p>
                    </div>
                    <div>
                        <span className="text-primary text-sm">Missed</span>
                        <p className="text-foreground text-lg font-bold">
                            {stats.missed}
                        </p>
                    </div>
                </div>
            </div>

            <Button
                className="bg-primary text-primary-foreground hover:bg-primary/90 rounded px-6 py-2 font-bold transition-colors"
                onClick={onReset}
            >
                Try Again
            </Button>
        </div>
    );
} 