export type CareerStage = "Intern" | "Student" | "Fresher" | "0-1 Years" | "1-3 Years" | "3-5 Years" | "5-10 Years" | "10+ Years" | "Executive";

export const STAGES: CareerStage[] = [
  "Intern", "Student", "Fresher", "0-1 Years", "1-3 Years", 
  "3-5 Years", "5-10 Years", "10+ Years", "Executive"
];

export const ROLES = [
  "Software Engineer", "Frontend", "Backend", "Full Stack", "AI Engineer", 
  "Machine Learning", "Data Analyst", "Cloud Engineer", "Cyber Security", 
  "DevOps", "Android", "iOS", "Game Developer", "UI UX", "Graphic Designer", 
  "Marketing", "Sales", "Finance", "Business Analyst", "Product Manager", 
  "HR", "Teacher", "Doctor", "Lawyer", "Civil", "Mechanical", "Electrical", "Custom"
];

export interface Template {
  id: string;
  name: string;
  category: string;
  careerStages: CareerStage[];
  atsScore: number;
  readability: number;
  modernScore: number;
  minimalScore: number;
  popularity: number;
  pages: "1 Page" | "2 Pages" | "Both";
  difficulty: "Easy" | "Medium" | "Hard";
  bestFor: string[];
  avoidIf: string[];
  strengths: string[];
  weaknesses: string[];
  recommendedFont: string;
  image: string;
}

export const TEMPLATES: Template[] = [
  {
    id: "t-minimal-1",
    name: "The Oxford Minimal",
    category: "Minimal",
    careerStages: ["Student", "Intern", "Fresher", "0-1 Years", "1-3 Years"],
    atsScore: 99,
    readability: 95,
    modernScore: 60,
    minimalScore: 100,
    popularity: 98,
    pages: "1 Page",
    difficulty: "Easy",
    bestFor: ["Software Engineering", "Finance", "Academia"],
    avoidIf: ["Design Roles", "Marketing"],
    strengths: ["Flawless ATS parsing", "High information density", "Classic look"],
    weaknesses: ["Can look plain", "Strict length constraints"],
    recommendedFont: "Inter or Helvetica",
    image: "/mockups/template-1.jpg" // We will use placeholder gradients if images don't exist
  },
  {
    id: "t-modern-corp",
    name: "Silicon Valley Standard",
    category: "Professional",
    careerStages: ["1-3 Years", "3-5 Years", "5-10 Years"],
    atsScore: 95,
    readability: 90,
    modernScore: 85,
    minimalScore: 80,
    popularity: 92,
    pages: "Both",
    difficulty: "Medium",
    bestFor: ["Tech", "Product Management", "Marketing"],
    avoidIf: ["Traditional Law", "Medicine"],
    strengths: ["Great use of whitespace", "Modern typography", "Scannable headers"],
    weaknesses: ["Requires concise writing to look good"],
    recommendedFont: "Geist or SF Pro",
    image: "/mockups/template-2.jpg"
  },
  {
    id: "t-executive",
    name: "The Boardroom",
    category: "Executive",
    careerStages: ["10+ Years", "Executive"],
    atsScore: 92,
    readability: 88,
    modernScore: 75,
    minimalScore: 70,
    popularity: 85,
    pages: "2 Pages",
    difficulty: "Hard",
    bestFor: ["C-Suite", "Directors", "VP Level"],
    avoidIf: ["Entry Level", "Individual Contributors"],
    strengths: ["Handles large amounts of text", "Authoritative layout", "Clear summary section"],
    weaknesses: ["Too heavy for junior roles"],
    recommendedFont: "Garamond or Merriweather",
    image: "/mockups/template-3.jpg"
  },
  {
    id: "t-creative",
    name: "The Visionary",
    category: "Creative",
    careerStages: ["Intern", "Fresher", "1-3 Years", "3-5 Years"],
    atsScore: 75,
    readability: 95,
    modernScore: 100,
    minimalScore: 50,
    popularity: 70,
    pages: "1 Page",
    difficulty: "Medium",
    bestFor: ["UI/UX", "Graphic Design", "Frontend"],
    avoidIf: ["Finance", "Engineering (Strict ATS)"],
    strengths: ["Stands out visually", "Shows design skills implicitly"],
    weaknesses: ["May fail older ATS systems", "Distracting for traditional roles"],
    recommendedFont: "Outfit or Plus Jakarta Sans",
    image: "/mockups/template-4.jpg"
  }
];
