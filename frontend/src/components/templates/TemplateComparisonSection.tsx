"use client";

import { useState } from "react";
import { TEMPLATES } from "@/data/templates-data";
import { Container } from "@/components/shared/Container";
import { FadeUp } from "@/animations/FadeUp";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowRightLeft } from "lucide-react";
import { motion } from "framer-motion";

export function TemplateComparisonSection() {
  const [leftTemplateId, setLeftTemplateId] = useState(TEMPLATES[0].id);
  const [rightTemplateId, setRightTemplateId] = useState(TEMPLATES[1].id);

  const leftTemp = TEMPLATES.find(t => t.id === leftTemplateId)!;
  const rightTemp = TEMPLATES.find(t => t.id === rightTemplateId)!;

  const renderProgressBar = (label: string, leftVal: number, rightVal: number) => {
    return (
      <div className="mb-6">
        <div className="flex justify-between text-sm font-medium mb-2">
          <span>{leftVal}%</span>
          <span className="text-muted-foreground">{label}</span>
          <span>{rightVal}%</span>
        </div>
        <div className="relative h-2 w-full bg-muted rounded-full overflow-hidden flex">
          <motion.div 
            className="h-full bg-accent" 
            initial={{ width: 0 }} 
            whileInView={{ width: `${leftVal / 2}%` }} 
            viewport={{ once: true }} 
            transition={{ duration: 1, ease: "easeOut" }}
          />
          <div className="w-1 h-full bg-background absolute left-1/2 -translate-x-1/2 z-10" />
          <motion.div 
            className="h-full bg-foreground absolute right-0" 
            initial={{ width: 0 }} 
            whileInView={{ width: `${rightVal / 2}%` }} 
            viewport={{ once: true }} 
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
      </div>
    );
  };

  return (
    <section className="py-24 bg-muted/20 border-y border-border/50">
      <Container>
        <div className="text-center mb-16">
          <FadeUp>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-sm font-medium mb-6">
              <ArrowRightLeft className="w-4 h-4" /> Compare
            </div>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
              Head-to-Head Comparison
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Not sure which one to pick? Compare templates side-by-side to see which data structure fits your career.
            </p>
          </FadeUp>
        </div>

        <FadeUp delay={0.1}>
          <div className="max-w-4xl mx-auto bg-card border border-border/50 rounded-3xl p-6 md:p-12 shadow-xl">
            {/* Selectors */}
            <div className="flex flex-col md:flex-row items-center gap-4 md:gap-12 mb-12">
              <div className="w-full flex-1">
                <Select value={leftTemplateId} onValueChange={(val) => val && setLeftTemplateId(val)}>
                  <SelectTrigger className="h-12 bg-muted/50 border-border/50 text-base font-semibold">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TEMPLATES.map(t => (
                      <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center shrink-0">
                <span className="text-muted-foreground font-bold text-sm">VS</span>
              </div>

              <div className="w-full flex-1">
                <Select value={rightTemplateId} onValueChange={(val) => val && setRightTemplateId(val)}>
                  <SelectTrigger className="h-12 bg-muted/50 border-border/50 text-base font-semibold">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TEMPLATES.map(t => (
                      <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Metric Bars */}
            <div className="mb-12">
              {renderProgressBar("ATS Compatibility", leftTemp.atsScore, rightTemp.atsScore)}
              {renderProgressBar("Readability", leftTemp.readability, rightTemp.readability)}
              {renderProgressBar("Modern Aesthetic", leftTemp.modernScore, rightTemp.modernScore)}
              {renderProgressBar("Minimalism", leftTemp.minimalScore, rightTemp.minimalScore)}
            </div>

            {/* Qualitative Diff */}
            <div className="grid md:grid-cols-2 gap-8 md:gap-16 pt-8 border-t border-border/50">
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Ideal For</div>
                  <div className="font-medium">{leftTemp.careerStages[0]} / {leftTemp.careerStages[leftTemp.careerStages.length - 1]}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Layout</div>
                  <div className="font-medium">{leftTemp.pages}</div>
                </div>
              </div>
              <div className="space-y-4 text-right md:text-left">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Ideal For</div>
                  <div className="font-medium">{rightTemp.careerStages[0]} / {rightTemp.careerStages[rightTemp.careerStages.length - 1]}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Layout</div>
                  <div className="font-medium">{rightTemp.pages}</div>
                </div>
              </div>
            </div>
          </div>
        </FadeUp>
      </Container>
    </section>
  );
}
