"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { BuilderState, INITIAL_STATE, STEP_LABELS } from "@/types";
import { BuilderProgressBar } from "@/components/builder/BuilderProgressBar";
import { BuilderSidebar } from "@/components/builder/BuilderSidebar";
import { BuilderNavigation } from "@/components/builder/BuilderNavigation";
import { DashboardTopNav } from "@/components/dashboard/TopNav";
import { MobileStepsDrawer } from "@/components/builder/MobileStepsDrawer";
import { LayoutList } from "lucide-react";
import { BuilderWelcomeScreen } from "@/components/builder/BuilderWelcomeScreen";
import {
  createBuilderDraft,
  hydrateBuilderState,
  readResumeDraft,
  useResumeDraftSnapshot,
  saveResumeDraft,
} from "@/lib/resume-draft";
import {
  getBuilderStepValidationErrors,
  getFirstInvalidBuilderStep,
  isBuilderStepValid,
  isBuilderReadyForStudio,
} from "@/lib/builder-validation";
import { CLOUD_DRAFT_RESTORED_EVENT } from "@/providers/cloud-sync-provider";

import { Step01_CareerGoal } from "@/components/builder/Step01_CareerGoal";
import { Step02_TargetRole } from "@/components/builder/Step02_TargetRole";
import { Step03_Experience } from "@/components/builder/Step03_Experience";
import { Step04_TargetCompany } from "@/components/builder/Step04_TargetCompany";
import { Step05_PersonalInfo } from "@/components/builder/Step05_PersonalInfo";
import { Step06_Summary } from "@/components/builder/Step06_Summary";
import { Step07_Skills } from "@/components/builder/Step07_Skills";
import { Step08_Projects } from "@/components/builder/Step08_Projects";
import { Step09_WorkExperience } from "@/components/builder/Step09_WorkExperience";
import { Step10_Education } from "@/components/builder/Step10_Education";
import { Step11_Achievements, Step12_Certificates } from "@/components/builder/Step11_12_AchievementsCerts";
import { Step13_Leadership, Step14_Languages, Step15_Interests } from "@/components/builder/Step13_14_15_Extras";
import { Step16_Review } from "@/components/builder/Step16_Review";

const TOTAL_STEPS = STEP_LABELS.length;
const OPTIONAL_STEPS = new Set([3, 7, 10, 11, 12, 13, 14]);

