/**
 * Job Parser Service
 * Pure TypeScript NLP parser — no AI/external dependencies.
 * Uses regex patterns, keyword dictionaries, and heuristics.
 */

export interface ParsedJobData {
  jobTitle: string;
  company: string;
  seniorityLevel: string;
  requiredExperience: string;
  preferredExperience: string;
  technicalSkills: string[];
  softSkills: string[];
  responsibilities: string[];
  qualifications: string[];
  educationRequirements: string[];
  certifications: string[];
  tools: string[];
  programmingLanguages: string[];
  frameworks: string[];
  databases: string[];
  cloudPlatforms: string[];
  keywords: string[];
  atsKeywords: string[];
  actionVerbs: string[];
}

// ─── Dictionaries ──────────────────────────────────────────────────────────────

const PROGRAMMING_LANGUAGES = new Set([
  "javascript", "typescript", "python", "java", "c++", "c#", "c", "go", "golang", "rust",
  "ruby", "php", "swift", "kotlin", "scala", "r", "matlab", "perl", "bash", "shell",
  "powershell", "lua", "dart", "elixir", "haskell", "clojure", "groovy", "objective-c",
  "assembly", "fortran", "cobol", "vba", "sql", "plsql", "tsql", "graphql",
]);

const FRAMEWORKS = new Set([
  "react", "react.js", "reactjs", "angular", "vue", "vue.js", "vuejs", "svelte", "next.js", "nextjs", "nuxt", "gatsby", "remix",
  "express", "express.js", "expressjs", "fastapi", "django", "flask", "spring", "spring boot", "springboot", "hibernate", "laravel",
  "rails", "ruby on rails", "asp.net", ".net", "node.js", "nodejs", "nest.js", "nestjs",
  "fastify", "gin", "echo", "fiber", "phoenix", "sinatra", "rocket",
  "tensorflow", "pytorch", "keras", "scikit-learn", "pandas", "numpy", "matplotlib",
  "redux", "zustand", "mobx", "rxjs", "graphql", "apollo", "trpc", "prisma", "drizzle",
  "tailwind", "tailwindcss", "tailwind css", "bootstrap", "material-ui", "mui", "chakra", "antd", "shadcn",
  "jest", "vitest", "cypress", "playwright", "selenium", "puppeteer",
  "webpack", "vite", "rollup", "esbuild", "babel",
  "hadoop", "spark", "kafka", "airflow", "celery", "rabbitmq",
  "langchain", "hugging face", "openai", "anthropic",
]);

const DATABASES = new Set([
  "mysql", "postgresql", "postgres", "sqlite", "mongodb", "redis", "elasticsearch",
  "cassandra", "dynamodb", "firebase", "supabase", "cockroachdb", "neo4j", "influxdb",
  "oracle", "mssql", "sql server", "mariadb", "couchdb", "hbase", "clickhouse",
  "snowflake", "bigquery", "redshift", "databricks", "pinecone", "weaviate",
]);

const CLOUD_PLATFORMS = new Set([
  "aws", "amazon web services", "gcp", "google cloud", "azure", "microsoft azure",
  "heroku", "vercel", "netlify", "cloudflare", "digitalocean", "linode", "vultr",
  "ec2", "s3", "lambda", "eks", "ecs", "rds", "sqs", "sns", "api gateway",
  "cloud run", "cloud functions", "gke", "pubsub", "cloud storage",
  "app service", "blob storage", "cosmos db", "aks", "azure functions",
]);

const TOOLS = new Set([
  "git", "github", "gitlab", "bitbucket", "jira", "confluence", "notion", "slack",
  "figma", "sketch", "xd", "adobe", "canva", "linear",
  "docker", "kubernetes", "k8s", "terraform", "ansible", "jenkins", "github actions",
  "circleci", "travis", "gitlab ci", "helm", "istio", "prometheus", "grafana",
  "datadog", "sentry", "new relic", "splunk", "elk", "logstash", "kibana",
  "nginx", "apache", "haproxy", "traefik",
  "postman", "insomnia", "swagger", "openapi",
  "linux", "unix", "ubuntu", "centos", "windows server", "macos",
  "vs code", "intellij", "eclipse", "vim", "emacs",
  "npm", "yarn", "pnpm", "pip", "maven", "gradle", "cargo",
  "rest", "restful", "soap", "grpc", "websocket", "oauth", "jwt",
]);

