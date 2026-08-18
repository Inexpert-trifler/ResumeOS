"use client";

import { useEffect, useMemo, useState } from "react";
import { Loader2, Sparkles, WandSparkles, AlertCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  requestAiImprovement,
  type AiImprovementLength,
  type AiImprovementSectionType,
  type AiImprovementTargetField,
  type AiImprovementTone,
} from "@/services/ai";
import { aiImprovementLengths, aiImprovementTones } from "@/services/ai/types";

interface BuilderAiAssistantProps {
  sectionType: AiImprovementSectionType;
  targetField: AiImprovementTargetField;
  fieldLabel: string;
  currentText: string;
  onApply: (nextText: string) => void;
  targetRole?: string;
  targetCompany?: string;
  builderContext?: Record<string, unknown>;
  userInstruction?: string;
  triggerLabel?: string;
  allowInsert?: boolean;
  className?: string;
}

function defaultInstruction(fieldLabel: string, targetRole?: string, targetCompany?: string) {
  const role = targetRole?.trim() || "the target role";
  const company = targetCompany?.trim() ? ` at ${targetCompany.trim()}` : "";
  return `Improve this ${fieldLabel.toLowerCase()} for ${role}${company}. Keep the wording grounded in the facts already present, avoid fabrication, and make it recruiter-friendly and ATS-safe.`;
}

function joinContextLines(lines: Array<string | null | undefined>) {
  return lines.filter((line): line is string => Boolean(line && line.trim())).join(" • ");
}

