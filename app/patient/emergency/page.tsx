"use client";

import { useState, useEffect, useCallback } from "react";
import {
  AlertTriangle,
  Heart,
  Droplets,
  UserX,
  Wind,
  Phone,
  ChevronRight,
  Check,
  X,
  Clock,
  Volume2,
  VolumeX,
  ArrowLeft,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import emergencyProtocols from "@/data/emergency-protocols.json";

type Protocol = {
  id: string;
  title: string;
  icon: string;
  severity: string;
  symptoms: string[];
  steps: {
    order: number;
    action: string;
    duration: number;
    critical: boolean;
  }[];
};

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  heart: Heart,
  droplets: Droplets,
  "user-x": UserX,
  "alert-triangle": AlertTriangle,
  wind: Wind,
};

export default function PatientEmergencyPage() {
  const [selectedProtocol, setSelectedProtocol] = useState<Protocol | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);

  const protocols = Object.values(emergencyProtocols) as Protocol[];

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            if (audioEnabled) {
              const utterance = new SpeechSynthesisUtterance("Time is up. Move to the next step.");
              speechSynthesis.speak(utterance);
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timer, audioEnabled]);

  const startProtocol = useCallback((protocol: Protocol) => {
    setSelectedProtocol(protocol);
    setCurrentStep(0);
    setCompletedSteps([]);
    const firstStep = protocol.steps[0];
    if (firstStep.duration > 0) {
      setTimer(firstStep.duration);
      setIsTimerRunning(true);
    }
    if (audioEnabled) {
      const utterance = new SpeechSynthesisUtterance(firstStep.action);
      speechSynthesis.speak(utterance);
    }
  }, [audioEnabled]);

  const completeStep = useCallback(() => {
    if (!selectedProtocol) return;
    
    setCompletedSteps((prev) => [...prev, currentStep]);
    
    if (currentStep < selectedProtocol.steps.length - 1) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      const step = selectedProtocol.steps[nextStep];
      if (step.duration > 0) {
        setTimer(step.duration);
        setIsTimerRunning(true);
      } else {
        setTimer(0);
        setIsTimerRunning(false);
      }
      if (audioEnabled) {
        const utterance = new SpeechSynthesisUtterance(step.action);
        speechSynthesis.speak(utterance);
      }
    }
  }, [selectedProtocol, currentStep, audioEnabled]);

  const exitProtocol = useCallback(() => {
    setSelectedProtocol(null);
    setCurrentStep(0);
    setCompletedSteps([]);
    setTimer(0);
    setIsTimerRunning(false);
    speechSynthesis.cancel();
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Protocol selection view
  if (!selectedProtocol) {
    return (
      <div className="space-y-6">
        <div className="rounded-xl bg-destructive/10 p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/20">
              <AlertTriangle className="h-6 w-6 text-destructive" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Emergency Guide</h1>
              <p className="text-muted-foreground">
                Select an emergency type for step-by-step guidance
              </p>
            </div>
          </div>
        </div>

        {/* Emergency Call Button */}
        <a href="tel:911">
          <Card className="border-destructive/50 bg-destructive/5 transition-all hover:bg-destructive/10">
            <CardContent className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive">
                  <Phone className="h-6 w-6 text-destructive-foreground" />
                </div>
                <div>
                  <p className="font-bold text-destructive">Call 911</p>
                  <p className="text-sm text-muted-foreground">Tap to call emergency services</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-destructive" />
            </CardContent>
          </Card>
        </a>

        {/* Audio Toggle */}
        <div className="flex items-center justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setAudioEnabled(!audioEnabled)}
            className="gap-2"
          >
            {audioEnabled ? (
              <>
                <Volume2 className="h-4 w-4" />
                Voice On
              </>
            ) : (
              <>
                <VolumeX className="h-4 w-4" />
                Voice Off
              </>
            )}
          </Button>
        </div>

        {/* Protocol Cards */}
        <div className="grid gap-4 sm:grid-cols-2">
          {protocols.map((protocol) => {
            const Icon = iconMap[protocol.icon] || AlertTriangle;
            return (
              <Card
                key={protocol.id}
                className="cursor-pointer transition-all hover:shadow-md hover:border-destructive/30"
                onClick={() => startProtocol(protocol)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-destructive/10">
                      <Icon className="h-6 w-6 text-destructive" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-foreground">{protocol.title}</h3>
                        <Badge
                          variant="outline"
                          className={
                            protocol.severity === "critical"
                              ? "bg-destructive/10 text-destructive border-destructive/20"
                              : "bg-warning/10 text-warning-foreground border-warning/20"
                          }
                        >
                          {protocol.severity}
                        </Badge>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {protocol.steps.length} steps
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card className="bg-muted/50">
          <CardContent className="p-4">
            <p className="text-center text-sm text-muted-foreground">
              This guide provides general first aid information. Always call emergency services for serious emergencies.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Active protocol view
  const Icon = iconMap[selectedProtocol.icon] || AlertTriangle;
  const step = selectedProtocol.steps[currentStep];
  const progressPercent = ((completedSteps.length) / selectedProtocol.steps.length) * 100;
  const allComplete = completedSteps.length === selectedProtocol.steps.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={exitProtocol} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Exit
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setAudioEnabled(!audioEnabled)}
        >
          {audioEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
        </Button>
      </div>

      {/* Protocol Title */}
      <Card className="border-destructive/30 bg-destructive/5">
        <CardContent className="flex items-center gap-4 p-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-destructive/20">
            <Icon className="h-7 w-7 text-destructive" />
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-foreground">{selectedProtocol.title}</h1>
            <div className="mt-2">
              <Progress value={progressPercent} className="h-2" />
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              Step {currentStep + 1} of {selectedProtocol.steps.length}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Current Step */}
      {!allComplete && (
        <Card className="border-2 border-primary">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  {step.order}
                </span>
                Current Step
              </CardTitle>
              {step.critical && (
                <Badge className="bg-destructive text-destructive-foreground">Critical</Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-lg font-medium text-foreground">{step.action}</p>
            
            {timer > 0 && (
              <div className="flex items-center justify-center gap-4 rounded-lg bg-muted/50 p-4">
                <Clock className="h-6 w-6 text-primary" />
                <span className="text-3xl font-bold tabular-nums text-foreground">
                  {formatTime(timer)}
                </span>
              </div>
            )}

            <Button className="w-full" size="lg" onClick={completeStep}>
              <Check className="mr-2 h-5 w-5" />
              Complete Step
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Completed Message */}
      {allComplete && (
        <Card className="border-success bg-success/10">
          <CardContent className="flex flex-col items-center p-8 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success/20">
              <Check className="h-8 w-8 text-success" />
            </div>
            <h2 className="text-xl font-bold text-foreground">All Steps Completed</h2>
            <p className="mt-2 text-muted-foreground">
              Continue to monitor the person and wait for emergency services if called.
            </p>
            <Button className="mt-6" onClick={exitProtocol}>
              Return to Emergency Guide
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Step List */}
      <Card>
        <CardHeader>
          <CardTitle>All Steps</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {selectedProtocol.steps.map((s, idx) => {
              const isCompleted = completedSteps.includes(idx);
              const isCurrent = idx === currentStep && !allComplete;
              return (
                <div
                  key={idx}
                  className={`flex items-start gap-3 rounded-lg p-3 transition-colors ${
                    isCurrent
                      ? "bg-primary/10 border border-primary/30"
                      : isCompleted
                      ? "bg-success/5"
                      : "bg-muted/30"
                  }`}
                >
                  <div
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-sm font-medium ${
                      isCompleted
                        ? "bg-success text-success-foreground"
                        : isCurrent
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {isCompleted ? <Check className="h-4 w-4" /> : s.order}
                  </div>
                  <div className="flex-1">
                    <p
                      className={`text-sm ${
                        isCompleted
                          ? "text-muted-foreground line-through"
                          : isCurrent
                          ? "text-foreground font-medium"
                          : "text-muted-foreground"
                      }`}
                    >
                      {s.action}
                    </p>
                    {s.critical && !isCompleted && (
                      <Badge variant="outline" className="mt-1 text-xs bg-destructive/10 text-destructive border-destructive/20">
                        Critical
                      </Badge>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
