export const TRACKER_STATS = {
  applied: 45,
  interviewing: 8,
  rejected: 12,
  offers: 2,
  wishlist: 15,
  saved: 24,
};

export type JobStatus = "wishlist" | "applied" | "oa" | "interview" | "hr" | "offer" | "rejected";

export interface JobApplication {
  id: string;
  company: string;
  role: string;
  salary: string;
  location: string;
  appliedDate: string;
  priority: "High" | "Medium" | "Low";
  status: JobStatus;
  nextStep?: string;
  logoColor: string;
}

export const MOCK_APPLICATIONS: JobApplication[] = [
  // Wishlist
  {
    id: "app_1",
    company: "Stripe",
    role: "Frontend Engineer",
    salary: "$160k - $210k",
    location: "Remote",
    appliedDate: "-",
    priority: "High",
    status: "wishlist",
    nextStep: "Get referral",
    logoColor: "bg-[#635BFF]",
  },
  {
    id: "app_2",
    company: "Vercel",
    role: "Design Engineer",
    salary: "$140k - $180k",
    location: "Remote",
    appliedDate: "-",
    priority: "High",
    status: "wishlist",
    nextStep: "Update portfolio",
    logoColor: "bg-black dark:bg-white",
  },
  // Applied
  {
    id: "app_3",
    company: "Linear",
    role: "Software Engineer",
    salary: "Competitive",
    location: "Remote",
    appliedDate: "Oct 12, 2026",
    priority: "High",
    status: "applied",
    logoColor: "bg-[#5E6AD2]",
  },
  {
    id: "app_4",
    company: "Framer",
    role: "Frontend Developer",
    salary: "€80k - €120k",
    location: "Amsterdam / Remote",
    appliedDate: "Oct 10, 2026",
    priority: "Medium",
    status: "applied",
    logoColor: "bg-[#0055FF]",
  },
  // OA (Online Assessment)
  {
    id: "app_5",
    company: "Netflix",
    role: "UI Engineer",
    salary: "$200k+",
    location: "Los Gatos, CA",
    appliedDate: "Oct 01, 2026",
    priority: "High",
    status: "oa",
    nextStep: "Complete HackerRank by Friday",
    logoColor: "bg-[#E50914]",
  },
  // Interview
  {
    id: "app_6",
    company: "Apple",
    role: "Frontend Engineer, Apple Music",
    salary: "$150k - $220k",
    location: "Cupertino, CA",
    appliedDate: "Sep 28, 2026",
    priority: "High",
    status: "interview",
    nextStep: "Technical screen with Hiring Manager",
    logoColor: "bg-[#A2AAAD]",
  },
  {
    id: "app_7",
    company: "Discord",
    role: "Software Engineer, Core App",
    salary: "$170k - $200k",
    location: "San Francisco, CA",
    appliedDate: "Sep 20, 2026",
    priority: "Medium",
    status: "interview",
    nextStep: "Onsite Loop",
    logoColor: "bg-[#5865F2]",
  },
  // HR
  {
    id: "app_8",
    company: "Notion",
    role: "Product Engineer",
    salary: "Pending",
    location: "San Francisco / Remote",
    appliedDate: "Sep 15, 2026",
    priority: "High",
    status: "hr",
    nextStep: "Compensation Negotiation",
    logoColor: "bg-black dark:bg-white",
  },
  // Offer
  {
    id: "app_9",
    company: "Cursor",
    role: "Frontend Engineer",
    salary: "$180k + Equity",
    location: "Remote",
    appliedDate: "Sep 01, 2026",
    priority: "High",
    status: "offer",
    nextStep: "Sign by Oct 20",
    logoColor: "bg-background border border-border",
  },
];

export const COLUMNS: { id: JobStatus; title: string }[] = [
  { id: "wishlist", title: "Wishlist" },
  { id: "applied", title: "Applied" },
  { id: "oa", title: "Online Assessment" },
  { id: "interview", title: "Interviewing" },
  { id: "hr", title: "HR / Team Fit" },
  { id: "offer", title: "Offers" },
  { id: "rejected", title: "Rejected" },
];

export const TIMELINE_EVENTS = [
  { date: "Oct 18, 2026", time: "10:00 AM", company: "Apple", type: "Technical Screen", location: "Zoom" },
  { date: "Oct 19, 2026", time: "EOD", company: "Netflix", type: "Deadline: HackerRank", location: "Online" },
  { date: "Oct 20, 2026", time: "1:00 PM", company: "Discord", type: "Onsite: System Design", location: "SF Office" },
  { date: "Oct 20, 2026", time: "5:00 PM", company: "Cursor", type: "Deadline: Sign Offer", location: "DocuSign" },
];

export const INSIGHTS_DATA = [
  { month: "May", applications: 12, interviews: 1 },
  { month: "Jun", applications: 25, interviews: 3 },
  { month: "Jul", applications: 18, interviews: 2 },
  { month: "Aug", applications: 40, interviews: 8 },
  { month: "Sep", applications: 35, interviews: 10 },
  { month: "Oct", applications: 15, interviews: 5 },
];

export const ACTIVITY_FEED = [
  { type: "offer", company: "Cursor", time: "2 days ago", message: "Offer received! $180k base + equity." },
  { type: "interview", company: "Discord", time: "3 days ago", message: "Advanced to Onsite Loop." },
  { type: "applied", company: "Linear", time: "5 days ago", message: "Application submitted." },
  { type: "rejected", company: "Meta", time: "1 week ago", message: "Rejected after technical screen." },
  { type: "resume", company: "System", time: "2 weeks ago", message: "Resume 'Frontend_V3.pdf' updated." },
];
