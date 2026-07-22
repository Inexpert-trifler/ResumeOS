"use client";

import { motion } from "framer-motion";
import { Lightbulb, Info, Target, TrendingUp } from "lucide-react";

export function AnalyzerSidebar() {
  return (
    <aside className="w-80 shrink-0 border-l border-border/50 bg-background/50 h-full overflow-y-auto no-scrollbar p-6">
      <div className="space-y-8">
        
        {/* Overall Verdict */}
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">Overall Verdict</h3>
          <div className="p-5 rounded-2xl bg-accent/5 border border-accent/20">
            <div className="flex items-center gap-2 mb-2 text-accent">
              <TrendingUp className="w-5 h-5" />
              <h4 className="font-semibold">Ready for submission</h4>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              Your resume is in the top 5% of all analyzed resumes. It has excellent ATS parsing rates and strong action verbs.
            </p>
            <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-accent rounded-full w-[91%]" />
            </div>
          </div>
        </div>

        {/* Pro Tip */}
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">Pro Tip</h3>
          <div className="p-5 rounded-2xl bg-card border border-border/50 hover:border-accent/30 transition-colors">
            <div className="flex items-center gap-2 mb-2 text-yellow-500">
              <Lightbulb className="w-5 h-5" />
              <h4 className="font-semibold text-foreground">The 10-Year Rule</h4>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Remove graduation dates if they are over 10 years old to prevent age bias, unless specifically asked.
            </p>
          </div>
        </div>

        {/* ATS Fact */}
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">Did you know?</h3>
          <div className="p-5 rounded-2xl bg-card border border-border/50 hover:border-accent/30 transition-colors">
            <div className="flex items-center gap-2 mb-2 text-blue-500">
              <Info className="w-5 h-5" />
              <h4 className="font-semibold text-foreground">Exact Matches</h4>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Some older Applicant Tracking Systems cannot distinguish between "React" and "React.js". Try to match the exact phrasing from the job description.
            </p>
          </div>
        </div>

        {/* Target Role */}
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">Current Target</h3>
          <div className="p-5 rounded-2xl border-2 border-dashed border-border/60 flex items-center justify-between group cursor-pointer hover:border-accent/50 transition-colors">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Target className="w-4 h-4 text-muted-foreground" />
                <h4 className="font-semibold text-foreground">Senior Frontend Engineer</h4>
              </div>
              <p className="text-xs text-muted-foreground">Compared against 150+ listings</p>
            </div>
            <span className="text-xs font-medium text-accent opacity-0 group-hover:opacity-100 transition-opacity">
              Change
            </span>
          </div>
        </div>

      </div>
    </aside>
  );
}
