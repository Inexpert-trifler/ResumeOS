"use client";

import { CareerStage, STAGES } from "@/data/templates-data";
import { Container } from "@/components/shared/Container";
import { FadeUp } from "@/animations/FadeUp";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface StageSelectorSectionProps {
  selectedStage: CareerStage;
  setSelectedStage: (stage: CareerStage) => void;
}

export function StageSelectorSection({ selectedStage, setSelectedStage }: StageSelectorSectionProps) {
  return (
    <section className="py-12 bg-muted/30 border-y border-border/50">
      <Container>
        <FadeUp>
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">
              Select Your Career Stage
            </h2>
            <p className="text-muted-foreground">
              Your resume layout should scale with your experience.
            </p>
          </div>
        </FadeUp>

        <div className="flex flex-wrap justify-center gap-3">
          {STAGES.map((stage, i) => {
            const isSelected = selectedStage === stage;
            return (
              <FadeUp key={stage} delay={i * 0.05}>
                <button
                  onClick={() => setSelectedStage(stage)}
                  className={cn(
                    "relative px-6 py-3 rounded-full text-sm font-medium transition-all duration-300",
                    isSelected
                      ? "text-background"
                      : "text-foreground bg-card hover:bg-muted border border-border hover:border-border/80 shadow-sm"
                  )}
                >
                  {isSelected && (
                    <motion.div
                      layoutId="stage-bubble"
                      className="absolute inset-0 bg-foreground rounded-full shadow-md"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <span className="relative z-10">{stage}</span>
                </button>
              </FadeUp>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
