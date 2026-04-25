"use client";

import { ActionButtons } from "./action-buttons";
import { PatientSummary } from "./patient-summary";
import { RecentPrescriptions } from "./recent-prescriptions";
import type { ViewType } from "@/lib/types";

interface DashboardProps {
  onNavigate: (view: ViewType) => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="text-center">
        <h1 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Welcome to Medbridge
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-pretty text-muted-foreground">
          Your AI-powered healthcare assistant. Understand prescriptions, get emergency guidance, and manage health records with ease.
        </p>
      </div>

      {/* Quick Actions */}
      <section>
        <h2 className="mb-4 text-lg font-semibold text-foreground">Quick Actions</h2>
        <ActionButtons onNavigate={onNavigate} />
      </section>

      {/* Two Column Layout */}
      <div className="grid gap-6 lg:grid-cols-2">
        <section>
          <PatientSummary onNavigate={onNavigate} />
        </section>
        <section>
          <RecentPrescriptions onNavigate={onNavigate} />
        </section>
      </div>
    </div>
  );
}
