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

export const ACTION_VERB = /^(built|created|developed|designed|implemented|led|managed|optimized|improved|analyzed|delivered|collaborated|launched|automated|resolved|supported|tested|maintained|architected|spearheaded|engineered|shipped|orchestrated|authored|mentored|reduced|increased|established|scaled|refactored|overhauled|directed|coordinated|integrated|trained|guided|drove|championed|published|secured)\b/i;
export const WEAK_OPENING = /^(worked on|helped with|helped to|helped|responsible for|assisted with|assisted in|assisted|contributed to|participated in|tasked with|involved in)\b/i;

/**
 * Checks if a bullet contains concrete numbers, percentages, scale, durations, or currency.
 */
export function hasMetric(text: string): boolean {
  // 1. Percentage: e.g. 25%, 40.5%
  if (/\b\d+(?:\.\d+)?\s*%/i.test(text)) return true;

  // 2. Currency: e.g. $4.2M, $120K/year, 500 dollars
  if (/\$\s*[\d,.]+[kmb]?\b/i.test(text) || /\b\d+(?:\.\d+)?\s*(?:million|billion|thousand|k|m|b)\s*(?:dollars|usd|eur|annually|revenue)?\b/i.test(text)) return true;

  // 3. Counts / Scale: e.g. 50+ engineers, 4 junior engineers, 2M+ users, 300+ teams, 100K+ TPS, 5,000 monthly users
  if (/\b\d+(?:,\d{3})*(?:\.\d+)?[kmb]?\+?\s*(?:junior|senior|staff|lead)?\s*(?:engineers?|developers?|members?|people|users?|customers?|clients?|teams?|projects?|requests?|endpoints?|services?|stars?|prs?|tps|qps|nodes?|containers?|tables?|tests?)\b/i.test(text)) return true;

  // 4. Time / Durations / Reductions: e.g. 45 minutes to 8 minutes, 3 months, 6+ years
  if (/\b\d+\+?\s*(?:seconds?|minutes?|hours?|days?|weeks?|months?|years?)\b/i.test(text)) return true;

  // 5. Multipliers & standalone numbers with scale: e.g. 3x faster, 100K+, 2M+
  if (/\b\d+(?:\.\d+)?x\b/i.test(text) || /\b\d+(?:,\d{3})*\+?\b/.test(text) && /\b\d{2,}\+?\b/.test(text)) return true;

  return false;
}

/**
 * Clean up repetitive phrases, stuttered openings, and duplicated words.
 */
export function sanitizeAndDeduplicate(text: string): string {
  let cleaned = text.trim();

  // Remove template prefix accidentally prepended before an existing action verb
  cleaned = cleaned.replace(/^(?:Designed and built(?:\s+responsive)?|Optimized(?:\s+system performance)?|Architected and deployed(?:\s+scalable)?|Spearheaded)\s+((?:Designed|Built|Implemented|Architected|Led|Optimized|Developed|Created|Engineered|Shipped|Mentored)\b)/i, "$1");

  // Remove duplicate opening phrases (e.g. "Designed and implemented Designed and implemented")
  cleaned = cleaned.replace(/^([A-Z][a-zA-Z\s]{4,30}?)\s+\1/i, "$1");

  // Remove repeated consecutive identical words
  cleaned = cleaned.replace(/\b(\w+)\s+\1\b/gi, "$1");

  // Remove common hallucinated trailing templates
  cleaned = cleaned.replace(/,\s*(?:improving user engagement by \d+%).*$/i, ".");
  cleaned = cleaned.replace(/,\s*(?:delivering measurable performance and business impact).*$/i, ".");

  return cleaned.trim();
}

/**
 * Factually grounded deterministic bullet rewriter.
 * NEVER invents percentages, revenue, users, or metrics.
 * Replaces weak openings with powerful verbs while preserving original facts.
 */
