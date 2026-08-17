"use client";

import { motion } from "framer-motion";
import { FadeUp } from "@/animations/FadeUp";
import { FileText, Clock, Target } from "lucide-react";

export function IntroductionSection() {
  return (
    <section id="intro" className="py-12 border-b border-border/50">
      <FadeUp>
        <div className="inline-block px-3 py-1 mb-6 rounded-full bg-accent/10 text-accent text-sm font-semibold tracking-wide uppercase">
          Section 1: Introduction
        </div>
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
          The Anatomy of a Winning Resume
        </h2>
        <p className="text-lg text-muted-foreground leading-relaxed mb-12 max-w-3xl">
          Your resume is not an autobiography. It is a highly targeted marketing document designed to do exactly one thing: get you an interview. Let&apos;s break down how recruiters actually read them.
        </p>
      </FadeUp>

      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <FadeUp delay={0.1}>
          <div className="bg-card border border-border/50 rounded-2xl p-6 h-full shadow-sm hover:border-accent/30 transition-colors">
            <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mb-4">
              <FileText className="text-accent w-6 h-6" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Resume vs CV</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              A CV is a comprehensive record of your academic and professional history (common in Europe/Academia). A Resume is a tailored 1-2 page summary for a specific job (common in US/Tech).
            </p>
          </div>
        </FadeUp>

        <FadeUp delay={0.2}>
          <div className="bg-card border border-border/50 rounded-2xl p-6 h-full shadow-sm hover:border-accent/30 transition-colors relative overflow-hidden">
            <div className="absolute -right-4 -bottom-4 opacity-5">
              <Clock className="w-48 h-48" />
            </div>
            <div className="w-12 h-12 bg-destructive/10 rounded-xl flex items-center justify-center mb-4 relative z-10">
              <Clock className="text-destructive w-6 h-6" />
            </div>
            <h3 className="font-semibold text-lg mb-2 relative z-10">The 6-Second Rule</h3>
            <p className="text-muted-foreground text-sm leading-relaxed relative z-10">
              On average, recruiters spend only 6 to 8 seconds scanning a resume before deciding to read further or reject it. Visual hierarchy is critical.
            </p>
          </div>
        </FadeUp>

        <FadeUp delay={0.3}>
          <div className="bg-card border border-border/50 rounded-2xl p-6 h-full shadow-sm hover:border-accent/30 transition-colors">
            <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center mb-4">
              <Target className="text-green-500 w-6 h-6" />
            </div>
            <h3 className="font-semibold text-lg mb-2">The Ultimate Goal</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Your resume&apos;s only job is to prove you can solve the employer&apos;s problems. It should scream &quot;I have done exactly what you need&quot; within the first glance.
            </p>
          </div>
        </FadeUp>
      </div>
      
      {/* 6-Second Scan Visualization */}
      <FadeUp delay={0.4} className="mt-16 bg-muted/30 rounded-2xl p-8 border border-border/50 text-center relative overflow-hidden">
        <h3 className="text-xl font-bold mb-4 z-10 relative">Recruiter Eye Tracking (F-Pattern)</h3>
        <p className="text-muted-foreground mb-8 max-w-2xl mx-auto z-10 relative">
          Studies show recruiters read in an F-shaped pattern, focusing heavily on the top left and skimming down the left margin.
        </p>
        
        <div className="relative w-full max-w-md mx-auto h-64 bg-background border border-border/50 rounded-lg shadow-sm p-4 text-left overflow-hidden">
          {/* Mock text lines */}
          <div className="w-3/4 h-6 bg-foreground/20 rounded mb-4"></div>
          <div className="w-full h-2 bg-muted rounded mb-2"></div>
          <div className="w-5/6 h-2 bg-muted rounded mb-6"></div>
          
          <div className="w-1/2 h-4 bg-foreground/20 rounded mb-4"></div>
          <div className="w-full h-2 bg-muted rounded mb-2"></div>
          <div className="w-4/5 h-2 bg-muted rounded mb-2"></div>
          <div className="w-full h-2 bg-muted rounded mb-6"></div>
          
          <div className="w-1/3 h-4 bg-foreground/20 rounded mb-4"></div>
          <div className="w-full h-2 bg-muted rounded mb-2"></div>

          {/* Animated Heatmap Overlay */}
          <motion.div 
            className="absolute top-0 left-0 w-32 h-32 bg-red-500/20 blur-2xl rounded-full mix-blend-multiply dark:mix-blend-screen"
            animate={{
              x: [0, 200, 0, 0, 150, 0, 0],
              y: [0, 0, 0, 80, 80, 80, 160],
              scale: [1, 1.5, 1, 1.2, 1, 1, 1]
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>
      </FadeUp>
    </section>
  );
}
