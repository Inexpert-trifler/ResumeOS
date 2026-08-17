"use client";

import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { Target, PenTool, BookOpen, Briefcase, Award, Zap } from "lucide-react";
import { useResumeAnalysis } from "@/lib/resume-analysis";

const MINI_SCORE_STYLES = [
  { label: "ATS Match", icon: Target, color: "text-blue-500", stroke: "#3b82f6" },
  { label: "Grammar", icon: PenTool, color: "text-green-500", stroke: "#22c55e" },
  { label: "Readability", icon: BookOpen, color: "text-purple-500", stroke: "#a855f7" },
  { label: "Experience", icon: Briefcase, color: "text-orange-500", stroke: "#f97316" },
  { label: "Skills", icon: Zap, color: "text-yellow-500", stroke: "#eab308" },
  { label: "Impact", icon: Award, color: "text-pink-500", stroke: "#ec4899" },
];

export function AnalyzerHealthDashboard() {
  const analysis = useResumeAnalysis();
  const overallData = [
    { name: "Score", value: analysis.overallScore, fill: "hsl(var(--accent))" },
    { name: "Remaining", value: 100 - analysis.overallScore, fill: "hsl(var(--muted))" }
  ];
  const miniScores = [
    { ...MINI_SCORE_STYLES[0], score: analysis.atsReadiness },
    { ...MINI_SCORE_STYLES[1], score: analysis.grammarScore },
    { ...MINI_SCORE_STYLES[2], score: analysis.readability.score },
    { ...MINI_SCORE_STYLES[3], score: analysis.experienceScore },
    { ...MINI_SCORE_STYLES[4], score: analysis.skillsScore },
    { ...MINI_SCORE_STYLES[5], score: analysis.impactScore },
  ];

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Resume Health</h2>
        <div className="px-3 py-1 bg-accent/10 text-accent text-sm font-medium rounded-full">
          {analysis.verdict}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Large Score Circle */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="col-span-1 p-8 rounded-3xl border border-border/50 bg-card flex flex-col items-center justify-center relative shadow-sm"
        >
          <div className="w-48 h-48 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={overallData}
                  cx="50%"
                  cy="50%"
                  innerRadius={75}
                  outerRadius={90}
                  startAngle={90}
                  endAngle={-270}
                  dataKey="value"
                  stroke="none"
                  cornerRadius={10}
                >
                  {overallData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-5xl font-black">{analysis.overallScore}</span>
              <span className="text-xs text-muted-foreground uppercase tracking-widest mt-1">Out of 100</span>
            </div>
          </div>
          <p className="mt-6 text-center font-medium">{analysis.verdictDescription}</p>
        </motion.div>

        {/* Mini Scores Grid */}
        <div className="col-span-1 md:col-span-2 grid grid-cols-2 lg:grid-cols-3 gap-4">
          {miniScores.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + (i * 0.05) }}
              className="p-5 rounded-2xl border border-border/50 bg-card hover:bg-muted/50 transition-colors flex flex-col justify-between"
            >
              <div className="flex items-center gap-2 mb-4">
                <div className={`p-2 rounded-lg bg-background border border-border/50 shadow-sm ${item.color}`}>
                  <item.icon className="w-4 h-4" />
                </div>
                <span className="text-sm font-semibold">{item.label}</span>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-end justify-between">
                  <span className="text-2xl font-bold">{item.score}</span>
                  <span className="text-xs text-muted-foreground">/ 100</span>
                </div>
                <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${item.score}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: item.stroke }}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
