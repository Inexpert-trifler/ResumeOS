"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, AlertCircle, ScanLine } from "lucide-react";
import { useAnalyzerStore } from "@/stores/useAnalyzerStore";
import { readResumeDraft } from "@/lib/resume-draft";

export function AnalyzerATSSimulation() {
  const { analysis } = useAnalyzerStore();
  const [draftData, setDraftData] = useState<{
    name: string;
    title: string;
    email: string;
    summary: string;
    skills: string[];
    role: string;
    company: string;
  } | null>(null);

  useEffect(() => {
    const draft = readResumeDraft();
    if (draft?.resume) {
      const r = draft.resume;
      const allSkills = r.skills?.flatMap((s) => s.skills ?? []) ?? [];
      setDraftData({
        name: r.header?.name || draft.builder?.personalInfo?.firstName ? `${draft.builder?.personalInfo?.firstName || ""} ${draft.builder?.personalInfo?.lastName || ""}`.trim() : "Candidate Resume",
        title: r.header?.title || draft.builder?.targetRole || "Software Engineer",
        email: r.header?.email || draft.builder?.personalInfo?.email || "candidate@email.com",
        summary: r.summary || draft.builder?.summary || "Professional summary highlighting engineering expertise and achievements.",
        skills: allSkills.length > 0 ? allSkills.slice(0, 6) : (draft.builder?.skills || []).map((s: { name?: string } | string) => typeof s === "string" ? s : s.name || "").filter(Boolean).slice(0, 6),
        role: r.experience?.[0]?.role || "Software Engineer",
        company: r.experience?.[0]?.company || "Technology Company",
      });
    }
  }, []);

  if (!analysis) return null;

  const simulationItems = analysis.atsSimulation || analysis.resumeHealth?.atsSimulation || [];
  const healthScore = analysis.resumeATSHealth ?? analysis.resumeHealth?.score ?? 0;

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold mb-6">ATS Simulation</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center bg-card p-8 rounded-3xl border border-border/50 overflow-hidden">
        
        {/* Animated Scanner side rendering REAL active resume content */}
        <div className="relative w-full aspect-[3/4] bg-muted/15 rounded-xl border border-border/60 overflow-hidden flex flex-col p-6 text-xs text-foreground/80 select-none">
          {/* Active Resume Real Content */}
          <div className="border-b border-border/40 pb-3 mb-3">
            <h4 className="font-bold text-sm text-foreground tracking-tight">{draftData?.name || "Active Resume"}</h4>
            <p className="text-accent font-medium text-[11px]">{draftData?.title || "Candidate Profile"}</p>
            <p className="text-[10px] text-muted-foreground">{draftData?.email}</p>
          </div>

          <div className="space-y-3 flex-1 overflow-hidden">
            <div>
              <span className="font-semibold text-[10px] uppercase tracking-wider text-muted-foreground">Summary</span>
              <p className="text-[10px] line-clamp-2 text-muted-foreground leading-relaxed mt-0.5">
                {draftData?.summary}
              </p>
            </div>

            <div>
              <span className="font-semibold text-[10px] uppercase tracking-wider text-muted-foreground">Experience</span>
              <p className="text-[11px] font-medium text-foreground mt-0.5">{draftData?.role} · {draftData?.company}</p>
              <div className="w-full h-1.5 bg-muted/60 rounded-full mt-1" />
              <div className="w-4/5 h-1.5 bg-muted/50 rounded-full mt-1" />
            </div>

            {draftData?.skills && draftData.skills.length > 0 && (
              <div>
                <span className="font-semibold text-[10px] uppercase tracking-wider text-muted-foreground">Parsed Skills</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {draftData.skills.map((skill) => (
                    <span key={skill} className="px-1.5 py-0.5 bg-muted rounded text-[9px] font-medium border border-border/40">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Scanner Line */}
          <motion.div
            animate={{ top: ["0%", "100%", "0%"] }}
            transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
            className="absolute left-0 right-0 h-1 bg-accent shadow-[0_0_15px_rgba(var(--accent),0.5)] z-10"
          />
          {/* Overlay gradient for scanner effect */}
          <motion.div
            animate={{ top: ["0%", "100%", "0%"] }}
            transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
            className="absolute left-0 right-0 h-32 bg-gradient-to-b from-transparent to-accent/10 z-0 pointer-events-none -translate-y-full"
          />
        </div>

        {/* Results Side */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 text-accent mb-2">
              <ScanLine className="w-5 h-5" />
              <h3 className="text-lg font-semibold">Parsing Results</h3>
            </div>
            <p className="text-muted-foreground text-sm">
              Resume ATS Health: {healthScore}/100. This structural score is separate from the Job Match Score above.
            </p>
          </div>

          <div className="space-y-3">
            {simulationItems.map((item) => {
              const isPass = item.state === "pass";
              return (
                <div
                  key={item.id}
                  className={`flex items-center gap-3 p-3 rounded-xl text-sm ${
                    isPass ? "bg-green-500/5 border border-green-500/20" : "bg-yellow-500/5 border border-yellow-500/20"
                  }`}
                >
                  {isPass ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-yellow-500 shrink-0" />
                  )}
                  <span>{item.message}</span>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
