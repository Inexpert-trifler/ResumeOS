/**
 * Canonical Term Normalizer
 * Maps technology aliases, acronyms, and variations to canonical keys.
 * Preserves deterministic skill matching across JDs and Resumes.
 */

const ALIAS_MAP: Record<string, string> = {
  // Languages
  javascript: "javascript",
  js: "javascript",
  ecmascript: "javascript",

  typescript: "typescript",
  ts: "typescript",

  python: "python",
  py: "python",

  java: "java",
  cpp: "c++",
  "c++": "c++",
  csharp: "c#",
  "c#": "c#",

  golang: "go",
  go: "go",

  rust: "rust",
  ruby: "ruby",
  php: "php",
  swift: "swift",
  kotlin: "kotlin",
  sql: "sql",

  // Frameworks & Libraries
  react: "react",
  "react.js": "react",
  reactjs: "react",

  vue: "vue",
  "vue.js": "vue",
  vuejs: "vue",

  angular: "angular",
  angularjs: "angular",

  "next.js": "nextjs",
  nextjs: "nextjs",
  next: "nextjs",

  node: "nodejs",
  "node.js": "nodejs",
  nodejs: "nodejs",

  express: "express",
  "express.js": "express",
  expressjs: "express",

  nest: "nestjs",
  "nest.js": "nestjs",
  nestjs: "nestjs",

  fastapi: "fastapi",
  django: "django",
  flask: "flask",

  spring: "spring",
  "spring boot": "spring boot",
  springboot: "spring boot",

  tailwind: "tailwind",
  "tailwind css": "tailwind",
  tailwindcss: "tailwind",

  // Databases
  postgres: "postgresql",
  postgresql: "postgresql",
  psql: "postgresql",

  mongo: "mongodb",
  mongodb: "mongodb",

  mysql: "mysql",
  redis: "redis",
  dynamodb: "dynamodb",
  elasticsearch: "elasticsearch",
  supabase: "supabase",

  // Cloud & DevOps
  aws: "aws",
  "amazon web services": "aws",

  gcp: "gcp",
  "google cloud": "gcp",
  "google cloud platform": "gcp",

  azure: "azure",
  "microsoft azure": "azure",

  docker: "docker",
  k8s: "kubernetes",
  kubernetes: "kubernetes",
  terraform: "terraform",
  ansible: "ansible",
  jenkins: "jenkins",
  "github actions": "github actions",

  // Concepts & Practices
  microservices: "microservices",
  "rest api": "rest",
  rest: "rest",
  restful: "rest",
  graphql: "graphql",
  ci: "ci/cd",
  cd: "ci/cd",
  "ci/cd": "ci/cd",
  agile: "agile",
  scrum: "scrum",
};

export function normalizeTerm(term: string): string {
  const cleaned = term.toLowerCase().replace(/[^a-z0-9#+.]/g, " ").replace(/\s+/g, " ").trim();
  return ALIAS_MAP[cleaned] ?? cleaned;
}

export function extractNormalizedTerms(text: string): Set<string> {
  const lower = text.toLowerCase();
  const set = new Set<string>();

  for (const [raw, canonical] of Object.entries(ALIAS_MAP)) {
    const esc = raw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`\\b${esc}\\b`, "i");
    if (regex.test(lower)) {
      set.add(canonical);
    }
  }

  return set;
}
