import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { SensorResponse } from "@/lib/api/model";

interface SensorStatsProps {
  sensor: SensorResponse & { unit?: string };
  stats: {
    current: string;
    min: string;
    max: string;
    avg: string;
  };
}

export function SensorStatsSection({ sensor, stats }: SensorStatsProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="grid grid-cols-4 gap-4">
          <div className="space-y-1 text-center">
            <p className="text-muted-foreground text-xs">Current</p>
            <p className="text-2xl font-bold">
              {stats.current}
              <span className="text-muted-foreground ml-1 text-sm">
                {sensor.unit}
              </span>
            </p>
          </div>
          <div className="space-y-1 text-center">
            <p className="text-muted-foreground text-xs">Min</p>
            <p className="text-2xl font-bold">
              {stats.min}
              <span className="text-muted-foreground ml-1 text-sm">
                {sensor.unit}
              </span>
            </p>
          </div>
          <div className="space-y-1 text-center">
            <p className="text-muted-foreground text-xs">Max</p>
            <p className="text-2xl font-bold">
              {stats.max}
              <span className="text-muted-foreground ml-1 text-sm">
                {sensor.unit}
              </span>
            </p>
          </div>
          <div className="space-y-1 text-center">
            <p className="text-muted-foreground text-xs">Avg</p>
            <p className="text-2xl font-bold">
              {stats.avg}
              <span className="text-muted-foreground ml-1 text-sm">
                {sensor.unit}
              </span>
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
