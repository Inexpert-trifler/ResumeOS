// ─── Resume domain types (mirror of frontend) ────────────────────────────────
// Sprint 1: only what the export-pdf route needs.

export interface ResumeHeader {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
}

export interface ResumeExperience {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  location: string;
  bullets: string[];
}

export interface ResumeEducation {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  gpa?: string;
  achievements: string[];
}

export interface ResumeSkillGroup {
  id: string;
  category: string;
  skills: string[];
}

export interface ResumeProject {
  id: string;
  name: string;
  description: string;
  tech: string[];
  github?: string;
  demo?: string;
  bullets: string[];
}

export interface ResumeAchievement {
  id: string;
  title: string;
  description: string;
  date: string;
}

export interface ResumeCertificate {
  id: string;
  name: string;
  issuer: string;
  date: string;
  url?: string;
}

export interface ResumeLanguage {
  id: string;
  name: string;
  level: string;
}

export interface ResumeData {
  header: ResumeHeader;
  summary: string;
  experience: ResumeExperience[];
  education: ResumeEducation[];
  skills: ResumeSkillGroup[];
  projects: ResumeProject[];
  achievements: ResumeAchievement[];
  certificates: ResumeCertificate[];
  languages: ResumeLanguage[];
  interests: string[];
}

export interface StudioSettings {
  template: string;
  accentColor: string;
  fontFamily: string;
  fontSize: number;
  lineHeight: number;
  margins: number;
}

export interface ExportPdfRequest {
  resume: ResumeData;
  settings: StudioSettings;
}
