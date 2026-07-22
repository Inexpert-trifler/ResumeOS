"use client";

import { motion } from "framer-motion";
import { FadeUp } from "@/animations/FadeUp";
import { Database, Search, ArrowRight } from "lucide-react";

export function ATSVisualizationSection() {
  return (
    <section id="ats" className="py-12 border-b border-border/50">
      <FadeUp>
        <div className="inline-block px-3 py-1 mb-6 rounded-full bg-accent/10 text-accent text-sm font-semibold tracking-wide uppercase">
          Section 5: Demystifying The ATS
        </div>
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">
          How Applicant Tracking Systems Work
        </h2>
        <p className="text-lg text-muted-foreground leading-relaxed mb-12 max-w-3xl">
          An ATS (Applicant Tracking System) is a software application that enables the electronic handling of recruitment needs. It parses your beautiful PDF into raw, unformatted text. If your formatting is too complex, the ATS spits out gibberish.
        </p>
      </FadeUp>

      <div className="bg-muted/30 rounded-3xl p-8 md:p-12 border border-border/50 relative overflow-hidden">
        {/* Animated Scanner Laser */}
        <motion.div 
          className="absolute top-0 bottom-0 w-1 bg-accent/50 shadow-[0_0_20px_rgba(var(--accent),0.8)] z-20"
          animate={{
            left: ["0%", "100%", "0%"]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear"
          }}
        />

        <div className="grid md:grid-cols-2 gap-12 relative z-10">
          {/* What You See */}
          <div className="bg-background rounded-xl p-6 border border-border shadow-lg">
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-border/50">
              <h3 className="font-bold flex items-center gap-2">
                <Search className="w-5 h-5 text-accent" /> What You See
              </h3>
            </div>
            
            {/* Visual Resume Mockup */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-lg">John Doe</h4>
                  <p className="text-sm text-accent">Software Engineer</p>
                </div>
                <div className="text-right text-xs text-muted-foreground">
                  <p>john@example.com</p>
                  <p>123-456-7890</p>
                </div>
              </div>
              
              <div className="mt-4">
                <div className="flex gap-2 mb-2">
                  <div className="px-2 py-1 bg-muted rounded text-xs">React</div>
                  <div className="px-2 py-1 bg-muted rounded text-xs">Node.js</div>
                  <div className="px-2 py-1 bg-muted rounded text-xs">Python</div>
                </div>
              </div>
              
              {/* Complex Table (ATS Nightmare) */}
              <div className="mt-4 border border-border rounded overflow-hidden">
                <div className="grid grid-cols-2 bg-muted text-xs font-bold p-2">
                  <div>Company</div>
                  <div>Role</div>
                </div>
                <div className="grid grid-cols-2 text-xs p-2">
                  <div>Tech Corp</div>
                  <div>Developer</div>
                </div>
              </div>
            </div>
          </div>

          <div className="hidden md:flex items-center justify-center absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-30">
            <div className="w-10 h-10 bg-accent text-accent-foreground rounded-full flex items-center justify-center shadow-lg">
              <ArrowRight className="w-5 h-5" />
            </div>
          </div>

          {/* What ATS Sees */}
          <div className="bg-zinc-950 text-green-400 font-mono rounded-xl p-6 border border-zinc-800 shadow-lg relative overflow-hidden">
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-zinc-800">
              <h3 className="font-bold flex items-center gap-2 text-white">
                <Database className="w-5 h-5 text-green-400" /> What ATS Parses
              </h3>
            </div>
            
            {/* Raw Text Mockup */}
            <div className="text-xs space-y-2 opacity-80">
              <p>{`{ "name": "John Doe", "email": "john@example.com" }`}</p>
              <p>SKILLS_BLOCK_START</p>
              <p>React Node.js Python</p>
              <p>SKILLS_BLOCK_END</p>
              <p className="text-red-400">ERROR_PARSING_TABLE: "CompanyRoleTech CorpDeveloper"</p>
              <p className="text-muted-foreground mt-4 pt-4 border-t border-zinc-800 border-dashed">
                // Notice how the table data merged together because ATS reads left-to-right, top-to-bottom, ignoring visual columns.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6 mt-12">
        <div className="bg-card p-6 rounded-2xl border border-border/50 shadow-sm">
          <h4 className="font-bold mb-4">ATS Safe Practices ✅</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Use standard section headers (Experience, Education, Skills)</li>
            <li>• Use standard bullet points (round or square)</li>
            <li>• Save as PDF or DOCX (check job listing requirements)</li>
            <li>• Include exact keywords from the job description</li>
          </ul>
        </div>
        <div className="bg-destructive/5 p-6 rounded-2xl border border-destructive/20 shadow-sm">
          <h4 className="font-bold mb-4 text-destructive">ATS Killers ❌</h4>
          <ul className="space-y-2 text-sm text-foreground/80">
            <li>• Multi-column layouts (reads left to right across columns)</li>
            <li>• Tables and Text Boxes</li>
            <li>• Header/Footer sections in Word (often ignored)</li>
            <li>• Infographics, skill bars, and unusual fonts</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
