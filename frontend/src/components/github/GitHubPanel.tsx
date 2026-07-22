"use client";

import { motion } from "framer-motion";
import { Sparkles, FileText } from "lucide-react";

const README_PREVIEW = `# distributed-cache

> High-performance distributed cache with consistent hashing

![Go](https://img.shields.io/badge/Go-1.21-blue)
![Stars](https://img.shields.io/github/stars/alexjohnson/distributed-cache)
![License](https://img.shields.io/badge/license-MIT-green)

## Overview

A production-grade distributed caching system built with Go, supporting consistent hashing, automatic failover, and horizontal scaling.

## Features

- ⚡ Sub-millisecond latency
- 🔄 Automatic rebalancing on node join/leave
- 📊 Built-in metrics dashboard
- 🔒 TLS encryption support

## Architecture

\`\`\`
Client → Load Balancer → Cache Nodes
                      ↕ Gossip Protocol
                    Consistent Hash Ring
\`\`\``;

export function GitHubPanel() {
  return (
    <aside className="w-96 shrink-0 border-l border-border/50 bg-background/50 h-full flex flex-col">
      <div className="h-16 flex items-center px-6 border-b border-border/50 shrink-0 bg-background/80 backdrop-blur-md">
        <h2 className="font-semibold text-sm">README Preview</h2>
      </div>
      <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <FileText className="w-4 h-4 text-accent" />
            <h3 className="text-sm font-semibold">AI-Generated README</h3>
            <span className="ml-auto text-[10px] text-green-500 bg-green-500/10 px-2 py-0.5 rounded-full font-semibold">Score: 94/100</span>
          </div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="p-4 rounded-2xl border border-border/50 bg-card font-mono text-[11px] leading-relaxed text-foreground/80 overflow-x-auto whitespace-pre-wrap no-scrollbar max-h-96">
            {README_PREVIEW}
          </motion.div>
        </div>

        <div className="p-4 rounded-2xl bg-accent/5 border border-accent/20">
          <div className="flex items-center gap-2 mb-2 text-accent">
            <Sparkles className="w-4 h-4" />
            <span className="text-xs font-bold">What Makes This Great</span>
          </div>
          <div className="space-y-2">
            {[
              "Badges immediately communicate tech stack",
              "Architecture diagram shows system thinking",
              "Features list is scannable in seconds",
              "Clear setup instructions reduce friction",
            ].map((tip, i) => (
              <div key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                <span className="w-1.5 h-1.5 rounded-full bg-accent mt-1 shrink-0" />
                {tip}
              </div>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
