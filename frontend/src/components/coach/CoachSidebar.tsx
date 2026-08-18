"use client";

import { motion } from "framer-motion";
import { Check, Clock, ArrowLeft, Plus, MessageSquare, Trash2 } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useResumeDraftSnapshot, resumeCompletion } from "@/lib/resume-draft";
import { useCoachStore } from "@/stores/useCoachStore";
import { Button } from "@/components/ui/button";

const PROGRESS_STEPS = [
  { name: "Personal Information", key: "personal" },
  { name: "Professional Summary", key: "summary" },
  { name: "Work Experience", key: "experience" },
  { name: "Key Skills", key: "skills" },
  { name: "Projects & Education", key: "projects" },
];

export function CoachSidebar() {
  const draft = useResumeDraftSnapshot();
  const completionPercentage = draft?.builder ? resumeCompletion(draft.builder) : 35;
  const { conversations, activeConversationId, selectConversation, createConversation, deleteConversation } = useCoachStore();

  return (
    <aside className="w-80 shrink-0 border-r border-border/50 bg-background/50 h-full flex flex-col relative">
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-border/50 shrink-0">
        <Link href="/dashboard" className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Dashboard
        </Link>
        <Button
          onClick={() => void createConversation()}
          size="sm"
          variant="outline"
          className="h-8 gap-1 rounded-full text-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          New Chat
        </Button>
      </div>

      <div className="p-6 flex-1 overflow-y-auto no-scrollbar space-y-8">
        {/* Overall Progress */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Resume Completion</h3>
            <span className="text-xs font-bold text-accent">{completionPercentage}%</span>
          </div>
          <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${completionPercentage}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="h-full bg-accent rounded-full"
            />
          </div>
        </div>

        {/* Conversations list */}
        {conversations.length > 0 && (
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Recent Coaching Sessions</h3>
            <div className="space-y-1.5">
              {conversations.map((conv) => {
                const isActive = conv.id === activeConversationId;
                return (
                  <div
                    key={conv.id}
                    onClick={() => void selectConversation(conv.id)}
                    className={cn(
                      "flex items-center justify-between px-3 py-2 rounded-xl cursor-pointer text-xs transition-colors group",
                      isActive ? "bg-accent/15 text-accent font-semibold" : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                    )}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <MessageSquare className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{conv.title}</span>
                    </div>
                    {conversations.length > 1 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          void deleteConversation(conv.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1 hover:text-destructive transition-opacity"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Steps Stepper */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">Coaching Progress</h3>
          <div className="space-y-5 relative before:absolute before:inset-0 before:ml-[11px] before:-translate-x-px before:h-full before:w-px before:bg-gradient-to-b before:from-border/80 before:to-transparent">
            {PROGRESS_STEPS.map((step, idx) => {
              const stepDone = completionPercentage >= (idx + 1) * 20;
              const stepActive = !stepDone && completionPercentage >= idx * 20;

              return (
                <div key={step.name} className="relative flex items-center group">
                  <div className={cn(
                    "w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 z-10 transition-colors",
                    stepDone ? "bg-accent border-accent text-white" : 
                    stepActive ? "bg-background border-accent" : 
                    "bg-background border-muted"
                  )}>
                    {stepDone && <Check className="w-3.5 h-3.5" />}
                    {stepActive && <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />}
                  </div>

                  <div className="ml-4 flex-1">
                    <h4 className={cn(
                      "text-xs font-medium transition-colors",
                      stepDone ? "text-muted-foreground" :
                      stepActive ? "text-foreground font-bold" :
                      "text-muted-foreground/50"
                    )}>
                      {step.name}
                    </h4>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </aside>
  );
}
