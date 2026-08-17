"use client";

import { Lightbulb, Info, Target, TrendingUp } from "lucide-react";
import { useResumeAnalysis } from "@/lib/resume-analysis";

export function AnalyzerSidebar() {
  const analysis = useResumeAnalysis();

  return (
    <aside className="w-80 shrink-0 border-l border-border/50 bg-background/50 h-full overflow-y-auto no-scrollbar p-6">
      <div className="space-y-8">
        
        {/* Overall Verdict */}
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">Overall Verdict</h3>
          <div className="p-5 rounded-2xl bg-accent/5 border border-accent/20">
            <div className="flex items-center gap-2 mb-2 text-accent">
              <TrendingUp className="w-5 h-5" />
              <h4 className="font-semibold">{analysis.verdict}</h4>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              {analysis.verdictDescription}
            </p>
            <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-accent rounded-full" style={{ width: `${analysis.verdictProgress}%` }} />
            </div>
          </div>
        </div>

        {/* Pro Tip */}
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">Pro Tip</h3>
          <div className="p-5 rounded-2xl bg-card border border-border/50 hover:border-accent/30 transition-colors">
            <div className="flex items-center gap-2 mb-2 text-yellow-500">
              <Lightbulb className="w-5 h-5" />
              <h4 className="font-semibold text-foreground">{analysis.proTipTitle}</h4>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {analysis.proTip}
            </p>
          </div>
        </div>

        {/* ATS Fact */}
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">Did you know?</h3>
          <div className="p-5 rounded-2xl bg-card border border-border/50 hover:border-accent/30 transition-colors">
            <div className="flex items-center gap-2 mb-2 text-blue-500">
              <Info className="w-5 h-5" />
              <h4 className="font-semibold text-foreground">{analysis.factTitle}</h4>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {analysis.fact}
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
                <h4 className="font-semibold text-foreground">{analysis.targetRole}</h4>
              </div>
              <p className="text-xs text-muted-foreground">{analysis.targetCompany}</p>
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
