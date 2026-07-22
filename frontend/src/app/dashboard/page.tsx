import { DashboardHeroWelcome } from "@/components/dashboard/HeroWelcome";
import { DashboardQuickActions } from "@/components/dashboard/QuickActions";
import { DashboardResumeStats } from "@/components/dashboard/ResumeStats";
import { DashboardRecentResumes } from "@/components/dashboard/RecentResumes";
import { DashboardActivityPanel } from "@/components/dashboard/ActivityPanel";

export default function DashboardPage() {
  return (
    <div className="flex flex-col lg:flex-row h-full">
      {/* Main Dashboard Feed */}
      <div className="flex-1 p-8 space-y-12">
        <DashboardHeroWelcome />
        <DashboardQuickActions />
        <DashboardResumeStats />
        <DashboardRecentResumes />
      </div>
      
      {/* Right Activity Panel */}
      <div className="hidden lg:block h-full">
        <DashboardActivityPanel />
      </div>
    </div>
  );
}
