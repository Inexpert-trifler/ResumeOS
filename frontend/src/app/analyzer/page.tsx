import { PageTransition } from "@/components/shared/PageTransition";
import { AnalyzerSidebar } from "@/components/analyzer/AnalyzerSidebar";
import { AnalyzerHeroUpload } from "@/components/analyzer/HeroUpload";
import { AnalyzerHealthDashboard } from "@/components/analyzer/HealthDashboard";
import { AnalyzerAnalysisCards } from "@/components/analyzer/AnalysisCards";
import { AnalyzerKeywordAnalysis } from "@/components/analyzer/KeywordAnalysis";
import { AnalyzerFormattingAnalysis } from "@/components/analyzer/FormattingAnalysis";
import { AnalyzerSectionAnalysis } from "@/components/analyzer/SectionAnalysis";
import { AnalyzerWeakBullets } from "@/components/analyzer/WeakBullets";
import { AnalyzerImprovementRoadmap } from "@/components/analyzer/ImprovementRoadmap";
import { AnalyzerATSSimulation } from "@/components/analyzer/ATSSimulation";

export default function AnalyzerPage() {
  return (
    <PageTransition>
      <div className="flex h-full">
        <AnalyzerSidebar />
        <main className="flex-1 p-8 space-y-8">
          <AnalyzerHeroUpload />
          <AnalyzerHealthDashboard />
          <AnalyzerAnalysisCards />
          <AnalyzerKeywordAnalysis />
          <AnalyzerFormattingAnalysis />
          <AnalyzerSectionAnalysis />
          <AnalyzerWeakBullets />
          <AnalyzerImprovementRoadmap />
          <AnalyzerATSSimulation />
        </main>
      </div>
    </PageTransition>
  );
}
