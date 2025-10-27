"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Activity,
  Settings,
  Bell,
  AlertCircle,
  AlertTriangle,
  Info,
  User,
  Mail,
  Phone,
  Lock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

export function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);

  const hideNav = pathname.startsWith("/auth") || pathname === "/";

  if (hideNav) {
    return null;
  }

  const links = [
    { href: "/devices", label: "Devices" },
    { href: "/automation", label: "Automation" },
  ];

  const notifications = [
    {
      id: "1",
      type: "error",
      title: "Device Offline",
      message: "Motion Detector - Entrance has been offline for 2 hours",
      device: "Motion Detector - Entrance",
      deviceId: "device-3",
      location: "Building 1, Ground Floor",
      time: "2h ago",
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
      unread: false,
    },
  ];

  const unreadCount = notifications.filter((n) => n.unread).length;

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

  const handleNotificationClick = (notification: (typeof notifications)[0]) => {
    if (notification.automationId) {
      router.push(
        `/dashboard?view=automation&automationId=${notification.automationId}`
      );
    } else if (notification.deviceId) {
      router.push(`/dashboard?view=device&deviceId=${notification.deviceId}`);
    }
  };

  return (
    <nav className="border-b bg-card/50 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="flex size-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent">
                <Activity className="size-5 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold">IoT Platform</span>
            </Link>
            <div className="flex gap-1">
              {links.map((link) => {
                const isActive =
                  pathname === link.href ||
                  pathname.startsWith(link.href + "/");
                return (
                  <Link key={link.href} href={link.href}>
                    <Button
                      variant={isActive ? "default" : "ghost"}
                      className={cn("font-medium", isActive && "shadow-sm")}
                    >
                      {link.label}
                    </Button>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="size-5" />
                  {unreadCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 flex size-5 items-center justify-center rounded-full p-0 text-xs">
                      {unreadCount}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[420px] p-0">
                <div className="flex items-center justify-between border-b px-4 py-3">
                  <h3 className="font-semibold">Notifications</h3>
                  {unreadCount > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      {unreadCount} new
                    </Badge>
                  )}
                </div>
                <ScrollArea className="h-[480px]">
                  <div className="space-y-1 p-2">
                    {notifications.map((notification) => (
                      <Card
                        key={notification.id}
                        className={cn(
                          "cursor-pointer transition-colors hover:bg-muted/50",
                          notification.unread &&
                            "border-primary/50 bg-primary/5"
                        )}
                        onClick={() => handleNotificationClick(notification)}
                      >
                        <CardContent className="p-4">
                          <div className="flex gap-3">
                            <div className="mt-0.5">
                              {getNotificationIcon(notification.type)}
                            </div>
                            <div className="flex-1 space-y-2">
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex-1">
                                  <p className="text-sm font-semibold leading-tight">
                                    {notification.title}
                                  </p>
                                  <p className="text-muted-foreground mt-1 text-xs leading-relaxed">
                                    {notification.message}
                                  </p>
                                </div>
                                {notification.unread && (
                                  <div className="mt-1 size-2 shrink-0 rounded-full bg-primary" />
                                )}
                              </div>
                              <div className="space-y-1.5 rounded-md bg-muted/50 p-2 text-xs">
                                <div className="flex items-center justify-between">
                                  <span className="text-muted-foreground">
                                    Device:
                                  </span>
                                  <span className="font-medium">
                                    {notification.device}
                                  </span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-muted-foreground">
                                    Location:
                                  </span>
                                  <span className="font-medium">
                                    {notification.location}
                                  </span>
                                </div>
                                {notification.value && (
                                  <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground">
                                      Current Value:
                                    </span>
                                    <span className="font-medium">
                                      {notification.value}
                                    </span>
                                  </div>
                                )}
                                {notification.threshold && (
                                  <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground">
                                      Threshold:
                                    </span>
                                    <span className="font-medium">
                                      {notification.threshold}
                                    </span>
                                  </div>
                                )}
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-muted-foreground text-xs">
                                  {notification.time}
                                </span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
                <div className="border-t p-2">
                  <Link href="/notifications">
                    <Button variant="ghost" className="w-full text-sm">
                      View All Notifications
                    </Button>
                  </Link>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Settings className="size-5" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-h-[80vh] max-w-2xl overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Account Settings</DialogTitle>
                  <DialogDescription>
                    Manage your account preferences and security
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-6 py-4">
                  <div className="space-y-4">
                    <h3 className="font-semibold">Profile Information</h3>
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <div className="relative">
                          <User className="text-muted-foreground absolute top-2.5 left-3 size-4" />
                          <Input
                            id="name"
                            placeholder="John Doe"
                            className="pl-9"
                            defaultValue="John Doe"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <div className="relative">
                          <Mail className="text-muted-foreground absolute top-2.5 left-3 size-4" />
                          <Input
                            id="email"
                            type="email"
                            placeholder="john@example.com"
                            className="pl-9"
                            defaultValue="john@example.com"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <div className="relative">
                          <Phone className="text-muted-foreground absolute top-2.5 left-3 size-4" />
                          <Input
                            id="phone"
                            type="tel"
                            placeholder="+1 (555) 000-0000"
                            className="pl-9"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="font-semibold">Security</h3>
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <Label htmlFor="current-password">
                          Current Password
                        </Label>
                        <div className="relative">
                          <Lock className="text-muted-foreground absolute top-2.5 left-3 size-4" />
                          <Input
                            id="current-password"
                            type="password"
                            className="pl-9"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="new-password">New Password</Label>
                        <div className="relative">
                          <Lock className="text-muted-foreground absolute top-2.5 left-3 size-4" />
                          <Input
                            id="new-password"
                            type="password"
                            className="pl-9"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="font-semibold">Notification Preferences</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label
                            htmlFor="email-notifications"
                            className="font-medium"
                          >
                            Email Notifications
                          </Label>
                          <p className="text-muted-foreground text-xs">
                            Receive alerts via email
                          </p>
                        </div>
                        <Switch
                          id="email-notifications"
                          checked={emailNotifications}
                          onCheckedChange={setEmailNotifications}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label
                            htmlFor="push-notifications"
                            className="font-medium"
                          >
                            Push Notifications
                          </Label>
                          <p className="text-muted-foreground text-xs">
                            Receive push notifications
                          </p>
                        </div>
                        <Switch
                          id="push-notifications"
                          checked={pushNotifications}
                          onCheckedChange={setPushNotifications}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label
                            htmlFor="sms-notifications"
                            className="font-medium"
                          >
                            SMS Notifications
                          </Label>
                          <p className="text-muted-foreground text-xs">
                            Receive alerts via SMS
                          </p>
                        </div>
                        <Switch
                          id="sms-notifications"
                          checked={smsNotifications}
                          onCheckedChange={setSmsNotifications}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-4">
                    <Button>Save Changes</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </nav>
  );
}
