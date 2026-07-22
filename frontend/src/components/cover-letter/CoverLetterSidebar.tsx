"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, FileText, Briefcase, Palette, Sparkles, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = [
  { label: "Select Resume", icon: FileText, done: true },
  { label: "Paste Job Description", icon: Briefcase, done: false },
  { label: "Choose Tone", icon: Palette, done: false },
  { label: "Generate Letter", icon: Sparkles, done: false },
];

const TONES = [
  { label: "Professional", desc: "Formal & structured" },
  { label: "Confident", desc: "Bold & assertive" },
  { label: "Friendly", desc: "Warm & approachable" },
  { label: "Creative", desc: "Unique & memorable" },
];

export function CoverLetterSidebar() {
  return (
    <aside className="w-80 shrink-0 border-r border-border/50 bg-background/50 h-full flex flex-col relative">
      <div className="h-16 flex items-center px-6 border-b border-border/50 shrink-0">
        <Link href="/dashboard" className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
      </div>

      <div className="p-6 flex-1 overflow-y-auto no-scrollbar space-y-8">

        <div>
          <h3 className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60 mb-4">Generation Steps</h3>
          <div className="space-y-3 relative before:absolute before:inset-0 before:ml-[11px] before:-translate-x-px before:h-full before:w-px before:bg-gradient-to-b before:from-border/80 before:to-transparent">
            {STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={i} className="relative flex items-center gap-4">
                  <div className={cn("w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 z-10 transition-all",
                    step.done ? "bg-accent border-accent text-white" : i === 1 ? "bg-background border-accent" : "bg-background border-muted")}>
                    {step.done ? <CheckCircle className="w-3 h-3" /> : <div className={cn("w-1.5 h-1.5 rounded-full", i === 1 ? "bg-accent animate-pulse" : "bg-muted-foreground/30")} />}
                  </div>
                  <div className="flex items-center gap-2">
                    <Icon className={cn("w-4 h-4", step.done ? "text-accent" : i === 1 ? "text-accent" : "text-muted-foreground/40")} />
                    <span className={cn("text-sm", step.done || i === 1 ? "text-foreground font-medium" : "text-muted-foreground/50")}>{step.label}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div>
          <h3 className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60 mb-4">Tone Presets</h3>
          <div className="space-y-2">
            {TONES.map((tone, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}
                className={cn("flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all",
                  i === 0 ? "border-accent/50 bg-accent/5" : "border-border/50 bg-card hover:border-accent/30")}>
                <div>
                  <p className="text-sm font-medium">{tone.label}</p>
                  <p className="text-[10px] text-muted-foreground">{tone.desc}</p>
                </div>
                {i === 0 && <div className="w-2 h-2 rounded-full bg-accent" />}
              </motion.div>
            ))}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-accent/5 border border-accent/20">
          <div className="flex items-center gap-2 mb-2 text-accent">
            <Sparkles className="w-4 h-4" />
            <span className="text-xs font-bold">Personalization Engine</span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Our AI matches your resume skills to the job description and writes a letter that feels genuinely personal, not templated.
          </p>
        </div>
      </div>
    </aside>
  );
}
