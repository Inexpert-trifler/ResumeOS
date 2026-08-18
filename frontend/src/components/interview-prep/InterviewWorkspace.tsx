"use client";

import { useEffect } from "react";
import { FadeUp } from "@/animations/FadeUp";
import { Mic, Brain, Users, MessageCircle, Code2, Sparkles, Send, Loader2, CheckCircle2, XCircle, ArrowRight, ArrowLeft, Award, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useInterviewStore } from "@/stores/useInterviewStore";
import { useAuth } from "@clerk/nextjs";

const INTERVIEW_MODES = [
  { id: "technical", icon: Brain, label: "Technical", desc: "System design & coding", color: "text-blue-500", bg: "bg-blue-500/10" },
  { id: "behavioral", icon: MessageCircle, label: "Behavioral", desc: "STAR framework focus", color: "text-green-500", bg: "bg-green-500/10" },
  { id: "hr", icon: Users, label: "HR Fit", desc: "Culture & background", color: "text-purple-500", bg: "bg-purple-500/10" },
  { id: "mixed", icon: Code2, label: "Mixed", desc: "Comprehensive prep", color: "text-amber-500", bg: "bg-amber-500/10" },
];

export function InterviewWorkspace() {
  const { isLoaded } = useAuth();
  const {
    targetRole,
    interviewType,
    difficulty,
    activeSession,
    questions,
    currentQuestionIndex,
    userAnswer,
    evaluationResult,
    isCreatingSession,
    isGeneratingQuestions,
    isSubmittingAnswer,
    isEvaluating,
    error,
    setTargetRole,
    setInterviewType,
    setDifficulty,
    setUserAnswer,
    startNewInterview,
    nextQuestion,
    prevQuestion,
    finishAndEvaluateSession,
    fetchPastSessions,
  } = useInterviewStore();

  useEffect(() => {
    if (isLoaded) {
      void fetchPastSessions();
    }
  }, [isLoaded, fetchPastSessions]);

  const currentQ = questions[currentQuestionIndex];

  return (
    <div className="flex-1 flex flex-col h-full bg-background overflow-y-auto no-scrollbar">

      {/* Header */}
      <div className="h-16 flex items-center justify-between px-8 border-b border-border/50 shrink-0 bg-background/80 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
            <Mic className="w-4 h-4 text-accent" />
          </div>
          <div>
            <h1 className="font-semibold text-sm">AI Interview Studio</h1>
            <p className="text-[10px] text-muted-foreground">Real-time mock interview & STAR evaluation</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[11px] font-semibold text-emerald-500">Live AI Evaluator</span>
        </div>
      </div>

      <div className="p-8 space-y-8 max-w-4xl w-full mx-auto">

        {/* Evaluation Report View */}
        {evaluationResult ? (
          <FadeUp>
            <div className="space-y-6">
              <div className="p-8 rounded-3xl border border-border/60 bg-card shadow-sm text-center space-y-4">
                <div className="w-20 h-20 rounded-full bg-accent/10 border-2 border-accent/40 flex items-center justify-center mx-auto">
                  <span className="text-3xl font-black text-accent">{evaluationResult.overallScore}</span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Interview Performance Report</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Answered {evaluationResult.answeredQuestions} of {evaluationResult.totalQuestions} questions
                  </p>
                </div>

                <Button onClick={() => void startNewInterview()} className="rounded-full bg-accent text-accent-foreground font-semibold px-6">
                  Start Another Practice Session
                </Button>
              </div>

              {/* Evaluations per Question */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground/70">Question Breakdowns</h3>
                {evaluationResult.evaluations.map((item, idx) => (
                  <div key={idx} className="p-6 rounded-2xl border border-border/50 bg-card space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <span className="text-xs font-semibold text-accent uppercase">Q{idx + 1} · {item.category}</span>
                        <p className="font-bold text-base mt-1">{item.question}</p>
                      </div>
                      <div className="px-3 py-1 rounded-full bg-accent/10 text-accent font-bold text-sm shrink-0">
                        {item.score}/100
                      </div>
                    </div>

                    {/* STAR Checklist */}
                    {item.star && (
                      <div className="flex items-center gap-4 text-xs font-medium pt-2 border-t border-border/30">
                        <span className="text-muted-foreground font-bold">STAR Framework:</span>
                        <div className="flex items-center gap-1.5">
                          {item.star.situation ? <CheckCircle2 className="w-3.5 h-3.5 text-green-500" /> : <XCircle className="w-3.5 h-3.5 text-muted-foreground/40" />}
                          <span>Situation</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          {item.star.task ? <CheckCircle2 className="w-3.5 h-3.5 text-green-500" /> : <XCircle className="w-3.5 h-3.5 text-muted-foreground/40" />}
                          <span>Task</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          {item.star.action ? <CheckCircle2 className="w-3.5 h-3.5 text-green-500" /> : <XCircle className="w-3.5 h-3.5 text-muted-foreground/40" />}
                          <span>Action</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          {item.star.result ? <CheckCircle2 className="w-3.5 h-3.5 text-green-500" /> : <XCircle className="w-3.5 h-3.5 text-muted-foreground/40" />}
                          <span>Result</span>
                        </div>
                      </div>
                    )}

                    <div className="p-4 rounded-xl bg-muted/20 text-xs text-muted-foreground leading-relaxed">
                      <strong>AI Feedback:</strong> {item.feedback}
                    </div>

                    {item.improvedAnswer && (
                      <div className="p-4 rounded-xl bg-accent/5 border border-accent/20 text-xs text-foreground leading-relaxed">
                        <strong className="text-accent">Suggested High-Impact Answer:</strong>
                        <p className="mt-1 font-serif text-muted-foreground">{item.improvedAnswer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </FadeUp>
        ) : activeSession && questions.length > 0 ? (
          /* Active Question Flow */
          <FadeUp>
            <div className="p-6 rounded-3xl border border-border/50 bg-card shadow-sm space-y-6">
              {/* Progress header */}
              <div className="flex items-center justify-between pb-4 border-b border-border/40">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-accent uppercase">Question {currentQuestionIndex + 1} of {questions.length}</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-muted font-medium capitalize">{currentQ.category}</span>
                </div>
                <div className="text-xs font-semibold text-muted-foreground capitalize">
                  Difficulty: <span className="text-foreground">{currentQ.difficulty}</span>
                </div>
              </div>

              {/* Question text */}
              <div className="space-y-2">
                <h2 className="text-xl font-bold">{currentQ.question}</h2>
                {currentQ.whyItMayBeAsked && (
                  <p className="text-xs text-muted-foreground italic flex items-center gap-1">
                    <HelpCircle className="w-3.5 h-3.5 text-accent" /> Why recruiters ask this: {currentQ.whyItMayBeAsked}
                  </p>
                )}
              </div>

              {/* Response Textarea */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground">Your Response</label>
                <textarea
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="Type your answer using the STAR method (Situation, Task, Action, Result)..."
                  rows={6}
                  className="w-full p-4 rounded-2xl bg-background border border-border/60 text-sm focus:outline-none focus:border-accent resize-none leading-relaxed"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-2">
                <Button
                  onClick={prevQuestion}
                  disabled={currentQuestionIndex === 0}
                  variant="outline"
                  className="rounded-xl gap-2 text-xs"
                >
                  <ArrowLeft className="w-4 h-4" /> Previous
                </Button>

                <div className="flex items-center gap-3">
                  {currentQuestionIndex < questions.length - 1 ? (
                    <Button
                      onClick={nextQuestion}
                      className="rounded-xl bg-accent text-accent-foreground font-semibold gap-2"
                    >
                      Next Question <ArrowRight className="w-4 h-4" />
                    </Button>
                  ) : (
                    <Button
                      onClick={() => void finishAndEvaluateSession()}
                      disabled={isEvaluating}
                      className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold gap-2"
                    >
                      {isEvaluating ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" /> Evaluating Answer...
                        </>
                      ) : (
                        <>
                          <Award className="w-4 h-4" /> Finish & View Evaluation
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </FadeUp>
        ) : (
          /* Setup Form */
          <FadeUp>
            <div className="p-8 rounded-3xl border border-border/50 bg-card shadow-sm space-y-8">
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold tracking-tight">Practice Real AI Mock Interviews</h2>
                <p className="text-muted-foreground text-sm max-w-md mx-auto">
                  Tailored to your target role, active resume skills, and top company interview standards.
                </p>
              </div>

              {error && (
                <div className="p-3.5 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-medium">
                  {error}
                </div>
              )}

              {/* Target Role Input */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground">Target Role Title *</label>
                <input
                  type="text"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  placeholder="e.g. Senior Software Engineer"
                  className="w-full h-11 px-4 rounded-xl bg-background border border-border/60 text-sm focus:outline-none focus:border-accent"
                />
              </div>

              {/* Interview Mode Selection */}
              <div className="space-y-3">
                <label className="text-xs font-semibold text-muted-foreground">Interview Category</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {INTERVIEW_MODES.map((mode) => {
                    const Icon = mode.icon;
                    const isSelected = interviewType === mode.id;
                    return (
                      <div
                        key={mode.id}
                        onClick={() => setInterviewType(mode.id)}
                        className={cn(
                          "p-4 rounded-2xl border cursor-pointer transition-all text-center",
                          isSelected ? "border-accent bg-accent/10 shadow-sm" : "border-border/50 bg-background hover:border-accent/30"
                        )}
                      >
                        <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center mx-auto mb-2", mode.bg)}>
                          <Icon className={cn("w-4 h-4", mode.color)} />
                        </div>
                        <p className={cn("text-xs font-semibold", isSelected ? "text-accent" : "text-foreground")}>{mode.label}</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">{mode.desc}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Difficulty Selection */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground">Difficulty Level</label>
                <div className="grid grid-cols-3 gap-3">
                  {["beginner", "intermediate", "advanced"].map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setDifficulty(level)}
                      className={cn(
                        "h-10 rounded-xl border text-xs font-semibold capitalize transition-all",
                        difficulty === level ? "border-accent bg-accent/10 text-accent" : "border-border/60 bg-background text-muted-foreground"
                      )}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              <Button
                onClick={() => void startNewInterview()}
                disabled={isCreatingSession || isGeneratingQuestions || !targetRole.trim()}
                size="lg"
                className="w-full h-12 rounded-2xl bg-accent text-accent-foreground font-semibold gap-2 shadow-md hover:bg-accent/90"
              >
                {isCreatingSession || isGeneratingQuestions ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Generating Context-Aware Questions...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Start AI Mock Interview
                  </>
                )}
              </Button>
            </div>
          </FadeUp>
        )}

      </div>
    </div>
  );
}
