"use client";

import { useStudio } from "./StudioContext";
import { Reorder } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  User, FileText, Briefcase, GraduationCap, Code2, FolderOpen,
  Trophy, Award, Users, Globe, Heart, Eye, EyeOff,
  GripVertical, ChevronRight
} from "lucide-react";
import { ResumeSection } from '@/types';

const SECTION_ICONS: Record<string, React.ElementType> = {
  header: User,
  summary: FileText,
  experience: Briefcase,
  education: GraduationCap,
  skills: Code2,
  projects: FolderOpen,
  achievements: Trophy,
  certificates: Award,
  leadership: Users,
  languages: Globe,
  interests: Heart,
};

const SECTION_COLORS: Record<string, string> = {
  header: "text-blue-500",
  summary: "text-purple-500",
  experience: "text-green-500",
  education: "text-cyan-500",
  skills: "text-orange-500",
  projects: "text-pink-500",
  achievements: "text-yellow-500",
  certificates: "text-indigo-500",
  leadership: "text-red-500",
  languages: "text-teal-500",
  interests: "text-rose-500",
};

function SectionItem({ section, isActive }: { section: ResumeSection; isActive: boolean }) {
  const { dispatch } = useStudio();
  const Icon = SECTION_ICONS[section.type] || FileText;
  const colorCls = SECTION_COLORS[section.type] || "text-muted-foreground";

  return (
    <Reorder.Item
      value={section}
      id={section.id}
      className={cn(
        "flex items-center gap-2 px-3 py-2.5 rounded-xl cursor-pointer select-none group transition-all duration-150",
        isActive ? "bg-accent/10 border border-accent/30" : "hover:bg-muted/80 border border-transparent",
        !section.visible && "opacity-40"
      )}
      onClick={() => dispatch({ type: "SET_ACTIVE_SECTION", payload: section.id })}
    >
      {/* Drag Handle */}
      <GripVertical className="w-3.5 h-3.5 text-muted-foreground/40 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing" />

      {/* Icon */}
      <div className={cn("w-7 h-7 rounded-lg bg-muted flex items-center justify-center shrink-0", isActive && "bg-accent/10")}>
        <Icon className={cn("w-3.5 h-3.5", isActive ? "text-accent" : colorCls)} />
      </div>

      {/* Label */}
      <span className={cn("flex-1 text-sm font-medium", isActive ? "text-accent" : "text-foreground")}>
        {section.label}
      </span>

      {/* Visibility Toggle */}
      <button
        onClick={(e) => { e.stopPropagation(); dispatch({ type: "TOGGLE_SECTION", payload: section.id }); }}
        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-lg hover:bg-muted"
      >
        {section.visible
          ? <Eye className="w-3 h-3 text-muted-foreground" />
          : <EyeOff className="w-3 h-3 text-muted-foreground" />
        }
      </button>

      {isActive && <ChevronRight className="w-3 h-3 text-accent shrink-0" />}
    </Reorder.Item>
  );
}

export function StudioLeftSidebar() {
  const { state, dispatch } = useStudio();
  const { sections, activeSectionId } = state;

  const completionCount = sections.filter(s => s.visible).length;

  return (
    <aside className="flex flex-col h-full bg-background border-r border-border/50 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-4 border-b border-border/50">
        <div className="flex items-center justify-between mb-1">
          <h2 className="font-bold text-sm">Sections</h2>
          <span className="text-xs text-muted-foreground">{completionCount} active</span>
        </div>
        <p className="text-xs text-muted-foreground">Drag to reorder · Click to edit</p>
      </div>

      {/* Section List with Drag-to-Reorder */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1">
        <Reorder.Group
          axis="y"
          values={sections}
          onReorder={(newOrder) => dispatch({ type: "REORDER_SECTIONS", payload: newOrder })}
          className="space-y-1"
        >
          {sections.map((section) => (
            <SectionItem
              key={section.id}
              section={section}
              isActive={activeSectionId === section.id}
            />
          ))}
        </Reorder.Group>
      </div>

      {/* Bottom Controls */}
      <div className="p-3 border-t border-border/50 space-y-2">
        {/* Layout controls */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-xs text-muted-foreground block mb-1">Spacing</label>
            <input
              type="range" min={0.8} max={2} step={0.1}
              value={state.settings.lineHeight}
              onChange={(e) => dispatch({ type: "UPDATE_SETTINGS", payload: { lineHeight: Number(e.target.value) } })}
              className="w-full accent-accent h-1"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground block mb-1">Margins</label>
            <input
              type="range" min={16} max={64} step={4}
              value={state.settings.margins}
              onChange={(e) => dispatch({ type: "UPDATE_SETTINGS", payload: { margins: Number(e.target.value) } })}
              className="w-full accent-accent h-1"
            />
          </div>
        </div>

        {/* Font size */}
        <div>
          <label className="text-xs text-muted-foreground block mb-1">Font Size ({state.settings.fontSize}pt)</label>
          <input
            type="range" min={8} max={14} step={0.5}
            value={state.settings.fontSize}
            onChange={(e) => dispatch({ type: "UPDATE_SETTINGS", payload: { fontSize: Number(e.target.value) } })}
            className="w-full accent-accent h-1"
          />
        </div>
      </div>
    </aside>
  );
}
