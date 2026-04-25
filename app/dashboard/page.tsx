"use client";

import Link from "next/link";
import { Scan, AlertTriangle, MessageCircle, CreditCard, ChevronRight, User, Calendar, Stethoscope, Pill, FileText, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AppLayout } from "@/components/app-layout";
import { usePatients } from "@/context/patient-context";

const quickActions = [
  {
    href: "/scan",
    icon: Scan,
    label: "Scan Prescription",
    description: "Upload and analyze prescriptions",
    color: "bg-primary/10 text-primary hover:bg-primary/20",
    iconBg: "bg-primary",
  },
  {
    href: "/emergency",
    icon: AlertTriangle,
    label: "Emergency Help",
    description: "Get guided emergency support",
    color: "bg-destructive/10 text-destructive hover:bg-destructive/20",
    iconBg: "bg-destructive",
  },
  {
    href: "/chat",
    icon: MessageCircle,
    label: "Ask Assistant",
    description: "Chat with AI health assistant",
    color: "bg-accent/20 text-accent-foreground hover:bg-accent/30",
    iconBg: "bg-accent",
  },
  {
    href: "/health",
    icon: CreditCard,
    label: "Health Card",
    description: "View patient health records",
    color: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    iconBg: "bg-foreground",
  },
];

function DashboardContent() {
  const { selectedPatient, prescriptions, getPrescriptionsForPatient } = usePatients();
  
  const patientPrescriptions = selectedPatient
    ? getPrescriptionsForPatient(selectedPatient.id)
    : [];

  const recentPrescriptions = prescriptions
    .sort((a, b) => new Date(b.scannedAt).getTime() - new Date(a.scannedAt).getTime())
    .slice(0, 3);

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="text-center">
        <h1 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Welcome to Medbridge
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-pretty text-muted-foreground">
          Your AI-powered healthcare assistant. Understand prescriptions, get emergency guidance, and manage health records with ease.
        </p>
      </div>

      {/* Quick Actions */}
      <section>
        <h2 className="mb-4 text-lg font-semibold text-foreground">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {quickActions.map((action) => (
            <Link key={action.href} href={action.href}>
              <Card
                className={`group cursor-pointer p-4 transition-all duration-200 hover:shadow-lg ${action.color}`}
              >
                <div className="flex flex-col items-center gap-3 text-center sm:flex-row sm:text-left">
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${action.iconBg} transition-transform group-hover:scale-110`}
                  >
                    <action.icon className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-foreground">{action.label}</h3>
                    <p className="text-sm text-muted-foreground">{action.description}</p>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Two Column Layout */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Patient Summary */}
        <section>
          {!selectedPatient ? (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                  <User className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">No Patient Selected</h3>
                <p className="mb-4 max-w-sm text-sm text-muted-foreground">
                  Select a patient from the Health Card section to view their summary and personalized recommendations.
                </p>
                <Link href="/health">
                  <Button>Select Patient</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">Patient Summary</CardTitle>
                  <Badge variant="outline" className="bg-success/10 text-success">
                    Active
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                    <User className="h-7 w-7 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">{selectedPatient.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {selectedPatient.age} years old, {selectedPatient.gender}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg bg-muted/50 p-3">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Stethoscope className="h-4 w-4" />
                      <span className="text-xs font-medium">Condition</span>
                    </div>
                    <p className="mt-1 text-sm font-semibold text-foreground">{selectedPatient.condition}</p>
                  </div>
                  <div className="rounded-lg bg-muted/50 p-3">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span className="text-xs font-medium">Last Visit</span>
                    </div>
                    <p className="mt-1 text-sm font-semibold text-foreground">
                      {new Date(selectedPatient.lastVisit).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div>
                  <div className="mb-2 flex items-center gap-2 text-muted-foreground">
                    <Pill className="h-4 w-4" />
                    <span className="text-xs font-medium">Current Medications</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedPatient.medications.map((med, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {med}
                      </Badge>
                    ))}
                  </div>
                </div>
                {patientPrescriptions.length > 0 && (
                  <div className="border-t pt-4">
                    <p className="text-sm text-muted-foreground">
                      {patientPrescriptions.length} prescription(s) scanned
                    </p>
                  </div>
                )}
                <div className="flex gap-2 pt-2">
                  <Link href="/health" className="flex-1">
                    <Button variant="outline" size="sm" className="w-full">
                      View Full Record
                    </Button>
                  </Link>
                  <Link href="/chat" className="flex-1">
                    <Button size="sm" className="w-full">
                      Ask About Patient
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}
        </section>

        {/* Recent Prescriptions */}
        <section>
          {recentPrescriptions.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                  <FileText className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">No Prescriptions Yet</h3>
                <p className="mb-4 max-w-sm text-sm text-muted-foreground">
                  Scan your first prescription to get started with medication tracking and simple explanations.
                </p>
                <Link href="/scan">
                  <Button>Scan Prescription</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <CardTitle className="text-lg">Recent Prescriptions</CardTitle>
                <Link href="/scan">
                  <Button variant="ghost" size="sm">
                    View All
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentPrescriptions.map((prescription) => (
                  <div
                    key={prescription.id}
                    className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{prescription.drugName}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{prescription.dosage}</span>
                          <span>-</span>
                          <span>{prescription.frequency}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <Badge
                        variant="outline"
                        className={
                          prescription.confidence >= 0.9
                            ? "bg-success/10 text-success"
                            : prescription.confidence >= 0.8
                            ? "bg-warning/10 text-warning-foreground"
                            : "bg-destructive/10 text-destructive"
                        }
                      >
                        {Math.round(prescription.confidence * 100)}% match
                      </Badge>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {new Date(prescription.scannedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </section>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <AppLayout>
      <DashboardContent />
    </AppLayout>
  );
}
