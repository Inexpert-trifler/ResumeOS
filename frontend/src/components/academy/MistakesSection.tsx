"use client";

import { FadeUp } from "@/animations/FadeUp";
import { ArrowRight, AlertTriangle, ShieldCheck } from "lucide-react";

const MISTAKES = [
  { wrong: "Developed an app using React.", right: "Developed a responsive web app using React, reducing load times by 20%." },
  { wrong: "Managed a team of 5 people.", right: "Managed a 5-person engineering team, delivering 3 major releases ahead of schedule." },
  { wrong: "Responsible for fixing bugs.", right: "Resolved 50+ critical bugs, improving overall system stability by 15%." },
  { wrong: "Hardworking team player.", right: "Collaborated with cross-functional teams to launch XYZ feature." },
  { wrong: "Proficient in Microsoft Word.", right: "(Remove entirely, it's expected in 2024)" },
  { wrong: "GPA: 2.8 / 4.0", right: "(Remove GPA if it's below 3.5)" }
];

export function MistakesSection() {
  return (
    <section id="mistakes" className="py-12 border-b border-border/50">
      <FadeUp>
        <div className="inline-block px-3 py-1 mb-6 rounded-full bg-accent/10 text-accent text-sm font-semibold tracking-wide uppercase">
          Section 6: Common Mistakes
        </div>
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">
          Fix These Before You Apply
        </h2>
        <p className="text-lg text-muted-foreground leading-relaxed mb-12 max-w-3xl">
          Recruiters see the same 10 mistakes on 90% of resumes. By fixing these, you automatically put yourself in the top 10% of applicants.
        </p>
      </FadeUp>

      <div className="grid lg:grid-cols-2 gap-6">
        {MISTAKES.map((item, i) => (
          <FadeUp key={i} delay={i * 0.1}>
            <div className="flex flex-col sm:flex-row items-stretch gap-2 bg-card rounded-xl p-2 border border-border/50 shadow-sm h-full group hover:border-accent/30 transition-colors">
              <div className="flex-1 bg-destructive/5 rounded-lg p-4 border border-destructive/10 relative">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-4 h-4 text-destructive" />
                  <span className="text-xs font-bold text-destructive uppercase tracking-wider">Mistake</span>
                </div>
                <p className="text-sm text-foreground/80">{item.wrong}</p>
              </div>
              
              <div className="hidden sm:flex items-center justify-center px-2">
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-accent transition-colors" />
              </div>
              <div className="flex sm:hidden items-center justify-center py-2">
                <ArrowRight className="w-4 h-4 text-muted-foreground rotate-90" />
              </div>

              <div className="flex-1 bg-green-500/5 rounded-lg p-4 border border-green-500/10 relative">
                <div className="flex items-center gap-2 mb-2">
                  <ShieldCheck className="w-4 h-4 text-green-500" />
                  <span className="text-xs font-bold text-green-600 dark:text-green-400 uppercase tracking-wider">Correction</span>
                </div>
                <p className="text-sm font-medium text-foreground">{item.right}</p>
              </div>
            </div>
          </FadeUp>
        ))}
      </div>
    </section>
  );
}
