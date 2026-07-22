"use client";

import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { StaggerContainer, StaggerItem } from "@/animations/StaggerAnimation";
import { HoverLift } from "@/animations/HoverLift";
import { GlassCard } from "@/components/shared/GlassCard";
import { XCircle } from "lucide-react";

const PROBLEMS = [
  { title: "Generic AI Writing", description: "Sounds like a robot wrote it. Recruiters spot this instantly." },
  { title: "Same Resume For Everyone", description: "Templates that make you look exactly like the other 500 applicants." },
  { title: "Doesn't Teach You", description: "It builds the resume but doesn't explain WHY certain words work." },
  { title: "Weak ATS Optimization", description: "Fails to parse correctly in Workday, Greenhouse, or Lever." },
  { title: "No Recruiter Perspective", description: "Written by software engineers, not hiring managers." },
  { title: "No Interview Preparation", description: "Leaves you stranded once you actually get the callback." },
];

export function ProblemSection() {
  return (
    <section className="py-24 relative overflow-hidden bg-background">
      {/* Background flare */}
      <div className="absolute right-0 top-0 w-[500px] h-[500px] bg-destructive/10 blur-[100px] rounded-full pointer-events-none translate-x-1/2 -translate-y-1/2"></div>
      
      <Container>
        <SectionHeading
          title="Today's Resume Builders Aren't Enough"
          description="The old way of building resumes is broken. Traditional tools just reformat bad content."
          align="center"
          className="mb-16"
        />

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PROBLEMS.map((problem, i) => (
            <StaggerItem key={i}>
              <HoverLift>
                <GlassCard className="h-full border-destructive/20 hover:border-destructive/50 transition-colors group relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 group-hover:rotate-12">
                    <XCircle className="w-24 h-24 text-destructive" />
                  </div>
                  <div className="relative z-10 flex flex-col gap-4">
                    <div className="w-12 h-12 rounded-xl bg-destructive/10 flex items-center justify-center">
                      <XCircle className="w-6 h-6 text-destructive" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">{problem.title}</h3>
                      <p className="text-muted-foreground">{problem.description}</p>
                    </div>
                  </div>
                </GlassCard>
              </HoverLift>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </Container>
    </section>
  );
}
