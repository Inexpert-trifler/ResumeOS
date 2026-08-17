/**
 * Job Analysis Service
 * Computes job complexity metrics and insight strings from parsed JD data.
 * All scores are 0–100 integers.
 */

import type { ParsedJobData } from "./job-parser.service";

export interface JobInsights {
  jobComplexity: number;
  atsDifficulty: number;
  technicalDepth: number;
  leadershipRequirement: number;
  communicationRequirement: number;
  estimatedCompetition: "low" | "medium" | "high" | "very-high";
  seniorityLevel: string;
  insights: string[];
}

const LEADERSHIP_SIGNALS = [
  "lead", "manage", "mentor", "director", "head of", "vp", "vice president",
  "principal", "architect", "team lead", "tech lead", "engineering manager",
  "supervise", "coordinate", "coach", "guide", "own", "drive", "champion",
];

const COMMUNICATION_SIGNALS = [
  "communication", "present", "stakeholder", "cross-functional", "collaborate",
  "interpersonal", "verbal", "written", "documentation", "report", "negotiate",
  "client-facing", "customer-facing", "executive", "c-suite",
];

export class JobAnalysisService {
  analyze(parsed: ParsedJobData, rawText: string): JobInsights {
    const lower = rawText.toLowerCase();

    const jobComplexity = this.computeComplexity(parsed);
    const atsDifficulty = this.computeAtsDifficulty(parsed);
    const technicalDepth = this.computeTechnicalDepth(parsed);
    const leadershipRequirement = this.computeLeadership(lower);
    const communicationRequirement = this.computeCommunication(lower);
    const estimatedCompetition = this.computeCompetition(parsed, leadershipRequirement);

    const insights = this.generateInsights(parsed, {
      jobComplexity,
      atsDifficulty,
      technicalDepth,
      leadershipRequirement,
      communicationRequirement,
      estimatedCompetition,
    });

    return {
      jobComplexity,
      atsDifficulty,
      technicalDepth,
      leadershipRequirement,
      communicationRequirement,
      estimatedCompetition,
      seniorityLevel: parsed.seniorityLevel,
      insights,
    };
  }

  private computeComplexity(parsed: ParsedJobData): number {
    let score = 0;
    score += Math.min(parsed.responsibilities.length * 3, 30);
    score += Math.min(parsed.technicalSkills.length * 2, 30);
    score += Math.min(parsed.qualifications.length * 2, 20);
    const seniorityBonus = {
      intern: 0, junior: 5, mid: 15, senior: 25, lead: 35, principal: 40, director: 45,
    }[parsed.seniorityLevel] ?? 15;
    score += seniorityBonus;
    return Math.min(100, Math.round(score));
  }

  private computeAtsDifficulty(parsed: ParsedJobData): number {
    // ATS difficulty = how many specific keywords the ATS likely looks for
    let score = 0;
    score += Math.min(parsed.atsKeywords.length * 2, 40);
    score += Math.min(parsed.programmingLanguages.length * 4, 20);
    score += Math.min(parsed.frameworks.length * 3, 20);
    score += Math.min(parsed.certifications.length * 5, 20);
    return Math.min(100, Math.round(score));
  }

  private computeTechnicalDepth(parsed: ParsedJobData): number {
    let score = 0;
    score += Math.min(parsed.programmingLanguages.length * 8, 30);
    score += Math.min(parsed.frameworks.length * 5, 25);
    score += Math.min(parsed.databases.length * 5, 15);
    score += Math.min(parsed.cloudPlatforms.length * 4, 15);
    score += Math.min(parsed.tools.length * 2, 15);
    return Math.min(100, Math.round(score));
  }

  private computeLeadership(lower: string): number {
    let hits = 0;
    for (const signal of LEADERSHIP_SIGNALS) {
      const esc = signal.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      if (new RegExp(`\\b${esc}\\b`).test(lower)) hits++;
    }
    return Math.min(100, Math.round(hits * 8));
  }

  private computeCommunication(lower: string): number {
    let hits = 0;
    for (const signal of COMMUNICATION_SIGNALS) {
      const esc = signal.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      if (new RegExp(`\\b${esc}\\b`).test(lower)) hits++;
    }
    return Math.min(100, Math.round(hits * 7));
  }

  private computeCompetition(
    parsed: ParsedJobData,
    leadershipScore: number,
  ): "low" | "medium" | "high" | "very-high" {
    const seniority = parsed.seniorityLevel;
    const techCount = parsed.technicalSkills.length;

    // Roles with many requirements + low seniority = very competitive
    if (seniority === "junior" || seniority === "intern") {
      if (techCount < 5) return "very-high"; // Entry level with few requirements = flooded
      return "high";
    }
    if (seniority === "director" || seniority === "principal") return "low";
    if (seniority === "lead" || leadershipScore >= 60) return "medium";
    if (seniority === "senior") return "medium";
    return "high"; // mid level — generally competitive
  }

  private generateInsights(
    parsed: ParsedJobData,
    metrics: Omit<JobInsights, "insights" | "seniorityLevel">,
  ): string[] {
    const list: string[] = [];

    if (metrics.technicalDepth >= 70) {
      list.push(`High technical depth — ${parsed.programmingLanguages.length} languages and ${parsed.frameworks.length} frameworks are mentioned.`);
    }
    if (metrics.jobComplexity >= 70) {
      list.push("This role has high overall complexity — expect a multi-round interview process.");
    }
    if (metrics.atsDifficulty >= 60) {
      list.push("ATS screening will be competitive. Ensure your resume mirrors exact keyword spelling from the JD.");
    }
    if (metrics.leadershipRequirement >= 50) {
      list.push("Leadership skills are prominently required — highlight team/project ownership experience.");
    }
    if (metrics.communicationRequirement >= 50) {
      list.push("Strong cross-functional communication is expected — showcase stakeholder interaction in your resume.");
    }
    if (metrics.estimatedCompetition === "very-high") {
      list.push("Expect very high application volume. A strong tailored resume and referral significantly improves chances.");
    }
    if (parsed.certifications.length > 0) {
      list.push(`${parsed.certifications.length} certification(s) mentioned — having these will differentiate your application.`);
    }
    if (parsed.cloudPlatforms.length >= 2) {
      list.push(`Multi-cloud experience expected: ${parsed.cloudPlatforms.slice(0, 3).join(", ")}.`);
    }
    if (parsed.databases.length >= 3) {
      list.push(`Broad database knowledge required: ${parsed.databases.slice(0, 3).join(", ")}.`);
    }
    if (parsed.requiredExperience) {
      list.push(`Experience requirement: ${parsed.requiredExperience}.`);
    }
    if (list.length === 0) {
      list.push("Standard role — tailor your resume to match the key skills mentioned in the job description.");
    }

    return list.slice(0, 8);
  }
}
