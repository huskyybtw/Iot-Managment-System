import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { DeviceResponse, SensorResponse } from "@/lib/model";

interface DeviceWithStats extends DeviceResponse {
  location?: string;
  status?: string;
  sensors?: Array<SensorResponse & { icon?: any; unit?: string }>;
  totalSensors?: number;
  activeAlerts?: number;
  dataPoints?: number;
  uptime?: string;
}

interface DeviceStatsCardsProps {
  device: DeviceWithStats;
}

export function DeviceStatsCards({ device }: DeviceStatsCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card>
        <CardHeader className="pb-3">
          <CardDescription>Total Sensors</CardDescription>
          <CardTitle className="text-3xl">{device.totalSensors}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-xs">Configured sensors</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardDescription>Active Alerts</CardDescription>
          <CardTitle className="text-3xl text-destructive">
            {device.activeAlerts}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-xs">Requires attention</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardDescription>Data Points</CardDescription>
          <CardTitle className="text-3xl text-primary">
            {device.dataPoints}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-xs">Collected today</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardDescription>Uptime</CardDescription>
          <CardTitle className="text-3xl text-accent">
            {device.uptime}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-xs">Last 30 days</p>
        </CardContent>
      </Card>
    </div>
  );
}
