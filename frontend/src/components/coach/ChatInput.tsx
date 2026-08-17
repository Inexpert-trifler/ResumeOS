"use client";

import { Mic, Paperclip, Send, Smile } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CoachChatInput() {
  return (
    <div className="p-4 bg-background/80 backdrop-blur-md border-t border-border/50 shrink-0 relative z-10">
      <div className="max-w-3xl mx-auto relative flex items-end gap-2 bg-card border border-border/50 rounded-3xl p-2 shadow-sm focus-within:border-accent/50 focus-within:ring-1 focus-within:ring-accent/50 transition-all">
        
        <Button variant="ghost" size="icon" className="shrink-0 rounded-full text-muted-foreground hover:text-foreground">
          <Paperclip className="w-5 h-5" />
        </Button>
        
        <div className="flex-1 min-h-[44px] flex items-center">
          <textarea
            placeholder="Message Coach..."
            className="w-full bg-transparent border-none focus:outline-none resize-none py-3 px-2 text-sm placeholder:text-muted-foreground max-h-32 min-h-[44px]"
            rows={1}
          />
        </div>

        <div className="flex items-center gap-1 shrink-0 pb-1 pr-1">
          <Button variant="ghost" size="icon" className="shrink-0 rounded-full text-muted-foreground hover:text-foreground">
            <Smile className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" className="shrink-0 rounded-full text-muted-foreground hover:text-foreground">
            <Mic className="w-5 h-5" />
          </Button>
          <Button size="icon" className="shrink-0 rounded-full bg-accent hover:bg-accent/90 text-accent-foreground shadow-sm ml-1">
            <Send className="w-4 h-4 ml-0.5" />
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
