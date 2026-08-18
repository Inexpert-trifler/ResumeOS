"use client";

import { useEffect } from "react";
import { FadeUp } from "@/animations/FadeUp";
import { Map, Sparkles, Target, CheckCircle2, Clock, ArrowRight, Wand2, Loader2, BookOpen, ExternalLink, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useRoadmapStore } from "@/stores/useRoadmapStore";
import { useAuth } from "@clerk/nextjs";
import Link from "next/link";

export function CareerRoadmapWorkspace() {
  const { isLoaded } = useAuth();
  const {
    targetRole,
    targetCompany,
    activeRoadmap,
    items,
    progress,
    isGenerating,
    error,
    setTargetRole,
    setTargetCompany,
    generateRoadmap,
    fetchRoadmaps,
    toggleItemStatus,
  } = useRoadmapStore();

  useEffect(() => {
    if (isLoaded) {
      void fetchRoadmaps();
    }
  }, [isLoaded, fetchRoadmaps]);

  const handleToggle = (itemId: string, currentStatus: string) => {
    const nextStatus = currentStatus === "COMPLETED" ? "NOT_STARTED" : currentStatus === "IN_PROGRESS" ? "COMPLETED" : "IN_PROGRESS";
    void toggleItemStatus(itemId, nextStatus);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-background overflow-y-auto no-scrollbar">

      {/* Top Header */}
      <div className="h-16 flex items-center justify-between px-8 border-b border-border/50 shrink-0 bg-background/80 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
            <Map className="w-4 h-4 text-accent" />
          </div>
          <div>
            <h1 className="font-semibold text-sm">Career Growth Roadmap</h1>
            <p className="text-[10px] text-muted-foreground">AI-Personalized Milestone & Skill Gap Path</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[11px] font-semibold text-emerald-500">ATS Integrated</span>
        </div>
      </div>

      <div className="p-8 space-y-8 max-w-4xl w-full mx-auto">

        {/* Generator Form */}
        <FadeUp>
          <div className="p-6 rounded-3xl border border-border/50 bg-card shadow-sm space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-accent" />
                <h3 className="text-sm font-bold">Target Role & Career Goal</h3>
              </div>
              <span className="text-xs font-semibold text-accent bg-accent/10 px-2.5 py-1 rounded-full">
                ATS Skill Gap Integration
              </span>
            </div>

            {error && (
              <div className="p-3.5 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-medium">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Target Role Title *</label>
                <input
                  type="text"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  placeholder="e.g. Senior Software Engineer, Staff Architect"
                  className="w-full h-10 px-3.5 rounded-xl bg-background border border-border/60 text-sm focus:outline-none focus:border-accent"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Target Company Tier (Optional)</label>
                <input
                  type="text"
                  value={targetCompany}
                  onChange={(e) => setTargetCompany(e.target.value)}
                  placeholder="e.g. Tier 1 Tech, Stripe, Google"
                  className="w-full h-10 px-3.5 rounded-xl bg-background border border-border/60 text-sm focus:outline-none focus:border-accent"
                />
              </div>
            </div>

            <Button
              onClick={() => void generateRoadmap()}
              disabled={isGenerating || !targetRole.trim()}
              size="lg"
              className="w-full rounded-2xl bg-accent text-accent-foreground font-semibold gap-2 shadow-md hover:bg-accent/90"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating Personalized Career Roadmap...
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4" />
                  {activeRoadmap ? "Regenerate Career Roadmap" : "Generate Personalized Career Roadmap"}
                </>
              )}
            </Button>
          </div>
        </FadeUp>

        {/* Active Roadmap Display */}
        {activeRoadmap && items.length > 0 && (
          <FadeUp delay={0.1}>
            <div className="space-y-6">
              
              {/* Progress Summary Card */}
              <div className="p-6 rounded-3xl border border-border/50 bg-card shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <h2 className="text-xl font-bold">{activeRoadmap.targetRole} Roadmap</h2>
                  <p className="text-xs text-muted-foreground mt-1">
                    {items.filter((i) => i.status === "COMPLETED").length} of {items.length} milestones completed
                  </p>
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto">
                  <div className="flex-1 md:w-48 bg-muted rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-accent h-full transition-all duration-500 rounded-full"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <span className="text-lg font-black text-accent shrink-0">{progress}%</span>
                </div>
              </div>

              {/* Milestones List */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground/70">Learning Milestones</h3>
                
                {items.map((item, idx) => {
                  const isDone = item.status === "COMPLETED";
                  const inProg = item.status === "IN_PROGRESS";

                  return (
                    <div
                      key={item.id}
                      className={cn(
                        "p-6 rounded-2xl border transition-all space-y-4",
                        isDone
                          ? "border-emerald-500/30 bg-emerald-500/5"
                          : inProg
                          ? "border-accent/40 bg-accent/5"
                          : "border-border/50 bg-card"
                      )}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3">
                          <button
                            onClick={() => handleToggle(item.id, item.status)}
                            className={cn(
                              "w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors",
                              isDone
                                ? "bg-emerald-500 border-emerald-500 text-white"
                                : inProg
                                ? "border-accent text-accent bg-accent/10"
                                : "border-muted-foreground/40 hover:border-accent"
                            )}
                          >
                            {isDone ? <CheckCircle2 className="w-4 h-4" /> : <div className="w-1.5 h-1.5 rounded-full bg-current" />}
                          </button>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-bold text-accent">Phase {idx + 1}</span>
                              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-muted uppercase">{item.category}</span>
                              <span className={cn(
                                "text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize",
                                item.priority === "high" ? "bg-rose-500/10 text-rose-500" : "bg-blue-500/10 text-blue-500"
                              )}>
                                {item.priority} Priority
                              </span>
                            </div>
                            <h4 className={cn("text-base font-bold", isDone && "line-through text-muted-foreground")}>{item.title}</h4>
                            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{item.description}</p>
                          </div>
                        </div>

                        <div className="text-xs text-muted-foreground font-semibold shrink-0 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-accent" /> {item.estimatedTime}
                        </div>
                      </div>

                      {/* Required Skills Badges */}
                      {item.skills && item.skills.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-border/30">
                          <span className="text-[10px] font-bold text-muted-foreground uppercase mr-1">Skills:</span>
                          {item.skills.map((skill) => (
                            <span key={skill} className="px-2.5 py-0.5 rounded-full bg-background border border-border/50 text-[11px] font-medium text-foreground">
                              {skill}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Resources / Resume Academy References */}
                      {item.resources && item.resources.length > 0 && (
                        <div className="pt-2 flex items-center gap-3 text-xs">
                          {item.resources.map((res, rIdx) => (
                            <div key={rIdx} className="flex items-center gap-1.5 text-accent font-medium hover:underline cursor-pointer">
                              {res.academyReference ? (
                                <Link href={res.academyReference} className="flex items-center gap-1 text-emerald-500 font-semibold">
                                  <BookOpen className="w-3.5 h-3.5" />
                                  <span>{res.title} (Resume Academy)</span>
                                </Link>
                              ) : (
                                <div className="flex items-center gap-1 text-muted-foreground">
                                  <ExternalLink className="w-3 h-3" />
                                  <span>{res.title}</span>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

            </div>
          </FadeUp>
        )}

      </div>
    </div>
  );
}
