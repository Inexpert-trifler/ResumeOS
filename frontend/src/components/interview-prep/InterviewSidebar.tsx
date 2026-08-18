"use client";

import Link from "next/link";
import { ArrowLeft, Mic, History, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useInterviewStore } from "@/stores/useInterviewStore";

export function InterviewSidebar() {
  const { sessionsList, activeSession, loadSession } = useInterviewStore();

  return (
    <aside className="w-80 shrink-0 border-r border-border/50 bg-background/50 h-full flex flex-col relative">
      <div className="h-16 flex items-center px-6 border-b border-border/50 shrink-0">
        <Link href="/dashboard" className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Dashboard
        </Link>
      </div>

      <div className="p-6 flex-1 overflow-y-auto no-scrollbar space-y-8">

        {/* Past Sessions History */}
        <div>
          <h3 className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60 mb-3 flex items-center gap-1.5">
            <History className="w-3.5 h-3.5 text-accent" /> Past Mock Sessions
          </h3>

          {sessionsList.length > 0 ? (
            <div className="space-y-2">
              {sessionsList.map((session) => {
                const isActive = activeSession?.id === session.id;
                return (
                  <div
                    key={session.id}
                    onClick={() => void loadSession(session.id)}
                    className={cn(
                      "p-3 rounded-xl border cursor-pointer transition-all text-xs",
                      isActive ? "border-accent/50 bg-accent/10 font-semibold text-accent" : "border-border/50 bg-card hover:border-accent/30 text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-foreground truncate">Mock Interview Session</span>
                      <Mic className="w-3.5 h-3.5 shrink-0 text-accent" />
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-1">
                      Created: {new Date(session.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground italic">No past sessions yet. Start your first mock interview above!</p>
          )}
        </div>

        <div className="p-4 rounded-2xl bg-accent/5 border border-accent/20">
          <div className="flex items-center gap-2 mb-2 text-accent">
            <Sparkles className="w-4 h-4" />
            <span className="text-xs font-bold">STAR Evaluation System</span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Our AI checks your answers for Situation, Task, Action, and Result components to ensure your interview answers follow top recruiter standards.
          </p>
        </div>
      </div>
    </aside>
  );
}
