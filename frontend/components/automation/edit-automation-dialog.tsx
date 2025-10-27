"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Plus, Trash2 } from "lucide-react";

interface EditAutomationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  automation?: any;
}

export function EditAutomationDialog({
  open,
  onOpenChange,
  automation,
}: EditAutomationDialogProps) {
  const [actions, setActions] = useState(
    automation?.triggers || [{ condition: "", action: "", target: "" }]
  );

  const addAction = () => {
    setActions([...actions, { condition: "", action: "", target: "" }]);
  };

  const removeAction = (index: number) => {
    setActions(actions.filter((_: any, i: number) => i !== index));
  };

  const handleSave = () => {
    console.log("[v0] Saving automation:", { automation, actions });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {automation ? "Edit Automation Rule" : "Create Automation Rule"}
          </DialogTitle>
          <DialogDescription>
            Configure triggers and actions for your automation rule
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="rule-name">Rule Name</Label>
              <Input
                id="rule-name"
                defaultValue={automation?.name}
                placeholder="e.g., High Temperature Alert"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="device">Device</Label>
              <Select defaultValue={automation?.device}>
                <SelectTrigger id="device">
                  <SelectValue placeholder="Select device" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="device-1">
                    Temperature Sensor - Lab A
                  </SelectItem>
                  <SelectItem value="device-2">
                    Power Monitor - Server Room
                  </SelectItem>
                  <SelectItem value="device-3">
                    Air Quality Monitor - Office
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              defaultValue={automation?.description}
              placeholder="Describe what this rule does"
            />
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base">Actions ({actions.length})</Label>
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

            {actions.map((action: any, index: number) => (
              <div key={index} className="space-y-4 rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold">
                    Action {index + 1}
                  </span>
                  {actions.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeAction(index)}
                    >
                      <Trash2 className="size-4 text-destructive" />
                    </Button>
                  )}
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label>Sensor</Label>
                    <Select defaultValue={action.sensor}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select sensor" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="temperature">Temperature</SelectItem>
                        <SelectItem value="humidity">Humidity</SelectItem>
                        <SelectItem value="power">Power</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Condition</Label>
                    <Select defaultValue={action.condition}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select condition" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="greater_than">
                          Greater than
                        </SelectItem>
                        <SelectItem value="less_than">Less than</SelectItem>
                        <SelectItem value="equal">Equal to</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Value</Label>
                    <Input
                      type="number"
                      defaultValue={action.value}
                      placeholder="e.g., 25"
                    />
                  </div>
                </div>

                <Separator />

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Action Type</Label>
                    <Select defaultValue={action.action}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select action" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="email">Send Email</SelectItem>
                        <SelectItem value="sms">Send SMS</SelectItem>
                        <SelectItem value="push">Push Notification</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Target</Label>
                    <Input
                      defaultValue={action.target}
                      placeholder="e.g., admin@company.com"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Automation</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
