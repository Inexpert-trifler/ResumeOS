"use client";

import { motion } from "framer-motion";
import { WEAK_BULLETS } from "@/data/mock-analyzer";
import { ArrowDownRight, Sparkles, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AnalyzerWeakBullets() {
  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold mb-6">Weak Bullet Detection</h2>
      
      <div className="space-y-6">
        {WEAK_BULLETS.map((bullet, i) => (
          <motion.div 
            key={bullet.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-6 rounded-3xl border border-border/50 bg-card"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
              {/* Desktop Arrow Connector */}
              <div className="hidden md:flex absolute inset-0 items-center justify-center pointer-events-none">
                <div className="w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center text-muted-foreground z-10">
                  <ArrowDownRight className="w-5 h-5 -rotate-45" />
                </div>
              </div>

              {/* Original */}
              <div className="p-5 rounded-2xl bg-red-500/5 border border-red-500/20 relative">
                <div className="absolute top-4 right-4 text-red-500/50">
                  <XCircle className="w-5 h-5" />
                </div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-red-500 mb-3">Original (Weak)</h4>
                <p className="text-foreground text-sm leading-relaxed">
                  "{bullet.original}"
                </p>
                <div className="mt-4 pt-4 border-t border-red-500/10">
                  <p className="text-xs text-red-600 dark:text-red-400">
                    Lacks specific metrics and uses a passive action verb ("Worked on").
                  </p>
                </div>
              </div>

              {/* Suggestion */}
              <div className="p-5 rounded-2xl bg-green-500/5 border border-green-500/20 relative">
                <div className="absolute top-4 right-4 text-green-500/50">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-green-500 mb-3">Suggested Improvement</h4>
                <p className="text-foreground text-sm leading-relaxed">
                  "{bullet.suggestion}"
                </p>
                <div className="mt-4 pt-4 border-t border-green-500/10">
                  <Button variant="outline" size="sm" className="w-full text-green-600 dark:text-green-400 border-green-500/30 hover:bg-green-500/10">
                    Apply Change to Resume
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
