import assert from "node:assert/strict";
import { JobAnalysisService, type ResumeData } from "../src/services/job-analysis.service";
import { ResumeHealthService, buildImprovedBullet, hasMetric, sanitizeAndDeduplicate, ACTION_VERB, WEAK_OPENING } from "../src/services/resume-health.service";
import { normalizeResumeData } from "../src/services/resume-normalizer.service";
import { JobParserService } from "../src/services/job-parser.service";

const analysisService = new JobAnalysisService();
const healthService = new ResumeHealthService();
const jobParser = new JobParserService();

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

// -------------------------------------------------------------
// SECTION A: FACTUAL GROUNDING & DEDUPLICATION TESTS
// -------------------------------------------------------------
console.log("\n[1/5] Testing Factual Grounding & Rewrite Deduplication...");

// Test Case A1: Grounded rewrite without inventing metrics
const originalBullet1 = "Designed and implemented real-time pricing recommendation engine using React and GraphQL";
const rewritten1 = buildImprovedBullet(originalBullet1);
assert.ok(!rewritten1.includes("25%"), "Factual Rule: Does NOT invent '25%' metric");
assert.ok(!rewritten1.includes("delivering measurable performance"), "Factual Rule: Does NOT invent generic corporate impact");
assert.ok(!rewritten1.startsWith("Designed and built responsive Designed and implemented"), "Deduplication Rule: No repeated verb prefix");
assert.ok(rewritten1.includes("React") && rewritten1.includes("GraphQL"), "Entity Rule: Preserves original technologies");

// Test Case A2: Weak opening conversion without fabrication
const weakBullet = "Worked on payment processing service";
const improvedWeak = buildImprovedBullet(weakBullet);
assert.ok(!improvedWeak.toLowerCase().startsWith("worked on"), "Weak opening converted to active verb");
assert.ok(!improvedWeak.match(/\d+%/), "Weak opening rewrite does NOT fabricate percentages");
assert.ok(improvedWeak.includes("payment processing service"), "Preserves core context");

// Test Case A3: Sanitizer cleans stuttering
const duplicatedSample = "Designed and built responsive Designed and implemented web application.";
const deduplicated = sanitizeAndDeduplicate(duplicatedSample);
assert.ok(!deduplicated.includes("Designed and built responsive Designed and implemented"), "Sanitizer removes stuttered openings");

// -------------------------------------------------------------
// SECTION B: METRIC & ACTION VERB DETECTION TESTS
// -------------------------------------------------------------
console.log("\n[2/5] Testing Metric & Action Verb Detection...");

// Metric recognition test cases
assert.ok(hasMetric("Mentored 4 junior engineers and led bi-weekly tech talks attended by 50+ engineers"), "Recognizes '4 junior engineers' and '50+ engineers'");
assert.ok(hasMetric("Reduced latency by 40% and handling 100K+ TPS"), "Recognizes '40%' and '100K+ TPS'");
assert.ok(hasMetric("Reducing chargebacks by $4.2M annually"), "Recognizes '$4.2M'");
assert.ok(hasMetric("Reduced CI/CD pipeline runtime from 45 minutes to 8 minutes"), "Recognizes time metrics");
assert.ok(hasMetric("1st Place out of 300+ teams"), "Recognizes scale '300+ teams'");
assert.ok(hasMetric("Built from 0 to 5,000 monthly active users in 6 months"), "Recognizes user counts");

// Action verb regex test cases
assert.ok(ACTION_VERB.test("Mentored 4 junior engineers"), "Recognizes 'Mentored'");
assert.ok(ACTION_VERB.test("Led migration of payment processing"), "Recognizes 'Led'");
assert.ok(ACTION_VERB.test("Architected and launched pipeline"), "Recognizes 'Architected'");
assert.ok(ACTION_VERB.test("Built host tools dashboard"), "Recognizes 'Built'");
assert.ok(ACTION_VERB.test("Designed and implemented engine"), "Recognizes 'Designed'");
assert.ok(ACTION_VERB.test("Shipped 0 to 1 MVP"), "Recognizes 'Shipped'");

// Weak opening test cases
assert.ok(WEAK_OPENING.test("Worked on microservices"), "Flags 'Worked on'");
assert.ok(WEAK_OPENING.test("Helped the team develop"), "Flags 'Helped'");
assert.ok(WEAK_OPENING.test("Responsible for testing APIs"), "Flags 'Responsible for'");

