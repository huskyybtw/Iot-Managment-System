import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { AutomationWithTriggersSchema } from "@/lib/api/model";

interface AutomationHistorySectionProps {
  automation: AutomationWithTriggersSchema;
}

export function AutomationHistorySection({
  automation,
}: AutomationHistorySectionProps) {
  // Calculate total trigger count and last triggered
  const allTriggers = automation.actions.flatMap((action) => action.triggers);
  const triggerCount = allTriggers.length;
  const lastTriggered =
    allTriggers.length > 0
      ? new Date(
          Math.max(...allTriggers.map((t) => new Date(t.timestamp).getTime()))
        ).toLocaleString()
      : "Never";

  const description = `Send notification when sensor value is ${automation.condition} ${automation.on_value}`;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{automation.name}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <Badge variant="default">Active</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid gap-2 text-sm md:grid-cols-3">
            <div>
              <span className="text-muted-foreground text-xs">Sensor ID:</span>{" "}
              <span className="font-medium">{automation.sensor_id}</span>
            </div>
            <div>
              <span className="text-muted-foreground text-xs">
                Last Triggered:
              </span>{" "}
              <span className="font-medium">{lastTriggered}</span>
            </div>
            <div>
              <span className="text-muted-foreground text-xs">
                Trigger Count:
              </span>{" "}
              <span className="font-medium">{triggerCount}</span>
            </div>
          </div>
          <Separator />
          <div>
            <p className="mb-3 text-sm font-semibold">
              Actions & Triggers ({automation.actions.length})
            </p>
            <div className="space-y-3">
              {automation.actions.map((action, idx) => (
                <div key={action.id} className="rounded-lg border p-4">
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
                          Value {automation.condition} {automation.on_value}
                        </p>
                      </div>
                      <Separator />
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground">
                          ACTION
                        </p>
                        <p className="text-sm font-medium">
                          {action.type === "email" ? "Send Email" : action.type}
                        </p>
                      </div>
                      <Separator />
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground">
                          TARGET
                        </p>
                        <p className="text-sm font-medium">{action.target}</p>
                      </div>
                      <Separator />
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground">
                          TRIGGERS ({action.triggers.length})
                        </p>
                        {action.triggers.length > 0 ? (
                          <div className="mt-2 space-y-1">
                            {action.triggers
                              .slice(0, 5)
                              .map((trigger, tidx) => (
                                <p
                                  key={tidx}
                                  className="text-xs text-muted-foreground"
                                >
                                  {new Date(trigger.timestamp).toLocaleString()}
                                </p>
                              ))}
                            {action.triggers.length > 5 && (
                              <p className="text-xs text-muted-foreground">
                                +{action.triggers.length - 5} more
                              </p>
                            )}
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground">
                            No triggers in selected timeframe
                          </p>
                        )}
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
