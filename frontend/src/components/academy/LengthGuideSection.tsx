"use client";

import { FadeUp } from "@/animations/FadeUp";
import { File } from "lucide-react";
import { motion } from "framer-motion";

export function LengthGuideSection() {
  return (
    <section id="length" className="py-12 border-b border-border/50">
      <FadeUp>
        <div className="inline-block px-3 py-1 mb-6 rounded-full bg-accent/10 text-accent text-sm font-semibold tracking-wide uppercase">
          Section 4: Resume Length
        </div>
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">
          The Great 1 vs 2 Page Debate
        </h2>
        <p className="text-lg text-muted-foreground leading-relaxed mb-12 max-w-3xl">
          The length of your resume should scale directly with your years of relevant experience. Do not stretch a 1-page resume to 2 pages with fluff.
        </p>
      </FadeUp>

      <div className="grid md:grid-cols-3 gap-6">
        <FadeUp delay={0.1}>
          <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm flex flex-col items-center text-center h-full hover:border-accent/30 transition-colors group">
            <div className="relative mb-6">
              <motion.div 
                className="w-16 h-20 bg-background border-2 border-foreground rounded flex flex-col gap-1 p-2 shadow-md group-hover:-translate-y-2 transition-transform"
              >
                <div className="w-full h-1 bg-muted rounded"></div>
                <div className="w-3/4 h-1 bg-muted rounded"></div>
                <div className="w-full h-1 bg-muted rounded"></div>
              </motion.div>
            </div>
            <h3 className="font-bold text-xl mb-2">1 Page (Strict)</h3>
            <p className="text-accent font-medium mb-4">0 - 7 Years Experience</p>
            <p className="text-sm text-muted-foreground">
              Students, new grads, and mid-level professionals. If Elon Musk can fit his resume on one page, so can you. Focus only on the most impactful achievements.
            </p>
          </div>
        </FadeUp>

        <FadeUp delay={0.2}>
          <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm flex flex-col items-center text-center h-full hover:border-accent/30 transition-colors group">
            <div className="relative mb-6 flex gap-2">
              <motion.div className="w-16 h-20 bg-background border-2 border-foreground rounded flex flex-col gap-1 p-2 shadow-md group-hover:-translate-y-2 transition-transform relative z-10">
                <div className="w-full h-1 bg-muted rounded"></div>
                <div className="w-full h-1 bg-muted rounded"></div>
              </motion.div>
              <motion.div className="w-16 h-20 bg-background border-2 border-foreground/50 rounded flex flex-col gap-1 p-2 shadow-md group-hover:-translate-y-1 transition-transform absolute left-4 top-2 z-0 opacity-50">
                <div className="w-full h-1 bg-muted rounded"></div>
              </motion.div>
            </div>
            <h3 className="font-bold text-xl mb-2">2 Pages (Allowed)</h3>
            <p className="text-accent font-medium mb-4">7 - 15 Years Experience</p>
            <p className="text-sm text-muted-foreground">
              Senior professionals, managers, or academics with extensive publications. Make sure the first page is strong enough to make them want to read the second.
            </p>
          </div>
        </FadeUp>

        <FadeUp delay={0.3}>
          <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm flex flex-col items-center text-center h-full hover:border-accent/30 transition-colors group">
            <div className="relative mb-6 flex gap-2">
              <File className="w-16 h-20 text-destructive opacity-80 group-hover:scale-110 transition-transform" />
            </div>
            <h3 className="font-bold text-xl mb-2 text-destructive">3+ Pages (Never)</h3>
            <p className="text-destructive/80 font-medium mb-4">Except Academic CVs</p>
            <p className="text-sm text-muted-foreground">
              Unless you are applying for a tenured professorship or a highly specialized government role, nobody wants to read a 3-page resume. Trim the fat.
            </p>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
