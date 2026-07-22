"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MoreHorizontal, FileText, ExternalLink, Copy } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { readResumeDraft, resumeCompletion } from "@/lib/resume-draft";
import { RECENT_RESUMES } from "@/data/mock-dashboard";

interface ResumeCard {
  id: string;
  name: string;
  template: string;
  lastEdited: string;
  score: number;
  isReal: boolean;
}

export function DashboardRecentResumes() {
  const [resumes, setResumes] = useState<ResumeCard[]>([]);

  useEffect(() => {
    const draft = readResumeDraft();
    const cards: ResumeCard[] = [];

    if (draft?.resume) {
      const name = draft.resume.header.name || "My Resume";
      const updatedAt = draft.updatedAt
        ? new Date(draft.updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })
        : "today";
      cards.push({
        id: "draft",
        name: `${name} — ${draft.builder?.targetRole || draft.resume.header.title || "Resume"}`,
        template: draft.settings?.template ?? "classic",
        lastEdited: updatedAt,
        score: draft.builder ? resumeCompletion(draft.builder) : 70,
        isReal: true,
      });
    }

    // Fill remaining slots with mock placeholders (visually distinct)
    RECENT_RESUMES.slice(0, 3 - cards.length).forEach((r) => {
      cards.push({ ...r, isReal: false });
    });

    setResumes(cards);
  }, []);

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Recent Resumes</h2>
        <Link href="/templates" className="text-sm font-medium text-accent hover:underline">
          View all templates
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {resumes.map((resume, i) => (
          <motion.div
            key={resume.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="group rounded-2xl border border-border/50 bg-card overflow-hidden hover:border-accent/30 transition-colors"
          >
            {/* Thumbnail */}
            <div className="h-48 bg-muted/30 relative flex items-center justify-center overflow-hidden border-b border-border/50">
              <div className="w-32 h-40 bg-background shadow-md rounded border border-border/50 p-2 flex flex-col gap-1 transform transition-transform group-hover:scale-105 group-hover:rotate-1 group-hover:shadow-xl">
                <div className="w-1/2 h-1 bg-muted rounded" />
                <div className="w-full h-1 bg-muted/50 rounded" />
                <div className="w-3/4 h-1 bg-muted/50 rounded mb-2" />
                <div className="w-full h-10 bg-muted/30 rounded mb-1" />
                <div className="w-full h-10 bg-muted/30 rounded" />
              </div>
              <div className="absolute inset-0 bg-background/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <Link href="/studio">
                  <Button size="sm" className="rounded-full h-9">
                    <ExternalLink className="w-4 h-4 mr-2" /> Open
                  </Button>
                </Link>
              </div>
            </div>

            {/* Details */}
            <div className="p-4">
              <div className="flex items-start justify-between mb-1">
                <h3 className="font-semibold text-foreground truncate pr-2 text-sm">{resume.name}</h3>
                {resume.isReal && (
                  <span className="text-[10px] font-bold text-accent bg-accent/10 px-1.5 py-0.5 rounded-full shrink-0">Saved</span>
                )}
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                <span className="flex items-center gap-1">
                  <FileText className="w-3 h-3" /> {resume.template}
                </span>
                <span>Edited {resume.lastEdited}</span>
              </div>
              <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${resume.score}%` }}
                  transition={{ duration: 0.8, ease: "easeOut", delay: i * 0.1 + 0.2 }}
                  className="bg-accent h-full rounded-full"
                />
              </div>
              <p className="text-[10px] text-muted-foreground mt-1">{resume.score}% complete</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
