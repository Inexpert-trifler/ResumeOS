"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { STEP_LABELS } from '@/types';
import { Check, Save, Clock } from "lucide-react";

interface BuilderProgressBarProps {
  currentStep: number;
  totalSteps: number;
  lastSaved: Date | null;
}

export function BuilderProgressBar({ currentStep, totalSteps, lastSaved }: BuilderProgressBarProps) {
  const percent = Math.round(((currentStep) / totalSteps) * 100);
  const remaining = totalSteps - currentStep;
  const estimatedMins = remaining * 2;

  return (
    <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border/50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-6">
        
        {/* Logo/Brand */}
        <div className="shrink-0 font-bold text-lg tracking-tight hidden md:block">
          Resume<span className="text-accent">OS</span>
        </div>

        {/* Progress Info */}
        <div className="flex-1 flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-sm">
            <span className="font-semibold text-foreground">
              Step {currentStep + 1}: <span className="text-muted-foreground font-normal">{STEP_LABELS[currentStep]}</span>
            </span>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
                <Clock className="w-3 h-3" />
                ~{estimatedMins} min left
              </div>
              <div className="flex items-center gap-1.5 text-accent text-xs font-semibold">
                {lastSaved ? (
                  <>
                    <Save className="w-3 h-3" />
                    <span className="hidden sm:inline">Saved</span>
                  </>
                ) : (
                  <>
                    <motion.div
                      className="w-2 h-2 rounded-full bg-orange-400"
                      animate={{ opacity: [1, 0.4, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                    <span className="hidden sm:inline text-orange-400">Auto-saving...</span>
                  </>
                )}
              </div>
              <span className="font-bold text-accent tabular-nums">{percent}%</span>
            </div>
          </div>

          {/* Bar */}
          <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-accent to-accent/70"
              animate={{ width: `${percent}%` }}
              transition={{ type: "spring", stiffness: 60, damping: 20 }}
            />
          </div>
        </div>
      </div>

      {/* Step Dots - hidden on tiny screens */}
      <div className="hidden md:flex items-center gap-1 justify-center pb-2 overflow-x-auto no-scrollbar px-4">
        {STEP_LABELS.map((label, i) => {
          const done = i < currentStep;
          const active = i === currentStep;
          return (
            <div key={i} className="flex items-center gap-1">
              <div
                title={label}
                className={cn(
                  "w-2 h-2 rounded-full transition-all duration-300",
                  done ? "bg-accent scale-100" : active ? "bg-accent/80 scale-125 ring-2 ring-accent/30" : "bg-muted-foreground/30"
                )}
              />
              {done && i < STEP_LABELS.length - 1 && (
                <div className="w-3 h-px bg-accent/50" />
              )}
              {!done && i < STEP_LABELS.length - 1 && (
                <div className="w-3 h-px bg-muted-foreground/20" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
