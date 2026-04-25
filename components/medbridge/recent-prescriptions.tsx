"use client";

import { FileText, Clock, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { usePatients } from "@/context/patient-context";
import type { ViewType } from "@/lib/types";

interface RecentPrescriptionsProps {
  onNavigate: (view: ViewType) => void;
}

export function RecentPrescriptions({ onNavigate }: RecentPrescriptionsProps) {
  const { prescriptions } = usePatients();

  const recentPrescriptions = prescriptions
    .sort((a, b) => new Date(b.scannedAt).getTime() - new Date(a.scannedAt).getTime())
    .slice(0, 3);

  if (recentPrescriptions.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <FileText className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="mb-2 text-lg font-semibold text-foreground">No Prescriptions Yet</h3>
          <p className="mb-4 max-w-sm text-sm text-muted-foreground">
            Scan your first prescription to get started with medication tracking and simple explanations.
          </p>
          <Button onClick={() => onNavigate("prescription")}>Scan Prescription</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-lg">Recent Prescriptions</CardTitle>
        <Button variant="ghost" size="sm" onClick={() => onNavigate("prescription")}>
          View All
          <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
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
                  <span>•</span>
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
  );
}
