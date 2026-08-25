'use client';

import React, { useState } from 'react';
import { Send, AlertCircle, CheckCircle2, Ticket } from 'lucide-react';

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

  // Preset demo cases
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
    <div className="card-3d p-4 sm:p-5 relative">
      {/* Ticket Header Stub */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 bg-[#F4F0EA] text-[#0D0E12] border-2 border-[#0D0E12]">
            <Ticket className="w-4 h-4 stroke-[2.5]" />
          </div>
          <div>
            <h2 className="font-display text-sm font-bold uppercase tracking-wider text-[#F4F0EA]">
              SUBMIT SUPPORT TICKET
            </h2>
            <p className="font-mono text-[10px] text-slate-400">TEST AI TRIAGE WITH CUSTOM OR PRESET MESSAGES</p>
          </div>
        </div>

        <span className="font-mono text-[10px] font-bold bg-[#0D0E12] border-2 border-[#262933] px-2 py-0.5 text-slate-300">
          INTAKE FORM
        </span>
      </div>

      {/* Preset Selectors */}
      <div className="bg-[#0D0E12] p-3 border-2 border-[#262933] mb-3 space-y-2">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[11px] font-bold text-[#F4F0EA] uppercase">
            CHOOSE A PRESET EXAMPLE:
          </span>
          <span className="font-mono text-[9px] text-[#00E676] font-bold">1-CLICK SAMPLE</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => applyPreset('billing')}
            className="btn-3d-dark px-2.5 py-1 text-[11px] font-mono"
          >
            BILLING DISPUTE
          </button>
          <button
            type="button"
            onClick={() => applyPreset('technical')}
            className="btn-3d-signal px-2.5 py-1 text-[11px] font-mono"
          >
            TECH OUTAGE [HIGH]
          </button>
          <button
            type="button"
            onClick={() => applyPreset('complaint')}
            className="btn-3d-signal px-2.5 py-1 text-[11px] font-mono"
          >
            FURIOUS COMPLAINT
          </button>
          <button
            type="button"
            onClick={() => applyPreset('repeat_customer')}
            className="btn-3d px-2.5 py-1 text-[11px] font-mono"
          >
            REPEAT CUSTOMER
          </button>
          <button
            type="button"
            onClick={() => applyPreset('malformed')}
            className="btn-3d-yellow px-2.5 py-1 text-[11px] font-mono"
          >
            MALFORMED TEST
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
              className="w-full bg-[#0D0E12] border-2 border-[#262933] px-3 py-2 text-xs font-mono text-[#F4F0EA] focus:outline-none focus:border-[#F4F0EA] rounded-[2px]"
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
              className="w-full bg-[#0D0E12] border-2 border-[#262933] px-3 py-2 text-xs font-mono text-[#F4F0EA] focus:outline-none focus:border-[#F4F0EA] rounded-[2px]"
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
            className="w-full bg-[#0D0E12] border-2 border-[#262933] px-3 py-2 text-xs font-mono text-[#F4F0EA] focus:outline-none focus:border-[#F4F0EA] rounded-[2px] resize-none"
          />
        </div>

        {error && (
          <div className="p-3 bg-[#0D0E12] border-2 border-[#FF3B00] text-[#FF3B00] font-mono text-xs space-y-1">
            <span className="font-bold block uppercase flex items-center gap-1">
              <AlertCircle className="w-4 h-4 stroke-[2.5]" /> INPUT VALIDATION / REJECTION:
            </span>
            <p>{error}</p>
          </div>
        )}

        {lastSubmitted && (
          <div className="p-3 bg-[#0D0E12] border-2 border-[#00E676] font-mono text-xs space-y-1 text-[#00E676]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between font-bold gap-1">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 stroke-[2.5]" /> TICKET INGESTED &amp; CLASSIFIED
              </span>
              <span className="text-[10px] bg-[#16181E] px-1.5 py-0.5 border border-[#00E676]">
                ID: {lastSubmitted.case_id}
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px] pt-1 text-slate-300 border-t border-[#262933]">
              <div>
                <span className="text-slate-500 block">CATEGORY:</span>
                <span className="font-bold text-[#F4F0EA] uppercase">{lastSubmitted.category}</span>
              </div>
              <div>
                <span className="text-slate-500 block">URGENCY:</span>
                <span className="font-bold text-[#FF3B00] uppercase">{lastSubmitted.urgency}</span>
              </div>
              <div>
                <span className="text-slate-500 block">ASSIGNEE:</span>
                <span className="font-bold text-[#FFD600]">{lastSubmitted.assigned_to}</span>
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
          className="w-full btn-3d-signal py-3 px-4 flex items-center justify-center space-x-2 text-sm tracking-wider uppercase disabled:opacity-50"
        >
          {loading ? (
            <span className="font-mono text-xs animate-pulse">EXECUTING AI TRIAGE...</span>
          ) : (
            <>
              <Send className="w-4 h-4 stroke-[2.5]" />
              <span>INGEST &amp; PROCESS TRIAGE</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
