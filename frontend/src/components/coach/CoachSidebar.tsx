"use client";

import { motion } from "framer-motion";
import { PROGRESS_STEPS } from "@/data/mock-coach";
import { Check, Clock, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function CoachSidebar() {
  const completionPercentage = 35; // Mock completion
  
  return (
    <aside className="w-80 shrink-0 border-r border-border/50 bg-background/50 h-full flex flex-col relative">
      {/* Header */}
      <div className="h-16 flex items-center px-6 border-b border-border/50 shrink-0">
        <Link href="/dashboard" className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
      </div>

      <div className="p-6 flex-1 overflow-y-auto no-scrollbar">
        {/* Overall Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Resume Completion</h3>
            <span className="text-sm font-bold text-accent">{completionPercentage}%</span>
          </div>
          <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${completionPercentage}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full bg-accent rounded-full"
            />
          </div>
        </div>

        {/* Steps Stepper */}
        <div className="space-y-6 relative before:absolute before:inset-0 before:ml-[11px] before:-translate-x-px before:h-full before:w-px before:bg-gradient-to-b before:from-border/80 before:to-transparent">
          {PROGRESS_STEPS.map((step, i) => {
            const isCompleted = step.status === "completed";
            const isActive = step.status === "active";
            const isUpcoming = step.status === "upcoming";

            return (
              <div key={step.name} className="relative flex items-center group">
                {/* Step Indicator */}
                <div className={cn(
                  "w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 z-10 transition-colors",
                  isCompleted ? "bg-accent border-accent text-white" : 
                  isActive ? "bg-background border-accent" : 
                  "bg-background border-muted"
                )}>
                  {isCompleted && <Check className="w-3.5 h-3.5" />}
                  {isActive && <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />}
                </div>

                {/* Content */}
                <div className="ml-4 flex-1">
                  <h4 className={cn(
                    "text-sm font-medium transition-colors",
                    isCompleted ? "text-muted-foreground" :
                    isActive ? "text-foreground font-bold" :
                    "text-muted-foreground/50"
                  )}>
                    {step.name}
                  </h4>
                  {isActive && (
                    <div className="flex items-center gap-1.5 mt-1 text-xs font-medium text-accent">
                      <Clock className="w-3.5 h-3.5" />
                      <span>~5 mins remaining</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
