"use client";

import { useState, useEffect } from "react";
import { FadeUp } from "@/animations/FadeUp";
import { Mail, Sparkles, FileText, Wand2, Copy, Check, Trash2, Loader2, RefreshCw, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCoverLetterStore } from "@/stores/useCoverLetterStore";
import { useResumeDraftSnapshot } from "@/lib/resume-draft";
import { useAuth } from "@clerk/nextjs";

export function CoverLetterWorkspace() {
  const { isLoaded } = useAuth();
  const draft = useResumeDraftSnapshot();
  const [copied, setCopied] = useState(false);
  const [instructions, setInstructions] = useState("");

  const {
    company,
    role,
    jobDescription,
    tone,
    activeLetter,
    isGenerating,
    error,
    setCompany,
    setRole,
    setJobDescription,
    generateCoverLetter,
    fetchLetters,
    deleteLetter,
  } = useCoverLetterStore();

  useEffect(() => {
    if (isLoaded) {
      void fetchLetters();
    }
  }, [isLoaded, fetchLetters]);

  const handleCopy = async () => {
    if (activeLetter?.content) {
      await navigator.clipboard.writeText(activeLetter.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleGenerate = async () => {
    void generateCoverLetter();
  };

  const currentResumeTitle = draft?.builder?.personalInfo?.firstName
    ? `${draft.builder.personalInfo.firstName}'s Active Resume`
    : "Active Resume";

  return (
    <div className="flex-1 flex flex-col h-full bg-background overflow-y-auto no-scrollbar">
      
      {/* Top Header */}
      <div className="h-16 flex items-center justify-between px-8 border-b border-border/50 shrink-0 bg-background/80 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
            <Mail className="w-4 h-4 text-accent" />
          </div>
          <div>
            <h1 className="font-semibold text-sm">Cover Letter Generator</h1>
            <p className="text-[10px] text-muted-foreground">Tailored strictly to your verified resume & target job</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[11px] font-semibold text-emerald-500">Non-Fabrication Verified</span>
        </div>
      </div>

      <div className="p-8 space-y-8 max-w-4xl w-full mx-auto">

        {/* Input Form */}
        <FadeUp>
          <div className="p-6 rounded-2xl border border-border/50 bg-card shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-accent" />
                <h3 className="text-sm font-bold">Generation Details</h3>
              </div>
              <span className="text-xs text-muted-foreground font-medium bg-muted px-2.5 py-1 rounded-full">
                {currentResumeTitle}
              </span>
            </div>

            {error && (
              <div className="p-3.5 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Target Company *</label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g. Stripe, Google, Acme Corp"
                  className="w-full h-10 px-3 rounded-xl bg-background border border-border/60 text-sm focus:outline-none focus:border-accent"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Target Role *</label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g. Senior Software Engineer"
                  className="w-full h-10 px-3 rounded-xl bg-background border border-border/60 text-sm focus:outline-none focus:border-accent"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">Job Description (Optional)</label>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste key responsibilities or requirements from the job posting..."
                rows={3}
                className="w-full p-3 rounded-xl bg-background border border-border/60 text-xs focus:outline-none focus:border-accent resize-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">Custom Focus Instructions (Optional)</label>
              <input
                type="text"
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder="e.g. Emphasize backend scaling experience and leadership"
                className="w-full h-10 px-3 rounded-xl bg-background border border-border/60 text-xs focus:outline-none focus:border-accent"
              />
            </div>

            <Button
              onClick={handleGenerate}
              disabled={isGenerating || !company.trim() || !role.trim()}
              className="w-full h-11 rounded-xl bg-accent text-accent-foreground font-semibold gap-2 shadow-md hover:bg-accent/90"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating Fact-Grounded Cover Letter...
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4" />
                  Generate Cover Letter with AI
                </>
              )}
            </Button>
          </div>
        </FadeUp>

        {/* Active Letter Result */}
        {activeLetter && (
          <FadeUp delay={0.1}>
            <div className="p-6 rounded-2xl border border-border/50 bg-card shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border/40">
                <div>
                  <h3 className="font-bold text-base">{activeLetter.title}</h3>
                  <p className="text-xs text-muted-foreground">
                    Tone: <span className="capitalize font-semibold text-accent">{activeLetter.tone}</span>
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    onClick={handleCopy}
                    size="sm"
                    variant="outline"
                    className="h-8 gap-1.5 text-xs rounded-lg"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? "Copied!" : "Copy"}
                  </Button>
                  <Button
                    onClick={() => void generateCoverLetter()}
                    size="sm"
                    variant="outline"
                    disabled={isGenerating}
                    className="h-8 gap-1.5 text-xs rounded-lg"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? "animate-spin" : ""}`} />
                    Regenerate
                  </Button>
                  <Button
                    onClick={() => void deleteLetter(activeLetter.id)}
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {activeLetter.subject && (
                <div className="p-3 rounded-xl bg-accent/5 border border-accent/20 text-xs font-semibold flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-accent shrink-0" />
                  <span>Subject: {activeLetter.subject}</span>
                </div>
              )}

              {activeLetter.personalizationPoints && activeLetter.personalizationPoints.length > 0 && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs space-y-1">
                  <span className="font-semibold text-emerald-500 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Key Personalization Points
                  </span>
                  <ul className="list-disc list-inside text-muted-foreground space-y-0.5 pl-1">
                    {activeLetter.personalizationPoints.map((pt, i) => (
                      <li key={i}>{pt}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="p-6 rounded-xl bg-muted/20 border border-border/30 font-serif text-sm leading-relaxed whitespace-pre-wrap text-foreground/90">
                {activeLetter.content}
              </div>
            </div>
          </FadeUp>
        )}

      </div>
    </div>
  );
}
