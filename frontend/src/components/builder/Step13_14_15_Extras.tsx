"use client";

import { useState } from "react";
import { StepWrapper } from "./StepWrapper";
import { BuilderAiAssistant } from "./BuilderAiAssistant";
import { BuilderState, Leadership, Language } from '@/types';
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Users, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const inputCls = "w-full bg-muted/50 border border-border/50 rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all";
const labelCls = "block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider";

// Step 13 — Leadership
interface Step13Props { state: BuilderState; update: (p: Partial<BuilderState>) => void; }
export function Step13_Leadership({ state, update }: Step13Props) {
  const add = () => {
    update({ leadership: [...state.leadership, { id: Date.now().toString(), role: "", organization: "", startDate: "", endDate: "", description: "" }] });
  };

  return (
    <StepWrapper badge="Step 13" title="Leadership & Volunteering" description="Club presidents, open-source maintainers, event organizers — this shows initiative.">
      <div className="max-w-2xl space-y-4">
        <AnimatePresence>
          {state.leadership.map((l) => {
            const set = (key: keyof Leadership) => (v: string) =>
              update({ leadership: state.leadership.map(x => x.id === l.id ? { ...x, [key]: v } : x) });
            return (
              <motion.div key={l.id} layout initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="bg-card border border-border/50 rounded-2xl p-5 shadow-sm"
              >
                <div className="flex justify-between mb-4 gap-3">
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-accent" />
                    <span className="font-bold text-sm">{l.role || "Leadership Role"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BuilderAiAssistant
                      sectionType="leadership"
                      targetField="leadership_description"
                      fieldLabel={l.role || "Leadership Role"}
                      currentText={[l.role, l.organization, l.description].filter(Boolean).join("\n")}
                      onApply={(nextText) => update({ leadership: state.leadership.map(x => x.id === l.id ? { ...x, description: nextText } : x) })}
                      targetRole={state.targetRole}
                      builderContext={{
                        role: l.role,
                        organization: l.organization,
                        startDate: l.startDate,
                        endDate: l.endDate,
                      }}
                      userInstruction="Make this leadership or volunteering entry concrete, concise, and impact-focused."
                      allowInsert={false}
                    />
                    <button onClick={() => update({ leadership: state.leadership.filter(x => x.id !== l.id) })} className="text-muted-foreground hover:text-destructive">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={labelCls}>Role / Position</label>
                      <input value={l.role} onChange={(e) => set("role")(e.target.value)} placeholder="Club President" className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>Organization</label>
                      <input value={l.organization} onChange={(e) => set("organization")(e.target.value)} placeholder="ACM / Dev Community" className={inputCls} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={labelCls}>Start Date</label>
                      <input type="month" value={l.startDate} onChange={(e) => set("startDate")(e.target.value)} className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>End Date</label>
                      <input type="month" value={l.endDate} onChange={(e) => set("endDate")(e.target.value)} className={inputCls} />
                    </div>
                  </div>
                  <div>
                    <label className={labelCls}>Description</label>
                    <textarea value={l.description} onChange={(e) => set("description")(e.target.value)} rows={2} placeholder="Led a team of 20 students..." className={cn(inputCls, "resize-none")} />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        <Button onClick={add} variant="outline" className="w-full rounded-xl border-dashed h-14 text-sm text-muted-foreground hover:border-accent/50 gap-2">
          <Plus className="w-4 h-4" /> Add Leadership Role
        </Button>
      </div>
    </StepWrapper>
  );
}

// Step 14 — Languages
const PROFICIENCIES: Language["proficiency"][] = ["Native", "Fluent", "Intermediate", "Basic"];
const PROFICIENCY_COLORS: Record<Language["proficiency"], string> = {
  Native: "bg-green-500/20 text-green-600 dark:text-green-400 border-green-500/30",
  Fluent: "bg-blue-500/20 text-blue-600 dark:text-blue-400 border-blue-500/30",
  Intermediate: "bg-orange-500/20 text-orange-600 dark:text-orange-400 border-orange-500/30",
  Basic: "bg-muted text-muted-foreground border-border/50",
};

interface Step14Props { state: BuilderState; update: (p: Partial<BuilderState>) => void; }
export function Step14_Languages({ state, update }: Step14Props) {
  const [name, setName] = useState("");
  const [prof, setProf] = useState<Language["proficiency"]>("Fluent");

  const add = () => {
    if (!name.trim()) return;
    update({ languages: [...state.languages, { id: Date.now().toString(), name: name.trim(), proficiency: prof }] });
    setName("");
  };

  return (
    <StepWrapper badge="Step 14" title="Languages" description="Multilingual? Add your languages to stand out in global roles.">
      <div className="max-w-2xl space-y-6">
        {/* Input Row */}
        <div className="flex gap-3 items-end">
          <div className="flex-1">
            <label className={labelCls}>Language</label>
            <input value={name} onChange={(e) => setName(e.target.value)} onKeyDown={(e) => e.key === "Enter" && add()} placeholder="English, Spanish..." className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Proficiency</label>
            <select value={prof} onChange={(e) => setProf(e.target.value as Language["proficiency"])} className={cn(inputCls, "cursor-pointer")}>
              {PROFICIENCIES.map(p => <option key={p}>{p}</option>)}
            </select>
          </div>
          <button onClick={add} className="px-4 py-2 rounded-xl bg-accent text-accent-foreground text-sm font-semibold hover:bg-accent/90 whitespace-nowrap">
            Add
          </button>
        </div>

        {/* Language Cards */}
        <div className="flex flex-wrap gap-3">
          <AnimatePresence>
            {state.languages.map((lang) => (
              <motion.div key={lang.id} layout initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                className={cn("flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium", PROFICIENCY_COLORS[lang.proficiency])}
              >
                <Globe className="w-4 h-4" /> {lang.name}
                <span className="text-xs opacity-70">({lang.proficiency})</span>
                <button onClick={() => update({ languages: state.languages.filter(x => x.id !== lang.id) })} className="ml-1 opacity-70 hover:opacity-100">
                  ×
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </StepWrapper>
  );
}

// Step 15 — Interests
const POPULAR_INTERESTS = ["Open Source", "Hackathons", "Chess", "Reading", "Photography", "Music", "Hiking", "AI Research", "Gaming", "Blogging", "Podcasts", "Cooking"];

interface Step15Props { state: BuilderState; update: (p: Partial<BuilderState>) => void; }
export function Step15_Interests({ state, update }: Step15Props) {
  const [input, setInput] = useState("");

  const toggle = (interest: string) => {
    if (state.interests.includes(interest)) {
      update({ interests: state.interests.filter(i => i !== interest) });
    } else {
      update({ interests: [...state.interests, interest] });
    }
  };

  const addCustom = () => {
    const val = input.trim();
    if (!val || state.interests.includes(val)) return;
    update({ interests: [...state.interests, val] });
    setInput("");
  };

  return (
    <StepWrapper badge="Step 15" title="Interests & Hobbies" description="Optional, but adds personality. Great for cultural fit conversations.">
      <div className="max-w-2xl space-y-6">
        <div className="flex flex-wrap gap-3">
          {POPULAR_INTERESTS.map((interest) => {
            const selected = state.interests.includes(interest);
            return (
              <button key={interest} onClick={() => toggle(interest)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm border transition-all duration-150",
                  selected ? "bg-accent text-accent-foreground border-accent shadow-md" : "bg-card border-border/50 text-muted-foreground hover:border-accent/50 hover:text-foreground"
                )}
              >{interest}</button>
            );
          })}
        </div>

        {state.interests.filter(i => !POPULAR_INTERESTS.includes(i)).length > 0 && (
          <div className="flex flex-wrap gap-2">
            {state.interests.filter(i => !POPULAR_INTERESTS.includes(i)).map((i) => (
              <span key={i} className="flex items-center gap-1 bg-muted text-foreground text-sm px-3 py-1.5 rounded-full border border-border">
                {i}
                <button onClick={() => update({ interests: state.interests.filter(x => x !== i) })} className="text-muted-foreground hover:text-destructive ml-1">×</button>
              </span>
            ))}
          </div>
        )}

        <div className="flex gap-3">
          <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addCustom()} placeholder="Add custom interest..." className={cn(inputCls, "flex-1")} />
          <button onClick={addCustom} className="px-4 py-2 rounded-xl bg-muted text-foreground text-sm font-semibold hover:bg-muted/80">Add</button>
        </div>
      </div>
    </StepWrapper>
  );
}
