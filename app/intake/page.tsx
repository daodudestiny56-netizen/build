'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import IntakeForm from '@/components/IntakeForm';
import Link from 'next/link';
import { PlusSquare, ArrowRight, Ticket } from 'lucide-react';

export default function IntakePage() {
  const [createdCases, setCreatedCases] = useState<any[]>([]);

  const handleIntakeSuccess = (data: any) => {
    setCreatedCases((prev) => [data, ...prev]);
  };

  return (
    <div className="min-h-screen bg-[#0F1115] text-[#EDEAE2] flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 space-y-6">
        {/* Header Stub */}
        <div className="card-dispatch p-5 bg-[#17191F]">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-[#FF4405] text-white border border-[#EDEAE2]">
              <PlusSquare className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <h1 className="font-display text-xl font-bold tracking-tight text-[#EDEAE2]">
                SIMULATE TICKET INTAKE
              </h1>
              <p className="font-mono text-xs text-slate-400">
                Submit customer requests to test how AI instantly analyzes, categorizes, and assigns SLA targets.
              </p>
            </div>
          </div>
        </div>

        {/* Intake Form Component */}
        <IntakeForm onSuccess={handleIntakeSuccess} />

        {/* Recently Ingested Tickets List */}
        {createdCases.length > 0 && (
          <div className="card-dispatch p-4 space-y-3 font-mono">
            <h3 className="font-display text-sm font-bold text-[#3DDC97] uppercase flex items-center gap-2">
              <Ticket className="w-4 h-4 stroke-[2.5]" /> RECENTLY INGESTED TICKETS THIS SESSION
            </h3>
            <div className="space-y-2">
              {createdCases.map((c) => (
                <div
                  key={c.case_id}
                  className="p-3 bg-[#0F1115] border-2 border-[#2B2E37] flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-bold text-[#EDEAE2]">{c.case_id}</span>
                    <span className="text-slate-400 ml-2">CATEGORY: {c.category}</span>
                    <span className="text-amber-400 ml-2">ROUTED: {c.assigned_to}</span>
                  </div>

                  <Link
                    href={`/cases/${c.case_id}`}
                    className="btn-brutal px-3 py-1 text-[11px] font-display flex items-center gap-1"
                  >
                    <span>OPEN WORKBENCH</span>
                    <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
