"use client";

import { useState } from "react";
import { Container } from "@/components/shared/Container";
import { FadeUp } from "@/animations/FadeUp";
import { Search, Eye, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export function RecruiterReviewSection() {
  const [activeFilter, setActiveFilter] = useState<"all" | "important" | "weak" | "ignored">("all");

  const blocks = [
    { type: "important", label: "Current Title & Company", width: "w-1/2", height: "h-6" },
    { type: "ignored", label: "Objective Statement", width: "w-full", height: "h-12" },
    { type: "weak", label: "Vague Bullet Point (No Metrics)", width: "w-5/6", height: "h-4" },
    { type: "important", label: "Quantified Impact ($1M+)", width: "w-11/12", height: "h-4" },
    { type: "weak", label: "Skill Rating Bars", width: "w-1/3", height: "h-8" },
  ];

  return (
    <section className="py-24 bg-muted/10 border-t border-border/50">
      <Container>
        <div className="text-center mb-16">
          <FadeUp>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-sm font-medium mb-6">
              <Eye className="w-4 h-4" /> Recruiter Vision
            </div>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
              See What They See
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Filter the view to understand exactly what recruiters focus on, and what they consider red flags.
            </p>
          </FadeUp>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Controls */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {[
              { id: "all", label: "All Content" },
              { id: "important", label: "Highly Important", color: "bg-green-500 text-white" },
              { id: "weak", label: "Weak/Red Flags", color: "bg-destructive text-white" },
              { id: "ignored", label: "Often Ignored", color: "bg-muted-foreground text-white" }
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id as any)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-bold transition-all border border-transparent shadow-sm",
                  activeFilter === f.id 
                    ? f.color || "bg-foreground text-background" 
                    : "bg-card text-foreground hover:bg-muted border-border"
                )}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Simulator Box */}
          <div className="bg-card border border-border rounded-2xl p-8 shadow-xl max-w-2xl mx-auto">
            <div className="space-y-6">
              {blocks.map((block, i) => {
                const isHighlighted = activeFilter === "all" || activeFilter === block.type;
                
                let bgColor = "bg-zinc-200 dark:bg-zinc-800";
                if (isHighlighted && activeFilter !== "all") {
                  if (block.type === "important") bgColor = "bg-green-500/80";
                  if (block.type === "weak") bgColor = "bg-destructive/80";
                  if (block.type === "ignored") bgColor = "bg-muted-foreground/50";
                }

                return (
                  <div key={i} className={cn("transition-all duration-500", !isHighlighted && "opacity-20 blur-[2px]")}>
                    <div className="text-xs font-bold text-muted-foreground mb-1 flex items-center gap-1">
                      {block.type === "important" && <Search className="w-3 h-3 text-green-500" />}
                      {block.type === "weak" && <AlertCircle className="w-3 h-3 text-destructive" />}
                      {block.label}
                    </div>
                    <div className={cn(block.width, block.height, bgColor, "rounded-md transition-colors duration-500")} />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
