"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DeviceView } from "@/components/dashboard/device-view";
import { AutomationView } from "@/components/dashboard/automation-view";

export default function DashboardPage() {
  const searchParams = useSearchParams();
  const initialView = searchParams.get("view") || "device";
  const initialDeviceId = searchParams.get("deviceId") || "device-1";
  const initialAutomationId = searchParams.get("automationId") || "auto-1";

  const [selectedView, setSelectedView] = useState<"device" | "automation">(
    initialView as "device" | "automation"
  );

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Monitor and manage your IoT network
            </p>
          </div>
          <Select
            value={selectedView}
            onValueChange={(v) => setSelectedView(v as "device" | "automation")}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="device">Device View</SelectItem>
              <SelectItem value="automation">Automation View</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {selectedView === "device" && (
          <DeviceView initialDeviceId={initialDeviceId} />
        )}

        {selectedView === "automation" && (
          <AutomationView initialAutomationId={initialAutomationId} />
        )}
      </div>
    </div>
  );
}
