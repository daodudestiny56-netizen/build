# AGENTS.md — Repository Rules & Instructions for AI Agents

This document defines the strict rules, architectural conventions, and workflow requirements for AI coding assistants working in this repository.

---

## 1. AUTOMATIC GIT COMMIT & PUSH WORKFLOW

> [!IMPORTANT]
> **MANDATORY AUTOMATIC PUSH RULE:**
> Whenever you complete an edit, fix a bug, or add a feature, you MUST immediately commit and push your changes to the remote repository.

### Commands to Run:
```bash
git add .
git commit -m "<descriptive feature/fix summary>"
git remote set-url origin https://github.com/daodudestiny56-netizen/build.git
git push -u origin main
```

---

## 2. ARCHITECTURE & TECH STACK

- **Framework:** Next.js (App Router, TypeScript, React)
- **Styling:** Tailwind CSS v4 + 3D Neobrutalist Design Tokens (`app/globals.css`)
- **Database:** SQLite (`data/triage.db`) via `better-sqlite3` (`lib/db.ts`)
- **AI Triage Engine:** Anthropic Claude / OpenAI / Gemini API integration with 1 auto-retry + heuristic fallback (`lib/ai.ts`)
- **Routing & SLA Engine:** Deterministic category routing & background SLA daemon (`lib/workflow.ts` & `/api/escalate-check`)

---

## 3. DESIGN SYSTEM GUIDELINES (3D NEOBRUTALISM)

1. **Color Tokens:**
   - Base Ink: `#0D0E12`
   - Panel Surface: `#16181E`
   - Paper Text/Border: `#F4F0EA`
   - Signal Red (Alarm/Breach): `#FF3B00`
   - Wire Teal (Resolved/Confirmed): `#00E676`
   - Cyber Yellow (Alert): `#FFD600`
   - Cyber Cyan (In Progress): `#00E5FF`

2. **3D Tactile Buttons & Cards:**
   - 3D buttons use 3px solid borders, hard 3D extruded black shadows (`box-shadow: 4px 4px 0px #000000`), uppercase blocky display font (`Space Grotesk`), and tactile press compression (`btn-3d`, `btn-3d-signal`, `btn-3d-dark`).
   - Cards use 3px solid borders and hard offset 3D shadows (`card-3d`, `card-3d-signal`).

3. **Signature Rubber Stamps (`components/StampBadge.tsx`):**
   - All status indicators (`NEW`, `IN PROGRESS`, `ESCALATED`, `RESOLVED`) must render as physically rotated rubber-stamp labels (`stamp-3d`).

4. **Zero Emojis:**
   - Do NOT include any emojis across component code, fallback messages, or templates.

5. **Mobile Responsiveness:**
   - Ensure all components adapt gracefully to mobile viewports (`<sm:` breakpoints, mobile navigation drawer in `components/Navbar.tsx`, full-width hit targets).

---

## 4. MULTI-PAGE ROUTING CONVENTIONS

Maintain the following multi-page App Router structure:
- `/` — Dedicated Landing Page / Overview (First Point of Contact)
- `/dispatch` — Main Dispatch Dashboard Feed
- `/intake` — Dedicated Ticket Intake Simulation Page
- `/cases` — Dedicated Case Directory Queue
- `/cases/[id]` — Dedicated Single Case Workbench Page
- `/customers` — Embedded CRM Customer Directory
- `/deliverables` — Hackathon Submission Deliverables Package
