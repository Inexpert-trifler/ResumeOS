"use client";

import { motion } from "framer-motion";
import { COACH_TIPS } from "@/data/mock-coach";
import { Lightbulb, ArrowDownRight, Sparkles, XCircle, FileText } from "lucide-react";
import { useResumeDraftSnapshot } from "@/lib/resume-draft";

export function CoachPanel() {
  const draft = useResumeDraftSnapshot();
  const resume = draft?.resume;

  const title = resume?.header.name || draft?.builder.personalInfo.firstName
    ? `${resume?.header.name || draft?.builder.personalInfo.firstName}'s Resume`
    : "Live Resume Context";
  const subtitle = resume?.header.title || draft?.builder.targetRole || "Software Engineer";
  const summary = resume?.summary || draft?.builder.summary || "Add a summary to get tailored recruiter advice.";
  const skills = (resume?.skills?.[0]?.skills || draft?.builder.skills.map((s) => s.name) || []).slice(0, 6);

  return (
    <aside className="w-96 shrink-0 border-l border-border/50 bg-background/50 h-full flex flex-col">
      <div className="h-16 flex items-center px-6 border-b border-border/50 shrink-0 bg-background/80 backdrop-blur-md z-10">
        <h2 className="font-semibold text-sm flex items-center gap-2">
          <FileText className="w-4 h-4 text-accent" />
          <span>Active Context & Tips</span>
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-8">
        
        {/* Live Resume Snippet */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">Current Resume Context</h3>
          <div className="p-5 rounded-2xl border border-border/50 bg-card shadow-sm space-y-3">
            <div>
              <h4 className="font-bold text-base">{title}</h4>
              <p className="text-xs text-accent font-semibold">{subtitle}</p>
            </div>
            
            <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed bg-muted/30 p-2.5 rounded-lg border border-border/30">
              {summary}
            </p>

            {skills.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {skills.map((tech) => (
                  <span key={tech} className="px-2 py-0.5 bg-muted rounded text-[11px] font-medium text-muted-foreground">
                    {tech}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Coach Advice */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">Recruiter Guidance</h3>
          
          <div className="p-5 rounded-2xl bg-accent/5 border border-accent/20 mb-6">
            <div className="flex items-center gap-2 mb-2 text-accent">
              <Lightbulb className="w-4.5 h-4.5" />
              <h4 className="font-semibold text-sm">The XYZ Formula</h4>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Google recruiters recommend the XYZ formula: &quot;Accomplished [X] as measured by [Y], by doing [Z].&quot; Always try to quantify your impact!
            </p>
          </div>

          {/* Weak vs Strong Comparison */}
          <div className="space-y-3 relative before:absolute before:inset-y-6 before:left-5 before:w-px before:-ml-px before:bg-border/50 before:-z-10">
            {/* Weak */}
            <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/20 relative z-10 shadow-sm">
              <div className="flex items-center gap-2 text-red-500 mb-1.5">
                <XCircle className="w-3.5 h-3.5" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Weak Phrasing</span>
              </div>
              <p className="text-xs text-foreground/80 italic">{`"${COACH_TIPS.weak}"`}</p>
            </div>

            {/* Arrow */}
            <div className="flex justify-center text-muted-foreground/50 py-0.5">
              <ArrowDownRight className="w-4 h-4 -rotate-45" />
            </div>

            {/* Strong */}
            <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20 relative z-10 shadow-sm">
              <div className="flex items-center gap-2 text-emerald-500 mb-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Strong Phrasing</span>
              </div>
              <p className="text-xs text-foreground font-medium">{`"${COACH_TIPS.strong}"`}</p>
            </div>
          </div>
        </div>

      </div>
    </aside>
  );
}
