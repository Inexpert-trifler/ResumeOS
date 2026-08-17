"use client";

import { motion } from "framer-motion";
import { Sparkles, CheckCircle2, Clock } from "lucide-react";

const STATS = [
  { label: "Questions Bank", value: "2,400+" },
  { label: "Companies Covered", value: "120+" },
  { label: "Avg Offer Rate", value: "3.2x" },
  { label: "Mock Sessions", value: "50k+" },
];

const TIMELINE = [
  { week: "Week 1", focus: "DSA Foundations", done: true },
  { week: "Week 2", focus: "System Design Basics", done: true },
  { week: "Week 3", focus: "Behavioral + STAR", done: false },
  { week: "Week 4", focus: "Full Mock Interviews", done: false },
];

const TIPS = [
  "Use the STAR method for every behavioral question",
  "Always clarify requirements before coding",
  "Think aloud — interviewers value your thought process",
  "Ask smart questions at the end of every round",
];

export function InterviewPanel() {
  return (
    <aside className="w-96 shrink-0 border-l border-border/50 bg-background/50 h-full flex flex-col">
      <div className="h-16 flex items-center px-6 border-b border-border/50 shrink-0 bg-background/80 backdrop-blur-md">
        <h2 className="font-semibold text-sm">Prep Insights</h2>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-8">

        {/* Stats */}
        <div>
          <h3 className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60 mb-4">Platform Stats</h3>
          <div className="grid grid-cols-2 gap-3">
            {STATS.map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                className="p-4 rounded-2xl border border-border/50 bg-card text-center">
                <p className="text-xl font-bold text-accent">{s.value}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* 4-Week Timeline */}
        <div>
          <h3 className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60 mb-4">Prep Timeline</h3>
          <div className="space-y-3">
            {TIMELINE.map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                className={`flex items-center gap-3 p-3 rounded-xl border transition-colors ${item.done ? "border-accent/30 bg-accent/5" : "border-border/50 bg-card"}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${item.done ? "bg-accent" : "bg-muted"}`}>
                  {item.done
                    ? <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                    : <Clock className="w-3.5 h-3.5 text-muted-foreground" />}
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground">{item.week}</p>
                  <p className="text-sm font-medium">{item.focus}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Tips */}
        <div>
          <h3 className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60 mb-4">Pro Tips</h3>
          <div className="space-y-2">
            {TIPS.map((tip, i) => (
              <div key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                <span className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 shrink-0" />
                {tip}
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-accent/5 border border-accent/20">
          <div className="flex items-center gap-2 mb-2 text-accent">
            <Sparkles className="w-4 h-4" />
            <span className="text-xs font-bold">Voice Analysis</span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Upcoming: real-time speech analysis detects filler words, pacing, and confidence signals.
          </p>
        </div>
      </div>
    </aside>
  );
}
