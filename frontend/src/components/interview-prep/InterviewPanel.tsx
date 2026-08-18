"use client";

import { motion } from "framer-motion";
import { Sparkles, CheckCircle2, Clock, Brain } from "lucide-react";
import { useInterviewStore } from "@/stores/useInterviewStore";

const TIPS = [
  "Use the STAR method: Situation, Task, Action, Result",
  "Quantify your results with metrics (e.g. 30% latency reduction)",
  "Think aloud — interviewers evaluate your problem-solving process",
  "Ask clarifying questions before proposing a technical design",
];

export function InterviewPanel() {
  const { activeSession, questions, currentQuestionIndex } = useInterviewStore();
  const currentQ = questions[currentQuestionIndex];

  return (
    <aside className="w-96 shrink-0 border-l border-border/50 bg-background/50 h-full flex flex-col">
      <div className="h-16 flex items-center px-6 border-b border-border/50 shrink-0 bg-background/80 backdrop-blur-md">
        <h2 className="font-semibold text-sm flex items-center gap-2">
          <Brain className="w-4 h-4 text-accent" />
          <span>Prep Inspector</span>
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-8">

        {/* Current Question Inspector */}
        {currentQ ? (
          <div>
            <h3 className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60 mb-3">Active Question Info</h3>
            <div className="p-5 rounded-2xl border border-border/50 bg-card space-y-3 shadow-sm">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-accent uppercase">{currentQ.category}</span>
                <span className="text-muted-foreground capitalize">{currentQ.difficulty}</span>
              </div>
              <p className="font-semibold text-xs text-foreground">{currentQ.question}</p>
              {currentQ.keyPoints && currentQ.keyPoints.length > 0 && (
                <div className="pt-2 border-t border-border/30">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Key Points to Mention:</p>
                  <ul className="space-y-1">
                    {currentQ.keyPoints.map((kp, i) => (
                      <li key={i} className="text-xs text-muted-foreground flex items-center gap-1.5">
                        <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                        <span>{kp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div>
            <h3 className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60 mb-3">Session Guidance</h3>
            <div className="p-5 rounded-2xl border border-border/50 bg-card space-y-2 text-xs text-muted-foreground">
              <p className="font-semibold text-foreground">Ready to Practice</p>
              <p>Configure your target role and difficulty on the left to start a live mock interview session.</p>
            </div>
          </div>
        )}

        <div>
          <h3 className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60 mb-3">Pro Tips</h3>
          <div className="space-y-2">
            {TIPS.map((tip, i) => (
              <div key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                <span className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 shrink-0" />
                {tip}
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-accent/5 border border-accent/20">
          <div className="flex items-center gap-2 mb-2 text-accent">
            <Sparkles className="w-4 h-4" />
            <span className="text-xs font-bold">STAR Evaluation</span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Our AI automatically parses your answers for Situation, Task, Action, and Result structure — identifying missing components instantly.
          </p>
        </div>
      </div>
    </aside>
  );
}
