import { Download, Calendar } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { ChartContainer } from "@/components/ui/chart";
import type { SensorResponse } from "@/lib/api/model";

interface SensorChartSectionProps {
  sensor: SensorResponse & { unit?: string };
  sensorData: Array<{ time: string; value: number; hour?: number }>;
  timeframe: string;
  onTimeframeChange: (timeframe: string) => void;
  onExport: () => void;
}

export function SensorChartSection({
  sensor,
  sensorData,
  timeframe,
  onTimeframeChange,
  onExport,
}: SensorChartSectionProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Sensor Data</CardTitle>
            <CardDescription>
              Historical readings for {sensor.label}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Select value={timeframe} onValueChange={onTimeframeChange}>
              <SelectTrigger className="w-[140px]">
                <Calendar className="mr-2 size-4" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon" onClick={onExport}>
              <Download className="size-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            value: {
              label: sensor.label || "Sensor",
              color: "hsl(var(--chart-1))",
            },
          }}
          className="h-[700px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={sensorData}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="hsl(var(--chart-1))"
                    stopOpacity={0.3}
                  />
                  <stop
                    offset="95%"
                    stopColor="hsl(var(--chart-1))"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="time"
                className="text-xs"
                tick={{ fill: "hsl(var(--muted-foreground))" }}
                tickLine={{ stroke: "hsl(var(--border))" }}
                interval={timeframe === "today" ? 2 : "preserveStartEnd"}
              />
              <YAxis
                className="text-xs"
                tick={{ fill: "hsl(var(--muted-foreground))" }}
                tickLine={{ stroke: "hsl(var(--border))" }}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="rounded-lg border bg-background p-3 shadow-lg">
                        <p className="text-sm font-semibold">{data.time}</p>
                        {data.hour !== undefined && (
                          <p className="text-muted-foreground text-xs">
                            Hour: {data.hour}:00
                          </p>
                        )}
                        <p className="text-sm">
                          Value:{" "}
                          <span className="font-bold text-primary">
                            {payload[0].value?.toFixed(2)}
                          </span>{" "}
                          {sensor.unit}
                        </p>
                        <p className="text-muted-foreground mt-1 text-xs italic">
                          Averaged value
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="hsl(var(--chart-1))"
                fill="url(#colorValue)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
