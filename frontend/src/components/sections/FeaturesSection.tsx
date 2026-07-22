"use client";

import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { 
  Bot, BookOpen, Activity, CheckSquare, Layers, FileText, 
  Video, Edit3, AlignLeft, Settings, Search, FileSignature
} from "lucide-react";
import { MouseEvent } from "react";

const FEATURES = [
  { icon: Bot, title: "AI Resume Builder", desc: "Build tailored resumes instantly using advanced AI." },
  { icon: BookOpen, title: "Resume Academy", desc: "Learn the secrets of top tech recruiters." },
  { icon: Activity, title: "ATS Checker", desc: "Score your resume against applicant tracking systems." },
  { icon: CheckSquare, title: "Resume Analyzer", desc: "Get line-by-line feedback on your bullet points." },
  { icon: Layers, title: "Job Role Library", desc: "Explore requirements for 1000+ tech roles." },
  { icon: FileText, title: "Resume Templates", desc: "Modern, ATS-friendly designs that stand out." },
  { icon: Video, title: "Interview Preparation", desc: "Mock interviews based on your specific resume." },
  { icon: Edit3, title: "AI Project Writer", desc: "Turn simple side projects into impressive bullet points." },
  { icon: AlignLeft, title: "AI Summary Generator", desc: "Craft the perfect professional summary." },
  { icon: Settings, title: "AI Resume Optimizer", desc: "Re-write entire sections to sound more professional." },
  { icon: Search, title: "Keyword Matcher", desc: "Find missing keywords from job descriptions." },
  { icon: FileSignature, title: "Cover Letter Generator", desc: "Coming soon. One-click personalized cover letters." },
];

function FeatureCard({ feature }: { feature: typeof FEATURES[0] }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({
    currentTarget,
    clientX,
    clientY,
  }: MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="group relative flex flex-col items-start gap-4 rounded-2xl border border-border/50 bg-card p-6 shadow-sm overflow-hidden"
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              300px circle at ${mouseX}px ${mouseY}px,
              rgba(var(--accent), 0.15),
              transparent 80%
            )
          `,
        }}
      />
      <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-xl border border-border/50 bg-background shadow-sm">
        <feature.icon className="h-6 w-6 text-foreground/80 group-hover:text-accent transition-colors" />
      </div>
      <div className="relative z-10">
        <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
      </div>
    </motion.div>
  );
}

export function FeaturesSection() {
  return (
    <section className="py-24 bg-muted/30">
      <Container>
        <SectionHeading
          title="Everything You Need to Succeed"
          description="A powerful suite of tools designed to elevate your career."
          align="center"
          className="mb-16"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
            >
              <FeatureCard feature={feature} />
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
