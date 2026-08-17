import type { BuilderState, ResumeData } from "@/types";
import type { AnalysisSnapshot, RoadmapItem } from "@/lib/resume-analysis";
import { type AiImprovementRequest, type AiImprovementTarget } from "./types";

function createSkillListText(builder: BuilderState): string {
  return builder.skills.map((skill) => skill.name).filter(Boolean).join(", ");
}

function splitListLikeText(value: string): string[] {
  return value
    .split(/\n|•|·|,|;|\|/g)
    .map((item) => item.trim())
    .filter(Boolean);
}

function createExperienceSectionLabel(item: { role: string; company: string }): string {
  return `${item.role || "Experience"} at ${item.company || "Current role"}`;
}

function cloneBuilder(builder: BuilderState): BuilderState {
  return {
    ...builder,
    personalInfo: { ...builder.personalInfo },
    skills: builder.skills.map((skill) => ({ ...skill })),
    projects: builder.projects.map((project) => ({
      ...project,
      techStack: [...project.techStack],
      keyFeatures: [...project.keyFeatures],
    })),
    experience: builder.experience.map((experience) => ({
      ...experience,
      responsibilities: [...experience.responsibilities],
      achievements: [...experience.achievements],
    })),
    education: builder.education.map((education) => ({
      ...education,
      achievements: [...education.achievements],
    })),
    achievements: builder.achievements.map((achievement) => ({ ...achievement })),
    certificates: builder.certificates.map((certificate) => ({ ...certificate })),
    leadership: builder.leadership.map((leadership) => ({ ...leadership })),
    languages: builder.languages.map((language) => ({ ...language })),
    interests: [...builder.interests],
  };
}

function replaceFirstMatch(items: string[], originalText: string, improvedText: string): string[] {
  const index = items.findIndex((item) => item.trim() === originalText.trim());
  if (index === -1) {
    return items.length > 0 ? [improvedText, ...items.slice(1)] : [improvedText];
  }

  const next = [...items];
  next[index] = improvedText;
  return next;
}

function updateFirstSkillGroup(builder: BuilderState, improvedText: string): BuilderState {
  const nextSkills = splitListLikeText(improvedText);
  if (!nextSkills.length) return builder;

  const next = cloneBuilder(builder);
  next.skills = nextSkills.map((skill, index) => ({
    id: next.skills[index]?.id ?? `${Date.now()}-${index}`,
    name: skill,
    level: next.skills[index]?.level,
    category: next.skills[index]?.category,
  }));
  return next;
}

function updateSummary(builder: BuilderState, improvedText: string): BuilderState {
  return {
    ...cloneBuilder(builder),
    summary: improvedText,
  };
}

function updateExperienceBullet(builder: BuilderState, sourceText: string, improvedText: string): BuilderState {
  const next = cloneBuilder(builder);
  const experienceIndex = next.experience.findIndex((item) => createExperienceSectionLabel(item) === sourceText);
  const target = next.experience[experienceIndex] ?? next.experience[0];
  if (!target) return builder;

  const updatedResponsibilities = replaceFirstMatch(target.responsibilities, sourceText, improvedText);
  const updatedAchievements = replaceFirstMatch(target.achievements, sourceText, improvedText);

  next.experience[experienceIndex === -1 ? 0 : experienceIndex] = {
    ...target,
    responsibilities: updatedResponsibilities,
    achievements: updatedAchievements,
  };

  return next;
}

function updateProjectText(builder: BuilderState, sourceText: string, improvedText: string): BuilderState {
  const next = cloneBuilder(builder);
  const projectIndex = next.projects.findIndex((project) => project.name.trim() === sourceText.trim());
  const target = next.projects[projectIndex] ?? next.projects[0];
  if (!target) return builder;

  const nextProject = {
    ...target,
    description: target.description === sourceText ? improvedText : target.description,
    keyFeatures: replaceFirstMatch(target.keyFeatures, sourceText, improvedText),
    challenges: target.challenges.trim() === sourceText.trim() ? improvedText : target.challenges,
    achievements: target.achievements.trim() === sourceText.trim() ? improvedText : target.achievements,
  };

  next.projects[projectIndex === -1 ? 0 : projectIndex] = nextProject;
  return next;
}

