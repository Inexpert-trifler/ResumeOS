"use client";

import { motion } from "framer-motion";
import { Target, PenTool, BookOpen, Briefcase, Zap, Award } from "lucide-react";
import { useAnalyzerStore } from "@/stores/useAnalyzerStore";
import { AnalyzerChart } from "./AnalyzerChart";

const MINI_SCORE_STYLES = [
  { label: "Technical Skills", icon: Zap, color: "text-amber-500" },
  { label: "ATS Keywords", icon: Target, color: "text-blue-500" },
  { label: "Experience", icon: Briefcase, color: "text-orange-500" },
  { label: "Responsibilities", icon: PenTool, color: "text-emerald-500" },
  { label: "Education", icon: BookOpen, color: "text-purple-500" },
  { label: "Soft Skills", icon: Award, color: "text-pink-500" },
];

export function AnalyzerHealthDashboard() {
  const { analysis: realAnalysis } = useAnalyzerStore();
  if (!realAnalysis) return null;

  const score = realAnalysis.atsScore;
  const verdict = score >= 80 ? "Excellent Match" : score >= 60 ? "Good Match" : "Needs Improvement";
  const verdictDesc = realAnalysis.aiSummary || "Deterministic match against the job description you provided.";

  const breakdown = realAnalysis.breakdown;
  const miniScores = [
    { ...MINI_SCORE_STYLES[0], score: breakdown.skills },
    { ...MINI_SCORE_STYLES[1], score: breakdown.keywords },
    { ...MINI_SCORE_STYLES[2], score: breakdown.experience },
    { ...MINI_SCORE_STYLES[3], score: breakdown.responsibilities },
    { ...MINI_SCORE_STYLES[4], score: breakdown.education },
    { ...MINI_SCORE_STYLES[5], score: breakdown.softSkills },
  ];

  return (
    <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Overall Score Pie Chart */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="lg:col-span-4 p-6 rounded-2xl border border-border/50 bg-card flex flex-col items-center justify-center text-center relative overflow-hidden"
      >
        <h3 className="text-sm font-medium text-muted-foreground mb-4">Job Match Score</h3>
        <div className="w-48 h-48 relative">
          <AnalyzerChart score={score} />
        </div>
        <div className="mt-4 space-y-1">
          <span className="inline-block px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-semibold">
            {verdict}
          </span>
          <p className="text-xs text-muted-foreground max-w-xs">{verdictDesc}</p>
        </div>
      </motion.div>

      {/* 6 Mini Score Cards */}
      <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-4">
        {miniScores.map((item, i) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="p-5 rounded-2xl border border-border/50 bg-card flex flex-col justify-between hover:border-border transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-muted-foreground">{item.label}</span>
                <Icon className={`w-4 h-4 ${item.color}`} />
              </div>
              <div className="flex items-end justify-between">
                <span className="text-2xl font-bold tracking-tight">{item.score}%</span>
                <div className="w-12 h-1.5 bg-muted rounded-full overflow-hidden mb-1">
                  <div
                    className="h-full bg-accent rounded-full transition-all duration-500"
                    style={{ width: `${item.score}%` }}
                  />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
