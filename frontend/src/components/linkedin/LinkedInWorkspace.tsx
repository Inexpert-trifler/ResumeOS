"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FadeUp } from "@/animations/FadeUp";
import { Link2, Sparkles, TrendingUp, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

const PROFILE_SECTIONS = [
  { label: "Headline", score: 62, suggestion: "Add your top skill + value prop. E.g. 'Senior SWE | Building scalable systems at scale'" },
  { label: "Summary / About", score: 45, suggestion: "Too generic. Start with a strong hook. Mention your biggest career achievement in line 1." },
  { label: "Experience", score: 78, suggestion: "Good bullet points. Add metrics to 3 more entries to reach 90+" },
  { label: "Skills & Endorsements", score: 55, suggestion: "You're missing top keywords: 'System Design', 'Distributed Systems', 'Go'" },
  { label: "Featured Section", score: 20, suggestion: "Empty! Add your best project, article, or portfolio link here." },
];

const SCORE_TIERS = [
  { range: "0–40", label: "All-Star Needed", color: "text-red-500", bg: "bg-red-500/10" },
  { range: "41–65", label: "Intermediate", color: "text-yellow-500", bg: "bg-yellow-500/10" },
  { range: "66–85", label: "Strong Profile", color: "text-blue-500", bg: "bg-blue-500/10" },
  { range: "86–100", label: "Top 1%", color: "text-green-500", bg: "bg-green-500/10" },
];

export function LinkedInWorkspace() {
  const [activeSection, setActiveSection] = useState(0);

  return (
    <div className="flex-1 flex flex-col h-full bg-background overflow-y-auto no-scrollbar">

      <div className="h-16 flex items-center justify-between px-8 border-b border-border/50 shrink-0 bg-background/80 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#0077b5]/10 flex items-center justify-center">
            <Link2 className="w-4 h-4 text-[#0077b5]" />
          </div>
          <div>
            <h1 className="font-semibold text-sm">LinkedIn Optimizer</h1>
            <p className="text-[10px] text-muted-foreground">Profile Intelligence Engine</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20">
          <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          <span className="text-[11px] font-semibold text-accent">Coming Q3 2025</span>
        </div>
      </div>

      <div className="p-8 space-y-10 max-w-4xl w-full mx-auto">

        <FadeUp>
          <div className="text-center space-y-3 pt-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border/50 bg-muted/30 text-xs text-muted-foreground mb-2">
              <Sparkles className="w-3.5 h-3.5 text-accent" />
              LinkedIn Profile Intelligence · 10x More Views
            </div>
            <h2 className="text-3xl font-bold tracking-tight">Turn Your LinkedIn Into a Magnet</h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-sm leading-relaxed">
              Our AI analyzes every section of your LinkedIn profile and provides actionable improvements that increase recruiter views by up to 10x.
            </p>
          </div>
        </FadeUp>

        {/* Mock Profile Card */}
        <FadeUp delay={0.1}>
          <div className="p-6 rounded-3xl border border-border/50 bg-card overflow-hidden relative">
            <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-r from-[#0077b5]/20 via-[#0077b5]/10 to-transparent" />
            <div className="relative flex items-start gap-5">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-accent to-accent/50 flex items-center justify-center text-white font-bold text-xl border-4 border-background shrink-0 mt-4">
                AJ
              </div>
              <div className="flex-1 pt-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-lg">Alex Johnson</h3>
                    <p className="text-sm text-muted-foreground">Software Engineer · San Francisco, CA</p>
                    <p className="text-xs text-muted-foreground mt-0.5">500+ connections</p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-black text-accent">58</div>
                    <div className="text-[10px] text-muted-foreground">Profile Score</div>
                  </div>
                </div>
                <div className="mt-4 h-2 w-full bg-muted rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: "58%" }} transition={{ duration: 1.2, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-[#0077b5] to-accent rounded-full" />
                </div>
                <div className="flex gap-2 mt-3">
                  {SCORE_TIERS.map((tier, i) => (
                    <div key={i} className={cn("px-2 py-0.5 rounded text-[9px] font-bold", tier.bg, tier.color,
                      i === 1 ? "ring-1 ring-current" : "")}>
                      {tier.label}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </FadeUp>

        {/* Section Scores */}
        <FadeUp delay={0.15}>
          <div className="space-y-3">
            <h3 className="font-semibold flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-accent" /> Section Analysis
            </h3>
            {PROFILE_SECTIONS.map((section, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                onClick={() => setActiveSection(i)}
                className={cn("p-4 rounded-2xl border cursor-pointer transition-all",
                  activeSection === i ? "border-accent/50 bg-accent/5" : "border-border/50 bg-card hover:border-accent/30")}>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold">{section.label}</span>
                      <span className={cn("text-sm font-bold",
                        section.score >= 75 ? "text-green-500" : section.score >= 50 ? "text-yellow-500" : "text-red-500")}>
                        {section.score}/100
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${section.score}%` }} transition={{ duration: 0.8, ease: "easeOut", delay: i * 0.1 }}
                        className={cn("h-full rounded-full", section.score >= 75 ? "bg-green-500" : section.score >= 50 ? "bg-yellow-500" : "bg-red-500")} />
                    </div>
                  </div>
                </div>
                {activeSection === i && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-3 pt-3 border-t border-border/50">
                    <div className="flex items-start gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-accent shrink-0 mt-0.5" />
                      <p className="text-xs text-muted-foreground leading-relaxed">{section.suggestion}</p>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </FadeUp>

        {/* Roadmap */}
        <FadeUp delay={0.2}>
          <div className="p-6 rounded-3xl border border-border/50 bg-card">
            <h3 className="font-semibold mb-5 flex items-center gap-2">
              <Zap className="w-4 h-4 text-accent" /> Version Roadmap
            </h3>
            <div className="space-y-4">
              {[
                { v: "v1.0", label: "Profile Score Analysis", date: "Q2 2025", done: false },
                { v: "v1.5", label: "AI Headline & Summary Rewrite", date: "Q3 2025", done: false },
                { v: "v2.0", label: "Recruiter Search Keyword Optimizer", date: "Q4 2025", done: false },
                { v: "v2.5", label: "Network Growth Automation Insights", date: "Q1 2026", done: false },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-[10px] font-bold text-muted-foreground shrink-0">{item.v}</div>
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground font-medium">{item.label}</p>
                    <p className="text-[10px] text-muted-foreground/60">{item.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </FadeUp>
      </div>
    </div>
  );
}
