"use client";

import { motion } from "framer-motion";
import { AlignLeft, Type, MoveVertical, MoveHorizontal } from "lucide-react";
import { useAnalyzerStore } from "@/stores/useAnalyzerStore";

const ICON_MAP: Record<string, React.ElementType> = {
  MoveHorizontal,
  AlignLeft,
  Type,
  MoveVertical,
};

export function AnalyzerFormattingAnalysis() {
  const { analysis } = useAnalyzerStore();
  if (!analysis) return null;

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold mb-6">Formatting Analysis</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {analysis.resumeHealth.formattingMetrics.map((metric, i) => {
          const Icon = ICON_MAP[metric.icon] || MoveHorizontal;

          return (
          <motion.div
            key={metric.name}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="p-5 rounded-2xl border border-border/50 bg-card hover:border-accent/30 transition-colors"
          >
            <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center mb-4 text-muted-foreground">
              <Icon className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-foreground mb-1">{metric.name}</h3>
            
            <div className="flex items-end justify-between mt-4">
              <span className="text-2xl font-bold">{metric.score}%</span>
              <span className="text-xs text-green-500 font-medium">{metric.status}</span>
            </div>
            <div className="mt-2 h-1 w-full bg-muted rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${metric.score}%` }}
                className="h-full bg-accent rounded-full"
              />
            </div>
          </motion.div>
          );
        })}
      </div>
    </section>
  );
}
