import { PageTransition } from "@/components/shared/PageTransition";
import { CoverLetterSidebar } from "@/components/cover-letter/CoverLetterSidebar";
import { CoverLetterWorkspace } from "@/components/cover-letter/CoverLetterWorkspace";
import { CoverLetterPanel } from "@/components/cover-letter/CoverLetterPanel";

export default function CoverLetterPage() {
  return (
    <PageTransition>
      <div className="flex h-full">
        <CoverLetterSidebar />
        <main className="flex-1 flex flex-col">
          <CoverLetterWorkspace />
          <CoverLetterPanel />
        </main>
      </div>
    </PageTransition>
  );
}
