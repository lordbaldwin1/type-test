import { Button } from "~/components/ui/button";
import type { GameStatsProps } from "~/app/(test)/_utils/types";
import { Tooltip, TooltipContent, TooltipTrigger } from "~/components/ui/tooltip";
import { RotateCcw } from "lucide-react";
import { WpmChart } from "./wpm-chart";

export function GameStats({ stats, mode, timeLimit, time, onReset, wpmPerSecond }: GameStatsProps) {
    return (
        <div className="flex flex-col items-center gap-4 w-full">

            <div className="bg-card rounded-lg border p-4 w-full max-w-6xl flex flex-col">
                <div className="flex flex-col items-center order-3 mt-3 gap-2">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="link"
                                className="text-muted-foreground hover:text-foreground hover:scale-110 transition-all duration-200"
                                onClick={onReset}
                            >
                                <RotateCcw className="h-4 w-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>restart test</p>
                        </TooltipContent>
                    </Tooltip>
                    
                    <div className="flex flex-row items-center justify-center gap-2 text-xs text-muted-foreground">
                        <p className="bg-muted text-foreground rounded-sm px-2 py-1 font-mono">
                            tab
                        </p>
                        <p>+</p>
                        <p className="bg-muted text-foreground rounded-sm px-2 py-1 font-mono">
                            enter
                        </p>
                        <p>- restart test</p>
                    </div>
                </div>

                <div className="flex flex-col xl:flex-row gap-4 order-2">
                    <div className="flex flex-col gap-3 xl:w-72 xl:flex-shrink-0">
                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-muted flex flex-col items-center rounded p-3">
                                <span className="text-muted-foreground text-xs">WPM</span>
                                <span className="text-primary text-2xl font-bold">
                                    {stats.wpm}
                                </span>
                            </div>
                            <div className="bg-muted flex flex-col items-center rounded p-3">
                                <span className="text-muted-foreground text-xs">Accuracy</span>
                                <span className="text-primary text-2xl font-bold">
                                    {stats.accuracy}%
                                </span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-muted flex flex-col items-center rounded p-2">
                                <span className="text-muted-foreground text-xs">Raw WPM</span>
                                <span className="text-foreground text-lg font-bold">
                                    {stats.rawWpm}
                                </span>
                            </div>
                            <div className="bg-muted flex flex-col items-center rounded p-2">
                                <span className="text-muted-foreground text-xs">Time</span>
                                <span className="text-foreground text-lg font-bold">
                                    {mode === "time" ? timeLimit : time}s
                                </span>
                            </div>
                        </div>

                        <div className="bg-muted rounded p-2">
                            <div className="grid grid-cols-2 gap-2 text-center text-xs">
                                <div>
                                    <span className="text-primary">Correct</span>
                                    <p className="text-foreground font-bold text-sm">{stats.correct}</p>
                                </div>
                                <div>
                                    <span className="text-destructive">Incorrect</span>
                                    <p className="text-foreground font-bold text-sm">{stats.incorrect}</p>
                                </div>
                                <div>
                                    <span className="text-primary">Extra</span>
                                    <p className="text-foreground font-bold text-sm">{stats.extra}</p>
                                </div>
                                <div>
                                    <span className="text-primary">Missed</span>
                                    <p className="text-foreground font-bold text-sm">{stats.missed}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <WpmChart wpmPerSecond={wpmPerSecond} />
                </div>
            </div>
        </div>
    );
} 