"use client";

import { useState } from "react";
import { Navbar } from "./navbar";
import { Dashboard } from "./dashboard";
import { PrescriptionScanner } from "./prescription-scanner";
import { EmergencyPanel } from "./emergency-panel";
import { ChatInterface } from "./chat-interface";
import { HealthCard } from "./health-card";
import { PatientProvider } from "@/context/patient-context";
import type { ViewType } from "@/lib/types";

export function MedbridgeApp() {
  const [currentView, setCurrentView] = useState<ViewType>("dashboard");

  const renderView = () => {
    switch (currentView) {
      case "dashboard":
        return <Dashboard onNavigate={setCurrentView} />;
      case "prescription":
        return <PrescriptionScanner onNavigate={setCurrentView} />;
      case "emergency":
        return <EmergencyPanel onNavigate={setCurrentView} />;
      case "chat":
        return <ChatInterface onNavigate={setCurrentView} />;
      case "health-card":
        return <HealthCard onNavigate={setCurrentView} />;
      default:
        return <Dashboard onNavigate={setCurrentView} />;
    }
  };

  return (
    <PatientProvider>
      <div className="min-h-screen bg-background">
        <Navbar currentView={currentView} onNavigate={setCurrentView} />
        <main className="container mx-auto px-4 py-6">{renderView()}</main>
      </div>
    </PatientProvider>
  );
}
