"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowDownRight, RefreshCcw, Sparkles, X, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAnalyzerStore } from "@/stores/useAnalyzerStore";
import type { ResumeHealthReport } from "@/services/AnalysisService";
import { INITIAL_STATE } from "@/types";
import { builderToResume, createBuilderDraft, hydrateBuilderState, readResumeDraft, saveResumeDraft } from "@/lib/resume-draft";
import { applyAiImprovementToBuilder, buildAiRequestFromWeakBullet } from "@/services/ai/resume-targets";
import { requestAiImprovement, type AiImprovementResponse } from "@/services/ai";

type WeakBulletAiState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "ready"; response: AiImprovementResponse; targetId: string }
  | { status: "error"; message: string }
  | { status: "dismissed" };

export function AnalyzerWeakBullets() {
  const { analysis } = useAnalyzerStore();
  const [aiStates, setAiStates] = useState<Record<string, WeakBulletAiState>>({});
  if (!analysis) return null;
  const weakBullets = analysis.resumeHealth.weakBullets;

  const handleRequestAi = async (bullet: ResumeHealthReport["weakBullets"][number]) => {
    const existing = readResumeDraft();
    const builder = existing?.builder ? hydrateBuilderState(existing.builder) : INITIAL_STATE;
    const resume = existing?.resume ?? builderToResume(builder);
    const aiTarget = buildAiRequestFromWeakBullet(bullet, builder, resume);

    if (!aiTarget) {
      setAiStates((current) => ({
        ...current,
        [bullet.id]: { status: "error", message: "We couldn't identify the section to improve right now." },
      }));
      return;
    }

    setAiStates((current) => ({
      ...current,
      [bullet.id]: { status: "loading" },
    }));

    try {
      const response = await requestAiImprovement(aiTarget.request);
      setAiStates((current) => ({
        ...current,
        [bullet.id]: {
          status: response.needsMoreInfo ? "error" : "ready",
          response,
          targetId: bullet.id,
          ...(response.needsMoreInfo ? { message: response.followUpQuestions?.[0] ?? response.explanation } : {}),
        } as WeakBulletAiState,
      }));
    } catch (error) {
      setAiStates((current) => ({
        ...current,
        [bullet.id]: {
          status: "error",
          message: error instanceof Error ? error.message : "We couldn't generate an AI suggestion right now.",
        },
      }));
    }
  };

  const handleAccept = (bulletId: string) => {
    const state = aiStates[bulletId];
    if (!state || state.status !== "ready" || !state.response.improvedText) return;

    const bullet = weakBullets.find((item) => item.id === bulletId);
    if (!bullet) return;

    const existing = readResumeDraft();
    const builder = existing?.builder ? hydrateBuilderState(existing.builder) : INITIAL_STATE;
    const resume = existing?.resume ?? builderToResume(builder);
    const target = buildAiRequestFromWeakBullet(bullet, builder, resume);
    if (!target) return;

    const updatedBuilder = applyAiImprovementToBuilder(builder, target.target, state.response.improvedText);
    saveResumeDraft(createBuilderDraft(updatedBuilder, existing, new Date()));
    setAiStates((current) => {
      const next = { ...current };
      delete next[bulletId];
      return next;
    });
  };

  const handleReject = (bulletId: string) => {
    setAiStates((current) => ({
      ...current,
      [bulletId]: { status: "dismissed" },
    }));
  };

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold mb-6">Weak Bullet Detection</h2>

      <div className="space-y-6">
        {weakBullets.map((bullet, i) => {
          const aiState = aiStates[bullet.id];
          const improvedText =
            aiState?.status === "ready"
              ? aiState.response.improvedText ?? bullet.suggestion
              : aiState?.status === "loading"
                ? "Generating AI improvement..."
                : aiState?.status === "error"
                  ? aiState.message
                  : bullet.suggestion;
          const canApply = aiState?.status === "ready" && Boolean(aiState.response.improvedText);

          return (
            <motion.div
              key={bullet.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-6 rounded-3xl border border-border/50 bg-card"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
                <div className="hidden md:flex absolute inset-0 items-center justify-center pointer-events-none">
                  <div className="w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center text-muted-foreground z-10">
                    <ArrowDownRight className="w-5 h-5 -rotate-45" />
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-red-500/5 border border-red-500/20 relative">
                  <div className="absolute top-4 right-4 text-red-500/50">
                    <XCircle className="w-5 h-5" />
                  </div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-red-500 mb-3">Original (Weak)</h4>
                  <p className="text-foreground text-sm leading-relaxed">{`"${bullet.original}"`}</p>
                  <div className="mt-4 pt-4 border-t border-red-500/10">
                    <p className="text-xs text-red-600 dark:text-red-400">
                      Lacks specific metrics and uses a passive action verb (&quot;Worked on&quot;).
                    </p>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-green-500/5 border border-green-500/20 relative">
                  <div className="absolute top-4 right-4 text-green-500/50">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-green-500 mb-3">Suggested Improvement</h4>
                  <p className="text-foreground text-sm leading-relaxed whitespace-pre-wrap">{`"${improvedText}"`}</p>
                  {aiState?.status === "ready" && (
                    <p className="mt-3 text-xs text-muted-foreground leading-relaxed">
                      Confidence {aiState.response.confidence}% · {aiState.response.explanation}
                    </p>
                  )}
                  {aiState?.status === "error" && (
                    <p className="mt-3 text-xs text-red-600 dark:text-red-400 leading-relaxed">{aiState.message}</p>
                  )}

                  <div className="mt-4 pt-4 border-t border-green-500/10">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full text-green-600 dark:text-green-400 border-green-500/30 hover:bg-green-500/10"
                        onClick={(event) => {
                          event.stopPropagation();
                          if (aiState?.status === "ready") {
                            handleAccept(bullet.id);
                          } else {
                            void handleRequestAi(bullet);
                          }
                        }}
                        disabled={aiState?.status === "loading"}
                      >
                        Apply Change to Resume
                      </Button>
                      {aiState?.status === "ready" && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-border/50 hover:bg-muted/50"
                          onClick={(event) => {
                            event.stopPropagation();
                            handleReject(bullet.id);
                          }}
                        >
                          Reject <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>

                    {aiState?.status === "loading" && (
                      <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                        <RefreshCcw className="w-3.5 h-3.5 animate-spin text-accent" />
                        Generating AI improvement...
                      </div>
                    )}

                    {aiState?.status === "error" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="mt-2 w-full text-muted-foreground"
                        onClick={(event) => {
                          event.stopPropagation();
                          void handleRequestAi(bullet);
                        }}
                      >
                        Retry <RefreshCcw className="w-4 h-4" />
                      </Button>
                    )}

                    {aiState?.status === "ready" && !canApply && (
                      <div className="mt-3 text-xs text-muted-foreground">The AI needs a bit more detail before we can apply this safely.</div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
