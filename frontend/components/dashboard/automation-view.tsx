"use client";

import { useState, useEffect } from "react";
import { EditAutomationDialog } from "@/components/automation/edit-automation-dialog";
import {
  useAutomationsAutomationGet,
  useGetAutomationAutomationIdGet,
} from "@/lib/api/automations/automations";
import type {
  AutomationResponseSchema,
  AutomationWithTriggersSchema,
} from "@/lib/api/model";
import { Loading } from "@/components/common/loading";
import { ErrorMessage } from "@/components/common/error";
import { AutomationSelectionSection } from "./automation-selection-section";
import { AutomationHistorySection } from "./automation-history-section";

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
  const [timeframe, setTimeframe] = useState<number>(2592000); // 30 days default
  const [isEditAutomationDialogOpen, setIsEditAutomationDialogOpen] =
    useState(false);

  // Fetch detailed automation with triggers
  const {
    data: automationWithTriggersData,
    isLoading: isLoadingDetails,
    error: detailsError,
  } = useGetAutomationAutomationIdGet(
    selectedAutomationId ?? 0,
    { timeframe },
    {
      query: {
        enabled: selectedAutomationId !== null,
      },
    }
  );

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

  const selectedAutomationRaw = automations.find(
    (a) => a.id === selectedAutomationId
  );

  const automationWithTriggers = automationWithTriggersData?.data;

  return (
    <>
      <AutomationSelectionSection
        automations={automations}
        selectedAutomationId={selectedAutomationId}
        onAutomationChange={setSelectedAutomationId}
        onEditClick={() => setIsEditAutomationDialogOpen(true)}
        hasSelectedAutomation={!!selectedAutomationId}
        timeframe={timeframe}
        onTimeframeChange={setTimeframe}
      />

      {isLoadingDetails && <Loading message="Loading automation details..." />}

      {detailsError && (
        <ErrorMessage message="Error loading automation details" />
      )}

      {automationWithTriggers && !isLoadingDetails && (
        <AutomationHistorySection automation={automationWithTriggers} />
      )}

      <EditAutomationDialog
        open={isEditAutomationDialogOpen}
        onOpenChange={setIsEditAutomationDialogOpen}
        automation={selectedAutomationRaw || null}
      />
    </>
  );
}
