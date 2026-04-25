"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { login as authLogin, logout as authLogout, getAuthUser, type AuthUser } from "@/lib/auth";

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
    (username: string, password: string): boolean => {
      const success = authLogin(username, password);
      if (success) {
        setUser(getAuthUser());
        router.push("/dashboard");
      }
      return success;
    },
    [router]
  );

  const logout = useCallback(() => {
    authLogout();
    setUser(null);
    router.push("/login");
  }, [router]);

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
  };
}
