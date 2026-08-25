'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Navbar from '@/components/Navbar';
import StatBar from '@/components/StatBar';
import FilterBar from '@/components/FilterBar';
import CaseCard from '@/components/CaseCard';
import EscalationBanner from '@/components/EscalationBanner';
import Link from 'next/link';
import { Inbox, Layers, PlusSquare, RefreshCw } from 'lucide-react';

export default function CasesQueuePage() {
  const [cases, setCases] = useState<any[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    open: 0,
    escalated: 0,
    resolved_today: 0,
    urgent: 0,
  });
  const [loading, setLoading] = useState(true);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [urgencyFilter, setUrgencyFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [escalatedAlerts, setEscalatedAlerts] = useState<any[]>([]);

  const fetchCases = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (urgencyFilter !== 'all') params.append('urgency', urgencyFilter);
      if (categoryFilter !== 'all') params.append('category', categoryFilter);
      if (searchQuery.trim()) params.append('search', searchQuery.trim());

      const res = await fetch(`/api/cases?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to load cases');

      const data = await res.json();
      setCases(data.cases || []);
      setStats(
        data.stats || {
          total: 0,
          open: 0,
          escalated: 0,
          resolved_today: 0,
          urgent: 0,
        }
      );
    } catch (err) {
      console.error('Error fetching cases:', err);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, urgencyFilter, categoryFilter, searchQuery]);

  useEffect(() => {
    fetchCases();
  }, [fetchCases]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setUrgencyFilter('all');
    setCategoryFilter('all');
  };

  return (
    <div className="min-h-screen bg-[#0F1115] text-[#EDEAE2] flex flex-col font-sans">
      <Navbar onManualRefresh={fetchCases} />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6">
        <EscalationBanner
          escalatedCases={escalatedAlerts}
          onSelectCase={(id) => (window.location.href = `/cases/${id}`)}
          onDismiss={() => setEscalatedAlerts([])}
        />

        {/* Page Header */}
        <div className="card-dispatch p-5 bg-[#17191F] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-[#17191F] border-2 border-[#EDEAE2] text-[#EDEAE2]">
              <Inbox className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <h1 className="font-display text-xl font-bold tracking-tight text-[#EDEAE2]">
                ALL SUPPORT CASES
              </h1>
              <p className="font-mono text-xs text-slate-400">
                Browse, search, and filter all customer support tickets managed by the system.
              </p>
            </div>
          </div>

          <Link href="/intake" className="btn-brutal-signal px-3.5 py-2 text-xs font-display flex items-center space-x-1.5">
            <PlusSquare className="w-4 h-4 stroke-[2.5]" />
            <span>SUBMIT NEW TICKET</span>
          </Link>
        </div>

        {/* Pipeline Statistics Bar */}
        <StatBar
          stats={stats}
          activeFilterStatus={statusFilter}
          onSelectFilterStatus={(status) => setStatusFilter(status)}
        />

        {/* Filter Bar */}
        <FilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          urgencyFilter={urgencyFilter}
          onUrgencyChange={setUrgencyFilter}
          categoryFilter={categoryFilter}
          onCategoryChange={setCategoryFilter}
          onReset={handleResetFilters}
        />

        {/* Case List Feed */}
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 px-1">
            <span className="font-bold text-[#EDEAE2] uppercase flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-[#3DDC97] stroke-[2.5]" />
              DISPATCH FEED [{cases.length} MATCHING]
            </span>

            {loading && (
              <span className="flex items-center gap-1 text-[#3DDC97] animate-pulse">
                <RefreshCw className="w-3 h-3 animate-spin stroke-[2.5]" /> SYNCING...
              </span>
            )}
          </div>

          {cases.length === 0 ? (
            <div className="card-dispatch p-12 text-center space-y-3 font-mono">
              <Inbox className="w-10 h-10 text-slate-600 mx-auto stroke-[2]" />
              <h3 className="text-sm font-bold uppercase text-[#EDEAE2]">NO TICKETS MATCH FILTERS</h3>
              <button
                onClick={handleResetFilters}
                className="btn-brutal-dark px-3 py-1.5 text-xs font-display"
              >
                RESET QUEUE FILTERS
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {cases.map((item) => (
                <CaseCard
                  key={item.id}
                  item={item}
                  onSelectCase={(id) => (window.location.href = `/cases/${id}`)}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
