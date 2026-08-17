"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FadeUp } from "@/animations/FadeUp";
import { Check, X, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const SECTIONS_DATA = [
  {
    id: "summary",
    title: "Professional Summary",
    purpose: "A 2-3 sentence elevator pitch at the top of your resume. It should highlight your years of experience, core expertise, and biggest achievement.",
    good: "Software Engineer with 4+ years of experience building scalable microservices in Node.js and Go. Led migration of legacy monolith to AWS, reducing server costs by 30% and improving API response times by 40%.",
    bad: "Hardworking and dedicated software engineer looking for a challenging role in a reputed organization where I can utilize my skills to contribute to company growth.",
    tip: "Skip the objective statement ('looking for a role'). Focus entirely on what value you bring to them.",
  },
  {
    id: "experience",
    title: "Work Experience",
    purpose: "The core of your resume. Proves your capability through past measurable impact rather than just listing responsibilities.",
    good: "Spearheaded the development of a real-time analytics dashboard using React and WebSockets, adopted by 10,000+ daily active users and increasing customer retention by 15%.",
    bad: "Responsible for building frontend features. Worked with React. Fixed bugs and attended daily standups.",
    tip: "Use the XYZ formula: Accomplished [X] as measured by [Y], by doing [Z]. Always start with strong action verbs.",
  },
  {
    id: "skills",
    title: "Skills",
    purpose: "A scannable list of your technical and hard skills. Crucial for passing the ATS keyword check.",
    good: "Languages: TypeScript, Python, Go\nFrontend: React, Next.js, TailwindCSS\nCloud/DevOps: AWS (EC2, S3), Docker, CI/CD",
    bad: "HTML, CSS, JavaScript, Hard Worker, Team Player, Microsoft Word, Fast Learner, Communication.",
    tip: "Never include soft skills (Team player, Hard worker) in the skills section. Prove soft skills in your Experience bullets instead.",
  },
];

export function SectionsGuideSection() {
  const [activeTab, setActiveTab] = useState(SECTIONS_DATA[0].id);

  const activeContent = SECTIONS_DATA.find((s) => s.id === activeTab)!;

  return (
    <section id="sections" className="py-12 border-b border-border/50">
      <FadeUp>
        <div className="inline-block px-3 py-1 mb-6 rounded-full bg-accent/10 text-accent text-sm font-semibold tracking-wide uppercase">
          Section 3: Section By Section
        </div>
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">
          Mastering Every Component
        </h2>
        <p className="text-lg text-muted-foreground leading-relaxed mb-12 max-w-3xl">
          A great resume is the sum of its parts. Learn exactly what recruiters look for in every single section.
        </p>
      </FadeUp>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Vertical Tabs */}
        <div className="lg:w-1/4 flex flex-col gap-2">
          {SECTIONS_DATA.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveTab(section.id)}
              className={cn(
                "text-left px-4 py-3 rounded-xl transition-all font-medium flex items-center justify-between group",
                activeTab === section.id 
                  ? "bg-accent text-accent-foreground shadow-md" 
                  : "bg-muted/50 hover:bg-muted text-foreground"
              )}
            >
              {section.title}
              <ChevronDown className={cn(
                "w-4 h-4 transition-transform", 
                activeTab === section.id ? "-rotate-90" : "opacity-0 group-hover:opacity-50 -rotate-90"
              )} />
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="lg:w-3/4">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <div className="bg-card border border-border/50 p-6 rounded-2xl shadow-sm">
                <h3 className="text-xl font-bold mb-2">Purpose</h3>
                <p className="text-muted-foreground leading-relaxed">{activeContent.purpose}</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Bad Example */}
                <div className="bg-destructive/5 border border-destructive/20 p-6 rounded-2xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                    <X className="w-16 h-16 text-destructive" />
                  </div>
                  <div className="flex items-center gap-2 mb-4">
                    <X className="w-5 h-5 text-destructive" />
                    <h4 className="font-semibold text-destructive">How 90% write it</h4>
                  </div>
                  <p className="text-sm font-medium whitespace-pre-line text-foreground/80 italic">
                    {`"${activeContent.bad}"`}
                  </p>
                </div>

                {/* Good Example */}
                <div className="bg-green-500/5 border border-green-500/20 p-6 rounded-2xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Check className="w-16 h-16 text-green-500" />
                  </div>
                  <div className="flex items-center gap-2 mb-4">
                    <Check className="w-5 h-5 text-green-500" />
                    <h4 className="font-semibold text-green-600 dark:text-green-400">The Top 1% Way</h4>
                  </div>
                  <p className="text-sm font-medium whitespace-pre-line text-foreground/90">
                    {`"${activeContent.good}"`}
                  </p>
                </div>
              </div>

              <div className="bg-accent/5 border border-accent/20 p-6 rounded-2xl flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center shrink-0">
                  <span className="font-bold text-accent">💡</span>
                </div>
                <div>
                  <h4 className="font-semibold text-accent mb-1">Recruiter Tip</h4>
                  <p className="text-muted-foreground text-sm">{activeContent.tip}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
