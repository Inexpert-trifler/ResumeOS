"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { readResumeDraft, resumeCompletion } from "@/lib/resume-draft";

export function DashboardHeroWelcome() {
  const [name, setName] = useState("there");
  const [completion, setCompletion] = useState<number | null>(null);
  const [hasResume, setHasResume] = useState(false);

  useEffect(() => {
    const draft = readResumeDraft();
    if (draft?.builder) {
      const p = draft.builder.personalInfo;
      const firstName = p?.firstName?.trim();
      if (firstName) setName(firstName);
      setCompletion(resumeCompletion(draft.builder));
      setHasResume(true);
    }
  }, []);

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-accent/20 via-accent/5 to-background border border-accent/10 p-8 md:p-10 shadow-sm">
      {/* Abstract Background Shapes */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-accent/20 rounded-full blur-3xl opacity-50 mix-blend-screen pointer-events-none" />
      <div className="absolute bottom-0 left-20 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl opacity-30 mix-blend-screen pointer-events-none" />

      <div className="relative z-10 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-medium mb-4"
        >
          <Sparkles className="w-3.5 h-3.5" />
          {hasResume ? "Resume in Progress" : "Get Started"}
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-3xl md:text-5xl font-bold tracking-tight mb-4"
        >
          Welcome back, {name}.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-muted-foreground text-lg mb-8 max-w-xl"
        >
          {hasResume && completion !== null
            ? `Your resume is ${completion}% complete. Keep going — you're almost there.`
            : "Start building your resume and let AI help you land your dream job."}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap items-center gap-4"
        >
          <Link href={hasResume ? "/studio" : "/builder"}>
            <Button size="lg" className="rounded-full shadow-lg shadow-accent/20 h-12 px-8">
              {hasResume ? "Continue Editing" : "Build My Resume"}
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
          <Link href="/templates">
            <Button variant="outline" size="lg" className="rounded-full bg-background/50 backdrop-blur border-border/50 h-12 px-8">
              Explore Templates
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
