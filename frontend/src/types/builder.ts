// ============================
// BUILDER TYPE DEFINITIONS
// ============================

export type CareerGoal =
  | "Internship" | "Full Time" | "Career Switch" | "Promotion"
  | "Higher Studies" | "Freelance" | "Remote Job" | "Custom";

export type ExperienceLevel =
  | "Student" | "Fresher" | "0-1 Years" | "1-3 Years" | "3-5 Years" | "5-10 Years" | "10+ Years";

export type CompanyType = "Startup" | "FAANG" | "MNC" | "Government" | "Custom";

export interface PersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  portfolio: string;
}

export interface Skill {
  id: string;
  name: string;
  level?: "Beginner" | "Intermediate" | "Advanced" | "Expert";
  category?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  techStack: string[];
  github: string;
  liveDemo: string;
  role: string;
  duration: string;
  keyFeatures: string[];
  challenges: string;
  achievements: string;
}

export interface WorkExperience {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  current: boolean;
  location: string;
  responsibilities: string[];
  achievements: string[];
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  current: boolean;
  gpa: string;
  achievements: string[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  date: string;
}

export interface Certificate {
  id: string;
  name: string;
  issuer: string;
  date: string;
  credentialId: string;
  url: string;
}

export interface Leadership {
  id: string;
  role: string;
  organization: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Language {
  id: string;
  name: string;
  proficiency: "Native" | "Fluent" | "Intermediate" | "Basic";
}

export interface BuilderState {
  currentStep: number;
  careerGoal: CareerGoal | null;
  targetRole: string;
  experienceLevel: ExperienceLevel | null;
  targetCompany: string;
  companyType: CompanyType | null;
  personalInfo: PersonalInfo;
  summary: string;
  skills: Skill[];
  projects: Project[];
  experience: WorkExperience[];
  education: Education[];
  achievements: Achievement[];
  certificates: Certificate[];
  leadership: Leadership[];
  languages: Language[];
  interests: string[];
  lastSaved: Date | null;
}

export const STEP_LABELS = [
  "Career Goal", "Target Role", "Experience", "Target Company",
  "Personal Info", "Summary", "Skills", "Projects", "Experience",
  "Education", "Achievements", "Certificates", "Leadership",
  "Languages", "Interests", "Review"
];

export const INITIAL_STATE: BuilderState = {
  currentStep: 0,
  careerGoal: null,
  targetRole: "",
  experienceLevel: null,
  targetCompany: "",
  companyType: null,
  personalInfo: {
    firstName: "", lastName: "", email: "", phone: "",
    location: "", linkedin: "", github: "", portfolio: ""
  },
  summary: "",
  skills: [],
  projects: [],
  experience: [],
  education: [],
  achievements: [],
  certificates: [],
  leadership: [],
  languages: [],
  interests: [],
  lastSaved: null,
};
