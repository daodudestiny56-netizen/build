'use client';

import React, { useState, useEffect } from 'react';
import StampBadge from './StampBadge';
import {
  X,
  User,
  Mail,
  Clock,
  ShieldAlert,
  Send,
  Save,
  Activity,
  History,
  ChevronRight,
  Terminal,
} from 'lucide-react';

interface CaseDetailModalProps {
  caseId: string | null;
  onClose: () => void;
  onRefreshCases: () => void;
}

export default function CaseDetailModal({
  caseId,
  onClose,
  onRefreshCases,
}: CaseDetailModalProps) {
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Editable form fields
  const [draftResponse, setDraftResponse] = useState('');
  const [status, setStatus] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!caseId) return;
    fetchCaseDetail(caseId);
  }, [caseId]);

  const fetchCaseDetail = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/cases/${id}`);
      if (!res.ok) throw new Error('Failed to fetch case detail');
      const result = await res.json();
      setData(result);
      setDraftResponse(result.case.ai_draft_response || '');
      setStatus(result.case.status || 'new');
      setAssignedTo(result.case.assigned_to || 'General Support');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (newStatus?: string) => {
    if (!caseId) return;
    setSaving(true);
    setSaveMessage(null);

    const updatePayload: any = {
      ai_draft_response: draftResponse,
      status: newStatus || status,
      assigned_to: assignedTo,
    };

    try {
      const res = await fetch(`/api/cases/${caseId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatePayload),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Failed to update case');

      setSaveMessage('DISPATCH WORKBENCH UPDATED SUCCESSFULLY');
      if (newStatus) setStatus(newStatus);

      await fetchCaseDetail(caseId);
      onRefreshCases();
    } catch (err: any) {
      setSaveMessage(`ERROR: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  if (!caseId) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#0F1115]/90 backdrop-blur-sm flex items-center justify-end p-2 sm:p-4 overflow-y-auto">
      <div className="card-dispatch bg-[#17191F] border-2 border-[#EDEAE2] w-full max-w-4xl max-h-[92vh] flex flex-col shadow-[8px_8px_0px_#000000] overflow-hidden text-[#EDEAE2]">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-[#0F1115] border-b-2 border-[#EDEAE2] flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-[#17191F] border-2 border-[#EDEAE2] text-[#EDEAE2]">
              <Terminal className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="font-display text-base font-bold text-[#EDEAE2]">
                  CASE WORKBENCH // {caseId}
                </h2>
              </div>
              <p className="font-mono text-[10px] text-slate-400">
                CREATED: {data?.case ? new Date(data.case.created_at).toUTCString() : 'LOADING...'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {data?.case?.status && <StampBadge status={data.case.status} size="lg" />}
            <button
              onClick={onClose}
              className="p-1.5 bg-[#17191F] border-2 border-[#EDEAE2] text-[#EDEAE2] hover:bg-[#EDEAE2] hover:text-[#0F1115] transition"
            >
              <X className="w-5 h-5 stroke-[2.5]" />
            </button>
          </div>
        </div>

        {/* Modal Content Body */}
        {loading ? (
          <div className="p-12 text-center space-y-3 font-mono">
            <div className="w-8 h-8 border-4 border-[#EDEAE2] border-t-transparent animate-spin mx-auto rounded-none" />
            <p className="text-xs text-slate-400">LOADING DISPATCH DATA & AUDIT TRAIL...</p>
          </div>
        ) : error ? (
          <div className="p-6 font-mono text-center text-[#FF4405] text-xs">{error}</div>
        ) : data ? (
          <div className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1 font-mono text-xs">
            {/* Customer & Ticket Overview Card */}
            <div className="bg-[#0F1115] border-2 border-[#2B2E37] p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-[#2B2E37] pb-3">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-[#17191F] border border-[#EDEAE2] text-[#EDEAE2]">
                    <User className="w-4 h-4 stroke-[2.5]" />
                  </div>
                  <div>
                    <h3 className="font-display text-sm font-bold text-[#EDEAE2] uppercase">
                      {data.case.customer_name}
                    </h3>
                    <p className="font-mono text-[11px] text-slate-400 flex items-center gap-1">
                      <Mail className="w-3 h-3" /> {data.case.customer_email}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-500 block uppercase">
                    CRM HISTORY LINK:
                  </span>
                  <span className="font-mono text-xs font-bold text-[#3DDC97]">
                    {data.customer_history?.length || 1} TOTAL CASE(S)
                  </span>
                </div>
              </div>

              {/* Status & Priority Overview Badges */}
              <div className="flex flex-wrap items-center gap-2 text-xs pt-1 font-mono">
                <span className="text-slate-400 uppercase">CATEGORY:</span>
                <span className="px-2 py-0.5 font-bold uppercase bg-[#17191F] border border-[#EDEAE2] text-[#EDEAE2]">
                  {data.case.category}
                </span>

                <span className="text-slate-400 uppercase ml-2">URGENCY:</span>
                <span className="px-2 py-0.5 font-bold uppercase bg-[#17191F] border border-[#FF4405] text-[#FF4405]">
                  {data.case.urgency}
                </span>

                <span className="text-slate-400 uppercase ml-2">ASSIGNEE:</span>
                <span className="px-2 py-0.5 font-bold uppercase bg-[#17191F] border border-[#3DDC97] text-[#3DDC97]">
                  {data.case.assigned_to}
                </span>
              </div>
            </div>

            {/* Raw Customer Request Text */}
            <div className="space-y-1">
              <label className="font-mono text-[11px] font-bold text-[#EDEAE2] block uppercase">
                ORIGINAL SUBMITTED REQUEST TEXT:
              </label>
              <div className="bg-[#0F1115] border-2 border-[#2B2E37] p-3.5 text-xs text-[#EDEAE2] leading-relaxed font-mono italic">
                "{data.case.raw_request}"
              </div>
            </div>

            {/* AI Summary Card */}
            <div className="bg-[#0F1115] border-2 border-[#EDEAE2] p-3.5 space-y-1">
              <span className="font-mono text-[11px] font-bold text-[#3DDC97] block uppercase">
                AI TRIAGE SUMMARY STATEMENT:
              </span>
              <p className="font-mono text-xs text-[#EDEAE2]">{data.case.ai_summary}</p>
            </div>

            {/* Editable Draft Response Section */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="font-mono text-[11px] font-bold text-[#EDEAE2] uppercase">
                  EDITABLE DRAFT RESPONSE TEMPLATE:
                </label>
                <span className="text-[10px] text-slate-500 font-mono">
                  DISPATCH AGENT REFINEMENT
                </span>
              </div>
              <textarea
                value={draftResponse}
                onChange={(e) => setDraftResponse(e.target.value)}
                rows={4}
                className="w-full bg-[#0F1115] border-2 border-[#2B2E37] p-3 text-xs font-mono text-[#EDEAE2] focus:outline-none focus:border-[#EDEAE2] leading-relaxed resize-none rounded-[2px]"
              />
            </div>

            {/* Perforated Divider */}
            <div className="tear-line" />

            {/* Manual Override Controls */}
            <div className="bg-[#0F1115] border-2 border-[#2B2E37] p-4 space-y-4">
              <h4 className="font-display text-xs font-bold text-[#EDEAE2] uppercase tracking-wider flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-[#FF4405] stroke-[2.5]" /> DISPATCH AGENT
                MANUAL OVERRIDE CONTROLS
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1 uppercase">
                    ROUTE ASSIGNMENT:
                  </label>
                  <select
                    value={assignedTo}
                    onChange={(e) => setAssignedTo(e.target.value)}
                    className="w-full bg-[#17191F] border-2 border-[#2B2E37] text-[#EDEAE2] text-xs font-mono p-2.5 focus:outline-none focus:border-[#EDEAE2] rounded-[2px]"
                  >
                    <option value="Billing Team">Billing Team</option>
                    <option value="Technical Support">Technical Support</option>
                    <option value="Customer Success Lead">Customer Success Lead</option>
                    <option value="General Support">General Support</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1 uppercase">
                    LIFECYCLE STATUS:
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full bg-[#17191F] border-2 border-[#2B2E37] text-[#EDEAE2] text-xs font-mono p-2.5 focus:outline-none focus:border-[#EDEAE2] rounded-[2px]"
                  >
                    <option value="new">NEW</option>
                    <option value="in_progress">IN PROGRESS</option>
                    <option value="escalated">ESCALATED</option>
                    <option value="resolved">RESOLVED</option>
                  </select>
                </div>
              </div>

              {saveMessage && (
                <div className="p-2 bg-[#17191F] border-2 border-[#3DDC97] text-[#3DDC97] font-mono text-xs">
                  {saveMessage}
                </div>
              )}

              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#2B2E37]">
                <button
                  type="button"
                  onClick={() => handleUpdate()}
                  disabled={saving}
                  className="btn-brutal-dark px-3 py-1.5 text-xs flex items-center space-x-1.5"
                >
                  <Save className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>SAVE DRAFT & SETTINGS</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleUpdate('in_progress')}
                  disabled={saving}
                  className="btn-brutal px-3 py-1.5 text-xs flex items-center space-x-1.5"
                >
                  <Clock className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>MARK IN PROGRESS</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleUpdate('resolved')}
                  disabled={saving}
                  className="btn-brutal-signal px-3.5 py-1.5 text-xs flex items-center space-x-1.5"
                >
                  <Send className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>SEND RESPONSE & MARK RESOLVED</span>
                </button>
              </div>
            </div>

            {/* Audit Log Timeline */}
            <div className="space-y-2 pt-2 font-mono">
              <h4 className="font-display text-xs font-bold text-[#EDEAE2] uppercase tracking-wider flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-[#3DDC97] stroke-[2.5]" /> COMPLETE WORKFLOW AUDIT TRAIL
              </h4>
              <div className="bg-[#0F1115] border-2 border-[#2B2E37] p-3 space-y-2">
                {data.audit_trail?.map((log: any) => (
                  <div key={log.id} className="flex items-start space-x-2 text-[11px] border-b border-[#2B2E37] pb-2 last:border-b-0">
                    <ChevronRight className="w-3.5 h-3.5 text-[#3DDC97] shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#EDEAE2] uppercase">
                          {log.event.replace('_', ' ')}
                        </span>
                        <span className="text-[10px] text-slate-500">
                          {new Date(log.created_at).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-slate-400 text-[10px] mt-0.5">{log.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Customer History View */}
            {data.customer_history && data.customer_history.length > 1 && (
              <div className="space-y-2 pt-2 font-mono">
                <h4 className="font-display text-xs font-bold text-[#EDEAE2] uppercase tracking-wider flex items-center gap-1.5">
                  <History className="w-4 h-4 text-[#EDEAE2] stroke-[2.5]" /> CUSTOMER HISTORICAL TIMELINE ({data.case.customer_email})
                </h4>
                <div className="bg-[#0F1115] border-2 border-[#2B2E37] p-3 space-y-2">
                  {data.customer_history.map((histCase: any) => (
                    <div
                      key={histCase.id}
                      onClick={() => fetchCaseDetail(histCase.id)}
                      className={`p-2 border text-[11px] font-mono flex items-center justify-between cursor-pointer ${
                        histCase.id === caseId
                          ? 'bg-[#17191F] border-[#EDEAE2] text-white'
                          : 'bg-[#0F1115] border-[#2B2E37] text-slate-400 hover:border-[#EDEAE2]'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <span className="font-bold uppercase text-[#EDEAE2]">{histCase.category}</span>
                        <span className="truncate max-w-xs">{histCase.ai_summary}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="uppercase font-bold text-[#3DDC97]">{histCase.status}</span>
                        <span className="text-slate-500">
                          {new Date(histCase.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}
