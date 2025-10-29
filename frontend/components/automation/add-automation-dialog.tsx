"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Bell, Mail, Plus, X } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDevicesDevicesGet } from "@/lib/api/devices/devices";
import {
  useCreateAutomationPost,
  getAutomationsAutomationGetQueryKey,
} from "@/lib/api/automations/automations";
import type {
  DeviceResponse,
  SensorResponse,
  ActionType,
} from "@/lib/api/model";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

interface AddAutomationDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

interface Action {
  id: string;
  type: ActionType;
  target: string;
  value: string;
}

export function AddAutomationDialog({
  isOpen,
  setIsOpen,
}: AddAutomationDialogProps) {
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [condition, setCondition] = useState<"lt" | "gt" | "eq">("gt");
  const [onValue, setOnValue] = useState("");
  const [selectedDeviceId, setSelectedDeviceId] = useState<number | null>(null);
  const [selectedSensorId, setSelectedSensorId] = useState<number | null>(null);
  const [actions, setActions] = useState<Action[]>([
    { id: "1", type: "email" as ActionType, target: "", value: "" },
  ]);

  const { data: devicesData, isLoading: isLoadingDevices } =
    useDevicesDevicesGet();
  const devices = devicesData?.data ?? [];

  const selectedDevice = devices.find((d) => d.id === selectedDeviceId);
  const sensors = selectedDevice?.sensors ?? [];

  const { mutate: createAutomation, isPending } = useCreateAutomationPost({
    mutation: {
      onSuccess: () => {
        toast.success("Automation created successfully");
        queryClient.invalidateQueries({
          queryKey: getAutomationsAutomationGetQueryKey(),
        });
        setIsOpen(false);
        resetForm();
      },
      onError: (error: any) => {
        const message =
          error?.response?.data?.detail || "Failed to create automation";
        toast.error(
          typeof message === "string" ? message : JSON.stringify(message)
        );
      },
    },
  });

  const resetForm = () => {
    setName("");
    setCondition("gt");
    setOnValue("");
    setSelectedDeviceId(null);
    setSelectedSensorId(null);
    setActions([
      { id: "1", type: "email" as ActionType, target: "", value: "" },
    ]);
  };

  const addAction = () => {
    setActions([
      ...actions,
      {
        id: Date.now().toString(),
        type: "email" as ActionType,
        target: "",
        value: "",
      },
    ]);
  };

  const removeAction = (id: string) => {
    if (actions.length > 1) {
      setActions(actions.filter((action) => action.id !== id));
    }
  };

  const updateAction = (
    id: string,
    field: keyof Action,
    value: string | ActionType
  ) => {
    setActions(
      actions.map((action) =>
        action.id === id ? { ...action, [field]: value } : action
      )
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedSensorId) {
      toast.error("Please select a sensor");
      return;
    }

    const payload = {
      name,
      condition,
      on_value: parseInt(onValue),
      sensor_id: selectedSensorId,
      actions: actions.map(({ type, target, value }) => ({
        type,
        target,
        value: value || "No subject provided",
      })),
    };

    createAutomation({ data: payload });
  };

  const handleClose = () => {
    setIsOpen(false);
    resetForm();
  };

  // Reset sensor selection when device changes
  useEffect(() => {
    setSelectedSensorId(null);
  }, [selectedDeviceId]);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Create Automation Rule</DialogTitle>
          <DialogDescription>
            Define triggers and actions for automated device control
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle>Rule Information</CardTitle>
              <CardDescription>
                Give your automation rule a name
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="rule-name">Rule Name</Label>
                <Input
                  id="rule-name"
                  placeholder="e.g., High Temperature Alert"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Trigger Configuration */}
          <Card>
            <CardHeader>
              <CardTitle>Trigger Condition</CardTitle>
              <CardDescription>
                Define when this automation should be triggered
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="trigger-device">Device</Label>
                  <Select
                    value={selectedDeviceId?.toString()}
                    onValueChange={(value) =>
                      setSelectedDeviceId(parseInt(value))
                    }
                    required
                    disabled={isLoadingDevices}
                  >
                    <SelectTrigger id="trigger-device">
                      <SelectValue placeholder="Select device" />
                    </SelectTrigger>
                    <SelectContent>
                      {devices.map((device) => (
                        <SelectItem
                          key={device.id}
                          value={device.id.toString()}
                        >
                          {device.label || device.mac_address}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="trigger-sensor">Sensor</Label>
                  <Select
                    value={selectedSensorId?.toString()}
                    onValueChange={(value) =>
                      setSelectedSensorId(parseInt(value))
                    }
                    required
                    disabled={!selectedDeviceId || sensors.length === 0}
                  >
                    <SelectTrigger id="trigger-sensor">
                      <SelectValue placeholder="Select sensor" />
                    </SelectTrigger>
                    <SelectContent>
                      {sensors.map((sensor) => (
                        <SelectItem
                          key={sensor.id}
                          value={sensor.id.toString()}
                        >
                          {sensor.label || `Sensor ${sensor.id}`} ({sensor.type}
                          )
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="trigger-condition">Condition</Label>
                  <Select
                    value={condition}
                    onValueChange={(value: any) => setCondition(value)}
                    required
                  >
                    <SelectTrigger id="trigger-condition">
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gt">Greater than (&gt;)</SelectItem>
                      <SelectItem value="lt">Less than (&lt;)</SelectItem>
                      <SelectItem value="eq">Equals (=)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="trigger-value">Threshold Value</Label>
                  <Input
                    id="trigger-value"
                    placeholder="e.g., 25"
                    type="number"
                    value={onValue}
                    onChange={(e) => setOnValue(e.target.value)}
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell className="size-5 text-accent" />
                  <CardTitle>Actions ({actions.length})</CardTitle>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addAction}
                >
                  <Plus className="mr-2 size-4" />
                  Add Action
                </Button>
              </div>
              <CardDescription>
                Define what should happen when the trigger condition is met
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {actions.map((action, index) => (
                <div
                  key={action.id}
                  className="space-y-4 rounded-lg border p-4"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold">Action {index + 1}</h4>
                    {actions.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeAction(action.id)}
                      >
                        <X className="size-4" />
                      </Button>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`action-type-${action.id}`}>
                      Action Type
                    </Label>
                    <Select
                      value={action.type}
                      onValueChange={(type) =>
                        updateAction(action.id, "type", type)
                      }
                      required
                    >
                      <SelectTrigger id={`action-type-${action.id}`}>
                        <SelectValue placeholder="Select action" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="email">Send Email</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`email-address-${action.id}`}>
                      Email Address
                    </Label>
                    <div className="relative">
                      <Mail className="text-muted-foreground absolute top-2.5 left-3 size-4" />
                      <Input
                        id={`email-address-${action.id}`}
                        type="email"
                        placeholder="your@email.com"
                        className="pl-9"
                        value={action.target}
                        onChange={(e) =>
                          updateAction(action.id, "target", e.target.value)
                        }
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`email-subject-${action.id}`}>
                      Email Subject (Optional)
                    </Label>
                    <Input
                      id={`email-subject-${action.id}`}
                      placeholder="e.g., Temperature Alert"
                      value={action.value}
                      onChange={(e) =>
                        updateAction(action.id, "value", e.target.value)
                      }
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Dialog Footer */}
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isPending}
              className="sm:mr-2"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Creating..." : "Create Rule"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
