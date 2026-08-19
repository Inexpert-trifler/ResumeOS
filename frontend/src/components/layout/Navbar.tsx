"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useLayoutEffect } from "react";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/shared/Container";
import { Logo } from "@/components/shared/Logo";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Sparkles, X, LayoutDashboard, Layers, GraduationCap, PenTool, Target, Sparkles as CoachIcon, Briefcase, FileText, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { UserButton, useUser } from "@clerk/nextjs";

const NAV_LINKS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/templates", label: "Templates", icon: Layers },
  { href: "/academy", label: "Academy", icon: GraduationCap },
  { href: "/studio", label: "Studio", icon: PenTool },
  { href: "/analyzer", label: "Analyzer", icon: Target },
  { href: "/coach", label: "Coach", icon: CoachIcon },
  { href: "/tracker", label: "Tracker", icon: Briefcase },
];

export function Navbar() {
  const pathname = usePathname();
  const { isSignedIn } = useUser();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change — useLayoutEffect avoids visible flicker
  useLayoutEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMobileOpen(false);
  }, [pathname]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled
          ? "border-b border-border/60 bg-background/90 backdrop-blur-xl shadow-sm"
          : "border-b border-transparent bg-background/60 backdrop-blur-md"
      )}
    >
      <Container>
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0 group">
            <Logo size="md" className="group-hover:opacity-90 transition-opacity" />
            <span className="font-bold text-base tracking-tight">
              Resume<span className="text-accent">OS</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1" aria-label="Main navigation">
            {NAV_LINKS.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "relative flex items-center px-3 py-1.5 text-sm font-medium rounded-lg transition-all duration-150",
                    active
                      ? "text-accent bg-accent/8"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  {active && (
                    <motion.div
                      layoutId="navActiveIndicator"
                      className="absolute inset-0 rounded-lg bg-accent/8"
                      transition={{ type: "spring", stiffness: 400, damping: 35 }}
                    />
                  )}
                  <span className="relative z-10">{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            <ThemeToggle />

            <Link href="/builder" className="hidden sm:block">
              <Button size="sm" className="rounded-full px-4 h-8 text-xs font-semibold shadow-sm shadow-accent/10 hover:shadow-accent/20 transition-shadow">
                <FileText className="w-3.5 h-3.5 mr-1.5" />
                Build Resume
              </Button>
            </Link>

            {!isSignedIn && <>
              <Link href="/sign-in" className="hidden sm:block">
                <Button variant="ghost" size="sm" className="rounded-full px-3 h-8 text-xs">Sign in</Button>
              </Link>
              <Link href="/sign-up" className="hidden sm:block">
                <Button size="sm" className="rounded-full px-3 h-8 text-xs">Sign up</Button>
              </Link>
            </>}
            {isSignedIn && (
              <UserButton userProfileUrl="/user-profile" />
            )}

            {/* Mobile Hamburger */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger
                render={
                  <button
                    className="lg:hidden flex items-center justify-center w-9 h-9 rounded-lg border border-border/50 bg-background hover:bg-muted transition-colors"
                    aria-label="Open menu"
                  />
                }
              >
                <AnimatePresence mode="wait" initial={false}>
                  {mobileOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.15 }}
                    >
                      <X className="w-4 h-4" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="open"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.15 }}
                    >
                      <Menu className="w-4 h-4" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </SheetTrigger>

              <SheetContent side="left" className="w-72 p-0 border-border/50">
                <SheetHeader className="p-6 pb-4 border-b border-border/50">
                  <SheetTitle>
                    <Link href="/" className="flex items-center gap-2">
                      <Logo size="md" />
                      <span className="font-bold text-base">
                        Resume<span className="text-accent">OS</span>
                      </span>
                    </Link>
                  </SheetTitle>
                </SheetHeader>

                <nav className="p-4 space-y-1" aria-label="Mobile navigation">
                  {NAV_LINKS.map((link, i) => {
                    const active = isActive(link.href);
                    const Icon = link.icon;
                    return (
                      <motion.div
                        key={link.href}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.04, duration: 0.2 }}
                      >
                        <Link
                          href={link.href}
                          className={cn(
                            "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group",
                            active
                              ? "bg-accent/10 text-accent"
                              : "text-muted-foreground hover:bg-muted hover:text-foreground"
                          )}
                        >
                          <Icon className={cn("w-4.5 h-4.5 shrink-0", active ? "text-accent" : "text-muted-foreground group-hover:text-foreground")} />
                          <span className="flex-1">{link.label}</span>
                          {active && <ChevronRight className="w-3.5 h-3.5 text-accent/60" />}
                        </Link>
                      </motion.div>
                    );
                  })}
                </nav>

                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border/50 bg-background">
                  <Link href="/builder" className="w-full block">
                    <Button className="w-full rounded-full gap-2">
                      <FileText className="w-4 h-4" />
                      Build Resume
                    </Button>
                  </Link>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </Container>
    </header>
  );
}
