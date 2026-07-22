"use client";

import { useState } from "react";
import { Template } from "@/data/templates-data";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Smartphone, Monitor, Moon, Sun, CheckCircle2, XCircle, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface TemplatePreviewModalProps {
  template: Template;
  isOpen: boolean;
  onClose: () => void;
}

export function TemplatePreviewModal({ template, isOpen, onClose }: TemplatePreviewModalProps) {
  const [viewMode, setViewMode] = useState<"desktop" | "mobile">("desktop");
  const [themeMode, setThemeMode] = useState<"light" | "dark">("light");

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-6xl w-full h-[90vh] p-0 overflow-hidden flex flex-col md:flex-row bg-background">
        <DialogTitle className="sr-only">Preview {template.name}</DialogTitle>
        
        {/* Left Side: Mockup Renderer */}
        <div className="flex-1 bg-muted/30 relative flex flex-col border-b md:border-b-0 md:border-r border-border/50">
          {/* Controls */}
          <div className="absolute top-4 left-4 z-10 flex gap-2">
            <div className="flex bg-background border border-border rounded-lg p-1 shadow-sm">
              <button 
                onClick={() => setViewMode("desktop")}
                className={cn("p-2 rounded-md transition-colors", viewMode === "desktop" ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground")}
              >
                <Monitor className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setViewMode("mobile")}
                className={cn("p-2 rounded-md transition-colors", viewMode === "mobile" ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground")}
              >
                <Smartphone className="w-4 h-4" />
              </button>
            </div>
            
            <div className="flex bg-background border border-border rounded-lg p-1 shadow-sm">
              <button 
                onClick={() => setThemeMode("light")}
                className={cn("p-2 rounded-md transition-colors", themeMode === "light" ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground")}
              >
                <Sun className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setThemeMode("dark")}
                className={cn("p-2 rounded-md transition-colors", themeMode === "dark" ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground")}
              >
                <Moon className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Render Area */}
          <div className="flex-1 overflow-auto flex items-center justify-center p-8 bg-[url('/grid.svg')] bg-center">
            <div 
              className={cn(
                "transition-all duration-500 shadow-2xl relative",
                themeMode === "light" ? "bg-white border-zinc-200" : "bg-zinc-900 border-zinc-700",
                viewMode === "desktop" ? "w-[600px] aspect-[1/1.4] border" : "w-[320px] aspect-[1/2] rounded-[2rem] border-4",
                "flex flex-col p-8"
              )}
            >
              {/* Fake Content simulating Resume */}
              <div className={cn("w-1/2 h-6 rounded mb-2", themeMode === "light" ? "bg-zinc-300" : "bg-zinc-700")} />
              <div className={cn("w-1/3 h-3 rounded mb-8", themeMode === "light" ? "bg-zinc-200" : "bg-zinc-800")} />
              <div className={cn("w-full h-4 rounded mb-2", themeMode === "light" ? "bg-zinc-200" : "bg-zinc-800")} />
              <div className={cn("w-11/12 h-4 rounded mb-8", themeMode === "light" ? "bg-zinc-200" : "bg-zinc-800")} />
              <div className={cn("w-1/4 h-5 rounded mb-4", themeMode === "light" ? "bg-zinc-300" : "bg-zinc-700")} />
              <div className="space-y-3 pl-4">
                <div className={cn("w-full h-3 rounded", themeMode === "light" ? "bg-zinc-200" : "bg-zinc-800")} />
                <div className={cn("w-5/6 h-3 rounded", themeMode === "light" ? "bg-zinc-200" : "bg-zinc-800")} />
                <div className={cn("w-11/12 h-3 rounded", themeMode === "light" ? "bg-zinc-200" : "bg-zinc-800")} />
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Data & Stats */}
        <div className="w-full md:w-[400px] flex flex-col h-full bg-card overflow-y-auto">
          <div className="p-6 border-b border-border/50">
            <h2 className="text-2xl font-bold mb-2">{template.name}</h2>
            <div className="flex gap-2">
              <span className="px-2 py-1 bg-muted text-xs font-medium rounded text-muted-foreground">{template.category}</span>
              <span className="px-2 py-1 bg-accent/10 text-accent text-xs font-medium rounded">{template.difficulty}</span>
            </div>
          </div>

          <div className="p-6 space-y-8 flex-1">
            {/* Scores */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-muted/50 rounded-xl border border-border/50">
                <div className="text-sm text-muted-foreground mb-1">ATS Score</div>
                <div className="text-2xl font-bold text-green-500">{template.atsScore}/100</div>
              </div>
              <div className="p-4 bg-muted/50 rounded-xl border border-border/50">
                <div className="text-sm text-muted-foreground mb-1">Readability</div>
                <div className="text-2xl font-bold text-accent">{template.readability}/100</div>
              </div>
            </div>

            {/* Target Audience */}
            <div>
              <h3 className="font-semibold mb-3 border-b border-border/50 pb-2">Best For</h3>
              <div className="flex flex-wrap gap-2">
                {template.bestFor.map(t => (
                  <span key={t} className="text-xs bg-green-500/10 text-green-600 dark:text-green-400 px-2 py-1 rounded-md border border-green-500/20">{t}</span>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-3 border-b border-border/50 pb-2">Avoid If</h3>
              <div className="flex flex-wrap gap-2">
                {template.avoidIf.map(t => (
                  <span key={t} className="text-xs bg-destructive/10 text-destructive px-2 py-1 rounded-md border border-destructive/20">{t}</span>
                ))}
              </div>
            </div>

            {/* Strengths / Weaknesses */}
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-sm mb-2 flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> Strengths</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  {template.strengths.map((s, i) => <li key={i}>• {s}</li>)}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-sm mb-2 flex items-center gap-2"><XCircle className="w-4 h-4 text-destructive" /> Weaknesses</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  {template.weaknesses.map((w, i) => <li key={i}>• {w}</li>)}
                </ul>
              </div>
            </div>

            {/* Specs */}
            <div className="bg-muted/30 p-4 rounded-xl border border-border/50 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Recommended Font</span>
                <span className="font-medium">{template.recommendedFont}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Pages</span>
                <span className="font-medium">{template.pages}</span>
              </div>
            </div>
          </div>

          <div className="p-6 border-t border-border/50 bg-background sticky bottom-0">
            <Button className="w-full rounded-full shadow-lg h-12 text-base gap-2">
              Use Template <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