export function buildImprovedBullet(original: string): string {
  const trimmed = original.trim();
  let cleaned = sanitizeAndDeduplicate(trimmed);

  // If starts with weak opening, cleanly replace with a strong action verb
  if (WEAK_OPENING.test(cleaned)) {
    const match = cleaned.match(WEAK_OPENING);
    const prefix = match ? match[0] : "";
    const remainder = cleaned.slice(prefix.length).trim();

    // Contextual replacement of opening phrase
    const lowerRemainder = remainder.toLowerCase();

    if (/^(building|to build|build)\b/i.test(remainder)) {
      cleaned = "Built " + remainder.replace(/^(building|to build|build)\s+/i, "");
    } else if (/^(improving|to improve|improve|optimizing|to optimize|optimize)\b/i.test(remainder)) {
      cleaned = "Optimized " + remainder.replace(/^(improving|to improve|improve|optimizing|to optimize|optimize)\s+/i, "");
    } else if (/^(developing|to develop|develop|creating|to create|create)\b/i.test(remainder)) {
      cleaned = "Developed " + remainder.replace(/^(developing|to develop|develop|creating|to create|create)\s+/i, "");
    } else if (/^(designing|to design|design)\b/i.test(remainder)) {
      cleaned = "Designed " + remainder.replace(/^(designing|to design|design)\s+/i, "");
    } else if (/^(implementing|to implement|implement)\b/i.test(remainder)) {
      cleaned = "Implemented " + remainder.replace(/^(implementing|to implement|implement)\s+/i, "");
    } else if (/^(leading|to lead|lead|managing|to manage|manage)\b/i.test(remainder)) {
      cleaned = "Led " + remainder.replace(/^(leading|to lead|lead|managing|to manage|manage)\s+/i, "");
    } else if (/^(maintaining|to maintain|maintain|testing|to test|test)\b/i.test(remainder)) {
      cleaned = "Maintained and tested " + remainder.replace(/^(maintaining|to maintain|maintain|testing|to test|test)\s+/i, "");
    } else if (/^(automating|to automate|automate)\b/i.test(remainder)) {
      cleaned = "Automated " + remainder.replace(/^(automating|to automate|automate)\s+/i, "");
    } else {
      // General replacement
      const firstWord = remainder.split(/\s+/)[0] || "";
      if (/ing$/i.test(firstWord)) {
        // e.g. "writing" -> "Wrote", "scaling" -> "Scaled"
        const converted = firstWord.charAt(0).toUpperCase() + firstWord.slice(1);
        cleaned = converted + " " + remainder.slice(firstWord.length).trim();
      } else {
        cleaned = "Engineered " + remainder;
      }
    }
  }

  // Ensure starts capitalized
  if (cleaned.length > 0) {
    cleaned = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
  }

  // Ensure ends with period
  if (cleaned.length > 0 && !/[.!?]$/.test(cleaned)) {
    cleaned += ".";
  }

  return sanitizeAndDeduplicate(cleaned);
}

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

    // Accurate weak bullet filtering: Only mark weak if uses weak opening, is very short, or lacks both action verb and metric
    const rawWeakBullets = bullets.filter(({ text }) => {
      const isWeakOpening = WEAK_OPENING.test(text);
      const isVeryShort = text.split(/\s+/).length < 6;
      const lacksVerbAndMetric = !ACTION_VERB.test(text) && !hasMetric(text);
      return isWeakOpening || isVeryShort || lacksVerbAndMetric;
    });

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
      suggestions: hasSummary ? ["Consider adding verified career highlights aligned to target roles."] : ["Add a 2-3 sentence summary highlighting your core expertise and achievements."],
    });

    // Experience
    const expBullets = resume.experience?.reduce((acc, e) => acc + (e.bullets?.length ?? 0), 0) ?? 0;
    const experienceScore = hasExperience ? clamp(50 + Math.min(expBullets * 7, 35) + (actionVerbsScore >= 60 ? 15 : 5)) : 0;
    sections.push({
      id: "experience",
      name: "Work Experience",
      score: experienceScore,
      strengths: hasExperience ? [`${resume.experience?.length} role(s) listed with structured bullet points.`] : [],
      weaknesses: hasExperience ? (rawWeakBullets.length > 0 ? ["Some bullets could use stronger action verbs."] : []) : ["Work experience section is missing."],
      suggestions: hasExperience ? ["Start bullets with direct action verbs and include metrics where available."] : ["Add your work experience entries with bullet points."],
    });

    // Skills
    const skillsScore = hasSkills ? clamp(Math.min(100, Math.max(75, skillCount * 8))) : 0;
    sections.push({
      id: "skills",
      name: "Technical & Soft Skills",
      score: skillsScore,
      strengths: hasSkills ? [`${skillCount} skill(s) categorized for ATS scanning.`] : [],
      weaknesses: hasSkills ? (skillCount < 6 ? ["Consider broadening your technical skills list."] : []) : ["Skills section is missing."],
      suggestions: hasSkills ? ["Ensure top technical skills from your target job description are included."] : ["Add your technical skills and frameworks."],
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

    // 7. Weak bullets suggestions (strictly factually grounded)
    const weakBullets = rawWeakBullets.slice(0, 4).map(({ text, section: sectionName }, index) => ({
      id: `${sectionName.replace(/\s+/g, "-")}-${index}`,
      original: text,
      section: sectionName,
      score: clamp((ACTION_VERB.test(text) ? 60 : 35) + (hasMetric(text) ? 30 : 0) + (text.split(/\s+/).length >= 8 ? 10 : 0)),
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
