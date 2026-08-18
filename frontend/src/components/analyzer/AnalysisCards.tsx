"use client";

import { motion } from "framer-motion";
import { Target, FileText, Zap, Layout, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAnalyzerStore } from "@/stores/useAnalyzerStore";

const ICON_MAP: Record<string, React.ElementType> = {
  Target,
  FileText,
  Zap,
  Layout,
};

export function AnalyzerAnalysisCards() {
  const { analysis } = useAnalyzerStore();
  if (!analysis) return null;

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold mb-6">Detailed Analysis</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {analysis.resumeHealth.scoreCards.map((card, i) => {
          const Icon = ICON_MAP[card.icon] || Target;
          
          return (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-6 rounded-3xl border border-border/50 bg-card hover:border-accent/30 transition-all flex flex-col sm:flex-row gap-6 items-start group relative overflow-hidden"
            >
              {/* Score Circular Indicator */}
              <div className="w-16 h-16 rounded-full border-4 border-muted flex items-center justify-center shrink-0 relative">
                <svg className="absolute inset-0 w-full h-full -rotate-90">
                  <circle
                    cx="50%"
                    cy="50%"
                    r="46%"
                    stroke="currentColor"
                    strokeWidth="8%"
                    fill="none"
                    className={card.color}
                    strokeDasharray="100"
                    strokeDashoffset={100 - card.score}
                    strokeLinecap="round"
                  />
                </svg>
                <span className="font-bold text-lg">{card.score}</span>
              </div>

              {/* Content */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Icon className={`w-4 h-4 ${card.color}`} />
                  <h3 className="font-semibold text-lg">{card.title}</h3>
                </div>
                <div className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-muted text-muted-foreground mb-3">
                  {card.status}
                </div>
                <p className="text-sm text-muted-foreground mb-4">{card.description}</p>
                
                <Button variant="secondary" size="sm" className="rounded-full gap-2 group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
                  Improve <ChevronRight className="w-3 h-3" />
                </Button>
              </div>

              {/* Decorative background icon */}
              <div className="absolute -right-4 -bottom-4 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
                <Icon className="w-32 h-32" />
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
