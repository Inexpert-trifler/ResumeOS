"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/shared/Container";
import { FadeUp } from "@/animations/FadeUp";
import { ArrowRight, FileText } from "lucide-react";
import Link from "next/link";

// Pre-seeded paper positions — fixed so SSR and CSR always match
const PAPER_POSITIONS = [
  { top: "5%",  left: "5%" },
  { top: "10%", left: "55%" },
  { top: "40%", left: "20%" },
  { top: "45%", left: "65%" },
  { top: "70%", left: "10%" },
  { top: "65%", left: "50%" },
];

export function TemplatesHeroSection() {
  return (
    <section className="relative pt-24 pb-32 overflow-hidden bg-background">
      {/* Background Animated Stacks */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center opacity-30 dark:opacity-20">
        <motion.div 
          className="relative w-full max-w-5xl aspect-video"
          animate={{ rotate: 5, scale: 1.05 }}
          transition={{ duration: 20, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
        >
          {/* Floating Papers — positions pre-seeded to avoid SSR/CSR mismatch */}
          {PAPER_POSITIONS.map((pos, i) => (
            <motion.div
              key={i}
              className="absolute bg-card border border-border shadow-2xl rounded-lg w-64 h-96 flex flex-col p-4"
              style={{
                top: pos.top,
                left: pos.left,
                zIndex: i,
              }}
              animate={{
                y: [0, -30, 0],
                x: [0, 20, 0],
                rotate: [i * 10 - 20, i * 15 - 15, i * 10 - 20],
              }}
              transition={{
                duration: 10 + i * 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <div className="w-full h-4 bg-muted rounded mb-4" />
              <div className="w-3/4 h-2 bg-muted/50 rounded mb-2" />
              <div className="w-1/2 h-2 bg-muted/50 rounded mb-8" />
              <div className="w-full h-2 bg-muted/30 rounded mb-2" />
              <div className="w-full h-2 bg-muted/30 rounded mb-2" />
              <div className="w-4/5 h-2 bg-muted/30 rounded mb-2" />
            </motion.div>
          ))}
        </motion.div>
      </div>

      <Container className="relative z-10 text-center">
        <FadeUp>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-sm font-medium mb-6">
            <FileText className="w-4 h-4" /> Template Studio
          </div>
        </FadeUp>
        
        <FadeUp delay={0.1}>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8">
            Choose The Right Template,<br />
            <span className="text-muted-foreground">Not Just A Beautiful One.</span>
          </h1>
        </FadeUp>

        <FadeUp delay={0.2}>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-12">
            Every career stage demands a different layout. Select your experience level and role below to discover the perfect ATS-friendly resume for your next leap.
          </p>
        </FadeUp>

        <FadeUp delay={0.3} className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a 
            href="#gallery"
            className="inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-14 px-8 rounded-full text-lg"
          >
            Browse Templates <ArrowRight className="ml-2 w-5 h-5" />
          </a>
          <Link 
            href="/academy"
            className="inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-14 px-8 rounded-full text-lg"
          >
            Explore Resume Academy
          </Link>
        </FadeUp>
      </Container>
    </section>
  );
}
