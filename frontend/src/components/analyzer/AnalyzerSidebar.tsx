"use client";

import { Lightbulb, Info, Target, TrendingUp } from "lucide-react";
import { useAnalyzerStore } from "@/stores/useAnalyzerStore";

export function AnalyzerSidebar() {
  const { analysis } = useAnalyzerStore();
  if (!analysis) return null;
  const jobMatch = analysis.jobMatchScore ?? analysis.atsScore ?? 0;
  const healthScore = analysis.resumeATSHealth ?? analysis.resumeHealth?.score ?? 0;

  return (
    <aside className="w-80 shrink-0 border-l border-border/50 bg-background/50 h-full overflow-y-auto no-scrollbar p-6">
      <div className="space-y-8">
        
        {/* Overall Verdict */}
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">Overall Verdict</h3>
          <div className="p-5 rounded-2xl bg-accent/5 border border-accent/20">
            <div className="flex items-center gap-2 mb-2 text-accent">
              <TrendingUp className="w-5 h-5" />
              <h4 className="font-semibold">{jobMatch >= 80 ? "Excellent Match" : jobMatch >= 60 ? "Good Match" : "Needs Improvement"}</h4>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              Job Match Score: {jobMatch}/100. Resume ATS Health: {healthScore}/100.
            </p>
            <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-accent rounded-full" style={{ width: `${jobMatch}%` }} />
            </div>
          </div>
        </div>

        {/* Pro Tip */}
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">Pro Tip</h3>
          <div className="p-5 rounded-2xl bg-card border border-border/50 hover:border-accent/30 transition-colors">
            <div className="flex items-center gap-2 mb-2 text-yellow-500">
              <Lightbulb className="w-5 h-5" />
              <h4 className="font-semibold text-foreground">Job Match Tip</h4>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {analysis.recommendations?.[0] ?? "No additional recommendation was generated."}
            </p>
          </div>
        </div>

        {/* ATS Fact */}
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">Did you know?</h3>
          <div className="p-5 rounded-2xl bg-card border border-border/50 hover:border-accent/30 transition-colors">
            <div className="flex items-center gap-2 mb-2 text-blue-500">
              <Info className="w-5 h-5" />
              <h4 className="font-semibold text-foreground">Keyword Coverage</h4>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Matched {analysis.matchedKeywords?.length ?? 0} of {(analysis.matchedKeywords?.length ?? 0) + (analysis.missingKeywords?.length ?? 0)} job-description keywords.
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
                <h4 className="font-semibold text-foreground">{analysis.jobTitleMatch ? "Target title aligned" : "Target title not aligned"}</h4>
              </div>
              <p className="text-xs text-muted-foreground">Based on the job description submitted for this analysis.</p>
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
