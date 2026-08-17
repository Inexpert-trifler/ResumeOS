"use client";

import { motion } from "framer-motion";
import { BuilderState, STEP_LABELS } from '@/types';
import { CheckCircle2, Circle, AlertCircle, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface BuilderSidebarProps {
  state: BuilderState;
  onGoToStep: (step: number) => void;
}

function calcCompletionScore(state: BuilderState): { score: number; missing: string[] } {
  const missing: string[] = [];
  let score = 0;
  const total = 10;

  if (state.careerGoal) score++;
  else missing.push("Career Goal");

  if (state.targetRole) score++;
  else missing.push("Target Role");

  if (state.experienceLevel) score++;
  else missing.push("Experience Level");

  const p = state.personalInfo;
  if (p.firstName && p.email && p.phone) score++;
  else missing.push("Personal Info");

  if (state.summary.length > 100) score++;
  else missing.push("Professional Summary");

  if (state.skills.length >= 3) score++;
  else missing.push("Skills (3+ recommended)");

  if (state.projects.length >= 1) score++;
  else missing.push("Projects");

  if (state.experience.length >= 1) score++;
  else missing.push("Work Experience");

  if (state.education.length >= 1) score++;
  else missing.push("Education");

  if (state.achievements.length >= 1 || state.certificates.length >= 1) score++;
  else missing.push("Achievements or Certs");

  return { score: Math.round((score / total) * 100), missing };
}

export function BuilderSidebar({ state, onGoToStep }: BuilderSidebarProps) {
  const { score, missing } = calcCompletionScore(state);

  const circumference = 2 * Math.PI * 40;
  const dashOffset = circumference - (score / 100) * circumference;

  return (
    <aside className="hidden xl:flex w-72 shrink-0 flex-col gap-6 sticky top-36 max-h-[calc(100vh-10rem)] overflow-y-auto pr-2">
      
      {/* Circular Progress */}
      <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm">
        <h3 className="font-bold text-sm mb-4 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-accent" /> Resume Strength
        </h3>
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-28 h-28">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" strokeWidth="8" className="stroke-muted fill-none" />
              <motion.circle
                cx="50" cy="50" r="40" strokeWidth="8"
                className="fill-none stroke-accent"
                strokeLinecap="round"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset: dashOffset }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold">{score}</span>
              <span className="text-xs text-muted-foreground">/ 100</span>
            </div>
          </div>
          <div className={cn(
            "text-sm font-semibold px-3 py-1 rounded-full",
            score < 30 ? "bg-destructive/10 text-destructive" :
            score < 70 ? "bg-orange-500/10 text-orange-500" :
            "bg-green-500/10 text-green-500"
          )}>
            {score < 30 ? "Just Started" : score < 70 ? "Good Progress" : "Almost There!"}
          </div>
        </div>
      </div>

      {/* Missing Sections */}
      {missing.length > 0 && (
        <div className="bg-card border border-border/50 rounded-2xl p-4 shadow-sm">
          <h3 className="font-bold text-sm mb-3 flex items-center gap-2 text-orange-500">
            <AlertCircle className="w-4 h-4" /> Missing Sections
          </h3>
          <div className="space-y-2">
            {missing.slice(0, 5).map((m, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                <Circle className="w-3 h-3 shrink-0" />
                {m}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Steps Overview */}
      <div className="bg-card border border-border/50 rounded-2xl p-4 shadow-sm">
        <h3 className="font-bold text-sm mb-3 text-muted-foreground">Sections</h3>
        <div className="space-y-1">
          {STEP_LABELS.map((label, i) => {
            const done = i < state.currentStep;
            const active = i === state.currentStep;
            return (
              <button
                key={i}
                onClick={() => onGoToStep(i)}
                className={cn(
                  "w-full flex items-center gap-2 py-1.5 px-2 rounded-lg text-sm text-left transition-colors",
                  active ? "bg-accent/10 text-accent font-semibold" :
                  done ? "text-foreground/70 hover:bg-muted" :
                  "text-muted-foreground/50 hover:text-muted-foreground hover:bg-muted"
                )}
              >
                {done ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-accent shrink-0" />
                ) : (
                  <Circle className={cn("w-3.5 h-3.5 shrink-0", active ? "text-accent" : "text-muted-foreground/30")} />
                )}
                <span className="text-xs">{i + 1}. {label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tips */}
      <div className="bg-accent/5 border border-accent/20 rounded-2xl p-4">
        <h3 className="font-bold text-sm mb-2 text-accent">💡 Quick Tip</h3>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Use quantified achievements in your experience and summary. Numbers catch a recruiter&apos;s eye instantly.
        </p>
      </div>
    </aside>
  );
}
