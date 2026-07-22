"use client";

import { Container } from "@/components/shared/Container";
import { FadeUp } from "@/animations/FadeUp";
import { Ruler } from "lucide-react";

const TIMELINE = [
  { stage: "Intern / Student", length: "1 Page Strictly", desc: "Focus on projects, GPA (if high), and coursework." },
  { stage: "0 - 5 Years", length: "1 Page", desc: "Condense impact into bullet points. Remove high school." },
  { stage: "5 - 10 Years", length: "1 - 2 Pages", desc: "If you have deep technical depth, 2 pages is acceptable." },
  { stage: "10+ Years", length: "2 Pages", desc: "Focus heavily on leadership and large-scale architectural impact." },
];

export function LengthGuideTimeline() {
  return (
    <section className="py-24 border-t border-border/50">
      <Container>
        <div className="text-center mb-16">
          <FadeUp>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-sm font-medium mb-6">
              <Ruler className="w-4 h-4" /> Size Matters
            </div>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
              Resume Length Guidelines
            </h2>
          </FadeUp>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="relative border-l border-border/50 ml-4 md:ml-0 md:border-l-0">
            {/* Desktop Center Line */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-border/50 -translate-x-1/2" />
            
            {TIMELINE.map((item, i) => (
              <FadeUp key={i} delay={i * 0.1} className={`relative flex items-center mb-12 md:mb-24 ${i % 2 === 0 ? "md:flex-row-reverse" : "md:flex-row"}`}>
                
                {/* Node */}
                <div className="absolute left-[-5px] md:left-1/2 md:-translate-x-1/2 w-3 h-3 bg-accent rounded-full shadow-[0_0_10px_rgba(var(--accent-rgb),0.5)] z-10" />

                <div className={`pl-8 md:pl-0 w-full md:w-1/2 ${i % 2 === 0 ? "md:pl-12" : "md:pr-12 text-left md:text-right"}`}>
                  <div className="bg-card border border-border/50 p-6 rounded-2xl shadow-sm hover:border-accent/30 transition-colors">
                    <div className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2">{item.stage}</div>
                    <div className="text-2xl font-bold text-foreground mb-3">{item.length}</div>
                    <p className="text-muted-foreground text-sm">{item.desc}</p>
                  </div>
                </div>

              </FadeUp>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
