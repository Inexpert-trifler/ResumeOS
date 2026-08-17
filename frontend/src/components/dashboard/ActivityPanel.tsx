"use client";

import { motion } from "framer-motion";
import { ACTIVITY_FEED, UPCOMING_FEATURES } from "@/data/mock-dashboard";
import { PlusCircle, CheckCircle, Download, Edit3, Code2 as Github, Link2 as Linkedin, Sparkles } from "lucide-react";

const ICON_MAP: Record<string, React.ElementType> = {
  PlusCircle,
  CheckCircle,
  Download,
  Edit3,
  Github,
  Linkedin,
  Sparkles,
};

export function DashboardActivityPanel() {
  return (
    <aside className="w-80 h-full border-l border-border/50 bg-background/50 flex flex-col shrink-0 overflow-y-auto no-scrollbar">
      <div className="p-6">
        <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-6">Recent Activity</h2>
        
        {/* Timeline */}
        <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border/50 before:to-transparent">
          {ACTIVITY_FEED.map((activity, i) => {
            const Icon = ICON_MAP[activity.icon] || Edit3;
            return (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
              >
                {/* Icon */}
                <div className="flex items-center justify-center w-10 h-10 rounded-full border border-background bg-card shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                  <Icon className="w-4 h-4 text-muted-foreground" />
                </div>
                {/* Card */}
                <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-border/50 bg-card shadow-sm">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-sm text-foreground">{activity.title}</h3>
                  </div>
                  {activity.description && (
                    <p className="text-xs text-muted-foreground mb-2">{activity.description}</p>
                  )}
                  <time className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                    {activity.time}
                  </time>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Learning / Tips */}
        <div className="mt-12">
          <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">Resume Tip</h2>
          <div className="p-4 rounded-2xl bg-accent/5 border border-accent/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
              <Sparkles className="w-16 h-16 transform translate-x-4 -translate-y-4 text-accent" />
            </div>
            <p className="text-sm text-foreground font-medium mb-2">Quantify your impact</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Use the STAR method (Situation, Task, Action, Result) in your bullet points. Resumes with quantifiable metrics score 40% higher in ATS scans.
            </p>
          </div>
        </div>

        {/* Upcoming Features */}
        <div className="mt-12">
          <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">Coming Soon</h2>
          <div className="space-y-3">
            {UPCOMING_FEATURES.map((feat, i) => {
              const Icon = ICON_MAP[feat.icon] || Sparkles;
              return (
                <motion.div
                  key={feat.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="p-4 rounded-xl border border-border/50 bg-card/50 flex items-start gap-3 opacity-70 hover:opacity-100 transition-opacity"
                >
                  <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-foreground">{feat.title}</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">{feat.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </aside>
  );
}
