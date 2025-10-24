import Link from "next/link";
import {
  ArrowRight,
  Cpu,
  BarChart3,
  Bell,
  Activity,
  Gauge,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function WelcomePage() {
  const features = [
    {
      icon: Cpu,
      title: "Device Management",
      description:
        "Register and manage ESP32 devices. Monitor device status, sensors, and connectivity in real-time.",
    },
    {
      icon: Gauge,
      title: "Sensor Monitoring",
      description:
        "Track sensor data with interactive charts. Filter by timeframe and export data to Excel.",
    },
    {
      icon: Bell,
      title: "Automation Rules",
      description:
        "Create triggers based on sensor values. Get email or SMS notifications when conditions are met.",
    },
    {
      icon: BarChart3,
      title: "Data Visualization",
      description:
        "View sensor trends with customizable graphs. Analyze min, max, and average values over time.",
    },
    {
      icon: Activity,
      title: "Real-time Updates",
      description:
        "Monitor device activity and sensor readings as they happen. Stay informed with live notifications.",
    },
    {
      icon: Settings,
      title: "Easy Configuration",
      description:
        "Configure devices and sensors through intuitive interfaces. Edit automation rules on the fly.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background" />
        <div className="relative mx-auto max-w-7xl px-6 py-16">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-balance text-5xl font-bold tracking-tight sm:text-6xl">
              Universal IoT Management Platform
            </h1>
            <p className="text-pretty mt-6 text-lg leading-8 text-muted-foreground">
              Connect, monitor, and control your ESP32 devices from a single
              powerful dashboard. Built for technicians and businesses who need
              reliable IoT solutions.
            </p>
            <div className="mt-8 flex items-center justify-center gap-3">
              <Button asChild size="lg" className="gap-2">
                <Link href="/auth">
                  Get Started <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/auth">Sign In</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Everything you need to manage IoT devices
          </h2>
          <p className="mt-3 text-lg text-muted-foreground">
            A complete platform designed for industrial and commercial IoT
            applications
          </p>
        </div>
        <div className="mx-auto mt-8 grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card key={feature.title}>
                <CardHeader>
                  <div className="mb-2 flex size-12 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="size-6 text-primary" />
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
