"use client";

import { motion } from "framer-motion";
import { ANALYZER_SCORES } from "@/data/mock-analyzer";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { Target, PenTool, BookOpen, Briefcase, Award, Zap } from "lucide-react";

const MINI_SCORES = [
  { label: "ATS Match", score: ANALYZER_SCORES.ats, icon: Target, color: "text-blue-500", stroke: "#3b82f6" },
  { label: "Grammar", score: ANALYZER_SCORES.grammar, icon: PenTool, color: "text-green-500", stroke: "#22c55e" },
  { label: "Readability", score: ANALYZER_SCORES.readability, icon: BookOpen, color: "text-purple-500", stroke: "#a855f7" },
  { label: "Experience", score: ANALYZER_SCORES.experience, icon: Briefcase, color: "text-orange-500", stroke: "#f97316" },
  { label: "Skills", score: ANALYZER_SCORES.skills, icon: Zap, color: "text-yellow-500", stroke: "#eab308" },
  { label: "Impact", score: ANALYZER_SCORES.impact, icon: Award, color: "text-pink-500", stroke: "#ec4899" },
];

export function AnalyzerHealthDashboard() {
  const overallData = [
    { name: "Score", value: ANALYZER_SCORES.overall, fill: "hsl(var(--accent))" },
    { name: "Remaining", value: 100 - ANALYZER_SCORES.overall, fill: "hsl(var(--muted))" }
  ];

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Resume Health</h2>
        <div className="px-3 py-1 bg-accent/10 text-accent text-sm font-medium rounded-full">
          Top 5% of Candidates
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
              <span className="text-5xl font-black">{ANALYZER_SCORES.overall}</span>
              <span className="text-xs text-muted-foreground uppercase tracking-widest mt-1">Out of 100</span>
            </div>
          </div>
          <p className="mt-6 text-center font-medium">Your resume is highly optimized, but there is still room for perfection.</p>
        </motion.div>

        {/* Mini Scores Grid */}
        <div className="col-span-1 md:col-span-2 grid grid-cols-2 lg:grid-cols-3 gap-4">
          {MINI_SCORES.map((item, i) => (
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
