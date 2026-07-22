"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FadeUp } from "@/animations/FadeUp";
import { Code, Briefcase, Megaphone, Terminal, CheckCircle2, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

const ROLES = [
  { id: "swe", label: "Software Engineer", icon: Code },
  { id: "pm", label: "Product Manager", icon: Briefcase },
  { id: "marketing", label: "Marketing", icon: Megaphone },
];

const ROLE_DATA: Record<string, any> = {
  swe: {
    title: "Software Engineer Resume Guide",
    skills: ["Data Structures & Algorithms", "System Design", "Cloud (AWS/GCP)", "CI/CD", "Testing"],
    order: "1. Experience ➔ 2. Projects ➔ 3. Skills ➔ 4. Education",
    mistakes: ["Listing 20+ programming languages", "No link to GitHub", "Not quantifying performance improvements"],
    keywords: ["Architected", "Scaled", "Optimized", "Latency", "Microservices"],
  },
  pm: {
    title: "Product Manager Resume Guide",
    skills: ["Product Strategy", "Agile/Scrum", "Data Analytics", "A/B Testing", "Cross-functional Leadership"],
    order: "1. Experience ➔ 2. Education ➔ 3. Skills",
    mistakes: ["Focusing on outputs instead of outcomes", "Too technical, not enough business impact", "Lacking metrics"],
    keywords: ["Led", "Launched", "Increased Retention", "Roadmap", "Stakeholder Management"],
  },
  marketing: {
    title: "Marketing Resume Guide",
    skills: ["SEO/SEM", "Content Strategy", "Google Analytics", "Campaign Management", "Copywriting"],
    order: "1. Experience ➔ 2. Skills ➔ 3. Education",
    mistakes: ["No portfolio link", "Vague descriptions of campaigns", "Not mentioning budget sizes"],
    keywords: ["Generated", "Conversion Rate", "Campaign", "ROAS", "Brand Awareness"],
  },
};

export function RoleBasedGuideSection() {
  const [activeRole, setActiveRole] = useState("swe");
  const data = ROLE_DATA[activeRole];

  return (
    <section id="role-based" className="py-12 border-b border-border/50">
      <FadeUp>
        <div className="inline-block px-3 py-1 mb-6 rounded-full bg-accent/10 text-accent text-sm font-semibold tracking-wide uppercase">
          Section 7: Role-Based Guidance
        </div>
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">
          Tailored For Your Industry
        </h2>
        <p className="text-lg text-muted-foreground leading-relaxed mb-12 max-w-3xl">
          A software engineer's resume should look drastically different from a graphic designer's. Select your role to see specific guidelines.
        </p>
      </FadeUp>

      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Sticky Left Panel for Roles */}
        <div className="w-full md:w-64 shrink-0 md:sticky top-32 flex flex-col gap-2">
          {ROLES.map((role) => (
            <button
              key={role.id}
              onClick={() => setActiveRole(role.id)}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium",
                activeRole === role.id
                  ? "bg-foreground text-background shadow-md"
                  : "bg-muted/50 hover:bg-muted text-foreground"
              )}
            >
              <role.icon className="w-4 h-4" />
              {role.label}
            </button>
          ))}
          <div className="mt-4 p-4 rounded-xl bg-accent/5 border border-accent/20 text-xs text-muted-foreground text-center">
            More roles coming soon...
          </div>
        </div>

        {/* Dynamic Right Panel */}
        <div className="flex-1 w-full bg-card border border-border/50 rounded-2xl p-6 md:p-8 shadow-sm min-h-[400px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeRole}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <h3 className="text-2xl font-bold mb-8 flex items-center gap-3 border-b border-border/50 pb-4">
                <Terminal className="w-6 h-6 text-accent" />
                {data.title}
              </h3>

              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-semibold text-lg mb-4 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500" /> Must-Have Skills
                  </h4>
                  <ul className="space-y-2">
                    {data.skills.map((skill: string, i: number) => (
                      <li key={i} className="text-muted-foreground text-sm flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent" /> {skill}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-lg mb-4 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-destructive" /> Common Mistakes
                  </h4>
                  <ul className="space-y-2">
                    {data.mistakes.map((mistake: string, i: number) => (
                      <li key={i} className="text-muted-foreground text-sm flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-destructive" /> {mistake}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="md:col-span-2">
                  <h4 className="font-semibold text-lg mb-4">Recommended Section Order</h4>
                  <div className="p-4 bg-muted/50 rounded-lg font-mono text-sm border border-border/50 text-accent">
                    {data.order}
                  </div>
                </div>

                <div className="md:col-span-2">
                  <h4 className="font-semibold text-lg mb-4">Power Keywords</h4>
                  <div className="flex flex-wrap gap-2">
                    {data.keywords.map((kw: string, i: number) => (
                      <span key={i} className="px-3 py-1 bg-accent/10 text-accent rounded-full text-xs font-semibold">
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
