"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, UploadCloud, Brain, UserCheck, BarChart3, CheckCircle, Clock, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = [
  { id: 1, label: "Upload Resume", icon: UploadCloud, status: "active" },
  { id: 2, label: "AI Analysis", icon: Brain, status: "upcoming" },
  { id: 3, label: "Recruiter Review", icon: UserCheck, status: "upcoming" },
  { id: 4, label: "ATS Simulation", icon: BarChart3, status: "upcoming" },
  { id: 5, label: "Final Score", icon: CheckCircle, status: "upcoming" },
];

const RECENT = [
  { name: "Software Engineer Resume", score: 87, date: "2 days ago" },
  { name: "Product Manager Resume", score: 74, date: "1 week ago" },
  { name: "Data Analyst Resume", score: 91, date: "2 weeks ago" },
];

export function ReviewSidebar() {
  return (
    <aside className="w-80 shrink-0 border-r border-border/50 bg-background/50 h-full flex flex-col relative">
      <div className="h-16 flex items-center px-6 border-b border-border/50 shrink-0">
        <Link href="/dashboard" className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
      </div>

      <div className="p-6 flex-1 overflow-y-auto no-scrollbar space-y-8">

        {/* Analysis Pipeline */}
        <div>
          <h3 className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60 mb-4">Analysis Pipeline</h3>
          <div className="space-y-3 relative before:absolute before:inset-0 before:ml-[11px] before:-translate-x-px before:h-full before:w-px before:bg-gradient-to-b before:from-border/80 before:to-transparent">
            {STEPS.map((step) => {
              const Icon = step.icon;
              const isActive = step.status === "active";
              const isDone = step.status === "completed";
              return (
                <div key={step.id} className="relative flex items-center gap-4">
                  <div className={cn(
                    "w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 z-10 transition-all",
                    isDone ? "bg-accent border-accent text-white" :
                    isActive ? "bg-background border-accent" :
                    "bg-background border-muted"
                  )}>
                    {isDone ? <CheckCircle className="w-3 h-3" /> :
                     isActive ? <div className="w-2 h-2 rounded-full bg-accent animate-pulse" /> :
                     <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/30" />}
                  </div>
                  <div className="flex items-center gap-2">
                    <Icon className={cn("w-4 h-4", isActive ? "text-accent" : "text-muted-foreground/40")} />
                    <span className={cn("text-sm", isActive ? "text-foreground font-semibold" : "text-muted-foreground/50")}>{step.label}</span>
                    {isActive && (
                      <div className="flex items-center gap-1 text-[10px] text-accent font-medium">
                        <Clock className="w-3 h-3" />
                        <span>Next</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Reviews */}
        <div>
          <h3 className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60 mb-4">Recent Reviews</h3>
          <div className="space-y-3">
            {RECENT.map((r, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-3 rounded-xl border border-border/50 bg-card hover:border-accent/30 transition-colors cursor-pointer group"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-xs font-medium text-foreground/80 group-hover:text-foreground transition-colors leading-snug">{r.name}</p>
                  <span className={cn(
                    "text-xs font-bold shrink-0 px-1.5 py-0.5 rounded-md",
                    r.score >= 85 ? "bg-green-500/10 text-green-500" :
                    r.score >= 70 ? "bg-yellow-500/10 text-yellow-500" :
                    "bg-red-500/10 text-red-500"
                  )}>{r.score}</span>
                </div>
                <p className="text-[10px] text-muted-foreground/50 mt-1">{r.date}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* AI Badge */}
        <div className="p-4 rounded-2xl bg-accent/5 border border-accent/20">
          <div className="flex items-center gap-2 mb-2 text-accent">
            <Sparkles className="w-4 h-4" />
            <span className="text-xs font-bold">AI-Powered Analysis</span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Our AI reviews your resume against 50,000+ successful resumes and provides personalized improvement suggestions.
          </p>
        </div>
      </div>
    </aside>
  );
}
