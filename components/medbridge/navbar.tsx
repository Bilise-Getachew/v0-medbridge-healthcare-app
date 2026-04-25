"use client";

import { Activity, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import type { ViewType } from "@/lib/types";

interface NavbarProps {
  currentView: ViewType;
  onNavigate: (view: ViewType) => void;
}

export function Navbar({ currentView, onNavigate }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { view: ViewType; label: string }[] = [
    { view: "dashboard", label: "Dashboard" },
    { view: "prescription", label: "Prescription" },
    { view: "emergency", label: "Emergency" },
    { view: "chat", label: "Assistant" },
    { view: "health-card", label: "Health Card" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <button
          onClick={() => onNavigate("dashboard")}
          className="flex items-center gap-2 transition-opacity hover:opacity-80"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Activity className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-semibold text-foreground">Medbridge</span>
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <Button
              key={item.view}
              variant={currentView === item.view ? "secondary" : "ghost"}
              size="sm"
              onClick={() => onNavigate(item.view)}
              className={
                currentView === item.view
                  ? "bg-primary/10 text-primary hover:bg-primary/20"
                  : "text-muted-foreground hover:text-foreground"
              }
            >
              {item.label}
            </Button>
          ))}
        </nav>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <nav className="border-t border-border bg-card p-4 md:hidden">
          <div className="flex flex-col gap-2">
            {navItems.map((item) => (
              <Button
                key={item.view}
                variant={currentView === item.view ? "secondary" : "ghost"}
                className={`w-full justify-start ${
                  currentView === item.view
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground"
                }`}
                onClick={() => {
                  onNavigate(item.view);
                  setMobileMenuOpen(false);
                }}
              >
                {item.label}
              </Button>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
