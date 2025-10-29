"use client";

import { useState, useEffect } from "react";
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
import type {
  AutomationResponseSchema,
  ActionResponseSchema,
} from "@/lib/api/model";
import {
  useUpdateAutomationIdPatch,
  getAutomationsAutomationGetQueryKey,
} from "@/lib/api/automations/automations";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface EditAutomationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  automation: AutomationResponseSchema | null;
}

type ActionWithChanges = ActionResponseSchema & {
  _isNew?: boolean;
  _isDeleted?: boolean;
};

export function EditAutomationDialog({
  open,
  onOpenChange,
  automation,
}: EditAutomationDialogProps) {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useUpdateAutomationIdPatch();

  const [name, setName] = useState("");
  const [condition, setCondition] = useState("");
  const [onValue, setOnValue] = useState("");
  const [sensorId, setSensorId] = useState("");
  const [actions, setActions] = useState<ActionWithChanges[]>([]);

  useEffect(() => {
    if (automation && open) {
      setName(automation.name);
      setCondition(automation.condition);
      setOnValue(String(automation.on_value));
      setSensorId(String(automation.sensor_id));
      setActions(automation.actions.map((action) => ({ ...action })));
    }
  }, [automation, open]);

  const addAction = () => {
    setActions([
      ...actions,
      {
        id: Date.now(), // Temporary ID for new actions
        type: "email",
        target: "",
        value: "",
        _isNew: true,
      } as ActionWithChanges,
    ]);
  };

  const removeAction = (index: number) => {
    const action = actions[index];
    if (action._isNew) {
      // Remove immediately if it's a new action
      setActions(actions.filter((_, i) => i !== index));
    } else {
      // Mark for deletion if it's an existing action
      setActions(
        actions.map((a, i) => (i === index ? { ...a, _isDeleted: true } : a))
      );
    }
  };

  const updateAction = (index: number, field: string, value: string) => {
    setActions(
      actions.map((action, i) =>
        i === index ? { ...action, [field]: value } : action
      )
    );
  };

  const handleSave = async () => {
    if (!automation) return;

    try {
      const existingActions = actions
        .filter((a) => !a._isNew && !a._isDeleted)
        .map(({ id, type, target, value }) => ({
          id,
          type,
          target,
          value: value || null,
        }));

      const newActions = actions
        .filter((a) => a._isNew && !a._isDeleted)
        .map(({ type, target, value }) => ({
          type,
          target,
          value: value || null,
        }));

      const deleteActions = actions
        .filter((a) => a._isDeleted && !a._isNew)
        .map((a) => a.id);

      const payload = {
        name,
        condition,
        on_value: Number(onValue),
        sensor_id: Number(sensorId),
        actions: existingActions,
        new_actions: newActions,
        delete_actions: deleteActions,
      };

      console.log("Sending payload:", payload);

      await mutateAsync({ id: automation.id, data: payload });

      toast.success("Automation updated successfully");
      queryClient.invalidateQueries({
        queryKey: getAutomationsAutomationGetQueryKey(),
      });
      onOpenChange(false);
    } catch (error: any) {
      console.error("Update error:", error);

      let errorMessage = "Failed to update automation";

      if (error?.response?.data?.detail) {
        const detail = error.response.data.detail;
        if (typeof detail === "string") {
          errorMessage = detail;
        } else if (Array.isArray(detail)) {
          errorMessage = detail
            .map((err: any) => err.msg || JSON.stringify(err))
            .join(", ");
        } else {
          errorMessage = JSON.stringify(detail);
        }
      }

      toast.error(errorMessage);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Automation Rule</DialogTitle>
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
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., High Temperature Alert"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sensor-id">Sensor ID</Label>
              <Input
                id="sensor-id"
                type="number"
                value={sensorId}
                onChange={(e) => setSensorId(e.target.value)}
                placeholder="e.g., 1"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="condition">Condition</Label>
              <Select value={condition} onValueChange={setCondition}>
                <SelectTrigger id="condition">
                  <SelectValue placeholder="Select condition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gt">Greater than</SelectItem>
                  <SelectItem value="lt">Less than</SelectItem>
                  <SelectItem value="eq">Equal to</SelectItem>
                  <SelectItem value="gte">Greater than or equal</SelectItem>
                  <SelectItem value="lte">Less than or equal</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="threshold">Threshold Value</Label>
              <Input
                id="threshold"
                type="number"
                value={onValue}
                onChange={(e) => setOnValue(e.target.value)}
                placeholder="e.g., 25"
              />
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base">
                Actions ({actions.filter((a) => !a._isDeleted).length})
              </Label>
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

            {actions
              .filter((a) => !a._isDeleted)
              .map((action, index) => (
                <div
                  key={action.id}
                  className="space-y-4 rounded-lg border p-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold">
                      Action {index + 1}
                      {action._isNew && (
                        <span className="ml-2 text-xs text-muted-foreground">
                          (New)
                        </span>
                      )}
                    </span>
                    {actions.filter((a) => !a._isDeleted).length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeAction(actions.indexOf(action))}
                      >
                        <Trash2 className="size-4 text-destructive" />
                      </Button>
                    )}
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Action Type</Label>
                      <Select
                        value={action.type}
                        onValueChange={(value) =>
                          updateAction(actions.indexOf(action), "type", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select action type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="email">Send Email</SelectItem>
                          <SelectItem value="sms">Send SMS</SelectItem>
                          <SelectItem value="push">
                            Push Notification
                          </SelectItem>
                          <SelectItem value="webhook">Webhook</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Target</Label>
                      <Input
                        value={action.target}
                        onChange={(e) =>
                          updateAction(
                            actions.indexOf(action),
                            "target",
                            e.target.value
                          )
                        }
                        placeholder="e.g., admin@company.com"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Value (Optional)</Label>
                    <Input
                      value={action.value || ""}
                      onChange={(e) =>
                        updateAction(
                          actions.indexOf(action),
                          "value",
                          e.target.value
                        )
                      }
                      placeholder="Optional value for the action"
                    />
                  </div>
                </div>
              ))}
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
            className="sm:mr-2"
          >
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isPending}>
            {isPending ? "Saving..." : "Save Automation"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
