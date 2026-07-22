"use client";

import { useStudio } from "./StudioContext";
import { ClassicTemplate, ModernTemplate, MinimalTemplate } from "./templates/ResumeTemplates";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function ResumeCanvas() {
  const { state, dispatch } = useStudio();
  const { settings, resume } = state;

  const renderTemplate = () => {
    switch (settings.template) {
      case "classic":
        return <ClassicTemplate resume={resume} settings={settings} dispatch={dispatch} />;
      case "modern":
        return <ModernTemplate resume={resume} settings={settings} dispatch={dispatch} />;
      case "minimal":
        return <MinimalTemplate resume={resume} settings={settings} dispatch={dispatch} />;
      case "corporate":
        // Fallback to classic for now if corporate is not fully implemented
        return <ClassicTemplate resume={resume} settings={settings} dispatch={dispatch} />;
      default:
        return <ClassicTemplate resume={resume} settings={settings} dispatch={dispatch} />;
    }
  };

  // A4 paper aspect ratio (210x297mm) -> ~ 1 : 1.414
  // We'll use a fixed width for the "paper" and let it scale via CSS transform
  const PAPER_WIDTH = 800;
  const PAPER_HEIGHT = 1131;

  return (
    <div className="flex-1 bg-muted/30 overflow-auto flex items-start justify-center p-8 relative">
      <div
        className="relative origin-top transition-transform duration-200 ease-out"
        style={{
          transform: `scale(${settings.zoom / 100})`,
        }}
      >
        <motion.div
          id="resume-canvas-paper"
          key={settings.template} // Trigger animation on template change
          initial={{ opacity: 0, y: 20, rotateX: 10 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="bg-white shadow-2xl overflow-hidden flex flex-col"
          style={{
            width: PAPER_WIDTH,
            minHeight: PAPER_HEIGHT,
          }}
        >
          {renderTemplate()}
        </motion.div>
      </div>
    </div>
  );
}
