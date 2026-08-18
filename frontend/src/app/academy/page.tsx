export const dynamic = 'force-dynamic';

import { Container } from "@/components/shared/Container";
import { ReadingProgress } from "@/components/academy/ReadingProgress";
import { AcademySidebar } from "@/components/academy/AcademySidebar";

import { IntroductionSection } from "@/components/academy/IntroductionSection";
import { FundamentalsSection } from "@/components/academy/FundamentalsSection";
import { SectionsGuideSection } from "@/components/academy/SectionsGuideSection";
import { LengthGuideSection } from "@/components/academy/LengthGuideSection";
import { ATSVisualizationSection } from "@/components/academy/ATSVisualizationSection";
import { MistakesSection } from "@/components/academy/MistakesSection";
import { RoleBasedGuideSection } from "@/components/academy/RoleBasedGuideSection";
import { ResumeExamplesSection } from "@/components/academy/ResumeExamplesSection";
import { RecruiterSimulatorSection } from "@/components/academy/RecruiterSimulatorSection";
import { AcademyFaqSection } from "@/components/academy/AcademyFaqSection";

export default function AcademyPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <ReadingProgress />

      {/* Hero Header for Academy */}
      <div className="pt-12 pb-12 bg-zinc-950 text-white border-b border-zinc-800">
        <Container>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">
            Resume Academy
          </h1>
          <p className="text-xl text-zinc-400 max-w-2xl">
            The ultimate interactive course on building a resume that actually gets interviews.
            Estimated reading time: 30 mins.
          </p>
        </Container>
      </div>

      <Container className="flex-1 py-12">
        <div className="flex flex-col lg:flex-row gap-12 relative">
          <AcademySidebar />

          <main className="flex-1 w-full max-w-full overflow-hidden">
            <IntroductionSection />
            <FundamentalsSection />
            <SectionsGuideSection />
            <LengthGuideSection />
            <ATSVisualizationSection />
            <MistakesSection />
            <RoleBasedGuideSection />
            <ResumeExamplesSection />
            <RecruiterSimulatorSection />
            <AcademyFaqSection />
          </main>
        </div>
      </Container>
    </div>
  );
}
