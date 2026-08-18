"use client";

import { motion } from "framer-motion";
import { CheckCircle2, AlertCircle, ScanLine } from "lucide-react";
import { useAnalyzerStore } from "@/stores/useAnalyzerStore";

export function AnalyzerATSSimulation() {
  const { analysis } = useAnalyzerStore();
  if (!analysis) return null;

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold mb-6">ATS Simulation</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center bg-card p-8 rounded-3xl border border-border/50 overflow-hidden">
        
        {/* Animated Scanner side */}
        <div className="relative w-full aspect-[3/4] bg-muted/20 rounded-lg border border-border/50 overflow-hidden flex flex-col p-4">
          {/* Mock Resume Lines */}
          <div className="w-1/2 h-4 bg-muted/80 rounded mb-6 mx-auto" />
          <div className="w-full h-2 bg-muted/60 rounded mb-2" />
          <div className="w-full h-2 bg-muted/60 rounded mb-2" />
          <div className="w-3/4 h-2 bg-muted/60 rounded mb-8" />
          
          <div className="w-1/3 h-3 bg-muted/80 rounded mb-4" />
          <div className="w-full h-2 bg-muted/60 rounded mb-2" />
          <div className="w-full h-2 bg-muted/60 rounded mb-2" />
          <div className="w-full h-2 bg-muted/60 rounded mb-2" />
          <div className="w-4/5 h-2 bg-muted/60 rounded mb-8" />
          
          {/* Scanner Line */}
          <motion.div
            animate={{ top: ["0%", "100%", "0%"] }}
            transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
            className="absolute left-0 right-0 h-1 bg-accent shadow-[0_0_15px_rgba(var(--accent),0.5)] z-10"
          />
          {/* Overlay gradient for scanner effect */}
          <motion.div
            animate={{ top: ["0%", "100%", "0%"] }}
            transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
            className="absolute left-0 right-0 h-32 bg-gradient-to-b from-transparent to-accent/10 z-0 pointer-events-none -translate-y-full"
          />
        </div>

        {/* Results Side */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 text-accent mb-2">
              <ScanLine className="w-5 h-5" />
              <h3 className="text-lg font-semibold">Parsing Results</h3>
            </div>
            <p className="text-muted-foreground text-sm">
              Resume ATS Health: {analysis.resumeHealth.score}/100. This structural score is separate from the Job Match Score above.
            </p>
          </div>

          <div className="space-y-3">
            {analysis.resumeHealth.atsSimulation.map((item) => {
              const isPass = item.state === "pass";
              return (
                <div
                  key={item.id}
                  className={`flex items-center gap-3 p-3 rounded-xl text-sm ${
                    isPass ? "bg-green-500/5 border border-green-500/20" : "bg-yellow-500/5 border border-yellow-500/20"
                  }`}
                >
                  {isPass ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-yellow-500 shrink-0" />
                  )}
                  <span>{item.message}</span>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
