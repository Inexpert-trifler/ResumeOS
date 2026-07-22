import { ResumeData, StudioSettings } from "../types/resume";

/**
 * Builds a self-contained A4 HTML string from ResumeData.
 * Used by the export-pdf route to generate a printable document.
 * Matches the Classic template layout from the frontend.
 */
export function buildResumeHtml(resume: ResumeData, settings: StudioSettings): string {
  const acc = settings.accentColor || "#6366f1";
  const font = settings.fontFamily || "Inter";
  const sz = settings.fontSize || 10;
  const lh = settings.lineHeight || 1.4;
  const mg = settings.margins || 32;

  const esc = (s: string) =>
    s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  const contactItems = [
    resume.header.email,
    resume.header.phone,
    resume.header.location,
    resume.header.linkedin,
    resume.header.github,
    resume.header.portfolio,
  ]
    .filter(Boolean)
    .map((v) => `<span>${esc(v as string)}</span>`)
    .join('<span style="margin:0 6px;color:#ccc">|</span>');

  const experienceHtml = resume.experience
    .map(
      (exp) => `
      <div style="margin-bottom:14px">
        <div style="display:flex;justify-content:space-between;align-items:flex-start">
          <div>
            <div style="font-weight:700;font-size:${sz}pt">${esc(exp.role)}</div>
            <div style="color:#555;font-size:${sz - 1}pt">${esc(exp.company)}${exp.location ? " · " + esc(exp.location) : ""}</div>
          </div>
          <div style="text-align:right;color:#777;font-size:${sz - 1}pt;white-space:nowrap">
            ${esc(exp.startDate)} – ${esc(exp.endDate)}
          </div>
        </div>
        <ul style="margin:6px 0 0 0;padding-left:16px">
          ${exp.bullets
            .filter(Boolean)
            .map((b) => `<li style="margin-bottom:3px;font-size:${sz - 0.5}pt;color:#333">${esc(b)}</li>`)
            .join("")}
        </ul>
      </div>`
    )
    .join("");

  const educationHtml = resume.education
    .map(
      (edu) => `
      <div style="display:flex;justify-content:space-between;margin-bottom:8px">
        <div>
          <div style="font-weight:700;font-size:${sz}pt">${esc(edu.degree)} in ${esc(edu.field)}</div>
          <div style="color:#555;font-size:${sz - 1}pt">${esc(edu.institution)}${edu.gpa ? " · GPA: " + esc(edu.gpa) : ""}</div>
        </div>
        <div style="color:#777;font-size:${sz - 1}pt;white-space:nowrap">${esc(edu.startDate)} – ${esc(edu.endDate)}</div>
      </div>`
    )
    .join("");

  const skillsHtml = resume.skills
    .map(
      (g) => `
      <div style="display:flex;gap:8px;margin-bottom:5px;font-size:${sz - 0.5}pt">
        <span style="font-weight:600;color:#333;min-width:100px">${esc(g.category)}:</span>
        <span style="color:#555">${g.skills.map(esc).join(" · ")}</span>
      </div>`
    )
    .join("");

  const projectsHtml = resume.projects
    .map(
      (p) => `
      <div style="margin-bottom:10px">
        <div style="display:flex;gap:8px;align-items:baseline">
          <span style="font-weight:700;font-size:${sz}pt">${esc(p.name)}</span>
          <span style="color:#777;font-size:${sz - 1}pt">${p.tech.map(esc).join(", ")}</span>
        </div>
        <ul style="margin:4px 0 0 0;padding-left:16px">
          ${p.bullets
            .filter(Boolean)
            .slice(0, 3)
            .map((b) => `<li style="font-size:${sz - 0.5}pt;color:#333;margin-bottom:2px">${esc(b)}</li>`)
            .join("")}
        </ul>
      </div>`
    )
    .join("");

  const achievementsHtml = resume.achievements
    .map(
      (a) => `
      <div style="display:flex;gap:8px;margin-bottom:6px;font-size:${sz - 0.5}pt">
        <span style="color:${acc};margin-top:4px">●</span>
        <div>
          <span style="font-weight:600">${esc(a.title)}</span>
          ${a.date ? `<span style="color:#888;margin-left:6px;font-size:${sz - 1}pt">(${esc(a.date)})</span>` : ""}
          ${a.description ? `<div style="color:#555">${esc(a.description)}</div>` : ""}
        </div>
      </div>`
    )
    .join("");

  const certificatesHtml = resume.certificates
    .map(
      (c) => `
      <div style="display:flex;gap:8px;margin-bottom:6px;font-size:${sz - 0.5}pt">
        <span style="color:${acc};margin-top:4px">●</span>
        <div>
          <span style="font-weight:600">${esc(c.name)}</span>
          <span style="color:#555"> — ${esc(c.issuer)}</span>
          ${c.date ? `<span style="color:#888;margin-left:4px">(${esc(c.date)})</span>` : ""}
        </div>
      </div>`
    )
    .join("");

  const languagesHtml =
    resume.languages.length > 0
      ? resume.languages
          .map((l) => `<span style="margin-right:16px"><strong>${esc(l.name)}</strong> <span style="color:#777">(${esc(l.level)})</span></span>`)
          .join("")
      : "";

  const sectionTitle = (title: string) =>
    `<h2 style="font-size:${sz}pt;font-weight:700;text-transform:uppercase;letter-spacing:0.12em;color:${acc};border-bottom:1px solid ${acc};padding-bottom:3px;margin:0 0 10px 0">${title}</h2>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>${esc(resume.header.name || "Resume")}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Georgia&display=swap');
    @page { size: A4; margin: 0; }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: '${font}', 'Inter', Arial, sans-serif;
      font-size: ${sz}pt;
      line-height: ${lh};
      color: #1a1a1a;
      background: #fff;
      padding: ${mg}px;
      width: 210mm;
      min-height: 297mm;
    }
    @media print {
      body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    }
    ul { padding-left: 16px; }
    li { margin-bottom: 2px; }
    section { margin-bottom: ${mg - 8}px; }
  </style>
</head>
<body>

  <!-- Header -->
  <div style="text-align:center;border-bottom:2px solid ${acc};padding-bottom:14px;margin-bottom:18px">
    <div style="font-size:${sz + 14}pt;font-weight:900;letter-spacing:-0.02em">${esc(resume.header.name)}</div>
    ${resume.header.title ? `<div style="font-size:${sz + 1}pt;color:#444;margin-top:3px">${esc(resume.header.title)}</div>` : ""}
    <div style="margin-top:8px;font-size:${sz - 1}pt;color:#555">${contactItems}</div>
  </div>

  ${resume.summary ? `
  <section>
    ${sectionTitle("Professional Summary")}
    <p style="color:#444;font-size:${sz - 0.5}pt">${esc(resume.summary)}</p>
  </section>` : ""}

  ${resume.experience.length > 0 ? `
  <section>
    ${sectionTitle("Experience")}
    ${experienceHtml}
  </section>` : ""}

  ${resume.education.length > 0 ? `
  <section>
    ${sectionTitle("Education")}
    ${educationHtml}
  </section>` : ""}

  ${resume.skills.length > 0 ? `
  <section>
    ${sectionTitle("Skills")}
    ${skillsHtml}
  </section>` : ""}

  ${resume.projects.length > 0 ? `
  <section>
    ${sectionTitle("Projects")}
    ${projectsHtml}
  </section>` : ""}

  ${resume.achievements.length > 0 ? `
  <section>
    ${sectionTitle("Achievements")}
    ${achievementsHtml}
  </section>` : ""}

  ${resume.certificates.length > 0 ? `
  <section>
    ${sectionTitle("Certifications")}
    ${certificatesHtml}
  </section>` : ""}

  ${languagesHtml ? `
  <section>
    ${sectionTitle("Languages")}
    <div style="font-size:${sz - 0.5}pt">${languagesHtml}</div>
  </section>` : ""}

  ${resume.interests.length > 0 ? `
  <section>
    ${sectionTitle("Interests")}
    <p style="font-size:${sz - 0.5}pt;color:#555">${resume.interests.map(esc).join(" · ")}</p>
  </section>` : ""}

</body>
</html>`;
}
