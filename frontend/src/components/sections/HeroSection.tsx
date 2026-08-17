"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Container } from "@/components/shared/Container";
import { Button } from "@/components/ui/button";
import { MagneticButton } from "@/animations/MagneticButton";
import { FadeUp } from "@/animations/FadeUp";
import { FileText, Sparkles, ChevronRight } from "lucide-react";
import Link from "next/link";

interface Particle {
  x: number;
  y: number;
  animY: number;
  duration: number;
}

export function HeroSection() {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    // Generate random values only on the client to avoid SSR/CSR mismatch
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setParticles(
      Array.from({ length: 5 }, () => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        animY: Math.random() * -100 - 50,
        duration: Math.random() * 5 + 5,
      }))
    );
  }, []);

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-20 pb-32">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      
      {/* Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-accent/20 blur-[120px] rounded-full pointer-events-none"></div>

      {/* Floating Particles — rendered client-side only to avoid hydration mismatch */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((p, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-accent rounded-full opacity-30"
            initial={{ x: p.x, y: p.y }}
            animate={{
              y: [p.y, p.y + p.animY],
              opacity: [0.3, 0.8, 0],
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </div>

      <Container className="relative z-10 text-center">
        <FadeUp>
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-8 rounded-full border border-border/50 bg-background/50 backdrop-blur-sm text-sm text-muted-foreground">
            <Sparkles className="w-4 h-4 text-accent" />
            <span>AI Resume OS 2.0 is now live</span>
          </div>
        </FadeUp>
        
        <FadeUp delay={0.1}>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight max-w-4xl mx-auto mb-6 bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70">
            Build a Resume That Opens Doors.
          </h1>
        </FadeUp>

        <FadeUp delay={0.2}>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Stop guessing what recruiters want. Our AI Operating System analyzes, builds, and optimizes your resume for the modern job market.
          </p>
        </FadeUp>

        <FadeUp delay={0.3} className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <MagneticButton>
            <Link href="/builder" tabIndex={-1}>
              <Button size="lg" className="rounded-full h-14 px-8 text-base">
                Build Resume <ChevronRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </MagneticButton>
          <MagneticButton>
            <Link href="/academy" tabIndex={-1}>
              <Button variant="outline" size="lg" className="rounded-full h-14 px-8 text-base bg-background/50 backdrop-blur-sm">
                Explore Academy
              </Button>
            </Link>
          </MagneticButton>
        </FadeUp>

        {/* Animated Resume Preview Graphic */}
        <FadeUp delay={0.5} className="mt-20">
          <div className="relative mx-auto w-full max-w-4xl rounded-2xl border border-border/50 bg-background/50 backdrop-blur-xl shadow-2xl p-4 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent/0 via-accent to-accent/0 opacity-50"></div>
            <div className="flex items-center gap-2 mb-4 px-4 py-2 border-b border-border/50">
              <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
              <div className="ml-4 text-sm text-muted-foreground flex items-center gap-2">
                <FileText className="w-4 h-4" />
                resume_optimized.pdf
              </div>
            </div>
            
            {/* Abstract Resume Content */}
            <div className="p-6 grid gap-6 relative">
              {/* Header */}
              <div className="flex justify-between items-start">
                <div className="space-y-3 w-1/2">
                  <motion.div initial={{ width: 0 }} animate={{ width: "80%" }} transition={{ duration: 1, delay: 1 }} className="h-8 bg-foreground/10 rounded-md"></motion.div>
                  <motion.div initial={{ width: 0 }} animate={{ width: "60%" }} transition={{ duration: 1, delay: 1.2 }} className="h-4 bg-muted rounded-md"></motion.div>
                </div>
                <div className="space-y-2 w-1/4 flex flex-col items-end">
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }} className="h-3 w-3/4 bg-muted rounded-md"></motion.div>
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }} className="h-3 w-2/3 bg-muted rounded-md"></motion.div>
                </div>
              </div>

              {/* Body */}
              <div className="space-y-6 mt-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="space-y-3">
                    <motion.div initial={{ width: 0 }} animate={{ width: "40%" }} transition={{ duration: 0.8, delay: 1.6 + i * 0.2 }} className="h-5 bg-foreground/10 rounded-md"></motion.div>
                    <motion.div initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 0.8, delay: 1.7 + i * 0.2 }} className="h-3 bg-muted rounded-md"></motion.div>
                    <motion.div initial={{ width: 0 }} animate={{ width: "90%" }} transition={{ duration: 0.8, delay: 1.8 + i * 0.2 }} className="h-3 bg-muted rounded-md"></motion.div>
                    <motion.div initial={{ width: 0 }} animate={{ width: "95%" }} transition={{ duration: 0.8, delay: 1.9 + i * 0.2 }} className="h-3 bg-muted rounded-md"></motion.div>
                  </div>
                ))}
              </div>

              {/* Scanning Laser Effect */}
              <motion.div 
                className="absolute top-0 left-0 w-full h-[2px] bg-accent shadow-[0_0_15px_rgba(var(--accent),0.5)]"
                initial={{ top: "0%" }}
                animate={{ top: "100%" }}
                transition={{ duration: 3, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
              />
            </div>
          </div>
        </FadeUp>
      </Container>
    </section>
  );
}
