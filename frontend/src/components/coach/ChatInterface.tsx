"use client";

import { motion } from "framer-motion";
import { MOCK_CONVERSATION, MOCK_SUGGESTED_REPLIES } from "@/data/mock-coach";
import { CoachChatInput } from "./ChatInput";
import { Bot, User } from "lucide-react";
import { cn } from "@/lib/utils";

export function ChatInterface() {
  return (
    <div className="flex-1 flex flex-col h-full bg-background relative overflow-hidden">
      
      {/* Header */}
      <div className="h-16 flex items-center justify-center border-b border-border/50 shrink-0 bg-background/80 backdrop-blur-md z-10 absolute top-0 left-0 right-0">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <h1 className="font-semibold text-sm">Resume Coach</h1>
        </div>
      </div>

      {/* Chat Messages Area */}
      <div className="flex-1 overflow-y-auto pt-24 pb-6 px-4 md:px-8 no-scrollbar scroll-smooth">
        <div className="max-w-3xl mx-auto space-y-6">
          
          {MOCK_CONVERSATION.map((message, i) => {
            const isAi = message.sender === "ai";

            return (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2 }}
                className={cn(
                  "flex gap-4 max-w-[85%]",
                  isAi ? "mr-auto" : "ml-auto flex-row-reverse"
                )}
              >
                {/* Avatar */}
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-auto shadow-sm",
                  isAi ? "bg-accent/10 border border-accent/20 text-accent" : "bg-muted border border-border text-muted-foreground"
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
                  {message.isTyping ? (
                    <div className="flex items-center gap-1 h-5 px-1">
                      <motion.div animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 1, delay: 0 }} className="w-1.5 h-1.5 bg-accent/50 rounded-full" />
                      <motion.div animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 bg-accent/50 rounded-full" />
                      <motion.div animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 bg-accent/50 rounded-full" />
                    </div>
                  ) : (
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  )}
                </div>
              </motion.div>
            );
          })}

          {/* Suggested Replies */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: MOCK_CONVERSATION.length * 0.2 + 0.5 }}
            className="flex flex-wrap gap-2 justify-end mt-4 max-w-[85%] ml-auto"
          >
            {MOCK_SUGGESTED_REPLIES.map((reply, i) => (
              <button
                key={i}
                className="px-4 py-2 rounded-full border border-accent/30 bg-accent/5 text-accent text-sm font-medium hover:bg-accent/10 hover:border-accent/50 transition-colors shadow-sm"
              >
                {reply}
              </button>
            ))}
          </motion.div>

          <div className="h-4" /> {/* Bottom padding */}
        </div>
      </div>

      <CoachChatInput />
    </div>
  );
}