const SOFT_SKILLS = new Set([
  "communication", "teamwork", "collaboration", "leadership", "problem-solving",
  "problem solving", "critical thinking", "analytical", "attention to detail",
  "time management", "adaptability", "creativity", "innovation", "initiative",
  "interpersonal", "presentation", "negotiation", "mentorship", "coaching",
  "empathy", "customer-focused", "customer focus", "cross-functional",
  "organizational", "project management", "agile", "scrum", "kanban",
  "stakeholder management", "decision making", "strategic thinking",
  "self-motivated", "self-starter", "results-driven", "detail-oriented",
  "fast-learner", "fast learner", "flexible", "multitasking",
]);

const CERTIFICATIONS = new Set([
  "aws certified", "azure certified", "google certified", "gcp certified",
  "cka", "ckad", "pmp", "cissp", "ceh", "comptia", "ccna", "ccnp", "ccie",
  "scrum master", "csm", "safe", "pmi", "itil", "togaf",
  "tensorflow developer", "tensorflow certificate", "google analytics",
  "databricks certified", "salesforce certified", "hubspot certified",
]);

const SENIORITY_PATTERNS: Array<{ level: string; patterns: RegExp[] }> = [
  { level: "intern",    patterns: [/\bintern\b/i, /\binternship\b/i] },
  { level: "junior",    patterns: [/\bjunior\b/i, /\bjr\.?\b/i, /\bentry.?level\b/i, /\b0[-–]?[12]\s*years?\b/i] },
  { level: "mid",       patterns: [/\bmid.?level\b/i, /\bintermediate\b/i, /\b[23][-–]?[45]\s*years?\b/i] },
  { level: "senior",    patterns: [/\bsenior\b/i, /\bsr\.?\b/i, /\b5\+\s*years?\b/i, /\b[56][-–]?[78]\s*years?\b/i] },
  { level: "lead",      patterns: [/\blead\b/i, /\bstaff\b/i, /\btech lead\b/i, /\b7\+\s*years?\b/i] },
  { level: "principal", patterns: [/\bprincipal\b/i, /\barchitect\b/i, /\b10\+\s*years?\b/i] },
  { level: "director",  patterns: [/\bdirector\b/i, /\bvp\b/i, /\bvice president\b/i, /\bhead of\b/i, /\bmanager\b/i] },
];

const ACTION_VERBS = new Set([
  "develop", "design", "build", "implement", "create", "architect", "engineer",
  "lead", "manage", "mentor", "collaborate", "coordinate", "drive", "deliver",
  "optimize", "improve", "enhance", "maintain", "support", "debug", "troubleshoot",
  "deploy", "integrate", "automate", "analyze", "evaluate", "research", "document",
  "communicate", "present", "define", "plan", "execute", "monitor", "review",
  "test", "validate", "ensure", "establish", "identify", "solve", "scale",
  "migrate", "refactor", "own", "partner", "influence", "shape", "transform",
]);

// ─── Helpers ──────────────────────────────────────────────────────────────────

