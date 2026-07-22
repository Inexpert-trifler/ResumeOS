"use client";

import { StepWrapper } from "./StepWrapper";
import { BuilderState, ExperienceLevel } from '@/types';
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const LEVELS: { value: ExperienceLevel; subtitle: string; color: string }[] = [
  { value: "Student", subtitle: "Pursuing a degree", color: "from-blue-500/20 to-blue-600/10" },
  { value: "Fresher", subtitle: "No work experience yet", color: "from-purple-500/20 to-purple-600/10" },
  { value: "0-1 Years", subtitle: "Just starting out", color: "from-cyan-500/20 to-cyan-600/10" },
  { value: "1-3 Years", subtitle: "Junior level", color: "from-green-500/20 to-green-600/10" },
  { value: "3-5 Years", subtitle: "Mid-level", color: "from-yellow-500/20 to-yellow-600/10" },
  { value: "5-10 Years", subtitle: "Senior level", color: "from-orange-500/20 to-orange-600/10" },
  { value: "10+ Years", subtitle: "Principal / Director", color: "from-red-500/20 to-red-600/10" },
];

interface Step03Props {
  state: BuilderState;
  update: (partial: Partial<BuilderState>) => void;
}

export function Step03_Experience({ state, update }: Step03Props) {
  return (
    <StepWrapper
      badge="Step 3"
      title="What's your experience level?"
      description="This determines the structure, depth, and length of your resume."
    >
      <div className="flex flex-col gap-3">
        {LEVELS.map((lvl, i) => {
          const isSelected = state.experienceLevel === lvl.value;
          return (
            <motion.button
              key={lvl.value}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => update({ experienceLevel: lvl.value })}
              className={cn(
                "relative flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all duration-200 group overflow-hidden",
                isSelected
                  ? "border-accent shadow-md shadow-accent/10"
                  : "border-border/50 bg-card hover:border-accent/40"
              )}
            >
              {/* Background gradient */}
              <div className={cn(
                "absolute inset-0 bg-gradient-to-r opacity-0 transition-opacity duration-300",
                lvl.color,
                isSelected ? "opacity-100" : "group-hover:opacity-50"
              )} />

              {/* Level indicator circle */}
              <div className={cn(
                "relative z-10 w-12 h-12 rounded-xl flex items-center justify-center font-bold text-sm transition-colors",
                isSelected ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"
              )}>
                {i === 0 ? "🎓" : i === 1 ? "🌱" : `${i - 1}+`}
              </div>

              <div className="relative z-10 flex-1">
                <div className={cn("font-bold text-base", isSelected ? "text-foreground" : "text-foreground")}>
                  {lvl.value}
                </div>
                <div className="text-sm text-muted-foreground">{lvl.subtitle}</div>
              </div>

              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="relative z-10 w-6 h-6 rounded-full bg-accent flex items-center justify-center"
                >
                  <span className="text-accent-foreground text-xs font-bold">✓</span>
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </div>
    </StepWrapper>
  );
}
