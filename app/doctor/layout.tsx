"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAuthUser } from "@/lib/auth";
import { PatientProvider } from "@/context/patient-context";
import { DoctorNavbar } from "@/components/doctor-navbar";

export default function DoctorLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    const user = getAuthUser();
    if (!user) {
      router.replace("/login");
    } else if (user.role === "patient") {
      router.replace("/patient/dashboard");
    }
  }, [router]);

  return (
    <PatientProvider>
      <div className="min-h-screen bg-background">
        <DoctorNavbar />
        <main className="container mx-auto px-4 py-6">{children}</main>
      </div>
    </PatientProvider>
  );
}
