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

interface Automation {
  id: number;
  name: string;
  device?: string;
  status?: string;
  description?: string;
  lastTriggered?: string;
  triggerCount?: number;
}

interface AutomationSelectionSectionProps {
  automations: Automation[];
  selectedAutomationId: number | null;
  onAutomationChange: (automationId: number) => void;
  onEditClick: () => void;
  hasSelectedAutomation: boolean;
}

export function AutomationSelectionSection({
  automations,
  selectedAutomationId,
  onAutomationChange,
  onEditClick,
  hasSelectedAutomation,
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
      <CardContent>
        <Select
          value={selectedAutomationId?.toString() || ""}
          onValueChange={(value) => onAutomationChange(Number(value))}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {automations.map((automation) => (
              <SelectItem key={automation.id} value={automation.id.toString()}>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={
                      automation.status === "active" ? "default" : "secondary"
                    }
                    className="text-xs"
                  >
                    {automation.status || "inactive"}
                  </Badge>
                  <span>{automation.name}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  );
}
