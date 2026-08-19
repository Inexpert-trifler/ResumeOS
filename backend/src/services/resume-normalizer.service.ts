import type { ResumeData } from "./job-analysis.service";

/**
 * Normalizes any incoming resume representation (ResumeData, ResumeDraft, BuilderState, or raw DB json)
 * into a canonical, fully-populated ResumeData object.
 */
export function normalizeResumeData(input: unknown): ResumeData | null {
  if (!input || typeof input !== "object") {
    return null;
  }

  const raw = input as Record<string, unknown>;

  // Case 1: If wrapped as ResumeDraft (has .resume or .builder)
  let sourceResume: Record<string, unknown> | null = null;
  let sourceBuilder: Record<string, unknown> | null = null;

  if (raw.resume && typeof raw.resume === "object") {
    sourceResume = raw.resume as Record<string, unknown>;
  }
  if (raw.builder && typeof raw.builder === "object") {
    sourceBuilder = raw.builder as Record<string, unknown>;
  }

  // If no draft wrapper, raw itself might be ResumeData or BuilderState
  if (!sourceResume && !sourceBuilder) {
    if (Array.isArray(raw.experience) || Array.isArray(raw.skills) || typeof raw.summary === "string") {
      sourceResume = raw;
    }
  }

  const res = sourceResume ?? {};
  const bld = sourceBuilder ?? {};

  // 1. Header extraction
  const resHeader = (res.header && typeof res.header === "object" ? res.header : {}) as Record<string, unknown>;
  const bldPersonal = (bld.personalInfo && typeof bld.personalInfo === "object" ? bld.personalInfo : {}) as Record<string, unknown>;

  const firstName = (bldPersonal.firstName as string) || "";
  const lastName = (bldPersonal.lastName as string) || "";
  const builderName = [firstName, lastName].filter(Boolean).join(" ");

  const name = (resHeader.name as string) || builderName || "";
  const title = (resHeader.title as string) || (bld.targetRole as string) || "";
  const email = (resHeader.email as string) || (bldPersonal.email as string) || "";
  const phone = (resHeader.phone as string) || (bldPersonal.phone as string) || "";
  const location = (resHeader.location as string) || (bldPersonal.location as string) || "";
  const linkedin = (resHeader.linkedin as string) || (bldPersonal.linkedin as string) || "";
  const github = (resHeader.github as string) || (bldPersonal.github as string) || "";
  const portfolio = (resHeader.portfolio as string) || (bldPersonal.portfolio as string) || "";

  // 2. Summary
  const summary = (typeof res.summary === "string" ? res.summary : typeof bld.summary === "string" ? bld.summary : "").trim();

  // 3. Experience
  const rawExperience = Array.isArray(res.experience) ? res.experience : Array.isArray(bld.experience) ? bld.experience : [];
  const experience = rawExperience.map((item: unknown) => {
    const exp = (item && typeof item === "object" ? item : {}) as Record<string, unknown>;
    const bullets: string[] = [];

    if (Array.isArray(exp.bullets)) {
      for (const b of exp.bullets) {
        if (typeof b === "string" && b.trim()) bullets.push(b.trim());
      }
    }
    if (Array.isArray(exp.responsibilities)) {
      for (const r of exp.responsibilities) {
        if (typeof r === "string" && r.trim() && !bullets.includes(r.trim())) bullets.push(r.trim());
      }
    }
    if (Array.isArray(exp.achievements)) {
      for (const a of exp.achievements) {
        if (typeof a === "string" && a.trim() && !bullets.includes(a.trim())) bullets.push(a.trim());
      }
    }

    return {
      company: (exp.company as string) || "",
      role: (exp.role as string) || "",
      location: (exp.location as string) || "",
      startDate: (exp.startDate as string) || "",
      endDate: (exp.endDate as string) || "",
      current: Boolean(exp.current),
      bullets,
    };
  });

  // 4. Education
  const rawEducation = Array.isArray(res.education) ? res.education : Array.isArray(bld.education) ? bld.education : [];
  const education = rawEducation.map((item: unknown) => {
    const edu = (item && typeof item === "object" ? item : {}) as Record<string, unknown>;
    const achievements: string[] = [];
    if (Array.isArray(edu.achievements)) {
      for (const a of edu.achievements) {
        if (typeof a === "string" && a.trim()) achievements.push(a.trim());
      }
    }

    return {
      institution: (edu.institution as string) || "",
      degree: (edu.degree as string) || "",
      field: (edu.field as string) || "",
      startDate: (edu.startDate as string) || "",
      endDate: (edu.endDate as string) || "",
      gpa: (edu.gpa as string) || undefined,
      achievements,
    };
  });

  // 5. Skills
  const rawSkills = Array.isArray(res.skills) ? res.skills : Array.isArray(bld.skills) ? bld.skills : [];
  const skillsGroups: Array<{ category?: string; skills?: string[] }> = [];

  for (const item of rawSkills) {
    if (!item) continue;
    if (typeof item === "string" && item.trim()) {
      skillsGroups.push({ category: "Skills", skills: [item.trim()] });
    } else if (typeof item === "object") {
      const obj = item as Record<string, unknown>;
      if (Array.isArray(obj.skills)) {
        // Group format: { category: string, skills: string[] }
        const list = (obj.skills as unknown[])
          .map((s) => (typeof s === "string" ? s.trim() : ""))
          .filter(Boolean);
        if (list.length > 0) {
          skillsGroups.push({
            category: (obj.category as string) || "Technical",
            skills: list,
          });
        }
      } else if (typeof obj.name === "string" && obj.name.trim()) {
        // Builder format: { id: string, name: string, category?: string }
        const cat = (obj.category as string) || "Skills";
        let existing = skillsGroups.find((g) => g.category === cat);
        if (!existing) {
          existing = { category: cat, skills: [] };
          skillsGroups.push(existing);
        }
        existing.skills!.push(obj.name.trim());
      }
    }
  }

  // 6. Projects
  const rawProjects = Array.isArray(res.projects) ? res.projects : Array.isArray(bld.projects) ? bld.projects : [];
  const projects = rawProjects.map((item: unknown) => {
    const proj = (item && typeof item === "object" ? item : {}) as Record<string, unknown>;
    const tech: string[] = [];
    const bullets: string[] = [];

    if (Array.isArray(proj.tech)) {
      for (const t of proj.tech) if (typeof t === "string" && t.trim()) tech.push(t.trim());
    }
    if (Array.isArray(proj.techStack)) {
      for (const t of proj.techStack) if (typeof t === "string" && t.trim() && !tech.includes(t.trim())) tech.push(t.trim());
    }

    if (Array.isArray(proj.bullets)) {
      for (const b of proj.bullets) if (typeof b === "string" && b.trim()) bullets.push(b.trim());
    }
    if (Array.isArray(proj.keyFeatures)) {
      for (const k of proj.keyFeatures) if (typeof k === "string" && k.trim() && !bullets.includes(k.trim())) bullets.push(k.trim());
    }
    if (typeof proj.challenges === "string" && proj.challenges.trim() && !bullets.includes(proj.challenges.trim())) {
      bullets.push(proj.challenges.trim());
    }
    if (typeof proj.achievements === "string" && proj.achievements.trim() && !bullets.includes(proj.achievements.trim())) {
      bullets.push(proj.achievements.trim());
    }

    return {
      name: (proj.name as string) || "",
      description: (proj.description as string) || "",
      tech,
      github: (proj.github as string) || undefined,
      demo: (proj.demo as string) || (proj.liveDemo as string) || undefined,
      bullets,
    };
  });

  // 7. Achievements
  const rawAchievements = Array.isArray(res.achievements) ? res.achievements : Array.isArray(bld.achievements) ? bld.achievements : [];
  const achievements = rawAchievements.map((item: unknown) => {
    const ach = (item && typeof item === "object" ? item : {}) as Record<string, unknown>;
    return {
      title: (ach.title as string) || "",
      description: (ach.description as string) || "",
      date: (ach.date as string) || undefined,
    };
  });

  // 8. Certificates
  const rawCertificates = Array.isArray(res.certificates) ? res.certificates : Array.isArray(bld.certificates) ? bld.certificates : [];
  const certificates = rawCertificates.map((item: unknown) => {
    const cert = (item && typeof item === "object" ? item : {}) as Record<string, unknown>;
    return {
      name: (cert.name as string) || "",
      issuer: (cert.issuer as string) || "",
      date: (cert.date as string) || undefined,
      url: (cert.url as string) || undefined,
    };
  });

  // 9. Leadership
  const rawLeadership = Array.isArray(res.leadership) ? res.leadership : Array.isArray(bld.leadership) ? bld.leadership : [];
  const leadership = rawLeadership.map((item: unknown) => {
    const lead = (item && typeof item === "object" ? item : {}) as Record<string, unknown>;
    const bullets: string[] = [];
    if (Array.isArray(lead.bullets)) {
      for (const b of lead.bullets) if (typeof b === "string" && b.trim()) bullets.push(b.trim());
    }
    if (typeof lead.description === "string" && lead.description.trim()) {
      bullets.push(lead.description.trim());
    }

    const duration = (lead.duration as string) || [lead.startDate, lead.endDate].filter(Boolean).join(" – ");
    return {
      role: (lead.role as string) || "",
      organization: (lead.organization as string) || (lead.org as string) || "",
      duration,
      bullets,
    };
  });

  // 10. Languages
  const rawLanguages = Array.isArray(res.languages) ? res.languages : Array.isArray(bld.languages) ? bld.languages : [];
  const languages = rawLanguages.map((item: unknown) => {
    const lang = (item && typeof item === "object" ? item : {}) as Record<string, unknown>;
    return {
      language: (lang.language as string) || (lang.name as string) || "",
      proficiency: (lang.proficiency as string) || (lang.level as string) || undefined,
    };
  });

  // 11. Interests
  const rawInterests = Array.isArray(res.interests) ? res.interests : Array.isArray(bld.interests) ? bld.interests : [];
  const interests = rawInterests.filter((i): i is string => typeof i === "string" && Boolean(i.trim()));

  return {
    header: { name, title, email, phone, location, linkedin, github, portfolio },
    summary,
    experience,
    education,
    skills: skillsGroups,
    projects,
    achievements,
    certificates,
    leadership,
    languages,
    interests,
  };
}
