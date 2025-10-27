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
import { useState } from "react";

interface AddDeviceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddDeviceDialog({ open, onOpenChange }: AddDeviceDialogProps) {
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [mac, setMac] = useState("");
  const [location, setLocation] = useState("");

  const handleRegister = () => {
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
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Temperature Sensor - Lab A"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="device-type">Device Type</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger id="device-type">
                <SelectValue placeholder="Select device type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sensor">Sensor</SelectItem>
                <SelectItem value="actuator">Actuator</SelectItem>
                <SelectItem value="gateway">Gateway</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="device-id">Device ID / MAC Address</Label>
            <Input
              id="device-id"
              value={mac}
              onChange={(e) => setMac(e.target.value)}
              placeholder="e.g., 00:1B:44:11:3A:B7"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g., Building 1, Floor 2"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleRegister}>Register Device</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
