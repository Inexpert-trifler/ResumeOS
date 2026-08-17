// ============================
// RESUME DATA TYPES
// ============================

export type SectionType =
  | "header" | "summary" | "experience" | "education"
  | "skills" | "projects" | "achievements" | "certificates"
  | "leadership" | "languages" | "interests";

export interface ResumeHeader {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  portfolio: string;
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

export interface ResumeProject {
  id: string;
  name: string;
  description: string;
  tech: string[];
  github?: string;
  demo?: string;
  bullets: string[];
}

export interface ResumeSkillGroup {
  id: string;
  category: string;
  skills: string[];
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

export interface ResumeLeadership {
  id: string;
  role: string;
  org: string;
  duration: string;
  bullets: string[];
}

export interface ResumeLanguage {
  id: string;
  name: string;
  level: string;
}

export interface ResumeSection {
  id: string;
  type: SectionType;
  label: string;
  visible: boolean;
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
  leadership: ResumeLeadership[];
  languages: ResumeLanguage[];
  interests: string[];
}

export type TemplateId = "classic" | "modern" | "minimal" | "corporate";
export type ThemeId = "light" | "dark" | "slate";

export interface StudioSettings {
  template: TemplateId;
  theme: ThemeId;
  accentColor: string;
  fontFamily: string;
  fontSize: number;
  lineHeight: number;
  margins: number;
  zoom: number;
}

export interface StudioState {
  resume: ResumeData;
  sections: ResumeSection[];
  settings: StudioSettings;
  history: ResumeData[];
  historyIndex: number;
  activeSectionId: string | null;
}

export type StudioAction =
  | { type: "UPDATE_HEADER"; payload: Partial<ResumeHeader> }
  | { type: "UPDATE_SUMMARY"; payload: string }
  | { type: "UPDATE_EXPERIENCE"; payload: ResumeExperience[] }
  | { type: "UPDATE_EDUCATION"; payload: ResumeEducation[] }
  | { type: "UPDATE_SKILLS"; payload: ResumeSkillGroup[] }
  | { type: "UPDATE_PROJECTS"; payload: ResumeProject[] }
  | { type: "UPDATE_ACHIEVEMENTS"; payload: ResumeAchievement[] }
  | { type: "UPDATE_CERTIFICATES"; payload: ResumeCertificate[] }
  | { type: "UPDATE_LEADERSHIP"; payload: ResumeLeadership[] }
  | { type: "UPDATE_LANGUAGES"; payload: ResumeLanguage[] }
  | { type: "UPDATE_INTERESTS"; payload: string[] }
  | { type: "REORDER_SECTIONS"; payload: ResumeSection[] }
  | { type: "TOGGLE_SECTION"; payload: string }
  | { type: "UPDATE_SETTINGS"; payload: Partial<StudioSettings> }
  | { type: "SET_ACTIVE_SECTION"; payload: string | null }
  | { type: "HYDRATE"; payload: { resume: ResumeData; sections: ResumeSection[]; settings: StudioSettings } }
  | { type: "UNDO" }
  | { type: "REDO" };
