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

const ACTION_VERB = /^(built|created|developed|designed|implemented|led|managed|optimized|improved|analyzed|delivered|collaborated|launched|automated|resolved|supported|tested|maintained)\b/i;
const WEAK_OPENING = /^(worked on|helped|responsible for|assisted|contributed to)\b/i;
const METRIC = /\b\d+(?:\.\d+)?\s*(?:%|x|ms|seconds?|minutes?|hours?|users?|customers?|projects?|requests?)\b/i;

const clamp = (value: number) => Math.max(0, Math.min(100, Math.round(value)));
const status = (score: number) => score >= 85 ? "Excellent" : score >= 65 ? "Good" : "Needs work";

function bulletsFor(resume: ResumeData) {
  const bullets: Array<{ text: string; section: string }> = [];
  for (const item of resume.experience ?? []) {
    for (const text of item.bullets ?? []) if (text.trim()) bullets.push({ text: text.trim(), section: item.role || item.company || "Experience" });
  }
  for (const item of resume.projects ?? []) {
    for (const text of item.bullets ?? []) if (text.trim()) bullets.push({ text: text.trim(), section: item.name || "Project" });
  }
  return bullets;
}

export class ResumeHealthService {
  analyze(resume: ResumeData): ResumeHealthReport {
    const bullets = bulletsFor(resume);
    const contacts = [resume.header?.email, resume.header?.phone, resume.header?.location, resume.header?.linkedin, resume.header?.github || resume.header?.portfolio];
    const contactScore = clamp((contacts.filter(Boolean).length / contacts.length) * 100);
    const presentSections = [Boolean(resume.summary?.trim()), Boolean(resume.experience?.length), Boolean(resume.education?.length), Boolean(resume.skills?.some((group) => group.skills?.length)), Boolean(resume.projects?.length)];
    const structureScore = clamp((presentSections.filter(Boolean).length / presentSections.length) * 100);
    const strongBullets = bullets.filter(({ text }) => ACTION_VERB.test(text)).length;
    const weakBullets = bullets.filter(({ text }) => WEAK_OPENING.test(text) || text.split(/\s+/).length < 8 || !METRIC.test(text));
    const actionVerbsScore = bullets.length ? clamp((strongBullets / bullets.length) * 100) : 0;
    const contentScore = clamp((Boolean(resume.summary?.trim()) ? 35 : 0) + (bullets.length >= 3 ? 35 : bullets.length * 10) + (resume.skills?.some((group) => group.skills?.length) ? 30 : 0));
    const score = clamp(contactScore * 0.2 + structureScore * 0.25 + actionVerbsScore * 0.25 + contentScore * 0.3);

    const section = (id: string, name: string, scoreValue: number, exists: boolean, suggestion: string): ResumeHealthSection => ({
      id, name, score: scoreValue,
      strengths: exists && scoreValue >= 70 ? [`${name} is present and readable.`] : [],
      weaknesses: exists ? (scoreValue < 70 ? [`${name} needs clearer, fact-based detail.`] : []) : [`${name} is missing.`],
      suggestions: exists ? (scoreValue < 90 ? [suggestion] : []) : [suggestion],
    });

    return {
      score,
      contentScore,
      actionVerbsScore,
      contactScore,
      structureScore,
      scoreCards: [
        { id: "resume-health", title: "Resume ATS Health", score, status: status(score), description: "Deterministic structural and content-readiness score. This is separate from Job Match Score.", icon: "Target", color: "text-green-500" },
        { id: "content", title: "Content Quality", score: contentScore, status: status(contentScore), description: "Based on supplied summary, skills, and resume bullets.", icon: "FileText", color: "text-blue-500" },
        { id: "verbs", title: "Action Verbs", score: actionVerbsScore, status: status(actionVerbsScore), description: "Based only on action verbs present in your bullets.", icon: "Zap", color: "text-yellow-500" },
        { id: "structure", title: "Resume Structure", score: structureScore, status: status(structureScore), description: "Based on standard resume sections that are actually present.", icon: "Layout", color: "text-purple-500" },
      ],
      formattingMetrics: [
        { name: "Contact Completeness", score: contactScore, status: status(contactScore), icon: "AlignLeft" },
        { name: "Section Coverage", score: structureScore, status: status(structureScore), icon: "MoveVertical" },
        { name: "Content Coverage", score: contentScore, status: status(contentScore), icon: "Type" },
        { name: "Action Verbs", score: actionVerbsScore, status: status(actionVerbsScore), icon: "MoveHorizontal" },
      ],
      sectionAnalysis: [
        section("summary", "Professional Summary", resume.summary?.trim().length ? Math.min(100, resume.summary.trim().split(/\s+/).length * 4) : 0, Boolean(resume.summary?.trim()), "Add a concise summary using only verified skills and experience."),
        section("experience", "Experience", bullets.length ? clamp(40 + Math.min(bullets.length * 8, 35) + actionVerbsScore * 0.25) : 0, Boolean(resume.experience?.length), "Use stronger action verbs and add a verified metric only when you have one."),
        section("skills", "Skills", resume.skills?.some((group) => group.skills?.length) ? 80 : 0, Boolean(resume.skills?.some((group) => group.skills?.length)), "List skills you genuinely have and that are relevant to the target job."),
        section("education", "Education", resume.education?.length ? 90 : 0, Boolean(resume.education?.length), "Add your verified degree, institution, and field of study."),
      ],
      weakBullets: weakBullets.slice(0, 4).map(({ text, section: sectionName }, index) => ({
        id: `${sectionName}-${index}`, original: text, section: sectionName,
        score: clamp((ACTION_VERB.test(text) ? 55 : 35) + (METRIC.test(text) ? 35 : 0) + (text.split(/\s+/).length >= 8 ? 10 : 0)),
        suggestion: "Rewrite with a stronger action verb. Add a metric only if it is accurate and you can verify it.",
      })),
      atsSimulation: [
        { id: "sections", state: structureScore >= 60 ? "pass" : "warn", message: structureScore >= 60 ? "Standard resume sections were detected." : "Add clear Summary, Experience, Education, Skills, or Projects sections." },
        { id: "contact", state: contactScore >= 80 ? "pass" : "warn", message: contactScore >= 80 ? "Contact information is sufficiently complete for parsing." : "Add the missing contact details for reliable ATS parsing." },
        { id: "content", state: contentScore >= 60 ? "pass" : "warn", message: contentScore >= 60 ? "Resume content is available for ATS matching." : "Add factual summary, skills, or bullet content before relying on a match score." },
      ],
    };
  }
}
