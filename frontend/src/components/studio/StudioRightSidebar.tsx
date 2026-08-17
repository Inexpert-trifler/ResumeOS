"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, Check, Loader2, RefreshCcw, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStudio } from "./StudioContext";
import { appendAiHistoryRecord } from "@/services/ai/history";
import { requestAiImprovement, type AiImprovementResponse } from "@/services/ai";
import { buildStudioAiTarget, applyStudioAiImprovement, type StudioAiTarget } from "@/services/ai/studio-targets";
import { createStudioDraft, readResumeDraft, saveResumeDraft } from "@/lib/resume-draft";
import type { StudioState } from "@/types";

type AssistantState =
  | { status: "idle" }
  | { status: "loading"; target: StudioAiTarget }
  | { status: "ready"; target: StudioAiTarget; response: AiImprovementResponse }
  | { status: "needs-more-info"; target: StudioAiTarget; response: AiImprovementResponse; message: string }
  | { status: "error"; message: string }
  | { status: "applied"; message: string };

function getSectionLabel(stateSectionId: string | null, stateSections: StudioState["sections"]) {
  return stateSections.find((section) => section.id === stateSectionId)?.label ?? "AI Assistant";
}

function dispatchResumeUpdate(
  dispatch: ReturnType<typeof useStudio>["dispatch"],
  target: StudioAiTarget,
  nextResume: Parameters<typeof applyStudioAiImprovement>[0],
  improvedText: string
) {
  switch (target.sectionId) {
    case "summary":
      dispatch({ type: "UPDATE_SUMMARY", payload: nextResume.summary });
      break;
    case "projects":
      dispatch({ type: "UPDATE_PROJECTS", payload: nextResume.projects });
      break;
    case "experience":
      dispatch({ type: "UPDATE_EXPERIENCE", payload: nextResume.experience });
      break;
    case "achievements":
      dispatch({ type: "UPDATE_ACHIEVEMENTS", payload: nextResume.achievements });
      break;
    case "leadership":
      dispatch({ type: "UPDATE_LEADERSHIP", payload: nextResume.leadership });
      break;
    case "skills":
      dispatch({ type: "UPDATE_SKILLS", payload: nextResume.skills });
      break;
    case "certificates":
      dispatch({ type: "UPDATE_CERTIFICATES", payload: nextResume.certificates });
      break;
    default:
      void improvedText;
      break;
  }
}

