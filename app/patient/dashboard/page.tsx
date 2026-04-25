"use client";

import Link from "next/link";
import { Scan, AlertTriangle, MessageSquare, CreditCard, Clock, Pill, Calendar, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { usePatients } from "@/context/patient-context";
import { useAuth } from "@/hooks/use-auth";

const quickActions = [
  {
    href: "/patient/scan",
    icon: Scan,
    label: "Scan Prescription",
    description: "Upload or capture prescription",
    color: "bg-primary/10 text-primary",
  },
  {
    href: "/patient/emergency",
    icon: AlertTriangle,
    label: "Emergency Help",
    description: "Get urgent guidance",
    color: "bg-destructive/10 text-destructive",
  },
  {
    href: "/patient/chat",
    icon: MessageSquare,
    label: "Ask Assistant",
    description: "Chat with AI helper",
    color: "bg-accent/10 text-accent",
  },
  {
    href: "/patient/health",
    icon: CreditCard,
    label: "My Health Card",
    description: "View your records",
    color: "bg-secondary text-secondary-foreground",
  },
];

export default function PatientDashboard() {
  const { user } = useAuth();
  const { prescriptions } = usePatients();

  const recentPrescriptions = prescriptions
    .sort((a, b) => new Date(b.scannedAt).getTime() - new Date(a.scannedAt).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="rounded-xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-6">
        <h1 className="text-2xl font-bold text-foreground">
          Welcome back, {user?.name?.split(" ")[0] || "Patient"}
        </h1>
        <p className="mt-1 text-muted-foreground">
          Manage your health records and get instant assistance
        </p>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-foreground">Quick Actions</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link key={action.href} href={action.href}>
                <Card className="h-full transition-all hover:shadow-md hover:border-primary/30">
                  <CardContent className="flex flex-col items-center p-6 text-center">
                    <div className={`mb-4 flex h-14 w-14 items-center justify-center rounded-full ${action.color}`}>
                      <Icon className="h-7 w-7" />
                    </div>
                    <h3 className="font-semibold text-foreground">{action.label}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{action.description}</p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Health Overview & Prescriptions */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Health Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Health Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg bg-muted/50 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Pill className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{prescriptions.length}</p>
                    <p className="text-sm text-muted-foreground">Prescriptions</p>
                  </div>
                </div>
              </div>
              <div className="rounded-lg bg-muted/50 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10">
                    <FileText className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">0</p>
                    <p className="text-sm text-muted-foreground">Appointments</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4 rounded-lg border border-dashed border-border p-4 text-center">
              <p className="text-sm text-muted-foreground">
                Your health records will appear here as you add them.
              </p>
              <Link href="/patient/scan">
                <Button variant="link" className="mt-2 text-primary">
                  Scan your first prescription
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Recent Prescriptions */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Recent Prescriptions
            </CardTitle>
            {prescriptions.length > 0 && (
              <Link href="/patient/scan">
                <Button variant="ghost" size="sm">View All</Button>
              </Link>
            )}
          </CardHeader>
          <CardContent>
            {recentPrescriptions.length === 0 ? (
              <div className="py-8 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                  <Pill className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground">No prescriptions yet</p>
                <Link href="/patient/scan">
                  <Button variant="outline" className="mt-4">
                    <Scan className="mr-2 h-4 w-4" />
                    Scan Prescription
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {recentPrescriptions.map((rx) => (
                  <div
                    key={rx.id}
                    className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <Pill className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{rx.drugName}</p>
                        <p className="text-sm text-muted-foreground">
                          {rx.dosage} - {rx.frequency}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge
                        variant="outline"
                        className={
                          rx.confidence >= 0.9
                            ? "bg-success/10 text-success border-success/20"
                            : "bg-warning/10 text-warning-foreground border-warning/20"
                        }
                      >
                        {Math.round(rx.confidence * 100)}%
                      </Badge>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {new Date(rx.scannedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
