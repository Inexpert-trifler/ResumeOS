"use client";

import { motion } from "framer-motion";
import { COACH_TIPS, LIVE_RESUME_PREVIEW } from "@/data/mock-coach";
import { Lightbulb, ArrowDownRight, Sparkles, XCircle } from "lucide-react";

export function CoachPanel() {
  return (
    <aside className="w-96 shrink-0 border-l border-border/50 bg-background/50 h-full flex flex-col">
      <div className="h-16 flex items-center px-6 border-b border-border/50 shrink-0 bg-background/80 backdrop-blur-md z-10">
        <h2 className="font-semibold">Live Preview & Tips</h2>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-8">
        
        {/* Live Resume Snippet */}
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">Resume Updates</h3>
          <div className="p-6 rounded-2xl border border-border/50 bg-card shadow-sm">
            <h4 className="font-bold text-lg">{LIVE_RESUME_PREVIEW.title}</h4>
            <p className="text-sm text-accent font-medium mb-4">{LIVE_RESUME_PREVIEW.subtitle}</p>
            
            <ul className="space-y-3 mb-6">
              {LIVE_RESUME_PREVIEW.bullets.map((bullet, i) => (
                <motion.li 
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.2 }}
                  className="text-sm text-muted-foreground flex items-start gap-3"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 shrink-0" />
                  <span className="leading-relaxed">{bullet}</span>
                </motion.li>
              ))}
            </ul>

            <div className="flex flex-wrap gap-2">
              {LIVE_RESUME_PREVIEW.technologies.map(tech => (
                <span key={tech} className="px-2 py-1 bg-muted rounded text-xs font-medium text-muted-foreground">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Coach Advice */}
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">Recruiter Advice</h3>
          
          <div className="p-5 rounded-2xl bg-accent/5 border border-accent/20 mb-6">
            <div className="flex items-center gap-2 mb-2 text-accent">
              <Lightbulb className="w-5 h-5" />
              <h4 className="font-semibold">The XYZ Formula</h4>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Google recruiters recommend the XYZ formula: "Accomplished [X] as measured by [Y], by doing [Z]." Always try to quantify your impact!
            </p>
          </div>

          {/* Weak vs Strong Comparison */}
          <div className="space-y-3 relative before:absolute before:inset-y-6 before:left-5 before:w-px before:-ml-px before:bg-border/50 before:-z-10">
            {/* Weak */}
            <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/20 relative z-10 shadow-sm">
              <div className="flex items-center gap-2 text-red-500 mb-2">
                <XCircle className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Weak Answer</span>
              </div>
              <p className="text-sm text-foreground/80 italic">"{COACH_TIPS.weak}"</p>
            </div>

            {/* Arrow */}
            <div className="flex justify-center text-muted-foreground/50 py-1">
              <ArrowDownRight className="w-5 h-5 -rotate-45" />
            </div>

            {/* Strong */}
            <div className="p-4 rounded-xl bg-green-500/5 border border-green-500/20 relative z-10 shadow-sm">
              <div className="flex items-center gap-2 text-green-500 mb-2">
                <Sparkles className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Strong Answer</span>
              </div>
              <p className="text-sm text-foreground font-medium">"{COACH_TIPS.strong}"</p>
            </div>
          </div>
        </div>

      </div>
    </aside>
  );
}
