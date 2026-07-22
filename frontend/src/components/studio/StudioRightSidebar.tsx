"use client";

import { useStudio } from "./StudioContext";
import { AI_SUGGESTIONS } from "@/data/mock-resume";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Check, X, Edit2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

export function StudioRightSidebar() {
  const { state } = useStudio();
  const [suggestions, setSuggestions] = useState(AI_SUGGESTIONS);

  const handleAccept = (id: string) => {
    setSuggestions(suggestions.filter(s => s.id !== id));
    // In a real app, this would dispatch an action to update the resume content
  };

  const handleDismiss = (id: string) => {
    setSuggestions(suggestions.filter(s => s.id !== id));
  };

  return (
    <aside className="flex flex-col w-80 h-full bg-background border-l border-border/50 overflow-hidden shrink-0">
      <div className="px-4 py-4 border-b border-border/50 flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-accent" />
        <h2 className="font-bold text-sm">AI Assistant</h2>
        <span className="ml-auto bg-accent/10 text-accent text-xs px-2 py-0.5 rounded-full font-medium">
          {suggestions.length} tips
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {suggestions.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-10 text-muted-foreground flex flex-col items-center gap-3"
            >
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                <Check className="w-6 h-6 text-green-500" />
              </div>
              <p className="text-sm font-medium">Your resume looks perfect!</p>
              <p className="text-xs">No current suggestions.</p>
            </motion.div>
          )}

          {suggestions.map((suggestion) => (
            <motion.div
              key={suggestion.id}
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, x: 20 }}
              layout
              className={cn(
                "p-3 rounded-xl border text-sm",
                suggestion.severity === "high" ? "bg-red-500/5 border-red-500/20" :
                suggestion.severity === "medium" ? "bg-yellow-500/5 border-yellow-500/20" :
                "bg-blue-500/5 border-blue-500/20"
              )}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="font-semibold capitalize text-xs tracking-wider opacity-80">
                  {suggestion.type.replace("-", " ")}
                </span>
                <span className="text-xs opacity-60">{suggestion.section}</span>
              </div>
              
              <p className="text-foreground leading-relaxed mb-3">
                {suggestion.suggestion}
              </p>

              {suggestion.original && (
                <div className="mb-3 text-xs opacity-70 border-l-2 border-current pl-2 py-1">
                  Instead of: "{suggestion.original}"
                </div>
              )}

              <div className="flex items-center gap-2 mt-2">
                <button
                  onClick={() => handleAccept(suggestion.id)}
                  className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground text-xs font-semibold py-1.5 rounded-md transition-colors"
                >
                  Accept
                </button>
                <button
                  onClick={() => handleDismiss(suggestion.id)}
                  className="px-2 py-1.5 hover:bg-muted rounded-md text-muted-foreground transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              {suggestion.reason && (
                <div className="mt-3 text-xs opacity-60 flex items-start gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{suggestion.reason}</span>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </aside>
  );
}
