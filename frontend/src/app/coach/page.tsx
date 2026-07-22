import { PageTransition } from "@/components/shared/PageTransition";
import { CoachSidebar } from "@/components/coach/CoachSidebar";
import { ChatInterface } from "@/components/coach/ChatInterface";
import { CoachPanel } from "@/components/coach/CoachPanel";

export default function CoachPage() {
  return (
    <PageTransition>
      <div className="flex h-full">
        <CoachSidebar />
        <main className="flex-1 flex flex-col">
          <ChatInterface />
          <CoachPanel />
        </main>
      </div>
    </PageTransition>
  );
}
