"use client";

import { useState } from "react";
import {
  AlertTriangle,
  Heart,
  Droplets,
  UserX,
  Wind,
  ChevronDown,
  ChevronUp,
  Clock,
  CheckCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
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

export default function DoctorEmergencyPage() {
  const [openProtocols, setOpenProtocols] = useState<string[]>([]);
  const protocols = Object.values(emergencyProtocols) as Protocol[];

  const toggleProtocol = (id: string) => {
    setOpenProtocols((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Emergency Protocols</h1>
        <p className="text-muted-foreground">
          Quick reference guide for emergency medical procedures
        </p>
      </div>

      {/* Warning */}
      <Card className="border-warning/30 bg-warning/5">
        <CardContent className="flex items-start gap-3 p-4">
          <AlertTriangle className="h-5 w-5 shrink-0 text-warning-foreground mt-0.5" />
          <div>
            <p className="font-medium text-warning-foreground">Clinical Reference Only</p>
            <p className="text-sm text-muted-foreground">
              These protocols are for trained medical professionals. Always follow your facility&apos;s 
              established procedures and use clinical judgment.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Protocols */}
      <div className="space-y-4">
        {protocols.map((protocol) => {
          const Icon = iconMap[protocol.icon] || AlertTriangle;
          const isOpen = openProtocols.includes(protocol.id);

          return (
            <Card key={protocol.id}>
              <Collapsible open={isOpen} onOpenChange={() => toggleProtocol(protocol.id)}>
                <CollapsibleTrigger className="w-full">
                  <CardHeader className="flex flex-row items-center justify-between p-4 hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10">
                        <Icon className="h-5 w-5 text-destructive" />
                      </div>
                      <div className="text-left">
                        <CardTitle className="text-lg">{protocol.title}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {protocol.steps.length} steps | {protocol.steps.filter(s => s.critical).length} critical
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
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
                      {isOpen ? (
                        <ChevronUp className="h-5 w-5 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="border-t pt-4 pb-4">
                    {/* Symptoms */}
                    <div className="mb-4">
                      <h4 className="mb-2 text-sm font-medium text-foreground">Key Symptoms</h4>
                      <div className="flex flex-wrap gap-2">
                        {protocol.symptoms.map((symptom, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {symptom}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Steps */}
                    <div>
                      <h4 className="mb-3 text-sm font-medium text-foreground">Protocol Steps</h4>
                      <div className="space-y-2">
                        {protocol.steps.map((step) => (
                          <div
                            key={step.order}
                            className={`flex items-start gap-3 rounded-lg p-3 ${
                              step.critical
                                ? "bg-destructive/5 border border-destructive/20"
                                : "bg-muted/50"
                            }`}
                          >
                            <div
                              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-sm font-medium ${
                                step.critical
                                  ? "bg-destructive text-destructive-foreground"
                                  : "bg-primary text-primary-foreground"
                              }`}
                            >
                              {step.order}
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-foreground">{step.action}</p>
                              <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                                {step.duration > 0 && (
                                  <span className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    ~{step.duration}s
                                  </span>
                                )}
                                {step.critical && (
                                  <Badge variant="outline" className="text-xs bg-destructive/10 text-destructive border-destructive/20">
                                    Critical Step
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
