"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useInView, useSpring, useTransform } from "framer-motion";
import { Container } from "@/components/shared/Container";

function AnimatedCounter({ value, label, suffix = "" }: { value: number, label: string, suffix?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const springValue = useSpring(0, {
    stiffness: 50,
    damping: 20,
    duration: 2000,
  });
  
  const displayValue = useTransform(springValue, (current) => 
    Math.round(current).toLocaleString()
  );

  useEffect(() => {
    if (isInView) {
      springValue.set(value);
    }
  }, [isInView, value, springValue]);

  return (
    <div ref={ref} className="text-center">
      <div className="text-4xl md:text-6xl font-bold text-foreground mb-2 flex items-center justify-center">
        <motion.span>{displayValue}</motion.span>
        <span>{suffix}</span>
      </div>
      <p className="text-muted-foreground font-medium uppercase tracking-wider text-sm">{label}</p>
    </div>
  );
}

export function StatisticsSection() {
  return (
    <section className="py-24 border-y border-border/40 bg-background relative overflow-hidden">
      {/* Background patterns */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(var(--accent),0.05),transparent_50%)]"></div>

      <Container className="relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
          <AnimatedCounter value={250000} label="Projects Optimized" suffix="+" />
          <AnimatedCounter value={50} label="ATS Rules Checked" suffix="+" />
          <AnimatedCounter value={1000} label="Career Paths" suffix="+" />
          <AnimatedCounter value={98} label="Success Rate" suffix="%" />
        </div>
      </Container>
    </section>
  );
}
