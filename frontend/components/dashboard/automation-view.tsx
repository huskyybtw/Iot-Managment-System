"use client";

import { useState, useEffect } from "react";
import { EditAutomationDialog } from "@/components/automation/edit-automation-dialog";
import { useAutomationsAutomationGet } from "@/lib/api/automations/automations";
import type { AutomationResponseSchema } from "@/lib/api/model";
import { Loading } from "@/components/common/loading";
import { ErrorMessage } from "@/components/common/error";
import { AutomationStatsCards } from "./automation-stats-cards";
import { AutomationSelectionSection } from "./automation-selection-section";
import { AutomationHistorySection } from "./automation-history-section";

interface Trigger {
  condition: string;
  action: string;
  target: string;
}

interface AutomationWithTriggers extends AutomationResponseSchema {
  device?: string;
  status?: string;
  description?: string;
  triggers: Trigger[];
  lastTriggered?: string;
  triggerCount?: number;
}

interface AutomationViewProps {
  initialAutomationId?: number;
}

export function AutomationView({ initialAutomationId }: AutomationViewProps) {
  const {
    data: automationsData,
    isLoading,
    error,
  } = useAutomationsAutomationGet();
  const automations = automationsData?.data ?? [];

  const [selectedAutomationId, setSelectedAutomationId] = useState<
    number | null
  >(null);
  const [isEditAutomationDialogOpen, setIsEditAutomationDialogOpen] =
    useState(false);

  // Set initial automation when data loads
  useEffect(() => {
    if (automations.length > 0 && selectedAutomationId === null) {
      const automationId = initialAutomationId || automations[0].id;
      setSelectedAutomationId(automationId);
    }
  }, [automations, initialAutomationId, selectedAutomationId]);

  if (isLoading) {
    return <Loading message="Loading automations..." />;
  }

  if (error) {
    return <ErrorMessage message="Error loading automations" />;
  }

  if (automations.length === 0) {
    return <ErrorMessage message="No automations found" />;
  }

  // Enrich automations with UI-specific data
  const enrichedAutomations: AutomationWithTriggers[] = automations.map(
    (automation) => ({
      ...automation,
      device: `Sensor ${automation.sensor_id}`, // Could fetch sensor details later
      status: "active", // Could be added to API later
      description: `Send notification when sensor value is ${automation.condition} ${automation.on_value}`,
      triggers: automation.actions.map((action) => ({
        condition: `Value ${automation.condition} ${automation.on_value}`,
        action: action.type === "email" ? "Send Email" : action.type,
        target: action.target,
      })),
      lastTriggered: "Unknown", // Would need trigger history from API
      triggerCount: 0, // Would need trigger history from API
    })
  );

  const selectedAutomation = enrichedAutomations.find(
    (a) => a.id === selectedAutomationId
  );

  const selectedAutomationRaw = automations.find(
    (a) => a.id === selectedAutomationId
  );

  return (
    <>
      <AutomationSelectionSection
        automations={enrichedAutomations}
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
        automation={selectedAutomationRaw || null}
      />
    </>
  );
}