export function StudioRightSidebar() {
  const { state, dispatch } = useStudio();
  const [assistantState, setAssistantState] = useState<AssistantState>({ status: "idle" });
  const abortRef = useRef<AbortController | null>(null);
  const appliedResetTimerRef = useRef<number | null>(null);

  const currentTarget = useMemo(() => buildStudioAiTarget(state.resume, state.activeSectionId), [state.resume, state.activeSectionId]);
  const activeSectionLabel = getSectionLabel(state.activeSectionId, state.sections);

  useEffect(() => {
    setAssistantState((current) => {
      if (current.status === "idle" || current.status === "applied") {
        return current;
      }

      if (!currentTarget) {
        abortRef.current?.abort();
        return { status: "idle" };
      }

      const currentSource = current.status === "loading" || current.status === "ready" || current.status === "needs-more-info"
        ? current.target.originalText
        : null;

      if (currentSource && currentSource !== currentTarget.originalText) {
        abortRef.current?.abort();
        return { status: "idle" };
      }

      return current;
    });
  }, [currentTarget]);

  useEffect(() => {
    if (assistantState.status !== "applied") return;

    if (appliedResetTimerRef.current) {
      window.clearTimeout(appliedResetTimerRef.current);
    }

    appliedResetTimerRef.current = window.setTimeout(() => {
      setAssistantState({ status: "idle" });
      appliedResetTimerRef.current = null;
    }, 1800);

    return () => {
      if (appliedResetTimerRef.current) {
        window.clearTimeout(appliedResetTimerRef.current);
        appliedResetTimerRef.current = null;
      }
    };
  }, [assistantState.status]);

  useEffect(() => {
    return () => {
      abortRef.current?.abort();
      if (appliedResetTimerRef.current) {
        window.clearTimeout(appliedResetTimerRef.current);
      }
    };
  }, []);

  const handleRequestImprovement = async () => {
    if (!currentTarget) return;

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setAssistantState({ status: "loading", target: currentTarget });

    try {
      const response = await requestAiImprovement(currentTarget.request, {
        signal: controller.signal,
        timeoutMs: 45000,
      });

      if (controller.signal.aborted) return;

      if (response.needsMoreInfo || !response.improvedText) {
        setAssistantState({
          status: "needs-more-info",
          target: currentTarget,
          response,
          message: response.followUpQuestions?.[0] ?? response.explanation,
        });
        return;
      }

      setAssistantState({
        status: "ready",
        target: currentTarget,
        response,
      });
    } catch (error) {
      if (controller.signal.aborted) return;

      setAssistantState({
        status: "error",
        message:
          error instanceof Error
            ? error.message
            : "We couldn't generate an AI suggestion right now.",
      });
    } finally {
      if (abortRef.current === controller) {
        abortRef.current = null;
      }
    }
  };

  const handleAccept = () => {
    if (assistantState.status !== "ready") return;
    if (!assistantState.response.improvedText) return;

    const existing = readResumeDraft();
    const nextResume = applyStudioAiImprovement(state.resume, assistantState.target, assistantState.response.improvedText);

    dispatchResumeUpdate(dispatch, assistantState.target, nextResume, assistantState.response.improvedText);
    saveResumeDraft(
      createStudioDraft(nextResume, existing, new Date(), {
        sections: state.sections,
        settings: state.settings,
      })
    );

    appendAiHistoryRecord({
      section: assistantState.target.sectionLabel,
      originalText: assistantState.target.originalText,
      improvedText: assistantState.response.improvedText,
      timestamp: new Date().toISOString(),
    });

    setAssistantState({
      status: "applied",
      message: "Applied to resume and saved locally.",
    });
  };

  const handleReject = () => {
    setAssistantState({ status: "idle" });
  };

  const canRequestImprovement = Boolean(currentTarget);
  const isBusy = assistantState.status === "loading";
  const showComparison = assistantState.status === "ready" || assistantState.status === "needs-more-info";

  return (
    <aside className="flex flex-col w-80 h-full bg-background border-l border-border/50 overflow-hidden shrink-0">
      <div className="px-4 py-4 border-b border-border/50 flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-accent" />
        <h2 className="font-bold text-sm">AI Assistant</h2>
        <span className="ml-auto bg-accent/10 text-accent text-xs px-2 py-0.5 rounded-full font-medium">
          {currentTarget ? activeSectionLabel : "Select a section"}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {!currentTarget && (
          <div className="p-4 rounded-xl border border-border/50 bg-card text-sm text-muted-foreground space-y-2">
            <div className="flex items-center gap-2 text-foreground font-medium">
              <Check className="w-4 h-4 text-green-500" />
              <span>Pick an editable section</span>
            </div>
            <p>Select Summary, Projects, Experience, Achievements, Leadership, Skills, or Certificates to improve it with AI.</p>
          </div>
        )}

        {currentTarget && !showComparison && assistantState.status !== "applied" && (
          <div className="p-4 rounded-xl border border-border/50 bg-card space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5 text-accent" />
              </div>
              <div className="space-y-1">
                <h3 className="font-semibold text-sm text-foreground">{currentTarget.sectionLabel}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Request an AI rewrite for the selected section without leaving Studio.
                </p>
              </div>
            </div>

            <div className="rounded-lg border border-border/50 bg-muted/20 p-3">
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">Current text</p>
              <p className="text-xs text-foreground leading-relaxed whitespace-pre-wrap">
                {currentTarget.originalText}
              </p>
            </div>

            <Button
              size="sm"
              className="w-full rounded-full gap-2"
              onClick={handleRequestImprovement}
              disabled={!canRequestImprovement || isBusy}
            >
              {isBusy ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Improving...
                </>
              ) : (
                <>
                  Request AI improvement
                  <Sparkles className="w-4 h-4" />
                </>
              )}
            </Button>
          </div>
        )}

        <AnimatePresence mode="wait">
          {assistantState.status === "error" && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="p-4 rounded-xl border border-red-500/20 bg-red-500/5 space-y-3"
            >
              <div className="flex items-start gap-2 text-red-500">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <p className="text-sm leading-relaxed">{assistantState.message}</p>
              </div>
              <Button size="sm" variant="outline" className="rounded-full gap-2" onClick={handleRequestImprovement}>
                Retry <RefreshCcw className="w-4 h-4" />
              </Button>
            </motion.div>
          )}

          {assistantState.status === "needs-more-info" && (
            <motion.div
              key="needs-more-info"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="p-4 rounded-xl border border-yellow-500/20 bg-yellow-500/5 space-y-3"
            >
              <div className="flex items-start gap-2 text-yellow-600 dark:text-yellow-400">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <p className="text-sm leading-relaxed">{assistantState.message}</p>
              </div>

              {assistantState.response.followUpQuestions?.length ? (
                <ul className="space-y-1 text-xs text-muted-foreground list-disc pl-4">
                  {assistantState.response.followUpQuestions.slice(0, 3).map((question) => (
                    <li key={question}>{question}</li>
                  ))}
                </ul>
              ) : null}

              <Button size="sm" variant="outline" className="rounded-full gap-2" onClick={handleRequestImprovement}>
                Retry <RefreshCcw className="w-4 h-4" />
              </Button>
            </motion.div>
          )}

          {assistantState.status === "applied" && (
            <motion.div
              key="applied"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="p-4 rounded-xl border border-green-500/20 bg-green-500/5 flex items-start gap-2 text-sm text-green-600 dark:text-green-400"
            >
              <Check className="w-4 h-4 shrink-0 mt-0.5" />
              <p>{assistantState.message}</p>
            </motion.div>
          )}

          {assistantState.status === "loading" && (
            <motion.div
              key="loading"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="p-4 rounded-xl border border-border/50 bg-card flex items-center gap-3 text-sm text-muted-foreground"
            >
              <Loader2 className="w-4 h-4 animate-spin text-accent" />
              Generating AI improvement...
            </motion.div>
          )}

          {showComparison && (
            <motion.div
              key="comparison"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="space-y-3"
            >
              <div className="p-4 rounded-xl border border-border/50 bg-card space-y-3">
                <div className="flex items-center gap-2 text-red-500 text-xs font-semibold uppercase tracking-wider">
                  <X className="w-3.5 h-3.5" />
                  Original Text
                </div>
                <p className="text-xs text-foreground leading-relaxed whitespace-pre-wrap">
                  {assistantState.response.originalText}
                </p>
              </div>

              <div className="p-4 rounded-xl border border-border/50 bg-card space-y-3">
                <div className="flex items-center gap-2 text-green-500 text-xs font-semibold uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" />
                  Improved Text
                </div>
                <p className="text-xs text-foreground leading-relaxed whitespace-pre-wrap">
                  {assistantState.response.improvedText ?? "No improved text returned."}
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {assistantState.response.explanation}
                </p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                  Confidence {assistantState.response.confidence}%
                </p>
              </div>

              {assistantState.status === "ready" && (
                <div className="flex items-center gap-2">
                  <Button size="sm" className="flex-1 rounded-full gap-2" onClick={handleAccept}>
                    Accept <Check className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline" className="rounded-full gap-2" onClick={handleReject}>
                    Reject <X className="w-4 h-4" />
                  </Button>
                </div>
              )}

              {assistantState.status === "needs-more-info" && (
                <Button size="sm" variant="outline" className="w-full rounded-full gap-2" onClick={handleRequestImprovement}>
                  Retry <RefreshCcw className="w-4 h-4" />
                </Button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </aside>
  );
}
