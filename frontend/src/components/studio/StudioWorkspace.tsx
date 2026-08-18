"use client";

import { Panel, Group as PanelGroup, Separator as PanelResizeHandle } from "react-resizable-panels";
import { StudioProvider } from "@/components/studio/StudioContext";
import { StudioToolbar } from "@/components/studio/StudioToolbar";
import { StudioLeftSidebar } from "@/components/studio/StudioLeftSidebar";
import { StudioRightSidebar } from "@/components/studio/StudioRightSidebar";
import { ResumeCanvas } from "@/components/studio/ResumeCanvas";

export function StudioWorkspace() {
  return (
    <StudioProvider>
      <div className="flex flex-col h-full w-full overflow-hidden bg-background">
        <StudioToolbar />
        
        <div className="flex-1 overflow-hidden relative">
          <PanelGroup orientation="horizontal">
            {/* Left Sidebar (Sections) */}
            <Panel defaultSize={20} minSize={15} maxSize={30}>
              <StudioLeftSidebar />
            </Panel>

            <PanelResizeHandle className="w-1 bg-border/50 hover:bg-accent/50 active:bg-accent transition-colors cursor-col-resize z-10" />

            {/* Center Canvas (Resume Preview) */}
            <Panel defaultSize={60} minSize={40}>
              <ResumeCanvas />
            </Panel>

            <PanelResizeHandle className="w-1 bg-border/50 hover:bg-accent/50 active:bg-accent transition-colors cursor-col-resize z-10" />

            {/* Right Sidebar (AI Suggestions) */}
            <Panel defaultSize={20} minSize={15} maxSize={30}>
              <StudioRightSidebar />
            </Panel>
          </PanelGroup>
        </div>
      </div>
    </StudioProvider>
  );
}
