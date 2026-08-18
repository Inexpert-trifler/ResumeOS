import assert from "node:assert/strict";
import { JobAnalysisService, type ResumeData } from "../src/services/job-analysis.service";

const service = new JobAnalysisService();
const resume: ResumeData = {
  header: { title: "Frontend Engineer", email: "dev@example.com" },
  summary: "Frontend engineer building React and JavaScript applications.",
  skills: [{ category: "Technical", skills: ["React.js", "JavaScript", "Git"] }],
  projects: [{ name: "Dashboard", tech: ["React", "JavaScript"], bullets: ["Built a React dashboard using JavaScript and Git."] }],
  experience: [], education: [], achievements: [], certificates: [], leadership: [], languages: [],
};

const frontendJob = "Frontend Engineer. Required: React, JavaScript, Git. Build accessible user interfaces and collaborate with product teams.";
const dataScienceJob = "Data Scientist. Required: Python, SQL, TensorFlow, machine learning, statistics, and experimentation.";

const first = service.compareResumeToJob(resume, frontendJob, { jobTitle: "Frontend Engineer" });
const second = service.compareResumeToJob(resume, frontendJob, { jobTitle: "Frontend Engineer" });
assert.deepEqual(first, second, "the same resume and JD must produce the same report");
assert.deepEqual(first.matchedSkills.map((skill) => skill.toLowerCase()).sort(), ["git", "javascript", "react"], "React, JavaScript, and Git must match");
assert.equal(first.missingSkills.length, 0, "matched technologies must not be reported missing");

const dataScience = service.compareResumeToJob(resume, dataScienceJob, { jobTitle: "Data Scientist" });
assert.ok(dataScience.atsScore < first.atsScore, "an unrelated JD must produce a lower job match");
assert.ok(dataScience.missingSkills.some((skill) => skill.toLowerCase() === "python"), "absent technologies must be missing");

console.log(JSON.stringify({ frontendScore: first.atsScore, dataScienceScore: dataScience.atsScore, matchedSkills: first.matchedSkills, missingSkills: dataScience.missingSkills }));
