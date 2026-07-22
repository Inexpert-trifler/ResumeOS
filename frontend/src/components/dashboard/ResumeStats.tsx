"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { FileText, Target, Award, Download, TrendingUp } from "lucide-react";
import { readResumeDraft, resumeCompletion } from "@/lib/resume-draft";
import { DASHBOARD_STATS, RESUME_HEALTH_DATA } from "@/data/mock-dashboard";

export function DashboardResumeStats() {
  const [completion, setCompletion] = useState(0);
  const [hasData, setHasData] = useState(false);

  useEffect(() => {
    const draft = readResumeDraft();
    if (draft?.builder) {
      setCompletion(resumeCompletion(draft.builder));
      setHasData(true);
    }
  }, []);

  const score = hasData ? completion : DASHBOARD_STATS.avgScore;

  const healthData = hasData
    ? [
        { name: "Complete", value: completion, fill: "oklch(0.55 0.2 250)" },
        { name: "Remaining", value: 100 - completion, fill: "oklch(0.92 0 0)" },
      ]
    : RESUME_HEALTH_DATA;

  const statCards = [
    { label: "Resume Completion", value: `${score}%`, icon: FileText, color: "text-blue-500" },
    { label: "Sections Filled", value: hasData ? `${Math.round(score / 10)}/10` : `${DASHBOARD_STATS.avgScore}/100`, icon: Award, color: "text-yellow-500" },
    { label: "ATS Readiness", value: hasData ? `${Math.min(100, score + 5)}%` : `${DASHBOARD_STATS.atsReadiness}%`, icon: Target, color: "text-green-500" },
    { label: "Downloads", value: String(DASHBOARD_STATS.downloads), icon: Download, color: "text-purple-500" },
  ];

  return (
    <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Overview Cards */}
      <div className="lg:col-span-2 grid grid-cols-2 gap-4">
        {statCards.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="p-6 rounded-2xl border border-border/50 bg-card hover:border-border transition-colors flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-muted-foreground">{stat.label}</span>
              <stat.icon className={`w-5 h-5 ${stat.color} opacity-80`} />
            </div>
            <div className="flex items-end justify-between">
              <span className="text-3xl font-bold tracking-tight text-foreground">{stat.value}</span>
              <span className="flex items-center text-xs font-medium text-green-500 bg-green-500/10 px-2 py-0.5 rounded-full mb-1">
                <TrendingUp className="w-3 h-3 mr-1" />
                {hasData ? "Live" : "+12%"}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Resume Health Chart */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4 }}
        className="p-6 rounded-2xl border border-border/50 bg-card flex flex-col relative overflow-hidden"
      >
        <h3 className="text-sm font-medium text-muted-foreground mb-4">Overall Resume Health</h3>
        <div className="flex-1 min-h-[200px] relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={healthData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {healthData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)" }}
                itemStyle={{ fontSize: "14px", fontWeight: 600 }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-3xl font-bold">{score}</span>
            <span className="text-xs text-muted-foreground uppercase tracking-widest">Score</span>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
