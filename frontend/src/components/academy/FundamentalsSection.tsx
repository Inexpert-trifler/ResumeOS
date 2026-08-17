"use client";

import { FadeUp } from "@/animations/FadeUp";
import { CheckCircle2, XCircle } from "lucide-react";

export function FundamentalsSection() {
  return (
    <section id="fundamentals" className="py-12 border-b border-border/50">
      <FadeUp>
        <div className="inline-block px-3 py-1 mb-6 rounded-full bg-accent/10 text-accent text-sm font-semibold tracking-wide uppercase">
          Section 2: Resume Fundamentals
        </div>
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">
          The Golden Rules of Formatting
        </h2>
        <p className="text-lg text-muted-foreground leading-relaxed mb-12 max-w-3xl">
          Before writing a single bullet point, you need the right canvas. Poor formatting is the #1 reason qualified candidates are rejected by both ATS and humans.
        </p>
      </FadeUp>

      <div className="grid md:grid-cols-2 gap-8">
        <FadeUp delay={0.1}>
          <div className="bg-card border border-border/50 rounded-2xl p-6 h-full shadow-sm hover:border-accent/30 transition-colors">
            <h3 className="font-semibold text-xl mb-4 border-b border-border/50 pb-2">Fonts & Typography</h3>
            <div className="space-y-4">
              <div className="flex gap-3 items-start">
                <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Use Standard Sans-Serif Fonts</p>
                  <p className="text-sm text-muted-foreground">Arial, Calibri, Helvetica, or modern clean fonts like Inter/Roboto. Keep size between 10pt and 12pt.</p>
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <XCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Avoid Fancy or Multiple Fonts</p>
                  <p className="text-sm text-muted-foreground">Never use cursive, comic sans, or mix more than 2 font families. It hurts readability and ATS parsing.</p>
                </div>
              </div>
            </div>
          </div>
        </FadeUp>

        <FadeUp delay={0.2}>
          <div className="bg-card border border-border/50 rounded-2xl p-6 h-full shadow-sm hover:border-accent/30 transition-colors">
            <h3 className="font-semibold text-xl mb-4 border-b border-border/50 pb-2">Margins & Spacing</h3>
            <div className="space-y-4">
              <div className="flex gap-3 items-start">
                <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Standard Margins (0.5&quot; to 1&quot;)</p>
                  <p className="text-sm text-muted-foreground">Give your text room to breathe. Use consistent line spacing (1.15 is ideal).</p>
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <XCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Cramming Text</p>
                  <p className="text-sm text-muted-foreground">Reducing margins below 0.5&quot; to fit more text creates a &quot;wall of text&quot; that recruiters will skip entirely.</p>
                </div>
              </div>
            </div>
          </div>
        </FadeUp>

        <FadeUp delay={0.3}>
          <div className="bg-card border border-border/50 rounded-2xl p-6 h-full shadow-sm hover:border-accent/30 transition-colors">
            <h3 className="font-semibold text-xl mb-4 border-b border-border/50 pb-2">Design & Colors</h3>
            <div className="space-y-4">
              <div className="flex gap-3 items-start">
                <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Black & White (with subtle accents)</p>
                  <p className="text-sm text-muted-foreground">A clean, black text resume is always safe. A single dark accent color (like navy blue) for headers is acceptable.</p>
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <XCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Graphics, Photos & Skill Bars</p>
                  <p className="text-sm text-muted-foreground">In US/Tech/Corporate, NEVER include a headshot. Do not use 5-star skill bars&mdash;they are subjective and break ATS.</p>
                </div>
              </div>
            </div>
          </div>
        </FadeUp>

        <FadeUp delay={0.4}>
          <div className="bg-card border border-border/50 rounded-2xl p-6 h-full shadow-sm hover:border-accent/30 transition-colors">
            <h3 className="font-semibold text-xl mb-4 border-b border-border/50 pb-2">File Format</h3>
            <div className="space-y-4">
              <div className="flex gap-3 items-start">
                <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Always Submit PDF</p>
                  <p className="text-sm text-muted-foreground">PDFs freeze your formatting exactly as you designed it across all devices and OS.</p>
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <XCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Word Documents (.docx)</p>
                  <p className="text-sm text-muted-foreground">Only submit a Word document if the job application explicitly forces you to. Formatting can break on the recruiter&apos;s machine.</p>
                </div>
              </div>
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
