import { PageTransition } from "@/components/shared/PageTransition";
import { ReviewSidebar } from "@/components/review/ReviewSidebar";
import { ReviewWorkspace } from "@/components/review/ReviewWorkspace";
import { ReviewPanel } from "@/components/review/ReviewPanel";

export default function ReviewPage() {
  return (
    <PageTransition>
      <div className="flex h-full">
        <ReviewSidebar />
        <main className="flex-1 flex flex-col">
          <ReviewWorkspace />
          <ReviewPanel />
        </main>
      </div>
    </PageTransition>
  );
}
