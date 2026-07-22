"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const SECTIONS = [
  { id: "intro", label: "Introduction" },
  { id: "fundamentals", label: "Resume Fundamentals" },
  { id: "sections", label: "Resume Sections" },
  { id: "length", label: "Resume Length" },
  { id: "ats", label: "ATS Learning" },
  { id: "mistakes", label: "Resume Mistakes" },
  { id: "role-based", label: "Role Based Resume" },
  { id: "examples", label: "Resume Examples" },
  { id: "recruiter", label: "Recruiter Perspective" },
  { id: "faqs", label: "FAQs" },
];

export function AcademySidebar() {
  const [activeSection, setActiveSection] = useState<string>("intro");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // Find the first entry that is intersecting
        const intersectingEntry = entries.find((entry) => entry.isIntersecting);
        if (intersectingEntry) {
          setActiveSection(intersectingEntry.target.id);
        }
      },
      {
        rootMargin: "-20% 0px -80% 0px", // Trigger when top of section is near the top of the viewport
      }
    );

    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      // Lenis or native scroll will handle smooth behavior
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <aside className="w-64 shrink-0 hidden lg:block border-r border-border/50 pr-6">
      <div className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto">
        <h3 className="font-bold text-lg mb-6 tracking-tight">Course Modules</h3>
        <nav className="flex flex-col gap-1">
          {SECTIONS.map(({ id, label }) => {
            const isActive = activeSection === id;
            return (
              <a
                key={id}
                href={`#${id}`}
                onClick={(e) => handleClick(e, id)}
                className={cn(
                  "px-3 py-2 rounded-lg text-sm font-medium transition-all relative overflow-hidden",
                  isActive
                    ? "text-accent bg-accent/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4 bg-accent rounded-r-full" />
                )}
                {label}
              </a>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
