"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, TrendingUp, AlertCircle, CheckCircle2, Sparkles, RefreshCcw, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { INITIAL_STATE } from "@/types";
import { builderToResume, createBuilderDraft, hydrateBuilderState, readResumeDraft, saveResumeDraft } from "@/lib/resume-draft";
import { useResumeAnalysis } from "@/lib/resume-analysis";
import {
  applyAiImprovementToBuilder,
  buildAiRequestFromRoadmapItem,
} from "@/services/ai/resume-targets";
import { requestAiImprovement, type AiImprovementResponse } from "@/services/ai";

type RecommendationAiState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "ready"; targetId: string; response: AiImprovementResponse }
  | { status: "error"; message: string }
  | { status: "dismissed" };

const AI_SUPPORTED_CATEGORIES = new Set([
  "Resume Structure",
  "Skills",
  "Projects",
  "Experience",
  "Achievements",
  "ATS",
]);

export function AnalyzerImprovementRoadmap() {
  const router = useRouter();
  const analysis = useResumeAnalysis();
  const [aiStates, setAiStates] = useState<Record<string, RecommendationAiState>>({});

  const handleFix = (route: { pathname: "/builder" | "/studio"; step?: number; hash?: string }) => {
    if (route.pathname === "/builder") {
      const existing = readResumeDraft();
      const builder = existing?.builder ? hydrateBuilderState(existing.builder) : INITIAL_STATE;
      const nextBuilder = route.step === undefined ? builder : { ...builder, currentStep: route.step };
      saveResumeDraft(createBuilderDraft(nextBuilder, existing, new Date()));
    }

    router.push(route.pathname + (route.hash ? `#${route.hash}` : ""));
  };

  const handleRequestAi = async (item: (typeof analysis.recommendations)[number]) => {
    if (!AI_SUPPORTED_CATEGORIES.has(item.category)) {
      return;
    }

    const existing = readResumeDraft();
    const builder = existing?.builder ? hydrateBuilderState(existing.builder) : INITIAL_STATE;
    const resume = existing?.resume ?? builderToResume(builder);
    const aiTarget = buildAiRequestFromRoadmapItem(item, builder, resume, analysis);

    if (!aiTarget) {
      handleFix(item.route);
      return;
    }

    setAiStates((current) => ({
      ...current,
      [item.id]: { status: "loading" },
    }));

    try {
      const response = await requestAiImprovement(aiTarget.request);
      setAiStates((current) => ({
        ...current,
        [item.id]: {
          status: response.needsMoreInfo ? "error" : "ready",
          targetId: item.id,
          response,
          ...(response.needsMoreInfo ? { message: response.followUpQuestions?.[0] ?? response.explanation } : {}),
        } as RecommendationAiState,
      }));
    } catch (error) {
      setAiStates((current) => ({
        ...current,
        [item.id]: {
          status: "error",
          message: error instanceof Error ? error.message : "We couldn't generate an AI suggestion right now.",
        },
      }));
    }
  };

  const handleAccept = (itemId: string) => {
    const state = aiStates[itemId];
    if (!state || state.status !== "ready") return;

    const existing = readResumeDraft();
    const builder = existing?.builder ? hydrateBuilderState(existing.builder) : INITIAL_STATE;
    const recommendation = analysis.recommendations.find((item) => item.id === itemId);
    if (!recommendation) return;

    const resume = existing?.resume ?? builderToResume(builder);
    const target = buildAiRequestFromRoadmapItem(recommendation, builder, resume, analysis);
    if (!target || !state.response.improvedText) return;

    const updatedBuilder = applyAiImprovementToBuilder(builder, target.target, state.response.improvedText);
    saveResumeDraft(createBuilderDraft(updatedBuilder, existing, new Date()));
    setAiStates((current) => {
      const next = { ...current };
      delete next[itemId];
      return next;
    });
  };

  const handleReject = (itemId: string) => {
    setAiStates((current) => ({
      ...current,
      [itemId]: { status: "dismissed" },
    }));
  };

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Improvement Roadmap</h2>
        <div className="text-sm text-muted-foreground flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-accent" />
          <span>
            Current <strong className="text-foreground">{analysis.currentScore}/100</strong>
            {" · "}
            Potential <strong className="text-foreground">{analysis.potentialScore}/100</strong>
            {" "}
            <span className="text-accent">(+{analysis.estimatedImprovement})</span>
          </span>
        </div>
      </div>
      
      <div className="space-y-4">
        {analysis.recommendations.map((item, i) => (
          (() => {
            const aiState = aiStates[item.id];
            const canAccept = aiState?.status === "ready" && Boolean(aiState.response.improvedText);

            return (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`p-5 rounded-2xl border border-border/50 bg-card transition-colors flex flex-col md:flex-row md:items-start justify-between gap-6 group ${
              AI_SUPPORTED_CATEGORIES.has(item.category) ? "hover:border-accent/30 cursor-pointer" : "hover:border-accent/30"
            }`}
            onClick={() => {
              if (AI_SUPPORTED_CATEGORIES.has(item.category)) {
                void handleRequestAi(item);
              }
            }}
          >
            <div className="flex items-start gap-4 flex-1">
              {item.severity === "Critical" && <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />}
              {item.severity === "High" && <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />}
              {item.severity === "Medium" && <AlertCircle className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />}
              {item.severity === "Low" && <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />}
              
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-foreground group-hover:text-accent transition-colors">{item.title}</h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-muted text-muted-foreground">
                    {item.severity}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {item.description} Why it matters: {item.whyItMatters} How to fix: {item.howToFix} Where to fix: {item.targetSection}.
                </p>
              </div>
            </div>

            <div className="flex flex-col items-stretch gap-4 md:w-[280px]">
              <div className="flex items-center justify-between gap-4 md:justify-end">
                <div className="flex flex-col items-end">
                  <span className="text-sm font-semibold text-green-500">{item.estimatedImpact}</span>
                  <span className="text-xs text-muted-foreground">Estimated Impact</span>
                </div>
                <Button
                  size="sm"
                  className="rounded-full gap-2 shrink-0"
                  onClick={(event) => {
                    event.stopPropagation();
                    handleFix(item.route);
                  }}
                >
                  Fix Now <ArrowUpRight className="w-4 h-4" />
                </Button>
              </div>

              <AnimatePresence mode="wait">
                {aiStates[item.id]?.status === "loading" && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className="rounded-2xl border border-border/50 bg-muted/20 p-4 text-sm text-muted-foreground flex items-center gap-3"
                  >
                    <RefreshCcw className="w-4 h-4 animate-spin text-accent" />
                    Generating AI improvement...
                  </motion.div>
                )}

                {aiStates[item.id]?.status === "error" && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className="rounded-2xl border border-red-500/20 bg-red-500/5 p-4 text-sm text-muted-foreground space-y-3"
                  >
                    <div className="flex items-start gap-3">
                      <X className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                      <p>{aiState?.status === "error" ? aiState.message : "We couldn't generate an AI suggestion right now."}</p>
                    </div>
                    <Button size="sm" variant="outline" className="rounded-full gap-2" onClick={(event) => {
                      event.stopPropagation();
                      void handleRequestAi(item);
                    }}>
                      Retry <RefreshCcw className="w-4 h-4" />
                    </Button>
                  </motion.div>
                )}

                {aiStates[item.id]?.status === "ready" && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className="rounded-2xl border border-border/50 bg-muted/20 p-4 space-y-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2 text-accent text-sm font-medium">
                        <Sparkles className="w-4 h-4" />
                        AI suggestion
                      </div>
                      <span className="text-xs text-muted-foreground">
                        Confidence {aiState?.status === "ready" ? aiState.response.confidence : 0}%
                      </span>
                    </div>

                    <div className="grid gap-3">
                      <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-3">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-red-500 mb-2">Original</p>
                        <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                          {aiState?.status === "ready" ? aiState.response.originalText : "No original text available."}
                        </p>
                      </div>

                      <div className="rounded-xl border border-green-500/20 bg-green-500/5 p-3">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-green-500 mb-2">Improved</p>
                        <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                          {aiState?.status === "ready" ? aiState.response.improvedText || "No improved text returned." : "No improved text returned."}
                        </p>
                      </div>
                    </div>

                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {aiState?.status === "ready" ? aiState.response.explanation : ""}
                    </p>

                    <div className="flex items-center justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="rounded-full gap-2"
                        onClick={(event) => {
                          event.stopPropagation();
                          handleReject(item.id);
                        }}
                      >
                        Reject <X className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        className="rounded-full gap-2"
                        onClick={(event) => {
                          event.stopPropagation();
                          handleAccept(item.id);
                        }}
                        disabled={!canAccept}
                      >
                        Accept <CheckCircle2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
            );
          })()
        ))}
      </div>
    </section>
  );
}
