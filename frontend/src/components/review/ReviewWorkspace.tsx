"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FadeUp } from "@/animations/FadeUp";
import { StaggerContainer, StaggerItem } from "@/animations/StaggerAnimation";
import { UploadCloud, FileText, Brain, Sparkles, CheckCircle2, AlertCircle, TrendingUp, Target, BarChart2, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const SCORE_BREAKDOWN = [
  { label: "ATS Compatibility", score: 92, color: "#3b82f6", desc: "Passes major ATS systems" },
  { label: "Grammar & Clarity", score: 88, color: "#22c55e", desc: "Clear and professional tone" },
  { label: "Impact & Metrics", score: 71, color: "#f97316", desc: "Add more quantified achievements" },
  { label: "Keyword Match", score: 85, color: "#a855f7", desc: "Strong industry keywords" },
  { label: "Formatting", score: 95, color: "#ec4899", desc: "Clean, readable layout" },
  { label: "Overall Score", score: 86, color: "#eab308", desc: "Top 12% of candidates" },
];

const MOCK_FEEDBACK = [
  { type: "success", text: "Strong action verbs used throughout (Engineered, Architected, Led)" },
  { type: "success", text: "Quantified impact in 4 out of 6 bullet points" },
  { type: "warning", text: "Summary section could be more targeted to the role" },
  { type: "warning", text: "Skills section missing cloud certifications (AWS/GCP)" },
  { type: "error", text: "Work experience gap between 2021–2022 not addressed" },
];

const WORKFLOW_STEPS = [
  { icon: UploadCloud, label: "Upload", desc: "PDF or DOCX", color: "text-blue-500", bg: "bg-blue-500/10" },
  { icon: Brain, label: "AI Scan", desc: "50k+ patterns", color: "text-purple-500", bg: "bg-purple-500/10" },
  { icon: Target, label: "ATS Test", desc: "Live simulation", color: "text-orange-500", bg: "bg-orange-500/10" },
  { icon: TrendingUp, label: "Score", desc: "Percentile rank", color: "text-green-500", bg: "bg-green-500/10" },
];

export function ReviewWorkspace() {
  const [uploaded, setUploaded] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [done, setDone] = useState(false);

  const handleUpload = () => {
    setUploaded(true);
    setAnalyzing(true);
    setTimeout(() => { setAnalyzing(false); setDone(true); }, 2200);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-background overflow-y-auto no-scrollbar">

      {/* Header */}
      <div className="h-16 flex items-center justify-between px-8 border-b border-border/50 shrink-0 bg-background/80 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
            <FileText className="w-4 h-4 text-accent" />
          </div>
          <div>
            <h1 className="font-semibold text-sm">AI Resume Review</h1>
            <p className="text-[10px] text-muted-foreground">Powered by Resume Intelligence Engine v2</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20">
          <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          <span className="text-[11px] font-semibold text-accent">AI Engine Live</span>
        </div>
      </div>

      <div className="p-8 space-y-10 max-w-4xl w-full mx-auto">

        {/* Hero */}
        <FadeUp>
          <div className="text-center space-y-3 pt-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border/50 bg-muted/30 text-xs text-muted-foreground mb-2">
              <Sparkles className="w-3.5 h-3.5 text-accent" />
              Deep Resume Intelligence · Coming Q2 2025
            </div>
            <h2 className="text-3xl font-bold tracking-tight">Your Resume, Analyzed by AI</h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-sm leading-relaxed">
              Upload your resume and receive a comprehensive 360° review — from ATS compatibility to recruiter perception, grammar, keyword density, and a final percentile score.
            </p>
          </div>
        </FadeUp>

        {/* Workflow Steps */}
        <FadeUp delay={0.1}>
          <StaggerContainer className="grid grid-cols-4 gap-4">
            {WORKFLOW_STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <StaggerItem key={i}>
                  <div className="p-4 rounded-2xl border border-border/50 bg-card text-center hover:border-accent/30 transition-all group">
                    <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-3", step.bg)}>
                      <Icon className={cn("w-5 h-5", step.color)} />
                    </div>
                    <p className="text-sm font-semibold">{step.label}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{step.desc}</p>
                    <div className="flex items-center justify-center gap-1 mt-2">
                      {[0,1,2,3].map((dot) => (
                        <div key={dot} className={cn("w-1 h-1 rounded-full", dot <= i ? "bg-accent" : "bg-muted")} />
                      ))}
                    </div>
                  </div>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </FadeUp>

        {/* Upload Zone */}
        <FadeUp delay={0.15}>
          <AnimatePresence mode="wait">
            {!done ? (
              <motion.div key="upload" exit={{ opacity: 0, scale: 0.97 }}>
                <div
                  onClick={!uploaded ? handleUpload : undefined}
                  className={cn(
                    "relative rounded-3xl border-2 border-dashed transition-all overflow-hidden",
                    !uploaded ? "border-border/50 hover:border-accent/50 cursor-pointer hover:bg-accent/2 group" :
                    analyzing ? "border-accent/50 bg-accent/5" : "border-green-500/50 bg-green-500/5"
                  )}
                >
                  {/* Animated gradient top bar */}
                  <motion.div
                    className="absolute top-0 left-0 h-0.5 bg-gradient-to-r from-accent/0 via-accent to-accent/0"
                    initial={{ scaleX: 0 }}
                    animate={analyzing ? { scaleX: [0, 1, 0] } : { scaleX: 0 }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />

                  <div className="p-12 text-center">
                    {!uploaded && (
                      <>
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4 group-hover:bg-accent/10 transition-colors"
                        >
                          <UploadCloud className="w-8 h-8 text-muted-foreground group-hover:text-accent transition-colors" />
                        </motion.div>
                        <p className="font-semibold text-foreground mb-1">Drop your resume here</p>
                        <p className="text-sm text-muted-foreground mb-6">PDF, DOCX supported · Max 5MB</p>
                        <Button size="sm" className="rounded-full px-6">Browse Files</Button>
                      </>
                    )}
                    {uploaded && analyzing && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-center gap-3">
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-8 h-8 rounded-full border-2 border-accent border-t-transparent"
                          />
                          <span className="font-semibold text-accent">Analyzing your resume…</span>
                        </div>
                        <div className="space-y-2 max-w-xs mx-auto">
                          {["Parsing document structure", "Running ATS simulation", "Scoring keyword density"].map((t, i) => (
                            <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.5 }}
                              className="flex items-center gap-2 text-sm text-muted-foreground">
                              <CheckCircle2 className="w-3.5 h-3.5 text-accent shrink-0" />
                              {t}
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div key="results" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
                {/* Score Cards */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                  {SCORE_BREAKDOWN.map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.08 }}
                      className="p-5 rounded-2xl border border-border/50 bg-card hover:shadow-md transition-all"
                    >
                      <div className="flex items-end justify-between mb-3">
                        <span className="text-xs font-semibold text-muted-foreground">{item.label}</span>
                        <span className="text-2xl font-black" style={{ color: item.color }}>{item.score}</span>
                      </div>
                      <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${item.score}%` }}
                          transition={{ duration: 1, ease: "easeOut", delay: i * 0.1 }}
                          className="h-full rounded-full"
                          style={{ backgroundColor: item.color }}
                        />
                      </div>
                      <p className="text-[10px] text-muted-foreground mt-2">{item.desc}</p>
                    </motion.div>
                  ))}
                </div>

                {/* Feedback List */}
                <div className="p-6 rounded-2xl border border-border/50 bg-card">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <BarChart2 className="w-4 h-4 text-accent" /> Recruiter Feedback
                  </h3>
                  <div className="space-y-3">
                    {MOCK_FEEDBACK.map((f, i) => (
                      <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.1 }}
                        className={cn("flex items-start gap-3 p-3 rounded-xl text-sm",
                          f.type === "success" ? "bg-green-500/5 text-green-600 dark:text-green-400" :
                          f.type === "warning" ? "bg-yellow-500/5 text-yellow-600 dark:text-yellow-400" :
                          "bg-red-500/5 text-red-500")}>
                        {f.type === "success" ? <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" /> :
                         f.type === "warning" ? <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" /> :
                         <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />}
                        {f.text}
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </FadeUp>

        {/* Development Timeline */}
        <FadeUp delay={0.2}>
          <div className="p-6 rounded-3xl border border-border/50 bg-card">
            <h3 className="font-semibold mb-6 flex items-center gap-2">
              <Zap className="w-4 h-4 text-accent" /> Development Roadmap
            </h3>
            <div className="space-y-4">
              {[
                { v: "v1.0", label: "Core AI Analysis Engine", date: "Q1 2025", done: true },
                { v: "v1.5", label: "Recruiter Simulation Model", date: "Q2 2025", done: false },
                { v: "v2.0", label: "Real-time Collaboration Review", date: "Q3 2025", done: false },
                { v: "v2.5", label: "Industry Benchmark Database", date: "Q4 2025", done: false },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold shrink-0",
                    item.done ? "bg-accent text-white" : "bg-muted text-muted-foreground")}>
                    {item.v}
                  </div>
                  <div className="flex-1">
                    <p className={cn("text-sm font-medium", item.done ? "text-foreground" : "text-muted-foreground")}>{item.label}</p>
                    <p className="text-[10px] text-muted-foreground/60">{item.date}</p>
                  </div>
                  {item.done && <CheckCircle2 className="w-4 h-4 text-accent shrink-0" />}
                </div>
              ))}
            </div>
          </div>
        </FadeUp>

      </div>
    </div>
  );
}
