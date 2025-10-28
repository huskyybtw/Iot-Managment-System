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
import {
  useDeleteDevicesIdDelete,
  getDevicesDevicesGetQueryKey,
} from "@/lib/devices/devices";
import type { DeviceResponse } from "@/lib/model";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";

interface DeleteDeviceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  device: DeviceResponse | null;
}

export function DeleteDeviceDialog({
  open,
  onOpenChange,
  device,
}: DeleteDeviceDialogProps) {
  const queryClient = useQueryClient();
  const { mutate: deleteDevice, isPending } = useDeleteDevicesIdDelete();

  const handleDelete = () => {
    if (!device) return;

    deleteDevice(
      { id: device.id },
      {
        onSuccess: () => {
          toast.success("Device detached successfully", {
            description: `${
              device.label || "Device"
            } has been removed from your account.`,
          });
          queryClient.invalidateQueries({
            queryKey: getDevicesDevicesGetQueryKey(),
          });
          onOpenChange(false);
        },
        onError: (error: any) => {
          toast.error("Failed to detach device", {
            description:
              error?.response?.data?.detail || "Please try again later.",
          });
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Trash2 className="size-5 text-destructive" />
            Remove Device
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to remove this device from your account?
          </DialogDescription>
        </DialogHeader>

        {device && (
          <div className="rounded-lg border bg-muted/50 p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Device Name:</span>
              <span className="text-sm">{device.label || "Unnamed"}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">MAC Address:</span>
              <span className="font-mono text-sm">{device.mac_address}</span>
            </div>
          </div>
        )}

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
            className="sm:mr-2"
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={isPending}
          >
            {isPending ? "Removing..." : "Remove Device"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
