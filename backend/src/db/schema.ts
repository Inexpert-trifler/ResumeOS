import { boolean, index, integer, jsonb, pgTable, text, timestamp, uniqueIndex, uuid } from "drizzle-orm/pg-core";

const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
};

export const users = pgTable(
  "users",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    clerkUserId: text("clerk_user_id").notNull(),
    email: text("email").notNull(),
    name: text("name"),
    avatarUrl: text("avatar_url"),
    ...timestamps,
  },
  (table) => [uniqueIndex("users_clerk_user_id_unique").on(table.clerkUserId), uniqueIndex("users_email_unique").on(table.email)]
);

export const resumes = pgTable(
  "resumes",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    title: text("title").notNull().default("Untitled resume"),
    resumeJson: jsonb("resume_json").notNull(),
    selectedTemplate: text("selected_template").notNull().default("classic"),
    resumeScore: integer("resume_score"),
    atsScore: integer("ats_score"),
    isFavorite: boolean("is_favorite").notNull().default(false),
    ...timestamps,
  },
  (table) => [index("resumes_user_updated_at_idx").on(table.userId, table.updatedAt)]
);

export const resumeVersions = pgTable(
  "resume_versions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    resumeId: uuid("resume_id").notNull().references(() => resumes.id, { onDelete: "cascade" }),
    versionNumber: integer("version_number").notNull(),
    resumeJson: jsonb("resume_json").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [uniqueIndex("resume_versions_resume_version_unique").on(table.resumeId, table.versionNumber)]
);

// ─── Job Intelligence Engine ──────────────────────────────────────────────────

export const jobDescriptions = pgTable(
  "job_descriptions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    // Core identification fields
    jobTitle: text("job_title").notNull(),
    company: text("company").notNull(),
    location: text("location"),
    employmentType: text("employment_type"), // full-time | part-time | contract | internship | freelance
    workMode: text("work_mode"),             // remote | hybrid | on-site
    salary: text("salary"),
    notes: text("notes"),
    // Raw & parsed content
    rawDescription: text("raw_description").notNull(),
    parsedData: jsonb("parsed_data"),        // cached ParsedJobData JSON
    // Meta
    status: text("status").notNull().default("saved"), // saved | applied | interviewing | offer | rejected
    isParsed: boolean("is_parsed").notNull().default(false),
    ...timestamps,
  },
  (table) => [
    index("job_descriptions_user_updated_at_idx").on(table.userId, table.updatedAt),
    index("job_descriptions_user_status_idx").on(table.userId, table.status),
  ]
);

export const jobKeywords = pgTable(
  "job_keywords",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    jobId: uuid("job_id").notNull().references(() => jobDescriptions.id, { onDelete: "cascade" }),
    keyword: text("keyword").notNull(),
    category: text("category").notNull(), // required | preferred | optional
    keywordType: text("keyword_type").notNull(), // technical | soft | action | ats | tool | language | framework | database | cloud
    frequency: integer("frequency").notNull().default(1),
    weight: integer("weight").notNull().default(50), // 0–100 importance weight
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("job_keywords_job_idx").on(table.jobId),
    index("job_keywords_category_idx").on(table.jobId, table.category),
  ]
);

export const jobAnalysis = pgTable(
  "job_analysis",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    jobId: uuid("job_id").notNull().references(() => jobDescriptions.id, { onDelete: "cascade" }),
    // Computed metrics (0–100 unless noted)
    jobComplexity: integer("job_complexity"),
    atsDifficulty: integer("ats_difficulty"),
    technicalDepth: integer("technical_depth"),
    leadershipRequirement: integer("leadership_requirement"),
    communicationRequirement: integer("communication_requirement"),
    estimatedCompetition: text("estimated_competition"), // low | medium | high | very-high
    seniorityLevel: text("seniority_level"),             // intern | junior | mid | senior | lead | principal | director
    insights: jsonb("insights"),                         // string[]
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("job_analysis_job_id_unique").on(table.jobId),
  ]
);

