export const DASHBOARD_STATS = {
  totalResumes: 4,
  avgScore: 84,
  atsReadiness: 92,
  interviewReadiness: 78,
  applications: 12,
  downloads: 24,
};

export const RECENT_RESUMES = [
  {
    id: "r1",
    name: "Senior Frontend Engineer",
    template: "Modern",
    lastEdited: "2 hours ago",
    score: 95,
  },
  {
    id: "r2",
    name: "Product Manager - Stripe",
    template: "Classic",
    lastEdited: "1 day ago",
    score: 88,
  },
  {
    id: "r3",
    name: "Tech Lead - Google",
    template: "Minimal",
    lastEdited: "3 days ago",
    score: 92,
  },
];

export const RESUME_HEALTH_DATA = [
  { name: "Grammar", value: 98, fill: "#22c55e" },      // Green
  { name: "ATS Match", value: 85, fill: "#3b82f6" },    // Blue
  { name: "Formatting", value: 100, fill: "#a855f7" },  // Purple
  { name: "Impact", value: 72, fill: "#f59e0b" },       // Yellow
  { name: "Keywords", value: 88, fill: "#ec4899" },     // Pink
];

export const ACTIVITY_FEED = [
  {
    id: "a1",
    type: "create",
    title: "Created 'Senior Frontend Engineer'",
    time: "2 hours ago",
    icon: "PlusCircle",
  },
  {
    id: "a2",
    type: "analyze",
    title: "ATS Scan Completed",
    description: "Score improved by +12 pts",
    time: "4 hours ago",
    icon: "CheckCircle",
  },
  {
    id: "a3",
    type: "export",
    title: "Exported 'Product Manager' as PDF",
    time: "1 day ago",
    icon: "Download",
  },
  {
    id: "a4",
    type: "edit",
    title: "Updated Skills Section",
    time: "2 days ago",
    icon: "Edit3",
  },
];

export const QUICK_ACTIONS = [
  {
    id: "q1",
    title: "Create New Resume",
    description: "Start from scratch or import",
    icon: "Plus",
    href: "/builder",
    color: "bg-blue-500/10 text-blue-500",
  },
  {
    id: "q2",
    title: "Open Studio",
    description: "Live resume editor",
    icon: "Layout",
    href: "/studio",
    color: "bg-purple-500/10 text-purple-500",
  },
  {
    id: "q3",
    title: "Analyze ATS",
    description: "Check keyword matches",
    icon: "Target",
    href: "#",
    color: "bg-green-500/10 text-green-500",
  },
  {
    id: "q4",
    title: "Interview Prep",
    description: "Practice with AI",
    icon: "MessageSquare",
    href: "#",
    color: "bg-orange-500/10 text-orange-500",
  },
];

export const UPCOMING_FEATURES = [
  {
    id: "u1",
    title: "GitHub Import",
    description: "Auto-sync your repositories into projects.",
    icon: "Github",
  },
  {
    id: "u2",
    title: "LinkedIn Sync",
    description: "Keep your experience history always up to date.",
    icon: "Linkedin",
  },
  {
    id: "u3",
    title: "AI Career Coach",
    description: "Personalized advice based on your career path.",
    icon: "Sparkles",
  },
];
