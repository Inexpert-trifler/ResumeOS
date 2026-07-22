/**
 * Centralized type exports
 * All application types are re-exported from this index for clean imports.
 * 
 * Usage: import { JobApplication, CoachMessage, BuilderState } from '@/types';
 */

// Builder wizard domain types
export type {
  CareerGoal,
  ExperienceLevel,
  CompanyType,
  PersonalInfo,
  Skill,
  Project,
  WorkExperience,
  Education,
  Achievement,
  Certificate,
  Leadership,
  Language,
  BuilderState,
} from './builder';
export { STEP_LABELS, INITIAL_STATE } from './builder';

// Resume & Studio domain types
export type {
  SectionType,
  ResumeHeader,
  ResumeExperience,
  ResumeEducation,
  ResumeProject,
  ResumeSkillGroup,
  ResumeAchievement,
  ResumeCertificate,
  ResumeLeadership,
  ResumeLanguage,
  ResumeSection,
  ResumeData,
  TemplateId,
  ThemeId,
  StudioSettings,
  StudioState,
  StudioAction,
} from './resume';

// Job Tracker domain types
export interface JobApplication {
  id: string;
  company: string;
  role: string;
  status: 'applied' | 'interviewing' | 'offer' | 'rejected' | 'wishlist' | 'saved';
  dateApplied: string;
  salary?: string;
  location?: string;
  notes?: string;
  url?: string;
}

// ATS Analyzer domain types
export interface AtsKeyword {
  word: string;
  found: boolean;
  importance: 'high' | 'medium' | 'low';
}

export interface AtsSuggestion {
  id: string;
  category: 'keywords' | 'formatting' | 'impact' | 'length' | 'contact';
  priority: 'critical' | 'important' | 'optional';
  message: string;
  fix?: string;
}

export interface AtsAnalysis {
  score: number;
  keywords: { found: AtsKeyword[]; missing: AtsKeyword[] };
  suggestions: AtsSuggestion[];
  sections: { name: string; score: number; feedback: string }[];
}

// AI Coach domain types
export interface CoachMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  suggestions?: string[];
}

export interface ConversationSession {
  id: string;
  title: string;
  messages: CoachMessage[];
  createdAt: string;
  updatedAt: string;
}

// Generic API types
export interface ApiResponse<T> {
  data: T;
  error: string | null;
  status: 'success' | 'error' | 'loading';
}
