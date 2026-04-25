"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { login as authLogin, logout as authLogout, getAuthUser, type AuthUser, type UserRole } from "@/lib/auth";

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const authUser = getAuthUser();
    setUser(authUser);
    setIsLoading(false);
  }, []);

  const login = useCallback(
    (username: string, password: string): AuthUser | null => {
      const authUser = authLogin(username, password);
      if (authUser) {
        setUser(authUser);
        // Redirect based on role
        if (authUser.role === "doctor") {
          router.push("/doctor/dashboard");
        } else {
          router.push("/patient/dashboard");
        }
      }
      return authUser;
    },
    [router]
  );

  const logout = useCallback(() => {
    authLogout();
    setUser(null);
    router.push("/login");
  }, [router]);

  const isRole = useCallback(
    (role: UserRole): boolean => {
      return user?.role === role;
    },
    [user]
  );

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    isPatient: user?.role === "patient",
    isDoctor: user?.role === "doctor",
    isRole,
    login,
    logout,
  };
}
