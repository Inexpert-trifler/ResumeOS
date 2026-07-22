"use client";

import { ResumeData, StudioSettings } from '@/types';
import { Mail, Phone, MapPin, Globe, Code2 as Github, Link2 as Linkedin } from "lucide-react";

// ── Editable text utility ─────────────────────────────────────────────────────
function Editable({
  value,
  onChange,
  className = "",
  multiline = false,
  placeholder = "Click to edit...",
}: {
  value: string;
  onChange: (v: string) => void;
  className?: string;
  multiline?: boolean;
  placeholder?: string;
}) {
  if (multiline) {
    return (
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={3}
        className={`bg-transparent outline-none resize-none w-full focus:ring-1 focus:ring-blue-400/50 rounded px-0.5 ${className}`}
      />
    );
  }
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`bg-transparent outline-none w-full focus:ring-1 focus:ring-blue-400/50 rounded px-0.5 ${className}`}
    />
  );
}

function EditableBullet({
  value,
  onChange,
  onDelete,
  accent,
}: {
  value: string;
  onChange: (v: string) => void;
  onDelete: () => void;
  accent: string;
}) {
  return (
    <div className="flex items-start gap-1.5 group/bullet">
      <span className="mt-[5px] w-1.5 h-1.5 rounded-full shrink-0" style={{ background: accent }} />
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={2}
        className="bg-transparent outline-none resize-none flex-1 text-[inherit] leading-[inherit] focus:ring-1 focus:ring-blue-400/40 rounded px-0.5"
      />
      <button
        onClick={onDelete}
        className="opacity-0 group-hover/bullet:opacity-100 text-red-400 text-xs leading-none mt-1 transition-opacity"
        title="Delete bullet"
      >×</button>
    </div>
  );
}

