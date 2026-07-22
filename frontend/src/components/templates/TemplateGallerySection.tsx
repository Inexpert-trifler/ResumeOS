"use client";

import { useMemo, useState } from "react";
import { CareerStage, TEMPLATES, Template } from "@/data/templates-data";
import { Container } from "@/components/shared/Container";
import { FadeUp } from "@/animations/FadeUp";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { Star, CheckCircle2, FileText, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TemplatePreviewModal } from "./TemplatePreviewModal";

interface TemplateGallerySectionProps {
  selectedStage: CareerStage;
  selectedRole: string;
}

export function TemplateGallerySection({ selectedStage, selectedRole }: TemplateGallerySectionProps) {
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);

  // Filter and sort logic based on stage and role
  const recommendedTemplates = useMemo(() => {
    return TEMPLATES.filter((t) => t.careerStages.includes(selectedStage))
      .sort((a, b) => b.atsScore - a.atsScore);
  }, [selectedStage]);

  return (
    <section id="gallery" className="py-24 bg-background">
      <Container>
        <div className="mb-12">
          <FadeUp>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Recommended for {selectedRole}s ({selectedStage})
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl">
              Based on thousands of successful applications, these templates offer the best balance of ATS readability and design for your specific career profile.
            </p>
          </FadeUp>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {recommendedTemplates.map((template, i) => (
            <FadeUp key={template.id} delay={i * 0.1}>
              <TemplateCard template={template} onPreview={() => setPreviewTemplate(template)} />
            </FadeUp>
          ))}
          
          {recommendedTemplates.length === 0 && (
            <div className="col-span-full py-12 text-center text-muted-foreground">
              No specific recommendations for this exact combination yet. Try a different stage!
            </div>
          )}
        </div>
      </Container>

      {/* Preview Modal */}
      {previewTemplate && (
        <TemplatePreviewModal 
          template={previewTemplate} 
          isOpen={!!previewTemplate} 
          onClose={() => setPreviewTemplate(null)} 
        />
      )}
    </section>
  );
}

// Interactive 3D Card
function TemplateCard({ template, onPreview }: { template: Template, onPreview: () => void }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const target = e.currentTarget;
    const { left, top, width, height } = target.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;
    // Calculate rotation (-5 to 5 degrees)
    const rotateX = ((y - height / 2) / height) * -10;
    const rotateY = ((x - width / 2) / width) * 10;
    
    mouseX.set(x);
    mouseY.set(y);
    target.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
  }

  function handleMouseLeave(e: React.MouseEvent<HTMLDivElement>) {
    e.currentTarget.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
  }

  return (
    <div 
      className="group relative bg-card border border-border/50 rounded-2xl overflow-hidden shadow-sm transition-all duration-300"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transition: "transform 0.1s ease-out" }}
    >
      {/* Magnetic Glow Effect */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              600px circle at ${mouseX}px ${mouseY}px,
              rgba(var(--accent-rgb), 0.1),
              transparent 40%
            )
          `,
        }}
      />

      <div className="p-6">
        {/* Mockup Preview Area */}
        <div className="aspect-[1/1.2] bg-muted/30 rounded-xl mb-6 relative overflow-hidden flex items-center justify-center border border-border/50 group-hover:border-accent/30 transition-colors">
          {/* Skeleton Mockup */}
          <div className="w-[70%] h-[80%] bg-background shadow-md rounded p-4 flex flex-col gap-2">
            <div className="w-1/2 h-3 bg-muted rounded mb-2" />
            <div className="w-full h-1 bg-muted rounded" />
            <div className="w-5/6 h-1 bg-muted rounded" />
            <div className="w-full h-1 bg-muted rounded mb-4" />
            <div className="w-1/3 h-2 bg-muted rounded mb-1" />
            <div className="w-full h-1 bg-muted rounded" />
            <div className="w-full h-1 bg-muted rounded" />
          </div>

          {/* Overlay Actions */}
          <div className="absolute inset-0 bg-background/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <Button onClick={onPreview} variant="default" className="rounded-full shadow-lg">
              Preview
            </Button>
          </div>
        </div>

        {/* Card Data */}
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-xl">{template.name}</h3>
          <div className="flex items-center gap-1 text-sm font-medium text-accent bg-accent/10 px-2 py-0.5 rounded-md">
            <Star className="w-3 h-3 fill-current" /> {template.atsScore} ATS
          </div>
        </div>
        
        <p className="text-sm text-muted-foreground mb-4">
          Category: <span className="text-foreground font-medium">{template.category}</span>
        </p>

        <div className="grid grid-cols-2 gap-y-2 text-sm mb-6">
          <div className="flex items-center gap-2 text-muted-foreground">
            <FileText className="w-4 h-4" /> {template.pages}
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <CheckCircle2 className="w-4 h-4 text-green-500" /> Recruiter Pick
          </div>
        </div>

        <Button onClick={onPreview} className="w-full rounded-xl gap-2" variant="secondary">
          View Details <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
