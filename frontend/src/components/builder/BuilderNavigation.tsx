"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, SkipForward } from "lucide-react";
import { STEP_LABELS } from '@/types';

interface BuilderNavigationProps {
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onPrev: () => void;
  onSkip?: () => void;
  isOptional?: boolean;
}

export function BuilderNavigation({
  currentStep, totalSteps, onNext, onPrev, onSkip, isOptional
}: BuilderNavigationProps) {
  const isFirst = currentStep === 0;
  const isLast = currentStep === totalSteps - 1;

  return (
    <div className="flex items-center justify-between pt-8 mt-8 border-t border-border/50">
      <Button
        variant="ghost"
        onClick={onPrev}
        disabled={isFirst}
        className="rounded-full gap-2 text-muted-foreground"
      >
        <ArrowLeft className="w-4 h-4" />
        {currentStep > 0 ? STEP_LABELS[currentStep - 1] : "Back"}
      </Button>

      <div className="flex items-center gap-3">
        {isOptional && onSkip && (
          <Button variant="ghost" onClick={onSkip} className="rounded-full gap-2 text-muted-foreground text-sm">
            <SkipForward className="w-3 h-3" /> Skip for now
          </Button>
        )}

        <Button
          onClick={onNext}
          className="rounded-full shadow-lg px-8 gap-2 h-11"
        >
          {isLast ? "Complete ✓" : (
            <>
              {STEP_LABELS[currentStep + 1] || "Next"}
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
