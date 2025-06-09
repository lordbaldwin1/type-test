import { Button } from "~/components/ui/button";
import type { GameStatsProps } from "~/app/(test)/_utils/types";
import { Tooltip, TooltipContent, TooltipTrigger } from "~/components/ui/tooltip";
import { RotateCcw } from "lucide-react";
import { WpmChart } from "./wpm-chart";

export function GameStats({ stats, mode, timeLimit, time, onReset, wpmPerSecond }: GameStatsProps) {
    return (
        <div className="flex flex-col items-center gap-6 w-full px-4 py-4">
            {/* Top Stats Row */}
            <div className="w-full max-w-6xl">
                <div className="grid grid-cols-5 gap-6 text-center">
                    {/* Raw WPM */}
                    <div>
                        <div className="text-sm text-muted-foreground font-medium mb-2">raw</div>
                        <div className="text-3xl font-bold text-foreground leading-none">{stats.rawWpm}</div>
                    </div>
                    
                    {/* Accuracy */}
                    <div>
                        <div className="text-sm text-muted-foreground font-medium mb-2">acc</div>
                        <div className="text-3xl font-bold text-primary leading-none">{stats.accuracy}%</div>
                    </div>
                    
                    {/* WPM - Center and Largest */}
                    <div>
                        <div className="text-sm text-muted-foreground font-medium mb-2">wmp</div>
                        <div className="text-6xl font-bold text-primary leading-none">{stats.wpm}</div>
                    </div>
                    
                    {/* Time */}
                    <div>
                        <div className="text-sm text-muted-foreground font-medium mb-2">time</div>
                        <div className="text-3xl font-bold text-foreground leading-none">
                            {mode === "time" ? timeLimit : time}s
                        </div>
                    </div>
                    
                    {/* Characters */}
                    <div>
                        <div className="text-sm text-muted-foreground font-medium mb-2">characters</div>
                        <div className="text-3xl font-bold leading-none">
                            <span className="text-primary">{stats.correct}</span>
                            <span className="text-muted-foreground">/</span>
                            <span className="text-destructive">{stats.incorrect}</span>
                            <span className="text-muted-foreground">/</span>
                            <span className="text-muted-foreground">{stats.extra}</span>
                            <span className="text-muted-foreground">/</span>
                            <span className="text-muted-foreground">{stats.missed}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Chart and Button Container - using flex order for visual positioning */}
            <div className="flex flex-col items-center gap-6 w-full">
                {/* Restart Button - First in DOM for focus, but visually second with order-2 */}
                <div className="order-2">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-muted-foreground hover:text-foreground"
                                onClick={onReset}
                            >
                                <RotateCcw className="h-4 w-4 mr-2" />
                                restart test
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Start a new test</p>
                        </TooltipContent>
                    </Tooltip>
                </div>

                {/* Chart - Second in DOM but visually first with order-1 */}
                <div className="w-full max-w-6xl order-1">
                    <WpmChart wpmPerSecond={wpmPerSecond} />
                </div>
            </div>

            {/* Footer Instructions */}
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <kbd className="bg-muted text-foreground rounded px-1 py-0.5 font-mono">tab</kbd>
                <span>+</span>
                <kbd className="bg-muted text-foreground rounded px-1 py-0.5 font-mono">enter</kbd>
                <span>- restart test</span>
            </div>
        </div>
    );
} 