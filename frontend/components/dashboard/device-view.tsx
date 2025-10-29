"use client";

import { useState, useEffect } from "react";
import { Thermometer, Droplets, Zap, Wind } from "lucide-react";
import { EditDeviceDialog } from "@/components/devices/edit-device-dialog";
import type {
  DeviceResponse,
  SensorResponse,
  SensorValueResponse,
} from "@/lib/api/model";
import {
  useDevicesDevicesGet,
  useSensorValuesDevicesIdSensorsSensorIdValuesGet,
} from "@/lib/api/devices/devices";
import { Loading } from "@/components/common/loading";
import { ErrorMessage } from "@/components/common/error";
import { DeviceSensorSection } from "./device-sensor-section";
import { SensorStatsSection } from "./sensor-stats-section";
import { SensorChartSection } from "./sensor-chart-section";

// Extended types for UI-specific data not in API models
interface DeviceWithStats extends Omit<DeviceResponse, "sensors"> {
  status?: string;
  sensors?: Array<SensorResponse & { icon?: any; unit?: string }>;
}

interface DeviceViewProps {
  initialDeviceId?: number;
}

export function DeviceView({ initialDeviceId }: DeviceViewProps) {
  const { data: devicesData, isLoading, error } = useDevicesDevicesGet();
  const devices = devicesData?.data ?? [];

  const [selectedDeviceId, setSelectedDeviceId] = useState<number | null>(null);
  const [selectedSensorId, setSelectedSensorId] = useState<number | null>(null);
  const [timeframe, setTimeframe] = useState("today");
  const [isEditDeviceDialogOpen, setIsEditDeviceDialogOpen] = useState(false);

  // Calculate timeframe in seconds for API
  const getTimeframeSeconds = (tf: string): number => {
    switch (tf) {
      case "today":
        return 86400; // 24 hours
      case "week":
        return 604800; // 7 days
      case "month":
        return 2592000; // 30 days
      default:
        return 86400;
    }
  };

  // Fetch sensor values from API
  const {
    data: sensorValuesData,
    isLoading: isSensorValuesLoading,
    error: sensorValuesError,
  } = useSensorValuesDevicesIdSensorsSensorIdValuesGet(
    selectedDeviceId ?? 0,
    selectedSensorId ?? 0,
    { timeframe: getTimeframeSeconds(timeframe) },
    {
      query: {
        enabled: selectedDeviceId !== null && selectedSensorId !== null,
      },
    }
  );

  // Set initial device and sensor when data loads
  useEffect(() => {
    if (devices.length > 0 && selectedDeviceId === null) {
      const deviceId = initialDeviceId || devices[0].id;
      setSelectedDeviceId(deviceId);

      const device = devices.find((d) => d.id === deviceId);
      if (device?.sensors && device.sensors.length > 0) {
        setSelectedSensorId(device.sensors[0].id);
      }
    }
  }, [devices, initialDeviceId, selectedDeviceId]);

  // Update selected sensor when device changes
  useEffect(() => {
    if (selectedDeviceId) {
      const device = devices.find((d) => d.id === selectedDeviceId);
      if (device?.sensors && device.sensors.length > 0) {
        // Keep current sensor if it belongs to the new device, otherwise select first sensor
        const sensorExists = device.sensors.some(
          (s) => s.id === selectedSensorId
        );
        if (!sensorExists) {
          setSelectedSensorId(device.sensors[0].id);
        }
      } else {
        setSelectedSensorId(null);
      }
    }
  }, [selectedDeviceId, devices, selectedSensorId]);

  const getSensorIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "temperature":
        return Thermometer;
      case "humidity":
        return Droplets;
      case "power":
        return Zap;
      case "air":
        return Wind;
      default:
        return Thermometer;
    }
  };

  const getSensorUnit = (type: string) => {
    switch (type.toLowerCase()) {
      case "temperature":
        return "°C";
      case "humidity":
        return "%";
      case "power":
        return "W";
      case "voltage":
        return "V";
      case "air":
        return "ppm";
      default:
        return "";
    }
  };

  // Transform sensor values from API to chart format
  const transformSensorValuesToChartData = (
    values: SensorValueResponse[],
    timeframe: string
  ) => {
    return values.map((sv) => {
      const date = new Date(sv.timestamp);
      let time: string;

      switch (timeframe) {
        case "today":
          time = `${date.getHours().toString().padStart(2, "0")}:${date
            .getMinutes()
            .toString()
            .padStart(2, "0")}`;
          break;
        case "week":
          time = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][
            date.getDay()
          ];
          break;
        case "month":
          time = `${date.getDate()}`;
          break;
        default:
          time = date.toLocaleTimeString();
      }

      return {
        time,
        value: sv.value,
        timestamp: date.getTime(),
      };
    });
  };

  if (isLoading) {
  }

  if (error) {
    return <ErrorMessage message="Error loading devices" />;
  }

  if (devices.length === 0) {
    return <ErrorMessage message="No devices found" />;
  }

  const selectedDevice = devices.find((d) => d.id === selectedDeviceId);

  // Enrich device with UI-specific data
  const enrichedDevice: DeviceWithStats | undefined = selectedDevice
    ? {
        ...selectedDevice,
        status: "online", // Could be calculated from sensor data
        sensors: selectedDevice.sensors?.map((s) => ({
          ...s,
          icon: getSensorIcon(s.type),
          unit: getSensorUnit(s.type),
        })),
      }
    : undefined;

  const selectedSensor = enrichedDevice?.sensors?.find(
    (s) => s.id === selectedSensorId
  );

  // Use real sensor data from API or fall back to empty array
  const sensorValues = sensorValuesData?.data?.sensor_values ?? [];
  const sensorData =
    sensorValues.length > 0
      ? transformSensorValuesToChartData(sensorValues, timeframe)
      : [];

  // Only calculate stats if we have data
  const sensorStats =
    sensorData.length > 0
      ? {
          current: sensorData[sensorData.length - 1]?.value.toFixed(1) || "0",
          min: Math.min(...sensorData.map((d) => d.value)).toFixed(1),
          max: Math.max(...sensorData.map((d) => d.value)).toFixed(1),
          avg: (
            sensorData.reduce((sum, d) => sum + d.value, 0) / sensorData.length
          ).toFixed(1),
        }
      : {
          current: "0",
          min: "0",
          max: "0",
          avg: "0",
        };

  const exportToExcel = () => {
    if (sensorData.length === 0) {
      return; // Don't export if no data
    }

    const csvContent = [
      ["Timestamp", "Time", "Value", "Unit"],
      ...sensorData.map((d) => [
        new Date(d.timestamp).toISOString(),
        d.time,
        d.value.toFixed(2),
        selectedSensor?.unit || "",
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${
      selectedSensor?.label || "sensor"
    }_${timeframe}_${new Date().toISOString()}.csv`;
    a.click();
  };

  // Map devices to the format expected by DeviceSensorSection
  const devicesWithStats: DeviceWithStats[] = devices.map((device) => ({
    ...device,
    status: "online",
    sensors: device.sensors?.map((s) => ({
      ...s,
      icon: getSensorIcon(s.type),
      unit: getSensorUnit(s.type),
    })),
  }));

  return (
    <>
      <DeviceSensorSection
        devices={devicesWithStats}
        selectedDeviceId={selectedDeviceId ? String(selectedDeviceId) : ""}
        selectedSensorId={selectedSensorId ? String(selectedSensorId) : ""}
        onDeviceChange={(id) => setSelectedDeviceId(Number(id))}
        onSensorChange={(id) => setSelectedSensorId(Number(id))}
        onEditClick={() => setIsEditDeviceDialogOpen(true)}
      />

      {selectedSensor && sensorData.length > 0 && (
        <>
          <SensorStatsSection sensor={selectedSensor} stats={sensorStats} />
          <SensorChartSection
            sensor={selectedSensor}
            sensorData={sensorData}
            timeframe={timeframe}
            onTimeframeChange={setTimeframe}
            onExport={exportToExcel}
          />
        </>
      )}

      {selectedSensor && sensorData.length === 0 && !isSensorValuesLoading && (
        <div className="text-center py-8 text-muted-foreground">
          No sensor data available for the selected timeframe
        </div>
      )}

      <EditDeviceDialog
        open={isEditDeviceDialogOpen}
        onOpenChange={setIsEditDeviceDialogOpen}
        device={selectedDevice || null}
      />
    </>
  );
}
