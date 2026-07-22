"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Mic, Code2, Users, Brain, MessageCircle, CheckCircle, Clock, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const INTERVIEW_TYPES = [
  { icon: Brain, label: "Technical Interview", rounds: 4, color: "text-blue-500", bg: "bg-blue-500/10" },
  { icon: Users, label: "HR / Culture Fit", rounds: 2, color: "text-purple-500", bg: "bg-purple-500/10" },
  { icon: MessageCircle, label: "Behavioral (STAR)", rounds: 6, color: "text-green-500", bg: "bg-green-500/10" },
  { icon: Code2, label: "Coding Challenge", rounds: 3, color: "text-orange-500", bg: "bg-orange-500/10" },
  { icon: Mic, label: "Voice Interview", rounds: 1, color: "text-pink-500", bg: "bg-pink-500/10" },
];

const PROGRESS = [
  { label: "Questions Practiced", value: 24, total: 100 },
  { label: "Mock Sessions", value: 3, total: 10 },
  { label: "Confidence Score", value: 62, total: 100 },
];

export function InterviewSidebar() {
  return (
    <aside className="w-80 shrink-0 border-r border-border/50 bg-background/50 h-full flex flex-col relative">
      <div className="h-16 flex items-center px-6 border-b border-border/50 shrink-0">
        <Link href="/dashboard" className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
      </div>

      <div className="p-6 flex-1 overflow-y-auto no-scrollbar space-y-8">

        {/* Interview Types */}
        <div>
          <h3 className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60 mb-4">Interview Modes</h3>
          <div className="space-y-2">
            {INTERVIEW_TYPES.map((type, i) => {
              const Icon = type.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07 }}
                  className="flex items-center gap-3 p-3 rounded-xl border border-border/50 bg-card hover:border-accent/30 transition-all cursor-pointer group"
                >
                  <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center shrink-0", type.bg)}>
                    <Icon className={cn("w-4 h-4", type.color)} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground/80 group-hover:text-foreground truncate">{type.label}</p>
                    <p className="text-[10px] text-muted-foreground">{type.rounds} practice rounds</p>
                  </div>
                  <CheckCircle className="w-3.5 h-3.5 text-muted-foreground/30 group-hover:text-accent transition-colors shrink-0" />
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Progress */}
        <div>
          <h3 className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60 mb-4">Your Progress</h3>
          <div className="space-y-4">
            {PROGRESS.map((p, i) => (
              <div key={i}>
                <div className="flex justify-between mb-1.5">
                  <span className="text-xs text-muted-foreground">{p.label}</span>
                  <span className="text-xs font-bold text-accent">{p.value}/{p.total}</span>
                </div>
                <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(p.value / p.total) * 100}%` }}
                    transition={{ duration: 1, ease: "easeOut", delay: i * 0.15 }}
                    className="h-full bg-accent rounded-full"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-accent/5 border border-accent/20">
          <div className="flex items-center gap-2 mb-2 text-accent">
            <Sparkles className="w-4 h-4" />
            <span className="text-xs font-bold">AI Voice Coach</span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Practice speaking naturally. Our AI analyzes filler words, pace, and confidence in real time.
          </p>
        </div>
      </div>
    </aside>
  );
}
