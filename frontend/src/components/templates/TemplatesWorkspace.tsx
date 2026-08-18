"use client";

import { useState } from "react";
import { PageTransition } from "@/components/shared/PageTransition";
import { TemplatesHeroSection } from "@/components/templates/TemplatesHeroSection";
import { TemplateGallerySection } from "@/components/templates/TemplateGallerySection";
import { TemplateComparisonSection } from "@/components/templates/TemplateComparisonSection";
import { TemplateFaqSection } from "@/components/templates/TemplateFaqSection";
import { RoleSelectorSection } from "@/components/templates/RoleSelectorSection";
import { StageSelectorSection } from "@/components/templates/StageSelectorSection";
import { ResumeAnatomySection } from "@/components/templates/ResumeAnatomySection";
import { LengthGuideTimeline } from "@/components/templates/LengthGuideTimeline";
import { RecruiterReviewSection } from "@/components/templates/RecruiterReviewSection";
import type { CareerStage } from "@/data/templates-data";

export function TemplatesWorkspace() {
  const [selectedStage, setSelectedStage] = useState<CareerStage>("1-3 Years");
  const [selectedRole, setSelectedRole] = useState("Software Engineer");

  return (
    <PageTransition>
      <div className="flex flex-col">
        <TemplatesHeroSection />
        <StageSelectorSection selectedStage={selectedStage} setSelectedStage={setSelectedStage} />
        <RoleSelectorSection selectedRole={selectedRole} setSelectedRole={setSelectedRole} />
        <TemplateGallerySection selectedStage={selectedStage} selectedRole={selectedRole} />
        <ResumeAnatomySection />
        <LengthGuideTimeline />
        <RecruiterReviewSection />
        <TemplateComparisonSection />
        <TemplateFaqSection />
      </div>
    </PageTransition>
  );
}
