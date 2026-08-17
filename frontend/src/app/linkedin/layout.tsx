import { ReactNode } from "react";
import { DashboardSidebar } from "@/components/dashboard/Sidebar";
import { DashboardTopNav } from "@/components/dashboard/TopNav";
import { PageTransition } from "@/components/shared/PageTransition";

export default function LinkedInLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <DashboardTopNav />
        <main className="flex-1 overflow-y-auto">
          <PageTransition>{children}</PageTransition>
        </main>
      </div>
    </div>
  );
}
