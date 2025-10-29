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
import { EditAutomationDialog } from "@/components/automation/edit-automation-dialog";
import { AddAutomationDialog } from "@/components/automation/add-automation-dialog";
import { DeleteAutomationDialog } from "@/components/automation/delete-automation-dialog";
import { useAutomationsAutomationGet } from "@/lib/api/automations/automations";
import type { AutomationResponseSchema } from "@/lib/api/model";
import { Loading } from "@/components/common/loading";
import { ErrorMessage } from "@/components/common/error";
import { SearchBar } from "@/components/common/search-bar";

export default function AutomationPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedAutomation, setSelectedAutomation] =
    useState<AutomationResponseSchema | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [automationToDelete, setAutomationToDelete] =
    useState<AutomationResponseSchema | null>(null);
  const [expandedActions, setExpandedActions] = useState<
    Record<number, boolean>
  >({});

  const { data, isLoading, error } = useAutomationsAutomationGet({
    search: searchQuery || undefined,
  });
  const automations = data?.data ?? [];

  const router = useRouter();

  const toggleActions = (automationId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedActions((prev) => ({
      ...prev,
      [automationId]: !prev[automationId],
    }));
  };

  const handleDelete = (
    automation: AutomationResponseSchema,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    setAutomationToDelete(automation);
    setIsDeleteDialogOpen(true);
  };

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

  const handleEdit = (
    automation: AutomationResponseSchema,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    setSelectedAutomation(automation);
    setIsEditDialogOpen(true);
  };

  if (isLoading) {
    return <Loading message="Loading automations..." />;
  }

  if (error) {
    return <ErrorMessage message="Error loading automations" />;
  }

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
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search automation rules..."
              icon={<Search className="size-4" />}
            />
          </CardContent>
        </Card>

        <div className="space-y-4">
          {automations.map((automation) => {
            const ActionIcon = getActionIcon(automation.actions[0]?.type || "");
            return (
              <Card
                key={automation.id}
                className="cursor-pointer transition-all hover:border-primary/50"
                onClick={() =>
                  router.push(
                    `/dashboard?view=automation&automationId=${automation.id}`
                  )
                }
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-2">
                      <CardTitle className="text-lg">
                        {automation.name}
                      </CardTitle>
                      <CardDescription>
                        Trigger when sensor value is {automation.condition}{" "}
                        {automation.on_value}
                      </CardDescription>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>Sensor ID: {automation.sensor_id}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => handleEdit(automation, e)}
                      >
                        <Edit className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => handleDelete(automation, e)}
                      >
                        <Trash2 className="size-4 text-destructive" />
                      </Button>
                    </div>
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
                              Sensor ID:
                            </span>
                            <span className="font-medium">
                              {automation.sensor_id}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">
                              Condition:
                            </span>
                            <span className="font-medium capitalize">
                              {automation.condition}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">
                              Threshold:
                            </span>
                            <span className="font-medium">
                              {automation.on_value}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2 rounded-lg border bg-muted/30 p-4">
                        <div className="flex items-center gap-2">
                          <ActionIcon className="size-4 text-accent" />
                          <span className="text-sm font-semibold">
                            Actions ({automation.actions.length})
                          </span>
                        </div>
                        <div className="space-y-3 text-sm">
                          {/* Show only first action or all if expanded */}
                          {(expandedActions[automation.id]
                            ? automation.actions
                            : automation.actions.slice(0, 1)
                          ).map((action, idx) => (
                            <div
                              key={idx}
                              className={`space-y-1.5 ${
                                idx > 0 ? "border-t pt-3" : ""
                              }`}
                            >
                              <div className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-primary">
                                <span>Action {idx + 1}</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">
                                  Type:
                                </span>
                                <span className="font-medium capitalize">
                                  {action.type}
                                </span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">
                                  Target:
                                </span>
                                <span className="font-medium truncate max-w-[200px]">
                                  {action.target}
                                </span>
                              </div>
                              {action.value && (
                                <div className="flex items-center justify-between">
                                  <span className="text-muted-foreground">
                                    Value:
                                  </span>
                                  <span className="font-medium truncate max-w-[200px]">
                                    {action.value}
                                  </span>
                                </div>
                              )}
                            </div>
                          ))}

                          {/* Show expand/collapse button if more than 1 action */}
                          {automation.actions.length > 1 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 text-xs w-full"
                              onClick={(e) => toggleActions(automation.id, e)}
                            >
                              {expandedActions[automation.id]
                                ? `Hide ${
                                    automation.actions.length - 1
                                  } action${
                                    automation.actions.length - 1 > 1 ? "s" : ""
                                  }`
                                : `Show ${
                                    automation.actions.length - 1
                                  } more action${
                                    automation.actions.length - 1 > 1 ? "s" : ""
                                  }`}
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
        {automations.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-muted-foreground text-center">
                No automation rules found matching your criteria
              </p>
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
      <DeleteAutomationDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        automation={automationToDelete}
      />
    </div>
  );
}
