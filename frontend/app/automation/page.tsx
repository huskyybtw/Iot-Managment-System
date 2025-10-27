"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Plus,
  Zap,
  Bell,
  Power,
  Mail,
  Edit,
  Trash2,
  Search,
  Filter,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EditAutomationDialog } from "@/components/automation/edit-automation-dialog";
import { AddAutomationDialog } from "@/components/automation/add-automation-dialog";
import { set } from "react-hook-form";
export default function AutomationPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedAutomation, setSelectedAutomation] = useState<any>(null);
  type AutomationRule = {
    id: string;
    name: string;
    description: string;
    device: string;
    location: string;
    enabled: boolean;
    action: {
      type: string;
      method: string;
      target: string;
    };
    trigger: {
      condition: string;
      value: string;
      unit: string;
    };
    lastTriggered: string;
    triggerCount: number;
    createdAt: string;
  };

  const [rules, setRules] = useState<AutomationRule[]>([
    {
      id: "1",
      name: "Turn on fan when hot",
      description: "Turns on the fan when temperature exceeds 30°C",
      device: "Fan",
      location: "Lab A",
      enabled: true,
      action: { type: "device_control", method: "turn_on", target: "Fan" },
      trigger: { condition: "temperature_above", value: "30", unit: "°C" },
      lastTriggered: "2025-10-27 10:00",
      triggerCount: 5,
      createdAt: "2025-10-20",
    },
  ]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const toggleRule = (id: string) => {};

  const deleteRule = (id: string) => {};

  const getActionIcon = (type: string) => {
    switch (type) {
      case "notification":
        return Bell;
      case "device_control":
        return Power;
      case "email":
        return Mail;
      default:
        return Zap;
    }
  };

  const filteredRules = rules.filter((rule) => {
    const matchesSearch = rule.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesFilter =
      filterStatus === "all" ||
      (filterStatus === "active" && rule.enabled) ||
      (filterStatus === "inactive" && !rule.enabled);
    return matchesSearch && matchesFilter;
  });

  const router = useRouter();

  const handleEdit = (rule: any, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedAutomation(rule);
    setIsEditDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Automation Rules
            </h1>
            <p className="text-muted-foreground mt-1">
              Create and manage automated actions for your IoT devices
            </p>
          </div>
          <Button size="lg" onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="mr-2 size-4" />
            Create Rule
          </Button>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <Search className="text-muted-foreground absolute top-2.5 left-3 size-4" />
                <Input
                  placeholder="Search automation rules..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="text-muted-foreground size-4" />
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Rules</SelectItem>
                    <SelectItem value="active">Active Only</SelectItem>
                    <SelectItem value="inactive">Inactive Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {filteredRules.map((rule) => {
            const ActionIcon = getActionIcon(rule.action.type);
            return (
              <Card
                key={rule.id}
                className="cursor-pointer transition-all hover:border-primary/50"
                onClick={() =>
                  router.push(
                    `/dashboard?view=automation&automationId=${rule.id}`
                  )
                }
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-3">
                        <CardTitle className="text-lg">{rule.name}</CardTitle>
                        <Badge variant={rule.enabled ? "default" : "secondary"}>
                          {rule.enabled ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      <CardDescription>{rule.description}</CardDescription>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>Device: {rule.device}</span>
                        <span>•</span>
                        <span>Location: {rule.location}</span>
                      </div>
                    </div>
                    <Switch
                      checked={rule.enabled}
                      onCheckedChange={() => toggleRule(rule.id)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2 rounded-lg border bg-muted/30 p-4">
                        <div className="flex items-center gap-2">
                          <Zap className="size-4 text-primary" />
                          <span className="text-sm font-semibold">
                            Trigger Condition
                          </span>
                        </div>
                        <div className="space-y-1.5 text-sm">
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">
                              Device:
                            </span>
                            <span className="font-medium">{rule.device}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">
                              Condition:
                            </span>
                            <span className="font-medium capitalize">
                              {rule.trigger.condition.replace("_", " ")}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">
                              Threshold:
                            </span>
                            <span className="font-medium">
                              {rule.trigger.value}
                              {rule.trigger.unit}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2 rounded-lg border bg-muted/30 p-4">
                        <div className="flex items-center gap-2">
                          <ActionIcon className="size-4 text-accent" />
                          <span className="text-sm font-semibold">Action</span>
                        </div>
                        <div className="space-y-1.5 text-sm">
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Type:</span>
                            <span className="font-medium capitalize">
                              {rule.action.type.replace("_", " ")}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">
                              Method:
                            </span>
                            <span className="font-medium">
                              {rule.action.method}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">
                              Target:
                            </span>
                            <span className="font-medium">
                              {rule.action.target}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-t pt-4">
                      <div className="flex gap-6 text-sm">
                        <div>
                          <span className="text-muted-foreground">
                            Last triggered:{" "}
                          </span>
                          <span className="font-medium">
                            {rule.lastTriggered}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">
                            Trigger count:{" "}
                          </span>
                          <span className="font-medium">
                            {rule.triggerCount}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">
                            Created:{" "}
                          </span>
                          <span className="font-medium">{rule.createdAt}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => handleEdit(rule, e)}
                        >
                          <Edit className="size-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteRule(rule.id);
                          }}
                        >
                          <Trash2 className="size-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredRules.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-muted-foreground text-center">
                No automation rules found matching your criteria
              </p>
              <Link href="/automation/add">
                <Button className="mt-4">
                  <Plus className="mr-2 size-4" />
                  Create Your First Rule
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>

      <EditAutomationDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        automation={selectedAutomation}
      />
      <AddAutomationDialog
        isOpen={isAddDialogOpen}
        setIsOpen={setIsAddDialogOpen}
      />
    </div>
  );
}
