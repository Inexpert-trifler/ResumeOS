"use client";

import { motion } from "framer-motion";
import { Sparkles, Map, CheckCircle2 } from "lucide-react";
import { useRoadmapStore } from "@/stores/useRoadmapStore";

export function CareerRoadmapPanel() {
  const { activeRoadmap, items, progress } = useRoadmapStore();

  return (
    <aside className="w-96 shrink-0 border-l border-border/50 bg-background/50 h-full flex flex-col">
      <div className="h-16 flex items-center px-6 border-b border-border/50 shrink-0 bg-background/80 backdrop-blur-md">
        <h2 className="font-semibold text-sm flex items-center gap-2">
          <Map className="w-4 h-4 text-accent" />
          <span>Roadmap Inspector</span>
        </h2>
      </div>
      <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-8">

        {/* Active Roadmap Info */}
        {activeRoadmap ? (
          <div>
            <h3 className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60 mb-3">Active Growth Path</h3>
            <div className="p-5 rounded-2xl border border-border/50 bg-card space-y-3 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm">{activeRoadmap.targetRole}</span>
                <span className="text-xs font-bold text-accent">{progress}% Complete</span>
              </div>

              <div className="pt-2 border-t border-border/30 text-xs space-y-1.5 text-muted-foreground">
                <div className="flex justify-between">
                  <span>Total Milestones:</span>
                  <strong className="text-foreground">{items.length}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Completed:</span>
                  <strong className="text-emerald-500">{items.filter((i) => i.status === "COMPLETED").length}</strong>
                </div>
                <div className="flex justify-between">
                  <span>In Progress:</span>
                  <strong className="text-accent">{items.filter((i) => i.status === "IN_PROGRESS").length}</strong>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <h3 className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60 mb-3">Roadmap Insights</h3>
            <div className="p-5 rounded-2xl border border-border/50 bg-card text-xs text-muted-foreground space-y-2">
              <p className="font-semibold text-foreground">Personalized Career Growth</p>
              <p>Generate a roadmap to get step-by-step milestones tailored to your target role and ATS skill gaps.</p>
            </div>
          </div>
        )}

        <div>
          <h3 className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60 mb-3">Career Best Practices</h3>
          <div className="space-y-3">
            <div className="p-4 rounded-xl border border-border/50 bg-card">
              <p className="text-xs font-semibold text-foreground mb-1">Focus on Skill Gaps</p>
              <p className="text-xs text-muted-foreground leading-relaxed">Prioritize high-priority missing ATS skills to maximize resume match rates.</p>
            </div>
            <div className="p-4 rounded-xl border border-border/50 bg-card">
              <p className="text-xs font-semibold text-foreground mb-1">Build Proof of Work</p>
              <p className="text-xs text-muted-foreground leading-relaxed">Combine course learning with tangible open-source or portfolio projects.</p>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-accent/5 border border-accent/20">
          <div className="flex items-center gap-2 mb-2 text-accent">
            <Sparkles className="w-4 h-4" />
            <span className="text-xs font-bold">Dynamic Progress</span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            As you check off completed milestones, your overall progress percentage is updated deterministically in PostgreSQL.
          </p>
        </div>
      </div>
    </aside>
  );
}