function updateAchievement(builder: BuilderState, sourceText: string, improvedText: string): BuilderState {
  const next = cloneBuilder(builder);
  const achievementIndex = next.achievements.findIndex(
    (achievement) => achievement.description.trim() === sourceText.trim() || achievement.title.trim() === sourceText.trim()
  );
  const target = next.achievements[achievementIndex] ?? next.achievements[0];
  if (!target) return builder;

  next.achievements[achievementIndex === -1 ? 0 : achievementIndex] = {
    ...target,
    description: improvedText,
  };

  return next;
}

function updateLeadership(builder: BuilderState, sourceText: string, improvedText: string): BuilderState {
  const next = cloneBuilder(builder);
  const leadershipIndex = next.leadership.findIndex((item) => item.description.trim() === sourceText.trim() || item.role.trim() === sourceText.trim());
  const target = next.leadership[leadershipIndex] ?? next.leadership[0];
  if (!target) return builder;

  next.leadership[leadershipIndex === -1 ? 0 : leadershipIndex] = {
    ...target,
    description: improvedText,
  };

  return next;
}

export function canImproveRoadmapItemWithAi(item: RoadmapItem): boolean {
  return (
    item.category === "Resume Structure" ||
    item.category === "Skills" ||
    item.category === "Projects" ||
    item.category === "Experience" ||
    item.category === "Achievements" ||
    item.category === "ATS"
  );
}

function pickWeakBulletsText(builder: BuilderState, resume: ResumeData, analysis: AnalysisSnapshot, category: RoadmapItem["category"]): string {
  if (category === "Resume Structure") {
    return builder.summary.trim() || resume.summary.trim();
  }

  if (category === "Skills") {
    return createSkillListText(builder);
  }

  if (category === "ATS") {
    return builder.skills.length > 0 ? createSkillListText(builder) : builder.summary.trim() || resume.summary.trim();
  }

  const weakBullet = analysis.weakBullets.find((bullet) => {
    if (category === "Projects") {
      return resume.projects.some((project) => project.name === bullet.section);
    }
    if (category === "Experience") {
      return resume.experience.some((experience) => createExperienceSectionLabel({ role: experience.role, company: experience.company }) === bullet.section);
    }
    if (category === "Achievements") {
      return resume.achievements.some((achievement) => achievement.title === bullet.section);
    }
    return false;
  });

  return weakBullet?.original ?? "";
}

export function buildRoadmapAiTarget(
  item: RoadmapItem,
  builder: BuilderState,
  resume: ResumeData,
  analysis: AnalysisSnapshot
): AiImprovementTarget | null {
  if (!canImproveRoadmapItemWithAi(item)) {
    return null;
  }

  if (item.category === "Resume Structure") {
    const originalText = builder.summary.trim() || resume.summary.trim();
    return {
      sectionType: "summary",
      targetField: "summary",
      originalText,
      targetLabel: item.targetSection,
      apply: (nextBuilder, improvedText) => updateSummary(nextBuilder, improvedText),
    };
  }

  if (item.category === "Skills") {
    return {
      sectionType: "skills",
      targetField: "skills_list",
      originalText: createSkillListText(builder),
      targetLabel: item.targetSection,
      apply: (nextBuilder, improvedText) => updateFirstSkillGroup(nextBuilder, improvedText),
    };
  }

  if (item.category === "ATS") {
    const useSkills = builder.skills.length > 0;
    return {
      sectionType: useSkills ? "skills" : "summary",
      targetField: useSkills ? "skills_list" : "summary",
      originalText: pickWeakBulletsText(builder, resume, analysis, item.category),
      targetLabel: item.targetSection,
      apply: (nextBuilder, improvedText) => (useSkills ? updateFirstSkillGroup(nextBuilder, improvedText) : updateSummary(nextBuilder, improvedText)),
    };
  }

  const sourceText = pickWeakBulletsText(builder, resume, analysis, item.category);

  if (item.category === "Projects") {
    return {
      sectionType: "projects",
      targetField: sourceText.includes("\n") ? "project_description" : "project_bullet",
      originalText: sourceText,
      targetLabel: item.targetSection,
      apply: (nextBuilder, improvedText) => updateProjectText(nextBuilder, sourceText, improvedText),
    };
  }

  if (item.category === "Experience") {
    return {
      sectionType: "experience",
      targetField: "experience_bullet",
      originalText: sourceText,
      targetLabel: item.targetSection,
      apply: (nextBuilder, improvedText) => updateExperienceBullet(nextBuilder, sourceText, improvedText),
    };
  }

  if (item.category === "Achievements") {
    return {
      sectionType: "achievements",
      targetField: "achievement_description",
      originalText: sourceText,
      targetLabel: item.targetSection,
      apply: (nextBuilder, improvedText) => updateAchievement(nextBuilder, sourceText, improvedText),
    };
  }

  return null;
}

