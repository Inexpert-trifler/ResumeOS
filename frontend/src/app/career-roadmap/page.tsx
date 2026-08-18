export const dynamic = 'force-dynamic';

import { PageTransition } from "@/components/shared/PageTransition";
import { CareerRoadmapSidebar } from "@/components/career-roadmap/CareerRoadmapSidebar";
import { CareerRoadmapWorkspace } from "@/components/career-roadmap/CareerRoadmapWorkspace";
import { CareerRoadmapPanel } from "@/components/career-roadmap/CareerRoadmapPanel";

export default function CareerRoadmapPage() {
  return (
    <PageTransition>
      <div className="flex h-full">
        <CareerRoadmapSidebar />
        <main className="flex-1 flex flex-col">
          <CareerRoadmapWorkspace />
          <CareerRoadmapPanel />
        </main>
      </div>
    </PageTransition>
  );
}
