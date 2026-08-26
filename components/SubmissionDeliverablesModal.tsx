'use client';

import React from 'react';
import {
  X,
  FileCheck,
  ShieldCheck,
  TrendingUp,
  Cpu,
  Workflow,
  AlertCircle,
  Video,
  Lock,
} from 'lucide-react';

interface SubmissionDeliverablesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SubmissionDeliverablesModal({
  isOpen,
  onClose,
}: SubmissionDeliverablesModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#0F1115]/90 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="card-dispatch bg-[#17191F] border-2 border-[#EDEAE2] w-full max-w-5xl max-h-[92vh] flex flex-col shadow-[8px_8px_0px_#000000] overflow-hidden text-[#EDEAE2]">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-[#0F1115] border-b-2 border-[#EDEAE2] flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-[#FF4405] text-white border border-[#EDEAE2] rounded-[2px]">
              <FileCheck className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="font-display text-base font-bold text-[#EDEAE2] uppercase">
                HACKATHON SUBMISSION PACKAGE & DELIVERABLES
              </h2>
              <p className="font-mono text-[10px] text-slate-400">
                AI BuildFest 2026 · Track 5 · Case Study 1 (AI Workflow Automation)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 bg-[#17191F] border-2 border-[#EDEAE2] text-[#EDEAE2] hover:bg-[#EDEAE2] hover:text-[#0F1115] transition"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1 font-mono text-xs leading-relaxed">
          {/* Section 1: Problem Statement */}
          <div className="bg-[#0F1115] border-2 border-[#2B2E37] p-4 space-y-2">
            <h3 className="font-display text-sm font-bold text-[#FF4405] uppercase flex items-center gap-2">
              <AlertCircle className="w-4 h-4 stroke-[2.5]" /> 1. PROBLEM STATEMENT & SCENARIO FRAMING
            </h3>
            <p className="text-slate-300">
              FlowCore Services currently handles incoming customer complaints and inquiries manually across unorganized emails and spreadsheets. Customer requests sit untracked, routing depends on manual triage, approvals stall, and management lacks real-time visibility into SLAs.
            </p>
            <p className="text-slate-300">
              <strong>Triage</strong> automates the entire lifecycle: ingesting free-text requests, performing structured AI classification and response drafting, executing deterministic team routing, maintaining full audit logging, and running automated SLA escalation monitoring.
            </p>
          </div>

          {/* Section 2: Visual Workflow Diagram */}
          <div className="bg-[#0F1115] border-2 border-[#2B2E37] p-4 space-y-3">
            <h3 className="font-display text-sm font-bold text-[#3DDC97] uppercase flex items-center gap-2">
              <Workflow className="w-4 h-4 stroke-[2.5]" /> 2. VISUAL WORKFLOW REPRESENTATION
            </h3>
            <div className="bg-[#17191F] border border-[#2B2E37] p-3 text-[11px] font-mono text-[#EDEAE2]">
              <div className="flex flex-wrap items-center justify-between gap-2 text-center">
                <span className="p-2 bg-[#0F1115] border border-[#EDEAE2]">1. INTAKE FORM</span>
                <span>--&gt;</span>
                <span className="p-2 bg-[#0F1115] border border-[#EDEAE2]">2. AI CLASSIFY &amp; DRAFT</span>
                <span>--&gt;</span>
                <span className="p-2 bg-[#0F1115] border border-[#EDEAE2]">3. CRM DEDUP</span>
                <span>--&gt;</span>
                <span className="p-2 bg-[#0F1115] border border-[#EDEAE2]">4. ROUTE</span>
                <span>--&gt;</span>
                <span className="p-2 bg-[#0F1115] border border-[#FF4405] text-[#FF4405]">5. SLA ESCALATION</span>
                <span>--&gt;</span>
                <span className="p-2 bg-[#0F1115] border border-[#3DDC97] text-[#3DDC97]">6. RESOLVE</span>
              </div>
            </div>
          </div>

          {/* Section 3: Connected Tools & System Architecture */}
          <div className="bg-[#0F1115] border-2 border-[#2B2E37] p-4 space-y-2">
            <h3 className="font-display text-sm font-bold text-[#EDEAE2] uppercase flex items-center gap-2">
              <Cpu className="w-4 h-4 stroke-[2.5]" /> 3. CONNECTED TOOLS &amp; ARCHITECTURE
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-300">
              <div className="p-3 bg-[#17191F] border border-[#2B2E37]">
                <strong className="text-[#EDEAE2] block mb-1 uppercase">FRONTEND &amp; DASHBOARD:</strong>
                Next.js App Router (React, TypeScript, Tailwind CSS, Lucide React) providing responsive real-time client polling and interactive case workbench.
              </div>
              <div className="p-3 bg-[#17191F] border border-[#2B2E37]">
                <strong className="text-[#EDEAE2] block mb-1 uppercase">AI TRIAGE ENGINE:</strong>
                Anthropic Claude-3.5-Sonnet / OpenAI / Gemini API with structured JSON output prompting, auto-retry, and offline heuristic fallback.
              </div>
              <div className="p-3 bg-[#17191F] border border-[#2B2E37]">
                <strong className="text-[#EDEAE2] block mb-1 uppercase">EMBEDDED CRM DATABASE:</strong>
                SQLite database (`lib/db.ts`) storing `customers` (deduplicated by email), `cases`, and full `audit_log` event records.
              </div>
              <div className="p-3 bg-[#17191F] border border-[#2B2E37]">
                <strong className="text-[#EDEAE2] block mb-1 uppercase">SLA ESCALATION DAEMON:</strong>
                Background route `/api/escalate-check` periodically polled by client daemon to auto-flip stale tickets to `escalated`.
              </div>
            </div>
          </div>

          {/* Section 4: Testing & Error Handling Evidence */}
          <div className="bg-[#0F1115] border-2 border-[#2B2E37] p-4 space-y-2">
            <h3 className="font-display text-sm font-bold text-[#3DDC97] uppercase flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 stroke-[2.5]" /> 4. EVIDENCE OF TESTING &amp; ERROR HANDLING
            </h3>
            <ul className="list-disc list-inside space-y-1.5 text-slate-300">
              <li>
                <strong>INPUT VALIDATION TEST:</strong> Empty or malformed submissions (e.g. invalid emails) are rejected gracefully with clean user feedback messages.
              </li>
              <li>
                <strong>AI API FAILURE TEST:</strong> Network errors or LLM failures trigger 1 auto-retry, followed by fallback heuristic classification and an explicit <code className="bg-[#17191F] px-1.5 py-0.5 border border-[#2B2E37] text-amber-400">audit_log</code> entry: <em>"AI classification fallback used - flagged for manual review"</em>.
              </li>
              <li>
                <strong>SLA THRESHOLD TEST:</strong> Unhandled cases past 60s (compressed for demo) flip status to `escalated` and broadcast live visual banner alerts.
              </li>
            </ul>
          </div>

          {/* Section 5: Privacy & Security Note */}
          <div className="bg-[#0F1115] border-2 border-[#2B2E37] p-4 space-y-2">
            <h3 className="font-display text-sm font-bold text-[#EDEAE2] uppercase flex items-center gap-2">
              <Lock className="w-4 h-4 stroke-[2.5]" /> 5. PRIVACY &amp; SECURITY NOTE
            </h3>
            <p className="text-slate-300">
              All API keys are securely stored server-side via environment variables (<code className="bg-[#17191F] px-1 font-mono">process.env</code>) and never exposed client-side. Customer records are stored locally in an embedded SQLite database. This software is presented as a functional prototype for hackathon evaluation.
            </p>
          </div>

          {/* Section 6: Demo Script Guide */}
          <div className="bg-[#0F1115] border-2 border-[#2B2E37] p-4 space-y-2">
            <h3 className="font-display text-sm font-bold text-[#EDEAE2] uppercase flex items-center gap-2">
              <Video className="w-4 h-4 stroke-[2.5]" /> 6. RECOMMENDED 3-MINUTE DEMO SCRIPT
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-300">
              <div className="p-2 bg-[#17191F] border border-[#2B2E37]"><strong>0:00-0:15:</strong> OPEN &amp; FRAMING PROBLEM.</div>
              <div className="p-2 bg-[#17191F] border border-[#2B2E37]"><strong>0:15-1:00:</strong> LIVE INTAKE PRESET SUBMISSION.</div>
              <div className="p-2 bg-[#17191F] border border-[#2B2E37]"><strong>1:00-1:30:</strong> CASE DETAIL &amp; DRAFT RESPONSE EDIT.</div>
              <div className="p-2 bg-[#17191F] border border-[#2B2E37]"><strong>1:30-2:00:</strong> ESCALATION WOW MOMENT (60S SLA FLIP).</div>
              <div className="p-2 bg-[#17191F] border border-[#2B2E37]"><strong>2:00-2:20:</strong> CUSTOMER DEDUP &amp; CASE HISTORY.</div>
              <div className="p-2 bg-[#17191F] border border-[#2B2E37]"><strong>2:20-3:00:</strong> ERROR HANDLING &amp; BUSINESS IMPACT RECAP.</div>
            </div>
          </div>

          {/* Section 7: Expected Business Impact */}
          <div className="bg-[#0F1115] border-2 border-[#2B2E37] p-4 space-y-2">
            <h3 className="font-display text-sm font-bold text-[#3DDC97] uppercase flex items-center gap-2">
              <TrendingUp className="w-4 h-4 stroke-[2.5]" /> 7. EXPECTED BUSINESS IMPACT
            </h3>
            <p className="text-slate-300">
              Reduces manual triage time by up to 90%, guarantees zero missed SLA escalations through automated background monitoring, and provides full workflow auditability for compliance.
            </p>
          </div>

          {/* Section 8: Production Roadmap & Demo Limitations Spec */}
          <div className="bg-[#0F1115] border-2 border-[#2B2E37] p-4 space-y-3">
            <h3 className="font-display text-sm font-bold text-[#00E5FF] uppercase flex items-center gap-2">
              <Workflow className="w-4 h-4 stroke-[2.5]" /> 8. PRODUCTION ROADMAP &amp; DEMO SPECIFICATIONS
            </h3>
            <div className="space-y-2 text-slate-300 text-[11px]">
              <div className="p-2.5 bg-[#17191F] border border-[#2B2E37]">
                <strong className="text-[#00E676] block mb-0.5 uppercase">BUILT: Outbound Slack Webhook Integration</strong>
                Automated webhook dispatch (<code className="bg-[#0F1115] px-1 font-mono text-[#FFD600]">SLACK_WEBHOOK_URL</code>) posts rich formatted breach alert cards to on-call engineer Slack channels whenever the SLA daemon escalates a ticket.
              </div>
              <div className="p-2.5 bg-[#17191F] border border-[#2B2E37]">
                <strong className="text-[#00E5FF] block mb-0.5 uppercase">SIMULATED: 60-Second Demo SLA Windows</strong>
                Production targets (24-hour enterprise response windows) are compressed to 60 seconds for live demo validation.
              </div>
              <div className="p-2.5 bg-[#17191F] border border-[#2B2E37]">
                <strong className="text-slate-400 block mb-0.5 uppercase">ROADMAP ITEM B: SSE / WebSockets Push Sync</strong>
                5-second polling used for demo stability; production deployment will transition to Server-Sent Events (SSE).
              </div>
              <div className="p-2.5 bg-[#17191F] border border-[#2B2E37]">
                <strong className="text-slate-400 block mb-0.5 uppercase">ROADMAP ITEM C: Multi-Tenant RBAC Authentication</strong>
                Single-team workspace model used for evaluation; production deployment adds NextAuth / Clerk role permissions.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
