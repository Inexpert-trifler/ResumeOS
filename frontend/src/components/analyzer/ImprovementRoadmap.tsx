"use client";

import { motion } from "framer-motion";
import { IMPROVEMENT_ROADMAP } from "@/data/mock-analyzer";
import { ArrowUpRight, TrendingUp, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AnalyzerImprovementRoadmap() {
  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Improvement Roadmap</h2>
        <div className="text-sm text-muted-foreground flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-accent" />
          <span>Potential Score: <strong className="text-foreground">100/100</strong></span>
        </div>
      </div>
      
      <div className="space-y-4">
        {IMPROVEMENT_ROADMAP.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-5 rounded-2xl border border-border/50 bg-card hover:border-accent/30 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-6 group"
          >
            <div className="flex items-start gap-4 flex-1">
              {item.priority === "High" && <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />}
              {item.priority === "Medium" && <AlertCircle className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />}
              {item.priority === "Quick Win" && <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />}
              
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-foreground group-hover:text-accent transition-colors">{item.title}</h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-muted text-muted-foreground">
                    {item.priority}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 pl-9 md:pl-0">
              <div className="flex flex-col items-end mr-4">
                <span className="text-sm font-semibold text-green-500">{item.estimatedImpact}</span>
                <span className="text-xs text-muted-foreground">Estimated Impact</span>
              </div>
              <Button size="sm" className="rounded-full gap-2 shrink-0">
                Fix Now <ArrowUpRight className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
