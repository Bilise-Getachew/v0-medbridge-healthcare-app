"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Activity, Loader2, AlertCircle, Eye, EyeOff, User, Stethoscope } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { login, isAuthenticated, getAuthUser } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<"patient" | "doctor">("patient");

  useEffect(() => {
    if (isAuthenticated()) {
      const user = getAuthUser();
      if (user?.role === "doctor") {
        router.replace("/doctor/dashboard");
      } else {
        router.replace("/patient/dashboard");
      }
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 800));

    const user = login(username, password);
    
    if (user) {
      if (user.role === "doctor") {
        router.push("/doctor/dashboard");
      } else {
        router.push("/patient/dashboard");
      }
    } else {
      setError("Invalid username or password");
      setIsLoading(false);
    }
  };

  const fillCredentials = (role: "patient" | "doctor") => {
    if (role === "patient") {
      setUsername("patient");
      setPassword("1234");
    } else {
      setUsername("doctor");
      setPassword("1234");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary">
            <Activity className="h-7 w-7 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl font-bold">Welcome to Medbridge</CardTitle>
          <CardDescription>
            Sign in to access your healthcare portal
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedRole} onValueChange={(v) => setSelectedRole(v as "patient" | "doctor")} className="mb-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="patient" className="gap-2">
                <User className="h-4 w-4" />
                Patient
              </TabsTrigger>
              <TabsTrigger value="doctor" className="gap-2">
                <Stethoscope className="h-4 w-4" />
                Doctor
              </TabsTrigger>
            </TabsList>
            <TabsContent value="patient" className="mt-4">
              <div className="rounded-lg bg-secondary/50 p-3 text-center text-sm">
                <p className="text-secondary-foreground">
                  Access your prescriptions, health records, and chat with our AI assistant.
                </p>
              </div>
            </TabsContent>
            <TabsContent value="doctor" className="mt-4">
              <div className="rounded-lg bg-primary/10 p-3 text-center text-sm">
                <p className="text-primary">
                  Manage patients, write prescriptions, and access emergency protocols.
                </p>
              </div>
            </TabsContent>
          </Tabs>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLoading}
                autoComplete="username"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  autoComplete="current-password"
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
                </Button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <p>{error}</p>
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isLoading || !username || !password}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          <div className="mt-6 space-y-3">
            <p className="text-center text-sm font-medium text-foreground">Demo Credentials</p>
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                size="sm"
                className="h-auto flex-col gap-1 py-3"
                onClick={() => fillCredentials("patient")}
              >
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs font-medium">Patient Login</span>
                <span className="text-xs text-muted-foreground">patient / 1234</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-auto flex-col gap-1 py-3"
                onClick={() => fillCredentials("doctor")}
              >
                <Stethoscope className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs font-medium">Doctor Login</span>
                <span className="text-xs text-muted-foreground">doctor / 1234</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
