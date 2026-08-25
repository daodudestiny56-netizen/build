'use client';

import React, { useState } from 'react';
import { Send, AlertCircle, CheckCircle2, User, Mail, MessageSquare, Ticket } from 'lucide-react';

interface IntakeFormProps {
  onSuccess: (data: any) => void;
}

export default function IntakeForm({ onSuccess }: IntakeFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [rawRequest, setRawRequest] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastSubmitted, setLastSubmitted] = useState<any | null>(null);

  // Preset demo cases (NO emojis)
  const applyPreset = (presetType: string) => {
    setError(null);
    switch (presetType) {
      case 'billing':
        setName('Sarah Jenkins');
        setEmail('s.jenkins@flowcore.io');
        setRawRequest('I was charged $299 twice on my invoice #FC-8821 for August services. Please issue an immediate refund for the duplicate charge.');
        break;
      case 'technical':
        setName('Alex Rivera');
        setEmail('alex.rivera@techfirm.org');
        setRawRequest('OUR PRODUCTION API IS DOWN! Getting 500 Internal Server Error on all auth endpoints since 14:00. High severity outage affecting 5000 users.');
        break;
      case 'complaint':
        setName('Marcus Vance');
        setEmail('m.vance@enterprise.com');
        setRawRequest('This is completely unacceptable! We have been waiting 4 days for onboarding support. My manager is furious and we will cancel our account and contact our legal team if not resolved today.');
        break;
      case 'repeat_customer':
        setName('Sarah Jenkins');
        setEmail('s.jenkins@flowcore.io');
        setRawRequest('Following up on my previous billing query — I also need an updated receipt for account compliance purposes.');
        break;
      case 'malformed':
        setName('  ');
        setEmail('invalid-email-format');
        setRawRequest('');
        break;
      default:
        break;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setLastSubmitted(null);

    try {
      const res = await fetch('/api/intake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, raw_request: rawRequest }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Submission failed');
      }

      setLastSubmitted(data);
      setRawRequest('');
      onSuccess(data);
    } catch (err: any) {
      setError(err.message || 'An error occurred during triage processing.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card-dispatch p-5 relative">
      {/* Ticket Header Stub */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 bg-[#EDEAE2] text-[#0F1115] border border-[#0F1115]">
            <Ticket className="w-4 h-4 stroke-[2.5]" />
          </div>
          <div>
            <h2 className="font-display text-sm font-bold uppercase tracking-wider text-[#EDEAE2]">
              TICKET INGESTION STUB
            </h2>
            <p className="font-mono text-[10px] text-slate-400">INPUT DISPATCH INTAKE FORM</p>
          </div>
        </div>

        <span className="font-mono text-[10px] font-bold bg-[#0F1115] border border-[#2B2E37] px-2 py-0.5 text-slate-300">
          DISPATCH // FORM
        </span>
      </div>

      {/* Preset Selectors */}
      <div className="bg-[#0F1115] p-3 border-2 border-[#2B2E37] mb-3">
        <div className="flex items-center justify-between mb-2">
          <span className="font-mono text-[11px] font-bold text-[#EDEAE2] uppercase">
            DEMO PRESET INGESTION:
          </span>
          <span className="font-mono text-[9px] text-slate-500">ONE-CLICK DEMO</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => applyPreset('billing')}
            className="px-2 py-1 font-mono text-[11px] font-bold bg-[#17191F] border border-[#EDEAE2] text-[#EDEAE2] hover:bg-[#EDEAE2] hover:text-[#0F1115] transition"
          >
            BILLING DISPUTE
          </button>
          <button
            type="button"
            onClick={() => applyPreset('technical')}
            className="px-2 py-1 font-mono text-[11px] font-bold bg-[#17191F] border border-[#FF4405] text-[#FF4405] hover:bg-[#FF4405] hover:text-white transition"
          >
            TECH OUTAGE [HIGH]
          </button>
          <button
            type="button"
            onClick={() => applyPreset('complaint')}
            className="px-2 py-1 font-mono text-[11px] font-bold bg-[#17191F] border border-[#FF4405] text-[#FF4405] hover:bg-[#FF4405] hover:text-white transition"
          >
            FURIOUS COMPLAINT
          </button>
          <button
            type="button"
            onClick={() => applyPreset('repeat_customer')}
            className="px-2 py-1 font-mono text-[11px] font-bold bg-[#17191F] border border-[#3DDC97] text-[#3DDC97] hover:bg-[#3DDC97] hover:text-[#0F1115] transition"
          >
            REPEAT CUSTOMER
          </button>
          <button
            type="button"
            onClick={() => applyPreset('malformed')}
            className="px-2 py-1 font-mono text-[11px] font-bold bg-[#17191F] border border-amber-500 text-amber-400 hover:bg-amber-500 hover:text-black transition"
          >
            MALFORMED INPUT TEST
          </button>
        </div>
      </div>

      {/* Perforated Divider */}
      <div className="tear-line" />

      {/* Intake Form */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block font-mono text-[11px] font-semibold text-slate-300 mb-1">
              CUSTOMER NAME:
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Sarah Jenkins"
              className="w-full bg-[#0F1115] border-2 border-[#2B2E37] px-3 py-2 text-xs font-mono text-[#EDEAE2] focus:outline-none focus:border-[#EDEAE2] rounded-[2px]"
            />
          </div>

          <div>
            <label className="block font-mono text-[11px] font-semibold text-slate-300 mb-1">
              CUSTOMER EMAIL:
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. s.jenkins@flowcore.io"
              className="w-full bg-[#0F1115] border-2 border-[#2B2E37] px-3 py-2 text-xs font-mono text-[#EDEAE2] focus:outline-none focus:border-[#EDEAE2] rounded-[2px]"
            />
          </div>
        </div>

        <div>
          <label className="block font-mono text-[11px] font-semibold text-slate-300 mb-1">
            REQUEST DETAILS / COMPLAINT TEXT:
          </label>
          <textarea
            value={rawRequest}
            onChange={(e) => setRawRequest(e.target.value)}
            rows={3}
            placeholder="Type customer message or complaint details..."
            className="w-full bg-[#0F1115] border-2 border-[#2B2E37] px-3 py-2 text-xs font-mono text-[#EDEAE2] focus:outline-none focus:border-[#EDEAE2] rounded-[2px] resize-none"
          />
        </div>

        {error && (
          <div className="p-3 bg-[#0F1115] border-2 border-[#FF4405] text-[#FF4405] font-mono text-xs space-y-1">
            <span className="font-bold block uppercase flex items-center gap-1">
              <AlertCircle className="w-4 h-4" /> INPUT VALIDATION / REJECTION:
            </span>
            <p>{error}</p>
          </div>
        )}

        {lastSubmitted && (
          <div className="p-3 bg-[#0F1115] border-2 border-[#3DDC97] font-mono text-xs space-y-1 text-[#3DDC97]">
            <div className="flex items-center justify-between font-bold">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> TICKET INGESTED AND CLASSIFIED
              </span>
              <span className="text-[10px] bg-[#17191F] px-1.5 py-0.5 border border-[#3DDC97]">
                ID: {lastSubmitted.case_id}
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px] pt-1 text-slate-300 border-t border-[#2B2E37]">
              <div>
                <span className="text-slate-500 block">CATEGORY:</span>
                <span className="font-bold text-[#EDEAE2] uppercase">{lastSubmitted.category}</span>
              </div>
              <div>
                <span className="text-slate-500 block">URGENCY:</span>
                <span className="font-bold text-[#EDEAE2] uppercase">{lastSubmitted.urgency}</span>
              </div>
              <div>
                <span className="text-slate-500 block">ASSIGNEE:</span>
                <span className="font-bold text-amber-400">{lastSubmitted.assigned_to}</span>
              </div>
              <div>
                <span className="text-slate-500 block">CRM DEDUP:</span>
                <span className="font-bold">{lastSubmitted.customer_is_existing ? 'LINKED' : 'NEW CREATED'}</span>
              </div>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full btn-brutal-signal py-3 px-4 flex items-center justify-center space-x-2 text-sm tracking-wider uppercase disabled:opacity-50"
        >
          {loading ? (
            <span className="font-mono text-xs animate-pulse">EXECUTING AI TRIAGE...</span>
          ) : (
            <>
              <Send className="w-4 h-4 stroke-[2.5]" />
              <span>INGEST & PROCESS TRIAGE</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
