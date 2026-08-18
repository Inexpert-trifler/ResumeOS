"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { CoachChatInput } from "./ChatInput";
import { Bot, User, AlertCircle, Sparkles, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCoachStore } from "@/stores/useCoachStore";
import { useAuth } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

export function ChatInterface() {
  const { isLoaded } = useAuth();
  const {
    activeConversation,
    fetchConversations,
    isLoading,
    isSending,
    error,
    suggestions,
    sendMessage,
  } = useCoachStore();

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isLoaded) {
      void fetchConversations();
    }
  }, [isLoaded, fetchConversations]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeConversation?.messages, isSending]);

  const handleSuggestionClick = (text: string) => {
    if (!isSending) {
      void sendMessage(text);
    }
  };

  const messages = activeConversation?.messages ?? [];

  return (
    <div className="flex-1 flex flex-col h-full bg-background relative overflow-hidden">
      
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-border/50 shrink-0 bg-background/80 backdrop-blur-md z-10 absolute top-0 left-0 right-0">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <h1 className="font-semibold text-sm">ResumeOS AI Coach</h1>
        </div>
        {activeConversation?.title && (
          <span className="text-xs text-muted-foreground font-medium truncate max-w-xs">
            {activeConversation.title}
          </span>
        )}
      </div>

      {/* Chat Messages Area */}
      <div className="flex-1 overflow-y-auto pt-24 pb-6 px-4 md:px-8 no-scrollbar scroll-smooth">
        <div className="max-w-3xl mx-auto space-y-6">
          
          {isLoading && messages.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground gap-3">
              <RefreshCw className="w-6 h-6 animate-spin text-accent" />
              <p className="text-sm font-medium">Connecting to AI Coach...</p>
            </div>
          )}

          {error && (
            <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-center gap-3">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <p className="flex-1">{error}</p>
            </div>
          )}

          {messages.map((message, i) => {
            const isAi = message.role === "assistant";

            return (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: Math.min(i * 0.05, 0.3) }}
                className={cn(
                  "flex gap-4 max-w-[88%]",
                  isAi ? "mr-auto" : "ml-auto flex-row-reverse"
                )}
              >
                {/* Avatar */}
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-auto shadow-sm",
                  isAi ? "bg-accent/15 border border-accent/30 text-accent" : "bg-muted border border-border text-muted-foreground"
                )}>
                  {isAi ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                </div>

                {/* Bubble */}
                <div className={cn(
                  "px-4 py-3 rounded-2xl text-[15px] leading-relaxed shadow-sm relative",
                  isAi 
                    ? "bg-card border border-border/50 rounded-bl-sm text-foreground" 
                    : "bg-accent text-accent-foreground rounded-br-sm"
                )}>
                  <p className="whitespace-pre-wrap">{message.content}</p>
                </div>
              </motion.div>
            );
          })}

          {/* Typing indicator when waiting for AI response */}
          {isSending && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-4 max-w-[85%] mr-auto"
            >
              <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-auto bg-accent/15 border border-accent/30 text-accent shadow-sm">
                <Bot className="w-4 h-4" />
              </div>
              <div className="px-4 py-3 rounded-2xl bg-card border border-border/50 rounded-bl-sm flex items-center gap-1.5 h-10">
                <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0 }} className="w-2 h-2 bg-accent rounded-full" />
                <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0.2 }} className="w-2 h-2 bg-accent rounded-full" />
                <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0.4 }} className="w-2 h-2 bg-accent rounded-full" />
              </div>
            </motion.div>
          )}

          {/* Suggested Replies */}
          {suggestions.length > 0 && !isSending && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-wrap gap-2 justify-start mt-6 pt-4 border-t border-border/30"
            >
              <div className="w-full flex items-center gap-1.5 text-xs text-muted-foreground font-semibold mb-1">
                <Sparkles className="w-3.5 h-3.5 text-accent" />
                <span>Suggested Questions</span>
              </div>
              {suggestions.map((reply, i) => (
                <button
                  key={i}
                  onClick={() => handleSuggestionClick(reply)}
                  className="px-3.5 py-1.5 rounded-full border border-accent/30 bg-accent/5 text-accent text-xs font-medium hover:bg-accent/15 hover:border-accent/50 transition-all shadow-sm text-left"
                >
                  {reply}
                </button>
              ))}
            </motion.div>
          )}

          <div ref={messagesEndRef} className="h-4" />
        </div>
      </div>

      <CoachChatInput />
    </div>
  );
}
