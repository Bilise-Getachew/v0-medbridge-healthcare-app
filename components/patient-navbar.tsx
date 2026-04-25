"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, Menu, X, LogOut, Home, Scan, AlertTriangle, MessageSquare, CreditCard, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const navItems = [
  { href: "/patient/dashboard", label: "Dashboard", icon: Home },
  { href: "/patient/scan", label: "Scan Rx", icon: Scan },
  { href: "/patient/emergency", label: "Emergency", icon: AlertTriangle },
  { href: "/patient/chat", label: "Assistant", icon: MessageSquare },
  { href: "/patient/health", label: "My Health", icon: CreditCard },
];

export function PatientNavbar() {
  const pathname = usePathname();
  const { logout, user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link
          href="/patient/dashboard"
          className="flex items-center gap-2 transition-opacity hover:opacity-80"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Activity className="h-5 w-5 text-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-semibold text-foreground leading-tight">Medbridge</span>
            <span className="text-xs text-muted-foreground">Patient Portal</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  size="sm"
                  className={
                    isActive
                      ? "bg-primary/10 text-primary hover:bg-primary/20"
                      : "text-muted-foreground hover:text-foreground"
                  }
                >
                  <Icon className="mr-1.5 h-4 w-4" />
                  {item.label}
                </Button>
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-secondary text-secondary-foreground">
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium text-foreground">{user?.name || "Patient"}</span>
          </div>
          <div className="h-6 w-px bg-border" />
          <Button
            variant="ghost"
            size="sm"
            onClick={logout}
            className="text-muted-foreground hover:text-destructive"
          >
            <LogOut className="mr-1.5 h-4 w-4" />
            Logout
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <nav className="border-t border-border bg-card p-4 lg:hidden">
          <div className="mb-4 flex items-center gap-3 rounded-lg bg-muted/50 p-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-secondary text-secondary-foreground">
                <User className="h-5 w-5" />
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-foreground">{user?.name || "Patient"}</p>
              <p className="text-xs text-muted-foreground">Patient Account</p>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link key={item.href} href={item.href} onClick={() => setMobileMenuOpen(false)}>
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    className={`w-full justify-start ${
                      isActive ? "bg-primary/10 text-primary" : "text-muted-foreground"
                    }`}
                  >
                    <Icon className="mr-2 h-4 w-4" />
                    {item.label}
                  </Button>
                </Link>
              );
            })}
            <div className="my-2 h-px bg-border" />
            <Button
              variant="ghost"
              onClick={() => {
                setMobileMenuOpen(false);
                logout();
              }}
              className="w-full justify-start text-muted-foreground hover:text-destructive"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </nav>
      )}
    </header>
  );
}
