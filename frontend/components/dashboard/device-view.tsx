"use client";

import { useState } from "react";
import { Thermometer, Droplets, Zap, Wind } from "lucide-react";
import { EditDeviceDialog } from "@/components/devices/edit-device-dialog";
import type { DeviceResponse, SensorResponse } from "@/lib/model";
import { DeviceStatsCards } from "./device-stats-cards";
import { DeviceSensorSection } from "./device-sensor-section";
import { SensorStatsSection } from "./sensor-stats-section";
import { SensorChartSection } from "./sensor-chart-section";

// Extended types for UI-specific data not in API models
interface DeviceWithStats extends DeviceResponse {
  location?: string;
  status?: string;
  sensors?: Array<SensorResponse & { icon?: any; unit?: string }>;
  totalSensors?: number;
  activeAlerts?: number;
  dataPoints?: number;
  uptime?: string;
}

interface DeviceViewProps {
  initialDeviceId?: string;
}

export function DeviceView({ initialDeviceId = "device-1" }: DeviceViewProps) {
  const [selectedDeviceId, setSelectedDeviceId] = useState(initialDeviceId);
  const [selectedSensorId, setSelectedSensorId] = useState("sensor-1");
  const [timeframe, setTimeframe] = useState("today");
  const [isEditDeviceDialogOpen, setIsEditDeviceDialogOpen] = useState(false);

  // Mock data - in real app, this would come from API
  const devices: DeviceWithStats[] = [
    {
      id: 1,
      label: "Temperature Sensor - Lab A",
      mac_address: "00:1B:44:11:3A:B7",
      location: "Building 1, Floor 2",
      status: "online",
      sensors: [
        {
          id: 1,
          label: "Temperature",
          type: "other",
          pin_id: 4 as any,
          range_min: 0,
          range_max: 100,
          in_out: true,
          unit: "°C",
          icon: Thermometer,
        },
        {
          id: 2,
          label: "Humidity",
          type: "other",
          pin_id: 5 as any,
          range_min: 0,
          range_max: 100,
          in_out: true,
          unit: "%",
          icon: Droplets,
        },
      ],
      totalSensors: 2,
      activeAlerts: 1,
      dataPoints: 1440,
      uptime: "99.8%",
    },
    {
      id: 2,
      label: "Power Monitor - Server Room",
      mac_address: "00:1B:44:11:3A:B8",
      location: "Building 2, Basement",
      status: "online",
      sensors: [
        {
          id: 3,
          label: "Power Consumption",
          type: "other",
          pin_id: 6 as any,
          range_min: 0,
          range_max: 1000,
          in_out: true,
          unit: "W",
          icon: Zap,
        },
        {
          id: 4,
          label: "Voltage",
          type: "other",
          pin_id: 7 as any,
          range_min: 0,
          range_max: 240,
          in_out: true,
          unit: "V",
          icon: Zap,
        },
      ],
      totalSensors: 2,
      activeAlerts: 0,
      dataPoints: 2880,
      uptime: "100%",
    },
    {
      id: 3,
      label: "Air Quality Monitor - Office",
      mac_address: "00:1B:44:11:3A:B9",
      location: "Building 1, Floor 1",
      status: "warning",
      sensors: [
        {
          id: 5,
          label: "CO2 Level",
          type: "other",
          pin_id: 8 as any,
          range_min: 0,
          range_max: 5000,
          in_out: true,
          unit: "ppm",
          icon: Wind,
        },
        {
          id: 6,
          label: "Air Temperature",
          type: "other",
          pin_id: 9 as any,
          range_min: 0,
          range_max: 100,
          in_out: true,
          unit: "°C",
          icon: Thermometer,
        },
      ],
      totalSensors: 2,
      activeAlerts: 2,
      dataPoints: 720,
      uptime: "95.2%",
    },
  ];

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

  const selectedDevice = devices.find(
    (d) => d.id.toString() === selectedDeviceId
  );
  const selectedSensor = selectedDevice?.sensors?.find(
    (s) => s.id.toString() === selectedSensorId
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

  return (
    <>
      {selectedDevice && <DeviceStatsCards device={selectedDevice} />}

      <DeviceSensorSection
        devices={devices}
        selectedDeviceId={selectedDeviceId}
        selectedSensorId={selectedSensorId}
        onDeviceChange={setSelectedDeviceId}
        onSensorChange={setSelectedSensorId}
        onEditClick={() => setIsEditDeviceDialogOpen(true)}
      />

      {selectedSensor && (
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

      <EditDeviceDialog
        open={isEditDeviceDialogOpen}
        onOpenChange={setIsEditDeviceDialogOpen}
        device={
          selectedDevice
            ? {
                id: selectedDevice.id.toString(),
                name: selectedDevice.label,
                location: selectedDevice.location || "",
                macAddress: selectedDevice.mac_address,
                status: selectedDevice.status || "unknown",
              }
            : undefined
        }
      />
    </>
  );
}
