"use client";

import { useState, useRef, useEffect } from "react";
import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { MoveHorizontal } from "lucide-react";

export function BeforeAfterSection() {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = (x / rect.width) * 100;
    setSliderPosition(percent);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    handleMove(e.touches[0].clientX);
  };

  useEffect(() => {
    const handleMouseUp = () => setIsDragging(false);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("touchend", handleMouseUp);
    return () => {
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchend", handleMouseUp);
    };
  }, []);

  return (
    <section className="py-24 bg-zinc-50 dark:bg-zinc-950/50">
      <Container>
        <SectionHeading
          title="See The Difference"
          description="Slide to see how our AI transforms a standard bullet point into a recruiter-magnet."
          align="center"
          className="mb-16"
        />

        <div className="max-w-4xl mx-auto relative select-none rounded-2xl overflow-hidden border border-border/50 shadow-2xl h-[400px]"
             ref={containerRef}
             onMouseMove={handleMouseMove}
             onTouchMove={handleTouchMove}
             onMouseLeave={() => setIsDragging(false)}
        >
          {/* Old Resume (Background) */}
          <div className="absolute inset-0 bg-background p-8 md:p-12 flex flex-col justify-center">
            <div className="inline-block px-3 py-1 bg-destructive/10 text-destructive text-sm rounded-full mb-6 font-medium w-max">
              Original Resume
            </div>
            <h4 className="text-xl font-bold mb-4">Software Engineer</h4>
            <ul className="list-disc pl-5 space-y-4 text-muted-foreground">
              <li>Worked on the backend API for the main product.</li>
              <li>Fixed bugs and improved performance of the database.</li>
              <li>Collaborated with the frontend team to build new features.</li>
            </ul>
          </div>

          {/* New Resume (Foreground clipped) */}
          <div 
            className="absolute inset-0 bg-accent/5 backdrop-blur-md border-r border-accent p-8 md:p-12 flex flex-col justify-center"
            style={{ clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)` }}
          >
            <div className="inline-block px-3 py-1 bg-accent/10 text-accent text-sm rounded-full mb-6 font-medium w-max">
              AI Optimized Resume
            </div>
            <h4 className="text-xl font-bold mb-4">Software Engineer</h4>
            <ul className="list-disc pl-5 space-y-4 text-foreground font-medium">
              <li>Architected and scaled RESTful microservices in Node.js, supporting 50K+ daily active users with 99.9% uptime.</li>
              <li>Optimized PostgreSQL queries, reducing database latency by 40% and cutting infrastructure costs by $2,000/mo.</li>
              <li>Led cross-functional delivery of 3 major product features ahead of schedule, driving a 15% increase in user retention.</li>
            </ul>
          </div>

          {/* Slider Handle */}
          <div 
            className="absolute top-0 bottom-0 w-1 bg-accent cursor-ew-resize flex items-center justify-center z-10"
            style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
            onMouseDown={() => setIsDragging(true)}
            onTouchStart={() => setIsDragging(true)}
          >
            <div className="w-8 h-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
              <MoveHorizontal className="w-4 h-4" />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
