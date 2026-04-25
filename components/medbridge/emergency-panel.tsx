"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Heart,
  Droplets,
  UserX,
  AlertTriangle,
  Wind,
  ArrowLeft,
  Phone,
  CheckCircle2,
  Circle,
  Volume2,
  Timer,
  ChevronRight,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import emergencyProtocols from "@/data/emergency-protocols.json";
import type { EmergencyProtocol, ViewType } from "@/lib/types";

interface EmergencyPanelProps {
  onNavigate: (view: ViewType) => void;
}

const iconMap: Record<string, typeof Heart> = {
  heart: Heart,
  droplets: Droplets,
  "user-x": UserX,
  "alert-triangle": AlertTriangle,
  wind: Wind,
};

export function EmergencyPanel({ onNavigate }: EmergencyPanelProps) {
  const [selectedProtocol, setSelectedProtocol] = useState<EmergencyProtocol | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const protocols = Object.values(emergencyProtocols) as EmergencyProtocol[];

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const handleSelectProtocol = (protocol: EmergencyProtocol) => {
    setSelectedProtocol(protocol);
    setCurrentStep(0);
    setCompletedSteps(new Set());
    setTimer(0);
    setIsTimerRunning(true);
  };

  const handleCompleteStep = (stepIndex: number) => {
    setCompletedSteps((prev) => new Set([...prev, stepIndex]));
    if (stepIndex < (selectedProtocol?.steps.length || 0) - 1) {
      setCurrentStep(stepIndex + 1);
    }
  };

  const handleBack = () => {
    if (selectedProtocol) {
      setSelectedProtocol(null);
      setIsTimerRunning(false);
      setTimer(0);
    } else {
      onNavigate("dashboard");
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const speakStep = useCallback((text: string) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      window.speechSynthesis.speak(utterance);
    }
  }, []);

  // Protocol Selection View
  if (!selectedProtocol) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => onNavigate("dashboard")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Emergency Help</h1>
            <p className="text-muted-foreground">Select an emergency type for guided assistance</p>
          </div>
        </div>

        {/* Emergency Call Banner */}
        <Card className="border-destructive/50 bg-destructive/5">
          <CardContent className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive">
                <Phone className="h-5 w-5 text-destructive-foreground" />
              </div>
              <div>
                <p className="font-semibold text-destructive">Life-threatening emergency?</p>
                <p className="text-sm text-muted-foreground">Call emergency services immediately</p>
              </div>
            </div>
            <Button variant="destructive" size="lg" asChild>
              <a href="tel:911">Call 911</a>
            </Button>
          </CardContent>
        </Card>

        {/* Protocol Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {protocols.map((protocol) => {
            const Icon = iconMap[protocol.icon] || AlertTriangle;
            return (
              <Card
                key={protocol.id}
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  protocol.severity === "critical"
                    ? "border-destructive/30 hover:border-destructive/50"
                    : "hover:border-primary/50"
                }`}
                onClick={() => handleSelectProtocol(protocol)}
              >
                <CardContent className="p-6">
                  <div className="mb-4 flex items-start justify-between">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                        protocol.severity === "critical" ? "bg-destructive" : "bg-warning"
                      }`}
                    >
                      <Icon
                        className={`h-6 w-6 ${
                          protocol.severity === "critical"
                            ? "text-destructive-foreground"
                            : "text-warning-foreground"
                        }`}
                      />
                    </div>
                    <Badge
                      variant="outline"
                      className={
                        protocol.severity === "critical"
                          ? "border-destructive/50 text-destructive"
                          : "border-warning/50 text-warning-foreground"
                      }
                    >
                      {protocol.severity}
                    </Badge>
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-foreground">{protocol.title}</h3>
                  <p className="mb-3 text-sm text-muted-foreground">
                    {protocol.symptoms.slice(0, 2).join(", ")}
                  </p>
                  <div className="flex items-center text-sm text-primary">
                    <span>{protocol.steps.length} steps</span>
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    );
  }

  // Active Emergency Protocol View
  const Icon = iconMap[selectedProtocol.icon] || AlertTriangle;
  const progressPercent = (completedSteps.size / selectedProtocol.steps.length) * 100;

  return (
    <div className="min-h-screen bg-background">
      {/* Emergency Header */}
      <div
        className={`sticky top-0 z-10 border-b p-4 ${
          selectedProtocol.severity === "critical"
            ? "border-destructive/30 bg-destructive/5"
            : "border-warning/30 bg-warning/5"
        }`}
      >
        <div className="mx-auto max-w-2xl">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" onClick={handleBack}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 rounded-full bg-card px-3 py-1">
                <Timer className="h-4 w-4 text-muted-foreground" />
                <span className="font-mono text-sm font-semibold">{formatTime(timer)}</span>
              </div>
              <Button variant="destructive" size="sm" asChild>
                <a href="tel:911">
                  <Phone className="mr-2 h-4 w-4" />
                  Call 911
                </a>
              </Button>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-4">
            <div
              className={`flex h-14 w-14 items-center justify-center rounded-xl ${
                selectedProtocol.severity === "critical" ? "bg-destructive" : "bg-warning"
              }`}
            >
              <Icon className="h-7 w-7 text-primary-foreground" />
            </div>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-foreground">{selectedProtocol.title}</h1>
              <div className="mt-1 flex items-center gap-2">
                <Progress value={progressPercent} className="h-2 flex-1" />
                <span className="text-sm text-muted-foreground">
                  {completedSteps.size}/{selectedProtocol.steps.length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Steps */}
      <div className="mx-auto max-w-2xl space-y-4 p-4">
        {selectedProtocol.steps.map((step, index) => {
          const isCompleted = completedSteps.has(index);
          const isCurrent = index === currentStep;

          return (
            <Card
              key={index}
              className={`transition-all ${
                isCurrent
                  ? "ring-2 ring-primary ring-offset-2"
                  : isCompleted
                  ? "opacity-60"
                  : "opacity-80"
              }`}
            >
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <div className="shrink-0">
                    {isCompleted ? (
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-success">
                        <CheckCircle2 className="h-5 w-5 text-success-foreground" />
                      </div>
                    ) : (
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                          isCurrent
                            ? "border-primary bg-primary/10"
                            : "border-muted-foreground/30"
                        }`}
                      >
                        <span
                          className={`font-semibold ${
                            isCurrent ? "text-primary" : "text-muted-foreground"
                          }`}
                        >
                          {index + 1}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p
                        className={`text-lg leading-snug ${
                          isCompleted
                            ? "text-muted-foreground line-through"
                            : "font-medium text-foreground"
                        }`}
                      >
                        {step.action}
                      </p>
                      {step.critical && (
                        <Badge
                          variant="outline"
                          className="shrink-0 border-destructive/50 text-destructive"
                        >
                          Critical
                        </Badge>
                      )}
                    </div>

                    {isCurrent && !isCompleted && (
                      <div className="mt-4 flex gap-2">
                        <Button onClick={() => handleCompleteStep(index)} className="flex-1">
                          <CheckCircle2 className="mr-2 h-4 w-4" />
                          Mark Complete
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => speakStep(step.action)}
                        >
                          <Volume2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {/* All Steps Completed */}
        {completedSteps.size === selectedProtocol.steps.length && (
          <Card className="border-success/50 bg-success/10">
            <CardContent className="p-6 text-center">
              <CheckCircle2 className="mx-auto mb-4 h-12 w-12 text-success" />
              <h3 className="mb-2 text-lg font-semibold text-foreground">All Steps Completed</h3>
              <p className="mb-4 text-muted-foreground">
                Continue monitoring the person and wait for emergency services if called.
              </p>
              <Button onClick={handleBack}>Return to Emergency Menu</Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
