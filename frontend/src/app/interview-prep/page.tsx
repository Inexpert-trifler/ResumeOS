import { PageTransition } from "@/components/shared/PageTransition";
import { InterviewSidebar } from "@/components/interview-prep/InterviewSidebar";
import { InterviewWorkspace } from "@/components/interview-prep/InterviewWorkspace";
import { InterviewPanel } from "@/components/interview-prep/InterviewPanel";

export default function InterviewPrepPage() {
  return (
    <PageTransition>
      <div className="flex h-full">
        <InterviewSidebar />
        <main className="flex-1 flex flex-col">
          <InterviewWorkspace />
          <InterviewPanel />
        </main>
      </div>
    </PageTransition>
  );
}
