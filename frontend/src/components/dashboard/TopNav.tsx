"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useResumeDraftSnapshot } from "@/lib/resume-draft";
import { UserButton, useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Moon, Sun, FileText, User } from "lucide-react";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";

// ─── Nav links ────────────────────────────────────────────────────────────────

const NAV_LINKS = [
  { label: "Dashboard",  href: "/dashboard" },
  { label: "Templates",  href: "/templates" },
  { label: "Academy",    href: "/academy" },
  { label: "Studio",     href: "/studio" },
  { label: "Analyzer",   href: "/analyzer" },
  { label: "Coach",      href: "/coach" },
  { label: "Tracker",    href: "/tracker" },
];

// ─── Theme toggle ─────────────────────────────────────────────────────────────

function ThemeToggleButton() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <button className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground">
        <Sun className="w-4 h-4" />
      </button>
    );
  }

  return (
    <button
      aria-label="Toggle theme"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-white/10 transition-all"
    >
      {resolvedTheme === "dark" ? (
        <Moon className="w-4 h-4" />
      ) : (
        <Sun className="w-4 h-4" />
      )}
    </button>
  );
}

// ─── Top Nav ──────────────────────────────────────────────────────────────────

export function DashboardTopNav() {
  const pathname = usePathname();
  const draft = useResumeDraftSnapshot();
  const { user } = useUser();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const displayName = isMounted
    ? (
        [
          draft?.builder?.personalInfo.firstName?.trim(),
          draft?.builder?.personalInfo.lastName?.trim(),
        ]
          .filter(Boolean)
          .join(" ") ||
        draft?.resume?.header.name?.trim() ||
        user?.fullName ||
        user?.primaryEmailAddress?.emailAddress ||
        "Guest"
      )
    : "Guest";

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  return (
    <header className="h-14 shrink-0 sticky top-0 z-40 flex items-center justify-between px-6 gap-4 bg-background/90 backdrop-blur-xl border-b border-border/30">

      {/* Logo */}
      <Link href="/dashboard" className="flex items-center gap-2 shrink-0">
        <div className="w-7 h-7 rounded-lg bg-accent flex items-center justify-center shadow-sm shadow-accent/30">
          <FileText className="w-3.5 h-3.5 text-white" />
        </div>
        <span className="font-bold text-sm tracking-tight hidden sm:block">
          Resume<span className="text-accent">OS</span>
        </span>
      </Link>

      {/* Center pill nav */}
      <nav
        aria-label="Main navigation"
        className="hidden md:flex items-center gap-1 bg-muted/60 border border-border/30 backdrop-blur rounded-full px-2 py-1.5"
      >
        {NAV_LINKS.map((link) => {
          const active = isActive(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "relative px-3.5 py-1 rounded-full text-sm font-medium transition-colors duration-150",
                active
                  ? "text-accent"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {active && (
                <motion.span
                  layoutId="topNavActivePill"
                  className="absolute inset-0 rounded-full bg-accent/15 border border-accent/20"
                  transition={{ type: "spring", stiffness: 400, damping: 35 }}
                />
              )}
              <span className="relative z-10">{link.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Right actions */}
      <div className="flex items-center gap-2 shrink-0">
        <ThemeToggleButton />

        <Link
          href="/builder"
          className="hidden sm:flex items-center gap-1.5 bg-accent hover:bg-accent/90 text-white text-xs font-semibold px-3.5 py-2 rounded-full transition-all shadow-sm shadow-accent/20 hover:shadow-accent/30"
        >
          <FileText className="w-3.5 h-3.5" />
          Build Resume
        </Link>

        <div className="w-px h-5 bg-border/50 mx-1 hidden sm:block" />

        <div className="w-8 h-8 rounded-full bg-accent/15 border border-accent/20 flex items-center justify-center overflow-hidden">
          {isMounted ? (
            <UserButton
              userProfileUrl="/user-profile"
              appearance={{ elements: { avatarBox: "w-8 h-8" } }}
            />
          ) : (
            <User className="w-4 h-4 text-accent" />
          )}
        </div>
      </div>
    </header>
  );
}