export default function BuilderPage() {
  const router = useRouter();
  const draft = useResumeDraftSnapshot();
  const [state, setState] = useState<BuilderState>(INITIAL_STATE);
  const [autoSaved, setAutoSaved] = useState<Date | null>(null);
  const [showMobileSteps, setShowMobileSteps] = useState(false);
  // Always start as false (for SSR/client consistency), then update after mount
  const [started, setStarted] = useState(false);
  const skipNextSave = useRef(true);

  // After mount: restore from localStorage if a draft exists
  useEffect(() => {
    const existing = readResumeDraft();
    if (existing?.builder) {
      skipNextSave.current = true;
      setState(hydrateBuilderState(existing.builder));
      setStarted(true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const restoreCloudDraft = () => {
      const restored = readResumeDraft();
      if (!restored?.builder) return;
      skipNextSave.current = true;
      setState(hydrateBuilderState(restored.builder));
      setStarted(true);
    };

    window.addEventListener(CLOUD_DRAFT_RESTORED_EVENT, restoreCloudDraft);
    return () => window.removeEventListener(CLOUD_DRAFT_RESTORED_EVENT, restoreCloudDraft);
  }, []);

  const update = useCallback((partial: Partial<BuilderState>) => {
    setState((prev) => ({ ...prev, ...partial }));
  }, []);

  const goToStep = useCallback((step: number) => {
    if (step < 0 || step >= TOTAL_STEPS) return;
    setState((prev) => ({ ...prev, currentStep: step }));
    // Scroll to top on step change
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const nextStep = useCallback(() => goToStep(state.currentStep + 1), [state.currentStep, goToStep]);
  const prevStep = useCallback(() => goToStep(state.currentStep - 1), [state.currentStep, goToStep]);

  useEffect(() => {
    if (skipNextSave.current) {
      skipNextSave.current = false;
      return;
    }

    const timer = setTimeout(() => {
      const savedAt = new Date();
      const existing = readResumeDraft();
      saveResumeDraft(createBuilderDraft(state, existing, savedAt));
      setAutoSaved(savedAt);
    }, 500);
    return () => clearTimeout(timer);
  }, [state]);

  const currentStepErrors = getBuilderStepValidationErrors(state.currentStep, state);
  const currentStepIsValid = isBuilderStepValid(state.currentStep, state);
  const canGenerateResume = isBuilderReadyForStudio(state);
  const firstInvalidStep = getFirstInvalidBuilderStep(state);

  const openStudio = useCallback(() => {
    if (!canGenerateResume) {
      if (firstInvalidStep !== null) {
        goToStep(firstInvalidStep);
      }
      return;
    }

    const savedAt = new Date();
    const existing = readResumeDraft();
    saveResumeDraft(createBuilderDraft(state, existing, savedAt));
    router.push("/studio");
  }, [canGenerateResume, firstInvalidStep, goToStep, router, state]);

  const renderStep = () => {
    const props = { state, update };
    switch (state.currentStep) {
      case 0:  return <Step01_CareerGoal {...props} validationError={currentStepErrors.careerGoal} />;
      case 1:  return <Step02_TargetRole {...props} validationError={currentStepErrors.targetRole} />;
      case 2:  return <Step03_Experience {...props} />;
      case 3:  return <Step04_TargetCompany {...props} />;
      case 4:  return <Step05_PersonalInfo {...props} validationErrors={currentStepErrors.personalInfo} />;
      case 5:  return <Step06_Summary {...props} />;
      case 6:  return <Step07_Skills {...props} validationError={currentStepErrors.skills} />;
      case 7:  return <Step08_Projects {...props} validationError={currentStepErrors.projects} />;
      case 8:  return <Step09_WorkExperience {...props} />;
      case 9:  return <Step10_Education {...props} validationError={currentStepErrors.education} />;
      case 10: return <Step11_Achievements {...props} />;
      case 11: return <Step12_Certificates {...props} />;
      case 12: return <Step13_Leadership {...props} />;
      case 13: return <Step14_Languages {...props} />;
      case 14: return <Step15_Interests {...props} />;
      case 15: return (
        <Step16_Review
          state={state}
          onGoToStep={goToStep}
          onGenerate={openStudio}
          canGenerate={canGenerateResume}
        />
      );
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">

      {/* Top Nav — always rendered to avoid hydration mismatch */}
      <DashboardTopNav />

      {/* Welcome screen — shown before builder starts */}
      <AnimatePresence mode="wait">
        {!started && (
          <motion.div key="welcome" initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
            <BuilderWelcomeScreen onStart={() => setStarted(true)} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Builder shell — shown after welcome */}
      {started && (
        <div className="flex-1 flex flex-col">
          {/* Top Progress Bar */}
          <BuilderProgressBar
            currentStep={state.currentStep}
            totalSteps={TOTAL_STEPS}
            lastSaved={autoSaved}
          />

          {/* Main 2-column Layout */}
          <div className="flex-1 max-w-7xl mx-auto w-full px-4 py-10 flex gap-10">

            {/* Main Content Area */}
            <main className="flex-1 min-w-0">
              <AnimatePresence mode="wait">
                <div key={state.currentStep}>
                  {renderStep()}
                </div>
              </AnimatePresence>

              <BuilderNavigation
                currentStep={state.currentStep}
                totalSteps={TOTAL_STEPS}
                onNext={nextStep}
                onPrev={prevStep}
                onSkip={nextStep}
                isOptional={OPTIONAL_STEPS.has(state.currentStep)}
                isNextDisabled={state.currentStep === TOTAL_STEPS - 1 ? !canGenerateResume : !currentStepIsValid}
              />
            </main>

            {/* Right Sidebar — desktop only */}
            <BuilderSidebar state={state} onGoToStep={goToStep} />
          </div>

          {/* Mobile FAB — open steps drawer */}
          <div className="fixed bottom-6 right-6 z-40 xl:hidden">
            <button
              onClick={() => setShowMobileSteps(true)}
              className="flex items-center gap-2 bg-foreground text-background px-4 py-3 rounded-full shadow-xl text-sm font-semibold"
            >
              <LayoutList className="w-4 h-4" />
              Sections
            </button>
          </div>

          {/* Mobile Steps Drawer */}
          <AnimatePresence>
            {showMobileSteps && (
              <>
                <motion.div
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/50 z-40"
                  onClick={() => setShowMobileSteps(false)}
                />
                <MobileStepsDrawer
                  state={state}
                  onGoToStep={goToStep}
                  onClose={() => setShowMobileSteps(false)}
                />
              </>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