function normalizeText(text: string): string {
  return text.toLowerCase().replace(/[^\w\s.#+]/g, " ").replace(/\s+/g, " ").trim();
}

function extractBulletPoints(text: string): string[] {
  const lines = text.split(/\n/);
  const bullets: string[] = [];
  for (const line of lines) {
    const trimmed = line.replace(/^[\s•\-–—*►▸▪◆◇○●]+/, "").trim();
    if (trimmed.length > 15 && trimmed.length < 500) {
      bullets.push(trimmed);
    }
  }
  return bullets;
}

function extractSection(text: string, patterns: RegExp[]): string[] {
  const results: string[] = [];
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match && match.index !== undefined) {
      const start = match.index + match[0].length;
      // Get text until next major section header (all-caps line or next known header)
      const sectionText = text.slice(start, start + 2000);
      const sectionLines = sectionText.split(/\n/).slice(0, 25);
      let collecting = false;
      for (const line of sectionLines) {
        const trimmed = line.replace(/^[\s•\-–—*►▸▪◆◇○●]+/, "").trim();
        if (!trimmed) { collecting = true; continue; }
        // Stop if we hit another section header
        if (/^(qualifications?|requirements?|responsibilities?|about|benefits?|compensation|what\s+(we|you)|skills?|experience|education|preferred|required|who\s+you|nice\s+to)/i.test(trimmed)) {
          break;
        }
        if (trimmed.length > 10) {
          results.push(trimmed);
          collecting = true;
        }
      }
      if (collecting) break;
    }
  }
  return [...new Set(results)].slice(0, 20);
}

function findMatchesInText(text: string, dictionary: Set<string>): string[] {
  const normalized = normalizeText(text);
  const found: string[] = [];
  for (const term of dictionary) {
    // Match whole word or phrase
    const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`\\b${escaped}\\b`, "i");
    if (regex.test(normalized)) {
      found.push(term);
    }
  }
  return found;
}

// ─── Parser ───────────────────────────────────────────────────────────────────

