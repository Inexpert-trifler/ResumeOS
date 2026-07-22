import { ReactNode } from "react";
import { DashboardSidebar } from "@/components/dashboard/Sidebar";
import { DashboardTopNav } from "@/components/dashboard/TopNav";
import { PageTransition } from "@/components/shared/PageTransition";

export default function TrackerLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background">
      {/* Fixed Left Sidebar */}
      <DashboardSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <DashboardTopNav />
        
        {/* Scrollable Main Area */}
        <main className="flex-1 overflow-y-auto">
          <PageTransition>
            {children}
          </PageTransition>
        </main>
      </div>
    </div>
  );
}
