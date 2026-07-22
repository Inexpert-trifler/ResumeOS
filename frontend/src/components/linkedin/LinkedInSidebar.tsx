"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, GitBranch, TrendingUp, Eye, Users, Star, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const METRICS = [
  { label: "Profile Views", value: "142", change: "+12%", icon: Eye, color: "text-blue-500" },
  { label: "Search Appearances", value: "38", change: "+5%", icon: TrendingUp, color: "text-green-500" },
  { label: "Connection Requests", value: "9", change: "+3", icon: Users, color: "text-purple-500" },
];

const KEYWORDS = ["System Design", "Distributed Systems", "Go", "Kubernetes", "AWS", "gRPC", "Redis", "Postgres"];

export function LinkedInSidebar() {
  return (
    <aside className="w-80 shrink-0 border-r border-border/50 bg-background/50 h-full flex flex-col">
      <div className="h-16 flex items-center px-6 border-b border-border/50 shrink-0">
        <Link href="/dashboard" className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
      </div>

      <div className="p-6 flex-1 overflow-y-auto no-scrollbar space-y-8">
        <div>
          <h3 className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60 mb-4">Profile Metrics (Mock)</h3>
          <div className="space-y-3">
            {METRICS.map((m, i) => {
              const Icon = m.icon;
              return (
                <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-3 p-3 rounded-xl border border-border/50 bg-card">
                  <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                    <Icon className={cn("w-4 h-4", m.color)} />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">{m.label}</p>
                    <p className="text-sm font-bold">{m.value}</p>
                  </div>
                  <span className="text-[10px] font-semibold text-green-500 bg-green-500/10 px-1.5 py-0.5 rounded-full">{m.change}</span>
                </motion.div>
              );
            })}
          </div>
        </div>

        <div>
          <h3 className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60 mb-4">Missing Keywords</h3>
          <div className="flex flex-wrap gap-2">
            {KEYWORDS.map((kw, i) => (
              <motion.span key={i} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}
                className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-accent/10 text-accent border border-accent/20 cursor-pointer hover:bg-accent/20 transition-colors">
                + {kw}
              </motion.span>
            ))}
          </div>
          <p className="text-[10px] text-muted-foreground mt-3">These keywords appear in 80%+ of job postings for your target role.</p>
        </div>

        <div className="p-4 rounded-2xl bg-accent/5 border border-accent/20">
          <div className="flex items-center gap-2 mb-2 text-accent">
            <Sparkles className="w-4 h-4" />
            <span className="text-xs font-bold">Recruiter Visibility</span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Adding 5+ missing keywords increases your chance of appearing in recruiter searches by 3.5x.
          </p>
        </div>
      </div>
    </aside>
  );
}
