export const dynamic = 'force-dynamic';

import { PageTransition } from "@/components/shared/PageTransition";
import { GitHubSidebar } from "@/components/github/GitHubSidebar";
import { GitHubWorkspace } from "@/components/github/GitHubWorkspace";
import { GitHubPanel } from "@/components/github/GitHubPanel";

export default function GitHubPage() {
  return (
    <PageTransition>
      <div className="flex h-full">
        <GitHubSidebar />
        <main className="flex-1 flex flex-col">
          <GitHubWorkspace />
          <GitHubPanel />
        </main>
      </div>
    </PageTransition>
  );
}
