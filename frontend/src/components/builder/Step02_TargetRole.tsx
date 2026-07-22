"use client";

import { useState } from "react";
import { StepWrapper } from "./StepWrapper";
import { BuilderState } from '@/types';
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";

const ROLES = [
  "Software Engineer", "Frontend Engineer", "Backend Engineer", "Full Stack", 
  "AI Engineer", "Machine Learning", "Data Analyst", "Data Scientist",
  "Cloud Engineer", "Cyber Security", "DevOps", "Mobile Developer",
  "UI/UX Designer", "Product Manager", "Business Analyst", "Marketing",
  "Sales", "Finance Analyst", "HR", "Custom"
];

interface Step02Props {
  state: BuilderState;
  update: (partial: Partial<BuilderState>) => void;
}

export function Step02_TargetRole({ state, update }: Step02Props) {
  const [query, setQuery] = useState("");

  const filtered = ROLES.filter(r => r.toLowerCase().includes(query.toLowerCase()));

  return (
    <StepWrapper
      badge="Step 2"
      title="What role are you targeting?"
      description="We'll suggest the best resume format, keywords, and sections based on your target role."
    >
      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search roles..."
          className="w-full pl-11 pr-4 py-3 rounded-xl border border-border/50 bg-card text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all"
        />
      </div>

      {/* Roles Grid */}
      <div className="flex flex-wrap gap-3">
        {filtered.map((role) => {
          const isSelected = state.targetRole === role;
          return (
            <motion.button
              key={role}
              whileTap={{ scale: 0.95 }}
              onClick={() => update({ targetRole: role })}
              className={cn(
                "px-4 py-2.5 rounded-xl text-sm font-medium border transition-all duration-200",
                isSelected
                  ? "border-accent bg-accent text-accent-foreground shadow-md shadow-accent/20"
                  : "border-border/50 bg-card hover:border-accent/50 hover:bg-muted text-foreground"
              )}
            >
              {role}
            </motion.button>
          );
        })}
        {filtered.length === 0 && (
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => { update({ targetRole: query }); setQuery(""); }}
            className="px-4 py-2.5 rounded-xl text-sm font-medium border border-dashed border-accent/50 text-accent hover:bg-accent/10"
          >
            + Use "{query}"
          </motion.button>
        )}
      </div>

      {state.targetRole && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-4 bg-accent/5 border border-accent/20 rounded-xl flex items-center gap-3"
        >
          <div className="w-2 h-2 bg-accent rounded-full" />
          <span className="text-sm font-medium">Selected: <strong>{state.targetRole}</strong></span>
        </motion.div>
      )}
    </StepWrapper>
  );
}
