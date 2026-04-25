"use client";

import { useState, useCallback } from "react";
import { Upload, FileImage, Check, AlertCircle, Sparkles, Save, ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { usePatients } from "@/context/patient-context";
import { simulateOCR, simplifyMedicalText } from "@/lib/ai-agents";
import type { Prescription, ViewType } from "@/lib/types";

interface PrescriptionScannerProps {
  onNavigate: (view: ViewType) => void;
}

type ScanState = "idle" | "uploading" | "processing" | "complete";

export function PrescriptionScanner({ onNavigate }: PrescriptionScannerProps) {
  const { selectedPatient, addPrescription, prescriptions, getPrescriptionsForPatient } = usePatients();
  const [scanState, setScanState] = useState<ScanState>("idle");
  const [progress, setProgress] = useState(0);
  const [currentPrescription, setCurrentPrescription] = useState<Prescription | null>(null);
  const [showSimplified, setShowSimplified] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleScan = useCallback(() => {
    setScanState("uploading");
    setProgress(0);

    // Simulate upload
    const uploadInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 40) {
          clearInterval(uploadInterval);
          setScanState("processing");
          return prev;
        }
        return prev + 10;
      });
    }, 100);

    // Simulate processing
    setTimeout(() => {
      const processInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(processInterval);
            setScanState("complete");

            // Generate mock prescription
            const ocrResult = simulateOCR();
            const prescription: Prescription = {
              id: `RX-${Date.now()}`,
              patientId: selectedPatient?.id || "unknown",
              ...ocrResult,
              scannedAt: new Date().toISOString(),
            };
            setCurrentPrescription(prescription);
            return 100;
          }
          return prev + 5;
        });
      }, 50);
    }, 500);
  }, [selectedPatient]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleScan();
  };

  const handleSavePrescription = () => {
    if (currentPrescription) {
      const simplified = simplifyMedicalText(currentPrescription);
      addPrescription({ ...currentPrescription, simplifiedExplanation: simplified });
      resetScanner();
    }
  };

  const resetScanner = () => {
    setScanState("idle");
    setProgress(0);
    setCurrentPrescription(null);
    setShowSimplified(false);
  };

  const patientPrescriptions = selectedPatient
    ? getPrescriptionsForPatient(selectedPatient.id)
    : prescriptions;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => onNavigate("dashboard")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Prescription Scanner</h1>
          <p className="text-muted-foreground">
            Upload a prescription image to extract and understand medication details
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Upload Area */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Upload Prescription
            </CardTitle>
          </CardHeader>
          <CardContent>
            {scanState === "idle" && (
              <div
                className={`relative rounded-xl border-2 border-dashed p-8 text-center transition-colors ${
                  dragActive
                    ? "border-primary bg-primary/5"
                    : "border-muted-foreground/25 hover:border-primary/50"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <div className="mb-4 flex justify-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    <FileImage className="h-8 w-8 text-primary" />
                  </div>
                </div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">
                  Drop prescription image here
                </h3>
                <p className="mb-4 text-sm text-muted-foreground">
                  or click to browse your files
                </p>
                <Button onClick={handleScan}>Select Image</Button>
                <p className="mt-4 text-xs text-muted-foreground">
                  Supports JPG, PNG, PDF up to 10MB
                </p>
              </div>
            )}

            {(scanState === "uploading" || scanState === "processing") && (
              <div className="space-y-6 py-8 text-center">
                <div className="flex justify-center">
                  <div className="relative">
                    <div className="h-20 w-20 animate-pulse rounded-full bg-primary/20" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <FileImage className="h-8 w-8 text-primary" />
                    </div>
                  </div>
                </div>
                <div>
                  <p className="mb-2 font-medium text-foreground">
                    {scanState === "uploading" ? "Uploading..." : "Analyzing prescription..."}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {scanState === "uploading"
                      ? "Please wait while we upload your image"
                      : "Our AI is extracting medication details"}
                  </p>
                </div>
                <Progress value={progress} className="mx-auto max-w-xs" />
              </div>
            )}

            {scanState === "complete" && currentPrescription && (
              <div className="space-y-4">
                <div className="flex items-center justify-center gap-2 text-success">
                  <Check className="h-5 w-5" />
                  <span className="font-medium">Scan Complete</span>
                </div>

                {/* Extracted Data */}
                <div className="space-y-3 rounded-lg bg-muted/50 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Drug Name</span>
                    <span className="font-medium text-foreground">{currentPrescription.drugName}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Dosage</span>
                    <span className="font-medium text-foreground">{currentPrescription.dosage}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Frequency</span>
                    <span className="font-medium text-foreground">{currentPrescription.frequency}</span>
                  </div>
                  <div className="border-t pt-3">
                    <span className="text-sm text-muted-foreground">Instructions</span>
                    <p className="mt-1 text-sm font-medium text-foreground">
                      {currentPrescription.instructions}
                    </p>
                  </div>
                  <div className="flex items-center justify-between border-t pt-3">
                    <span className="text-sm text-muted-foreground">Confidence Score</span>
                    <Badge
                      className={
                        currentPrescription.confidence >= 0.9
                          ? "bg-success text-success-foreground"
                          : currentPrescription.confidence >= 0.8
                          ? "bg-warning text-warning-foreground"
                          : "bg-destructive text-destructive-foreground"
                      }
                    >
                      {Math.round(currentPrescription.confidence * 100)}%
                    </Badge>
                  </div>
                </div>

                {/* Simplified Explanation */}
                {!showSimplified ? (
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setShowSimplified(true)}
                  >
                    <Sparkles className="mr-2 h-4 w-4" />
                    Explain Simply
                  </Button>
                ) : (
                  <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
                    <div className="mb-2 flex items-center gap-2 text-primary">
                      <Sparkles className="h-4 w-4" />
                      <span className="text-sm font-medium">Simple Explanation</span>
                    </div>
                    <p className="text-sm leading-relaxed text-foreground">
                      {simplifyMedicalText(currentPrescription)}
                    </p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1" onClick={resetScanner}>
                    Scan Another
                  </Button>
                  <Button className="flex-1" onClick={handleSavePrescription}>
                    <Save className="mr-2 h-4 w-4" />
                    Save to Record
                  </Button>
                </div>

                {!selectedPatient && (
                  <div className="flex items-start gap-2 rounded-lg bg-warning/10 p-3 text-sm">
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-warning-foreground" />
                    <p className="text-warning-foreground">
                      No patient selected. Select a patient from Health Card to save prescriptions to
                      their record.
                    </p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Saved Prescriptions */}
        <Card>
          <CardHeader>
            <CardTitle>
              {selectedPatient
                ? `${selectedPatient.name}'s Prescriptions`
                : "All Scanned Prescriptions"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {patientPrescriptions.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-muted-foreground">No prescriptions scanned yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {patientPrescriptions.map((rx) => (
                  <div
                    key={rx.id}
                    className="rounded-lg border p-3 transition-colors hover:bg-muted/50"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-foreground">{rx.drugName}</p>
                        <p className="text-sm text-muted-foreground">
                          {rx.dosage} - {rx.frequency}
                        </p>
                      </div>
                      <Badge
                        variant="outline"
                        className={
                          rx.confidence >= 0.9
                            ? "bg-success/10 text-success"
                            : "bg-warning/10 text-warning-foreground"
                        }
                      >
                        {Math.round(rx.confidence * 100)}%
                      </Badge>
                    </div>
                    {rx.simplifiedExplanation && (
                      <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                        {rx.simplifiedExplanation}
                      </p>
                    )}
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
