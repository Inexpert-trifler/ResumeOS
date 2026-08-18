"use client";

import { motion } from "framer-motion";
import { Sparkles, FileText, CheckCircle2 } from "lucide-react";
import { useCoverLetterStore } from "@/stores/useCoverLetterStore";
import { useResumeDraftSnapshot } from "@/lib/resume-draft";

export function CoverLetterPanel() {
  const { activeLetter } = useCoverLetterStore();
  const draft = useResumeDraftSnapshot();
  const resumeName = draft?.builder?.personalInfo?.firstName
    ? `${draft.builder.personalInfo.firstName} ${draft.builder.personalInfo.lastName || ""}`
    : "Candidate Profile";

  return (
    <aside className="w-96 shrink-0 border-l border-border/50 bg-background/50 h-full flex flex-col">
      <div className="h-16 flex items-center px-6 border-b border-border/50 shrink-0 bg-background/80 backdrop-blur-md">
        <h2 className="font-semibold text-sm flex items-center gap-2">
          <FileText className="w-4 h-4 text-accent" />
          <span>Letter Inspector</span>
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-8">

        {/* Active Letter Summary */}
        {activeLetter ? (
          <div>
            <h3 className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60 mb-3">Active Document</h3>
            <div className="p-5 rounded-2xl border border-border/50 bg-card space-y-3 shadow-sm">
              <div className="flex items-center gap-2 text-emerald-500 text-xs font-semibold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Generated & Saved</span>
              </div>
              <div>
                <p className="font-bold text-sm">{activeLetter.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">Author: {resumeName}</p>
              </div>
              <div className="pt-2 border-t border-border/30 text-[11px] text-muted-foreground flex justify-between">
                <span>Tone: <strong className="capitalize text-foreground">{activeLetter.tone}</strong></span>
                <span>{new Date(activeLetter.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <h3 className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60 mb-3">Grounding Source</h3>
            <div className="p-5 rounded-2xl border border-border/50 bg-card space-y-2 text-xs">
              <p className="font-semibold text-foreground">{resumeName}</p>
              <p className="text-muted-foreground">Target Role: {draft?.builder?.targetRole || "Software Engineer"}</p>
              <p className="text-[11px] text-accent font-medium">Resume facts loaded & verified</p>
            </div>
          </div>
        )}

        <div>
          <h3 className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60 mb-3">Recruiter Best Practices</h3>
          <div className="space-y-3">
            <div className="p-4 rounded-xl border border-border/50 bg-card">
              <p className="text-xs font-semibold text-foreground mb-1">Length Guide</p>
              <p className="text-xs text-muted-foreground leading-relaxed">Keep your cover letter between 250 and 350 words (3-4 concise paragraphs).</p>
            </div>
            <div className="p-4 rounded-xl border border-border/50 bg-card">
              <p className="text-xs font-semibold text-foreground mb-1">Tailored Opening</p>
              <p className="text-xs text-muted-foreground leading-relaxed">Mention the exact company name and target role in the very first sentence.</p>
            </div>
            <div className="p-4 rounded-xl border border-border/50 bg-card">
              <p className="text-xs font-semibold text-foreground mb-1">Factual Impact</p>
              <p className="text-xs text-muted-foreground leading-relaxed">Highlight top technical achievements directly from your resume.</p>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-accent/5 border border-accent/20">
          <div className="flex items-center gap-2 mb-2 text-accent">
            <Sparkles className="w-4 h-4" />
            <span className="text-xs font-bold">Smart Personalization</span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            We scan the target job for core technical skills and weave them naturally into your letter — boosting ATS match rates predictable and safely.
          </p>
        </div>
      </div>
    </aside>
  );
}
