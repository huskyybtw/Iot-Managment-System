"use client";

import { useState } from "react";
import { EditAutomationDialog } from "@/components/automation/edit-automation-dialog";
import { AutomationStatsCards } from "./automation-stats-cards";
import { AutomationSelectionSection } from "./automation-selection-section";
import { AutomationHistorySection } from "./automation-history-section";

interface Trigger {
  condition: string;
  action: string;
  target: string;
}

interface Automation {
  id: string;
  name: string;
  device: string;
  status: string;
  description: string;
  triggers: Trigger[];
  lastTriggered: string;
  triggerCount: number;
}

interface AutomationViewProps {
  initialAutomationId?: string;
}

export function AutomationView({
  initialAutomationId = "auto-1",
}: AutomationViewProps) {
  const [selectedAutomationId, setSelectedAutomationId] =
    useState(initialAutomationId);
  const [isEditAutomationDialogOpen, setIsEditAutomationDialogOpen] =
    useState(false);

  const automations: Automation[] = [
    {
      id: "auto-1",
      name: "High Temperature Alert",
      device: "Temperature Sensor - Lab A",
      status: "active",
      description: "Send email when temperature exceeds 25°C",
      triggers: [
        {
          condition: "Temperature > 25°C",
          action: "Send Email",
          target: "admin@company.com",
        },
        {
          condition: "Temperature > 30°C",
          action: "Send SMS",
          target: "+1234567890",
        },
      ],
      lastTriggered: "2 hours ago",
      triggerCount: 3,
    },
    {
      id: "auto-2",
      name: "Power Overload Protection",
      device: "Power Monitor - Server Room",
      status: "active",
      description: "Alert when power consumption is too high",
      triggers: [
        {
          condition: "Power > 250W",
          action: "Send Email",
          target: "admin@company.com",
        },
      ],
      lastTriggered: "15 min ago",
      triggerCount: 1,
    },
  ];

  const selectedAutomation = automations.find(
    (a) => a.id === selectedAutomationId
  );

  return (
    <>
      <AutomationStatsCards automations={automations} />

      <AutomationSelectionSection
        automations={automations}
        selectedAutomationId={selectedAutomationId}
        onAutomationChange={setSelectedAutomationId}
        onEditClick={() => setIsEditAutomationDialogOpen(true)}
        hasSelectedAutomation={!!selectedAutomation}
      />

      {selectedAutomation && (
        <AutomationHistorySection automation={selectedAutomation} />
      )}

      <EditAutomationDialog
        open={isEditAutomationDialogOpen}
        onOpenChange={setIsEditAutomationDialogOpen}
        automation={selectedAutomation}
      />
    </>
  );
}
