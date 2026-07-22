"use client";

import { useState } from "react";
import { Container } from "@/components/shared/Container";
import { FadeUp } from "@/animations/FadeUp";
import { motion, AnimatePresence } from "framer-motion";
import { Layers } from "lucide-react";
import { cn } from "@/lib/utils";

const SECTIONS = [
  { id: "header", label: "Header", top: "5%", height: "15%", explanation: "Contains your name, title, and contact info. Must be extremely clean and readable. Never use headers in Word docs; place text in body." },
  { id: "summary", label: "Professional Summary", top: "22%", height: "12%", explanation: "A 3-sentence hook. Who you are, your biggest win, and what you bring. Skip the 'objective'." },
  { id: "experience", label: "Experience", top: "36%", height: "40%", explanation: "The core. Bullet points should use the XYZ formula (Accomplished X as measured by Y, by doing Z)." },
  { id: "education", label: "Education", top: "78%", height: "10%", explanation: "Keep it brief unless you are a recent grad. Remove graduation dates if >5 years ago to avoid age bias." },
  { id: "skills", label: "Skills", top: "90%", height: "8%", explanation: "Comma-separated hard skills and technologies. Vital for ATS keyword matching. Remove soft skills." },
];

export function ResumeAnatomySection() {
  const [activeId, setActiveId] = useState<string | null>("experience");

  return (
    <section className="py-24 bg-background">
      <Container>
        <div className="text-center mb-16">
          <FadeUp>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-sm font-medium mb-6">
              <Layers className="w-4 h-4" /> Anatomy
            </div>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
              Deconstructing The Perfect Layout
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Click on any section to understand its purpose and what recruiters expect to see there.
            </p>
          </FadeUp>
        </div>

        <div className="flex flex-col md:flex-row gap-12 max-w-5xl mx-auto items-center">
          
          {/* Mockup */}
          <FadeUp delay={0.1} className="w-full md:w-1/2">
            <div className="relative aspect-[1/1.4] bg-white dark:bg-zinc-100 rounded-lg shadow-2xl border border-border p-4">
              {/* Decorative Mock Lines */}
              <div className="w-1/2 h-6 bg-zinc-300 rounded mx-auto mb-2" />
              <div className="w-1/3 h-3 bg-zinc-200 rounded mx-auto mb-8" />
              
              <div className="w-1/4 h-4 bg-zinc-300 rounded mb-2" />
              <div className="w-full h-3 bg-zinc-200 rounded mb-1" />
              <div className="w-11/12 h-3 bg-zinc-200 rounded mb-8" />

              <div className="w-1/4 h-4 bg-zinc-300 rounded mb-4" />
              <div className="space-y-6">
                {[1, 2].map(i => (
                  <div key={i}>
                    <div className="flex justify-between mb-2">
                      <div className="w-1/3 h-3 bg-zinc-300 rounded" />
                      <div className="w-1/4 h-3 bg-zinc-200 rounded" />
                    </div>
                    <div className="space-y-2 pl-4">
                      <div className="w-full h-2 bg-zinc-200 rounded" />
                      <div className="w-5/6 h-2 bg-zinc-200 rounded" />
                      <div className="w-11/12 h-2 bg-zinc-200 rounded" />
                    </div>
                  </div>
                ))}
              </div>

              {/* Clickable Overlays */}
              {SECTIONS.map((sec) => (
                <button
                  key={sec.id}
                  onClick={() => setActiveId(sec.id)}
                  className={cn(
                    "absolute left-2 right-2 rounded-md border-2 transition-all duration-300 flex items-center justify-center opacity-0 hover:opacity-100",
                    activeId === sec.id 
                      ? "opacity-100 border-accent bg-accent/10" 
                      : "border-accent border-dashed bg-accent/5"
                  )}
                  style={{ top: sec.top, height: sec.height }}
                >
                  <span className="bg-accent text-accent-foreground px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                    {sec.label}
                  </span>
                </button>
              ))}
            </div>
          </FadeUp>

          {/* Details Panel */}
          <div className="w-full md:w-1/2">
            <AnimatePresence mode="wait">
              {activeId && (
                <motion.div
                  key={activeId}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-card border border-border/50 p-8 rounded-2xl shadow-sm"
                >
                  {SECTIONS.filter(s => s.id === activeId).map(sec => (
                    <div key={sec.id}>
                      <h3 className="text-2xl font-bold mb-4 flex items-center gap-3 text-accent">
                        {sec.label}
                      </h3>
                      <p className="text-lg text-muted-foreground leading-relaxed">
                        {sec.explanation}
                      </p>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
            
            {!activeId && (
              <div className="p-8 border border-dashed border-border/50 rounded-2xl text-center text-muted-foreground">
                Select a section on the resume to see details.
              </div>
            )}
          </div>

        </div>
      </Container>
    </section>
  );
}
