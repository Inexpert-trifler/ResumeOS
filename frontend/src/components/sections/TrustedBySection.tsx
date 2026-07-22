"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/shared/Container";

const LOGOS = [
  "Acme Corp", "GlobalTech", "Nexus", "Quantum", "Apex", "Stellar",
  "Acme Corp", "GlobalTech", "Nexus", "Quantum", "Apex", "Stellar"
];

export function TrustedBySection() {
  return (
    <section className="py-24 border-t border-border/40 overflow-hidden bg-background">
      <Container className="text-center mb-10">
        <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest">
          Trusted by candidates at top companies
        </p>
      </Container>
      
      <div className="relative flex overflow-hidden">
        {/* Left Gradient Mask */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10"></div>
        
        {/* Right Gradient Mask */}
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10"></div>

        <motion.div
          className="flex whitespace-nowrap gap-16 items-center pr-16"
          animate={{
            x: ["0%", "-50%"]
          }}
          transition={{
            ease: "linear",
            duration: 20,
            repeat: Infinity,
          }}
        >
          {LOGOS.map((logo, i) => (
            <div key={i} className="flex items-center justify-center opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300">
              <span className="text-2xl font-bold font-sans text-foreground/80">
                {logo}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
