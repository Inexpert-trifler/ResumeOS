"use client";

import { useState } from "react";
import { StepWrapper } from "./StepWrapper";
import { BuilderAiAssistant } from "./BuilderAiAssistant";
import { BuilderState, Project } from '@/types';
import { motion, AnimatePresence } from "framer-motion";
import { Plus, ChevronDown, ChevronUp, Trash2, GitBranch, Globe, Tag, X as LucideX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function ProjectCard({
  project,
  onUpdate,
  onDelete,
  showValidation = false,
}: {
  project: Project;
  onUpdate: (p: Project) => void;
  onDelete: () => void;
  showValidation?: boolean;
}) {
  const [expanded, setExpanded] = useState(true);
  const [techInput, setTechInput] = useState("");
  const [featureInput, setFeatureInput] = useState("");

  const set = (key: keyof Project) => (v: string) => onUpdate({ ...project, [key]: v });

  const addTech = () => {
    if (!techInput.trim()) return;
    if (!project.techStack.includes(techInput.trim())) {
      onUpdate({ ...project, techStack: [...project.techStack, techInput.trim()] });
    }
    setTechInput("");
  };

  const removeTech = (t: string) => onUpdate({ ...project, techStack: project.techStack.filter(x => x !== t) });

  const addFeature = () => {
    if (!featureInput.trim()) return;
    onUpdate({ ...project, keyFeatures: [...project.keyFeatures, featureInput.trim()] });
    setFeatureInput("");
  };

  const removeFeature = (i: number) => onUpdate({ ...project, keyFeatures: project.keyFeatures.filter((_, idx) => idx !== i) });

  const labelCls = "block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider";
  const inputCls = "w-full bg-muted/50 border border-border/50 rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all";
  const nameError = showValidation && !project.name.trim() ? "Project name is required." : "";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-card border border-border/50 rounded-2xl overflow-hidden shadow-sm"
    >
      {/* Card Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-border/50 bg-muted/30">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
            <GitBranch className="w-4 h-4 text-accent" />
          </div>
          <div>
            <p className="font-bold text-sm">{project.name || "Untitled Project"}</p>
            <p className="text-xs text-muted-foreground">{project.techStack.join(", ") || "No stack yet"}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <BuilderAiAssistant
            sectionType="projects"
            targetField="project_description"
            fieldLabel={`Project: ${project.name || "Untitled Project"}`}
            currentText={[project.description, project.keyFeatures.join(". "), project.achievements].filter(Boolean).join("\n\n")}
            onApply={(nextText) => onUpdate({ ...project, description: nextText })}
            targetRole=""
            builderContext={{
              projectName: project.name,
              projectRole: project.role,
              techStack: project.techStack,
              keyFeatures: project.keyFeatures,
              achievements: project.achievements,
              duration: project.duration,
            }}
            userInstruction="Rewrite this project description to be concise, impact-focused, and truthful."
          />
          <button onClick={() => setExpanded(!expanded)} className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground">
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          <button onClick={onDelete} className="p-1.5 rounded-lg hover:bg-destructive/10 transition-colors text-muted-foreground hover:text-destructive">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Expandable Body */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="p-5 space-y-5">
              {/* Name & Role Row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Project Name *</label>
                  <input
                    value={project.name}
                    onChange={(e) => set("name")(e.target.value)}
                    placeholder="My Awesome App"
                    className={cn(inputCls, nameError && "border-destructive/60 focus:border-destructive focus:ring-destructive/20")}
                    aria-invalid={Boolean(nameError)}
                  />
                  {nameError && <p className="mt-1 text-xs text-destructive">{nameError}</p>}
                </div>
                <div>
                  <label className={labelCls}>Your Role</label>
                  <input value={project.role} onChange={(e) => set("role")(e.target.value)} placeholder="Lead Developer" className={inputCls} />
                </div>
              </div>

              {/* Tech Stack */}
              <div>
                <label className={labelCls}>Tech Stack</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {project.techStack.map((t) => (
                    <span key={t} className="flex items-center gap-1 bg-accent/10 text-accent text-xs px-2 py-1 rounded-full">
                      <Tag className="w-3 h-3" /> {t}
                    <button onClick={() => removeTech(t)} className="hover:text-destructive ml-1"><LucideX className="w-3 h-3" /></button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input value={techInput} onChange={(e) => setTechInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addTech()} placeholder="React, Node.js..." className={cn(inputCls, "flex-1")} />
                  <button onClick={addTech} className="px-3 py-2 rounded-lg bg-accent text-accent-foreground text-xs font-semibold hover:bg-accent/90">Add</button>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className={labelCls}>Description</label>
                <textarea value={project.description} onChange={(e) => set("description")(e.target.value)} rows={3} placeholder="What does this project do? What problem does it solve?" className={cn(inputCls, "resize-none")} />
              </div>

              {/* Links & Duration */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}><GitBranch className="inline w-3 h-3 mr-1" /> GitHub URL</label>
                  <input value={project.github} onChange={(e) => set("github")(e.target.value)} placeholder="github.com/..." className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}><Globe className="inline w-3 h-3 mr-1" /> Live Demo</label>
                  <input value={project.liveDemo} onChange={(e) => set("liveDemo")(e.target.value)} placeholder="yourdemo.com" className={inputCls} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Duration</label>
                  <input value={project.duration} onChange={(e) => set("duration")(e.target.value)} placeholder="3 months / Jan-Mar 2024" className={inputCls} />
                </div>
              </div>

              {/* Key Features */}
              <div>
                <label className={labelCls}>Key Features</label>
                <div className="space-y-1.5 mb-2">
                  {project.keyFeatures.map((f, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm bg-muted/30 rounded-lg px-3 py-2">
                      <span className="text-accent font-bold text-xs">•</span>
                      <span className="flex-1">{f}</span>
                      <button onClick={() => removeFeature(i)} className="text-muted-foreground hover:text-destructive">
                          <LucideX className="w-3 h-3" />
                        </button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input value={featureInput} onChange={(e) => setFeatureInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addFeature()} placeholder="Real-time updates, Auth system..." className={cn(inputCls, "flex-1")} />
                  <button onClick={addFeature} className="px-3 py-2 rounded-lg bg-muted text-foreground text-xs font-semibold hover:bg-muted/80">+</button>
                </div>
              </div>

              {/* Achievements */}
              <div>
                <label className={labelCls}>Achievements / Impact</label>
                <textarea value={project.achievements} onChange={(e) => set("achievements")(e.target.value)} rows={2} placeholder="10,000+ users, reduced load time by 40%..." className={cn(inputCls, "resize-none")} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}



interface Step08Props {
  state: BuilderState;
  update: (partial: Partial<BuilderState>) => void;
  validationError?: string;
}

export function Step08_Projects({ state, update, validationError }: Step08Props) {
  const addProject = () => {
    const newProject: Project = {
      id: Date.now().toString(),
      name: "", description: "", techStack: [], github: "", liveDemo: "",
      role: "", duration: "", keyFeatures: [], challenges: "", achievements: ""
    };
    update({ projects: [...state.projects, newProject] });
  };

  const updateProject = (id: string, p: Project) => {
    update({ projects: state.projects.map(x => x.id === id ? p : x) });
  };

  const deleteProject = (id: string) => {
    update({ projects: state.projects.filter(x => x.id !== id) });
  };

  return (
    <StepWrapper
      badge="Step 8"
      title="Tell us about your projects"
      description="Projects are critical for freshers and engineers. Add as many as you want."
    >
      <div className="max-w-2xl space-y-4">
        <AnimatePresence>
          {state.projects.map((p) => (
            <ProjectCard
              key={p.id}
              project={p}
              onUpdate={(updated) => updateProject(p.id, updated)}
              onDelete={() => deleteProject(p.id)}
              showValidation={Boolean(validationError)}
            />
          ))}
        </AnimatePresence>

        <Button onClick={addProject} variant="outline" className="w-full rounded-xl border-dashed border-border h-14 text-sm text-muted-foreground hover:text-foreground hover:border-accent/50 gap-2">
          <Plus className="w-4 h-4" /> Add a Project
        </Button>

        {validationError && (
          <p className="text-sm text-destructive" aria-live="polite">
            {validationError}
          </p>
        )}
      </div>
    </StepWrapper>
  );
}
