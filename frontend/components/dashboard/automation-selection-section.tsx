import { Edit } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { AutomationResponseSchema } from "@/lib/api/model";

interface AutomationSelectionSectionProps {
  automations: AutomationResponseSchema[];
  selectedAutomationId: number | null;
  onAutomationChange: (automationId: number) => void;
  onEditClick: () => void;
  hasSelectedAutomation: boolean;
  timeframe: number;
  onTimeframeChange: (timeframe: number) => void;
}

export function AutomationSelectionSection({
  automations,
  selectedAutomationId,
  onAutomationChange,
  onEditClick,
  hasSelectedAutomation,
  timeframe,
  onTimeframeChange,
}: AutomationSelectionSectionProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Select Automation</CardTitle>
          {hasSelectedAutomation && (
            <Button variant="ghost" size="sm" onClick={onEditClick}>
              <Edit className="mr-2 size-4" />
              Edit Automation
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">Automation</label>
            <Select
              value={selectedAutomationId?.toString() || ""}
              onValueChange={(value) => onAutomationChange(Number(value))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {automations.map((automation) => (
                  <SelectItem
                    key={automation.id}
                    value={automation.id.toString()}
                  >
                    {automation.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Timeframe</label>
            <Select
              value={timeframe.toString()}
              onValueChange={(value) => onTimeframeChange(Number(value))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="86400">Last 24 Hours</SelectItem>
                <SelectItem value="604800">Last 7 Days</SelectItem>
                <SelectItem value="2592000">Last 30 Days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
