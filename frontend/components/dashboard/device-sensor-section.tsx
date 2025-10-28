import { Edit } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
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

interface DeviceSensorSectionProps {
  devices: DeviceWithStats[];
  selectedDeviceId: string;
  selectedSensorId: string;
  onDeviceChange: (deviceId: string) => void;
  onSensorChange: (sensorId: string) => void;
  onEditClick: () => void;
}

export function DeviceSensorSection({
  devices,
  selectedDeviceId,
  selectedSensorId,
  onDeviceChange,
  onSensorChange,
  onEditClick,
}: DeviceSensorSectionProps) {
  const selectedDevice = devices.find(
    (d) => d.id.toString() === selectedDeviceId
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Device & Sensor</CardTitle>
          {selectedDevice && (
            <Button variant="ghost" size="sm" onClick={onEditClick}>
              <Edit className="mr-2 size-4" />
              Edit Device
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <label className="text-sm font-medium">Device</label>
            <Select value={selectedDeviceId} onValueChange={onDeviceChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {devices.map((device) => (
                  <SelectItem key={device.id} value={device.id.toString()}>
                    {device.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedDevice && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Sensor</label>
              <Select value={selectedSensorId} onValueChange={onSensorChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {selectedDevice.sensors?.map((sensor) => {
                    const Icon = sensor.icon;
                    return (
                      <SelectItem key={sensor.id} value={sensor.id.toString()}>
                        <div className="flex items-center gap-2">
                          <Icon className="size-4" />
                          <span>{sensor.label}</span>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
          )}

          {selectedDevice && (
            <div className="flex items-end">
              <Badge
                variant={
                  selectedDevice.status === "online" ? "default" : "destructive"
                }
                className="h-fit"
              >
                {selectedDevice.status === "online" ? "Online" : "Offline"}
              </Badge>
            </div>
          )}
        </div>

        {selectedDevice && (
          <>
            <Separator />
            <div className="grid gap-2 text-sm md:grid-cols-3">
              <div>
                <span className="text-muted-foreground text-xs">Location:</span>{" "}
                <span className="font-medium">{selectedDevice.location}</span>
              </div>
              <div>
                <span className="text-muted-foreground text-xs">MAC:</span>{" "}
                <span className="font-mono text-xs">
                  {selectedDevice.mac_address}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground text-xs">Sensors:</span>{" "}
                <span className="font-medium">
                  {selectedDevice.sensors?.length || 0}
                </span>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