export function buildAiRequestFromRoadmapItem(
  item: RoadmapItem,
  builder: BuilderState,
  resume: ResumeData,
  analysis: AnalysisSnapshot
): { request: AiImprovementRequest; target: AiImprovementTarget } | null {
  const target = buildRoadmapAiTarget(item, builder, resume, analysis);
  if (!target) return null;

  return {
    request: {
      sectionType: target.sectionType,
      targetField: target.targetField,
      originalText: target.originalText,
      context: {
        recommendationId: item.id,
        recommendationTitle: item.title,
        recommendationCategory: item.category,
        targetSection: item.targetSection,
        targetLabel: target.targetLabel,
      },
    },
    target,
  };
}

export function buildAiRequestFromWeakBullet(
  bullet: { original: string; section: string },
  builder: BuilderState,
  resume: ResumeData
): { request: AiImprovementRequest; target: AiImprovementTarget } | null {
  const experienceMatch = resume.experience.find((item) => createExperienceSectionLabel(item) === bullet.section);
  if (experienceMatch) {
    return {
      request: {
        sectionType: "experience",
        targetField: "experience_bullet",
        originalText: bullet.original,
        context: {
          recommendationTitle: `Improve ${bullet.section}`,
          recommendationCategory: "Experience",
          targetSection: bullet.section,
          targetLabel: bullet.section,
        },
      },
      target: {
        sectionType: "experience",
        targetField: "experience_bullet",
        originalText: bullet.original,
        targetLabel: bullet.section,
        apply: (nextBuilder, improvedText) => updateExperienceBullet(nextBuilder, bullet.original, improvedText),
      },
    };
  }

  const projectMatch = resume.projects.find((item) => item.name === bullet.section);
  if (projectMatch) {
    return {
      request: {
        sectionType: "projects",
        targetField: "project_bullet",
        originalText: bullet.original,
        context: {
          recommendationTitle: `Improve ${bullet.section}`,
          recommendationCategory: "Projects",
          targetSection: bullet.section,
          targetLabel: bullet.section,
        },
      },
      target: {
        sectionType: "projects",
        targetField: "project_bullet",
        originalText: bullet.original,
        targetLabel: bullet.section,
        apply: (nextBuilder, improvedText) => updateProjectText(nextBuilder, bullet.original, improvedText),
      },
    };
  }

  const achievementMatch = resume.achievements.find((item) => item.title === bullet.section);
  if (achievementMatch) {
    return {
      request: {
        sectionType: "achievements",
        targetField: "achievement_description",
        originalText: bullet.original,
        context: {
          recommendationTitle: `Improve ${bullet.section}`,
          recommendationCategory: "Achievements",
          targetSection: bullet.section,
          targetLabel: bullet.section,
        },
      },
      target: {
        sectionType: "achievements",
        targetField: "achievement_description",
        originalText: bullet.original,
        targetLabel: bullet.section,
        apply: (nextBuilder, improvedText) => updateAchievement(nextBuilder, bullet.original, improvedText),
      },
    };
  }

  const leadershipMatch = resume.leadership.find((item) => item.role === bullet.section);
  if (leadershipMatch) {
    return {
      request: {
        sectionType: "leadership",
        targetField: "leadership_description",
        originalText: bullet.original,
        context: {
          recommendationTitle: `Improve ${bullet.section}`,
          recommendationCategory: "Leadership",
          targetSection: bullet.section,
          targetLabel: bullet.section,
        },
      },
      target: {
        sectionType: "leadership",
        targetField: "leadership_description",
        originalText: bullet.original,
        targetLabel: bullet.section,
        apply: (nextBuilder, improvedText) => updateLeadership(nextBuilder, bullet.original, improvedText),
      },
    };
  }

  return null;
}

export function applyAiImprovementToBuilder(
  builder: BuilderState,
  target: AiImprovementTarget,
  improvedText: string
): BuilderState {
  return target.apply(builder, improvedText);
}
