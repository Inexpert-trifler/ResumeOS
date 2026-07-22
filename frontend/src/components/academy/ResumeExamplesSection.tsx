"use client";

import { useState } from "react";
import { FadeUp } from "@/animations/FadeUp";
import { Info } from "lucide-react";
import { cn } from "@/lib/utils";

const ANNOTATIONS = [
  { top: "15%", left: "10%", type: "bad", text: "Objective statement is outdated. Use a Professional Summary." },
  { top: "40%", left: "50%", type: "good", text: "Excellent use of metrics (increased revenue by 25%)." },
  { top: "70%", left: "20%", type: "bad", text: "Skill bar graphics cannot be parsed by ATS." },
];

export function ResumeExamplesSection() {
  const [activeAnnotation, setActiveAnnotation] = useState<number | null>(null);

  return (
    <section id="examples" className="py-12 border-b border-border/50">
      <FadeUp>
        <div className="inline-block px-3 py-1 mb-6 rounded-full bg-accent/10 text-accent text-sm font-semibold tracking-wide uppercase">
          Section 8: Interactive Examples
        </div>
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">
          See It In Action
        </h2>
        <p className="text-lg text-muted-foreground leading-relaxed mb-12 max-w-3xl">
          Hover over the hotspots on this example resume to see exactly what recruiters love and what they hate.
        </p>
      </FadeUp>

      <div className="flex flex-col lg:flex-row gap-12 items-start">
        {/* The Resume Mockup */}
        <div className="relative w-full max-w-xl mx-auto lg:mx-0 bg-white dark:bg-zinc-200 rounded-xl shadow-2xl overflow-hidden border border-border aspect-[1/1.4] p-8">
          
          {/* Faux Resume Content */}
          <div className="w-1/2 h-6 bg-zinc-400 rounded mb-2"></div>
          <div className="w-1/3 h-3 bg-zinc-300 rounded mb-8"></div>

          <div className="w-full h-4 bg-zinc-300 rounded mb-2"></div>
          <div className="w-11/12 h-4 bg-zinc-300 rounded mb-8"></div>

          <div className="w-1/4 h-5 bg-zinc-400 rounded mb-4"></div>
          
          <div className="flex justify-between mb-2">
            <div className="w-1/3 h-4 bg-zinc-400 rounded"></div>
            <div className="w-1/4 h-4 bg-zinc-300 rounded"></div>
          </div>
          <ul className="space-y-3 mb-6 pl-4">
            <li className="w-full h-3 bg-zinc-300 rounded"></li>
            <li className="w-5/6 h-3 bg-zinc-300 rounded"></li>
            <li className="w-11/12 h-3 bg-zinc-300 rounded"></li>
          </ul>

          <div className="w-1/4 h-5 bg-zinc-400 rounded mb-4 mt-8"></div>
          <div className="flex gap-4">
            <div className="w-1/2 h-8 bg-zinc-300 rounded"></div>
            <div className="w-1/2 h-8 bg-zinc-300 rounded"></div>
          </div>

          {/* Annotations Overlay */}
          {ANNOTATIONS.map((ann, i) => (
            <div 
              key={i}
              className="absolute z-10 -translate-x-1/2 -translate-y-1/2"
              style={{ top: ann.top, left: ann.left }}
              onMouseEnter={() => setActiveAnnotation(i)}
              onMouseLeave={() => setActiveAnnotation(null)}
            >
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center cursor-pointer shadow-lg transition-transform hover:scale-110",
                ann.type === "good" ? "bg-green-500 text-white" : "bg-destructive text-white"
              )}>
                <Info className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>

        {/* Dynamic Details Panel */}
        <div className="flex-1 w-full lg:sticky top-32">
          {activeAnnotation !== null ? (
            <div className={cn(
              "p-6 rounded-2xl border shadow-lg transition-all",
              ANNOTATIONS[activeAnnotation].type === "good" 
                ? "bg-green-500/10 border-green-500/30" 
                : "bg-destructive/10 border-destructive/30"
            )}>
              <div className="flex items-center gap-3 mb-4">
                <span className={cn(
                  "px-3 py-1 text-xs font-bold uppercase rounded-full",
                  ANNOTATIONS[activeAnnotation].type === "good" 
                    ? "bg-green-500 text-white" 
                    : "bg-destructive text-white"
                )}>
                  {ANNOTATIONS[activeAnnotation].type === "good" ? "Good Practice" : "Mistake"}
                </span>
              </div>
              <p className="text-lg font-medium text-foreground">
                {ANNOTATIONS[activeAnnotation].text}
              </p>
            </div>
          ) : (
            <div className="p-12 rounded-2xl border border-dashed border-border/50 bg-muted/30 flex items-center justify-center text-center">
              <p className="text-muted-foreground font-medium">Hover over any hotspot on the resume to see detailed recruiter feedback.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
