import dynamic from "next/dynamic";
import { HeroSection } from "@/components/sections/HeroSection";
import { TrustedBySection } from "@/components/sections/TrustedBySection";

// Lazy-load below-the-fold sections to speed up initial paint
const ProblemSection = dynamic(() =>
  import("@/components/sections/ProblemSection").then((m) => m.ProblemSection)
);
const SolutionSection = dynamic(() =>
  import("@/components/sections/SolutionSection").then((m) => m.SolutionSection)
);
const WorkflowSection = dynamic(() =>
  import("@/components/sections/WorkflowSection").then((m) => m.WorkflowSection)
);
const FeaturesSection = dynamic(() =>
  import("@/components/sections/FeaturesSection").then((m) => m.FeaturesSection)
);
const ComparisonSection = dynamic(() =>
  import("@/components/sections/ComparisonSection").then((m) => m.ComparisonSection)
);
const BeforeAfterSection = dynamic(() =>
  import("@/components/sections/BeforeAfterSection").then((m) => m.BeforeAfterSection)
);
const StatisticsSection = dynamic(() =>
  import("@/components/sections/StatisticsSection").then((m) => m.StatisticsSection)
);
const TestimonialsSection = dynamic(() =>
  import("@/components/sections/TestimonialsSection").then((m) => m.TestimonialsSection)
);
const FaqSection = dynamic(() =>
  import("@/components/sections/FaqSection").then((m) => m.FaqSection)
);
const FinalCtaSection = dynamic(() =>
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
