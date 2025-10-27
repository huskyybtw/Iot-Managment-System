"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Zap, Bell, Mail, Phone, Plus, X } from "lucide-react";
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
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface AddAutomationDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export function AddAutomationDialog({
  isOpen,
  setIsOpen,
}: AddAutomationDialogProps) {
  const router = useRouter();

  const [actions, setActions] = useState<
    Array<{ id: string; type: string; config: any }>
  >([{ id: "1", type: "", config: {} }]);

  const addAction = () => {
    setActions([
      ...actions,
      { id: Date.now().toString(), type: "", config: {} },
    ]);
  };

  const removeAction = (id: string) => {
    if (actions.length > 1) {
      setActions(actions.filter((action) => action.id !== id));
    }
  };

  const updateActionType = (id: string, type: string) => {
    setActions(
      actions.map((action) =>
        action.id === id ? { ...action, type, config: {} } : action
      )
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsOpen(false);
    setTimeout(() => router.push("/automation"), 200);
  };

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(() => router.push("/automation"), 200);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-h-[90vh] max-w-5xl overflow-y-auto">
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
                Give your automation rule a name and description
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="rule-name">Rule Name</Label>
                <Input
                  id="rule-name"
                  placeholder="e.g., High Temperature Alert"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="rule-description">Description</Label>
                <Input
                  id="rule-description"
                  placeholder="Describe what this rule does"
                />
              </div>
            </CardContent>
            : setISOpen,
          </Card>

          {/* Trigger Configuration */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Zap className="size-5 text-primary" />
                <CardTitle>Trigger Condition</CardTitle>
              </div>
              <CardDescription>
                Define when this automation should be triggered
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="trigger-device">Device</Label>
                <Select required>
                  <SelectTrigger id="trigger-device">
                    <SelectValue placeholder="Select device" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="temp-lab-a">
                      Temperature Sensor - Lab A
                    </SelectItem>
                    <SelectItem value="humidity-warehouse">
                      Humidity Sensor - Warehouse
                    </SelectItem>
                    <SelectItem value="power-server">
                      Power Monitor - Server Room
                    </SelectItem>
                    <SelectItem value="motion-entrance">
                      Motion Detector - Entrance
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="trigger-condition">Condition</Label>
                  <Select required>
                    <SelectTrigger id="trigger-condition">
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="greater_than">Greater than</SelectItem>
                      <SelectItem value="less_than">Less than</SelectItem>
                      <SelectItem value="equals">Equals</SelectItem>
                      <SelectItem value="not_equals">Not equals</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="trigger-value">Threshold Value</Label>
                  <Input
                    id="trigger-value"
                    placeholder="e.g., 25"
                    type="number"
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

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
            <CardContent className="space-y-6">
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
                        updateActionType(action.id, type)
                      }
                      required
                    >
                      <SelectTrigger id={`action-type-${action.id}`}>
                        <SelectValue placeholder="Select action" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="notification">
                          Send Notification
                        </SelectItem>
                        <SelectItem value="email">Send Email</SelectItem>
                        <SelectItem value="sms">Send SMS</SelectItem>
                        <SelectItem value="device_control">
                          Control Device
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {action.type === "notification" && (
                    <div className="space-y-2">
                      <Label htmlFor={`notification-message-${action.id}`}>
                        Notification Message
                      </Label>
                      <Input
                        id={`notification-message-${action.id}`}
                        placeholder="Alert message"
                      />
                    </div>
                  )}

                  {action.type === "email" && (
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
                        />
                      </div>
                    </div>
                  )}

                  {action.type === "sms" && (
                    <div className="space-y-2">
                      <Label htmlFor={`phone-number-${action.id}`}>
                        Phone Number
                      </Label>
                      <div className="relative">
                        <Phone className="text-muted-foreground absolute top-2.5 left-3 size-4" />
                        <Input
                          id={`phone-number-${action.id}`}
                          type="tel"
                          placeholder="+1 (555) 000-0000"
                          className="pl-9"
                        />
                      </div>
                    </div>
                  )}

                  {action.type === "device_control" && (
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor={`target-device-${action.id}`}>
                          Target Device
                        </Label>
                        <Select>
                          <SelectTrigger id={`target-device-${action.id}`}>
                            <SelectValue placeholder="Select device" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="thermostat">
                              Smart Thermostat - Office
                            </SelectItem>
                            <SelectItem value="lights">
                              Smart Lights - Entrance
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`device-command-${action.id}`}>
                          Command
                        </Label>
                        <Select>
                          <SelectTrigger id={`device-command-${action.id}`}>
                            <SelectValue placeholder="Select command" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="turn_on">Turn On</SelectItem>
                            <SelectItem value="turn_off">Turn Off</SelectItem>
                            <SelectItem value="toggle">Toggle</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}

                  {index < actions.length - 1 && <Separator />}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit">Create Rule</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
