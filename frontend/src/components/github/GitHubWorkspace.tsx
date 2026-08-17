"use client";

import { motion } from "framer-motion";
import { FadeUp } from "@/animations/FadeUp";
import { StaggerContainer, StaggerItem } from "@/animations/StaggerAnimation";
import { GitBranch, Sparkles, Star, GitFork, TrendingUp, Zap, Code2 } from "lucide-react";
import { cn } from "@/lib/utils";

const REPOS = [
  { name: "distributed-cache", stars: 342, forks: 48, lang: "Go", score: 91, desc: "High-performance distributed cache with consistent hashing", status: "excellent" },
  { name: "payment-sdk", stars: 127, forks: 23, lang: "TypeScript", score: 74, desc: "Lightweight payment processing SDK for Node.js", status: "good" },
  { name: "algo-practice", stars: 14, forks: 3, lang: "Python", score: 38, desc: "LeetCode solutions — no README, poor naming", status: "poor" },
  { name: "portfolio-site", stars: 56, forks: 8, lang: "React", score: 82, desc: "Personal portfolio with dark mode and animations", status: "good" },
];

const CONTRIBUTIONS = [
  [3, 7, 2, 8, 5, 1, 4],
  [6, 2, 9, 4, 7, 3, 5],
  [1, 8, 3, 6, 2, 9, 4],
  [7, 4, 5, 2, 8, 6, 1],
  [3, 9, 4, 7, 1, 5, 8],
  [5, 2, 8, 3, 6, 4, 7],
  [4, 6, 1, 9, 3, 8, 2],
  [8, 3, 7, 5, 4, 2, 6],
  [2, 7, 5, 1, 9, 3, 8],
  [6, 1, 4, 8, 2, 7, 5],
  [3, 5, 8, 4, 6, 1, 9],
  [7, 2, 6, 3, 5, 8, 4],
  [1, 9, 3, 7, 4, 6, 2],
];

const STATUS_CONFIG: Record<string, { color: string; bg: string; label: string }> = {
  excellent: { color: "text-green-500", bg: "bg-green-500/10", label: "Excellent" },
  good: { color: "text-blue-500", bg: "bg-blue-500/10", label: "Good" },
  poor: { color: "text-red-500", bg: "bg-red-500/10", label: "Needs Work" },
};

export function GitHubWorkspace() {
  return (
    <div className="flex-1 flex flex-col h-full bg-background overflow-y-auto no-scrollbar">

      <div className="h-16 flex items-center justify-between px-8 border-b border-border/50 shrink-0 bg-background/80 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-foreground/5 border border-border flex items-center justify-center">
            <GitBranch className="w-4 h-4 text-foreground" />
          </div>
          <div>
            <h1 className="font-semibold text-sm">GitHub Optimizer</h1>
            <p className="text-[10px] text-muted-foreground">Repository & Portfolio Intelligence</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20">
          <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          <span className="text-[11px] font-semibold text-accent">Coming Q4 2025</span>
        </div>
      </div>

      <div className="p-8 space-y-10 max-w-4xl w-full mx-auto">

        <FadeUp>
          <div className="text-center space-y-3 pt-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border/50 bg-muted/30 text-xs text-muted-foreground mb-2">
              <Sparkles className="w-3.5 h-3.5 text-accent" />
              Portfolio Intelligence · Recruiter-Ready Profile
            </div>
            <h2 className="text-3xl font-bold tracking-tight">Make Your GitHub Speak for You</h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-sm leading-relaxed">
              Recruiters check your GitHub before every interview. Our AI ranks, improves, and positions your repositories to tell a compelling engineering story.
            </p>
          </div>
        </FadeUp>

        {/* Contribution Graph */}
        <FadeUp delay={0.1}>
          <div className="p-6 rounded-3xl border border-border/50 bg-card">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-accent" /> Contribution Activity
            </h3>
            <div className="flex gap-1 overflow-x-auto pb-2 no-scrollbar">
              {CONTRIBUTIONS.map((week, wi) => (
                <div key={wi} className="flex flex-col gap-1">
                  {week.map((val, di) => (
                    <motion.div
                      key={di}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: (wi * 7 + di) * 0.005 }}
                      className="w-3 h-3 rounded-sm"
                      style={{
                        backgroundColor: val === 0 ? "hsl(var(--muted))" :
                          val < 3 ? "oklch(0.55 0.2 250 / 0.25)" :
                          val < 6 ? "oklch(0.55 0.2 250 / 0.5)" :
                          val < 8 ? "oklch(0.55 0.2 250 / 0.75)" :
                          "oklch(0.55 0.2 250)"
                      }}
                      title={`${val} contributions`}
                    />
                  ))}
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-3">847 contributions in the last year · 32-day streak</p>
          </div>
        </FadeUp>

        {/* Repository Rankings */}
        <FadeUp delay={0.15}>
          <div>
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Code2 className="w-4 h-4 text-accent" /> Repository Analysis
            </h3>
            <StaggerContainer className="space-y-3">
              {REPOS.map((repo, i) => {
                const st = STATUS_CONFIG[repo.status];
                return (
                  <StaggerItem key={i}>
                    <div className="p-5 rounded-2xl border border-border/50 bg-card hover:border-accent/30 transition-all group cursor-pointer">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <GitBranch className="w-4 h-4 text-muted-foreground shrink-0" />
                            <span className="font-semibold text-sm group-hover:text-accent transition-colors truncate">{repo.name}</span>
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-muted text-muted-foreground shrink-0">{repo.lang}</span>
                          </div>
                          <p className="text-xs text-muted-foreground leading-relaxed">{repo.desc}</p>
                          <div className="flex items-center gap-4 mt-2">
                            <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                              <Star className="w-3 h-3" />{repo.stars}
                            </span>
                            <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                              <GitFork className="w-3 h-3" />{repo.forks}
                            </span>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="text-2xl font-black" style={{ color: repo.score >= 80 ? "#22c55e" : repo.score >= 60 ? "#3b82f6" : "#ef4444" }}>
                            {repo.score}
                          </div>
                          <div className={cn("text-[9px] font-bold px-1.5 py-0.5 rounded-full", st.bg, st.color)}>{st.label}</div>
                        </div>
                      </div>
                    </div>
                  </StaggerItem>
                );
              })}
            </StaggerContainer>
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
                { v: "v1.0", label: "Repository Score & Ranking", date: "Q3 2025" },
                { v: "v1.5", label: "AI README Generator", date: "Q4 2025" },
                { v: "v2.0", label: "Project Narrative Builder", date: "Q1 2026" },
                { v: "v2.5", label: "Open Source Contribution Tracker", date: "Q2 2026" },
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
