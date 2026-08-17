import { ReactNode } from "react";
import { DashboardTopNav } from "@/components/dashboard/TopNav";

export default function StudioLayout({ children }: { children: ReactNode }) {
  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col bg-background">
      <DashboardTopNav />
      {/* Studio canvas — takes remaining height below the nav */}
      <div className="flex-1 overflow-hidden min-h-0">
        {children}
      </div>
    </div>
  );
}
