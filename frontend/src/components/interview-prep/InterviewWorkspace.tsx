"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FadeUp } from "@/animations/FadeUp";
import { StaggerContainer, StaggerItem } from "@/animations/StaggerAnimation";
import { Mic, Building2, Code2, Users, MessageCircle, Brain, ChevronRight, Sparkles, Send, Bot, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const COMPANIES = [
  { name: "Google", color: "bg-blue-500", level: "FAANG", logo: "G" },
  { name: "Meta", color: "bg-blue-600", level: "FAANG", logo: "M" },
  { name: "Apple", color: "bg-gray-800", level: "FAANG", logo: "A" },
  { name: "Amazon", color: "bg-orange-500", level: "FAANG", logo: "A" },
  { name: "Stripe", color: "bg-purple-600", level: "Tier 1", logo: "S" },
  { name: "Linear", color: "bg-indigo-500", level: "Tier 1", logo: "L" },
];

const MOCK_CHAT = [
  { role: "ai", text: "Welcome to your mock technical interview for a Senior Software Engineer role at Google. Let's start with a warm-up question.\n\nCan you walk me through a time when you had to design a system under tight constraints?" },
  { role: "user", text: "Sure! At my last role, we had to redesign our notification service to handle 10x traffic within 2 weeks…" },
  { role: "ai", text: "Good start! I noticed you mentioned handling traffic scale — can you quantify the improvement? For example, latency reduction or throughput numbers? Recruiters love specific metrics." },
];

const INTERVIEW_MODES = [
  { icon: Brain, label: "Technical", desc: "System design, DSA", color: "text-blue-500", bg: "bg-blue-500/10" },
  { icon: Users, label: "HR Fit", desc: "Culture, motivation", color: "text-purple-500", bg: "bg-purple-500/10" },
  { icon: MessageCircle, label: "Behavioral", desc: "STAR framework", color: "text-green-500", bg: "bg-green-500/10" },
  { icon: Code2, label: "Coding", desc: "LeetCode style", color: "text-orange-500", bg: "bg-orange-500/10" },
];

export function InterviewWorkspace() {
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [started, setStarted] = useState(false);

  return (
    <div className="flex-1 flex flex-col h-full bg-background overflow-y-auto no-scrollbar">

      {/* Header */}
      <div className="h-16 flex items-center justify-between px-8 border-b border-border/50 shrink-0 bg-background/80 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
            <Mic className="w-4 h-4 text-accent" />
          </div>
          <div>
            <h1 className="font-semibold text-sm">Interview Preparation</h1>
            <p className="text-[10px] text-muted-foreground">AI Mock Interview Studio</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20">
          <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          <span className="text-[11px] font-semibold text-accent">Coming Q3 2025</span>
        </div>
      </div>

      <div className="p-8 space-y-10 max-w-4xl w-full mx-auto">

        {/* Hero */}
        <FadeUp>
          <div className="text-center space-y-3 pt-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border/50 bg-muted/30 text-xs text-muted-foreground mb-2">
              <Sparkles className="w-3.5 h-3.5 text-accent" />
              AI Interview Coach · Powered by GPT-4
            </div>
            <h2 className="text-3xl font-bold tracking-tight">Practice Like It's the Real Thing</h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-sm leading-relaxed">
              Simulate real interviews at top companies. Get instant AI feedback on your answers, tone, and structure.
            </p>
          </div>
        </FadeUp>

        {/* Interview Modes */}
        <FadeUp delay={0.1}>
          <StaggerContainer className="grid grid-cols-4 gap-4">
            {INTERVIEW_MODES.map((mode, i) => {
              const Icon = mode.icon;
              return (
                <StaggerItem key={i}>
                  <div className="p-4 rounded-2xl border border-border/50 bg-card text-center hover:border-accent/30 hover:shadow-sm transition-all cursor-pointer group">
                    <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-3 transition-transform group-hover:scale-110", mode.bg)}>
                      <Icon className={cn("w-5 h-5", mode.color)} />
                    </div>
                    <p className="text-sm font-semibold">{mode.label}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{mode.desc}</p>
                  </div>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </FadeUp>

        {/* Company Selection */}
        <FadeUp delay={0.15}>
          <div className="p-6 rounded-3xl border border-border/50 bg-card">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-accent" /> Select Target Company
            </h3>
            <div className="grid grid-cols-3 gap-3 mb-6">
              {COMPANIES.map((company) => (
                <motion.button
                  key={company.name}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedCompany(company.name)}
                  className={cn(
                    "p-4 rounded-2xl border-2 transition-all flex items-center gap-3",
                    selectedCompany === company.name
                      ? "border-accent bg-accent/10"
                      : "border-border/50 bg-background hover:border-accent/40"
                  )}
                >
                  <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold shrink-0", company.color)}>
                    {company.logo}
                  </div>
                  <div className="text-left min-w-0">
                    <p className="text-sm font-semibold truncate">{company.name}</p>
                    <p className="text-[10px] text-muted-foreground">{company.level}</p>
                  </div>
                </motion.button>
              ))}
            </div>
            <Button
              onClick={() => setStarted(true)}
              disabled={!selectedCompany}
              className="w-full rounded-xl gap-2"
            >
              Start Mock Interview
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </FadeUp>

        {/* Mock Chat Interface */}
        <FadeUp delay={0.2}>
          <div className="rounded-3xl border border-border/50 bg-card overflow-hidden">
            <div className="px-6 py-4 border-b border-border/50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="font-semibold text-sm">Interview Preview</span>
              </div>
              <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">Google · Senior SWE</span>
            </div>
            <div className="p-6 space-y-4 max-h-72 overflow-y-auto no-scrollbar">
              {MOCK_CHAT.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.3 }}
                  className={cn("flex gap-3 max-w-[90%]", msg.role === "user" ? "ml-auto flex-row-reverse" : "")}
                >
                  <div className={cn("w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-1",
                    msg.role === "ai" ? "bg-accent/10 border border-accent/20" : "bg-muted border border-border")}>
                    {msg.role === "ai" ? <Bot className="w-3.5 h-3.5 text-accent" /> : <User className="w-3.5 h-3.5 text-muted-foreground" />}
                  </div>
                  <div className={cn("px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap",
                    msg.role === "ai" ? "bg-background border border-border/50 rounded-bl-sm" : "bg-accent text-accent-foreground rounded-br-sm")}>
                    {msg.text}
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="px-6 py-4 border-t border-border/50 flex items-center gap-3">
              <input
                readOnly
                placeholder="Type your answer… (preview mode)"
                className="flex-1 bg-muted/50 rounded-xl px-4 py-2.5 text-sm outline-none border border-border/50 placeholder:text-muted-foreground/50 cursor-not-allowed"
              />
              <Button size="sm" className="rounded-xl gap-2 shrink-0" disabled>
                <Send className="w-3.5 h-3.5" /> Send
              </Button>
            </div>
          </div>
        </FadeUp>

      </div>
    </div>
  );
}
