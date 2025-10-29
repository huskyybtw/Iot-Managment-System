import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface Trigger {
  condition: string;
  action: string;
  target: string;
}

interface Automation {
  id: number;
  name: string;
  device?: string;
  status?: string;
  description?: string;
  triggers: Trigger[];
  lastTriggered?: string;
  triggerCount?: number;
}

interface AutomationHistorySectionProps {
  automation: Automation;
}

export function AutomationHistorySection({
  automation,
}: AutomationHistorySectionProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{automation.name}</CardTitle>
            <CardDescription>
              {automation.description || "No description"}
            </CardDescription>
          </div>
          <Badge
            variant={automation.status === "active" ? "default" : "secondary"}
          >
            {automation.status || "inactive"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid gap-2 text-sm md:grid-cols-3">
            <div>
              <span className="text-muted-foreground text-xs">Device:</span>{" "}
              <span className="font-medium">
                {automation.device || "Unknown"}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground text-xs">
                Last Triggered:
              </span>{" "}
              <span className="font-medium">
                {automation.lastTriggered || "Never"}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground text-xs">
                Trigger Count:
              </span>{" "}
              <span className="font-medium">
                {automation.triggerCount || 0}
              </span>
            </div>
          </div>
          <Separator />
          <div>
            <p className="mb-3 text-sm font-semibold">
              Triggers & Actions ({automation.triggers.length})
            </p>
            <div className="space-y-3">
              {automation.triggers.map((trigger, idx) => (
                <div key={idx} className="rounded-lg border p-4">
                  <div className="flex items-start gap-4">
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <span className="text-sm font-bold text-primary">
                        {idx + 1}
                      </span>
                    </div>
                    <div className="flex-1 space-y-2">
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground">
                          CONDITION
                        </p>
                        <p className="text-sm font-medium">
                          {trigger.condition}
                        </p>
                      </div>
                      <Separator />
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground">
                          ACTION
                        </p>
                        <p className="text-sm font-medium">{trigger.action}</p>
                      </div>
                      <Separator />
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground">
                          TARGET
                        </p>
                        <p className="text-sm font-medium">{trigger.target}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
