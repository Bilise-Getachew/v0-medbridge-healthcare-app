"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { 
  Upload, 
  Camera, 
  FileImage, 
  Check, 
  AlertCircle, 
  Sparkles, 
  Save, 
  RotateCcw,
  Loader2,
  X,
  Clock
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AppLayout } from "@/components/app-layout";
import { usePatients } from "@/context/patient-context";
import { processImage, simplifyPrescription, createPrescription, type OCRResult } from "@/lib/ocr";

type ScanState = "idle" | "camera" | "preview" | "processing" | "complete" | "error";

function ScanContent() {
  const { selectedPatient, addPrescription, prescriptions, getPrescriptionsForPatient } = usePatients();
  const [scanState, setScanState] = useState<ScanState>("idle");
  const [progress, setProgress] = useState(0);
  const [ocrResult, setOcrResult] = useState<OCRResult | null>(null);
  const [showSimplified, setShowSimplified] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Handle file upload
  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrorMessage("Please select an image file (JPG, PNG, etc.)");
      setScanState("error");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setImagePreview(event.target?.result as string);
      setScanState("preview");
    };
    reader.readAsDataURL(file);
  }, []);

  // Start camera
  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setScanState("camera");
    } catch (error) {
      console.error("Camera error:", error);
      setErrorMessage("Unable to access camera. Please check permissions or use file upload.");
      setScanState("error");
    }
  }, []);

  // Capture photo from camera
  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(video, 0, 0);
      const dataUrl = canvas.toDataURL("image/jpeg", 0.8);
      setImagePreview(dataUrl);
      stopCamera();
      setScanState("preview");
    }
  }, []);

  // Stop camera
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  }, []);

  // Process image with OCR
  const processOCR = useCallback(async () => {
    if (!imagePreview) return;

    setScanState("processing");
    setProgress(0);

    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);

    try {
      // Convert base64 to blob for processing
      const response = await fetch(imagePreview);
      const blob = await response.blob();
      
      const result = await processImage(blob);
      
      clearInterval(progressInterval);
      setProgress(100);
      setOcrResult(result);
      setScanState("complete");
    } catch (error) {
      clearInterval(progressInterval);
      console.error("OCR error:", error);
      setErrorMessage("Failed to process image. Please try again.");
      setScanState("error");
    }
  }, [imagePreview]);

  // Save prescription
  const handleSave = useCallback(async () => {
    if (!ocrResult) return;

    setIsSaving(true);
    
    // Simulate save delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    const prescription = createPrescription(ocrResult, selectedPatient?.id || "unknown");
    addPrescription(prescription);
    
    setIsSaving(false);
    setSaveSuccess(true);
    
    // Reset after showing success
    setTimeout(() => {
      resetScanner();
    }, 1500);
  }, [ocrResult, selectedPatient, addPrescription]);

  // Reset scanner
  const resetScanner = useCallback(() => {
    stopCamera();
    setScanState("idle");
    setProgress(0);
    setOcrResult(null);
    setShowSimplified(false);
    setErrorMessage("");
    setImagePreview(null);
    setSaveSuccess(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [stopCamera]);

  const patientPrescriptions = selectedPatient
    ? getPrescriptionsForPatient(selectedPatient.id)
    : prescriptions;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Prescription Scanner</h1>
        <p className="text-muted-foreground">
          Upload or capture a prescription image to extract medication details
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Scanner Area */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileImage className="h-5 w-5" />
              Scan Prescription
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Idle State */}
            {scanState === "idle" && (
              <div className="space-y-4">
                <div className="rounded-xl border-2 border-dashed border-muted-foreground/25 p-8 text-center">
                  <div className="mb-4 flex justify-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                      <FileImage className="h-8 w-8 text-primary" />
                    </div>
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-foreground">
                    Choose an option
                  </h3>
                  <p className="mb-6 text-sm text-muted-foreground">
                    Upload an image or use your camera to scan a prescription
                  </p>
                  <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                    <Button onClick={() => fileInputRef.current?.click()}>
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Image
                    </Button>
                    <Button variant="outline" onClick={startCamera}>
                      <Camera className="mr-2 h-4 w-4" />
                      Use Camera
                    </Button>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileSelect}
                  />
                </div>
                <p className="text-center text-xs text-muted-foreground">
                  Supports JPG, PNG, and other image formats
                </p>
              </div>
            )}

            {/* Camera State */}
            {scanState === "camera" && (
              <div className="space-y-4">
                <div className="relative overflow-hidden rounded-xl bg-black">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="aspect-[4/3] w-full object-cover"
                  />
                  <div className="absolute inset-0 border-4 border-dashed border-white/30 m-8 rounded-lg pointer-events-none" />
                </div>
                <canvas ref={canvasRef} className="hidden" />
                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1" onClick={() => { stopCamera(); resetScanner(); }}>
                    <X className="mr-2 h-4 w-4" />
                    Cancel
                  </Button>
                  <Button className="flex-1" onClick={capturePhoto}>
                    <Camera className="mr-2 h-4 w-4" />
                    Capture
                  </Button>
                </div>
              </div>
            )}

            {/* Preview State */}
            {scanState === "preview" && imagePreview && (
              <div className="space-y-4">
                <div className="relative overflow-hidden rounded-xl border">
                  <Image
                    src={imagePreview}
                    alt="Prescription preview"
                    width={600}
                    height={400}
                    className="aspect-[4/3] w-full object-contain bg-muted"
                  />
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1" onClick={resetScanner}>
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Retake
                  </Button>
                  <Button className="flex-1" onClick={processOCR}>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Analyze
                  </Button>
                </div>
              </div>
            )}

            {/* Processing State */}
            {scanState === "processing" && (
              <div className="space-y-6 py-8 text-center">
                <div className="flex justify-center">
                  <div className="relative">
                    <div className="h-20 w-20 animate-pulse rounded-full bg-primary/20" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  </div>
                </div>
                <div>
                  <p className="mb-2 font-medium text-foreground">Analyzing prescription...</p>
                  <p className="text-sm text-muted-foreground">
                    Our AI is extracting medication details
                  </p>
                </div>
                <Progress value={progress} className="mx-auto max-w-xs" />
              </div>
            )}

            {/* Complete State */}
            {scanState === "complete" && ocrResult && (
              <div className="space-y-4">
                {saveSuccess ? (
                  <div className="flex flex-col items-center justify-center py-8">
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success/20">
                      <Check className="h-8 w-8 text-success" />
                    </div>
                    <p className="font-medium text-success">Prescription saved successfully!</p>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-center gap-2 text-success">
                      <Check className="h-5 w-5" />
                      <span className="font-medium">Scan Complete</span>
                    </div>

                    {/* Extracted Data */}
                    <div className="space-y-3 rounded-lg bg-muted/50 p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Drug</span>
                        <span className="font-medium text-foreground">{ocrResult.drugName}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Dosage</span>
                        <span className="font-medium text-foreground">{ocrResult.dosage}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Frequency</span>
                        <span className="font-medium text-foreground">{ocrResult.frequency}</span>
                      </div>
                      <div className="border-t pt-3">
                        <span className="text-sm text-muted-foreground">Instructions</span>
                        <p className="mt-1 text-sm font-medium text-foreground">
                          {ocrResult.instructions}
                        </p>
                      </div>
                      <div className="flex items-center justify-between border-t pt-3">
                        <span className="text-sm text-muted-foreground">Confidence</span>
                        <Badge
                          className={
                            ocrResult.confidence >= 0.9
                              ? "bg-success text-success-foreground"
                              : ocrResult.confidence >= 0.8
                              ? "bg-warning text-warning-foreground"
                              : "bg-destructive text-destructive-foreground"
                          }
                        >
                          {Math.round(ocrResult.confidence * 100)}%
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
                          {simplifyPrescription(ocrResult)}
                        </p>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-3">
                      <Button variant="outline" className="flex-1" onClick={resetScanner}>
                        <RotateCcw className="mr-2 h-4 w-4" />
                        Scan Another
                      </Button>
                      <Button className="flex-1" onClick={handleSave} disabled={isSaving}>
                        {isSaving ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="mr-2 h-4 w-4" />
                            Save
                          </>
                        )}
                      </Button>
                    </div>

                    {!selectedPatient && (
                      <div className="flex items-start gap-2 rounded-lg bg-warning/10 p-3 text-sm">
                        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-warning-foreground" />
                        <p className="text-warning-foreground">
                          No patient selected. Prescription will be saved as unassigned.
                        </p>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {/* Error State */}
            {scanState === "error" && (
              <div className="space-y-4 py-8 text-center">
                <div className="flex justify-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
                    <AlertCircle className="h-8 w-8 text-destructive" />
                  </div>
                </div>
                <div>
                  <p className="mb-2 font-medium text-foreground">Something went wrong</p>
                  <p className="text-sm text-muted-foreground">{errorMessage}</p>
                </div>
                <Button onClick={resetScanner}>Try Again</Button>
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
                <div className="mb-4 flex justify-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                    <FileImage className="h-6 w-6 text-muted-foreground" />
                  </div>
                </div>
                <p className="text-muted-foreground">No prescriptions scanned yet</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                {patientPrescriptions
                  .sort((a, b) => new Date(b.scannedAt).getTime() - new Date(a.scannedAt).getTime())
                  .map((rx) => (
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
                      <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {new Date(rx.scannedAt).toLocaleString()}
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

export default function ScanPage() {
  return (
    <AppLayout>
      <ScanContent />
    </AppLayout>
  );
}
