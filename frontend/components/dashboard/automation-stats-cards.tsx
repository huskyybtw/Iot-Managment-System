import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface Automation {
  id: string;
  name: string;
  device: string;
  status: string;
  description: string;
  lastTriggered: string;
  triggerCount: number;
}

interface AutomationStatsCardsProps {
  automations: Automation[];
}

export function AutomationStatsCards({
  automations,
}: AutomationStatsCardsProps) {
  const totalRules = automations.length;
  const activeRules = automations.filter((a) => a.status === "active").length;
  const totalTriggers = automations.reduce((sum, a) => sum + a.triggerCount, 0);
  const recentActivity = automations.filter(
    (a) => a.lastTriggered !== "Never"
  ).length;

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card>
        <CardHeader className="pb-3">
          <CardDescription>Total Rules</CardDescription>
          <CardTitle className="text-3xl">{totalRules}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-xs">Configured rules</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardDescription>Active Rules</CardDescription>
          <CardTitle className="text-3xl text-primary">{activeRules}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-xs">Currently monitoring</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardDescription>Total Triggers</CardDescription>
          <CardTitle className="text-3xl text-accent">
            {totalTriggers}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-xs">Actions executed</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardDescription>Recent Activity</CardDescription>
          <CardTitle className="text-3xl">{recentActivity}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-xs">Recently triggered</p>
        </CardContent>
      </Card>
    </div>
  );
}
