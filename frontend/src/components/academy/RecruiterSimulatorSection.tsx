"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FadeUp } from "@/animations/FadeUp";
import { Button } from "@/components/ui/button";
import { Play, Eye, BrainCircuit } from "lucide-react";
import { cn } from "@/lib/utils";

export function RecruiterSimulatorSection() {
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState(0);

  const startScan = () => {
    setIsScanning(true);
    setScanStep(0);
    
    // Simulate eye tracking sequence
    setTimeout(() => setScanStep(1), 1000); // Highlight Name/Title
    setTimeout(() => setScanStep(2), 2500); // Highlight Current Role & Dates
    setTimeout(() => setScanStep(3), 4000); // Highlight Key Metric
    setTimeout(() => setScanStep(4), 5500); // Highlight Education (Skim)
    setTimeout(() => setScanStep(5), 7000); // Done
  };

  return (
    <section id="recruiter" className="py-12 border-b border-border/50">
      <FadeUp>
        <div className="inline-block px-3 py-1 mb-6 rounded-full bg-accent/10 text-accent text-sm font-semibold tracking-wide uppercase">
          Section 9: Recruiter Perspective
        </div>
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">
          The 6-Second Simulator
        </h2>
        <p className="text-lg text-muted-foreground leading-relaxed mb-8 max-w-3xl">
          Click the button below to see exactly where a recruiter&apos;s eyes go during the initial 6-second scan.
        </p>
        
        {!isScanning || scanStep === 5 ? (
          <Button onClick={startScan} size="lg" className="rounded-full shadow-lg gap-2">
            <Play className="w-4 h-4" /> Start Eye-Tracking Scan
          </Button>
        ) : (
          <Button disabled size="lg" variant="secondary" className="rounded-full gap-2">
            <Eye className="w-4 h-4 animate-pulse" /> Scanning...
          </Button>
        )}
      </FadeUp>

      <div className="mt-12 relative w-full max-w-2xl mx-auto bg-white dark:bg-zinc-100 rounded-xl shadow-2xl p-8 border border-border">
        {/* Step 1: Name and Title */}
        <div className="flex justify-between items-start mb-8 relative">
          <div>
            <div className={cn("text-2xl font-bold text-zinc-900 transition-colors duration-500", scanStep === 1 && "bg-yellow-300/50 rounded")}>
              Jane Doe
            </div>
            <div className={cn("text-zinc-600 font-medium transition-colors duration-500", scanStep === 1 && "bg-yellow-300/50 rounded")}>
              Senior Frontend Engineer
            </div>
          </div>
          <div className="text-right text-sm text-zinc-500">
            jane@example.com | GitHub | LinkedIn
          </div>
        </div>

        {/* Step 2 & 3: Experience */}
        <div className="mb-6 relative">
          <div className="border-b-2 border-zinc-300 mb-2 font-bold text-zinc-800">EXPERIENCE</div>
          
          <div className="flex justify-between mb-2">
            <div className={cn("font-bold text-zinc-900 transition-colors duration-500", scanStep === 2 && "bg-green-300/50 rounded")}>
              Tech Corp - Senior Engineer
            </div>
            <div className={cn("text-zinc-600 font-medium transition-colors duration-500", scanStep === 2 && "bg-green-300/50 rounded")}>
              Jan 2021 - Present
            </div>
          </div>
          <ul className="list-disc pl-5 space-y-2 text-zinc-700 text-sm">
            <li className={cn("transition-colors duration-500", scanStep === 3 && "bg-blue-300/50 rounded")}>
              Spearheaded the migration to Next.js, <span className="font-bold">reducing page load time by 45%</span> and increasing conversion by 12%.
            </li>
            <li className="opacity-70">
              Mentored 3 junior developers and established automated testing protocols using Cypress.
            </li>
          </ul>
        </div>

        {/* Step 4: Education (Skim) */}
        <div className="relative">
          <div className="border-b-2 border-zinc-300 mb-2 font-bold text-zinc-800">EDUCATION</div>
          <div className="flex justify-between">
            <div className={cn("font-bold text-zinc-900 transition-colors duration-500", scanStep === 4 && "bg-zinc-300/50 rounded")}>
              State University
            </div>
            <div className="text-zinc-600 font-medium">
              2017 - 2021
            </div>
          </div>
          <div className="text-zinc-700 text-sm">B.S. in Computer Science</div>
        </div>

        {/* Overlay Explanations */}
        <AnimatePresence>
          {scanStep > 0 && scanStep < 5 && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute -right-4 -bottom-4 md:right-auto md:-left-12 top-1/2 -translate-y-1/2 bg-foreground text-background p-4 rounded-xl shadow-2xl w-64 border border-border/50 z-20"
            >
              <div className="flex items-center gap-2 mb-2 text-accent font-bold">
                <BrainCircuit className="w-4 h-4" /> Recruiter Brain
              </div>
              <p className="text-sm">
                {scanStep === 1 && "Looking for the candidate's name and their current level/title."}
                {scanStep === 2 && "Checking career trajectory. Are they currently employed? For how long?"}
                {scanStep === 3 && "Hunting for metrics. Numbers jump out and prove impact immediately."}
                {scanStep === 4 && "Briefly checking for a relevant degree, but experience matters more."}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
