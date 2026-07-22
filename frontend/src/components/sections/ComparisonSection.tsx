"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Check, X, Minus } from "lucide-react";

const COMPARISON_DATA = [
  { feature: "AI Written Content", us: true, standard: true, chatgpt: true, templates: false },
  { feature: "ATS Optimization", us: true, standard: true, chatgpt: false, templates: false },
  { feature: "Recruiter Feedback Simulation", us: true, standard: false, chatgpt: false, templates: false },
  { feature: "Targeted Mock Interviews", us: true, standard: false, chatgpt: false, templates: false },
  { feature: "Modern Premium Design", us: true, standard: "partial", chatgpt: false, templates: true },
  { feature: "Educational Career Guidance", us: true, standard: false, chatgpt: false, templates: false },
];

function StatusIcon({ status }: { status: boolean | string }) {
  if (status === true) {
    return <Check className="w-5 h-5 text-green-500 mx-auto" />;
  }
  if (status === false) {
    return <X className="w-5 h-5 text-destructive/50 mx-auto" />;
  }
  return <Minus className="w-5 h-5 text-yellow-500 mx-auto" />;
}

export function ComparisonSection() {
  return (
    <section className="py-24 bg-background">
      <Container>
        <SectionHeading
          title="How We Compare"
          description="See why thousands of job seekers are switching from traditional tools."
          align="center"
          className="mb-16"
        />

        <div className="overflow-x-auto pb-8">
          <div className="min-w-[800px] max-w-5xl mx-auto border border-border/50 rounded-2xl overflow-hidden shadow-sm bg-card">
            {/* Header */}
            <div className="grid grid-cols-5 bg-muted/50 p-6 border-b border-border/50">
              <div className="font-semibold text-muted-foreground">Features</div>
              <div className="font-bold text-accent text-center">AI Resume OS</div>
              <div className="font-semibold text-center text-foreground/80">Typical Builders</div>
              <div className="font-semibold text-center text-foreground/80">ChatGPT</div>
              <div className="font-semibold text-center text-foreground/80">Word Templates</div>
            </div>

            {/* Rows */}
            <div className="divide-y divide-border/50">
              {COMPARISON_DATA.map((row, i) => (
                <motion.div 
                  key={i} 
                  className="grid grid-cols-5 p-6 items-center hover:bg-muted/20 transition-colors"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                >
                  <div className="font-medium">{row.feature}</div>
                  <div className="text-center bg-accent/5 rounded-lg py-2 border border-accent/10">
                    <StatusIcon status={row.us} />
                  </div>
                  <div className="text-center">
                    <StatusIcon status={row.standard} />
                  </div>
                  <div className="text-center">
                    <StatusIcon status={row.chatgpt} />
                  </div>
                  <div className="text-center">
                    <StatusIcon status={row.templates} />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