export const resumeJobLinks = pgTable(
  "resume_job_links",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    resumeId: uuid("resume_id").notNull().references(() => resumes.id, { onDelete: "cascade" }),
    jobId: uuid("job_id").notNull().references(() => jobDescriptions.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("resume_job_links_unique").on(table.resumeId, table.jobId),
    index("resume_job_links_resume_idx").on(table.resumeId),
    index("resume_job_links_job_idx").on(table.jobId),
  ]
);

// ─── Resume Analysis & AI History ─────────────────────────────────────────────

export const resumeAnalysis = pgTable("resume_analysis", {
  id: uuid("id").defaultRandom().primaryKey(),
  resumeId: uuid("resume_id").notNull().references(() => resumes.id, { onDelete: "cascade" }),
  overallScore: integer("overall_score"),
  atsScore: integer("ats_score"),
  strengths: jsonb("strengths"),
  weaknesses: jsonb("weaknesses"),
  recommendations: jsonb("recommendations"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const aiHistory = pgTable("ai_history", {
  id: uuid("id").defaultRandom().primaryKey(),
  resumeId: uuid("resume_id").notNull().references(() => resumes.id, { onDelete: "cascade" }),
  section: text("section").notNull(),
  originalText: text("original_text").notNull(),
  improvedText: text("improved_text").notNull(),
  accepted: boolean("accepted").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const userSettings = pgTable(
  "user_settings",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    theme: text("theme").notNull().default("system"),
    defaultTemplate: text("default_template").notNull().default("classic"),
    defaultFont: text("default_font").notNull().default("Inter"),
    accentColor: text("accent_color").notNull().default("#6366f1"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [uniqueIndex("user_settings_user_id_unique").on(table.userId)]
);

// ─── Career Toolkit ──────────────────────────────────────────────────────────

export const coachConversations = pgTable("coach_conversations", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  title: text("title"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const coachMessages = pgTable("coach_messages", {
  id: uuid("id").defaultRandom().primaryKey(),
  conversationId: uuid("conversation_id").notNull().references(() => coachConversations.id, { onDelete: "cascade" }),
  role: text("role").notNull(), // user | assistant
  content: text("content").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const coverLetters = pgTable("cover_letters", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  resumeId: uuid("resume_id").notNull().references(() => resumes.id, { onDelete: "cascade" }),
  jobId: uuid("job_id").notNull().references(() => jobDescriptions.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  content: text("content").notNull(),
  tone: text("tone").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const interviewSessions = pgTable("interview_sessions", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  resumeId: uuid("resume_id").notNull().references(() => resumes.id, { onDelete: "cascade" }),
  jobId: uuid("job_id").notNull().references(() => jobDescriptions.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const interviewQuestions = pgTable("interview_questions", {
  id: uuid("id").defaultRandom().primaryKey(),
  sessionId: uuid("session_id").notNull().references(() => interviewSessions.id, { onDelete: "cascade" }),
  category: text("category").notNull(),
  question: text("question").notNull(),
  difficulty: text("difficulty"),
  whyItMayBeAsked: text("why_it_may_be_asked"),
  suggestedAnswer: text("suggested_answer"),
  keyPoints: jsonb("key_points"), // array of strings
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const interviewAnswers = pgTable("interview_answers", {
  id: uuid("id").defaultRandom().primaryKey(),
  questionId: uuid("question_id").notNull().references(() => interviewQuestions.id, { onDelete: "cascade" }),
  answerText: text("answer_text").notNull(),
  feedback: text("feedback"),
  score: integer("score"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const careerRoadmaps = pgTable("career_roadmaps", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  targetRole: text("target_role").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const careerRoadmapItems = pgTable("career_roadmap_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  roadmapId: uuid("roadmap_id").notNull().references(() => careerRoadmaps.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description"),
  category: text("category"),
  priority: text("priority"),
  estimatedTime: text("estimated_time"),
  skills: jsonb("skills"), // array of strings
  resources: jsonb("resources"), // array of objects/strings
  status: text("status").notNull().default("NOT_STARTED"), // NOT_STARTED | IN_PROGRESS | COMPLETED
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});
