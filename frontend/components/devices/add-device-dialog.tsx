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
  addDeviceSchema,
  AddDeviceFormData,
} from "@/lib/validators/device-schema";
import {
  useAttachDevicesMacAddressPut,
  getDevicesDevicesGetQueryKey,
} from "@/lib/devices/devices";
import { useAuthContext } from "@/lib/providers/authProvider";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

interface AddDeviceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddDeviceDialog({ open, onOpenChange }: AddDeviceDialogProps) {
  const { user } = useAuthContext();
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddDeviceFormData>({
    resolver: yupResolver(addDeviceSchema),
    defaultValues: {
      label: "",
      mac: "",
    },
  });

  const attachMutation = useAttachDevicesMacAddressPut({
    mutation: {
      onSuccess: () => {
        toast.success("Device registered successfully!");
        queryClient.invalidateQueries({
          queryKey: getDevicesDevicesGetQueryKey(),
        });
        reset();
        onOpenChange(false);
      },
      onError: (error: any) => {
        const errorMessage =
          error.response?.data?.detail || "Failed to register device";
        toast.error(errorMessage);
      },
    },
  });

  const onSubmit = (data: AddDeviceFormData) => {
    if (!user?.id) {
      toast.error("You must be logged in to register a device");
      return;
    }

    // Remove any colons or hyphens from MAC address for backend
    const macAddress = data.mac.replace(/[:-]/g, "");

    attachMutation.mutate({
      macAddress,
      data: {
        label: data.label,
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Register New Device</DialogTitle>
          <DialogDescription>
            Add a new IoT device to your network
          </DialogDescription>
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
              <Label htmlFor="device-id">Device ID / MAC Address</Label>
              <Input
                id="device-id"
                placeholder="e.g., 00:1B:44:11:3A:B7"
                {...register("mac")}
              />
              {errors.mac && (
                <span className="text-xs text-destructive">
                  {errors.mac.message}
                </span>
              )}
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
            <Button type="submit" disabled={attachMutation.isPending}>
              {attachMutation.isPending ? "Registering..." : "Register Device"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
