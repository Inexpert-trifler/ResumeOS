"use client";

import { FadeUp } from "@/animations/FadeUp";
import { StaggerContainer, StaggerItem } from "@/animations/StaggerAnimation";
import { Mail, Sparkles, FileText, Briefcase, Palette, Wand2, CheckCircle2, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const MOCK_LETTER = `Dear Hiring Manager,

I am writing to express my strong interest in the Senior Software Engineer position at Stripe. With 5+ years of experience building scalable payment infrastructure and a proven track record of shipping high-impact features, I am confident I can contribute meaningfully to your engineering team.

At my previous role at Fintech Corp, I architected a real-time transaction processing system that reduced latency by 47% and handled 2M+ daily transactions with 99.99% uptime. I have deep expertise in the technologies you use — Go, distributed systems, and event-driven architectures.

What draws me to Stripe specifically is your mission to grow the GDP of the internet. I have admired how your developer-first approach has made payments accessible to millions of businesses, and I would love to contribute to that vision.

I would welcome the opportunity to discuss how my background aligns with your needs.

Best regards,
Alex Johnson`;

const FEATURES = [
  { icon: Wand2, label: "Auto-Personalize", desc: "Matches your resume to the JD" },
  { icon: Sparkles, label: "Tone Matching", desc: "4 writing styles to choose from" },
  { icon: CheckCircle2, label: "ATS Optimized", desc: "Keyword-rich structure" },
  { icon: Zap, label: "One-Click Export", desc: "PDF, DOCX, plain text" },
];

export function CoverLetterWorkspace() {
  return (
    <div className="flex-1 flex flex-col h-full bg-background overflow-y-auto no-scrollbar">

      <div className="h-16 flex items-center justify-between px-8 border-b border-border/50 shrink-0 bg-background/80 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
            <Mail className="w-4 h-4 text-accent" />
          </div>
          <div>
            <h1 className="font-semibold text-sm">Cover Letter Generator</h1>
            <p className="text-[10px] text-muted-foreground">AI-crafted letters that get interviews</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20">
          <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          <span className="text-[11px] font-semibold text-accent">Coming Q2 2025</span>
        </div>
      </div>

      <div className="p-8 space-y-10 max-w-4xl w-full mx-auto">

        <FadeUp>
          <div className="text-center space-y-3 pt-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border/50 bg-muted/30 text-xs text-muted-foreground mb-2">
              <Sparkles className="w-3.5 h-3.5 text-accent" />
              Personalized by AI · 30 seconds to generate
            </div>
            <h2 className="text-3xl font-bold tracking-tight">Cover Letters That Actually Work</h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-sm leading-relaxed">
              Paste a job description, select your tone, and get a perfectly tailored cover letter in under 30 seconds.
            </p>
          </div>
        </FadeUp>

        {/* Feature Grid */}
        <FadeUp delay={0.1}>
          <StaggerContainer className="grid grid-cols-4 gap-4">
            {FEATURES.map((f, i) => {
              const Icon = f.icon;
              return (
                <StaggerItem key={i}>
                  <div className="p-4 rounded-2xl border border-border/50 bg-card text-center hover:border-accent/30 transition-all">
                    <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center mx-auto mb-3">
                      <Icon className="w-5 h-5 text-accent" />
                    </div>
                    <p className="text-sm font-semibold">{f.label}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{f.desc}</p>
                  </div>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </FadeUp>

        {/* Input + Output Mock */}
        <FadeUp delay={0.15}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Inputs */}
            <div className="space-y-4">
              <div className="p-5 rounded-2xl border border-border/50 bg-card">
                <div className="flex items-center gap-2 mb-3">
                  <FileText className="w-4 h-4 text-accent" />
                  <h3 className="text-sm font-semibold">Resume</h3>
                  <span className="ml-auto text-[10px] text-green-500 bg-green-500/10 px-2 py-0.5 rounded-full font-medium">Selected</span>
                </div>
                <div className="p-3 rounded-xl bg-muted/50 border border-border/50">
                  <p className="text-xs font-medium">SoftwareEngineer_Resume.pdf</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">5 years experience · Last updated today</p>
                </div>
              </div>
              <div className="p-5 rounded-2xl border border-border/50 bg-card">
                <div className="flex items-center gap-2 mb-3">
                  <Briefcase className="w-4 h-4 text-accent" />
                  <h3 className="text-sm font-semibold">Job Description</h3>
                </div>
                <textarea
                  readOnly
                  className="w-full h-28 bg-muted/50 rounded-xl px-3 py-2.5 text-xs outline-none border border-border/50 resize-none text-muted-foreground cursor-not-allowed"
                  value="Senior Software Engineer at Stripe. We're looking for engineers who are passionate about building reliable, scalable infrastructure..."
                />
              </div>
              <div className="p-5 rounded-2xl border border-border/50 bg-card">
                <div className="flex items-center gap-2 mb-3">
                  <Palette className="w-4 h-4 text-accent" />
                  <h3 className="text-sm font-semibold">Tone</h3>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {["Professional", "Confident", "Friendly", "Creative"].map((t, i) => (
                    <span key={i} className={cn("px-3 py-1 rounded-full text-xs font-medium cursor-pointer transition-colors",
                      i === 0 ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80")}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              <Button className="w-full rounded-xl gap-2">
                <Wand2 className="w-4 h-4" /> Generate Cover Letter
              </Button>
            </div>

            {/* Output Preview */}
            <div className="p-5 rounded-2xl border border-accent/30 bg-accent/5 flex flex-col">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-4 h-4 text-accent" />
                <h3 className="text-sm font-semibold text-accent">Generated Letter Preview</h3>
              </div>
              <div className="flex-1 overflow-y-auto no-scrollbar">
                <p className="text-xs text-foreground/80 leading-relaxed whitespace-pre-line">{MOCK_LETTER}</p>
              </div>
              <div className="flex gap-2 mt-4 pt-4 border-t border-border/50">
                <Button size="sm" variant="outline" className="flex-1 rounded-xl text-xs">Copy</Button>
                <Button size="sm" className="flex-1 rounded-xl text-xs">Export PDF</Button>
              </div>
            </div>
          </div>
        </FadeUp>

        {/* Roadmap */}
        <FadeUp delay={0.2}>
          <div className="p-6 rounded-3xl border border-border/50 bg-card">
            <h3 className="font-semibold mb-6 flex items-center gap-2">
              <Zap className="w-4 h-4 text-accent" /> Version Roadmap
            </h3>
            <div className="space-y-4">
              {[
                { v: "v1.0", label: "Basic AI Generation", date: "Q1 2025", done: true },
                { v: "v1.5", label: "Tone & Style Engine", date: "Q2 2025", done: false },
                { v: "v2.0", label: "Multi-language Support", date: "Q3 2025", done: false },
                { v: "v2.5", label: "LinkedIn Integration", date: "Q4 2025", done: false },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold shrink-0",
                    item.done ? "bg-accent text-white" : "bg-muted text-muted-foreground")}>
                    {item.v}
                  </div>
                  <div className="flex-1">
                    <p className={cn("text-sm font-medium", item.done ? "text-foreground" : "text-muted-foreground")}>{item.label}</p>
                    <p className="text-[10px] text-muted-foreground/60">{item.date}</p>
                  </div>
                  {item.done && <CheckCircle2 className="w-4 h-4 text-accent shrink-0" />}
                </div>
              ))}
            </div>
          </div>
        </FadeUp>
      </div>
    </div>
  );
}
