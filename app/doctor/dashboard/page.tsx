"use client";

import Link from "next/link";
import { Users, FileEdit, AlertTriangle, Activity, Clock, TrendingUp, Calendar, Stethoscope } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";
import { usePatients } from "@/context/patient-context";
import patientsData from "@/data/patients.json";

const quickActions = [
  {
    href: "/doctor/patients",
    icon: Users,
    label: "View Patients",
    description: "Manage patient records",
    color: "bg-primary/10 text-primary",
  },
  {
    href: "/doctor/prescriptions",
    icon: FileEdit,
    label: "Write Prescription",
    description: "Create new prescription",
    color: "bg-accent/10 text-accent",
  },
  {
    href: "/doctor/emergency",
    icon: AlertTriangle,
    label: "Emergency Protocols",
    description: "View critical procedures",
    color: "bg-destructive/10 text-destructive",
  },
];

// Mock recent activity
const recentActivity = [
  { id: 1, type: "prescription", patient: "Sarah Wilson", action: "New prescription written", time: "10 mins ago" },
  { id: 2, type: "visit", patient: "Michael Chen", action: "Completed checkup", time: "1 hour ago" },
  { id: 3, type: "prescription", patient: "Emily Johnson", action: "Prescription renewed", time: "2 hours ago" },
  { id: 4, type: "visit", patient: "Robert Smith", action: "Follow-up scheduled", time: "3 hours ago" },
];

export default function DoctorDashboard() {
  const { user } = useAuth();
  const { prescriptions } = usePatients();
  const patients = patientsData.patients;

  const todayDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="rounded-xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Good {new Date().getHours() < 12 ? "Morning" : new Date().getHours() < 18 ? "Afternoon" : "Evening"}, {user?.name?.split(" ")[0] || "Doctor"}
            </h1>
            <p className="text-muted-foreground">{todayDate}</p>
          </div>
          <Badge variant="outline" className="w-fit gap-1 bg-card">
            <Activity className="h-3 w-3 text-success" />
            On Duty
          </Badge>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{patients.length}</p>
              <p className="text-sm text-muted-foreground">Total Patients</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
              <FileEdit className="h-6 w-6 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{prescriptions.length}</p>
              <p className="text-sm text-muted-foreground">Prescriptions</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-warning/10">
              <Calendar className="h-6 w-6 text-warning-foreground" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">8</p>
              <p className="text-sm text-muted-foreground">Today&apos;s Appointments</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-success/10">
              <TrendingUp className="h-6 w-6 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">24</p>
              <p className="text-sm text-muted-foreground">This Week</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-foreground">Quick Actions</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link key={action.href} href={action.href}>
                <Card className="h-full transition-all hover:shadow-md hover:border-primary/30">
                  <CardContent className="flex items-center gap-4 p-4">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${action.color}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{action.label}</h3>
                      <p className="text-sm text-muted-foreground">{action.description}</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recent Activity & Patients */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3">
                  <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                    activity.type === "prescription" ? "bg-accent/10" : "bg-primary/10"
                  }`}>
                    {activity.type === "prescription" ? (
                      <FileEdit className="h-4 w-4 text-accent" />
                    ) : (
                      <Stethoscope className="h-4 w-4 text-primary" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{activity.patient}</p>
                    <p className="text-sm text-muted-foreground">{activity.action}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Patients */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Recent Patients
            </CardTitle>
            <Link href="/doctor/patients">
              <Button variant="ghost" size="sm">View All</Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {patients.slice(0, 5).map((patient) => (
                <div
                  key={patient.id}
                  className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                      <span className="text-sm font-medium text-foreground">
                        {patient.name.split(" ").map(n => n[0]).join("")}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{patient.name}</p>
                      <p className="text-sm text-muted-foreground">{patient.conditions[0]}</p>
                    </div>
                  </div>
                  <Badge variant="outline">
                    {patient.bloodType}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
