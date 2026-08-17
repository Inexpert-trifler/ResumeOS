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

// ─── Job Intelligence Engine types ────────────────────────────────────────────

export interface ParsedJobData {
  jobTitle: string;
  company: string;
  seniorityLevel: string;
  requiredExperience: string;
  preferredExperience: string;
  technicalSkills: string[];
  softSkills: string[];
  responsibilities: string[];
  qualifications: string[];
  educationRequirements: string[];
  certifications: string[];
  tools: string[];
  programmingLanguages: string[];
  frameworks: string[];
  databases: string[];
  cloudPlatforms: string[];
  keywords: string[];
  atsKeywords: string[];
  actionVerbs: string[];
}

export type KeywordCategory = 'required' | 'preferred' | 'optional';
export type KeywordType = 'technical' | 'soft' | 'action' | 'ats' | 'tool' | 'language' | 'framework' | 'database' | 'cloud';

export interface JobKeyword {
  id: string;
  jobId: string;
  keyword: string;
  category: KeywordCategory;
  keywordType: KeywordType;
  frequency: number;
  weight: number;
  createdAt: string;
}

export interface JobAnalysis {
  id: string;
  jobId: string;
  jobComplexity: number | null;
  atsDifficulty: number | null;
  technicalDepth: number | null;
  leadershipRequirement: number | null;
  communicationRequirement: number | null;
  estimatedCompetition: 'low' | 'medium' | 'high' | 'very-high' | null;
  seniorityLevel: string | null;
  insights: string[] | null;
  createdAt: string;
}

export type JobStatus = 'saved' | 'applied' | 'interviewing' | 'offer' | 'rejected';
export type EmploymentType = 'full-time' | 'part-time' | 'contract' | 'internship' | 'freelance';
export type WorkMode = 'remote' | 'hybrid' | 'on-site';

export interface JobDescription {
  id: string;
  userId: string;
  jobTitle: string;
  company: string;
  location: string | null;
  employmentType: EmploymentType | null;
  workMode: WorkMode | null;
  salary: string | null;
  notes: string | null;
  rawDescription: string;
  parsedData: ParsedJobData | null;
  status: JobStatus;
  isParsed: boolean;
  createdAt: string;
  updatedAt: string;
  // Included when fetching single job (GET /api/jobs/:id)
  keywords?: JobKeyword[];
  analysis?: JobAnalysis | null;
  linkedResumes?: { resumeId: string; createdAt: string }[];
}

export interface JobCreatePayload {
  jobTitle: string;
  company: string;
  rawDescription: string;
  location?: string | null;
  employmentType?: EmploymentType | null;
  workMode?: WorkMode | null;
  salary?: string | null;
  notes?: string | null;
}

export interface JobUpdatePayload extends Partial<JobCreatePayload> {
  status?: JobStatus;
}

export interface JobAnalyzeResponse {
  parsed: ParsedJobData;
  keywords: JobKeyword[];
  analysis: JobAnalysis;
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

