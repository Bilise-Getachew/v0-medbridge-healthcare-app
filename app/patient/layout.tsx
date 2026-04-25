"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAuthUser } from "@/lib/auth";
import { PatientProvider } from "@/context/patient-context";
import { PatientNavbar } from "@/components/patient-navbar";

export default function PatientLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    const user = getAuthUser();
    if (!user) {
      router.replace("/login");
    } else if (user.role === "doctor") {
      router.replace("/doctor/dashboard");
    }
  }, [router]);

  return (
    <PatientProvider>
      <div className="min-h-screen bg-background">
        <PatientNavbar />
        <main className="container mx-auto px-4 py-6">{children}</main>
      </div>
    </PatientProvider>
  );
}