// ── Classic Template ──────────────────────────────────────────────────────────
export function ClassicTemplate({ resume, settings, dispatch }: {
  resume: ResumeData;
  settings: StudioSettings;
  dispatch: React.Dispatch<any>;
}) {
  const acc = settings.accentColor;
  const font = settings.fontFamily;
  const sz = settings.fontSize;
  const lh = settings.lineHeight;
  const mg = settings.margins;

  const updateHeader = (key: string) => (v: string) =>
    dispatch({ type: "UPDATE_HEADER", payload: { [key]: v } });

  const updateExpBullet = (expId: string, bi: number, v: string) =>
    dispatch({
      type: "UPDATE_EXPERIENCE",
      payload: resume.experience.map(e =>
        e.id === expId
          ? { ...e, bullets: e.bullets.map((b, i) => (i === bi ? v : b)) }
          : e
      ),
    });

  const deleteExpBullet = (expId: string, bi: number) =>
    dispatch({
      type: "UPDATE_EXPERIENCE",
      payload: resume.experience.map(e =>
        e.id === expId ? { ...e, bullets: e.bullets.filter((_, i) => i !== bi) } : e
      ),
    });

  return (
    <div
      style={{
        fontFamily: font,
        fontSize: `${sz}pt`,
        lineHeight: lh,
        padding: `${mg}px`,
        color: "#1a1a1a",
        background: "#fff",
      }}
      className="w-full"
    >
      {/* Header */}
      <div className="text-center border-b-2 pb-4 mb-5" style={{ borderColor: acc }}>
        <Editable
          value={resume.header.name}
          onChange={updateHeader("name")}
          className="text-3xl font-bold tracking-tight text-center block"
        />
        <Editable
          value={resume.header.title}
          onChange={updateHeader("title")}
          className="text-base mt-1 text-center block"
          placeholder="Your title"
        />
        <div className="flex flex-wrap items-center justify-center gap-3 mt-2 text-xs text-gray-600">
          {resume.header.email && (
            <span className="flex items-center gap-1"><Mail className="w-3 h-3" />
              <Editable value={resume.header.email} onChange={updateHeader("email")} className="inline" />
            </span>
          )}
          {resume.header.phone && (
            <span className="flex items-center gap-1"><Phone className="w-3 h-3" />
              <Editable value={resume.header.phone} onChange={updateHeader("phone")} className="inline" />
            </span>
          )}
          {resume.header.location && (
            <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />
              <Editable value={resume.header.location} onChange={updateHeader("location")} className="inline" />
            </span>
          )}
          {resume.header.linkedin && (
            <span className="flex items-center gap-1"><Linkedin className="w-3 h-3" />
              <Editable value={resume.header.linkedin} onChange={updateHeader("linkedin")} className="inline" />
            </span>
          )}
          {resume.header.github && (
            <span className="flex items-center gap-1"><Github className="w-3 h-3" />
              <Editable value={resume.header.github} onChange={updateHeader("github")} className="inline" />
            </span>
          )}
        </div>
      </div>

      {/* Summary */}
      {resume.summary && (
        <section className="mb-5">
          <h2 className="text-sm font-bold uppercase tracking-widest mb-2" style={{ color: acc }}>Summary</h2>
          <Editable
            value={resume.summary}
            onChange={(v) => dispatch({ type: "UPDATE_SUMMARY", payload: v })}
            multiline
            className="text-gray-700 text-sm"
          />
        </section>
      )}

      {/* Experience */}
      {resume.experience.length > 0 && (
        <section className="mb-5">
          <h2 className="text-sm font-bold uppercase tracking-widest mb-2" style={{ color: acc }}>Experience</h2>
          <div className="space-y-4">
            {resume.experience.map((exp, ei) => (
              <div key={exp.id}>
                <div className="flex justify-between items-start">
                  <div>
                    <Editable
                      value={exp.role}
                      onChange={(v) => dispatch({ type: "UPDATE_EXPERIENCE", payload: resume.experience.map(e => e.id === exp.id ? { ...e, role: v } : e) })}
                      className="font-bold text-sm"
                    />
                    <Editable
                      value={exp.company}
                      onChange={(v) => dispatch({ type: "UPDATE_EXPERIENCE", payload: resume.experience.map(e => e.id === exp.id ? { ...e, company: v } : e) })}
                      className="text-sm text-gray-600"
                    />
                  </div>
                  <div className="text-right text-xs text-gray-500 shrink-0">
                    <Editable
                      value={`${exp.startDate} – ${exp.endDate}`}
                      onChange={() => {}}
                      className="text-right"
                    />
                    <Editable value={exp.location} onChange={() => {}} className="text-right" />
                  </div>
                </div>
                <div className="mt-1.5 space-y-1">
                  {exp.bullets.map((b, bi) => (
                    <EditableBullet
                      key={bi}
                      value={b}
                      onChange={(v) => updateExpBullet(exp.id, bi, v)}
                      onDelete={() => deleteExpBullet(exp.id, bi)}
                      accent={acc}
                    />
                  ))}
                  <button
                    onClick={() => dispatch({
                      type: "UPDATE_EXPERIENCE",
                      payload: resume.experience.map(e => e.id === exp.id ? { ...e, bullets: [...e.bullets, ""] } : e)
                    })}
                    className="text-xs mt-1 opacity-40 hover:opacity-100 transition-opacity"
                    style={{ color: acc }}
                  >
                    + Add bullet
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {resume.education.length > 0 && (
        <section className="mb-5">
          <h2 className="text-sm font-bold uppercase tracking-widest mb-2" style={{ color: acc }}>Education</h2>
          {resume.education.map(edu => (
            <div key={edu.id} className="flex justify-between">
              <div>
                <p className="font-bold text-sm">{edu.degree} in {edu.field}</p>
                <p className="text-sm text-gray-600">{edu.institution}</p>
                {edu.gpa && <p className="text-xs text-gray-500">GPA: {edu.gpa}</p>}
              </div>
              <div className="text-right text-xs text-gray-500">
                <p>{edu.startDate} – {edu.endDate}</p>
              </div>
            </div>
          ))}
        </section>
      )}

      {/* Skills */}
      {resume.skills.length > 0 && (
        <section className="mb-5">
          <h2 className="text-sm font-bold uppercase tracking-widest mb-2" style={{ color: acc }}>Skills</h2>
          <div className="space-y-1.5">
            {resume.skills.map(group => (
              <div key={group.id} className="flex gap-2 text-sm">
                <span className="font-semibold text-gray-700 shrink-0 w-28">{group.category}:</span>
                <span className="text-gray-600">{group.skills.join(" · ")}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {resume.projects.length > 0 && (
        <section className="mb-5">
          <h2 className="text-sm font-bold uppercase tracking-widest mb-2" style={{ color: acc }}>Projects</h2>
          <div className="space-y-3">
            {resume.projects.map(proj => (
              <div key={proj.id}>
                <div className="flex items-baseline gap-2">
                  <p className="font-bold text-sm">{proj.name}</p>
                  <p className="text-xs text-gray-500">— {proj.tech.join(", ")}</p>
                </div>
                <div className="mt-1 space-y-1">
                  {proj.bullets.map((b, i) => (
                    <div key={i} className="flex items-start gap-1.5 text-sm text-gray-700">
                      <span className="mt-[5px] w-1.5 h-1.5 rounded-full shrink-0" style={{ background: acc }} />
                      {b}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Achievements */}
      {resume.achievements.length > 0 && (
        <section className="mb-5">
          <h2 className="text-sm font-bold uppercase tracking-widest mb-2" style={{ color: acc }}>Achievements</h2>
          <div className="space-y-2">
            {resume.achievements.map(a => (
              <div key={a.id} className="flex items-start gap-1.5 text-sm">
                <span className="mt-[5px] w-1.5 h-1.5 rounded-full shrink-0" style={{ background: acc }} />
                <div>
                  <span className="font-semibold">{a.title}</span>
                  {a.date && <span className="text-gray-500 ml-2 text-xs">({a.date})</span>}
                  {a.description && <p className="text-gray-600 text-xs">{a.description}</p>}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Languages */}
      {resume.languages.length > 0 && (
        <section>
          <h2 className="text-sm font-bold uppercase tracking-widest mb-2" style={{ color: acc }}>Languages</h2>
          <div className="flex flex-wrap gap-3 text-sm">
            {resume.languages.map(l => (
              <span key={l.id}><strong>{l.name}</strong> <span className="text-gray-500">({l.level})</span></span>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

// ── Modern Template ───────────────────────────────────────────────────────────
export function ModernTemplate({ resume, settings, dispatch }: {
  resume: ResumeData;
  settings: StudioSettings;
  dispatch: React.Dispatch<any>;
}) {
  const acc = settings.accentColor;
  const font = settings.fontFamily;
  const sz = settings.fontSize;

  return (
    <div style={{ fontFamily: font, fontSize: `${sz}pt`, color: "#1a1a1a", background: "#fff" }} className="w-full flex min-h-full">
      {/* Left Column (30%) */}
      <div className="w-[35%] shrink-0 text-white p-6 space-y-5" style={{ background: acc }}>
        {/* Name */}
        <div className="border-b border-white/20 pb-4">
          <p className="text-2xl font-black tracking-tight leading-tight">{resume.header.name}</p>
          <p className="text-sm mt-1 opacity-80">{resume.header.title}</p>
        </div>

        {/* Contact */}
        <div className="space-y-1.5 text-xs">
          {[
            { icon: Mail, val: resume.header.email },
            { icon: Phone, val: resume.header.phone },
            { icon: MapPin, val: resume.header.location },
            { icon: Linkedin, val: resume.header.linkedin },
            { icon: Github, val: resume.header.github },
          ].filter(x => x.val).map(({ icon: Icon, val }, i) => (
            <div key={i} className="flex items-center gap-2 opacity-90">
              <Icon className="w-3 h-3 shrink-0 opacity-70" />
              <span className="truncate">{val}</span>
            </div>
          ))}
        </div>

        {/* Skills */}
        {resume.skills.length > 0 && (
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest mb-2 opacity-70">Skills</h3>
            <div className="space-y-2">
              {resume.skills.map(g => (
                <div key={g.id}>
                  <p className="text-xs font-semibold opacity-80 mb-1">{g.category}</p>
                  <div className="flex flex-wrap gap-1">
                    {g.skills.map(s => (
                      <span key={s} className="text-xs px-2 py-0.5 rounded-full bg-white/20">{s}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Languages */}
        {resume.languages.length > 0 && (
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest mb-2 opacity-70">Languages</h3>
            <div className="space-y-1">
              {resume.languages.map(l => (
                <div key={l.id} className="flex justify-between text-xs">
                  <span>{l.name}</span>
                  <span className="opacity-70">{l.level}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right Column (65%) */}
      <div className="flex-1 p-6 space-y-5">
        {/* Summary */}
        {resume.summary && (
          <section>
            <h2 className="text-sm font-bold uppercase tracking-widest mb-2" style={{ color: acc }}>About Me</h2>
            <p className="text-xs text-gray-600 leading-relaxed">{resume.summary}</p>
          </section>
        )}

        {/* Experience */}
        {resume.experience.length > 0 && (
          <section>
            <h2 className="text-sm font-bold uppercase tracking-widest mb-3" style={{ color: acc }}>Experience</h2>
            <div className="space-y-4">
              {resume.experience.map(exp => (
                <div key={exp.id} className="relative pl-3 border-l-2" style={{ borderColor: acc }}>
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <p className="font-bold text-sm">{exp.role}</p>
                      <p className="text-xs text-gray-500">{exp.company} · {exp.location}</p>
                    </div>
                    <span className="text-xs text-gray-400 shrink-0 ml-2">{exp.startDate} – {exp.endDate}</span>
                  </div>
                  <ul className="space-y-1 text-xs text-gray-700">
                    {exp.bullets.map((b, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="mt-[3px] w-1 h-1 rounded-full shrink-0" style={{ background: acc }} />
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {resume.education.length > 0 && (
          <section>
            <h2 className="text-sm font-bold uppercase tracking-widest mb-2" style={{ color: acc }}>Education</h2>
            {resume.education.map(edu => (
              <div key={edu.id} className="flex justify-between">
                <div>
                  <p className="font-bold text-sm">{edu.degree} — {edu.field}</p>
                  <p className="text-xs text-gray-500">{edu.institution}</p>
                </div>
                <span className="text-xs text-gray-400">{edu.startDate} – {edu.endDate}</span>
              </div>
            ))}
          </section>
        )}

        {/* Projects */}
        {resume.projects.length > 0 && (
          <section>
            <h2 className="text-sm font-bold uppercase tracking-widest mb-2" style={{ color: acc }}>Projects</h2>
            <div className="space-y-2">
              {resume.projects.map(p => (
                <div key={p.id} className="p-2 rounded-lg bg-gray-50">
                  <p className="font-bold text-xs">{p.name}
                    <span className="font-normal text-gray-500 ml-2">{p.tech.slice(0, 3).join(" · ")}</span>
                  </p>
                  <p className="text-xs text-gray-600 mt-0.5">{p.bullets[0]}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

// ── Minimal Template ──────────────────────────────────────────────────────────
export function MinimalTemplate({ resume, settings, dispatch }: {
  resume: ResumeData;
  settings: StudioSettings;
  dispatch: React.Dispatch<any>;
}) {
  const acc = settings.accentColor;
  const font = settings.fontFamily;
  const sz = settings.fontSize;
  const mg = settings.margins;

  return (
    <div style={{ fontFamily: font, fontSize: `${sz}pt`, padding: `${mg}px`, color: "#222", background: "#fff" }} className="w-full">
      {/* Header */}
      <div className="mb-6">
        <p className="text-4xl font-light tracking-tight">{resume.header.name}</p>
        <p className="text-base text-gray-500 mt-0.5">{resume.header.title}</p>
        <div className="flex flex-wrap gap-4 mt-2 text-xs text-gray-400">
          <span>{resume.header.email}</span>
          <span>{resume.header.phone}</span>
          <span>{resume.header.location}</span>
        </div>
      </div>

      {/* Thin rule */}
      <div className="h-px bg-gray-200 mb-5" />

      {/* Summary */}
      {resume.summary && (
        <p className="text-sm text-gray-600 mb-5 max-w-2xl">{resume.summary}</p>
      )}

      {/* Experience */}
      {resume.experience.length > 0 && (
        <section className="mb-5">
          <p className="text-xs uppercase tracking-[0.2em] text-gray-400 mb-3">Experience</p>
          <div className="space-y-5">
            {resume.experience.map(exp => (
              <div key={exp.id}>
                <div className="flex justify-between">
                  <div>
                    <p className="font-semibold text-sm">{exp.role}</p>
                    <p className="text-xs text-gray-500">{exp.company}</p>
                  </div>
                  <p className="text-xs text-gray-400">{exp.startDate} – {exp.endDate}</p>
                </div>
                <ul className="mt-2 space-y-1">
                  {exp.bullets.map((b, i) => (
                    <li key={i} className="text-xs text-gray-600 pl-3 relative before:content-['—'] before:absolute before:left-0 before:text-gray-300">
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="h-px bg-gray-100 mb-5" />

      {/* Skills */}
      {resume.skills.length > 0 && (
        <section className="mb-5">
          <p className="text-xs uppercase tracking-[0.2em] text-gray-400 mb-3">Skills</p>
          {resume.skills.map(g => (
            <p key={g.id} className="text-xs text-gray-600 mb-1">
              <span className="text-gray-800 font-medium">{g.category}: </span>
              {g.skills.join(", ")}
            </p>
          ))}
        </section>
      )}

      {/* Education */}
      {resume.education.length > 0 && (
        <section>
          <p className="text-xs uppercase tracking-[0.2em] text-gray-400 mb-3">Education</p>
          {resume.education.map(edu => (
            <div key={edu.id} className="flex justify-between text-sm">
              <div>
                <p className="font-medium">{edu.degree}, {edu.field}</p>
                <p className="text-xs text-gray-500">{edu.institution}</p>
              </div>
              <p className="text-xs text-gray-400">{edu.startDate} – {edu.endDate}</p>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
