import { ResumeData, ResumeSection, StudioSettings } from '@/types';

export const MOCK_RESUME: ResumeData = {
  header: {
    name: "Alex Morgan",
    title: "Senior Software Engineer",
    email: "alex.morgan@email.com",
    phone: "+1 (555) 234-5678",
    location: "San Francisco, CA",
    linkedin: "linkedin.com/in/alexmorgan",
    github: "github.com/alexmorgan",
    portfolio: "alexmorgan.dev",
  },
  summary:
    "Full-stack engineer with 6+ years building scalable web applications. Led migration of monolith to microservices architecture serving 2M+ users, reducing infrastructure costs by 35%. Passionate about developer experience, system design, and building products that matter.",
  experience: [
    {
      id: "exp-1",
      company: "Stripe",
      role: "Senior Software Engineer",
      startDate: "Jan 2022",
      endDate: "Present",
      location: "San Francisco, CA",
      bullets: [
        "Led migration of payment processing service to event-driven architecture, reducing latency by 40% and handling 100K+ TPS",
        "Architected and launched Stripe's fraud detection ML pipeline, reducing chargebacks by $4.2M annually",
        "Mentored 4 junior engineers and led bi-weekly tech talks attended by 50+ engineers",
        "Reduced CI/CD pipeline runtime from 45 minutes to 8 minutes, saving $120K/year in compute costs",
      ],
    },
    {
      id: "exp-2",
      company: "Airbnb",
      role: "Software Engineer",
      startDate: "Jun 2019",
      endDate: "Dec 2021",
      location: "San Francisco, CA",
      bullets: [
        "Built host tools dashboard used by 4M+ hosts globally, improving listing completion rate by 22%",
        "Designed and implemented real-time pricing recommendation engine using React and GraphQL",
        "Led Search Ranking team's A/B testing framework overhaul, enabling 3x faster experiment velocity",
      ],
    },
    {
      id: "exp-3",
      company: "Startup (Stealth)",
      role: "Full Stack Engineer",
      startDate: "Jan 2018",
      endDate: "May 2019",
      location: "Remote",
      bullets: [
        "Built the entire product from scratch using Next.js, Node.js, and PostgreSQL",
        "Shipped 0 to 1 MVP in 3 months, acquiring first 500 paying customers",
      ],
    },
  ],
  education: [
    {
      id: "edu-1",
      institution: "University of California, Berkeley",
      degree: "B.S.",
      field: "Computer Science",
      startDate: "2014",
      endDate: "2018",
      gpa: "3.85 / 4.0",
      achievements: ["Dean's List", "ACM ICPC Regional Finalist"],
    },
  ],
  skills: [
    {
      id: "sk-1",
      category: "Languages",
      skills: ["TypeScript", "Python", "Go", "Rust", "SQL"],
    },
    {
      id: "sk-2",
      category: "Frontend",
      skills: ["React", "Next.js", "Framer Motion", "TailwindCSS", "GraphQL"],
    },
    {
      id: "sk-3",
      category: "Backend & Cloud",
      skills: ["Node.js", "PostgreSQL", "Redis", "AWS", "Kubernetes", "Docker"],
    },
  ],
  projects: [
    {
      id: "proj-1",
      name: "ResumeOS",
      description: "AI-powered resume builder with live editor and ATS scoring",
      tech: ["Next.js", "OpenAI", "PostgreSQL", "Stripe"],
      github: "github.com/alexmorgan/resumeos",
      demo: "resumeos.app",
      bullets: [
        "Built from 0 to 5,000 monthly active users in 6 months",
        "Integrated GPT-4 for real-time resume suggestions and rewriting",
        "99.9% uptime with automated deployment pipeline",
      ],
    },
    {
      id: "proj-2",
      name: "Distributed Task Queue",
      description: "High-throughput task queue system built in Go",
      tech: ["Go", "Redis", "gRPC", "Prometheus"],
      github: "github.com/alexmorgan/taskq",
      bullets: [
        "Handles 50K+ jobs/second with sub-millisecond latency",
        "Open-sourced with 2.1K GitHub stars",
      ],
    },
  ],
  achievements: [
    {
      id: "ach-1",
      title: "TechCrunch Disrupt Hackathon Winner",
      description: "1st Place out of 300+ teams for AI-powered accessibility tool",
      date: "2023",
    },
    {
      id: "ach-2",
      title: "Forbes 30 Under 30 Nominee",
      description: "Nominated in Technology category for contributions to open source",
      date: "2022",
    },
  ],
  certificates: [
    {
      id: "cert-1",
      name: "AWS Solutions Architect Professional",
      issuer: "Amazon Web Services",
      date: "2023",
      url: "credly.com/alex",
    },
    {
      id: "cert-2",
      name: "Certified Kubernetes Administrator",
      issuer: "CNCF",
      date: "2022",
    },
  ],
  leadership: [
    {
      id: "lead-1",
      role: "Tech Lead",
      org: "Open Source Community, San Francisco",
      duration: "2021 – Present",
      bullets: [
        "Organize monthly meetups with 200+ engineers",
        "Mentor 12 early-career engineers through 1:1 sessions",
      ],
    },
  ],
  languages: [
    { id: "lang-1", name: "English", level: "Native" },
    { id: "lang-2", name: "Spanish", level: "Fluent" },
    { id: "lang-3", name: "Mandarin", level: "Basic" },
  ],
  interests: ["Open Source", "Rock Climbing", "Chess", "Technical Writing", "Podcasting"],
};

