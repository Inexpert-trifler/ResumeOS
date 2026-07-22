export type MessageSender = "ai" | "user";

export interface ChatMessage {
  id: string;
  sender: MessageSender;
  content: string;
  isTyping?: boolean;
}

export const MOCK_CONVERSATION: ChatMessage[] = [
  {
    id: "m1",
    sender: "ai",
    content: "Hi 👋\nI'm going to help build your resume.\nLet's start with your strongest project.",
  },
  {
    id: "m2",
    sender: "user",
    content: "SignalX",
  },
  {
    id: "m3",
    sender: "ai",
    content: "Interesting.\nWhat problem does SignalX solve?",
  },
  {
    id: "m4",
    sender: "user",
    content: "It helps companies analyze their competitor's pricing in real-time.",
  },
  {
    id: "m5",
    sender: "ai",
    content: "How many people worked on it?",
  },
  {
    id: "m6",
    sender: "user",
    content: "Just me and one other backend engineer.",
  },
  {
    id: "m7",
    sender: "ai",
    content: "Which technologies did you use?",
  },
  {
    id: "m8",
    sender: "user",
    content: "Next.js, Tailwind, PostgreSQL, and Redis.",
  },
  {
    id: "m9",
    sender: "ai",
    content: "What was the biggest challenge?",
  },
  {
    id: "m10",
    sender: "user",
    content: "Handling the web socket connections when parsing thousands of product prices without crashing the server.",
  },
  {
    id: "m11",
    sender: "ai",
    content: "How did you solve it?",
  },
  {
    id: "m12",
    sender: "user",
    content: "I implemented a Redis message queue to batch the updates, reducing server load by about 40%.",
  },
  {
    id: "m13",
    sender: "ai",
    content: "What makes this project unique?",
  },
  {
    id: "m14",
    sender: "user",
    content: "It processes 10,000+ data points a minute and presents them in a less-than-50ms latency UI.",
  },
  {
    id: "m15",
    sender: "ai",
    content: "What impact did it create?",
  },
  {
    id: "m16",
    sender: "user",
    content: "We acquired 50 beta users in the first month and successfully pitched it for a seed round.",
  },
  {
    id: "m17",
    sender: "ai",
    content: "This is great material. Give me a moment to synthesize this into professional bullet points for your resume.",
    isTyping: true,
  }
];

export const MOCK_SUGGESTED_REPLIES = [
  "It was a solo project.",
  "I led a team of 5.",
  "Let me upload the GitHub link."
];

export const PROGRESS_STEPS = [
  { name: "Career Goal", status: "completed" },
  { name: "Projects", status: "active" },
  { name: "Experience", status: "upcoming" },
  { name: "Skills", status: "upcoming" },
  { name: "Education", status: "upcoming" },
  { name: "Achievements", status: "upcoming" },
  { name: "Leadership", status: "upcoming" },
  { name: "Review", status: "upcoming" },
];

export const COACH_TIPS = {
  weak: "Worked on pricing tool with another engineer.",
  strong: "Engineered a real-time pricing analysis tool using Next.js and Redis, processing 10,000+ data points per minute with sub-50ms latency.",
};

export const LIVE_RESUME_PREVIEW = {
  title: "SignalX",
  subtitle: "Real-time Pricing Analytics",
  bullets: [
    "Co-developed a real-time pricing analysis tool enabling companies to monitor competitor strategies.",
    "Implemented a Redis message queue to batch high-volume WebSocket updates, reducing server load by 40%.",
    "Engineered a low-latency Next.js frontend capable of rendering 10,000+ data points per minute under 50ms.",
    "Acquired 50 beta users in the first month, directly contributing to a successful seed funding round."
  ],
  technologies: ["Next.js", "Tailwind CSS", "PostgreSQL", "Redis"]
};
