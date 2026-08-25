'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import IntakeForm from '@/components/IntakeForm';
import StatBar from '@/components/StatBar';
import FilterBar from '@/components/FilterBar';
import CaseCard from '@/components/CaseCard';
import CaseDetailModal from '@/components/CaseDetailModal';
import EscalationBanner from '@/components/EscalationBanner';
import SubmissionDeliverablesModal from '@/components/SubmissionDeliverablesModal';
import {
  Layers,
  RefreshCw,
  Inbox,
  ShieldCheck,
  Sparkles,
  HelpCircle,
  X,
  ArrowRight,
  PlusSquare,
  FileText,
} from 'lucide-react';

export default function DispatchPage() {
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

  // Modals & Banner state
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
  const [escalatedAlerts, setEscalatedAlerts] = useState<any[]>([]);
  const [isPollingActive, setIsPollingActive] = useState(true);
  const [showDeliverables, setShowDeliverables] = useState(false);
  const [showWelcomeBanner, setShowWelcomeBanner] = useState(true);
  const [lastCheckTime, setLastCheckTime] = useState<string | null>(null);

  // Fetch Cases from API
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

  // Initial Seed & Load
  useEffect(() => {
    const seedAndLoad = async () => {
      const checkRes = await fetch('/api/cases');
      const checkData = await checkRes.json();

      if (checkData.cases && checkData.cases.length === 0) {
        // Seed initial demo cases
        await fetch('/api/intake', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: 'Sarah Jenkins',
            email: 's.jenkins@flowcore.io',
            raw_request:
              'I was charged $299 twice on my invoice #FC-8821 for August services. Please issue an immediate refund for the duplicate charge.',
          }),
        });

        await fetch('/api/intake', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: 'Alex Rivera',
            email: 'alex.rivera@techfirm.org',
            raw_request:
              'OUR PRODUCTION API IS DOWN! Getting 500 Internal Server Error on all auth endpoints since 14:00. High severity outage affecting 5000 users.',
          }),
        });

        await fetch('/api/intake', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: 'Marcus Vance',
            email: 'm.vance@enterprise.com',
            raw_request:
              'This is completely unacceptable! We have been waiting 4 days for onboarding support. My manager is furious and we will cancel our account and contact our legal team if not resolved today.',
          }),
        });
      }

      fetchCases();
    };

    seedAndLoad();
  }, [fetchCases]);

  // Polling Daemon for SLA Escalation Check (Every 5 seconds)
  useEffect(() => {
    if (!isPollingActive) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch('/api/escalate-check', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ threshold_seconds: 60 }),
        });

        const data = await res.json();
        setLastCheckTime(new Date().toLocaleTimeString());

        if (data.newly_escalated_count > 0) {
          setEscalatedAlerts((prev) => [...data.newly_escalated, ...prev]);
          fetchCases(); // Refresh dashboard list
        }
      } catch (err) {
        console.error('Escalation check error:', err);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [isPollingActive, fetchCases]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setUrgencyFilter('all');
    setCategoryFilter('all');
  };

  const handleIntakeSuccess = () => {
    fetchCases();
  };

  return (
    <div className="min-h-screen bg-[#0F1115] text-[#EDEAE2] flex flex-col font-sans selection:bg-[#FF4405] selection:text-white">
      {/* Top Navigation */}
      <Navbar
        onOpenDeliverables={() => setShowDeliverables(true)}
        isPollingActive={isPollingActive}
        onTogglePolling={() => setIsPollingActive(!isPollingActive)}
        lastEscalateCheckTime={lastCheckTime}
        onManualRefresh={fetchCases}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6">
        {/* Welcome & Quick Start Banner for New Users */}
        {showWelcomeBanner && (
          <div className="bg-[#16181E] border-3 border-[#F4F0EA] p-4 sm:p-5 shadow-[5px_5px_0px_#000000] relative space-y-3 animate-fadeIn">
            <div className="flex items-start justify-between gap-4 border-b border-[#262933] pb-3">
              <div className="flex items-center space-x-2.5">
                <div className="p-1.5 bg-[#FF3B00] text-white border border-[#F4F0EA]">
                  <Sparkles className="w-5 h-5 stroke-[2.5]" />
                </div>
                <div>
                  <h2 className="font-display font-bold text-base uppercase text-[#F4F0EA] tracking-wide">
                    Welcome to TRIAGE 3D
                  </h2>
                  <p className="font-mono text-xs text-slate-300">
                    AI-powered customer support triage &amp; real-time SLA escalation daemon.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowWelcomeBanner(false)}
                className="btn-3d-dark p-1"
                title="Dismiss Guide Banner"
              >
                <X className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>

            <p className="font-mono text-xs text-slate-300 leading-relaxed">
              New here? Use the form on the left to submit test customer tickets, or watch the daemon automatically escalate overdue tickets in real-time.
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-1 font-mono text-xs">
              <Link
                href="/"
                className="btn-3d-dark px-3 py-1.5 flex items-center space-x-1.5 text-[#00E5FF]"
              >
                <HelpCircle className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Read System Guide</span>
              </Link>
              <button
                onClick={() => setShowDeliverables(true)}
                className="btn-3d px-3 py-1.5 flex items-center space-x-1.5 bg-[#FFD600] text-[#0D0E12] border-[#F4F0EA]"
              >
                <FileText className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>View Hackathon Deliverables</span>
              </button>
            </div>
          </div>
        )}

        {/* Escalation Alert Banner */}
        <EscalationBanner
          escalatedCases={escalatedAlerts}
          onSelectCase={(id) => setSelectedCaseId(id)}
          onDismiss={() => setEscalatedAlerts([])}
        />

        {/* Pipeline Statistics Bar */}
        <StatBar
          stats={stats}
          activeFilterStatus={statusFilter}
          onSelectFilterStatus={(status) => setStatusFilter(status)}
        />

        {/* Main Grid: Left Side Intake Form, Right Side Dashboard Feed */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Intake Simulation Form */}
          <div className="lg:col-span-5 space-y-4">
            <IntakeForm onSuccess={handleIntakeSuccess} />
          </div>

          {/* Right Column: Case Dashboard Feed */}
          <div className="lg:col-span-7 space-y-4">
            {/* Filter & Search Bar */}
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

            {/* Cases Feed Header */}
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 px-1">
              <span className="font-bold text-[#EDEAE2] uppercase flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-[#3DDC97] stroke-[2.5]" />
                DISPATCH FEED QUEUE [{cases.length}]
              </span>

              {loading && (
                <span className="flex items-center gap-1 text-[#3DDC97] animate-pulse">
                  <RefreshCw className="w-3 h-3 animate-spin stroke-[2.5]" /> SYNCING DISPATCH...
                </span>
              )}
            </div>

            {/* Cases Card List */}
            {cases.length === 0 ? (
              <div className="card-dispatch p-12 text-center space-y-3 font-mono">
                <Inbox className="w-10 h-10 text-slate-600 mx-auto stroke-[2]" />
                <h3 className="text-sm font-bold uppercase text-[#EDEAE2]">NO TICKETS IN QUEUE</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  No tickets match current filters. Submit a new customer request using the intake stub on the left.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="btn-brutal-dark px-3 py-1.5 text-xs font-display"
                >
                  RESET QUEUE FILTERS
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {cases.map((item) => (
                  <CaseCard
                    key={item.id}
                    item={item}
                    onSelectCase={(id) => setSelectedCaseId(id)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Case Detail Modal / Workbench */}
      <CaseDetailModal
        caseId={selectedCaseId}
        onClose={() => setSelectedCaseId(null)}
        onRefreshCases={fetchCases}
      />

      {/* Submission Deliverables Modal */}
      <SubmissionDeliverablesModal
        isOpen={showDeliverables}
        onClose={() => setShowDeliverables(false)}
      />

      {/* Footer */}
      <footer className="border-t-2 border-[#2B2E37] bg-[#0F1115] py-4 text-center text-xs font-mono text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between px-4 gap-2">
          <span>TRIAGE // AI WORKFLOW DISPATCH BOARD · AI BUILDFEST 2026</span>
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-4 h-4 text-[#3DDC97] stroke-[2.5]" /> EMBEDDED CRM &amp; SLA ESCALATION DAEMON
          </span>
        </div>
      </footer>
    </div>
  );
}
