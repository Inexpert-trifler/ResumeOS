import type { BuilderState } from "@/types";

export interface PersonalInfoValidationErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  location?: string;
}

export interface BuilderValidationErrors {
  careerGoal?: string;
  targetRole?: string;
  personalInfo?: PersonalInfoValidationErrors;
  skills?: string;
  projects?: string;
  education?: string;
}

const REQUIRED_STEPS = [0, 1, 4, 6, 7, 9] as const;

function isBlank(value: string | null | undefined): boolean {
  return !value || !value.trim();
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function hasErrors(errors: BuilderValidationErrors): boolean {
  return Boolean(
    errors.careerGoal ||
      errors.targetRole ||
      errors.skills ||
      errors.projects ||
      errors.education ||
      (errors.personalInfo && Object.keys(errors.personalInfo).length > 0)
  );
}

export function getBuilderStepValidationErrors(step: number, state: BuilderState): BuilderValidationErrors {
  switch (step) {
    case 0:
      return state.careerGoal ? {} : { careerGoal: "Select a career goal to continue." };
    case 1:
      return isBlank(state.targetRole) ? { targetRole: "Enter a target role to continue." } : {};
    case 4: {
      const personalInfo: PersonalInfoValidationErrors = {};

      if (isBlank(state.personalInfo.firstName)) personalInfo.firstName = "First name is required.";
      if (isBlank(state.personalInfo.lastName)) personalInfo.lastName = "Last name is required.";
      if (isBlank(state.personalInfo.email)) {
        personalInfo.email = "Email is required.";
      } else if (!isValidEmail(state.personalInfo.email)) {
        personalInfo.email = "Enter a valid email address.";
      }
      if (isBlank(state.personalInfo.phone)) personalInfo.phone = "Phone is required.";
      if (isBlank(state.personalInfo.location)) personalInfo.location = "Location is required.";

      return Object.keys(personalInfo).length > 0 ? { personalInfo } : {};
    }
    case 6:
      return state.skills.length > 0
        ? {}
        : { skills: "Add at least one skill to continue." };
    case 7: {
      if (state.projects.length === 0) {
        return { projects: "Add at least one project to continue." };
      }

      const hasIncompleteProject = state.projects.some((project) => isBlank(project.name));
      return hasIncompleteProject ? { projects: "Each project needs a project name." } : {};
    }
    case 9: {
      if (state.education.length === 0) {
        return { education: "Add at least one education entry to continue." };
      }

      const hasIncompleteEducation = state.education.some((education) => isBlank(education.institution));
      return hasIncompleteEducation ? { education: "Each education entry needs an institution." } : {};
    }
    default:
      return {};
  }
}

export function isBuilderStepValid(step: number, state: BuilderState): boolean {
  return !hasErrors(getBuilderStepValidationErrors(step, state));
}

export function getFirstInvalidBuilderStep(state: BuilderState): number | null {
  for (const step of REQUIRED_STEPS) {
    if (!isBuilderStepValid(step, state)) {
      return step;
    }
  }
  return null;
}

export function isBuilderReadyForStudio(state: BuilderState): boolean {
  return getFirstInvalidBuilderStep(state) === null;
}
