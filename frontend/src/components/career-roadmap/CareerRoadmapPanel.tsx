"use client";

import { motion } from "framer-motion";
import { Sparkles, BookOpen, ExternalLink } from "lucide-react";

const LEARNING = [
  { title: "System Design Interview Vol. 2", type: "Book", time: "20h", priority: "Critical" },
  { title: "MIT 6.824 Distributed Systems", type: "Course", time: "40h", priority: "Critical" },
  { title: "Staff Engineer: Leadership Beyond Management", type: "Book", time: "8h", priority: "High" },
  { title: "AWS Solutions Architect Pro", type: "Cert", time: "60h", priority: "High" },
];

const STATS = [
  { label: "Avg Time to Promotion", value: "18mo" },
  { label: "Success Rate", value: "73%" },
  { label: "Roadmaps Generated", value: "12K+" },
  { label: "Avg Salary Jump", value: "+42%" },
];

export function CareerRoadmapPanel() {
  return (
    <aside className="w-96 shrink-0 border-l border-border/50 bg-background/50 h-full flex flex-col">
      <div className="h-16 flex items-center px-6 border-b border-border/50 shrink-0 bg-background/80 backdrop-blur-md">
        <h2 className="font-semibold text-sm">Learning Plan</h2>
      </div>
      <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-8">

        <div>
          <h3 className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60 mb-4">Recommended Resources</h3>
          <div className="space-y-3">
            {LEARNING.map((r, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                className="p-4 rounded-xl border border-border/50 bg-card hover:border-accent/30 transition-all cursor-pointer group">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <p className="text-sm font-medium group-hover:text-accent transition-colors leading-snug">{r.title}</p>
                  <ExternalLink className="w-3.5 h-3.5 text-muted-foreground/40 group-hover:text-accent transition-colors shrink-0 mt-0.5" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-medium bg-muted text-muted-foreground px-2 py-0.5 rounded-full">{r.type}</span>
                  <span className="text-[10px] text-muted-foreground">{r.time}</span>
                  <span className={`ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    r.priority === "Critical" ? "bg-red-500/10 text-red-500" : "bg-orange-500/10 text-orange-500"}`}>
                    {r.priority}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60 mb-4">Platform Stats</h3>
          <div className="grid grid-cols-2 gap-3">
            {STATS.map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.08 }}
                className="p-4 rounded-2xl border border-border/50 bg-card text-center">
                <p className="text-xl font-bold text-accent">{s.value}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-accent/5 border border-accent/20">
          <div className="flex items-center gap-2 mb-2 text-accent">
            <Sparkles className="w-4 h-4" />
            <span className="text-xs font-bold">Smart Learning</span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            The AI adapts your plan weekly based on your progress and new opportunities in the job market.
          </p>
        </div>
      </div>
    </aside>
  );
}