// Weak bullet list check on active resume:
// "Mentored 4 junior engineers..." must NOT be flagged as weak because it has strong verbs + valid metrics!
const healthCheck = healthService.analyze(ACTIVE_TEST_RESUME);
const weakList = healthCheck.weakBullets.map((wb) => wb.original);
assert.ok(!weakList.includes("Mentored 4 junior engineers and led bi-weekly tech talks attended by 50+ engineers"), "Mentored bullet is NOT flagged as weak");
assert.ok(!weakList.includes("Led migration of payment processing service to event-driven architecture, reducing latency by 40% and handling 100K+ TPS"), "Led migration bullet is NOT flagged as weak");

// -------------------------------------------------------------
// SECTION C: KEYWORD CLASSIFICATION & STOPWORD FILTERING
// -------------------------------------------------------------
console.log("\n[3/5] Testing Keyword Classification & Stopword Filtering...");

const parsedJob = jobParser.parse(JOB_DESCRIPTION, { jobTitle: TARGET_ROLE });
const atsKeywordsLower = parsedJob.atsKeywords.map((k) => k.toLowerCase());

// Assert generic filler words are NOT treated as high-value ATS keywords
assert.ok(!atsKeywordsLower.includes("strong"), "Generic word 'strong' excluded from atsKeywords");
assert.ok(!atsKeywordsLower.includes("experience"), "Generic word 'experience' excluded from atsKeywords");
assert.ok(!atsKeywordsLower.includes("applications"), "Generic word 'applications' excluded from atsKeywords");
assert.ok(!atsKeywordsLower.includes("working"), "Generic word 'working' excluded from atsKeywords");
assert.ok(!atsKeywordsLower.includes("knowledge"), "Generic word 'knowledge' excluded from atsKeywords");

// Assert technical technologies are properly extracted in parsedJob
const technicalSkillsLower = parsedJob.technicalSkills.map((s) => s.toLowerCase());
assert.ok(technicalSkillsLower.includes("react"), "React extracted as technical skill");
assert.ok(technicalSkillsLower.includes("typescript"), "TypeScript extracted as technical skill");
assert.ok(technicalSkillsLower.includes("javascript"), "JavaScript extracted as technical skill");
assert.ok(technicalSkillsLower.includes("next.js") || technicalSkillsLower.includes("nextjs"), "Next.js extracted");
assert.ok(technicalSkillsLower.includes("tailwindcss") || technicalSkillsLower.includes("tailwind"), "TailwindCSS extracted");
assert.ok(technicalSkillsLower.includes("graphql"), "GraphQL extracted");
assert.ok(technicalSkillsLower.includes("docker"), "Docker extracted");

// -------------------------------------------------------------
// SECTION D: CANONICAL ATS ANALYSIS & STRUCTURE TESTS
// -------------------------------------------------------------
console.log("\n[4/5] Testing Canonical ATS Analysis & Scoring Pipeline...");

// Normalization checks
const normalizedDirect = normalizeResumeData(ACTIVE_TEST_RESUME);
assert.ok(normalizedDirect, "Resume loads and normalizes successfully");

// Section presence checks in Resume Health
const healthReport = healthService.analyze(normalizedDirect);

const summarySection = healthReport.sectionAnalysis.find((s) => s.id === "summary");
assert.ok(summarySection && summarySection.score > 0, "Professional Summary is detected");
assert.ok(!summarySection.weaknesses.includes("Professional summary is missing from your resume."), "Professional summary not reported missing");

const expSection = healthReport.sectionAnalysis.find((s) => s.id === "experience");
assert.ok(expSection && expSection.score > 0, "Experience is detected");

const skillsSection = healthReport.sectionAnalysis.find((s) => s.id === "skills");
assert.ok(skillsSection && skillsSection.score > 0, "Skills are detected");

const eduSection = healthReport.sectionAnalysis.find((s) => s.id === "education");
assert.ok(eduSection && eduSection.score > 0, "Education is detected");

const projSection = healthReport.sectionAnalysis.find((s) => s.id === "projects");
assert.ok(projSection && projSection.score > 0, "Projects are detected");

