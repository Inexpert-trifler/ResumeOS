import assert from "node:assert/strict";
import { JobAnalysisService, type ResumeData } from "../src/services/job-analysis.service";
import { ResumeHealthService } from "../src/services/resume-health.service";
import { normalizeResumeData } from "../src/services/resume-normalizer.service";

const analysisService = new JobAnalysisService();
const healthService = new ResumeHealthService();

// Known active resume fixture corresponding to the ResumeOS active test resume
const ACTIVE_TEST_RESUME: ResumeData = {
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
      company: "Startup (Stealth)",
      role: "Full Stack Engineer",
      startDate: "Jan 2018",
      endDate: "May 2019",
      location: "Remote",
      bullets: [
        "Built the entire product from scratch using Next.js, Node.js, JavaScript, and PostgreSQL",
        "Shipped 0 to 1 MVP in 3 months, acquiring first 500 paying customers",
      ],
    },
  ],
  education: [
    {
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
      category: "Languages",
      skills: ["TypeScript", "JavaScript", "Python", "Go", "Rust", "SQL"],
    },
    {
      category: "Frontend",
      skills: ["React", "Next.js", "Framer Motion", "TailwindCSS", "GraphQL"],
    },
    {
      category: "Backend & Cloud",
      skills: ["Node.js", "PostgreSQL", "Redis", "AWS", "Kubernetes", "Docker", "Git", "GitHub Actions"],
    },
  ],
  projects: [
    {
      name: "ResumeOS",
      description: "AI-powered resume builder with live editor and ATS scoring",
      tech: ["Next.js", "React", "OpenAI", "PostgreSQL", "Stripe", "TailwindCSS"],
      github: "github.com/alexmorgan/resumeos",
      demo: "resumeos.app",
      bullets: [
        "Built from 0 to 5,000 monthly active users in 6 months using React and Next.js",
        "Integrated Git workflow and automated deployment pipeline on AWS with Docker",
      ],
    },
  ],
  achievements: [
    {
      title: "TechCrunch Disrupt Hackathon Winner",
      description: "1st Place out of 300+ teams for AI-powered accessibility tool",
      date: "2023",
    },
  ],
  certificates: [
    {
      name: "AWS Solutions Architect Professional",
      issuer: "Amazon Web Services",
      date: "2023",
    },
  ],
  languages: [
    { language: "English", proficiency: "Native" },
  ],
  interests: ["Open Source", "System Design"],
};

// Target Role & Job Description from prompt
const TARGET_ROLE = "Frontend Engineer";
const JOB_DESCRIPTION = `
We are looking for a Frontend Engineer to build scalable and responsive web applications.

Requirements:
- Strong experience with React and TypeScript
- Proficiency in JavaScript, Next.js, and TailwindCSS
- Experience with GraphQL and REST APIs
- Knowledge of AWS and PostgreSQL
- Experience with Git, GitHub, and Docker
- Strong problem-solving and communication skills
- Experience building responsive web applications
`;

console.log("=== RUNNING DETERMINISTIC ATS REGRESSION TEST SUITE ===");

// TEST 1: Direct Resume Normalization
const normalizedDirect = normalizeResumeData(ACTIVE_TEST_RESUME);
assert.ok(normalizedDirect, "Assertion 1: Resume loads and normalizes successfully");

// TEST 2-6: Section Detection in Resume Health
const healthReport = healthService.analyze(normalizedDirect);

const summarySection = healthReport.sectionAnalysis.find((s) => s.id === "summary");
assert.ok(summarySection && summarySection.score > 0, "Assertion 2: Professional Summary is detected");
assert.ok(!summarySection.weaknesses.includes("Professional summary is missing from your resume."), "Assertion 19: Professional summary not reported missing");

const expSection = healthReport.sectionAnalysis.find((s) => s.id === "experience");
assert.ok(expSection && expSection.score > 0, "Assertion 3: Experience is detected");

const skillsSection = healthReport.sectionAnalysis.find((s) => s.id === "skills");
assert.ok(skillsSection && skillsSection.score > 0, "Assertion 4: Skills are detected");

const eduSection = healthReport.sectionAnalysis.find((s) => s.id === "education");
assert.ok(eduSection && eduSection.score > 0, "Assertion 5: Education is detected");

const projSection = healthReport.sectionAnalysis.find((s) => s.id === "projects");
assert.ok(projSection && projSection.score > 0, "Assertion 6: Projects are detected");

assert.equal(healthReport.structureScore, 100, "Assertion 18: Resume structure is 100% (not zero)");

