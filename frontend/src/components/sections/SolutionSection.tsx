"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { FadeUp } from "@/animations/FadeUp";
import { ArrowDown, CheckCircle2, XCircle } from "lucide-react";

const OLD_WAY = ["Traditional Builder", "Generic Resume", "Apply", "Rejected"];
const NEW_WAY = ["Our Platform", "Learn Strategy", "AI Analysis", "Optimize", "Interview Ready", "Higher Chance"];

export function SolutionSection() {
  return (
    <section className="py-24 relative bg-zinc-50 dark:bg-zinc-950/50">
      <Container>
        <SectionHeading
          title="We Don't Just Build Resumes. We Build Better Candidates."
          description="A complete paradigm shift in how you apply for jobs."
          align="center"
          className="mb-16"
        />

        <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
          {/* Left Column - Old Way */}
          <FadeUp delay={0.1}>
            <div className="bg-background rounded-2xl p-8 border border-border/50 shadow-sm flex flex-col items-center">
              <h3 className="text-xl font-semibold text-muted-foreground mb-8">The Old Way</h3>
              <div className="flex flex-col items-center gap-4 w-full">
                {OLD_WAY.map((step, i) => (
                  <div key={i} className="flex flex-col items-center w-full">
                    <div className="w-full text-center py-4 rounded-xl border border-destructive/20 bg-destructive/5 text-destructive/80 font-medium">
                      {step}
                      {i === OLD_WAY.length - 1 && <XCircle className="w-5 h-5 inline-block ml-2 mb-1" />}
                    </div>
                    {i < OLD_WAY.length - 1 && (
                      <ArrowDown className="w-6 h-6 text-destructive/30 my-2" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </FadeUp>

          {/* Right Column - New Way */}
          <FadeUp delay={0.3}>
            <div className="bg-background rounded-2xl p-8 border border-accent/30 shadow-[0_0_40px_rgba(var(--accent),0.1)] flex flex-col items-center relative overflow-hidden">
              {/* Subtle accent glow */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 blur-[80px] rounded-full pointer-events-none"></div>
              
              <h3 className="text-xl font-semibold text-accent mb-8 relative z-10">The AI Resume OS Way</h3>
              <div className="flex flex-col items-center gap-4 w-full relative z-10">
                {NEW_WAY.map((step, i) => (
                  <div key={i} className="flex flex-col items-center w-full">
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.5 + i * 0.1 }}
                      className="w-full text-center py-4 rounded-xl border border-accent/20 bg-accent/5 text-foreground font-medium shadow-sm"
                    >
                      {step}
                      {i === NEW_WAY.length - 1 && <CheckCircle2 className="w-5 h-5 inline-block ml-2 mb-1 text-green-500" />}
                    </motion.div>
                    {i < NEW_WAY.length - 1 && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        whileInView={{ height: "auto", opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.5 + i * 0.1 + 0.1 }}
                      >
                        <ArrowDown className="w-6 h-6 text-accent/50 my-2" />
                      </motion.div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </FadeUp>
        </div>
      </Container>
    </section>
  );
}
