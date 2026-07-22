"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, GitBranch, Star, GitFork, Code2, Sparkles } from "lucide-react";

const PORTFOLIO_TIPS = [
  { tip: "Pin your 6 best projects — quality over quantity" },
  { tip: "Every pinned repo needs a detailed README" },
  { tip: "Add a profile README.md for a personal branding boost" },
  { tip: "Use GitHub topics/tags for discoverability" },
  { tip: "Show live demos with GitHub Pages or Vercel" },
];

const QUICK_STATS = [
  { label: "Public Repos", value: "34", icon: Code2 },
  { label: "Total Stars", value: "539", icon: Star },
  { label: "Total Forks", value: "82", icon: GitFork },
];

export function GitHubSidebar() {
  return (
    <aside className="w-80 shrink-0 border-r border-border/50 bg-background/50 h-full flex flex-col">
      <div className="h-16 flex items-center px-6 border-b border-border/50 shrink-0">
        <Link href="/dashboard" className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
      </div>

      <div className="p-6 flex-1 overflow-y-auto no-scrollbar space-y-8">

        {/* Profile Header */}
        <div className="p-4 rounded-2xl border border-border/50 bg-card">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-foreground/10 to-foreground/5 flex items-center justify-center border border-border">
              <GitBranch className="w-5 h-5 text-foreground" />
            </div>
            <div>
              <p className="text-sm font-semibold">alexjohnson</p>
              <p className="text-[10px] text-muted-foreground">github.com/alexjohnson</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {QUICK_STATS.map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={i} className="text-center p-2 rounded-lg bg-muted/50">
                  <Icon className="w-3.5 h-3.5 text-muted-foreground mx-auto mb-1" />
                  <p className="text-sm font-bold">{s.value}</p>
                  <p className="text-[9px] text-muted-foreground">{s.label}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Portfolio Tips */}
        <div>
          <h3 className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60 mb-4">Portfolio Tips</h3>
          <div className="space-y-2">
            {PORTFOLIO_TIPS.map((t, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}
                className="flex items-start gap-2 text-xs text-muted-foreground p-2 rounded-lg hover:bg-muted/50 transition-colors">
                <span className="w-1.5 h-1.5 rounded-full bg-accent mt-1 shrink-0" />
                {t.tip}
              </motion.div>
            ))}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-accent/5 border border-accent/20">
          <div className="flex items-center gap-2 mb-2 text-accent">
            <Sparkles className="w-4 h-4" />
            <span className="text-xs font-bold">README Generator</span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Coming soon: auto-generate stunning READMEs with badges, architecture diagrams, and tech stack visuals.
          </p>
        </div>
      </div>
    </aside>
  );
}
