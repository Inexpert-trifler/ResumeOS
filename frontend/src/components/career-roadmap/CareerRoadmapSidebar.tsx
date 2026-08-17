"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Target, Clock, Sparkles, CheckCircle } from "lucide-react";

const GOALS = [
  { label: "Staff Engineer", active: true, timeline: "18 months" },
  { label: "Engineering Manager", active: false, timeline: "24 months" },
  { label: "Principal Engineer", active: false, timeline: "36 months" },
];

const READINESS = [
  { label: "Technical Skills", value: 65 },
  { label: "Leadership", value: 35 },
  { label: "Visibility", value: 48 },
  { label: "Interview Readiness", value: 42 },
];

export function CareerRoadmapSidebar() {
  return (
    <aside className="w-80 shrink-0 border-r border-border/50 bg-background/50 h-full flex flex-col">
      <div className="h-16 flex items-center px-6 border-b border-border/50 shrink-0">
        <Link href="/dashboard" className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
      </div>

      <div className="p-6 flex-1 overflow-y-auto no-scrollbar space-y-8">

        {/* Goal Selection */}
        <div>
          <h3 className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60 mb-4">Career Goals</h3>
          <div className="space-y-2">
            {GOALS.map((g, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${g.active ? "border-accent/50 bg-accent/5" : "border-border/50 bg-card hover:border-accent/30"}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${g.active ? "bg-accent" : "bg-muted"}`}>
                  {g.active ? <CheckCircle className="w-3.5 h-3.5 text-white" /> : <Target className="w-3 h-3 text-muted-foreground" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium truncate ${g.active ? "text-accent" : "text-muted-foreground"}`}>{g.label}</p>
                  <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3" />{g.timeline}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Readiness Scores */}
        <div>
          <h3 className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60 mb-4">Readiness</h3>
          <div className="space-y-4">
            {READINESS.map((r, i) => (
              <div key={i}>
                <div className="flex justify-between mb-1.5">
                  <span className="text-xs text-muted-foreground">{r.label}</span>
                  <span className="text-xs font-bold text-accent">{r.value}%</span>
                </div>
                <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${r.value}%` }} transition={{ duration: 1, ease: "easeOut", delay: i * 0.15 }}
                    className="h-full bg-accent rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-accent/5 border border-accent/20">
          <div className="flex items-center gap-2 mb-2 text-accent">
            <Sparkles className="w-4 h-4" />
            <span className="text-xs font-bold">Estimated Timeline</span>
          </div>
          <p className="text-2xl font-black text-accent mb-1">18 months</p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Based on your current trajectory and weekly commitment of 5 hours of focused growth.
          </p>
        </div>
      </div>
    </aside>
  );
}
