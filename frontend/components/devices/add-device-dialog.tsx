"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  addDeviceSchema,
  AddDeviceFormData,
} from "@/lib/validators/add-device-schema";

interface AddDeviceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddDeviceDialog({ open, onOpenChange }: AddDeviceDialogProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<AddDeviceFormData>({
    resolver: yupResolver(addDeviceSchema),
    defaultValues: {
      name: "",
      type: undefined,
      mac: "",
      location: "",
    },
  });

  const onSubmit = (data: AddDeviceFormData) => {
    // TODO: Implement device registration logic
    onOpenChange(false);
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
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="device-name">Device Name</Label>
            <Input
              id="device-name"
              placeholder="e.g., Temperature Sensor - Lab A"
              {...register("name")}
            />
            {errors.name && (
              <span className="text-xs text-destructive">
                {errors.name.message}
              </span>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="device-type">Device Type</Label>
            <Select
              value={watch("type") ?? ""}
              onValueChange={(value) =>
                setValue("type", value as AddDeviceFormData["type"], {
                  shouldValidate: true,
                })
              }
            >
              <SelectTrigger id="device-type">
                <SelectValue placeholder="Select device type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sensor">Sensor</SelectItem>
                <SelectItem value="actuator">Actuator</SelectItem>
                <SelectItem value="gateway">Gateway</SelectItem>
              </SelectContent>
            </Select>
            {errors.type && (
              <span className="text-xs text-destructive">
                {errors.type.message}
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
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              placeholder="e.g., Building 1, Floor 2"
              {...register("location")}
            />
            {errors.location && (
              <span className="text-xs text-destructive">
                {errors.location.message}
              </span>
            )}
          </div>
        </div>
        <form onSubmit={handleSubmit(onSubmit as any)}>
          <DialogFooter>
            <Button
              variant="outline"
              type="button"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Register Device</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
