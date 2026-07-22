"use client";

import { useRef, useState, useEffect } from "react";
import { ROLES } from "@/data/templates-data";
import { Container } from "@/components/shared/Container";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface RoleSelectorSectionProps {
  selectedRole: string;
  setSelectedRole: (role: string) => void;
}

export function RoleSelectorSection({ selectedRole, setSelectedRole }: RoleSelectorSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const checkScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setShowLeftArrow(scrollLeft > 0);
    setShowRightArrow(Math.ceil(scrollLeft + clientWidth) < scrollWidth);
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const { clientWidth } = scrollRef.current;
    const scrollAmount = clientWidth * 0.5;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth"
    });
  };

  return (
    <section className="py-6 border-b border-border/50 sticky top-16 z-40 bg-background/80 backdrop-blur-md">
      <Container className="relative">
        
        {/* Scroll Arrows */}
        {showLeftArrow && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-gradient-to-r from-background via-background to-transparent pr-8 h-full flex items-center">
            <button 
              onClick={() => scroll("left")}
              className="w-8 h-8 rounded-full bg-card border border-border shadow-sm flex items-center justify-center hover:bg-muted"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        )}

        <div 
          ref={scrollRef}
          onScroll={checkScroll}
          className="flex overflow-x-auto no-scrollbar gap-2 scroll-smooth py-2 px-1"
        >
          {ROLES.map((role) => (
            <button
              key={role}
              onClick={() => setSelectedRole(role)}
              className={cn(
                "whitespace-nowrap px-4 py-2 rounded-lg text-sm font-medium transition-colors shrink-0",
                selectedRole === role
                  ? "bg-accent text-accent-foreground shadow-sm"
                  : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              {role}
            </button>
          ))}
        </div>

        {showRightArrow && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-gradient-to-l from-background via-background to-transparent pl-8 h-full flex items-center">
            <button 
              onClick={() => scroll("right")}
              className="w-8 h-8 rounded-full bg-card border border-border shadow-sm flex items-center justify-center hover:bg-muted"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </Container>
    </section>
  );
}
