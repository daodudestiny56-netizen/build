# TRIAGE 3D // AI-Powered Support Dispatch & SLA Escalation Engine

> A high-velocity, 3D Neobrutalist support management platform built to ensure no urgent customer voice is ever lost in the inbox noise.

---

## The Human Story Behind TRIAGE 3D

On a rainy Tuesday evening at 11:42 PM, Sarah sat staring at her laptop screen. As the sole support lead for a growing software platform, her inbox had just breached 400 unresolved tickets. Her eyes burned from hours of manual sorting, sifting through routine password resets, basic how-to questions, and general feedback.

Deep within that wall of text, buried on line 342, was an unread ticket from Alex, an operations coordinator at a regional medical facility. His API access had been locked due to an automated billing flag, bringing critical equipment tracking to a complete standstill. Alex was frantic, but his message looked identical to every other unread row in the queue.

By the time Sarah manually reached ticket #342 the following morning, 14 hours had elapsed. The Service Level Agreement (SLA) was broken, trust was severely damaged, and Alex's team had suffered a critical outage that could have been prevented in minutes.

Sarah was heartbroken. It wasn't a lack of empathy or hard work—it was a failure of structure. Human support teams cannot process hundreds of unstructured requests simultaneously without missing what truly matters.

**TRIAGE 3D was born from this exact realization: No critical customer issue should ever sit in the dark.**

---

## The Solution: TRIAGE 3D

TRIAGE 3D transforms chaotic customer support queues into an automated, real-time dispatch command center. Powered by artificial intelligence and an autonomous background SLA daemon, TRIAGE 3D inspects incoming support requests the instant they arrive, assesses urgency, assigns categories, routes cases, and guards response SLA timelines around the clock.

If an urgent customer request is at risk of breaching SLA targets, the system takes action immediately—escalating the ticket, surfacing hard visual alarm banners, and alerting on-call responders before a single SLA commitment is broken.

---

## Core System Architecture & Features

### 1. Instant AI Triage & Sentiment Classification
- **Intelligent Analysis:** Reads unstructured request text and extracts intent, customer sentiment, urgency level (Low, Medium, High, Critical), and primary issue category (Technical, Billing, Account Access, Feature Request).
- **Auto-Retry & Heuristic Fallback:** Resilient multi-model API integration equipped with automatic retries and fallback rules to guarantee zero downtime during provider outages.

### 2. Autonomous SLA Escalation Daemon
- **Continuous Monitoring:** Background daemon ticks down response timers against predefined SLA thresholds (e.g., 60-second rapid demo cycle or custom enterprise windows).
- **Automated Escalations:** Automatically transitions overdue tickets to `ESCALATED` status, triggering high-visibility signal-red alert banners across the dispatch dashboard.

### 3. Integrated CRM & Customer Context
- **Tier Intelligence:** Automatically cross-references incoming requests with embedded customer CRM records to identify Enterprise, Mid-Market, or Standard SLA contracts.
- **Contextual Workbenches:** Single-case inspection pages (`/cases/[id]`) display full customer tier metrics, lifetime value, contact history, and AI diagnostic rationales side-by-side.

### 4. 3D Neobrutalist UI Design System
- **Tactile Visual Hierarchy:** Built with 3px solid borders, hard offset black extruded shadows (`box-shadow: 4px 4px 0px #000000`), uppercase blocky display typography (`Space Grotesk`), and high-contrast color tokens.
- **Physical Rubber Stamp Badges:** Dynamic status badges (`NEW`, `IN PROGRESS`, `ESCALATED`, `RESOLVED`) rendered as physically rotated rubber-stamp elements.

---

## Application Route Structure

| Route | Description |
| :--- | :--- |
| `/` | **Landing Page / Overview** — First point of contact introducing system architecture, workflow steps, and core features. |
| `/dispatch` | **Dispatch Command Center** — Live operational feed showing ticket queues, filter controls, SLA daemon status, and rapid intake form. |
| `/intake` | **Ticket Intake Simulator** — Dedicated portal for simulating incoming raw customer requests and testing AI categorization. |
| `/cases` | **Cases Queue Directory** — Full searchable case management directory filtered by urgency, status, and category. |
| `/cases/[id]` | **Single Case Workbench** — Deep inspection view with AI diagnostic breakdown, customer CRM details, and status updates. |
| `/customers` | **CRM Customer Directory** — Directory of managed customer accounts, assigned SLA tiers, and support contact histories. |
| `/deliverables` | **Submission Package** — Hackathon submission deliverables modal and architectural overview. |

---

## Tech Stack

- **Framework:** Next.js (App Router, TypeScript, React)
- **Styling:** Tailwind CSS v4 + 3D Neobrutalist Design Tokens (`app/globals.css`)
- **Database:** SQLite (`data/triage.db`) via `better-sqlite3` (`lib/db.ts`)
- **AI Engine:** Anthropic Claude / OpenAI / Gemini API integration with 1 auto-retry + heuristic fallback (`lib/ai.ts`)
- **SLA Daemon:** Deterministic category routing & background SLA checker (`lib/workflow.ts` & `/api/escalate-check`)

---

## Getting Started Locally

### Prerequisites

- Node.js 18.x or higher
- npm / pnpm / yarn

### Installation & Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/daodudestiny56-netizen/build.git
   cd build
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables (Optional for custom AI providers):
   Create a `.env.local` file in the root directory:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ANTHROPIC_API_KEY=your_anthropic_api_key_here
   OPENAI_API_KEY=your_openai_api_key_here
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:3000` to launch the Landing Page overview, or `http://localhost:3000/dispatch` to access the live command center.

---

## License

MIT License. Built for support teams who believe every customer ticket deserves immediate, intelligent attention.