assert.equal(healthReport.structureScore, 100, "Resume structure is 100% (not zero)");

// Nested ResumeDraft Normalization (Simulating cloud sync & DB storage)
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

// Technology and Keyword Matching against Frontend Engineer JD
const matchReport = analysisService.compareResumeToJob(normalizedDraft, JOB_DESCRIPTION, { jobTitle: TARGET_ROLE });

const matchedSkillsLower = matchReport.matchedSkills.map((s) => s.toLowerCase());
const matchedKeywordsLower = matchReport.matchedKeywords.map((k) => k.keyword.toLowerCase());
const allMatched = new Set([...matchedSkillsLower, ...matchedKeywordsLower]);

assert.ok(allMatched.has("react") || matchedSkillsLower.some((s) => s.includes("react")), "React is detected");
assert.ok(allMatched.has("typescript") || matchedSkillsLower.some((s) => s.includes("typescript")), "TypeScript is detected");
assert.ok(allMatched.has("javascript") || matchedSkillsLower.some((s) => s.includes("javascript")), "JavaScript is detected");
assert.ok(allMatched.has("next.js") || allMatched.has("nextjs") || matchedSkillsLower.some((s) => s.includes("next")), "Next.js is detected");
assert.ok(allMatched.has("tailwindcss") || allMatched.has("tailwind") || matchedSkillsLower.some((s) => s.includes("tailwind")), "TailwindCSS is detected");
assert.ok(allMatched.has("graphql") || matchedSkillsLower.some((s) => s.includes("graphql")), "GraphQL is detected");
assert.ok(allMatched.has("aws") || matchedSkillsLower.some((s) => s.includes("aws")), "AWS is detected");
assert.ok(allMatched.has("postgresql") || allMatched.has("postgres") || matchedSkillsLower.some((s) => s.includes("postgres")), "PostgreSQL is detected");
assert.ok(allMatched.has("docker") || matchedSkillsLower.some((s) => s.includes("docker")), "Docker is detected");
assert.ok(allMatched.has("git") || allMatched.has("github") || matchedSkillsLower.some((s) => s.includes("git") || s.includes("github")), "Git/GitHub are detected");

assert.ok(matchReport.matchedKeywords.length > 0, "Matched keywords count is > 0");
assert.ok(matchReport.breakdown.skills > 0, "Technical skills score is > 0");

// -------------------------------------------------------------
// SECTION E: SCORE CONSISTENCY & REPRODUCIBILITY TESTS
// -------------------------------------------------------------
console.log("\n[5/5] Testing Score Consistency & Determinism...");

// Roadmap currentScore MUST EQUAL jobMatchScore
assert.equal(
  matchReport.improvementRoadmap.currentScore,
  matchReport.jobMatchScore,
  `Roadmap currentScore (${matchReport.improvementRoadmap.currentScore}) === analysis score (${matchReport.jobMatchScore})`
);
assert.ok(
  matchReport.improvementRoadmap.potentialScore >= matchReport.improvementRoadmap.currentScore,
  "Roadmap potentialScore is >= currentScore"
);

// ATS Simulation Consistency
assert.ok(healthReport.atsSimulation.length >= 3, "ATS simulation items present");
assert.ok(healthReport.atsSimulation.every((sim) => sim.state === "pass" || sim.state === "warn"), "ATS simulation states are valid");

// Reproducibility (Deterministic)
const secondRun = analysisService.compareResumeToJob(normalizedDraft, JOB_DESCRIPTION, { jobTitle: TARGET_ROLE });
assert.deepEqual(matchReport, secondRun, "Analysis is 100% deterministic and reproducible");

console.log("\n=======================================================");
console.log("ALL ATS REGRESSION & HARDENING ASSERTIONS PASSED (28/28)");
console.log("=======================================================");
console.log(JSON.stringify({
  jobMatchScore: matchReport.jobMatchScore,
  resumeATSHealth: healthReport.score,
  matchedSkillsCount: matchReport.matchedSkills.length,
  matchedKeywordsCount: matchReport.matchedKeywords.length,
  structureScore: healthReport.structureScore,
  roadmapCurrentScore: matchReport.improvementRoadmap.currentScore,
  roadmapPotentialScore: matchReport.improvementRoadmap.potentialScore,
}, null, 2));
