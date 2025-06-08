import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "~/components/ui/chart";
import type { ChartConfig } from "~/components/ui/chart";

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

interface WpmChartProps {
  wpmPerSecond: Array<{ time: number; wpm: number; rawWpm: number }>;
}

export function WpmChart({ wpmPerSecond }: WpmChartProps) {
  const maxWpm = wpmPerSecond.length > 0 
    ? Math.max(...wpmPerSecond.map(d => Math.max(d.wpm, d.rawWpm)))
    : 0;
  
  const getYAxisMax = (max: number) => {
    if (max <= 50) return Math.ceil(max / 10) * 10 + 10;
    if (max <= 100) return Math.ceil(max / 20) * 20 + 20;
    return Math.ceil(max / 50) * 50 + 50;
  };

  const yAxisMax = getYAxisMax(maxWpm);

  if (wpmPerSecond.length === 0) {
    return null;
  }

  return (
    <div className="flex-1 min-w-0">
      <div className="bg-muted/30 rounded-lg p-3 h-full">
        <h3 className="text-base font-semibold mb-1 text-center">words per minute</h3>
        <ChartContainer config={chartConfig} className="w-full h-[200px]">
          <AreaChart
            accessibilityLayer
            data={wpmPerSecond}
            margin={{
              left: 8,
              right: 8,
              top: 8,
              bottom: 8,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="time"
              tickLine={false}
              axisLine={false}
              tickMargin={6}
              tickFormatter={(value) => `${value}s`}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={6}
              tickCount={5}
              domain={[0, yAxisMax]}
              tickFormatter={(value) => `${value}`}
            />
            <ChartTooltip 
              cursor={false} 
              content={<ChartTooltipContent 
                labelFormatter={(value) => `${value} seconds`}
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
  );
} 