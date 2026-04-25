"use client";

import { User, Calendar, Stethoscope, Pill } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { usePatients } from "@/context/patient-context";
import type { ViewType } from "@/lib/types";

interface PatientSummaryProps {
  onNavigate: (view: ViewType) => void;
}

export function PatientSummary({ onNavigate }: PatientSummaryProps) {
  const { selectedPatient, prescriptions, getPrescriptionsForPatient } = usePatients();

  if (!selectedPatient) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <User className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="mb-2 text-lg font-semibold text-foreground">No Patient Selected</h3>
          <p className="mb-4 max-w-sm text-sm text-muted-foreground">
            Select a patient from the Health Card section to view their summary and personalized recommendations.
          </p>
          <Button onClick={() => onNavigate("health-card")}>Select Patient</Button>
        </CardContent>
      </Card>
    );
  }

  const patientPrescriptions = getPrescriptionsForPatient(selectedPatient.id);

  return (
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
        {/* Patient Info */}
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

        {/* Quick Stats */}
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

        {/* Medications */}
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

        {/* Recent Prescriptions */}
        {patientPrescriptions.length > 0 && (
          <div className="border-t pt-4">
            <p className="text-sm text-muted-foreground">
              {patientPrescriptions.length} prescription(s) scanned
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => onNavigate("health-card")}
          >
            View Full Record
          </Button>
          <Button size="sm" className="flex-1" onClick={() => onNavigate("chat")}>
            Ask About Patient
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
