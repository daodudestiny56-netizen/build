'use client';

import React from 'react';
import { AlertTriangle, ShieldAlert, ArrowRight, X } from 'lucide-react';

interface EscalationBannerProps {
  escalatedCases: any[];
  onSelectCase: (caseId: string) => void;
  onDismiss: () => void;
}

export default function EscalationBanner({
  escalatedCases,
  onSelectCase,
  onDismiss,
}: EscalationBannerProps) {
  if (!escalatedCases || escalatedCases.length === 0) return null;

  return (
    <div className="bg-[#17191F] border-3 border-[#FF4405] p-4 shadow-[4px_4px_0px_#FF4405] text-[#EDEAE2] mb-4 relative rounded-[2px]">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-[#FF4405] text-white border border-[#EDEAE2] rounded-[2px] shadow-[2px_2px_0px_#000000]">
            <ShieldAlert className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-display text-sm font-extrabold tracking-wider uppercase text-[#FF4405] flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 stroke-[2.5]" />
                AUTOMATED SLA ESCALATION ALERT
              </h3>
              <span className="font-mono text-[10px] font-extrabold bg-[#FF4405] text-white px-2 py-0.5 uppercase">
                {escalatedCases.length} TICKET(S) BREACHED SLA
              </span>
            </div>
            <p className="font-mono text-xs text-slate-300 mt-1">
              Case(s) exceeded the 60s demo SLA threshold (24hr production SLA) and automatically flipped to <strong className="text-[#FF4405] uppercase underline">ESCALATED</strong> state!
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {escalatedCases[0]?.id && (
            <button
              onClick={() => onSelectCase(escalatedCases[0].id)}
              className="btn-brutal-signal px-3.5 py-1.5 text-xs flex items-center gap-1"
            >
              <span>INSPECT ESCALATED TICKET</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          )}

          <button
            onClick={onDismiss}
            className="p-1.5 bg-[#0F1115] border border-[#2B2E37] text-slate-400 hover:text-white transition"
            title="Dismiss Alert"
          >
            <X className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>
      </div>
    </div>
  );
}
