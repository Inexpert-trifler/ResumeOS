"use client";

import { Container } from "@/components/shared/Container";
import { Button } from "@/components/ui/button";
import { MagneticButton } from "@/animations/MagneticButton";
import { FadeUp } from "@/animations/FadeUp";
import { ChevronRight } from "lucide-react";

export function FinalCtaSection() {
  return (
    <section className="py-32 relative overflow-hidden bg-background">
      {/* Background dynamic gradient */}
      <div className="absolute inset-0 bg-zinc-950/5 dark:bg-zinc-900/50"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-accent/20 blur-[120px] rounded-full pointer-events-none mix-blend-screen"></div>

      <Container className="relative z-10 text-center">
        <FadeUp>
          <h2 className="text-5xl md:text-7xl font-bold tracking-tight max-w-4xl mx-auto mb-8 bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/50">
            Ready To Build Your Best Resume?
          </h2>
        </FadeUp>

        <FadeUp delay={0.1}>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-12">
            Join the top 1% of candidates. Stop letting bad formatting and generic advice hold you back from your dream role.
          </p>
        </FadeUp>

        <FadeUp delay={0.2} className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <MagneticButton>
            <Button size="lg" className="rounded-full h-14 px-8 text-base shadow-[0_0_40px_rgba(var(--accent),0.4)] hover:shadow-[0_0_60px_rgba(var(--accent),0.6)] transition-shadow">
              Start Building <ChevronRight className="ml-2 w-4 h-4" />
            </Button>
          </MagneticButton>
          <MagneticButton>
            <Button variant="outline" size="lg" className="rounded-full h-14 px-8 text-base bg-background/50 backdrop-blur-sm border-border/50">
              Explore Resume Academy
            </Button>
          </MagneticButton>
        </FadeUp>
      </Container>
    </section>
  );
}
