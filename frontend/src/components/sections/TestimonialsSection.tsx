"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { GlassCard } from "@/components/shared/GlassCard";
import { Star } from "lucide-react";

const TESTIMONIALS = [
  { name: "Sarah J.", role: "Product Designer @ Apple", text: "The AI didn't just format my resume, it taught me how to talk about my impact. I got 3 offers within a month." },
  { name: "Michael T.", role: "Senior Engineer @ Stripe", text: "I was skeptical, but the ATS analysis caught so many missing keywords. This is a game changer for tech roles." },
  { name: "Elena R.", role: "Marketing Director @ Notion", text: "The most beautiful resume builder I've ever used. The AI suggestions were spot on for my industry." },
  { name: "David L.", role: "Data Scientist @ Google", text: "It turned my messy list of projects into a cohesive narrative that recruiters actually wanted to read." },
  { name: "Sarah J.", role: "Product Designer @ Apple", text: "The AI didn't just format my resume, it taught me how to talk about my impact. I got 3 offers within a month." },
  { name: "Michael T.", role: "Senior Engineer @ Stripe", text: "I was skeptical, but the ATS analysis caught so many missing keywords. This is a game changer for tech roles." },
];

export function TestimonialsSection() {
  return (
    <section className="py-24 bg-muted/30 overflow-hidden">
      <Container className="mb-12">
        <SectionHeading
          title="Loved By Top Talent"
          description="Join thousands of professionals landing their dream jobs."
          align="center"
        />
      </Container>

      <div className="relative flex overflow-hidden py-4">
        {/* Left Gradient Mask */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-muted/30 to-transparent z-10"></div>
        
        {/* Right Gradient Mask */}
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-muted/30 to-transparent z-10"></div>

        <motion.div
          className="flex gap-6 pr-6"
          animate={{
            x: ["0%", "-50%"]
          }}
          transition={{
            ease: "linear",
            duration: 30,
            repeat: Infinity,
          }}
        >
          {TESTIMONIALS.map((testimonial, i) => (
            <GlassCard key={i} className="w-[400px] shrink-0 p-8 flex flex-col gap-6 border-border/50 hover:border-accent/30 transition-colors">
              <div className="flex gap-1 text-yellow-500">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
              </div>
              <p className="text-foreground/90 text-lg leading-relaxed flex-grow">
                "{testimonial.text}"
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center font-bold text-muted-foreground">
                  {testimonial.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-semibold">{testimonial.name}</h4>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            </GlassCard>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
