"use client";

import { Check, X, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useAnalyzerStore } from "@/stores/useAnalyzerStore";

export function AnalyzerKeywordAnalysis() {
  const { analysis: realAnalysis } = useAnalyzerStore();
  if (!realAnalysis) return null;

  const matchedKeywords = (realAnalysis.matchedKeywords || []).map((k) => k.keyword);
  const missingKeywords = (realAnalysis.missingKeywords || []).map((k) => k.keyword);
  const matchedSkills = realAnalysis.matchedTechnicalSkills || realAnalysis.matchedSkills || [];

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold mb-6">Keyword & Skill Alignment</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Matched Keywords */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-3xl border border-emerald-500/30 bg-emerald-500/5 shadow-sm"
        >
          <div className="flex items-center gap-2 mb-4 text-emerald-500">
            <Check className="w-5 h-5" />
            <h3 className="font-bold text-sm">Matched Keywords ({matchedKeywords.length})</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {matchedKeywords.length > 0 ? (
              matchedKeywords.map((kw) => (
                <span key={kw} className="px-3 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold rounded-full border border-emerald-500/20">
                  {kw}
                </span>
              ))
            ) : (
              <span className="text-xs text-muted-foreground italic">No matched keywords detected yet.</span>
            )}
          </div>
        </motion.div>

        {/* Missing Keywords */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-6 rounded-3xl border border-rose-500/30 bg-rose-500/5 shadow-sm"
        >
          <div className="flex items-center gap-2 mb-4 text-rose-500">
            <X className="w-5 h-5" />
            <h3 className="font-bold text-sm">Missing Keywords ({missingKeywords.length})</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {missingKeywords.length > 0 ? (
              missingKeywords.map((kw) => (
                <span key={kw} className="px-3 py-1 bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs font-semibold rounded-full border border-rose-500/20">
                  {kw}
                </span>
              ))
            ) : (
              <span className="text-xs text-muted-foreground italic">No missing keywords! High alignment.</span>
            )}
          </div>
        </motion.div>

        {/* Matched Technical Skills */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-6 rounded-3xl border border-blue-500/30 bg-blue-500/5 shadow-sm"
        >
          <div className="flex items-center gap-2 mb-4 text-blue-500">
            <Sparkles className="w-5 h-5" />
            <h3 className="font-bold text-sm">Matched Technical Skills ({matchedSkills.length})</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {matchedSkills.length > 0 ? (
              matchedSkills.map((kw) => (
                <span key={kw} className="px-3 py-1 bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-semibold rounded-full border border-blue-500/20">
                  {kw}
                </span>
              ))
            ) : (
              <span className="text-xs text-muted-foreground italic">Add technical skills to your resume.</span>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
