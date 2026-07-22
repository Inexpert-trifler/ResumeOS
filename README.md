# ResumeOS — AI Resume Operating System

> Build a Resume That Opens Doors.

A production-grade, AI-powered career operating system. Not just a resume builder — a full end-to-end job search toolkit.

---

## Project Structure

```
ResumeOS/
├── frontend/          # Next.js 16 app (App Router)
└── backend/           # Express + TypeScript API
```

---

## Tech Stack

### Frontend
- **Framework**: Next.js 16 (App Router) + React 19 + TypeScript
- **Styling**: Tailwind CSS v4 + shadcn/ui
- **Animations**: Framer Motion v12 + Lenis smooth scroll
- **State**: Zustand v5 + React Context/useReducer
- **Charts**: Recharts

### Backend
- **Runtime**: Node.js + Express + TypeScript
- **Security**: Helmet + CORS + Morgan + Compression
- **Storage**: localStorage (Sprint 1) — no database required

---

## Getting Started

### Frontend
```bash
cd frontend
npm install
npm run dev
# → http://localhost:3000
```

### Backend
```bash
cd backend
npm install
npm run dev
# → http://localhost:4000
```

---

## Sprint 1 — Core Flow

```
Landing Page
    ↓
Resume Academy   (learn resume fundamentals)
    ↓
Resume Builder   (16-step wizard, auto-saves to localStorage)
    ↓
Resume Studio    (live editable preview, loads builder data)
    ↓
Export PDF       (print-ready via backend or browser fallback)
```

---

## API Endpoints (Sprint 1)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Liveness check |
| POST | `/api/export-pdf` | Generate print-ready HTML from resume JSON |

---

## Pages

| Route | Feature | Status |
|-------|---------|--------|
| `/` | Landing page | ✅ Live |
| `/dashboard` | User dashboard | ✅ Live |
| `/builder` | Resume wizard | ✅ Live |
| `/studio` | Visual editor | ✅ Live |
| `/academy` | Resume education | ✅ Live |
| `/templates` | Template gallery | ✅ Live |
| `/analyzer` | ATS analyzer | ✅ Live |
| `/tracker` | Job pipeline | ✅ Live |
| `/coach` | AI coaching chat | ✅ Live |
| `/review` | AI Resume Review | 🗓 v2 |
| `/interview-prep` | Interview prep | 🗓 v2 |
| `/cover-letter` | Cover letter gen | 🗓 v2 |
| `/linkedin` | LinkedIn optimizer | 🗓 v2 |
| `/github` | GitHub optimizer | 🗓 v2 |
| `/career-roadmap` | Career roadmap | 🗓 v2 |

---

## Sprint Roadmap

- **Sprint 1** ✅ — Core flow: Builder → Studio → PDF Export + localStorage
- **Sprint 2** — AI integration: ATS scoring, resume review, cover letter generation
- **Sprint 3** — Auth, cloud sync, database, collaboration

---

## License

MIT
