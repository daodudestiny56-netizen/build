'use client';

import React from 'react';
import StampBadge from './StampBadge';
import { Clock, User, ArrowRight, ShieldAlert } from 'lucide-react';

interface CaseCardProps {
  item: any;
  onSelectCase: (caseId: string) => void;
}

export default function CaseCard({ item, onSelectCase }: CaseCardProps) {
  const isEscalated = item.status === 'escalated';
  const isUrgent = Boolean(item.is_urgent_flag) || item.urgency === 'high';

  // Formatted creation time
  const timeAgo = (dateStr: string) => {
    try {
      const created = new Date(dateStr);
      const diffMs = Date.now() - created.getTime();
      const diffSec = Math.floor(diffMs / 1000);
      if (diffSec < 60) return `${diffSec}S AGO`;
      const diffMin = Math.floor(diffSec / 60);
      if (diffMin < 60) return `${diffMin}M AGO`;
      const diffHr = Math.floor(diffMin / 60);
      return `${diffHr}H AGO`;
    } catch {
      return dateStr;
    }
  };

  return (
    <div
      onClick={() => onSelectCase(item.id)}
      className={`group card-dispatch ${
        isEscalated ? 'card-dispatch-signal ring-2 ring-[#FF4405]' : ''
      } p-4 transition-all cursor-pointer animate-ticket-print hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_#000000] relative overflow-hidden`}
    >
      {/* Top Bar: Ticket ID, Rubber-Stamp Status Badge, Category & Urgency */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex flex-col space-y-1">
          <div className="flex items-center space-x-2">
            <span className="font-mono text-xs font-bold text-[#EDEAE2] bg-[#0F1115] px-2 py-0.5 border border-[#2B2E37]">
              TICKET // {item.id}
            </span>

            <span className="font-mono text-[10px] font-bold uppercase bg-[#0F1115] text-slate-300 px-2 py-0.5 border border-[#2B2E37]">
              {item.category}
            </span>

            {isUrgent && (
              <span className="font-mono text-[10px] font-extrabold uppercase bg-[#FF4405] text-white px-2 py-0.5 border border-[#EDEAE2] flex items-center gap-1 shadow-[2px_2px_0px_#000000]">
                <ShieldAlert className="w-3 h-3 stroke-[2.5]" /> URGENT FLAG
              </span>
            )}
          </div>
        </div>

        {/* Rubber-Stamp Status Badge */}
        <div>
          <StampBadge status={item.status} size="md" />
        </div>
      </div>

      {/* AI Summary Header */}
      <div className="mt-2">
        <h3 className="font-display text-sm font-bold text-[#EDEAE2] group-hover:text-[#3DDC97] transition leading-snug">
          {item.ai_summary || item.raw_request}
        </h3>
      </div>

      {/* Dashed Perforated Tear-Line Divider */}
      <div className="tear-line" />

      {/* Quoted Raw Request Stub */}
      <div className="bg-[#0F1115] p-2.5 border border-[#2B2E37] text-xs font-mono text-slate-300 line-clamp-2 italic">
        "{item.raw_request}"
      </div>

      {/* Footer Info & Route Assignee */}
      <div className="mt-3 pt-2 border-t border-[#2B2E37] flex items-center justify-between font-mono text-xs text-slate-400">
        <div className="flex items-center space-x-2">
          <span className="flex items-center gap-1 font-semibold text-[#EDEAE2]">
            <User className="w-3.5 h-3.5 text-slate-400 stroke-[2.5]" />
            {item.customer_name}
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-[#3DDC97] font-bold text-[11px] uppercase">
            ASSIGNED: {item.assigned_to}
          </span>
        </div>

        <div className="flex items-center space-x-2 text-[11px]">
          <span className="flex items-center gap-1 text-slate-400 font-mono">
            <Clock className="w-3 h-3 text-slate-500 stroke-[2.5]" /> {timeAgo(item.created_at)}
          </span>
          <ArrowRight className="w-4 h-4 text-[#EDEAE2] group-hover:translate-x-1 transition stroke-[2.5]" />
        </div>
      </div>
    </div>
  );
}
