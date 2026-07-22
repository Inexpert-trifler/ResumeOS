"use client";

import { useState, KeyboardEvent } from "react";
import { StepWrapper } from "./StepWrapper";
import { BuilderState, Skill } from '@/types';
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const SUGGESTED: Record<string, string[]> = {
  "Languages": ["JavaScript", "TypeScript", "Python", "Go", "Java", "Rust"],
  "Frontend": ["React", "Next.js", "Vue", "HTML/CSS", "TailwindCSS", "Framer Motion"],
  "Backend": ["Node.js", "Express", "FastAPI", "PostgreSQL", "MongoDB", "Redis"],
  "Cloud & DevOps": ["AWS", "Docker", "Kubernetes", "CI/CD", "GitHub Actions"],
  "Soft Skills": ["Leadership", "Communication", "Problem Solving", "Agile"],
};

const LEVELS: Skill["level"][] = ["Beginner", "Intermediate", "Advanced", "Expert"];

interface Step07Props {
  state: BuilderState;
  update: (partial: Partial<BuilderState>) => void;
}

export function Step07_Skills({ state, update }: Step07Props) {
  const [input, setInput] = useState("");

  const addSkill = (name: string) => {
    const cleaned = name.trim();
    if (!cleaned) return;
    if (state.skills.some(s => s.name.toLowerCase() === cleaned.toLowerCase())) return;
    const newSkill: Skill = { id: Date.now().toString(), name: cleaned };
    update({ skills: [...state.skills, newSkill] });
    setInput("");
  };

  const removeSkill = (id: string) => {
    update({ skills: state.skills.filter(s => s.id !== id) });
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addSkill(input);
    }
  };

  return (
    <StepWrapper
      badge="Step 7"
      title="What are your skills?"
      description="Add skills by typing and pressing Enter. Include both technical and tools."
    >
      <div className="max-w-2xl space-y-6">
        {/* Tag input */}
        <div className="p-3 rounded-xl border border-border/50 bg-card min-h-[80px] flex flex-wrap gap-2 focus-within:ring-2 focus-within:ring-accent/50 focus-within:border-accent transition-all cursor-text">
          <AnimatePresence>
            {state.skills.map((skill) => (
              <motion.span
                key={skill.id}
                layout
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className="inline-flex items-center gap-1.5 bg-accent/10 text-accent rounded-full px-3 py-1 text-sm font-medium"
              >
                {skill.name}
                <button onClick={() => removeSkill(skill.id)} className="hover:text-destructive transition-colors">
                  <X className="w-3 h-3" />
                </button>
              </motion.span>
            ))}
          </AnimatePresence>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={state.skills.length === 0 ? "Type a skill and press Enter..." : "Add more..."}
            className="flex-1 min-w-[180px] bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
        </div>

        <p className="text-xs text-muted-foreground -mt-4">
          {state.skills.length} skill{state.skills.length !== 1 ? "s" : ""} added. Duplicate detection is active.
        </p>

        {/* Suggestions by category */}
        <div className="space-y-4">
          {Object.entries(SUGGESTED).map(([category, items]) => (
            <div key={category}>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">{category}</p>
              <div className="flex flex-wrap gap-2">
                {items.map((item) => {
                  const already = state.skills.some(s => s.name.toLowerCase() === item.toLowerCase());
                  return (
                    <button
                      key={item}
                      onClick={() => addSkill(item)}
                      disabled={already}
                      className={cn(
                        "px-3 py-1 rounded-full text-xs border transition-all duration-150 flex items-center gap-1",
                        already
                          ? "bg-accent/20 text-accent border-accent/30 cursor-not-allowed"
                          : "border-border/50 text-muted-foreground hover:border-accent/50 hover:text-accent hover:bg-accent/5"
                      )}
                    >
                      {already ? "✓" : <Plus className="w-3 h-3" />} {item}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </StepWrapper>
  );
}
