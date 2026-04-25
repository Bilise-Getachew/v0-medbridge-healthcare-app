"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated, getAuthUser } from "@/lib/auth";
import { Loader2 } from "lucide-react";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to appropriate page based on auth status and role
    if (isAuthenticated()) {
      const user = getAuthUser();
      if (user?.role === "doctor") {
        router.replace("/doctor/dashboard");
      } else {
        router.replace("/patient/dashboard");
      }
    } else {
      router.replace("/login");
    }
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Loading Medbridge...</p>
      </div>
    </div>
  );
}
