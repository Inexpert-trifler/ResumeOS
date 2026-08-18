export const dynamic = 'force-dynamic';

import dynamicNext from "next/dynamic";
import { HeroSection } from "@/components/sections/HeroSection";
import { TrustedBySection } from "@/components/sections/TrustedBySection";

// Lazy-load below-the-fold sections to speed up initial paint
const ProblemSection = dynamicNext(() =>
  import("@/components/sections/ProblemSection").then((m) => m.ProblemSection)
);
const SolutionSection = dynamicNext(() =>
  import("@/components/sections/SolutionSection").then((m) => m.SolutionSection)
);
const WorkflowSection = dynamicNext(() =>
  import("@/components/sections/WorkflowSection").then((m) => m.WorkflowSection)
);
const FeaturesSection = dynamicNext(() =>
  import("@/components/sections/FeaturesSection").then((m) => m.FeaturesSection)
);
const ComparisonSection = dynamicNext(() =>
  import("@/components/sections/ComparisonSection").then((m) => m.ComparisonSection)
);
const BeforeAfterSection = dynamicNext(() =>
  import("@/components/sections/BeforeAfterSection").then((m) => m.BeforeAfterSection)
);
const StatisticsSection = dynamicNext(() =>
  import("@/components/sections/StatisticsSection").then((m) => m.StatisticsSection)
);
const TestimonialsSection = dynamicNext(() =>
  import("@/components/sections/TestimonialsSection").then((m) => m.TestimonialsSection)
);
const FaqSection = dynamicNext(() =>
  import("@/components/sections/FaqSection").then((m) => m.FaqSection)
);
const FinalCtaSection = dynamicNext(() =>
  import("@/components/sections/FinalCtaSection").then((m) => m.FinalCtaSection)
);

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      <TrustedBySection />
      <ProblemSection />
      <SolutionSection />
      <WorkflowSection />
      <FeaturesSection />
      <ComparisonSection />
      <BeforeAfterSection />
      <StatisticsSection />
      <TestimonialsSection />
      <FaqSection />
      <FinalCtaSection />
    </div>
  );
}