export class JobParserService {
  parse(rawText: string, hint?: { jobTitle?: string; company?: string }): ParsedJobData {
    const text = rawText.trim();
    const lower = text.toLowerCase();

    // Seniority
    let seniorityLevel = "mid";
    for (const { level, patterns } of SENIORITY_PATTERNS) {
      if (patterns.some((p) => p.test(text))) {
        seniorityLevel = level;
        break;
      }
    }

    // Experience requirements
    const expMatch = text.match(/(\d+)\+?\s*[-–to]+\s*(\d+)\s*years?\s*of\s*(relevant\s*)?experience/i)
      || text.match(/(\d+)\+?\s*years?\s*of\s*(relevant\s*)?experience/i)
      || text.match(/(\d+)\+?\s*years?\s*(of\s*)?(professional\s*)?experience/i);
    const requiredExperience = expMatch ? expMatch[0] : "";

    const prefExpMatch = text.match(/preferred[^.\n]*?(\d+)\+?\s*years?\s*experience/i)
      || text.match(/(\d+)\+?\s*years?\s*experience[^.\n]*preferred/i);
    const preferredExperience = prefExpMatch ? prefExpMatch[0] : "";

    // Technical skills (union of all technical dictionaries)
    const programmingLanguages = findMatchesInText(text, PROGRAMMING_LANGUAGES);
    const frameworks = findMatchesInText(text, FRAMEWORKS);
    const databases = findMatchesInText(text, DATABASES);
    const cloudPlatforms = findMatchesInText(text, CLOUD_PLATFORMS);
    const tools = findMatchesInText(text, TOOLS);

    const technicalSkills = [...new Set([
      ...programmingLanguages,
      ...frameworks,
      ...databases,
      ...cloudPlatforms,
      ...tools,
    ])].slice(0, 40);

    // Soft skills
    const softSkills = findMatchesInText(text, SOFT_SKILLS).slice(0, 20);

    // Certifications
    const certifications = findMatchesInText(text, CERTIFICATIONS).slice(0, 10);

    // Responsibilities section
    const responsibilities = extractSection(text, [
      /responsibilities\s*:?\n/i,
      /what\s+you['']ll\s+do\s*:?\n/i,
      /role\s+overview\s*:?\n/i,
      /the\s+role\s*:?\n/i,
      /your\s+role\s*:?\n/i,
      /job\s+duties\s*:?\n/i,
    ]);

    // Qualifications section
    const qualifications = extractSection(text, [
      /qualifications?\s*:?\n/i,
      /requirements?\s*:?\n/i,
      /what\s+we['']re\s+looking\s+for\s*:?\n/i,
      /what\s+you\s+need\s*:?\n/i,
      /who\s+you\s+are\s*:?\n/i,
    ]);

    // Education section
    const educationRequirements = extractSection(text, [
      /education\s*:?\n/i,
      /educational\s+requirements?\s*:?\n/i,
      /degree\s+requirements?\s*:?\n/i,
    ]);

    // Fallback: detect education mentions inline
    if (educationRequirements.length === 0) {
      const eduMatches = text.match(/(bachelor'?s?|master'?s?|phd|doctorate|associate'?s?|b\.?s\.?|m\.?s\.?|b\.?e\.?|mba)[^.\n]{0,100}/gi);
      if (eduMatches) educationRequirements.push(...eduMatches.slice(0, 5));
    }

    // ATS Keywords — frequency-weighted important terms (strictly excluding generic filler)
    const wordFreq: Record<string, number> = {};
    const words = lower.match(/\b[a-z][a-z+#.]{2,}\b/g) ?? [];
    const STOPWORDS = new Set([
      "and", "the", "with", "for", "our", "you", "will", "have", "this", "that", "are", "your", "from",
      "not", "but", "all", "can", "such", "has", "they", "their", "been", "who", "its", "what", "how",
      "must", "also", "into", "about", "more", "other", "some", "than", "then", "them", "these", "were",
      // Generic resume / job filler words (MUST NOT be classified as ATS keywords)
      "strong", "experience", "applications", "application", "working", "knowledge", "skills", "skill",
      "ability", "abilities", "proficient", "proficiency", "role", "roles", "team", "teams", "years", "year",
      "building", "build", "looking", "responsibilities", "qualifications", "qualification", "preferred",
      "required", "requirements", "requirement", "including", "familiarity", "understanding", "plus",
      "well", "good", "great", "high", "fast", "paced", "environment", "relevant", "professional",
      "hands", "demonstrated", "track", "record", "proven", "success", "work", "help", "create", "need",
      "like", "join", "part", "opportunities", "candidate", "candidates", "duties", "overview", "looking",
    ]);

    for (const w of words) {
      if (!STOPWORDS.has(w) && w.length > 2) {
        wordFreq[w] = (wordFreq[w] ?? 0) + 1;
      }
    }

    const atsKeywords = Object.entries(wordFreq)
      .filter(([word, freq]) => freq >= 2 || technicalSkills.includes(word))
      .sort(([, a], [, b]) => b - a)
      .slice(0, 30)
      .map(([word]) => word);

    // All keywords (union of technical skills + soft skills + relevant domain terms)
    const keywords = [...new Set([
      ...technicalSkills,
      ...softSkills,
      ...atsKeywords,
    ])].slice(0, 50);

    // Action verbs
    const actionVerbs = findMatchesInText(text, ACTION_VERBS).slice(0, 20);

    return {
      jobTitle: hint?.jobTitle ?? this.extractTitle(text),
      company: hint?.company ?? this.extractCompany(text),
      seniorityLevel,
      requiredExperience,
      preferredExperience,
      technicalSkills,
      softSkills,
      responsibilities,
      qualifications,
      educationRequirements,
      certifications,
      tools,
      programmingLanguages,
      frameworks,
      databases,
      cloudPlatforms,
      keywords,
      atsKeywords,
      actionVerbs,
    };
  }

  private extractTitle(text: string): string {
    // Try first non-empty line or "Job Title:" pattern
    const titleMatch = text.match(/job\s+title\s*:?\s*(.+)/i);
    if (titleMatch) return titleMatch[1].trim().slice(0, 100);
    const firstLine = text.split("\n").find((l) => l.trim().length > 3 && l.trim().length < 100);
    return firstLine?.trim() ?? "Unknown Title";
  }

  private extractCompany(text: string): string {
    const companyMatch = text.match(/company\s*:?\s*(.+)/i)
      || text.match(/about\s+(.+?)\s*[\n:]/i)
      || text.match(/at\s+([A-Z][a-zA-Z\s&.,]{2,40})\b/);
    return companyMatch ? companyMatch[1].trim().slice(0, 100) : "Unknown Company";
  }
}
