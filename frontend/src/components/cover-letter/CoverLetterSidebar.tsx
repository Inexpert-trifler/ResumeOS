"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Sparkles, Mail, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCoverLetterStore } from "@/stores/useCoverLetterStore";

const TONES = [
  { id: "professional", label: "Professional", desc: "Formal & structured" },
  { id: "confident", label: "Confident", desc: "Bold & assertive" },
  { id: "friendly", label: "Friendly", desc: "Warm & approachable" },
  { id: "creative", label: "Creative", desc: "Unique & memorable" },
];

export function CoverLetterSidebar() {
  const { tone, setTone, letters, activeLetter, selectLetter, deleteLetter } = useCoverLetterStore();

  return (
    <aside className="w-80 shrink-0 border-r border-border/50 bg-background/50 h-full flex flex-col relative">
      <div className="h-16 flex items-center px-6 border-b border-border/50 shrink-0">
        <Link href="/dashboard" className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Dashboard
        </Link>
      </div>

      <div className="p-6 flex-1 overflow-y-auto no-scrollbar space-y-8">

        {/* Tone Selection */}
        <div>
          <h3 className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60 mb-3">Tone Presets</h3>
          <div className="space-y-2">
            {TONES.map((t) => {
              const isSelected = tone.toLowerCase() === t.id;
              return (
                <div
                  key={t.id}
                  onClick={() => setTone(t.id)}
                  className={cn(
                    "flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all",
                    isSelected ? "border-accent/50 bg-accent/10 shadow-sm" : "border-border/50 bg-card hover:border-accent/30"
                  )}
                >
                  <div>
                    <p className={cn("text-xs font-semibold", isSelected ? "text-accent" : "text-foreground")}>{t.label}</p>
                    <p className="text-[10px] text-muted-foreground">{t.desc}</p>
                  </div>
                  {isSelected && <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />}
                </div>
              );
            })}
          </div>
        </div>

        {/* Saved Letters List */}
        {letters.length > 0 && (
          <div>
            <h3 className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60 mb-3">Saved Letters</h3>
            <div className="space-y-1.5">
              {letters.map((letItem) => {
                const isActive = activeLetter?.id === letItem.id;
                return (
                  <div
                    key={letItem.id}
                    onClick={() => void selectLetter(letItem.id)}
                    className={cn(
                      "flex items-center justify-between px-3 py-2 rounded-xl cursor-pointer text-xs transition-colors group",
                      isActive ? "bg-accent/15 text-accent font-semibold" : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                    )}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <Mail className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{letItem.title}</span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        void deleteLetter(letItem.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1 hover:text-destructive transition-opacity"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="p-4 rounded-2xl bg-accent/5 border border-accent/20">
          <div className="flex items-center gap-2 mb-2 text-accent">
            <Sparkles className="w-4 h-4" />
            <span className="text-xs font-bold">Factual Grounding Engine</span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Our AI generates cover letters using ONLY verified credentials from your active resume. No fabricated experience or fake metrics.
          </p>
        </div>
      </div>
    </aside>
  );
}
