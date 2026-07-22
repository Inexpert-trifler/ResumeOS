"use client";

import { Search, Bell, Plus, User, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";

const ROUTE_LABELS: Record<string, string> = {
  dashboard: "Dashboard",
  builder: "Resume Builder",
  studio: "Resume Studio",
  academy: "Resume Academy",
  templates: "Templates",
  analyzer: "ATS Analyzer",
  coach: "AI Coach",
  tracker: "Job Tracker",
};

function Breadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className="hidden sm:flex items-center gap-1 text-sm text-muted-foreground">
      {segments.map((segment, index) => {
        const isLast = index === segments.length - 1;
        const href = "/" + segments.slice(0, index + 1).join("/");
        const label = ROUTE_LABELS[segment] ?? segment.charAt(0).toUpperCase() + segment.slice(1);

        return (
          <span key={href} className="flex items-center gap-1">
            {index > 0 && <ChevronRight className="w-3.5 h-3.5 opacity-40 shrink-0" />}
            {isLast ? (
              <span className="font-medium text-foreground">{label}</span>
            ) : (
              <Link href={href} className="hover:text-foreground transition-colors">
                {label}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}

export function DashboardTopNav() {
  return (
    <header className="h-14 shrink-0 border-b border-border/50 bg-background/80 backdrop-blur-xl sticky top-0 z-40 flex items-center justify-between px-6 gap-4">
      {/* Left: Breadcrumbs + Search */}
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <Breadcrumbs />

        <div className="relative hidden md:block ml-auto max-w-xs w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full h-8 pl-8 pr-4 bg-muted/60 border border-border/40 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent/40 transition-all placeholder:text-muted-foreground/60"
          />
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2 shrink-0">
        <Link href="/builder">
          <Button size="sm" className="hidden sm:flex rounded-full gap-1.5 h-8 px-3 text-xs shadow-sm shadow-accent/10">
            <Plus className="w-3.5 h-3.5" />
            New Resume
          </Button>
        </Link>

        <button
          aria-label="Notifications"
          className="relative p-2 text-muted-foreground hover:text-foreground transition-colors hover:bg-muted rounded-lg"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full border border-background" />
        </button>

        <div className="w-px h-5 bg-border/50 mx-1 hidden sm:block" />

        <button
          aria-label="User menu"
          className="flex items-center gap-2 hover:bg-muted px-2 py-1.5 rounded-xl transition-colors border border-transparent hover:border-border/50"
        >
          <div className="w-6 h-6 rounded-full bg-accent/15 flex items-center justify-center border border-accent/20">
            <User className="w-3.5 h-3.5 text-accent" />
          </div>
          <span className="text-sm font-medium hidden md:block">Alex M.</span>
        </button>
      </div>
    </header>
  );
}