// TEST: Nested ResumeDraft Normalization (Simulating cloud sync & DB storage)
const draftWrapped = {
  builder: {
    summary: ACTIVE_TEST_RESUME.summary,
    targetRole: "Senior Software Engineer",
    personalInfo: { firstName: "Alex", lastName: "Morgan", email: "alex@test.com" },
  },
  resume: ACTIVE_TEST_RESUME,
  settings: { template: "classic" },
};
const normalizedDraft = normalizeResumeData(draftWrapped);
assert.ok(normalizedDraft && normalizedDraft.skills?.length! > 0, "Draft normalization extracts nested resume");

// TEST 7-16: Technology and Keyword Matching against Frontend Engineer JD
const matchReport = analysisService.compareResumeToJob(normalizedDraft, JOB_DESCRIPTION, { jobTitle: TARGET_ROLE });

const matchedSkillsLower = matchReport.matchedSkills.map((s) => s.toLowerCase());
const matchedKeywordsLower = matchReport.matchedKeywords.map((k) => k.keyword.toLowerCase());
const allMatched = new Set([...matchedSkillsLower, ...matchedKeywordsLower]);

// Check each required tech
assert.ok(allMatched.has("react") || matchedSkillsLower.some((s) => s.includes("react")), "Assertion 7: React is detected");
assert.ok(allMatched.has("typescript") || matchedSkillsLower.some((s) => s.includes("typescript")), "Assertion 8: TypeScript is detected");
assert.ok(allMatched.has("javascript") || matchedSkillsLower.some((s) => s.includes("javascript")), "Assertion 9: JavaScript is detected");
assert.ok(allMatched.has("next.js") || allMatched.has("nextjs") || matchedSkillsLower.some((s) => s.includes("next")), "Assertion 10: Next.js is detected");
assert.ok(allMatched.has("tailwindcss") || allMatched.has("tailwind") || matchedSkillsLower.some((s) => s.includes("tailwind")), "Assertion 11: TailwindCSS is detected");
assert.ok(allMatched.has("graphql") || matchedSkillsLower.some((s) => s.includes("graphql")), "Assertion 12: GraphQL is detected");
assert.ok(allMatched.has("aws") || matchedSkillsLower.some((s) => s.includes("aws")), "Assertion 13: AWS is detected");
assert.ok(allMatched.has("postgresql") || allMatched.has("postgres") || matchedSkillsLower.some((s) => s.includes("postgres")), "Assertion 14: PostgreSQL is detected");
assert.ok(allMatched.has("docker") || matchedSkillsLower.some((s) => s.includes("docker")), "Assertion 15: Docker is detected");
assert.ok(allMatched.has("git") || allMatched.has("github") || matchedSkillsLower.some((s) => s.includes("git") || s.includes("github")), "Assertion 16: Git/GitHub are detected");

// Assertion 17: Matched keyword count is NOT zero
assert.ok(matchReport.matchedKeywords.length > 0, "Assertion 17: Matched keywords count is > 0");
assert.ok(matchReport.breakdown.skills > 0, "Technical skills score is > 0");

// Assertion 20: Improvement Roadmap current score equals canonical score
assert.equal(
  matchReport.improvementRoadmap.currentScore,
  matchReport.jobMatchScore,
  `Assertion 20: Roadmap currentScore (${matchReport.improvementRoadmap.currentScore}) === analysis score (${matchReport.jobMatchScore})`
);
assert.ok(
  matchReport.improvementRoadmap.potentialScore >= matchReport.improvementRoadmap.currentScore,
  "Roadmap potentialScore is >= currentScore"
);

// Assertion 21: ATS simulation consistency
assert.ok(healthReport.atsSimulation.length >= 3, "Assertion 21: ATS simulation items present");
assert.ok(healthReport.atsSimulation.every((sim) => sim.state === "pass" || sim.state === "warn"), "ATS simulation states are valid");

// Assertion 22: Reproducibility (No mock / randomized data)
const secondRun = analysisService.compareResumeToJob(normalizedDraft, JOB_DESCRIPTION, { jobTitle: TARGET_ROLE });
assert.deepEqual(matchReport, secondRun, "Assertion 22: Analysis is 100% deterministic and reproducible");

console.log("ALL 22 ATS REGRESSION ASSERTIONS PASSED!");
console.log(JSON.stringify({
  jobMatchScore: matchReport.jobMatchScore,
  resumeATSHealth: healthReport.score,
  matchedSkillsCount: matchReport.matchedSkills.length,
  matchedKeywordsCount: matchReport.matchedKeywords.length,
  structureScore: healthReport.structureScore,
  roadmapCurrentScore: matchReport.improvementRoadmap.currentScore,
  roadmapPotentialScore: matchReport.improvementRoadmap.potentialScore,
}, null, 2));
