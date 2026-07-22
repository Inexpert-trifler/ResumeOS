export const ANALYZER_SCORES = {
  overall: 91,
  ats: 94,
  grammar: 98,
  readability: 88,
  projects: 92,
  experience: 85,
  skills: 95,
  formatting: 100,
  impact: 82,
};

export const ANALYSIS_CARDS = [
  {
    id: "ac1",
    title: "ATS Compatibility",
    score: 94,
    status: "Excellent",
    description: "Your resume passes standard Applicant Tracking Systems.",
    icon: "Target",
    color: "text-green-500",
  },
  {
    id: "ac2",
    title: "Content Quality",
    score: 88,
    status: "Good",
    description: "Strong bullet points, but missing some quantifiable metrics.",
    icon: "FileText",
    color: "text-blue-500",
  },
  {
    id: "ac3",
    title: "Action Verbs",
    score: 75,
    status: "Needs Work",
    description: "You used 'helped' and 'worked on' multiple times.",
    icon: "Zap",
    color: "text-yellow-500",
  },
  {
    id: "ac4",
    title: "Visual Balance",
    score: 100,
    status: "Perfect",
    description: "Great use of whitespace, margins, and typography.",
    icon: "Layout",
    color: "text-purple-500",
  },
];

export const SECTION_ANALYSIS = [
  {
    id: "sec1",
    name: "Professional Summary",
    score: 95,
    strengths: ["Clear value proposition", "Appropriate length (3-4 lines)"],
    weaknesses: [],
    suggestions: ["Consider adding one specific major achievement."],
  },
  {
    id: "sec2",
    name: "Experience",
    score: 85,
    strengths: ["Reverse chronological order", "Consistent date formatting"],
    weaknesses: ["Missing quantifiable results in older roles", "Too many bullets for the oldest role"],
    suggestions: ["Reduce bullets for roles older than 5 years.", "Add specific metrics to 'Senior Developer' role."],
  },
  {
    id: "sec3",
    name: "Skills",
    score: 90,
    strengths: ["Well categorized", "Contains hard and soft skills"],
    weaknesses: ["Missing trending industry keywords"],
    suggestions: ["Add 'Next.js' or 'GraphQL' if you have experience with them."],
  },
];

export const KEYWORDS = {
  matched: ["React", "TypeScript", "Node.js", "Agile", "System Design", "AWS"],
  missing: ["GraphQL", "Docker", "CI/CD", "Kubernetes", "Next.js"],
  recommended: ["Microservices", "TDD", "Performance Optimization"],
};

export const RECRUITER_TIMELINE = [
  {
    time: "5 Seconds",
    title: "First Glance",
    description: "Scans name, current title, and professional summary.",
    status: "Strong",
  },
  {
    time: "10 Seconds",
    title: "Experience Check",
    description: "Looks at recent roles, companies, and tenure.",
    status: "Good",
  },
  {
    time: "20 Seconds",
    title: "Deep Dive",
    description: "Reads bullet points of the most recent role.",
    status: "Needs Metrics",
  },
];

export const WEAK_BULLETS = [
  {
    id: "wb1",
    original: "Worked on improving the main website performance.",
    suggestion: "Improved main website load time by 40% through code splitting and image optimization, increasing user retention by 15%.",
  },
  {
    id: "wb2",
    original: "Helped the backend team build a new API.",
    suggestion: "Collaborated with 4 backend engineers to design and deploy a RESTful API, handling 50k+ daily requests.",
  }
];

export const IMPROVEMENT_ROADMAP = [
  {
    id: "imp1",
    priority: "High",
    title: "Quantify your most recent role",
    description: "Add 2-3 numbers or percentages to your current position.",
    estimatedImpact: "+5 Score",
  },
  {
    id: "imp2",
    priority: "Medium",
    title: "Add missing ATS keywords",
    description: "Include Docker and CI/CD in your skills section.",
    estimatedImpact: "+3 Score",
  },
  {
    id: "imp3",
    priority: "Quick Win",
    title: "Replace weak action verbs",
    description: "Swap 'helped' with 'spearheaded' or 'orchestrated'.",
    estimatedImpact: "+2 Score",
  }
];
