"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Target, BookOpen, MessageSquare, FileText, Activity, Users, Video, Download } from "lucide-react";

const STEPS = [
  { icon: Target, title: "Choose Career Goal", desc: "Select your target role and industry." },
  { icon: BookOpen, title: "Learn Resume Strategy", desc: "Understand what top companies are looking for." },
  { icon: MessageSquare, title: "AI Asks Smart Questions", desc: "No more blank pages. We interview you." },
  { icon: FileText, title: "Professional Resume Generated", desc: "Instant, beautifully formatted output." },
  { icon: Activity, title: "ATS Analysis", desc: "Check your resume against 50+ ATS rules." },
  { icon: Users, title: "Recruiter Feedback", desc: "AI simulates a hiring manager's review." },
  { icon: Video, title: "Mock Interview", desc: "Practice answering questions based on your resume." },
  { icon: Download, title: "Download & Apply", desc: "Export as PDF and start landing interviews." },
];

export function WorkflowSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  });

  return (
    <section className="py-24 bg-background overflow-hidden relative" ref={containerRef}>
      <Container>
        <SectionHeading
          title="How It Works"
          description="A complete end-to-end workflow to land your dream job."
          align="center"
          className="mb-20"
        />

        <div className="max-w-3xl mx-auto relative">
          {/* Vertical Line */}
          <div className="absolute left-[28px] md:left-1/2 top-0 bottom-0 w-[2px] bg-border transform md:-translate-x-1/2"></div>
          
          {/* Animated Line Fill */}
          <motion.div 
            className="absolute left-[28px] md:left-1/2 top-0 bottom-0 w-[2px] bg-accent transform md:-translate-x-1/2 origin-top"
            style={{ scaleY: scrollYProgress }}
          ></motion.div>

          {STEPS.map((step, i) => {
            const isEven = i % 2 === 0;
            return (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5 }}
                className={`relative flex items-center mb-12 ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} flex-row`}
              >
                {/* Connector Dot */}
                <div className="absolute left-[28px] md:left-1/2 w-4 h-4 rounded-full bg-background border-2 border-accent transform -translate-x-1/2 z-10"></div>
                
                {/* Content Card */}
                <div className={`ml-16 md:ml-0 md:w-1/2 flex ${isEven ? 'md:justify-end md:pr-12' : 'md:justify-start md:pl-12'} w-full`}>
                  <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow w-full max-w-sm">
                    <div className="flex items-center gap-4 mb-3">
                      <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                        <step.icon className="w-5 h-5 text-accent" />
                      </div>
                      <h4 className="font-semibold text-lg">Step {i + 1}: {step.title}</h4>
                    </div>
                    <p className="text-muted-foreground text-sm ml-14">
                      {step.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
