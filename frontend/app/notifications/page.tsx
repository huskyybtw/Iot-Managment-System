"use client";

import { cn } from "@/lib/utils";

import { useState } from "react";
import Link from "next/link";
import { AlertCircle, AlertTriangle, Info, Filter, Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/common/search-bar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function NotificationsPage() {
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const allNotifications = [
    {
      id: "1",
      type: "error",
      title: "Device Offline",
      message: "Motion Detector - Entrance has been offline for 2 hours",
      device: "Motion Detector - Entrance",
      deviceId: "device-3",
      location: "Building 1, Ground Floor",
      time: "2h ago",
      timestamp: "2024-01-15 14:30",
      unread: true,
    },
    {
      id: "2",
      type: "warning",
      title: "High Power Usage",
      message: "Power Monitor - Server Room exceeded threshold of 250W",
      device: "Power Monitor - Server Room",
      deviceId: "device-2",
      automationId: "auto-2",
      location: "Building 2, Basement",
      value: "265W",
      threshold: "250W",
      time: "15m ago",
      timestamp: "2024-01-15 16:15",
      unread: true,
    },
    {
      id: "3",
      type: "info",
      title: "Automation Triggered",
      message: "High Temperature Alert was activated in Lab A",
      device: "Temperature Sensor - Lab A",
      deviceId: "device-1",
      automationId: "auto-1",
      location: "Building 1, Floor 2",
      value: "26.5°C",
      time: "1h ago",
      timestamp: "2024-01-15 15:30",
      unread: false,
    },
    {
      id: "4",
      type: "warning",
      title: "Low Humidity Detected",
      message: "Humidity levels dropped below safe threshold",
      device: "Humidity Sensor - Warehouse",
      deviceId: "device-4",
      automationId: "auto-3",
      location: "Warehouse A",
      value: "38%",
      threshold: "40%",
      time: "3h ago",
      timestamp: "2024-01-15 13:30",
      unread: false,
    },
    {
      id: "5",
      type: "info",
      title: "Firmware Update Available",
      message: "New firmware version available for Smart Thermostat",
      device: "Smart Thermostat - Office",
      deviceId: "device-5",
      location: "Building 1, Floor 1",
      time: "5h ago",
      timestamp: "2024-01-15 11:30",
      unread: false,
    },
    {
      id: "6",
      type: "error",
      title: "Connection Lost",
      message: "Air Quality Monitor lost connection to network",
      device: "Air Quality Monitor - Lab B",
      deviceId: "device-6",
      location: "Building 1, Floor 3",
      time: "6h ago",
      timestamp: "2024-01-15 10:30",
      unread: false,
    },
    {
      id: "7",
      type: "info",
      title: "Device Added",
      message: "New temperature sensor successfully registered",
      device: "Temperature Sensor - Storage",
      deviceId: "device-7",
      location: "Building 3, Floor 1",
      time: "1d ago",
      timestamp: "2024-01-14 16:30",
      unread: false,
    },
  ];

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "error":
        return <AlertCircle className="size-5 text-destructive" />;
      case "warning":
        return <AlertTriangle className="size-5 text-yellow-500" />;
      default:
        return <Info className="size-5 text-primary" />;
    }
  };

  const filteredNotifications = allNotifications.filter((notification) => {
    const matchesFilter = filter === "all" || notification.type === filter;
    const matchesSearch =
      searchQuery === "" ||
      notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notification.device.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const unreadCount = allNotifications.filter((n) => n.unread).length;

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
            <p className="text-muted-foreground mt-1">
              All alerts and updates from your devices
              {unreadCount > 0 && ` • ${unreadCount} unread`}
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search notifications..."
            icon={<Search className="size-4" />}
            className="flex-1"
          />
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[180px]">
              <Filter className="mr-2 size-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="error">Errors</SelectItem>
              <SelectItem value="warning">Warnings</SelectItem>
              <SelectItem value="info">Info</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          {filteredNotifications.map((notification) => {
            const linkHref = notification.automationId
              ? `/automation/${notification.automationId}`
              : `/devices/${notification.deviceId}`;

            return (
              <Link key={notification.id} href={linkHref}>
                <Card
                  className={cn(
                    "cursor-pointer transition-all hover:shadow-md hover:border-primary/50",
                    notification.unread && "border-primary/50 bg-primary/5"
                  )}
                >
                  <CardContent className="p-5">
                    <div className="flex gap-4">
                      <div className="mt-0.5">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <p className="text-base font-semibold">
                                {notification.title}
                              </p>
                              {notification.unread && (
                                <div className="size-2 rounded-full bg-primary" />
                              )}
                            </div>
                            <p className="text-muted-foreground mt-1 text-sm">
                              {notification.message}
                            </p>
                          </div>
                          <Badge
                            variant={
                              notification.type === "error"
                                ? "destructive"
                                : notification.type === "warning"
                                ? "secondary"
                                : "default"
                            }
                          >
                            {notification.type}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-2 rounded-md bg-muted/50 p-3 text-sm">
                          <div>
                            <span className="text-muted-foreground text-xs">
                              Device
                            </span>
                            <p className="font-medium">{notification.device}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground text-xs">
                              Location
                            </span>
                            <p className="font-medium">
                              {notification.location}
                            </p>
                          </div>
                          {notification.value && (
                            <div>
                              <span className="text-muted-foreground text-xs">
                                Current Value
                              </span>
                              <p className="font-medium">
                                {notification.value}
                              </p>
                            </div>
                          )}
                          {notification.threshold && (
                            <div>
                              <span className="text-muted-foreground text-xs">
                                Threshold
                              </span>
                              <p className="font-medium">
                                {notification.threshold}
                              </p>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">
                            {notification.timestamp}
                          </span>
                          <span className="text-muted-foreground">
                            {notification.time}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        {filteredNotifications.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Info className="text-muted-foreground mb-4 size-12" />
              <p className="text-muted-foreground text-center">
                No notifications found
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
