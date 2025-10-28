"use client";

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
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  editDeviceSchema,
  EditDeviceFormData,
} from "@/lib/validators/device-schema";
import {
  useUpdateDevicesIdPatch,
  getDevicesDevicesGetQueryKey,
} from "@/lib/api/devices/devices";
import type { DeviceResponse } from "@/lib/api/model";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

interface EditDeviceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  device: DeviceResponse | null;
}

export function EditDeviceDialog({
  open,
  onOpenChange,
  device,
}: EditDeviceDialogProps) {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EditDeviceFormData>({
    resolver: yupResolver(editDeviceSchema),
    defaultValues: {
      label: "",
    },
  });

  // Update form when device changes
  useEffect(() => {
    if (device) {
      reset({
        label: device.label || "",
      });
    }
  }, [device, reset]);

  const updateMutation = useUpdateDevicesIdPatch({
    mutation: {
      onSuccess: () => {
        toast.success("Device updated successfully!");
        queryClient.invalidateQueries({
          queryKey: getDevicesDevicesGetQueryKey(),
        });
        onOpenChange(false);
      },
      onError: (error: any) => {
        const errorMessage =
          error.response?.data?.detail || "Failed to update device";
        toast.error(errorMessage);
      },
    },
  });

  const onSubmit = (data: EditDeviceFormData) => {
    if (!device?.id) {
      toast.error("Device ID is missing");
      return;
    }

    updateMutation.mutate({
      id: device.id,
      data: {
        label: data.label,
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Device</DialogTitle>
          <DialogDescription>Update device information</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="device-name">Device Name</Label>
              <Input
                id="device-name"
                placeholder="e.g., Temperature Sensor - Lab A"
                {...register("label")}
              />
              {errors.label && (
                <span className="text-xs text-destructive">
                  {errors.label.message}
                </span>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="device-mac">MAC Address</Label>
              <Input
                id="device-mac"
                value={device?.mac_address || ""}
                disabled
                className="font-mono bg-muted cursor-not-allowed"
              />
              <p className="text-xs text-muted-foreground">
                MAC address cannot be changed
              </p>
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              type="button"
              onClick={() => {
                reset();
                onOpenChange(false);
              }}
              className="sm:mr-2"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={updateMutation.isPending}>
              {updateMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
