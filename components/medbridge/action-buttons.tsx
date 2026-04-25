"use client";

import { Scan, AlertTriangle, MessageCircle, CreditCard } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { ViewType } from "@/lib/types";

interface ActionButtonsProps {
  onNavigate: (view: ViewType) => void;
}

const actions = [
  {
    view: "prescription" as ViewType,
    icon: Scan,
    label: "Scan Prescription",
    description: "Upload and analyze prescriptions",
    color: "bg-primary/10 text-primary hover:bg-primary/20",
    iconBg: "bg-primary",
  },
  {
    view: "emergency" as ViewType,
    icon: AlertTriangle,
    label: "Emergency Help",
    description: "Get guided emergency support",
    color: "bg-destructive/10 text-destructive hover:bg-destructive/20",
    iconBg: "bg-destructive",
  },
  {
    view: "chat" as ViewType,
    icon: MessageCircle,
    label: "Ask Assistant",
    description: "Chat with AI health assistant",
    color: "bg-accent/20 text-accent-foreground hover:bg-accent/30",
    iconBg: "bg-accent",
  },
  {
    view: "health-card" as ViewType,
    icon: CreditCard,
    label: "Health Card",
    description: "View patient health records",
    color: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    iconBg: "bg-foreground",
  },
];

export function ActionButtons({ onNavigate }: ActionButtonsProps) {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {actions.map((action) => (
        <Card
          key={action.view}
          className={`group cursor-pointer p-4 transition-all duration-200 hover:shadow-lg ${action.color}`}
          onClick={() => onNavigate(action.view)}
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
      ))}
    </div>
  );
}
