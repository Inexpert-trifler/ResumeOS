"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FileText, Briefcase, Mic, Map, TrendingUp } from "lucide-react";
import { DashboardService, type DashboardStatsData } from "@/services/DashboardService";
import { DashboardHealthChart } from "./DashboardHealthChart";

export function DashboardResumeStats() {
  const [stats, setStats] = useState<DashboardStatsData>({
    totalResumes: 1,
    totalJobsTracked: 0,
    totalCoverLetters: 0,
    totalInterviews: 0,
    totalRoadmaps: 0,
    avgAtsScore: 75,
  });

  useEffect(() => {
    // Token is configured via CloudSyncProvider on mount
    const timer = setTimeout(() => {
      void DashboardService.getStats()
        .then((res) => {
          if (res.stats) setStats(res.stats);
        })
        .catch(() => {});
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const score = stats.avgAtsScore || 75;

  const statCards = [
    { label: "Active Resumes", value: String(stats.totalResumes), icon: FileText, color: "text-blue-500" },
    { label: "Jobs Tracked", value: String(stats.totalJobsTracked), icon: Briefcase, color: "text-amber-500" },
    { label: "Mock Interviews", value: String(stats.totalInterviews), icon: Mic, color: "text-purple-500" },
    { label: "Career Roadmaps", value: String(stats.totalRoadmaps), icon: Map, color: "text-emerald-500" },
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
              <span className="flex items-center text-xs font-medium text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full mb-1">
                <TrendingUp className="w-3 h-3 mr-1" />
                Live DB
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
        <h3 className="text-sm font-medium text-muted-foreground mb-4">Average ATS Match Score</h3>
        <DashboardHealthChart score={score} />
      </motion.div>
    </section>
  );
}
