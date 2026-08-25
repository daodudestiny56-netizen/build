'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { Users, Mail, Clock, ArrowRight, UserCheck, Inbox } from 'lucide-react';

export default function CustomersDirectoryPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const res = await fetch('/api/customers');
      if (!res.ok) throw new Error('Failed to fetch customers');
      const data = await res.json();
      setCustomers(data.customers || []);
    } catch (err) {
      console.error('Error fetching customers:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0F1115] text-[#EDEAE2] flex flex-col font-sans">
      <Navbar onManualRefresh={fetchCustomers} />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6">
        {/* Header Stub */}
        <div className="card-dispatch p-5 bg-[#17191F] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-[#3DDC97] text-[#0F1115] border-2 border-[#EDEAE2]">
              <Users className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <h1 className="font-display text-xl font-bold tracking-tight text-[#EDEAE2]">
                EMBEDDED CRM // CUSTOMER DIRECTORY
              </h1>
              <p className="font-mono text-xs text-slate-400">
                Deduplicated customer profiles &amp; historical ticket relationship timeline
              </p>
            </div>
          </div>

          <div className="w-full sm:w-64 font-mono text-xs">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="SEARCH CUSTOMERS..."
              className="w-full bg-[#0F1115] border-2 border-[#2B2E37] px-3 py-2 text-xs text-[#EDEAE2] focus:outline-none focus:border-[#EDEAE2] rounded-[2px]"
            />
          </div>
        </div>

        {/* Customer Profiles Feed */}
        {loading ? (
          <div className="card-dispatch p-12 text-center font-mono text-xs">
            <div className="w-8 h-8 border-4 border-[#EDEAE2] border-t-transparent animate-spin mx-auto mb-2" />
            <span>LOADING CUSTOMER CRM DIRECTORY...</span>
          </div>
        ) : filteredCustomers.length === 0 ? (
          <div className="card-dispatch p-12 text-center font-mono text-xs space-y-2">
            <Inbox className="w-8 h-8 text-slate-600 mx-auto" />
            <p>NO CUSTOMER RECORDS MATCH SEARCH</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredCustomers.map((cust) => (
              <div key={cust.id} className="card-dispatch p-4 space-y-3 font-mono">
                {/* Profile Header */}
                <div className="flex items-start justify-between border-b-2 border-[#2B2E37] pb-3">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="p-1 bg-[#0F1115] border border-[#EDEAE2] text-[#3DDC97]">
                        <UserCheck className="w-4 h-4 stroke-[2.5]" />
                      </span>
                      <h3 className="font-display text-base font-bold text-[#EDEAE2] uppercase">
                        {cust.name}
                      </h3>
                    </div>
                    <p className="text-xs text-slate-400 flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5" /> {cust.email}
                    </p>
                  </div>

                  <div className="text-right text-[11px]">
                    <span className="font-bold text-[#3DDC97] block">
                      {cust.total_cases} TOTAL CASE(S)
                    </span>
                    <span className="text-slate-500 flex items-center gap-1 text-[10px]">
                      <Clock className="w-3 h-3" /> SINCE {new Date(cust.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Case Stats Breakdown */}
                <div className="grid grid-cols-3 gap-2 text-[11px] text-center bg-[#0F1115] p-2 border border-[#2B2E37]">
                  <div>
                    <span className="text-slate-500 block text-[10px]">OPEN QUEUE:</span>
                    <span className="font-bold text-[#EDEAE2]">{cust.open_cases || 0}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">ESCALATED:</span>
                    <span className="font-bold text-[#FF4405]">{cust.escalated_cases || 0}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">RESOLVED:</span>
                    <span className="font-bold text-[#3DDC97]">{cust.resolved_cases || 0}</span>
                  </div>
                </div>

                {/* Case History Timeline */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">
                    CUSTOMER TICKET HISTORY:
                  </span>
                  <div className="space-y-1 max-h-40 overflow-y-auto pr-1">
                    {cust.cases?.map((c: any) => (
                      <Link
                        key={c.id}
                        href={`/cases/${c.id}`}
                        className="p-2 bg-[#0F1115] border border-[#2B2E37] hover:border-[#EDEAE2] flex items-center justify-between text-[11px] transition block"
                      >
                        <div className="flex items-center space-x-2 truncate">
                          <span className="font-bold text-[#EDEAE2] uppercase">{c.category}</span>
                          <span className="text-slate-400 truncate">{c.ai_summary}</span>
                        </div>

                        <div className="flex items-center space-x-1.5 shrink-0">
                          <span className="text-[10px] font-bold uppercase text-[#3DDC97]">{c.status}</span>
                          <ArrowRight className="w-3 h-3 text-slate-400 stroke-[2.5]" />
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
