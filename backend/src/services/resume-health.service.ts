import type { ResumeData } from "./job-analysis.service";

export interface ResumeHealthMetric {
  name: string;
  score: number;
  status: string;
  icon: string;
}

export interface ResumeHealthSection {
  id: string;
  name: string;
  score: number;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
}

export interface ResumeHealthReport {
  score: number;
  contentScore: number;
  actionVerbsScore: number;
  contactScore: number;
  structureScore: number;
  scoreCards: Array<{ id: string; title: string; score: number; status: string; description: string; icon: string; color: string }>;
  formattingMetrics: ResumeHealthMetric[];
  sectionAnalysis: ResumeHealthSection[];
  weakBullets: Array<{ id: string; original: string; suggestion: string; score: number; section: string }>;
  atsSimulation: Array<{ id: string; state: "pass" | "warn"; message: string }>;
}

const ACTION_VERB = /^(built|created|developed|designed|implemented|led|managed|optimized|improved|analyzed|delivered|collaborated|launched|automated|resolved|supported|tested|maintained|architected|spearheaded|engineered|shipped|orchestrated|authored|mentored|reduced|increased)\b/i;
const WEAK_OPENING = /^(worked on|helped|responsible for|assisted|contributed to)\b/i;
const METRIC = /\b\d+(?:\.\d+)?\s*(?:%|x|ms|seconds?|minutes?|hours?|users?|customers?|projects?|requests?|k|m|tps|\$|stars?)\b/i;

const clamp = (value: number) => Math.max(0, Math.min(100, Math.round(value)));
const status = (score: number) => score >= 85 ? "Excellent" : score >= 65 ? "Good" : "Needs work";

function bulletsFor(resume: ResumeData) {
  const bullets: Array<{ text: string; section: string }> = [];
  for (const item of resume.experience ?? []) {
    for (const text of item.bullets ?? []) {
      if (text.trim()) bullets.push({ text: text.trim(), section: `${item.role || "Experience"} at ${item.company || "Company"}` });
    }
  }
  for (const item of resume.projects ?? []) {
    for (const text of item.bullets ?? []) {
      if (text.trim()) bullets.push({ text: text.trim(), section: item.name || "Project" });
    }
  }
  for (const item of resume.leadership ?? []) {
    for (const text of item.bullets ?? []) {
      if (text.trim()) bullets.push({ text: text.trim(), section: item.role || item.organization || "Leadership" });
    }
  }
  return bullets;
}

function buildImprovedBullet(original: string): string {
  const trimmed = original.trim();
  const cleaned = trimmed.replace(WEAK_OPENING, "").trim();
  const lower = original.toLowerCase();

  if (lower.includes("performance") || lower.includes("latency") || lower.includes("speed")) {
    return `Optimized ${cleaned || "system performance"}, reducing latency by 35% and improving responsiveness.`;
  }
  if (lower.includes("api") || lower.includes("backend") || lower.includes("service")) {
    return `Architected and deployed scalable ${cleaned || "APIs"}, handling high request volume with 99.9% reliability.`;
  }
  if (lower.includes("dashboard") || lower.includes("ui") || lower.includes("frontend") || lower.includes("react")) {
    return `Designed and built responsive ${cleaned || "user interface"}, improving user engagement by 25%.`;
  }
  if (cleaned) {
    const capitalized = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
    return `Spearheaded ${capitalized}, delivering measurable performance and business impact.`;
  }
  return "Rewrite with a strong action verb (e.g., Architected, Optimized, Shipped), a quantifiable metric (% or $), and the outcome.";
}

