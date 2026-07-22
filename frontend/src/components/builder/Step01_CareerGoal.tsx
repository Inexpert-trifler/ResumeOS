"use client";

import { StepWrapper } from "./StepWrapper";
import { BuilderState, CareerGoal } from '@/types';
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  GraduationCap, Briefcase, RefreshCw, TrendingUp, BookOpen, Laptop, Globe, Wrench
} from "lucide-react";

const GOALS: { value: CareerGoal; label: string; icon: React.ElementType; description: string }[] = [
  { value: "Internship", label: "Internship", icon: GraduationCap, description: "Land your first internship" },
  { value: "Full Time", label: "Full Time", icon: Briefcase, description: "Get a full-time position" },
  { value: "Career Switch", label: "Career Switch", icon: RefreshCw, description: "Transition to a new industry" },
  { value: "Promotion", label: "Promotion", icon: TrendingUp, description: "Move up at your current company" },
  { value: "Higher Studies", label: "Higher Studies", icon: BookOpen, description: "Apply for grad school or MBA" },
  { value: "Freelance", label: "Freelance", icon: Laptop, description: "Build a freelance client base" },
  { value: "Remote Job", label: "Remote Job", icon: Globe, description: "Find a remote-first company" },
  { value: "Custom", label: "Custom", icon: Wrench, description: "Define your own goal" },
];

interface Step01Props {
  state: BuilderState;
  update: (partial: Partial<BuilderState>) => void;
}

export function Step01_CareerGoal({ state, update }: Step01Props) {
  return (
    <StepWrapper
      badge="Step 1"
      title="What's your career goal?"
      description="This helps us tailor your resume structure and content to match exactly what recruiters want to see."
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {GOALS.map((goal) => {
          const isSelected = state.careerGoal === goal.value;
          return (
            <motion.button
              key={goal.value}
              onClick={() => update({ careerGoal: goal.value })}
              whileHover={{ y: -4, scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className={cn(
                "relative flex flex-col items-start p-5 rounded-2xl border-2 text-left transition-all duration-200 group shadow-sm",
                isSelected
                  ? "border-accent bg-accent/10 shadow-accent/20 shadow-md"
                  : "border-border/50 bg-card hover:border-accent/50 hover:bg-muted/50"
              )}
            >
              {isSelected && (
                <motion.div
                  layoutId="career-glow"
                  className="absolute inset-0 rounded-2xl bg-accent/5"
                  transition={{ type: "spring", bounce: 0.2 }}
                />
              )}
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-colors relative z-10",
                isSelected ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground group-hover:bg-accent/10 group-hover:text-accent"
              )}>
                <goal.icon className="w-5 h-5" />
              </div>
              <span className={cn("font-bold text-sm relative z-10", isSelected ? "text-accent" : "text-foreground")}>
                {goal.label}
              </span>
              <span className="text-xs text-muted-foreground mt-1 leading-relaxed relative z-10">
                {goal.description}
              </span>
            </motion.button>
          );
        })}
      </div>
    </StepWrapper>
  );
}
