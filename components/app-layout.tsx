"use client";

import { Navbar } from "@/components/navbar";
import { AuthGuard } from "@/components/auth-guard";
import { PatientProvider } from "@/context/patient-context";

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <PatientProvider>
        <div className="min-h-screen bg-background">
          <Navbar />
          <main className="container mx-auto px-4 py-6">{children}</main>
        </div>
      </PatientProvider>
    </AuthGuard>
  );
}