export class ResumeHealthService {
  analyze(resume: ResumeData): ResumeHealthReport {
    const bullets = bulletsFor(resume);

    // 1. Contact checks
    const contacts = [
      resume.header?.email,
      resume.header?.phone,
      resume.header?.location,
      resume.header?.linkedin,
      resume.header?.github || resume.header?.portfolio,
    ];
    const contactScore = clamp((contacts.filter(Boolean).length / contacts.length) * 100);

    // 2. Section presence checks
    const hasSummary = Boolean(resume.summary?.trim());
    const hasExperience = Boolean(resume.experience && resume.experience.length > 0);
    const hasEducation = Boolean(resume.education && resume.education.length > 0);
    const hasSkills = Boolean(resume.skills && resume.skills.some((group) => (group.skills && group.skills.length > 0)));
    const hasProjects = Boolean(resume.projects && resume.projects.length > 0);
    const hasAchievements = Boolean(resume.achievements && resume.achievements.length > 0);
    const hasCertificates = Boolean(resume.certificates && resume.certificates.length > 0);
    const hasLanguages = Boolean(resume.languages && resume.languages.length > 0);
    const hasInterests = Boolean(resume.interests && resume.interests.length > 0);

    const standardSections = [hasSummary, hasExperience, hasEducation, hasSkills, hasProjects];
    const structureScore = clamp((standardSections.filter(Boolean).length / standardSections.length) * 100);

    // 3. Bullets & action verbs checks
    const strongBullets = bullets.filter(({ text }) => ACTION_VERB.test(text)).length;
    const rawWeakBullets = bullets.filter(({ text }) => WEAK_OPENING.test(text) || text.split(/\s+/).length < 6 || !METRIC.test(text));
    const actionVerbsScore = bullets.length ? clamp((strongBullets / bullets.length) * 100) : (hasExperience || hasProjects ? 50 : 0);

    // 4. Content score
    const skillCount = resume.skills?.reduce((acc, g) => acc + (g.skills?.length ?? 0), 0) ?? 0;
    const contentScore = clamp(
      (hasSummary ? 30 : 0) +
      (bullets.length >= 4 ? 35 : bullets.length * 8) +
      (skillCount >= 6 ? 25 : skillCount * 4) +
      (hasEducation ? 10 : 0)
    );

    // 5. Total ATS Health Score
    const score = clamp(contactScore * 0.20 + structureScore * 0.30 + actionVerbsScore * 0.25 + contentScore * 0.25);

    // 6. Section Analysis
    const sections: ResumeHealthSection[] = [];

    // Summary
    const summaryWordCount = resume.summary?.trim() ? resume.summary.trim().split(/\s+/).length : 0;
    const summaryScore = hasSummary ? clamp(Math.min(100, Math.max(70, summaryWordCount * 3))) : 0;
    sections.push({
      id: "summary",
      name: "Professional Summary",
      score: summaryScore,
      strengths: hasSummary ? ["Concise, informative narrative setting role direction."] : [],
      weaknesses: hasSummary ? (summaryWordCount < 15 ? ["Summary is very brief; consider expanding on key strengths."] : []) : ["Professional summary is missing from your resume."],
      suggestions: hasSummary ? ["Reinforce 1-2 quantifiable career achievements aligned to target roles."] : ["Add a 2-3 sentence summary highlighting your core expertise and achievements."],
    });

    // Experience
    const expBullets = resume.experience?.reduce((acc, e) => acc + (e.bullets?.length ?? 0), 0) ?? 0;
    const experienceScore = hasExperience ? clamp(50 + Math.min(expBullets * 7, 35) + (actionVerbsScore >= 60 ? 15 : 5)) : 0;
    sections.push({
      id: "experience",
      name: "Work Experience",
      score: experienceScore,
      strengths: hasExperience ? [`${resume.experience?.length} role(s) listed with structured bullet points.`] : [],
      weaknesses: hasExperience ? (rawWeakBullets.length > 0 ? ["Some bullets could use stronger action verbs or measurable impact."] : []) : ["Work experience section is missing."],
      suggestions: hasExperience ? ["Start every bullet with a power action verb and add measurable metrics (% or $)."] : ["Add your work experience entries with bullet points."],
    });

    // Skills
    const skillsScore = hasSkills ? clamp(Math.min(100, Math.max(75, skillCount * 8))) : 0;
    sections.push({
      id: "skills",
      name: "Technical & Soft Skills",
      score: skillsScore,
      strengths: hasSkills ? [`${skillCount} skill(s) categorized for ATS scanning.`] : [],
      weaknesses: hasSkills ? (skillCount < 6 ? ["Consider broadening your technical skills list."] : []) : ["Skills section is missing."],
      suggestions: hasSkills ? ["Ensure top keywords from your target job description are included."] : ["Add your technical skills and frameworks."],
    });

    // Education
    const educationScore = hasEducation ? 95 : 0;
    sections.push({
      id: "education",
      name: "Education",
      score: educationScore,
      strengths: hasEducation ? ["Degree and institution clearly stated."] : [],
      weaknesses: hasEducation ? [] : ["Education section is missing."],
      suggestions: hasEducation ? ["Include relevant coursework, honors, or GPA if applicable."] : ["Add your education details."],
    });

    // Projects
    if (hasProjects) {
      const projScore = clamp(80 + Math.min((resume.projects?.length ?? 0) * 8, 20));
      sections.push({
        id: "projects",
        name: "Projects",
        score: projScore,
        strengths: [`${resume.projects?.length} project(s) demonstrating hands-on technical execution.`],
        weaknesses: [],
        suggestions: ["Include links to live demos or GitHub repositories for proof of work."],
      });
    }

    // Achievements & Certificates
    if (hasAchievements || hasCertificates) {
      sections.push({
        id: "achievements_certs",
        name: "Certifications & Achievements",
        score: 95,
        strengths: ["Industry certifications and awards validate professional credibility."],
        weaknesses: [],
        suggestions: ["Keep credential verification links up to date."],
      });
    }

    // Languages & Interests
    if (hasLanguages || hasInterests) {
      sections.push({
        id: "additional",
        name: "Languages & Interests",
        score: 90,
        strengths: ["Provides personality and international/communication readiness."],
        weaknesses: [],
        suggestions: [],
      });
    }

    // 7. Weak bullets suggestions
    const weakBullets = rawWeakBullets.slice(0, 4).map(({ text, section: sectionName }, index) => ({
      id: `${sectionName.replace(/\s+/g, "-")}-${index}`,
      original: text,
      section: sectionName,
      score: clamp((ACTION_VERB.test(text) ? 60 : 35) + (METRIC.test(text) ? 30 : 0) + (text.split(/\s+/).length >= 8 ? 10 : 0)),
      suggestion: buildImprovedBullet(text),
    }));

    // 8. ATS Simulation results
    const atsSimulation = [
      {
        id: "sections",
        state: (structureScore >= 80 ? "pass" : "warn") as "pass" | "warn",
        message: structureScore >= 80
          ? "Standard headings correctly identified (Summary, Experience, Skills, Education, Projects)."
          : "Add missing standard sections (Summary, Experience, Education, or Skills) for optimal ATS parsing.",
      },
      {
        id: "contact",
        state: (contactScore >= 80 ? "pass" : "warn") as "pass" | "warn",
        message: contactScore >= 80
          ? "Contact information parsed successfully (Email, Phone, Location, Links)."
          : "Add missing contact details (e.g. Email, Phone, LinkedIn) so ATS and recruiters can reach you.",
      },
      {
        id: "content",
        state: (contentScore >= 60 ? "pass" : "warn") as "pass" | "warn",
        message: contentScore >= 60
          ? "Resume content density meets ATS parsing thresholds."
          : "Expand summary and experience bullets with verifiable facts and outcomes.",
      },
      {
        id: "verbs",
        state: (actionVerbsScore >= 60 ? "pass" : "warn") as "pass" | "warn",
        message: actionVerbsScore >= 60
          ? "Strong action verbs detected across experience and project bullets."
          : "Replace passive openings (e.g. 'Worked on', 'Helped') with direct action verbs.",
      },
    ];

    return {
      score,
      contentScore,
      actionVerbsScore,
      contactScore,
      structureScore,
      scoreCards: [
        { id: "resume-health", title: "Resume ATS Health", score, status: status(score), description: "Structural and content readiness of your resume for ATS parsers.", icon: "Target", color: "text-green-500" },
        { id: "content", title: "Content Quality", score: contentScore, status: status(contentScore), description: "Evaluates narrative depth, skills breadth, and bullet descriptions.", icon: "FileText", color: "text-blue-500" },
        { id: "verbs", title: "Action Verbs", score: actionVerbsScore, status: status(actionVerbsScore), description: "Percentage of bullets starting with strong, active impact verbs.", icon: "Zap", color: "text-yellow-500" },
        { id: "structure", title: "Resume Structure", score: structureScore, status: status(structureScore), description: "Presence of standard ATS sections (Summary, Experience, Skills, Education, Projects).", icon: "Layout", color: "text-purple-500" },
      ],
      formattingMetrics: [
        { name: "Contact Completeness", score: contactScore, status: status(contactScore), icon: "AlignLeft" },
        { name: "Section Coverage", score: structureScore, status: status(structureScore), icon: "MoveVertical" },
        { name: "Content Coverage", score: contentScore, status: status(contentScore), icon: "Type" },
        { name: "Action Verbs", score: actionVerbsScore, status: status(actionVerbsScore), icon: "MoveHorizontal" },
      ],
      sectionAnalysis: sections,
      weakBullets,
      atsSimulation,
    };
  }
}
