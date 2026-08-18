export const dynamic = 'force-dynamic';

import { PageTransition } from "@/components/shared/PageTransition";
import { LinkedInSidebar } from "@/components/linkedin/LinkedInSidebar";
import { LinkedInWorkspace } from "@/components/linkedin/LinkedInWorkspace";
import { LinkedInPanel } from "@/components/linkedin/LinkedInPanel";

export default function LinkedInPage() {
  return (
    <PageTransition>
      <div className="flex h-full">
        <LinkedInSidebar />
        <main className="flex-1 flex flex-col">
          <LinkedInWorkspace />
          <LinkedInPanel />
        </main>
      </div>
    </PageTransition>
  );
}
