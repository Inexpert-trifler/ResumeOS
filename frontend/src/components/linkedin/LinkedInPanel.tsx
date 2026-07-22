"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

const REWRITES = [
  {
    label: "Headline",
    before: "Software Engineer at Fintech Corp",
    after: "Senior SWE | Scaling Payment Systems to 10M+ Users | Go · Distributed Systems · AWS",
  },
  {
    label: "Summary Opening",
    before: "I am a software engineer with 5 years of experience...",
    after: "I build systems that don't break when it matters most. 5 years shipping infra at fintech scale — from 0 to 10M+ TPS.",
  },
];

export function LinkedInPanel() {
  return (
    <aside className="w-96 shrink-0 border-l border-border/50 bg-background/50 h-full flex flex-col">
      <div className="h-16 flex items-center px-6 border-b border-border/50 shrink-0 bg-background/80 backdrop-blur-md">
        <h2 className="font-semibold text-sm">AI Rewrites Preview</h2>
      </div>
      <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-6">
        <h3 className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">Before → After</h3>
        {REWRITES.map((r, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.15 }}
            className="space-y-3">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{r.label}</p>
            <div className="p-3 rounded-xl border border-red-500/20 bg-red-500/5">
              <p className="text-[10px] text-red-500 font-semibold uppercase mb-1">Before</p>
              <p className="text-xs text-foreground/70 italic">"{r.before}"</p>
            </div>
            <div className="p-3 rounded-xl border border-green-500/20 bg-green-500/5">
              <p className="text-[10px] text-green-500 font-semibold uppercase mb-1">After</p>
              <p className="text-xs text-foreground font-medium">"{r.after}"</p>
            </div>
          </motion.div>
        ))}

        <div className="p-4 rounded-2xl bg-accent/5 border border-accent/20 mt-4">
          <div className="flex items-center gap-2 mb-2 text-accent">
            <Sparkles className="w-4 h-4" />
            <span className="text-xs font-bold">Why It Works</span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Optimized headlines get 3x more profile clicks. The AI front-loads your strongest value prop and embeds keywords naturally.
          </p>
        </div>
      </div>
    </aside>
  );
}
