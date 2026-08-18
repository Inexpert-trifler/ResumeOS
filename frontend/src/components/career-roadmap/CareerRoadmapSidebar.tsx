"use client";

import Link from "next/link";
import { ArrowLeft, Map, Trash2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRoadmapStore } from "@/stores/useRoadmapStore";

export function CareerRoadmapSidebar() {
  const { roadmapsList, activeRoadmap, selectRoadmap, deleteRoadmap } = useRoadmapStore();

  return (
    <aside className="w-80 shrink-0 border-r border-border/50 bg-background/50 h-full flex flex-col">
      <div className="h-16 flex items-center px-6 border-b border-border/50 shrink-0">
        <Link href="/dashboard" className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Dashboard
        </Link>
      </div>

      <div className="p-6 flex-1 overflow-y-auto no-scrollbar space-y-8">

        {/* Saved Roadmaps List */}
        <div>
          <h3 className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60 mb-3 flex items-center gap-1.5">
            <Map className="w-3.5 h-3.5 text-accent" /> Saved Roadmaps
          </h3>

          {roadmapsList.length > 0 ? (
            <div className="space-y-2">
              {roadmapsList.map((rm) => {
                const isActive = activeRoadmap?.id === rm.id;
                return (
                  <div
                    key={rm.id}
                    onClick={() => void selectRoadmap(rm.id)}
                    className={cn(
                      "p-3 rounded-xl border cursor-pointer transition-all text-xs flex items-center justify-between group",
                      isActive ? "border-accent/50 bg-accent/10 font-semibold text-accent" : "border-border/50 bg-card hover:border-accent/30 text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <div className="truncate">
                      <p className="font-semibold text-foreground truncate">{rm.targetRole}</p>
                      <p className="text-[10px] text-muted-foreground">{new Date(rm.createdAt).toLocaleDateString()}</p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        void deleteRoadmap(rm.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1 hover:text-destructive transition-opacity"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground italic">No saved roadmaps yet. Generate your first roadmap!</p>
          )}
        </div>

        <div className="p-4 rounded-2xl bg-accent/5 border border-accent/20">
          <div className="flex items-center gap-2 mb-2 text-accent">
            <Sparkles className="w-4 h-4" />
            <span className="text-xs font-bold">Resume Academy Sync</span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Your roadmap milestones directly reference course modules inside Resume Academy to help you close your ATS technical skill gaps.
          </p>
        </div>
      </div>
    </aside>
  );
}
