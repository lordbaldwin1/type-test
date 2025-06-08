import { Button } from "~/components/ui/button";
import type { GameStatsProps } from "~/app/(test)/_utils/types";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "~/components/ui/chart";
import type { ChartConfig } from "~/components/ui/chart";
import { Tooltip, TooltipContent, TooltipTrigger } from "~/components/ui/tooltip";
import { RotateCcw } from "lucide-react";

const chartConfig = {
  wpm: {
    label: "",
    color: "var(--chart-1)",
  },
  rawWpm: {
    label: "", 
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

export function GameStats({ stats, mode, timeLimit, time, onReset, wpmPerSecond }: GameStatsProps) {
    const maxWpm = wpmPerSecond.length > 0 
        ? Math.max(...wpmPerSecond.map(d => Math.max(d.wpm, d.rawWpm)))
        : 0;
    
    const getYAxisMax = (max: number) => {
        if (max <= 50) return Math.ceil(max / 10) * 10 + 10;
        if (max <= 100) return Math.ceil(max / 20) * 20 + 20;
        return Math.ceil(max / 50) * 50 + 50;
    };

    const yAxisMax = getYAxisMax(maxWpm);

    return (
        <div className="flex flex-col items-center gap-6 w-full">

            <div className="bg-card rounded-lg border p-6 w-full max-w-6xl flex flex-col">
                <div className="flex flex-col items-center order-3 mt-6 gap-4">
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
                    
                    <div className="flex flex-row items-center justify-center gap-2 text-sm text-muted-foreground">
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

                <div className="flex flex-col xl:flex-row gap-6 order-2">
                    <div className="flex flex-col gap-4 xl:w-80 xl:flex-shrink-0">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-muted flex flex-col items-center rounded p-4">
                                <span className="text-muted-foreground text-sm">WPM</span>
                                <span className="text-primary text-3xl font-bold">
                                    {stats.wpm}
                                </span>
                            </div>
                            <div className="bg-muted flex flex-col items-center rounded p-4">
                                <span className="text-muted-foreground text-sm">Accuracy</span>
                                <span className="text-primary text-3xl font-bold">
                                    {stats.accuracy}%
                                </span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-muted flex flex-col items-center rounded p-3">
                                <span className="text-muted-foreground text-sm">Raw WPM</span>
                                <span className="text-foreground text-xl font-bold">
                                    {stats.rawWpm}
                                </span>
                            </div>
                            <div className="bg-muted flex flex-col items-center rounded p-3">
                                <span className="text-muted-foreground text-sm">Time</span>
                                <span className="text-foreground text-xl font-bold">
                                    {mode === "time" ? timeLimit : time}s
                                </span>
                            </div>
                        </div>

                        <div className="bg-muted rounded p-3">
                            <div className="grid grid-cols-2 gap-2 text-center text-sm">
                                <div>
                                    <span className="text-primary">Correct</span>
                                    <p className="text-foreground font-bold">{stats.correct}</p>
                                </div>
                                <div>
                                    <span className="text-destructive">Incorrect</span>
                                    <p className="text-foreground font-bold">{stats.incorrect}</p>
                                </div>
                                <div>
                                    <span className="text-primary">Extra</span>
                                    <p className="text-foreground font-bold">{stats.extra}</p>
                                </div>
                                <div>
                                    <span className="text-primary">Missed</span>
                                    <p className="text-foreground font-bold">{stats.missed}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {wpmPerSecond.length > 0 && (
                        <div className="flex-1 min-w-0">
                            <div className="bg-muted/30 rounded-lg p-4 h-full">
                                <h3 className="text-lg font-semibold mb-2 text-center">WPM Progress</h3>
                                <ChartContainer config={chartConfig} className="w-full h-[280px]">
                                    <AreaChart
                                        accessibilityLayer
                                        data={wpmPerSecond}
                                        margin={{
                                            left: 12,
                                            right: 12,
                                            top: 12,
                                            bottom: 12,
                                        }}
                                    >
                                        <CartesianGrid vertical={false} />
                                        <XAxis
                                            dataKey="time"
                                            tickLine={false}
                                            axisLine={false}
                                            tickMargin={8}
                                            tickFormatter={(value) => `${value}s`}
                                        />
                                        <YAxis
                                            tickLine={false}
                                            axisLine={false}
                                            tickMargin={8}
                                            tickCount={6}
                                            domain={[0, yAxisMax]}
                                            tickFormatter={(value) => `${value}`}
                                        />
                                        <ChartTooltip 
                                            cursor={false} 
                                            content={<ChartTooltipContent 
                                                labelFormatter={(value) => `${value} seconds`}
                                                formatter={(value, name) => [
                                                    `${Math.round(Number(value))} WPM`,
                                                    name === 'wpm' ? 'WPM' : 'Raw WPM'
                                                ]}
                                            />} 
                                        />
                                        <Area
                                            dataKey="rawWpm"
                                            type="natural"
                                            fill="var(--color-rawWpm)"
                                            fillOpacity={0.2}
                                            stroke="var(--color-rawWpm)"
                                            strokeWidth={2}
                                        />
                                        <Area
                                            dataKey="wpm"
                                            type="natural"
                                            fill="var(--color-wpm)"
                                            fillOpacity={0.4}
                                            stroke="var(--color-wpm)"
                                            strokeWidth={2}
                                        />
                                    </AreaChart>
                                </ChartContainer>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
} 