"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Wand2, Loader2, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAnalyzerStore } from "@/stores/useAnalyzerStore";
import { useAuth } from "@clerk/nextjs";

export function AnalyzerHeroUpload() {
  const { isLoaded } = useAuth();
  const { jobDescription, targetRole, setJobDescription, setTargetRole, runAnalysis, isAnalyzing, error, analysis } = useAnalyzerStore();

  const handleAnalyze = async () => {
    if (!isLoaded) return;
    void runAnalysis();
  };

  return (
    <section className="mb-10">
      {/* Header */}
      <div className="text-center mb-8">
        <motion.h1 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-5xl font-bold tracking-tight mb-4"
        >
          ATS Resume <span className="text-accent">Analyzer</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-muted-foreground text-base max-w-2xl mx-auto"
        >
          Run a real, deterministic ATS match analysis between your active resume and any target job description.
        </motion.p>
      </div>

      {/* Target Role & Job Description Inputs */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.15 }}
        className="max-w-3xl mx-auto p-6 rounded-3xl border border-border/60 bg-card shadow-sm space-y-4"
      >
        {error && (
          <div className="p-3.5 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-medium">
            {error}
          </div>
        )}

        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-accent" />
          <h3 className="text-sm font-bold">Target Job Context</h3>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-muted-foreground">Target Role Title (Optional)</label>
          <input
            type="text"
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value)}
            placeholder="e.g. Senior Full Stack Engineer"
            className="w-full h-10 px-3.5 rounded-xl bg-background border border-border/60 text-sm focus:outline-none focus:border-accent"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-muted-foreground">Paste Job Description for Real Match Score</label>
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste target job responsibilities, skills, and qualifications here..."
            rows={4}
            className="w-full p-3.5 rounded-xl bg-background border border-border/60 text-xs focus:outline-none focus:border-accent resize-none"
          />
        </div>

        <Button
          onClick={handleAnalyze}
          disabled={isAnalyzing}
          size="lg"
          className="w-full rounded-2xl bg-accent text-accent-foreground font-semibold gap-2 shadow-md hover:bg-accent/90"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Computing Deterministic ATS Match Score...
            </>
          ) : (
            <>
              <Wand2 className="w-4 h-4" />
              {analysis ? "Re-Run ATS Match Analysis" : "Run Real ATS Match Analysis"}
            </>
          )}
        </Button>
      </motion.div>
    </section>
  );
}
