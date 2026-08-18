"use client";

import { useState } from "react";
import { FadeUp } from "@/animations/FadeUp";
import { Link2, Sparkles, Loader2, Award, CheckCircle2, Wand2, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LinkedInService, type LinkedInAnalysisReport } from "@/services/LinkedInService";
import { useAuth } from "@clerk/nextjs";

export function LinkedInWorkspace() {
  const { isLoaded } = useAuth();
  const [targetRole, setTargetRole] = useState("Software Engineer");
  const [headline, setHeadline] = useState("");
  const [about, setAbout] = useState("");
  const [experience, setExperience] = useState("");
  const [skills, setSkills] = useState("");

  const [report, setReport] = useState<LinkedInAnalysisReport | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedHeadline, setCopiedHeadline] = useState(false);

  const handleAnalyze = async () => {
    if (!isLoaded) return;
    setIsAnalyzing(true);
    setError(null);
    try {
      const res = await LinkedInService.analyze({
        targetRole,
        headline,
        about,
        experience,
        skills,
      });
      setReport(res);
      setIsAnalyzing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to analyze LinkedIn profile.");
      setIsAnalyzing(false);
    }
  };

  const handleCopyHeadline = async () => {
    if (report?.rewrittenHeadline) {
      await navigator.clipboard.writeText(report.rewrittenHeadline);
      setCopiedHeadline(true);
      setTimeout(() => setCopiedHeadline(false), 2000);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-background overflow-y-auto no-scrollbar">

      {/* Top Header */}
      <div className="h-16 flex items-center justify-between px-8 border-b border-border/50 shrink-0 bg-background/80 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#0077b5]/10 flex items-center justify-center">
            <Link2 className="w-4 h-4 text-[#0077b5]" />
          </div>
          <div>
            <h1 className="font-semibold text-sm">LinkedIn Profile Optimizer</h1>
            <p className="text-[10px] text-muted-foreground">Profile Intelligence & Recruiter Reach</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[11px] font-semibold text-emerald-500">AI Engine Active</span>
        </div>
      </div>

      <div className="p-8 space-y-8 max-w-4xl w-full mx-auto">

        {/* Input Form */}
        <FadeUp>
          <div className="p-6 rounded-3xl border border-border/50 bg-card shadow-sm space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-bold">
                <Link2 className="w-4 h-4 text-[#0077b5]" /> Profile Input Details
              </div>
              <span className="text-xs font-semibold text-muted-foreground">Paste profile text for AI review</span>
            </div>

            {error && (
              <div className="p-3.5 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-medium">
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">Target Role Title</label>
              <input
                type="text"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                placeholder="e.g. Senior Backend Engineer"
                className="w-full h-10 px-3.5 rounded-xl bg-background border border-border/60 text-sm focus:outline-none focus:border-accent"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">LinkedIn Headline</label>
              <input
                type="text"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                placeholder="e.g. Software Engineer | React | Node.js | System Architecture"
                className="w-full h-10 px-3.5 rounded-xl bg-background border border-border/60 text-sm focus:outline-none focus:border-accent"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">About / Summary Section</label>
              <textarea
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                placeholder="Paste your LinkedIn summary or About text..."
                rows={3}
                className="w-full p-3.5 rounded-xl bg-background border border-border/60 text-xs focus:outline-none focus:border-accent resize-none"
              />
            </div>

            <Button
              onClick={handleAnalyze}
              disabled={isAnalyzing || (!headline.trim() && !about.trim())}
              size="lg"
              className="w-full rounded-2xl bg-[#0077b5] hover:bg-[#0077b5]/90 text-white font-semibold gap-2 shadow-md"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Analyzing Profile Text...
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4" /> Analyze LinkedIn Profile with AI
                </>
              )}
            </Button>
          </div>
        </FadeUp>

        {/* Results Card */}
        {report && (
          <FadeUp delay={0.1}>
            <div className="space-y-6">
              
              {/* Overall Score Card */}
              <div className="p-6 rounded-3xl border border-border/50 bg-card shadow-sm flex items-center justify-between gap-6">
                <div>
                  <h2 className="text-xl font-bold">LinkedIn Profile Audit</h2>
                  <p className="text-xs text-muted-foreground mt-1">
                    Optimized for {targetRole} recruiter searches
                  </p>
                </div>

                <div className="w-20 h-20 rounded-full bg-[#0077b5]/10 border-2 border-[#0077b5]/40 flex flex-col items-center justify-center shrink-0">
                  <span className="text-2xl font-black text-[#0077b5]">{report.overallScore}</span>
                  <span className="text-[9px] uppercase font-bold text-muted-foreground">Score</span>
                </div>
              </div>

              {/* Sub-scores */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="p-4 rounded-2xl border border-border/50 bg-card text-center">
                  <span className="text-xl font-bold text-blue-500">{report.headlineScore}</span>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Headline</p>
                </div>
                <div className="p-4 rounded-2xl border border-border/50 bg-card text-center">
                  <span className="text-xl font-bold text-emerald-500">{report.aboutScore}</span>
                  <p className="text-[10px] text-muted-foreground mt-0.5">About Section</p>
                </div>
                <div className="p-4 rounded-2xl border border-border/50 bg-card text-center">
                  <span className="text-xl font-bold text-amber-500">{report.experienceScore}</span>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Experience</p>
                </div>
                <div className="p-4 rounded-2xl border border-border/50 bg-card text-center">
                  <span className="text-xl font-bold text-purple-500">{report.skillsScore}</span>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Skills</p>
                </div>
              </div>

              {/* AI Rewritten Headline Suggestion */}
              {report.rewrittenHeadline && (
                <div className="p-6 rounded-2xl border border-[#0077b5]/30 bg-[#0077b5]/5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#0077b5] uppercase">AI Rewritten High-Impact Headline</span>
                    <Button onClick={handleCopyHeadline} size="sm" variant="outline" className="h-7 text-xs gap-1.5">
                      {copiedHeadline ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                      {copiedHeadline ? "Copied!" : "Copy"}
                    </Button>
                  </div>
                  <p className="font-semibold text-sm text-foreground">{report.rewrittenHeadline}</p>
                </div>
              )}

              {/* Recommendations */}
              <div className="p-6 rounded-2xl border border-border/50 bg-card space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground/70">Optimization Advice</h3>
                <ul className="space-y-2">
                  {report.recommendations.map((rec, i) => (
                    <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-[#0077b5] shrink-0 mt-0.5" />
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>
          </FadeUp>
        )}

      </div>
    </div>
  );
}
