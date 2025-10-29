"use client";

import { useState, useEffect } from "react";
import { Thermometer, Droplets, Zap, Wind } from "lucide-react";
import { EditDeviceDialog } from "@/components/devices/edit-device-dialog";
import type { DeviceResponse, SensorResponse } from "@/lib/api/model";
import { useDevicesDevicesGet } from "@/lib/api/devices/devices";
import { Loading } from "@/components/common/loading";
import { ErrorMessage } from "@/components/common/error";
import { DeviceStatsCards } from "./device-stats-cards";
import { DeviceSensorSection } from "./device-sensor-section";
import { SensorStatsSection } from "./sensor-stats-section";
import { SensorChartSection } from "./sensor-chart-section";

// Extended types for UI-specific data not in API models
interface DeviceWithStats extends Omit<DeviceResponse, "sensors"> {
  location?: string;
  status?: string;
  sensors?: Array<SensorResponse & { icon?: any; unit?: string }>;
  totalSensors?: number;
  activeAlerts?: number;
  dataPoints?: number;
  uptime?: string;
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

  const generateSensorData = (timeframe: string) => {
    const dataPoints: { [key: string]: any[] } = {
      today: Array.from({ length: 24 }, (_, i) => ({
        time: `${i.toString().padStart(2, "0")}:00`,
        hour: i,
        value: 20 + Math.random() * 5,
        timestamp: new Date().setHours(i, 0, 0, 0),
      })),
      week: Array.from({ length: 7 }, (_, i) => ({
        time: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i],
        value: 20 + Math.random() * 5,
        timestamp: new Date().setDate(new Date().getDate() - (6 - i)),
      })),
      month: Array.from({ length: 30 }, (_, i) => ({
        time: `${i + 1}`,
        value: 20 + Math.random() * 5,
        timestamp: new Date().setDate(i + 1),
      })),
    };
    return dataPoints[timeframe] || dataPoints.today;
  };

  if (isLoading) {
    return <Loading message="Loading devices..." />;
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
        location: "Unknown", // Could be added to API later
        status: "online", // Could be calculated from sensor data
        sensors: selectedDevice.sensors?.map((s) => ({
          ...s,
          icon: getSensorIcon(s.type),
          unit: getSensorUnit(s.type),
        })),
        totalSensors: selectedDevice.sensors?.length || 0,
        activeAlerts: 0, // Could be calculated from automation triggers
        dataPoints: 1440, // Mock for now
        uptime: "99.8%", // Mock for now
      }
    : undefined;

  const selectedSensor = enrichedDevice?.sensors?.find(
    (s) => s.id === selectedSensorId
  );

  const sensorData = generateSensorData(timeframe);

  const sensorStats = {
    current: sensorData[sensorData.length - 1]?.value.toFixed(1) || "0",
    min: Math.min(...sensorData.map((d) => d.value)).toFixed(1),
    max: Math.max(...sensorData.map((d) => d.value)).toFixed(1),
    avg: (
      sensorData.reduce((sum, d) => sum + d.value, 0) / sensorData.length
    ).toFixed(1),
  };

  const exportToExcel = () => {
    const csvContent = [
      ["Time", "Value", "Unit"],
      ...sensorData.map((d) => [
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
    location: "Unknown",
    status: "online",
    sensors: device.sensors?.map((s) => ({
      ...s,
      icon: getSensorIcon(s.type),
      unit: getSensorUnit(s.type),
    })),
    totalSensors: device.sensors?.length || 0,
    activeAlerts: 0,
    dataPoints: 1440,
    uptime: "99.8%",
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

      {selectedSensor && (
        <>
          <SensorChartSection
            sensor={selectedSensor}
            sensorData={sensorData}
            timeframe={timeframe}
            onTimeframeChange={setTimeframe}
            onExport={exportToExcel}
          />
        </>
      )}

      <EditDeviceDialog
        open={isEditDeviceDialogOpen}
        onOpenChange={setIsEditDeviceDialogOpen}
        device={selectedDevice || null}
      />
    </>
  );
}
