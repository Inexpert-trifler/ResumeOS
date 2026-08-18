"use client";

import { useState, KeyboardEvent } from "react";
import { Mic, Paperclip, Send, Smile, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCoachStore } from "@/stores/useCoachStore";

export function CoachChatInput() {
  const [text, setText] = useState("");
  const { sendMessage, isSending } = useCoachStore();

  const handleSend = async () => {
    const trimmed = text.trim();
    if (!trimmed || isSending) return;
    setText("");
    await sendMessage(trimmed);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void handleSend();
    }
  };

  return (
    <div className="p-4 bg-background/80 backdrop-blur-md border-t border-border/50 shrink-0 relative z-10">
      <div className="max-w-3xl mx-auto relative flex items-end gap-2 bg-card border border-border/50 rounded-3xl p-2 shadow-sm focus-within:border-accent/50 focus-within:ring-1 focus-within:ring-accent/50 transition-all">
        
        <Button variant="ghost" size="icon" className="shrink-0 rounded-full text-muted-foreground hover:text-foreground" tabIndex={-1}>
          <Paperclip className="w-5 h-5" />
        </Button>
        
        <div className="flex-1 min-h-[44px] flex items-center">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Message Coach..."
            disabled={isSending}
            className="w-full bg-transparent border-none focus:outline-none resize-none py-3 px-2 text-sm placeholder:text-muted-foreground max-h-32 min-h-[44px] disabled:opacity-50"
            rows={1}
          />
        </div>

        <div className="flex items-center gap-1 shrink-0 pb-1 pr-1">
          <Button variant="ghost" size="icon" className="shrink-0 rounded-full text-muted-foreground hover:text-foreground" tabIndex={-1}>
            <Smile className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" className="shrink-0 rounded-full text-muted-foreground hover:text-foreground" tabIndex={-1}>
            <Mic className="w-5 h-5" />
          </Button>
          <Button
            onClick={() => void handleSend()}
            disabled={!text.trim() || isSending}
            size="icon"
            className="shrink-0 rounded-full bg-accent hover:bg-accent/90 text-accent-foreground shadow-sm ml-1 disabled:opacity-40"
          >
            {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4 ml-0.5" />}
          </Button>
        </div>

      </div>
      
      <div className="max-w-3xl mx-auto mt-3 text-center">
        <p className="text-[10px] text-muted-foreground">
          Coach can make mistakes. Please verify important information on your final resume.
        </p>
      </div>
    </div>
  );
}
