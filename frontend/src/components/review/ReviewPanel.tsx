"use client";

import { motion } from "framer-motion";
import { Sparkles, TrendingUp, Users, Award, BookOpen } from "lucide-react";

const STATS = [
  { label: "Resumes Reviewed", value: "2.4M+", icon: BookOpen, color: "text-blue-500" },
  { label: "Avg Score Lift", value: "+23pts", icon: TrendingUp, color: "text-green-500" },
  { label: "Hired Within 30d", value: "68%", icon: Users, color: "text-purple-500" },
  { label: "Top Accuracy", value: "97%", icon: Award, color: "text-orange-500" },
];

const FEATURES = [
  { title: "Recruiter Eye Tracking", desc: "See exactly where recruiters focus in the first 6 seconds" },
  { title: "ATS Pass Guarantee", desc: "Verified against 40+ major ATS platforms including Workday & Greenhouse" },
  { title: "Industry Benchmarking", desc: "Compare your resume against top performers in your field" },
  { title: "Tone & Voice Analysis", desc: "Ensure your resume sounds confident, not desperate" },
];

export function ReviewPanel() {
  return (
    <aside className="w-96 shrink-0 border-l border-border/50 bg-background/50 h-full flex flex-col">
      <div className="h-16 flex items-center px-6 border-b border-border/50 shrink-0 bg-background/80 backdrop-blur-md">
        <h2 className="font-semibold text-sm">Analytics Preview</h2>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-8">

        {/* Stats Grid */}
        <div>
          <h3 className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60 mb-4">Platform Stats</h3>
          <div className="grid grid-cols-2 gap-3">
            {STATS.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.08 }}
                  className="p-4 rounded-2xl border border-border/50 bg-card text-center"
                >
                  <Icon className={`w-5 h-5 mx-auto mb-2 ${stat.color}`} />
                  <p className="text-xl font-bold">{stat.value}</p>
                  <p className="text-[10px] text-muted-foreground leading-tight mt-0.5">{stat.label}</p>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Feature Highlights */}
        <div>
          <h3 className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60 mb-4">Feature Highlights</h3>
          <div className="space-y-3">
            {FEATURES.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="p-4 rounded-xl border border-border/50 bg-card hover:border-accent/30 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2 shrink-0" />
                  <div>
                    <p className="text-sm font-semibold">{f.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* AI Note */}
        <div className="p-5 rounded-2xl bg-accent/5 border border-accent/20">
          <div className="flex items-center gap-2 mb-2 text-accent">
            <Sparkles className="w-4 h-4" />
            <span className="text-xs font-bold">Why This Matters</span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            75% of resumes are rejected by ATS before a human ever reads them. Our AI ensures yours makes it through every filter.
          </p>
        </div>
      </div>
    </aside>
  );
}
