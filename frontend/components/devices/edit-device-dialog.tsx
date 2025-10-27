"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  editDeviceSchema,
  EditDeviceFormData,
} from "@/lib/validators/edit-device-schema";
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

interface EditDeviceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  device?: {
    id: string;
    name: string;
    location: string;
    macAddress: string;
    status: string;
  };
}

export function EditDeviceDialog({
  open,
  onOpenChange,
  device,
}: EditDeviceDialogProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<EditDeviceFormData>({
    resolver: yupResolver(editDeviceSchema),
    defaultValues: {
      name: device?.name || "",
      location: device?.location || "",
      macAddress: device?.macAddress || "",
      status: (device?.status as EditDeviceFormData["status"]) ?? "online",
    },
  });

  const onSubmit = (data: EditDeviceFormData) => {
    // TODO: Implement device update logic
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Device</DialogTitle>
          <DialogDescription>
            Update device information and configuration
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Device Name</Label>
              <Input
                id="edit-name"
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
              <Label htmlFor="edit-location">Location</Label>
              <Input
                id="edit-location"
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
          <div className="space-y-2">
            <Label htmlFor="edit-mac">MAC Address</Label>
            <Input
              id="edit-mac"
              placeholder="e.g., 00:1B:44:11:3A:B7"
              className="font-mono"
              {...register("macAddress")}
            />
            {errors.macAddress && (
              <span className="text-xs text-destructive">
                {errors.macAddress.message}
              </span>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-status">Status</Label>
            <Select
              value={watch("status") ?? ""}
              onValueChange={(value) =>
                setValue("status", value as EditDeviceFormData["status"], {
                  shouldValidate: true,
                })
              }
            >
              <SelectTrigger id="edit-status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="online">Online</SelectItem>
                <SelectItem value="offline">Offline</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
              </SelectContent>
            </Select>
            {errors.status && (
              <span className="text-xs text-destructive">
                {errors.status.message}
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
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
