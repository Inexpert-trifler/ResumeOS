"use client";

import { useState } from "react";
import { StepWrapper } from "./StepWrapper";
import { BuilderState, CompanyType } from '@/types';
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Search, Rocket, Zap, Building2, Landmark, Pencil } from "lucide-react";

const COMPANY_TYPES: { value: CompanyType; label: string; icon: React.ElementType; desc: string }[] = [
  { value: "Startup", label: "Startup", icon: Rocket, desc: "Agile, fast-paced, equity" },
  { value: "FAANG", label: "FAANG / Big Tech", icon: Zap, desc: "Google, Meta, Amazon..." },
  { value: "MNC", label: "MNC", icon: Building2, desc: "Large multinational corp" },
  { value: "Government", label: "Government", icon: Landmark, desc: "PSU, civil service" },
  { value: "Custom", label: "Custom", icon: Pencil, desc: "Specify your own" },
];

const SUGGESTIONS = [
  "Google", "Microsoft", "Apple", "Amazon", "Meta", "Netflix",
  "Stripe", "OpenAI", "Figma", "Notion", "Airbnb", "Shopify"
];

interface Step04Props {
  state: BuilderState;
  update: (partial: Partial<BuilderState>) => void;
}

export function Step04_TargetCompany({ state, update }: Step04Props) {
  const [query, setQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const filtered = SUGGESTIONS.filter(s => s.toLowerCase().includes(query.toLowerCase()));

  return (
    <StepWrapper
      badge="Step 4"
      title="Who do you want to work for?"
      description="Knowing your dream company lets us tailor your keywords and positioning to get past their specific hiring bar."
    >
      {/* Company Type Cards */}
      <div className="flex flex-wrap gap-3 mb-8">
        {COMPANY_TYPES.map((type) => {
          const isSelected = state.companyType === type.value;
          return (
            <motion.button
              key={type.value}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => update({ companyType: type.value })}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl border-2 text-left transition-all duration-200",
                isSelected
                  ? "border-accent bg-accent/10 text-accent shadow-md"
                  : "border-border/50 bg-card hover:border-accent/40 text-foreground"
              )}
            >
              <type.icon className="w-4 h-4 shrink-0" />
              <div>
                <div className="font-semibold text-sm">{type.label}</div>
                <div className="text-xs text-muted-foreground">{type.desc}</div>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Specific Company Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        <input
          value={query}
          onChange={(e) => { setQuery(e.target.value); setShowSuggestions(true); update({ targetCompany: e.target.value }); }}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
          placeholder="Search or type a specific company name..."
          className="w-full pl-11 pr-4 py-3 rounded-xl border border-border/50 bg-card text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all"
        />

        {/* Suggestions Dropdown */}
        {showSuggestions && query && filtered.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-xl shadow-lg z-20 overflow-hidden"
          >
            {filtered.slice(0, 6).map((s) => (
              <button
                key={s}
                onClick={() => { update({ targetCompany: s }); setQuery(s); setShowSuggestions(false); }}
                className="w-full text-left px-4 py-2.5 text-sm hover:bg-muted transition-colors"
              >
                {s}
              </button>
            ))}
          </motion.div>
        )}
      </div>

      {state.targetCompany && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 p-3 bg-accent/5 border border-accent/20 rounded-xl text-sm"
        >
          🎯 Targeting: <strong>{state.targetCompany}</strong>
        </motion.div>
      )}
    </StepWrapper>
  );
}