export const DEFAULT_SECTIONS: ResumeSection[] = [
  { id: "header",       type: "header",       label: "Header",        visible: true },
  { id: "summary",      type: "summary",      label: "Summary",       visible: true },
  { id: "experience",   type: "experience",   label: "Experience",    visible: true },
  { id: "education",    type: "education",    label: "Education",     visible: true },
  { id: "skills",       type: "skills",       label: "Skills",        visible: true },
  { id: "projects",     type: "projects",     label: "Projects",      visible: true },
  { id: "achievements", type: "achievements", label: "Achievements",  visible: true },
  { id: "certificates", type: "certificates", label: "Certificates",  visible: true },
  { id: "leadership",   type: "leadership",   label: "Leadership",    visible: false },
  { id: "languages",    type: "languages",    label: "Languages",     visible: true },
  { id: "interests",    type: "interests",    label: "Interests",     visible: false },
];

export const DEFAULT_SETTINGS: StudioSettings = {
  template: "classic",
  theme: "light",
  accentColor: "#6366f1",
  fontFamily: "Inter",
  fontSize: 10,
  lineHeight: 1.4,
  margins: 32,
  zoom: 100,
};

export const AI_SUGGESTIONS = [
  {
    id: "s1",
    type: "weak-bullet",
    section: "Experience",
    severity: "high",
    original: "Worked on payment processing service",
    suggestion: "Led migration of payment processing service to event-driven architecture, reducing latency by 40%",
    reason: "Add specific metrics and action verbs to quantify impact.",
  },
  {
    id: "s2",
    type: "missing-skill",
    section: "Skills",
    severity: "medium",
    suggestion: "Add 'System Design' to your skills — it appears in 87% of Senior SWE job descriptions.",
    reason: "ATS keyword match improvement",
  },
  {
    id: "s3",
    type: "grammar",
    section: "Summary",
    severity: "low",
    original: "Passionate about developer experience",
    suggestion: "Consider replacing 'passionate' with a specific achievement. Recruiters see 'passionate' in 92% of resumes.",
    reason: "Overused word — stand out with specifics.",
  },
  {
    id: "s4",
    type: "ats",
    section: "Summary",
    severity: "high",
    suggestion: "Add keywords: 'distributed systems', 'API design', 'cloud infrastructure' — missing from your summary but in target job descriptions.",
    reason: "ATS score improvement — these are top keywords.",
  },
  {
    id: "s5",
    type: "recruiter-tip",
    section: "Projects",
    severity: "medium",
    suggestion: "Add impact metrics to your ResumeOS project — monthly revenue, % growth, or user retention would make this stand out.",
    reason: "Numbers catch a recruiter's eye immediately.",
  },
];
