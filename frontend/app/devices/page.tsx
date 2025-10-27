"use client";

import type React from "react";
import { useDevicesDevicesGet } from "@/lib/devices/devices";

import { useState } from "react";
import {
  Plus,
  Search,
  Filter,
  Pencil,
  Trash2,
  Power,
  PowerOff,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SearchBar } from "@/components/common/search-bar";
import { DialogTrigger } from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { EditDeviceDialog } from "@/components/devices/edit-device-dialog";
import { AddDeviceDialog } from "@/components/devices/add-device-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import axios from "axios";

export default function DevicesPage() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<any>(null);
  const [search, setSearch] = useState("");
  const router = useRouter();

  const { data, isLoading, error } = useDevicesDevicesGet({
    search: search || undefined,
  });
  const devices = data?.data ?? [];

  const handleEdit = (device: any, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedDevice(device);
    setIsEditDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading devices...
      </div>
    );
  }
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Error loading devices
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Device Management
            </h1>
            <p className="text-muted-foreground mt-1">
              Register, configure, and monitor your IoT devices
            </p>
          </div>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="mr-2 size-4" />
            Add Device
          </Button>
          <AddDeviceDialog
            open={isAddDialogOpen}
            onOpenChange={setIsAddDialogOpen}
          />
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative flex-1">
                <SearchBar
                  value={search}
                  onChange={setSearch}
                  placeholder="Search devices..."
                  debounce={350}
                  icon={<Search className="text-muted-foreground size-4" />}
                  className="w-full"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Device Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Last Seen</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {devices.map((device) => (
                  <TableRow
                    key={device.id}
                    className="cursor-pointer"
                    onClick={() =>
                      router.push(`/dashboard?deviceId=device-${device.id}`)
                    }
                  >
                    <TableCell className="font-medium">
                      {device.label}
                    </TableCell>
                    <TableCell className="capitalize">sensor</TableCell>
                    <TableCell>
                      <Badge variant="default">online</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      Unknown
                    </TableCell>
                    <TableCell className="text-sm">-</TableCell>
                    <TableCell className="font-mono text-sm">
                      {device.mac_address}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-8"
                          onClick={(e) => handleEdit(device, e)}
                        >
                          <Pencil className="size-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-8"
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                        >
                          <PowerOff className="size-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive size-8"
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {devices.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-muted-foreground text-center">
                No devices found matching your criteria
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      <EditDeviceDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        device={selectedDevice}
      />
    </div>
  );
}
