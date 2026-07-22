"use client";

import { KEYWORDS } from "@/data/mock-analyzer";
import { Check, X, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export function AnalyzerKeywordAnalysis() {
  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold mb-6">Keyword Analysis</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Matched */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-3xl border border-green-500/30 bg-green-500/5"
        >
          <div className="flex items-center gap-2 mb-4 text-green-500">
            <Check className="w-5 h-5" />
            <h3 className="font-semibold">Matched Keywords</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {KEYWORDS.matched.map((kw) => (
              <span key={kw} className="px-3 py-1 bg-green-500/10 text-green-600 dark:text-green-400 text-sm font-medium rounded-full border border-green-500/20">
                {kw}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Missing */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-6 rounded-3xl border border-red-500/30 bg-red-500/5"
        >
          <div className="flex items-center gap-2 mb-4 text-red-500">
            <X className="w-5 h-5" />
            <h3 className="font-semibold">Missing Hard Skills</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {KEYWORDS.missing.map((kw) => (
              <span key={kw} className="px-3 py-1 bg-red-500/10 text-red-600 dark:text-red-400 text-sm font-medium rounded-full border border-red-500/20">
                {kw}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Recommended */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-6 rounded-3xl border border-blue-500/30 bg-blue-500/5"
        >
          <div className="flex items-center gap-2 mb-4 text-blue-500">
            <Sparkles className="w-5 h-5" />
            <h3 className="font-semibold">Recommended</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {KEYWORDS.recommended.map((kw) => (
              <span key={kw} className="px-3 py-1 bg-blue-500/10 text-blue-600 dark:text-blue-400 text-sm font-medium rounded-full border border-blue-500/20">
                {kw}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