export function BuilderAiAssistant({
  sectionType,
  targetField,
  fieldLabel,
  currentText,
  onApply,
  targetRole,
  targetCompany,
  builderContext,
  userInstruction,
  triggerLabel = "Generate with AI",
  allowInsert = true,
  className,
}: BuilderAiAssistantProps) {
  const [open, setOpen] = useState(false);
  const [instruction, setInstruction] = useState("");
  const [tone, setTone] = useState<AiImprovementTone>("professional");
  const [length, setLength] = useState<AiImprovementLength>("balanced");
  const [draftText, setDraftText] = useState(currentText.trim());
  const [explanation, setExplanation] = useState("");
  const [warnings, setWarnings] = useState<string[]>([]);
  const [followUpQuestions, setFollowUpQuestions] = useState<string[]>([]);
  const [needsMoreInfo, setNeedsMoreInfo] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const defaultPrompt = useMemo(
    () => defaultInstruction(fieldLabel, targetRole, targetCompany),
    [fieldLabel, targetCompany, targetRole]
  );

  const canApply = draftText.trim().length > 0 && !needsMoreInfo && !isGenerating;

  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen) {
      setInstruction(userInstruction?.trim() || defaultPrompt);
      setDraftText(currentText.trim());
      setExplanation("");
      setWarnings([]);
      setFollowUpQuestions([]);
      setNeedsMoreInfo(false);
      setError(null);
    }

    setOpen(nextOpen);
  };

  const runImprovement = async () => {
    setIsGenerating(true);
    setError(null);
    setNeedsMoreInfo(false);

    try {
      const response = await requestAiImprovement({
        sectionType,
        targetField,
        originalText: currentText.trim(),
        targetRole,
        targetCompany,
        fieldLabel,
        userInstruction: instruction.trim() || defaultPrompt,
        tone,
        length,
        context: {
          targetLabel: fieldLabel,
          targetSection: sectionType,
          builderContext,
        },
        builderContext,
        resumeContext: builderContext,
      });

      const improved = response.improvedText?.trim();
      setDraftText(improved || currentText.trim());
      setExplanation(response.explanation);
      setWarnings(response.warnings ?? []);
      setFollowUpQuestions(response.followUpQuestions ?? []);
      setNeedsMoreInfo(Boolean(response.needsMoreInfo));
    } catch (improvementError) {
      setError(improvementError instanceof Error ? improvementError.message : "Unable to generate an AI suggestion.");
    } finally {
      setIsGenerating(false);
    }
  };

  const applySuggestion = (mode: "replace" | "insert") => {
    const nextText = draftText.trim();
    if (!nextText || needsMoreInfo) return;

    if (mode === "insert") {
      const base = currentText.trim();
      onApply(base ? `${base}\n${nextText}` : nextText);
    } else {
      onApply(nextText);
    }

    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={
          <Button
            variant="outline"
            size="sm"
            className={cn(
              "gap-2 border-accent/30 bg-accent/5 text-accent hover:bg-accent/10 hover:text-accent",
              className
            )}
          />
        }
      >
        <Sparkles className="w-4 h-4" />
        {triggerLabel}
      </DialogTrigger>

      <DialogContent className="max-w-3xl w-full p-0 overflow-hidden">
        <div className="max-h-[85vh] overflow-y-auto">
          <div className="border-b border-border/50 bg-gradient-to-br from-accent/10 via-background to-background p-5">
            <DialogHeader className="space-y-2">
              <div className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/10 px-3 py-1 text-xs font-semibold text-accent w-fit">
                <WandSparkles className="w-3.5 h-3.5" />
                Contextual AI Assistant
              </div>
              <DialogTitle className="text-xl">{fieldLabel}</DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                The assistant uses your current section text and builder context only. It will not invent facts or overwrite anything until you choose a suggestion.
              </DialogDescription>
            </DialogHeader>
          </div>

          <div className="grid gap-5 p-5">
            <div className="grid gap-3 sm:grid-cols-3">
              <label className="grid gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Tone
                <select
                  value={tone}
                  onChange={(e) => setTone(e.target.value as AiImprovementTone)}
                  className="w-full rounded-xl border border-border/50 bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent/40"
                >
                  {aiImprovementTones.map((item) => (
                    <option key={item} value={item}>
                      {item.charAt(0).toUpperCase() + item.slice(1)}
                    </option>
                  ))}
                </select>
              </label>

              <label className="grid gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Length
                <select
                  value={length}
                  onChange={(e) => setLength(e.target.value as AiImprovementLength)}
                  className="w-full rounded-xl border border-border/50 bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent/40"
                >
                  {aiImprovementLengths.map((item) => (
                    <option key={item} value={item}>
                      {item.charAt(0).toUpperCase() + item.slice(1)}
                    </option>
                  ))}
                </select>
              </label>

              <div className="grid gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <span>Context</span>
                <div className="rounded-xl border border-border/50 bg-muted/30 px-3 py-2 text-[11px] font-medium text-muted-foreground leading-relaxed">
                  {joinContextLines([
                    targetRole ? `Role: ${targetRole}` : null,
                    targetCompany ? `Company: ${targetCompany}` : null,
                    currentText.trim() ? `Current text loaded` : null,
                  ]) || "No extra context provided"}
                </div>
              </div>
            </div>

            <div className="grid gap-3">
              <label className="grid gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Instruction</span>
                <textarea
                  value={instruction}
                  onChange={(e) => setInstruction(e.target.value)}
                  rows={4}
                  className="w-full rounded-2xl border border-border/50 bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/40 resize-y"
                  placeholder={defaultPrompt}
                />
              </label>
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  onClick={runImprovement}
                  disabled={isGenerating}
                  className="gap-2 rounded-full px-5"
                >
                  {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  {isGenerating ? "Generating..." : draftText.trim() ? "Regenerate" : "Generate"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                  className="rounded-full"
                >
                  Cancel
                </Button>
              </div>
            </div>

            {error && (
              <div className="rounded-2xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                {error}
              </div>
            )}

            {needsMoreInfo && (
              <div className="rounded-2xl border border-orange-500/20 bg-orange-500/5 px-4 py-3 text-sm text-orange-600 dark:text-orange-400">
                <div className="flex items-center gap-2 font-semibold">
                  <AlertCircle className="w-4 h-4" />
                  More context is needed before applying a safe suggestion.
                </div>
                {followUpQuestions.length > 0 && (
                  <ul className="mt-2 space-y-1 text-sm">
                    {followUpQuestions.map((question) => (
                      <li key={question}>• {question}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            <div className="grid gap-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold">Generated draft</h3>
                {explanation && <span className="text-xs text-muted-foreground">{explanation}</span>}
              </div>
              <textarea
                value={draftText}
                onChange={(e) => setDraftText(e.target.value)}
                rows={7}
                className="w-full rounded-2xl border border-border/50 bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/40 resize-y"
                placeholder="The improved text will appear here."
              />
              <p className="text-xs text-muted-foreground">
                Edit the suggestion before applying it. The original section stays untouched until you choose Replace or Insert.
              </p>
            </div>
          </div>

          <div className="border-t border-border/50 bg-muted/30 p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-xs text-muted-foreground">
                {warnings.length > 0 ? (
                  <span>{warnings.join(" · ")}</span>
                ) : (
                  <span>ATS-safe, grounded output with deterministic application controls.</span>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {allowInsert && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => applySuggestion("insert")}
                    disabled={!canApply}
                    className="rounded-full"
                  >
                    Insert
                  </Button>
                )}
                <Button
                  type="button"
                  onClick={() => applySuggestion("replace")}
                  disabled={!canApply}
                  className="rounded-full"
                >
                  Replace
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setDraftText("");
                    setExplanation("");
                    setWarnings([]);
                    setFollowUpQuestions([]);
                    setNeedsMoreInfo(false);
                    setError(null);
                  }}
                  className="rounded-full"
                >
                  Clear
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
