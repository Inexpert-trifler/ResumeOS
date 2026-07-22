"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FadeUp } from "@/animations/FadeUp";
import { StaggerContainer, StaggerItem } from "@/animations/StaggerAnimation";
import { Map, Sparkles, Target, TrendingUp, BookOpen, Code2, CheckCircle2, Clock, Zap, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const CURRENT_LEVEL = { title: "Mid-Level Software Engineer", yoe: "3 years", score: 62 };
const TARGET_ROLE = { title: "Staff Engineer", company: "Tier 1 Tech", timeline: "18–24 months" };

const SKILL_GAPS = [
  { skill: "System Design", current: 45, required: 90, priority: "critical", color: "#ef4444" },
  { skill: "Leadership & Mentoring", current: 30, required: 80, priority: "critical", color: "#f97316" },
  { skill: "Distributed Systems", current: 65, required: 85, priority: "high", color: "#eab308" },
  { skill: "Go / Rust", current: 40, required: 70, priority: "medium", color: "#3b82f6" },
  { skill: "Cloud Architecture", current: 55, required: 80, priority: "high", color: "#a855f7" },
  { skill: "Technical Writing", current: 50, required: 75, priority: "medium", color: "#22c55e" },
];

const MILESTONES = [
  { month: "Month 1–3", label: "Foundations", tasks: ["Complete System Design Primer", "Lead 1 major project end-to-end", "Start tech blog"], done: true },
  { month: "Month 4–6", label: "Depth", tasks: ["Design & ship a distributed system", "Mentor 2 junior engineers", "Get Staff promotion letter drafted"], done: false },
  { month: "Month 7–12", label: "Visibility", tasks: ["Present architecture review to leadership", "Contribute to open-source project", "Build cross-team alignment skill"], done: false },
  { month: "Month 13–24", label: "Promotion", tasks: ["Staff promo packet ready", "Demonstrated leadership impact", "Mock interview with Staff engineers"], done: false },
];

const PROJECTS = [
  { name: "Rate Limiter Service", impact: "High", skills: ["Distributed Systems", "Go"], effort: "2 weeks" },
  { name: "Internal Design Doc Template", impact: "Medium", skills: ["Technical Writing", "Leadership"], effort: "3 days" },
  { name: "API Gateway Refactor", impact: "High", skills: ["System Design", "Cloud"], effort: "1 month" },
];

export function CareerRoadmapWorkspace() {
  const [activeTab, setActiveTab] = useState<"gaps" | "milestones" | "projects">("gaps");

  return (
    <div className="flex-1 flex flex-col h-full bg-background overflow-y-auto no-scrollbar">

      <div className="h-16 flex items-center justify-between px-8 border-b border-border/50 shrink-0 bg-background/80 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
            <Map className="w-4 h-4 text-accent" />
          </div>
          <div>
            <h1 className="font-semibold text-sm">Career Roadmap</h1>
            <p className="text-[10px] text-muted-foreground">AI-Personalized Growth Path</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20">
          <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          <span className="text-[11px] font-semibold text-accent">Coming Q1 2026</span>
        </div>
      </div>

      <div className="p-8 space-y-10 max-w-4xl w-full mx-auto">

        <FadeUp>
          <div className="text-center space-y-3 pt-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border/50 bg-muted/30 text-xs text-muted-foreground mb-2">
              <Sparkles className="w-3.5 h-3.5 text-accent" />
              AI Career Intelligence · Personalized to You
            </div>
            <h2 className="text-3xl font-bold tracking-tight">Your Path to the Next Level</h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-sm leading-relaxed">
              Based on your current skills, experience, and target role, our AI builds a precise, month-by-month roadmap to get you promoted.
            </p>
          </div>
        </FadeUp>

        {/* Current → Target Card */}
        <FadeUp delay={0.1}>
          <div className="p-6 rounded-3xl border border-border/50 bg-card">
            <div className="flex items-center justify-between gap-6">
              <div className="flex-1 p-4 rounded-2xl bg-muted/50 border border-border/50">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60 mb-2">Current Level</p>
                <p className="font-bold text-lg">{CURRENT_LEVEL.title}</p>
                <p className="text-sm text-muted-foreground">{CURRENT_LEVEL.yoe} experience</p>
                <div className="mt-3 h-1.5 w-full bg-muted rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${CURRENT_LEVEL.score}%` }} transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full bg-accent rounded-full" />
                </div>
                <p className="text-[10px] text-accent mt-1 font-semibold">{CURRENT_LEVEL.score}% to next level</p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <motion.div animate={{ x: [0, 6, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                  <ArrowRight className="w-8 h-8 text-accent" />
                </motion.div>
                <span className="text-[10px] text-muted-foreground font-medium">{TARGET_ROLE.timeline}</span>
              </div>
              <div className="flex-1 p-4 rounded-2xl bg-accent/5 border border-accent/30">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-accent/60 mb-2">Target Role</p>
                <p className="font-bold text-lg text-accent">{TARGET_ROLE.title}</p>
                <p className="text-sm text-muted-foreground">{TARGET_ROLE.company}</p>
                <div className="mt-3 flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5 text-accent" />
                  <span className="text-xs text-accent font-medium">Active Goal</span>
                </div>
              </div>
            </div>
          </div>
        </FadeUp>

        {/* Tabs */}
        <FadeUp delay={0.15}>
          <div>
            <div className="flex gap-2 mb-6 p-1 bg-muted/50 rounded-xl w-fit">
              {[
                { id: "gaps", label: "Skill Gaps", icon: TrendingUp },
                { id: "milestones", label: "Milestones", icon: Clock },
                { id: "projects", label: "Projects", icon: Code2 },
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id as typeof activeTab)}
                    className={cn("flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                      activeTab === tab.id ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground")}>
                    <Icon className="w-3.5 h-3.5" />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {activeTab === "gaps" && (
              <div className="space-y-4">
                {SKILL_GAPS.map((gap, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                    className="p-4 rounded-2xl border border-border/50 bg-card">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-semibold">{gap.skill}</span>
                      <span className={cn("text-[10px] font-bold uppercase px-2 py-0.5 rounded-full",
                        gap.priority === "critical" ? "bg-red-500/10 text-red-500" :
                        gap.priority === "high" ? "bg-orange-500/10 text-orange-500" :
                        "bg-blue-500/10 text-blue-500")}>
                        {gap.priority}
                      </span>
                    </div>
                    <div className="relative h-3 bg-muted rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${gap.required}%` }} transition={{ duration: 0.8, ease: "easeOut", delay: i * 0.1 }}
                        className="absolute h-full rounded-full opacity-20" style={{ backgroundColor: gap.color }} />
                      <motion.div initial={{ width: 0 }} animate={{ width: `${gap.current}%` }} transition={{ duration: 0.8, ease: "easeOut", delay: i * 0.1 }}
                        className="absolute h-full rounded-full" style={{ backgroundColor: gap.color }} />
                    </div>
                    <div className="flex justify-between mt-1.5">
                      <span className="text-[10px] text-muted-foreground">Current: {gap.current}%</span>
                      <span className="text-[10px] text-muted-foreground">Required: {gap.required}%</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {activeTab === "milestones" && (
              <div className="space-y-4 relative before:absolute before:inset-0 before:ml-[15px] before:-translate-x-px before:h-full before:w-px before:bg-gradient-to-b before:from-border/80 before:to-transparent">
                {MILESTONES.map((m, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                    className="relative flex gap-5 pl-2">
                    <div className={cn("w-8 h-8 rounded-full border-2 flex items-center justify-center shrink-0 z-10 transition-all",
                      m.done ? "bg-accent border-accent text-white" : i === 1 ? "bg-background border-accent" : "bg-background border-muted")}>
                      {m.done ? <CheckCircle2 className="w-4 h-4" /> : <span className="text-xs font-bold text-muted-foreground">{i + 1}</span>}
                    </div>
                    <div className={cn("flex-1 p-4 rounded-2xl border transition-all mb-2",
                      m.done ? "border-accent/30 bg-accent/5" : i === 1 ? "border-accent/50 bg-accent/3" : "border-border/50 bg-card")}>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[10px] text-muted-foreground font-medium">{m.month}</span>
                        <span className="font-semibold text-sm">{m.label}</span>
                      </div>
                      <div className="space-y-1.5">
                        {m.tasks.map((task, ti) => (
                          <div key={ti} className="flex items-center gap-2 text-xs text-muted-foreground">
                            <div className={cn("w-1.5 h-1.5 rounded-full shrink-0", m.done ? "bg-accent" : "bg-muted-foreground/30")} />
                            {task}
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {activeTab === "projects" && (
              <StaggerContainer className="space-y-4">
                {PROJECTS.map((p, i) => (
                  <StaggerItem key={i}>
                    <div className="p-5 rounded-2xl border border-border/50 bg-card hover:border-accent/30 transition-all">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h4 className="font-semibold mb-1">{p.name}</h4>
                          <div className="flex flex-wrap gap-1.5 mb-2">
                            {p.skills.map((s, si) => (
                              <span key={si} className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-accent/10 text-accent">{s}</span>
                            ))}
                          </div>
                          <p className="text-xs text-muted-foreground">Effort: {p.effort}</p>
                        </div>
                        <span className={cn("text-[10px] font-bold px-2 py-1 rounded-full shrink-0",
                          p.impact === "High" ? "bg-green-500/10 text-green-500" : "bg-blue-500/10 text-blue-500")}>
                          {p.impact} Impact
                        </span>
                      </div>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            )}
          </div>
        </FadeUp>

      </div>
    </div>
  );
}
