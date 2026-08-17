"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

const AI_SUGGESTIONS = [
  { type: "improve", text: "Mention the company's recent Series B funding to show you've done research" },
  { type: "add", text: "Include your GitHub profile link for the engineering role" },
  { type: "improve", text: "Opening line is strong — keep it under 2 sentences for impact" },
  { type: "warning", text: "Avoid starting sentences with 'I' more than twice in a row" },
];

const STATS = [
  { label: "Letters Generated", value: "890K+" },
  { label: "Response Rate", value: "2.8x" },
  { label: "Avg Generation", value: "< 30s" },
  { label: "Tone Accuracy", value: "94%" },
];

export function CoverLetterPanel() {
  return (
    <aside className="w-96 shrink-0 border-l border-border/50 bg-background/50 h-full flex flex-col">
      <div className="h-16 flex items-center px-6 border-b border-border/50 shrink-0 bg-background/80 backdrop-blur-md">
        <h2 className="font-semibold text-sm">AI Suggestions</h2>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-8">

        <div>
          <h3 className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60 mb-4">Live Suggestions</h3>
          <div className="space-y-3">
            {AI_SUGGESTIONS.map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                className="p-4 rounded-xl border border-border/50 bg-card">
                <div className="flex items-start gap-2">
                  <span className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${
                    s.type === "improve" ? "bg-blue-500" : s.type === "add" ? "bg-green-500" : "bg-yellow-500"}`} />
                  <p className="text-xs text-muted-foreground leading-relaxed">{s.text}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60 mb-4">Platform Stats</h3>
          <div className="grid grid-cols-2 gap-3">
            {STATS.map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                className="p-4 rounded-2xl border border-border/50 bg-card text-center">
                <p className="text-xl font-bold text-accent">{s.value}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-accent/5 border border-accent/20">
          <div className="flex items-center gap-2 mb-2 text-accent">
            <Sparkles className="w-4 h-4" />
            <span className="text-xs font-bold">Smart Personalization</span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            We scan the job description for hidden keywords and weave them naturally into your letter — boosting ATS match rate by up to 40%.
          </p>
        </div>
      </div>
    </aside>
  );
}
